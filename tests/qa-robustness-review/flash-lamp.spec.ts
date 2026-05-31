import { expect, test, type Page } from "@playwright/test";

import { isFlashAllowedFromSafetyState } from "../../app/client/components/shared/useFlashSafety";

function flashToggle(page: Page) {
  return page.locator("button").filter({ hasText: "Flash" }).first();
}

async function openAudio(page: Page) {
  await page.goto("/audio");
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await expect(flashToggle(page)).toBeEnabled();
}

async function enableAudioFlash(page: Page) {
  const toggle = flashToggle(page);
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
}

test.describe("flash safety helpers", () => {
  test("allow user-triggered flash by default and block it only for the explicit site setting", () => {
    expect(
      isFlashAllowedFromSafetyState({
        disableFlashEffects: false,
        reducedMotion: false,
      }),
    ).toBe(true);
    expect(
      isFlashAllowedFromSafetyState({
        disableFlashEffects: true,
        reducedMotion: false,
      }),
    ).toBe(false);
    expect(
      isFlashAllowedFromSafetyState({
        disableFlashEffects: false,
        reducedMotion: true,
      }),
    ).toBe(true);
  });
});

test.describe("shared FlashLamp", () => {
  test("uses a small lamp for morsewords:flash events instead of a full-screen strobe", async ({
    page,
  }) => {
    await page.addInitScript(() => window.localStorage.clear());
    await openAudio(page);

    await enableAudioFlash(page);
    const lamp = page.getByTestId("mw-flash-lamp").first();

    await expect(lamp).toBeVisible();
    await expect(lamp).toHaveAttribute("data-active", "false");
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);

    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent("morsewords:flash", { detail: { ms: 350 } }),
      );
    });

    await expect(lamp).toHaveAttribute("data-active", "true");
    await expect(lamp).toHaveAttribute("data-active", "false");
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
    await expect(page.locator(".fixed.inset-0.bg-white")).toHaveCount(0);
  });

  test("global flash disable prevents lamp activation", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.localStorage.setItem("morsewords-disable-flash-effects", "1");
    });
    await page.goto("/audio");
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    await expect(flashToggle(page)).toBeDisabled();

    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent("morsewords:flash", { detail: { ms: 350 } }),
      );
    });

    await expect(page.locator('[data-mw-flash-lamp][data-active="true"]')).toHaveCount(0);
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
  });

  test("prefers-reduced-motion does not permanently disable user-triggered flash", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => window.localStorage.clear());
    await openAudio(page);

    await enableAudioFlash(page);
    await expect(flashToggle(page)).toBeEnabled();
    const lamp = page.getByTestId("mw-flash-lamp").first();
    await expect(lamp).toBeVisible();
    await expect(lamp).toHaveAttribute("data-disabled", "false");

    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent("morsewords:flash", { detail: { ms: 350 } }),
      );
    });

    await expect(lamp).toHaveAttribute("data-active", "true");
    await expect(lamp).toHaveAttribute("data-active", "false");
  });

  test("visual practice uses the shared lamp component", async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto("/morse-code-visual-practice");

    const lamp = page.getByTestId("mw-flash-lamp").first();
    await expect(lamp).toBeVisible();
    await expect(lamp).toHaveAttribute("data-active", "false");

    const sawLampActivate = page.evaluate<boolean>(
      () =>
        new Promise<boolean>((resolve) => {
          const lampNode = document.querySelector(
            '[data-testid="mw-flash-lamp"]',
          );
          if (!lampNode) {
            resolve(false);
            return;
          }
          if (lampNode.getAttribute("data-active") === "true") {
            resolve(true);
            return;
          }
          const observer = new MutationObserver(() => {
            if (lampNode.getAttribute("data-active") === "true") {
              observer.disconnect();
              resolve(true);
            }
          });
          observer.observe(lampNode, {
            attributes: true,
            attributeFilter: ["data-active"],
          });
          window.setTimeout(() => {
            observer.disconnect();
            resolve(false);
          }, 2500);
        }),
    );

    await page.getByRole("textbox", { name: "Message" }).fill("t");
    await page.getByRole("button", { name: "Flash message" }).click();
    await expect(sawLampActivate).resolves.toBe(true);
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
  });
});
