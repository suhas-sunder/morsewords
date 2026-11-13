import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { blockExternalNetwork, collectConsoleErrors } from "./helpers";

test.beforeEach(async ({ page }) => { await blockExternalNetwork(page); });

for (const route of ["/morse-code-timing", "/farnsworth-timing"]) {
  test(`${route}: PARIS timing, keyboard, range parity and saved Audio settings`, async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.addInitScript(() => { if (localStorage.getItem("mw_audio_wpm") === null) { localStorage.setItem("mw_audio_wpm", "20"); localStorage.setItem("mw_audio_fwpm", "20"); localStorage.setItem("mw_audio_hz", "740"); } });
    await page.goto(route);
    const lab = page.locator('[data-mw-timing-lab-ready="true"]');
    await expect(lab).toBeVisible();
    const character = lab.getByRole("slider", { name: "Character speed", exact: true });
    const effective = lab.getByRole("slider", { name: "Effective speed (Farnsworth)", exact: true });
    await expect(character).toHaveAttribute("min", "5");
    await expect(character).toHaveAttribute("max", "100");
    await expect(character).toHaveAttribute("step", "1");
    await expect(lab.getByTestId("timing-cycle")).toHaveText("3,000 ms");
    await expect(lab.getByRole("row", { name: "Dot 1 60 ms", exact: true })).toBeVisible();
    await effective.fill("10");
    await expect(lab.getByTestId("timing-cycle")).toHaveText("6,000 ms");
    await expect(lab.getByRole("row", { name: "Dash 3 180 ms", exact: true })).toBeVisible();
    await expect(lab.getByRole("row", { name: /Between letters/ })).toContainText("653.7 ms");
    await expect(lab.getByRole("row", { name: /Between words/ })).toContainText("1,525.3 ms");
    await character.focus();
    await page.keyboard.press("End");
    await expect(character).toHaveValue("100");
    await expect(effective).toHaveValue("10");
    await expect(effective).toHaveAttribute("max", "100");
    await page.keyboard.press("Home");
    await expect(character).toHaveValue("5");
    await expect(effective).toHaveValue("5");
    await expect(lab.getByTestId("timing-cycle")).toHaveText("12,000 ms");
    await character.fill("25");
    await lab.getByRole("button", { name: "Use standard spacing" }).click();
    await expect(effective).toHaveValue("25");
    expect((await new AxeBuilder({ page }).include('[data-mw-timing-lab-ready]').analyze()).violations).toEqual([]);
    await lab.getByRole("link", { name: "Hear these settings in Audio" }).click();
    await expect(page).toHaveURL(/\/audio$/);
    await expect(page.getByRole("slider", { name: "Character speed", exact: true })).toHaveValue("25");
    expect(await page.evaluate(() => localStorage.getItem("mw_audio_hz"))).toBe("740");
    expect(errors).toEqual([]);
  });
}

test("malformed saved speed is sanitized and restored between timing pages", async ({ page }) => {
  await page.addInitScript(() => { if (localStorage.getItem("mw_audio_wpm") === null) { localStorage.setItem("mw_audio_wpm", "nonsense"); localStorage.setItem("mw_audio_fwpm", "999"); } });
  await page.goto("/morse-code-timing");
  const lab = page.locator('[data-mw-timing-lab-ready="true"]');
  await expect(lab.getByRole("slider", { name: "Character speed", exact: true })).toHaveValue("18");
  await expect(lab.getByRole("slider", { name: "Effective speed (Farnsworth)", exact: true })).toHaveValue("18");
  await lab.getByRole("slider", { name: "Character speed", exact: true }).fill("40");
  await lab.getByRole("slider", { name: "Effective speed (Farnsworth)", exact: true }).fill("12");
  // The destination must restore the changed values even across a full document navigation.
  await page.locator('a[href="/farnsworth-timing"]').first().click();
  await expect(page).toHaveURL(/\/farnsworth-timing$/);
  await expect(lab.getByRole("slider", { name: "Character speed", exact: true })).toHaveValue("40");
  await expect(lab.getByRole("slider", { name: "Effective speed (Farnsworth)", exact: true })).toHaveValue("12");
});
