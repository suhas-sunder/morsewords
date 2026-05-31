import { expect, test } from "@playwright/test";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

test.describe("typing result share actions", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("downloads the generated typing result image with the preserved filename", async ({
    page,
  }) => {
    await page.goto("/typing", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const durationButton = page.getByRole("button", {
      name: "Set session duration to 10s",
    });
    const tenSecondDuration = page.getByText("Duration: 00:10");
    await expect(async () => {
      if (!(await tenSecondDuration.isVisible())) {
        await durationButton.click();
      }
      await expect(tenSecondDuration).toBeVisible({ timeout: 1_000 });
    }).toPass({ timeout: 15_000 });

    await page.getByRole("button", { name: "Append dit" }).click();
    await page.getByRole("button", { name: "Commit letter (space)" }).click();
    await page.getByRole("button", { name: "Append dah" }).click();
    await page.getByRole("button", { name: "Commit letter (space)" }).click();

    const sessionDialog = page.getByRole("dialog", {
      name: "Session complete",
    });
    await expect(sessionDialog).toBeVisible({ timeout: 20_000 });

    await sessionDialog.getByRole("button", { name: "Share results" }).click();

    const shareDialog = page.getByRole("dialog", { name: "Share results" });
    await expect(shareDialog).toBeVisible();
    await expect(
      shareDialog.getByText("Generates a shareable image."),
    ).toBeVisible();
    await expect(page.getByAltText("Shareable results preview")).toBeVisible({
      timeout: 15_000,
    });

    const downloadLink = shareDialog.getByRole("link", {
      name: "Download PNG",
    });
    await expect(downloadLink).toHaveAttribute(
      "download",
      "morse-typing-results.png",
    );

    const downloadPromise = page.waitForEvent("download");
    await downloadLink.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe("morse-typing-results.png");
  });
});
