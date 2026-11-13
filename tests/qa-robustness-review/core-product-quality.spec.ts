import { test, expect } from "@playwright/test";
import { CORE_ROUTE_CONTRACTS } from "../../scripts/core-route-contracts";
import { blockExternalNetwork, collectConsoleErrors, waitForRouteReady } from "./helpers";

for (const [route, title, primarySelector] of CORE_ROUTE_CONTRACTS) {
  test(`core product contract ${route}`, async ({ page }, testInfo) => {
    if (testInfo.project.name.includes("mobile")) await page.setViewportSize({ width: 390, height: 844 });
    await blockExternalNetwork(page);
    const errors = collectConsoleErrors(page);
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe(route);
    const html = await response!.text();
    const initial = await page.evaluate(({ html, primarySelector }) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      doc.querySelectorAll("script,style").forEach(node => node.remove());
      return { h1: [...doc.querySelectorAll("h1")].map(node => node.textContent), primary: !!doc.querySelector(`main ${primarySelector}`), text: doc.querySelector("main")?.textContent?.trim() };
    }, { html, primarySelector });
    expect(initial.h1).toEqual([title]);
    expect(initial.primary, "Primary task must exist before hydration").toBe(true);
    expect(initial.text).not.toMatch(/^Loading[.\s]*$/);
    expect(initial.text?.length).toBeGreaterThan(100);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://www.morsewords.com${route}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index,follow");
    await waitForRouteReady(page);
    await page.waitForLoadState("networkidle");
    if (route === "/morse-code-word-separator") await expect(page.locator('[data-mw-word-separator-ready]')).toHaveAttribute('data-mw-word-separator-ready', 'true');
    const main = page.locator("main");
    await expect(main.locator(primarySelector).first()).toBeAttached();
    const keyboardTarget = main.locator('textarea:not([readonly]),input:not([type=file]):not([type=hidden]),button:not([disabled]),a[href],select').filter({ visible: true }).first();
    await keyboardTarget.focus();
    await expect(keyboardTarget).toBeFocused();
    const next = main.locator('a[href^="/"]').filter({ visible: true }).first();
    await expect(next).toHaveAttribute("href", /^\/(?!\/)/);

    const editable = main.locator("textarea:not([readonly])").first();
    if (await editable.count()) {
      const input = /decoder|separator/.test(route) ? "... --- ... / .... . .-.. .--." : "SOS HELP";
      await editable.fill(input);
      await expect(editable).toHaveValue(input);
      const output = main.locator('textarea[readonly],pre').first();
      if (await output.count()) expect((await output.inputValue().catch(() => output.textContent()))?.trim().length).toBeGreaterThan(0);
    } else if (route === "/morse-code-audio-decoder") {
      const chooser = page.waitForEvent("filechooser");
      await page.getByRole("button", { name: "Choose audio file", exact: true }).click();
      expect((await chooser).isMultiple()).toBe(false);
      await page.getByRole("button", { name: "Clear", exact: true }).click();
    } else if (route === "/dictionary") {
      const search = main.locator('input').first();
      await search.fill("question mark");
      await expect(search).toHaveValue("question mark");
      await expect(main).toContainText("Question mark");
    } else if (route === "/practice") {
      await page.getByLabel("Practice answer", { exact: true }).fill("...");
      await page.getByRole("button", { name: "Check answer", exact: true }).click();
    } else if (route === "/morse-code-printable-worksheets") {
      await page.getByRole("button", { name: "Classroom", exact: true }).click();
      await expect(main.locator("#builder")).toBeVisible();
    } else if (route === "/morse-code-printable-chart") {
      const select = main.locator("select").first();
      await select.selectOption("png");
      await expect(select).toHaveValue("png");
      await expect(main.getByRole("button", { name: "Download PNG", exact: true }).first()).toBeEnabled();
    } else if (["/learn-morse-code", "/morse-code-timing", "/morse-code-by-language"].includes(route)) {
      const link = main.locator(primarySelector).filter({ visible: true }).first();
      const href = await link.getAttribute("href");
      expect(href).toMatch(/^\//);
      await link.press("Enter");
      await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"));
    } else {
      await main.getByRole("button").filter({ visible: true }).first().click();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}
