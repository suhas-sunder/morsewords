import { expect, test } from "@playwright/test";
import { blockExternalNetwork } from "./helpers";

const TOKEN_QA_ROUTES = [
  "/",
  "/audio",
  "/morse-code-encoder",
  "/morse-code-decoder",
  "/morse-code-sound-generator",
  "/name-to-morse-code",
  "/morse-code-alphabet",
  "/morse-code-numbers",
  "/morse-code-words",
  "/morse-code-punctuation",
  "/morse-code-word-separator",
  "/how-to-read-morse-code",
  "/how-to-separate-words-in-morse-code",
  "/a-in-morse-code",
  "/0-in-morse-code",
  "/hello-in-morse-code",
  "/space-in-morse-code",
  "/colon-in-morse-code",
  "/contact",
  "/practice",
  "/typing",
  "/morse-code-printable-chart",
  "/misc/privacy-policy",
] as const;

const EXPECTED_LIGHT_TOKENS = {
  "--mw-page-bg": "#f5f2eb",
  "--mw-page-bg-soft": "rgba(255, 250, 242, 0.35)",
  "--mw-surface": "#fffdf8",
  "--mw-surface-muted": "#fffaf2",
  "--mw-surface-elevated": "#ffffff",
  "--mw-border": "transparent",
  "--mw-border-strong": "transparent",
  "--mw-divider": "transparent",
  "--mw-text": "#111317",
  "--mw-text-muted": "#334155",
  "--mw-text-soft": "#475569",
  "--mw-text-faint": "#64748b",
  "--mw-text-inverse": "#ffffff",
  "--mw-heading": "#082f49",
  "--mw-heading-object": "#08324f",
  "--mw-eyebrow": "#0c4a6e",
  "--mw-eyebrow-line": "#075985",
  "--mw-link": "#0c4a6e",
  "--mw-link-hover": "#082f49",
  "--mw-navy": "#0f172a",
  "--mw-navy-soft": "#1e293b",
  "--mw-panel-dark": "#020617",
  "--mw-panel-dark-muted": "#1e293b",
  "--mw-panel-dark-subtle": "rgba(30, 41, 59, 0.7)",
  "--mw-panel-border": "transparent",
  "--mw-accent": "#38bdf8",
  "--mw-accent-soft": "#e0f2fe",
  "--mw-button-primary-bg": "#020617",
  "--mw-button-primary-text": "#e0f2fe",
  "--mw-button-primary-hover": "#1e293b",
  "--mw-button-global-hover-bg": "#0f172a",
  "--mw-button-global-hover-text": "#e0f2fe",
  "--mw-button-secondary-bg": "#fffdf8",
  "--mw-button-secondary-text": "#0f172a",
  "--mw-button-secondary-hover": "#fffaf2",
  "--mw-button-home-soft-bg": "rgba(255, 255, 255, 0.85)",
  "--mw-button-home-soft-strong-bg": "rgba(255, 255, 255, 0.88)",
  "--mw-button-outline-border": "transparent",
  "--mw-button-disabled-bg": "rgba(255, 255, 255, 0.55)",
  "--mw-button-disabled-text": "#94a3b8",
  "--mw-button-dark-panel-bg": "rgba(51, 65, 85, 0.95)",
  "--mw-button-dark-panel-hover": "#1e293b",
  "--mw-button-dark-panel-disabled-bg": "rgba(30, 41, 59, 0.6)",
  "--mw-button-dark-panel-disabled-text": "#64748b",
  "--mw-input-bg": "rgba(255, 255, 255, 0.88)",
  "--mw-input-bg-soft": "rgba(255, 255, 255, 0.85)",
  "--mw-input-text": "#020617",
  "--mw-input-placeholder": "#94a3b8",
  "--mw-input-border": "transparent",
  "--mw-input-focus-border": "transparent",
  "--mw-output-bg": "#020617",
  "--mw-output-text": "#e0f2fe",
  "--mw-output-bright": "#f0f9ff",
  "--mw-output-soft": "#e2e8f0",
  "--mw-output-muted": "#cbd5e1",
  "--mw-code-bg": "#f2eee6",
  "--mw-code-text": "#0f172a",
  "--mw-success-bg": "#f0fdf4",
  "--mw-success-text": "#166534",
  "--mw-info-bg": "#f0f9ff",
  "--mw-info-border": "#bae6fd",
  "--mw-warning-bg": "#fffbeb",
  "--mw-warning-text": "#b45309",
  "--mw-error-bg": "#fef2f2",
  "--mw-error-text": "#b91c1c",
  "--mw-neutral-border": "#e2e8f0",
  "--mw-surface-border": "#e6e8ef",
  "--mw-focus-ring": "#38bdf8",
  "--mw-focus-ring-muted": "rgba(11, 36, 71, 0.34)",
  "--mw-range-focus-ring": "rgba(11, 36, 71, 0.38)",
  "--mw-shadow-soft":
    "0 1px 1px rgba(15, 23, 42, 0.14), 0 2px 3px rgba(11, 36, 71, 0.13)",
  "--mw-shadow-soft-disabled":
    "0 1px 1px rgba(15, 23, 42, 0.08), 0 2px 3px rgba(11, 36, 71, 0.07)",
  "--mw-shadow-panel": "none",
  "--mw-shadow-card": "none",
  "--mw-overlay": "rgba(15, 23, 42, 0.4)",
  "--mw-static-surface-bg": "rgba(247, 244, 238, 0.72)",
  "--mw-static-surface-soft-bg": "rgba(255, 250, 242, 0.48)",
  "--mw-static-panel-bg": "rgba(247, 244, 238, 0.58)",
  "--mw-static-panel-soft-bg": "rgba(255, 250, 242, 0.4)",
  "--mw-static-panel-utility-bg": "rgba(255, 253, 248, 0.75)",
  "--mw-surface-card": "rgba(255, 253, 248, 0.86)",
  "--mw-surface-card-soft": "rgba(255, 253, 248, 0.85)",
  "--mw-surface-card-quiet": "rgba(255, 253, 248, 0.8)",
  "--mw-support-band-bg": "rgba(255, 255, 255, 0.45)",
  "--mw-translator-shell-bg": "rgba(255, 255, 255, 0.65)",
  "--mw-nav-bg": "#171717",
  "--mw-nav-bg-muted": "#262626",
  "--mw-nav-text": "#ffffff",
  "--mw-nav-muted": "#bae6fd",
  "--mw-nav-panel-text": "#e0f2fe",
  "--mw-nav-active-bg": "#e0f2fe",
  "--mw-nav-active-text": "#020617",
  "--mw-nav-active-muted": "#334155",
  "--mw-footer-bg": "#171717",
  "--mw-footer-text": "#d1d5db",
  "--mw-footer-muted": "#9ca3af",
  "--mw-footer-faint": "#6b7280",
  "--mw-social-card-hover": "#f8fafc",
  "--mw-social-icon-bg": "#f8fafc",
  "--mw-ambient-accent": "rgba(8, 47, 73, 0.34)",
  "--mw-ambient-accent-strong": "rgba(8, 47, 73, 0.4)",
} as const;

