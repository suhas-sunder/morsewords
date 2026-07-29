import { expect, test, type Page, type Request } from "@playwright/test";
import { gunzipSync } from "node:zlib";

import { waitForRouteReady } from "./helpers";

const POSTHOG_TOKEN = "phc_bM7udiE9SpQQnyERjIjmXBMGHaaesURgTEfdjLD0GBZ";
const POSTHOG_HOST = "us.i.posthog.com";
const LEGACY_CONSENT_KEY = `__ph_opt_in_out_${POSTHOG_TOKEN}`;
const LEGACY_PERSISTENCE_KEY = `ph_${POSTHOG_TOKEN}_posthog`;

type CapturedPostHogEvent = {
  event?: string;
  properties?: Record<string, unknown>;
  [key: string]: unknown;
};

function parsePostHogBody(request: Request): CapturedPostHogEvent[] {
  const rawBody = request.postDataBuffer();
  if (!rawBody?.length) return [];

  let body = rawBody;
  if (body[0] === 0x1f && body[1] === 0x8b) {
    body = gunzipSync(body);
  }

  let text = body.toString("utf8");
  if (text.startsWith("data=")) {
    text = decodeURIComponent(new URLSearchParams(text).get("data") ?? "");
  }

  const parsed = JSON.parse(text) as
    | CapturedPostHogEvent
    | CapturedPostHogEvent[];
  return Array.isArray(parsed) ? parsed : [parsed];
}

async function interceptPostHog(page: Page) {
  const events: CapturedPostHogEvent[] = [];
  const requests: string[] = [];

  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const isLocal =
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "::1";

    if (url.hostname === POSTHOG_HOST) {
      requests.push(`${request.method()} ${url.pathname}`);
      if (request.method() === "POST") {
        events.push(...parsePostHogBody(request));
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "{}",
      });
      return;
    }

    if (!isLocal && (url.protocol === "http:" || url.protocol === "https:")) {
      await route.abort("blockedbyclient");
      return;
    }

    await route.continue();
  });

  return { events, requests };
}

function postHogStorageNames(names: string[]) {
  return names.filter(
    (name) =>
      name === LEGACY_CONSENT_KEY ||
      name.startsWith(LEGACY_PERSISTENCE_KEY),
  );
}

