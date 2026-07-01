import { expect, test } from "@playwright/test";

import { blockExternalNetwork, waitForRouteReady } from "./helpers";

test.describe("PostHog friction follow-up checks", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
    await page.addInitScript(() => {
      window.localStorage.clear();
      const originalCreateObjectUrl = URL.createObjectURL.bind(URL);
      const captures: Array<{ size: number; type: string }> = [];
      URL.createObjectURL = (object: Blob | MediaSource) => {
        if (object instanceof Blob) {
          captures.push({ size: object.size, type: object.type });
        }
        return originalCreateObjectUrl(object);
      };
      Object.defineProperty(window, "__mwPosthogFrictionDownloadBlobs", {
        value: captures,
        configurable: true,
      });
    });
  });

  test("/audio WAV export shows clear completion feedback", async ({ page }) => {
    await page.goto("/audio", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await page.waitForFunction(
      () => window.localStorage.getItem("mw_audio_source") === "text",
    );

    const exportButton = page.getByRole("button", { name: "Export WAV" });
    await expect(exportButton).toBeEnabled();

    await exportButton.click();

    await expect(
      page.getByRole("status").filter({ hasText: "WAV download started." }),
    ).toBeVisible({ timeout: 30_000 });
    await expect(exportButton).toBeEnabled();

    const blobs = await page.evaluate(
      () =>
        (window as unknown as {
          __mwPosthogFrictionDownloadBlobs: Array<{
            size: number;
            type: string;
          }>;
        }).__mwPosthogFrictionDownloadBlobs,
    );
    expect(blobs.at(-1)?.type).toBe("audio/wav");
    expect(blobs.at(-1)?.size ?? 0).toBeGreaterThan(100);
  });
});
