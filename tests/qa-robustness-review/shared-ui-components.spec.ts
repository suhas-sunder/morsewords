import { expect, test, type Locator } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const ROOT = process.cwd();

const sharedComponentFiles = [
  "app/client/components/shared/ui/TogglePill.tsx",
  "app/client/components/shared/ui/SliderRow.tsx",
  "app/client/components/shared/ui/StatusMessage.tsx",
] as const;

const routeControlFiles = [
  "app/client/components/audio/MorseAudioTranslator.tsx",
  "app/client/components/morse-code-sound-generator/MorseAudioTranslator.tsx",
  "app/client/components/morse-code-mp3-generator/MorseMp3GeneratorTool.tsx",
  "app/routes/morse-code-audio-practice.tsx",
  "app/routes/morse-code-audio-quiz.tsx",
  "app/routes/morse-code-visual-practice.tsx",
  "app/routes/morse-code-visual-quiz.tsx",
  "app/routes/morse-code-word-trainer.tsx",
] as const;

function readRepoFile(filePath: string) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

async function expectVisibleFocusOutline(locator: Locator) {
  const outline = await locator.evaluate((element) => {
    const style = window.getComputedStyle(element);
    return {
      style: style.outlineStyle,
      width: style.outlineWidth,
    };
  });

  expect(outline.style).not.toBe("none");
  expect(outline.width).not.toBe("0px");
}

test("shared UI control primitives keep accessibility and disabled-state contracts", () => {
  for (const filePath of sharedComponentFiles) {
    expect(fs.existsSync(path.join(ROOT, filePath)), filePath).toBe(true);
  }

  const appCss = readRepoFile("app/app.css");
  expect(appCss).toMatch(
    /\.mw-page-content\s+\.mw-home-page\s+:where\(input:not\(\[type="range"\]\), textarea, select\):focus-visible/,
  );
  expect(appCss).toMatch(
    /\.mw-page-content\s+\.mw-non-home-page\s+:where\(input, textarea, select\):focus-visible/,
  );
  expect(appCss).toMatch(
    /\.mw-page-content\s+\.mw-non-home-page\s+:where\(input\[type="range"\]\):focus-visible/,
  );

  const togglePill = readRepoFile(
    "app/client/components/shared/ui/TogglePill.tsx",
  );
  expect(togglePill).toContain("toolControlButtonClass");
  expect(togglePill).toContain("aria-pressed={checked}");
  expect(togglePill).toContain("aria-describedby={describedBy}");
  expect(togglePill).toContain("disabled={disabled}");
  expect(togglePill).toContain("onChange(!checked)");

  const sliderRow = readRepoFile("app/client/components/shared/ui/SliderRow.tsx");
  expect(sliderRow).toContain("React.useId()");
  expect(sliderRow).toContain("htmlFor={inputId}");
  expect(sliderRow).toContain("type=\"range\"");
  expect(sliderRow).toContain("disabled={disabled}");
  expect(sliderRow).toContain("cursor-not-allowed");

  const statusMessage = readRepoFile(
    "app/client/components/shared/ui/StatusMessage.tsx",
  );
  expect(statusMessage).toContain("role={kind === \"error\" ? \"alert\"");
  expect(statusMessage).toContain("aria-live={live && kind !== \"error\"");
});

test("targeted routes reuse shared controls instead of route-local copies", () => {
  for (const filePath of routeControlFiles) {
    const source = readRepoFile(filePath);
    expect(source, filePath).not.toContain("function TogglePill(");
    expect(source, filePath).not.toContain("function SliderRow(");
    expect(source, filePath).not.toContain('style={{ accentColor: "#38bdf8" }}');
  }
});

test.describe("shared route controls", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
    await page.addInitScript(() => window.localStorage.clear());
  });

  for (const route of [
    "/morse-code-audio-practice",
    "/morse-code-audio-quiz",
  ] as const) {
    test(`${route} keeps Flash Light enabled without default strobe warning`, async ({
      page,
    }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await waitForRouteReady(page);

      await expect(page.getByLabel("Character speed").first()).toBeVisible();

      const flashButton = page.getByRole("button", { name: "Flash Light" });
      const advancedButton = page.getByRole("button", {
        name: "Show advanced settings",
      });
      await expect(async () => {
        if (await advancedButton.isVisible()) {
          await advancedButton.click();
        }
        await expect(flashButton).toBeEnabled({ timeout: 1_000 });
      }).toPass({ timeout: 15_000 });
      await expect(flashButton).toBeEnabled();
      await expect(flashButton).toHaveAttribute("aria-pressed", "false");

      await flashButton.click();
      await expect(flashButton).toHaveAttribute("aria-pressed", "true");
      await expect(
        page.getByText("Strobe warning: flashing light may be uncomfortable", {
          exact: false,
        }),
      ).toHaveCount(0);
      await expect(page.getByTestId("mw-flash-lamp")).toBeVisible();
    });
  }

  for (const route of [
    "/morse-code-visual-practice",
    "/morse-code-visual-quiz",
    "/morse-code-word-trainer",
  ] as const) {
    test(`${route} exposes shared range settings with accessible labels`, async ({
      page,
    }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await waitForRouteReady(page);

      const speed = page.getByLabel("Character speed").first();
      const spacing = page.getByLabel("Farnsworth spacing").first();
      await expect(speed).toBeVisible();
      await expect(speed).toHaveAttribute("type", "range");
      await expect(spacing).toBeVisible();
      await expect(spacing).toHaveAttribute("type", "range");
    });
  }

  test("non-home route fields and range controls have visible keyboard focus", async ({
    page,
  }) => {
    await page.goto("/morse-code-word-trainer", {
      waitUntil: "domcontentloaded",
    });
    await waitForRouteReady(page);

    const answerField = page.getByLabel("Your answer").first();
    await expect(answerField).toBeEnabled();
    await answerField.focus();
    await expect(answerField).toBeFocused();
    await expectVisibleFocusOutline(answerField);

    const speed = page.getByLabel("Character speed").first();
    await speed.focus();
    await expect(speed).toBeFocused();
    await expectVisibleFocusOutline(speed);
  });
});