test.describe("cookieless PostHog analytics", () => {
  test.use({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
  });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window.Navigator.prototype, "webdriver", {
        configurable: true,
        get: () => false,
      });
      Object.defineProperty(window.Navigator.prototype, "userAgentData", {
        configurable: true,
        get: () => ({
          brands: [
            { brand: "Chromium", version: "147" },
            { brand: "Google Chrome", version: "147" },
          ],
          mobile: false,
          platform: "Windows",
        }),
      });
    });
  });

  test("uses no PostHog browser storage and removes the legacy consent state", async ({
    page,
  }) => {
    await interceptPostHog(page);
    await page.addInitScript(
      ({ consentKey, persistenceKey }) => {
        window.localStorage.setItem(consentKey, "1");
        window.localStorage.setItem(persistenceKey, '{"distinct_id":"legacy"}');
        window.sessionStorage.setItem(consentKey, "1");
        window.sessionStorage.setItem(
          persistenceKey,
          '{"distinct_id":"legacy"}',
        );
        document.cookie = `${consentKey}=1; Path=/; SameSite=Lax`;
        document.cookie = `${persistenceKey}=legacy; Path=/; SameSite=Lax`;
      },
      {
        consentKey: LEGACY_CONSENT_KEY,
        persistenceKey: LEGACY_PERSISTENCE_KEY,
      },
    );

    await page.goto("/audio", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await page.waitForFunction(
      () =>
        typeof (
          window as unknown as {
            posthog?: { capture?: unknown };
          }
        ).posthog?.capture === "function",
    );

    await expect
      .poll(async () =>
        page.evaluate(
          ({ consentKey, persistenceKey }) => ({
            localConsent: window.localStorage.getItem(consentKey),
            localPersistence: window.localStorage.getItem(persistenceKey),
            sessionConsent: window.sessionStorage.getItem(consentKey),
            sessionPersistence:
              window.sessionStorage.getItem(persistenceKey),
            cookies: document.cookie,
          }),
          {
            consentKey: LEGACY_CONSENT_KEY,
            persistenceKey: LEGACY_PERSISTENCE_KEY,
          },
        ),
      )
      .toMatchObject({
        localConsent: null,
        localPersistence: null,
        sessionConsent: null,
        sessionPersistence: null,
      });

    const storage = await page.evaluate(async () => ({
      local: Object.keys(window.localStorage),
      session: Object.keys(window.sessionStorage),
      indexedDb: (await indexedDB.databases())
        .map((database) => database.name)
        .filter((name): name is string => Boolean(name)),
    }));
    const cookieNames = (await page.context().cookies()).map(
      (cookie) => cookie.name,
    );

    expect(postHogStorageNames(storage.local)).toEqual([]);
    expect(postHogStorageNames(storage.session)).toEqual([]);
    expect(postHogStorageNames(cookieNames)).toEqual([]);
    expect(cookieNames).toContain("morsewords-theme");
    expect(
      storage.indexedDb.filter((name) => /posthog|^ph_/i.test(name)),
    ).toEqual([]);
    await expect(
      page.locator('script[src*="pagead2.googlesyndication.com"]'),
    ).toHaveCount(1);

    await expect(
      page.locator(
        "[data-posthog-consent], [data-analytics-consent], [data-posthog-banner]",
      ),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", {
        name: /accept analytics|allow analytics|opt in to analytics/i,
      }),
    ).toHaveCount(0);
  });

  test("keeps every optional PostHog collection feature disabled", async ({
    page,
  }) => {
    await interceptPostHog(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const config = await page.evaluate(async () => {
      await new Promise<void>((resolve, reject) => {
        const started = Date.now();
        const timer = window.setInterval(() => {
          const posthog = (
            window as unknown as {
              posthog?: { config?: Record<string, unknown> };
            }
          ).posthog;
          if (posthog?.config) {
            window.clearInterval(timer);
            resolve();
          } else if (Date.now() - started > 10_000) {
            window.clearInterval(timer);
            reject(new Error("PostHog did not initialize"));
          }
        }, 25);
      });

      return (
        window as unknown as {
          posthog: { config: Record<string, unknown> };
        }
      ).posthog.config;
    });

    expect(config).toMatchObject({
      cookieless_mode: "always",
      persistence: "memory",
      disable_persistence: true,
      save_campaign_params: false,
      save_referrer: false,
      person_profiles: "never",
      capture_pageview: false,
      capture_pageleave: false,
      autocapture: false,
      rageclick: false,
      capture_dead_clicks: false,
      capture_exceptions: false,
      capture_heatmaps: false,
      capture_performance: false,
      disable_session_recording: true,
      enable_recording_console_log: false,
      disable_surveys: true,
      disable_surveys_automatic_display: true,
      disable_web_experiments: true,
      disable_external_dependency_loading: true,
      advanced_disable_flags: true,
      advanced_disable_feature_flags: true,
    });
  });

  test("sends one private pageview for direct, client, Back, and Forward navigation", async ({
    page,
  }) => {
    const analytics = await interceptPostHog(page);
    const sensitiveQueryValue = "TOP_SECRET_MORSE_VALUE";
    const sensitiveFragment = "private-fragment";

    await page.goto(
      `/audio?message=${sensitiveQueryValue}#${sensitiveFragment}`,
      { waitUntil: "domcontentloaded" },
    );
    await waitForRouteReady(page);
    await page.waitForFunction(
      () =>
        typeof (
          window as unknown as {
            posthog?: { capture?: unknown };
          }
        ).posthog?.capture === "function",
    );
    expect(
      await page.evaluate(
        () =>
          (
            window as unknown as {
              posthog: { _is_bot: () => boolean };
            }
          ).posthog._is_bot(),
      ),
    ).toBe(false);
    await expect
      .poll(() => analytics.events.filter((event) => event.event === "$pageview").length)
      .toBe(1);

    await page.locator('nav a[href="/practice"]:visible').first().click();
    await expect(page).toHaveURL(/\/practice$/);
    await expect
      .poll(() => analytics.events.filter((event) => event.event === "$pageview").length)
      .toBe(2);

    await page.goBack();
    await expect(page).toHaveURL(
      new RegExp(
        `/audio\\?message=${sensitiveQueryValue}#${sensitiveFragment}$`,
      ),
    );
    await expect
      .poll(() => analytics.events.filter((event) => event.event === "$pageview").length)
      .toBe(3);

    await page.goForward();
    await expect(page).toHaveURL(/\/practice$/);
    await expect
      .poll(() => analytics.events.filter((event) => event.event === "$pageview").length)
      .toBe(4);

    await page.waitForTimeout(750);
    const pageviews = analytics.events.filter(
      (event) => event.event === "$pageview",
    );
    expect(pageviews).toHaveLength(4);
    expect(
      pageviews.map((event) => event.properties?.$pathname),
    ).toEqual(["/audio", "/practice", "/audio", "/practice"]);
    expect(
      pageviews.map((event) => event.properties?.$current_url),
    ).toEqual([
      expect.stringMatching(/\/audio$/),
      expect.stringMatching(/\/practice$/),
      expect.stringMatching(/\/audio$/),
      expect.stringMatching(/\/practice$/),
    ]);

    const serializedPayloads = JSON.stringify(pageviews);
    expect(serializedPayloads).not.toContain("?");
    expect(serializedPayloads).not.toContain("#");
    expect(serializedPayloads).not.toContain(sensitiveQueryValue);
    expect(serializedPayloads).not.toContain(sensitiveFragment);
    expect(
      analytics.events.filter((event) => event.event !== "$pageview"),
    ).toEqual([]);
    expect(
      analytics.requests.filter((request) => request.includes("/flags")),
    ).toEqual([]);
  });

  test("keeps the application usable when PostHog requests fail", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      const isLocal =
        url.hostname === "localhost" ||
        url.hostname === "127.0.0.1" ||
        url.hostname === "::1";

      if (url.hostname === POSTHOG_HOST) {
        await route.abort("failed");
      } else if (
        !isLocal &&
        (url.protocol === "http:" || url.protocol === "https:")
      ) {
        await route.abort("blockedbyclient");
      } else {
        await route.continue();
      }
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await page.locator('nav a[href="/audio"]:visible').first().click();
    await expect(page).toHaveURL(/\/audio$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(pageErrors).toEqual([]);
  });
});
