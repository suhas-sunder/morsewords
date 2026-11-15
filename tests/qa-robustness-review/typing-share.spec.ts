import { expect, test } from "@playwright/test";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

test.describe("typing result share actions", () => {
  test.beforeEach(async ({ page }, info) => {
    await blockExternalNetwork(page);
    await page.addInitScript(theme => localStorage.setItem("morsewords-theme", theme), info.project.name.endsWith("dark") ? "dark" : "light");
  });

  test("downloads the generated typing result image with the preserved filename", async ({
    page,
  }, info) => {
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
    await expect(shareDialog.getByRole("button", { name: "Close", exact: true })).toBeFocused();
    expect(await shareDialog.locator(".mw-surface").evaluate(element => getComputedStyle(element).backgroundColor)).toMatch(/^rgb\(/);
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
    await page.screenshot({ path: info.outputPath("w21-typing-share-dialog.png") });
    await page.keyboard.press("Escape");
    await expect(shareDialog).toHaveCount(0);
    await expect(sessionDialog.getByRole("button", { name: "Share results" })).toBeFocused();
    await expect(sessionDialog).toBeVisible();
  });
});
