import { expect, test } from "@playwright/test";
import {
  APP_ROUTES,
  blockExternalNetwork,
  collectConsoleErrors,
  writeArtifact,
} from "./helpers";

test.describe("route smoke and console stability", () => {
  for (const route of APP_ROUTES) {
    test(`${route} loads without server error`, async ({ page }, testInfo) => {
      await blockExternalNetwork(page);
      const consoleEntries = collectConsoleErrors(page);
      const response = await page.goto(route, {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });
      await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

      expect(response?.status(), `${route} HTTP status`).toBeLessThan(400);
      if ((await page.locator("main").count()) > 0) {
        await expect(page.locator("main")).toBeVisible();
      } else {
        await expect(page.locator("body")).toBeVisible();
      }

      await page.screenshot({
        path: `test-artifacts/qa-robustness-review/screenshots/smoke-${testInfo.project.name}-${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}.png`,
        fullPage: false,
      });

      await writeArtifact(
        testInfo,
        `console-${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}.json`,
        consoleEntries,
      );
    });
  }

  test("home play button is present and clickable", async ({ page }) => {
    await blockExternalNetwork(page);
    const consoleEntries = collectConsoleErrors(page);

    await page.goto("/");
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    const play = page.getByRole("button", { name: /^Start timer Play$/ }).first();
    await expect(play).toBeVisible();
    await play.click();
    await expect(
      page
        .getByRole("button", {
          name: /^(Start timer Play|Pause timer Pause|Resume timer Resume)$/,
        })
        .first(),
    ).toBeVisible();

    expect(consoleEntries.filter((entry) => entry.type === "pageerror")).toEqual([]);
  });

  test("unknown routes render the root 404 boundary", async ({ page }) => {
    await blockExternalNetwork(page);
    const consoleEntries = collectConsoleErrors(page);

    const response = await page.goto("/route-that-does-not-exist");
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    expect([200, 404], "static SPA fallback status").toContain(response?.status());
    await expect(
      page.getByText("The requested page could not be found."),
    ).toBeVisible();
    expect(consoleEntries.filter((entry) => entry.type === "pageerror")).toEqual([]);
  });
});
