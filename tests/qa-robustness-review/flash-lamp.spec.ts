import { expect, test, type Page } from "@playwright/test";

import { isFlashAllowedFromSafetyState } from "../../app/client/components/shared/useFlashSafety";
import { waitForRouteReady } from "./helpers";

function flashToggle(page: Page) {
  return page.locator("button").filter({ hasText: "Flash Light" }).first();
}

async function openAudio(page: Page) {
  await page.goto("/audio", { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
  await expect(flashToggle(page)).toBeEnabled();
}

async function enableAudioFlash(page: Page) {
  const toggle = flashToggle(page);
  await expect(async () => {
    if ((await toggle.getAttribute("aria-pressed")) !== "true") {
      await toggle.click();
    }
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
  }).toPass({ timeout: 15_000 });
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

  test("visual practice lamp does not sit inside a filled nested card", async ({
    page,
  }) => {
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto("/morse-code-visual-practice", {
      waitUntil: "domcontentloaded",
    });
    await waitForRouteReady(page);

    const lamp = page.getByTestId("mw-flash-lamp").first();
    await expect(lamp).toBeVisible();
    const lampWrapper = lamp.locator("xpath=..");
    await expect(lampWrapper).not.toHaveClass(/mw-static-panel/);
    await expect(lampWrapper).not.toHaveClass(/bg-\[/);

    const wrapperBackground = await lampWrapper.evaluate((element) => {
      return window.getComputedStyle(element).backgroundColor;
    });
    expect(wrapperBackground).toBe("rgba(0, 0, 0, 0)");
  });

  test("audio Flash Light button and lamp stay vertically aligned", async ({
    page,
  }) => {
    await page.addInitScript(() => window.localStorage.clear());
    await openAudio(page);

    const flashButtonBox = await flashToggle(page).boundingBox();
    const lampBox = await page.getByTestId("mw-flash-lamp").first().boundingBox();

    expect(flashButtonBox).not.toBeNull();
    expect(lampBox).not.toBeNull();

    const flashButtonCenter =
      flashButtonBox!.y + flashButtonBox!.height / 2;
    const lampCenter = lampBox!.y + lampBox!.height / 2;
    expect(Math.abs(flashButtonCenter - lampCenter)).toBeLessThanOrEqual(4);
  });

  test("explicit flash disable setting turns off visual flash controls", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.localStorage.setItem("morsewords-disable-flash-effects", "1");
    });
    await page.goto("/audio");
    await waitForRouteReady(page);

    await expect(flashToggle(page)).toBeDisabled();
    const lamp = page.getByTestId("mw-flash-lamp").first();
    await expect(lamp).toBeVisible();
    await expect(lamp).toHaveAttribute("data-disabled", "true");

    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent("morsewords:flash", { detail: { ms: 350 } }),
      );
    });

    await expect(lamp).toHaveAttribute("data-active", "false");
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
  });

  test("whole-page flash setting restores the full-page flash and warning", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.localStorage.setItem("morsewords-full-page-flash", "1");
    });
    await openAudio(page);

    await enableAudioFlash(page);
    const warning = page
      .getByText("Strobe warning: flashing light may be uncomfortable", {
        exact: false,
      })
      .filter({ visible: true });
    await expect(warning).toHaveCount(0);

    const sawPageFlash = page.evaluate<boolean>(
      () =>
        new Promise<boolean>((resolve) => {
          if (document.querySelector(".mw-strobe-flash")) {
            resolve(true);
            return;
          }
          const observer = new MutationObserver(() => {
            if (document.querySelector(".mw-strobe-flash")) {
              observer.disconnect();
              resolve(true);
            }
          });
          observer.observe(document.body, { childList: true, subtree: true });
          window.setTimeout(() => {
            observer.disconnect();
            resolve(false);
          }, 1_200);
        }),
    );

    await page.getByRole("button", { name: "Play audio Play" }).click();
    await expect(warning).toBeVisible();
    await expect(sawPageFlash).resolves.toBe(true);
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
    await page.goto("/morse-code-visual-practice", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const lamp = page.getByTestId("mw-flash-lamp").first();
    await expect(lamp).toBeVisible();
    await expect(lamp).toHaveAttribute("data-active", "false");
    await expect(lamp).not.toHaveClass(/mw-static-tile/);
    await expect(lamp).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");

    await expect(async () => {
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
            }, 1_200);
          }),
      );

      await page.getByRole("textbox", { name: "Message" }).fill("t");
      await page.getByRole("button", { name: "Flash message" }).click();
      await expect(sawLampActivate).resolves.toBe(true);
    }).toPass({ timeout: 15_000 });
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
  });
});