test.describe("semantic light design tokens", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("root exposes the full light token map", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const tokens = await page.evaluate((names) => {
      const styles = getComputedStyle(document.documentElement);
      return Object.fromEntries(
        names.map((name) => [name, styles.getPropertyValue(name).trim()]),
      );
    }, Object.keys(EXPECTED_LIGHT_TOKENS));

    expect(tokens).toEqual(EXPECTED_LIGHT_TOKENS);
  });

  test("source-of-truth shared surfaces keep current light colors", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const colors = await page.evaluate(() => {
      const css = (element: Element | null, property: keyof CSSStyleDeclaration) =>
        element ? getComputedStyle(element)[property] : "";
      const inputPanel = document.querySelector("#plainA")?.closest(".rounded-xl");
      const outputPanel = document
        .querySelector("#mw_output")
        ?.closest(".rounded-xl");

      return {
        bodyBg: getComputedStyle(document.body).backgroundColor,
        h1Color: css(document.querySelector("h1"), "color"),
        inputPanelBg: css(inputPanel, "backgroundColor"),
        inputText: css(document.querySelector("#plainA"), "color"),
        outputPanelBg: css(outputPanel, "backgroundColor"),
        outputText: css(document.querySelector("#mw_output"), "color"),
        staticCodeBg: css(document.querySelector(".mw-static-code"), "backgroundColor"),
      };
    });

    expect(colors).toEqual({
      bodyBg: "rgb(245, 242, 235)",
      h1Color: "rgb(8, 47, 73)",
      inputPanelBg: "rgba(255, 255, 255, 0.88)",
      inputText: "rgb(2, 6, 23)",
      outputPanelBg: "rgb(2, 6, 23)",
      outputText: "rgb(224, 242, 254)",
      staticCodeBg: "rgb(242, 238, 230)",
    });
  });

  test("required token QA routes keep route smoke, H1, and console stability", async ({
    page,
  }) => {
    await blockExternalNetwork(page);

    const consoleEntries: string[] = [];
    const pageErrors: string[] = [];
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) {
        const text = message.text();
        if (
          !text.includes("ERR_BLOCKED_BY_CLIENT") &&
          !text.includes("WebSocket connection to 'ws://127.0.0.1:24678/") &&
          !text.includes("[vite] failed to connect to websocket")
        ) {
          consoleEntries.push(`${message.type()}: ${text}`);
        }
      }
    });
    page.on("pageerror", (error) => {
      if (error.message !== "WebSocket closed without opened.") {
        pageErrors.push(error.message);
      }
    });

    for (const route of TOKEN_QA_ROUTES) {
      const response = await page.goto(route, {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });
      await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

      expect(response?.status(), `${route} HTTP status`).toBeLessThan(400);
      await expect(page.locator("main, body").first()).toBeVisible();
      await expect(page.locator("h1"), `${route} H1 count`).toHaveCount(1);
    }

    expect(pageErrors).toEqual([]);
    expect(consoleEntries).toEqual([]);
  });
});
