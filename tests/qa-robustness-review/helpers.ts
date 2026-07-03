import { expect, type Page, type TestInfo } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

export {
  APP_ROUTES,
  AUDIO_DECODER_ALIAS_PATHS,
  CANONICAL_SMOKE_ROUTES,
  CHART_ALIAS_PATHS,
  GENERATED_ROUTE_PATHS,
  LETTER_ROUTE_PATHS,
  MP3_ALIAS_PATHS,
  NUMBER_ROUTE_PATHS,
  PRIMARY_TOOL_ROUTES,
  READER_ALIAS_PATHS,
  REDIRECT_PATHS,
  REDIRECT_ROUTE_EXPECTATIONS,
  ROUTE_EXCLUSIONS,
  ROUTE_SMOKE_GROUPS,
  TEST_ALIAS_PATHS,
  redirectAliasesFor,
} from "./helpers/routes";

export function isExpectedHarnessConsoleEntry(text: string) {
  return [
    /\[vite\]/i,
    /WebSocket closed without opened/i,
    /failed to connect to websocket/i,
    /WebSocket connection to 'ws:\/\/(?:127\.0\.0\.1|localhost):\d+/i,
    /ERR_BLOCKED_BY_CLIENT(?:\.Inspector)?/i,
    /net::ERR_NO_BUFFER_SPACE/i,
    /Failed to fetch manifest patches/i,
  ].some((pattern) => pattern.test(text));
}

export async function blockExternalNetwork(page: Page) {
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    const isLocal =
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "::1";
    if (!isLocal && (url.protocol === "http:" || url.protocol === "https:")) {
      return route.abort("blockedbyclient");
    }
    return route.continue();
  });
}

export function collectConsoleErrors(page: Page) {
  const entries: Array<{ type: string; text: string; url: string }> = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      if (isExpectedHarnessConsoleEntry(message.text())) return;
      entries.push({
        type: message.type(),
        text: message.text(),
        url: page.url(),
      });
    }
  });
  page.on("pageerror", (error) => {
    if (isExpectedHarnessConsoleEntry(error.message)) return;
    entries.push({
      type: "pageerror",
      text: error.message,
      url: page.url(),
    });
  });
  return entries;
}

export function normalizePathname(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

export function sitemapLocs(xml: string) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

export function sameHostPathnamesInText(
  text: string,
  origin = "https://www.morsewords.com",
) {
  const escapedOrigin = origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const urls = [
    ...text.matchAll(
      new RegExp(`${escapedOrigin}(?:/[^"'<>\\s\\\\]*)?`, "g"),
    ),
  ].map((match) => match[0]);

  return urls.map((url) => normalizePathname(new URL(url).pathname));
}

export async function waitForRouteReady(page: Page) {
  await page.waitForLoadState("domcontentloaded", { timeout: 30_000 });
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      }),
  );

  const main = page.locator("main");
  if ((await main.count()) > 0) {
    await expect(main.first()).toBeVisible();
    return;
  }

  await expect(page.locator("body")).toBeVisible();
}

export async function gotoRoute(page: Page, route: string) {
  const response = await page.goto(route, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await waitForRouteReady(page);
  return response;
}

export async function writeArtifact(testInfo: TestInfo, relativeName: string, data: unknown) {
  const parsedName = path.parse(relativeName);
  const projectName = testInfo.project.name.replace(/[^a-z0-9-]+/gi, "-");
  const filePath = path.join(
    "test-artifacts",
    "qa-robustness-review",
    "logs",
    `${parsedName.name}-${projectName}${parsedName.ext}`,
  );
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, typeof data === "string" ? data : JSON.stringify(data, null, 2));
  await testInfo.attach(relativeName, {
    path: filePath,
    contentType: relativeName.endsWith(".json") ? "application/json" : "text/plain",
  });
}

export async function expectNoVisiblePrematureWarning(page: Page) {
  await expect(
    page.getByText("Strobe warning:", { exact: false }).filter({ visible: true }),
  ).toHaveCount(0);
}
