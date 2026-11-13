import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { blockExternalNetwork, collectConsoleErrors } from "./helpers";

for (const width of [390, 768, 1440]) {
  test(`navigation focus, search and close at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await blockExternalNetwork(page);
    const errors = collectConsoleErrors(page);
    await page.goto("/audio", { waitUntil: "networkidle" });
    const mobile = width < 1180;
    const trigger = page.getByRole("button", { name: mobile ? "Open navigation" : "More", exact: true });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: mobile ? "Mobile navigation" : "More MorseWords tools", exact: true });
    const search = dialog.getByRole("searchbox", { name: "Search MorseWords tools" });
    await expect(search).toBeFocused();
    await search.fill("audio");
    await expect(dialog.locator('a[href^="/morse-code-books/"]')).toHaveCount(0);
    await search.fill("time machine");
    await expect(dialog.locator('a[href="/morse-code-books/the-time-machine"]')).toHaveCount(1);
    await search.fill("audio decoder");
    const decoder = dialog.getByRole("link", { name: /Morse audio decoder/ });
    await expect(decoder).toHaveAttribute("href", "/morse-code-audio-decoder");
    await expect(dialog.locator('a[href="/morse-code-decoder"]')).toHaveCount(0);
    expect((await new AxeBuilder({ page }).include('[role="dialog"]').analyze()).violations).toEqual([]);
    if (mobile) {
      await expect(page.locator("main")).toHaveJSProperty("inert", false); // Its ancestor owns inertness.
      expect(await page.locator("main").evaluate(node => !!node.closest("[inert]"))).toBe(true);
      const first = dialog.locator('a[href],button,input').filter({ visible: true }).first();
      const last = dialog.locator('a[href],button,input').filter({ visible: true }).last();
      await last.focus(); await page.keyboard.press("Tab"); await expect(first).toBeFocused();
      await page.keyboard.press("Shift+Tab"); await expect(last).toBeFocused();
      await dialog.getByRole("button", { name: "Open display settings", exact: true }).click();
      const settings = dialog.getByRole("dialog", { name: "Display settings" });
      await expect(settings.locator('button').first()).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(settings).toHaveCount(0);
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole("button", { name: "Open display settings", exact: true })).toBeFocused();
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    expect(await page.locator("main").evaluate(node => !!node.closest("[inert]"))).toBe(false);
    await trigger.click();
    await dialog.getByRole("searchbox").fill("audio decoder");
    await dialog.getByRole("link", { name: /Morse audio decoder/ }).press("Enter");
    await expect(page).toHaveURL(/\/morse-code-audio-decoder$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Morse Code Audio Decoder");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("resizing an open mobile dialog restores the desktop page", async ({ page }) => {
  await blockExternalNetwork(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open navigation", exact: true }).click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.getByRole("dialog", { name: "Mobile navigation" })).toHaveCount(0);
  expect(await page.locator("main").evaluate(node => !!node.closest("[inert]"))).toBe(false);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});
