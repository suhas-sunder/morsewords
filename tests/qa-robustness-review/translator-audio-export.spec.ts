import { expect, test } from "@playwright/test";

import { blockExternalNetwork, waitForRouteReady } from "./helpers";

test.describe("homepage translator audio export", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
    await page.addInitScript(() => window.localStorage.clear());
  });

  test("keeps the translator intact while offering explicit MP3/WAV and split controls", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    await expect(page.getByRole("button", { name: "Save WAV audio" })).toBeVisible();
    const advanced = page.getByRole("button", { name: "Advanced settings" });
    await expect(
      page.getByTestId("translator-audio-export-settings"),
    ).toHaveCount(0);
    await advanced.click();

    const settings = page.getByTestId("translator-audio-export-settings");
    await expect(settings).toBeVisible();
    const controls = settings.getByTestId("audio-export-format-split-controls");
    const format = controls.getByLabel("Output format");
    await expect(format).toHaveValue("wav");
    await expect(format.locator("option")).toHaveText(["MP3", "WAV"]);

    await format.selectOption("mp3");
    await expect(page.getByRole("button", { name: "Save MP3 audio" })).toBeVisible();

    await format.selectOption("wav");
    await expect(page.getByRole("button", { name: "Save WAV audio" })).toBeVisible();

    await expect(controls.getByRole("radio", { name: "No split" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await controls.getByRole("radio", { name: "Split by duration" }).click();
    const duration = controls.getByLabel("Part duration");
    await expect(duration.locator("option")).toHaveText([
      "5 minutes",
      "10 minutes",
      "15 minutes",
      "30 minutes",
      "45 minutes",
      "60 minutes",
    ]);
    await duration.selectOption("60");
    await expect(duration).toHaveValue("60");

    await controls.getByRole("radio", { name: /Custom split time/ }).click();
    const customDuration = controls.getByLabel("Custom part duration");
    await customDuration.fill("0");
    await expect(controls.getByRole("alert")).toHaveText(
      "Enter a positive duration in minutes.",
    );
    await customDuration.fill("7");
    await expect(controls.getByRole("alert")).toHaveCount(0);

    await expect
      .poll(() =>
        page.evaluate(() => ({
          custom: window.localStorage.getItem("mw_export_custom_split_minutes"),
          format: window.localStorage.getItem("mw_export_format"),
          mode: window.localStorage.getItem("mw_export_split_mode"),
        })),
      )
      .toEqual({ custom: "7", format: "wav", mode: "custom" });

  });

  test("recalculates a homepage long export only when Split by duration is chosen", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    await page.getByRole("button", { name: "Advanced settings" }).click();
    await page.getByLabel("Input (Text)").fill("T ".repeat(1200));
    const controls = page
      .getByTestId("translator-audio-export-settings")
      .getByTestId("audio-export-format-split-controls");
    await expect(page.getByTestId("morse-export-plan")).toHaveCount(0);
    await controls.getByRole("radio", { name: "Split by duration" }).click();
    await controls.getByLabel("Part duration").selectOption("5");
    const plan = page.getByTestId("morse-export-plan");

    await expect
      .poll(async () => Number(await plan.getAttribute("data-export-part-count")))
      .toBeGreaterThan(1);
    await expect(page.getByTestId("morse-export-split-note")).toBeVisible();
  });
});
