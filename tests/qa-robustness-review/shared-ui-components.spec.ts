import { expect, test, type Locator, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const ROOT = process.cwd();

const sharedComponentFiles = [
  "app/client/components/shared/PlaybackToggleGroup.tsx",
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

type FocusArtifactSnapshot = {
  backgroundColor: string;
  borderBottomWidth: string;
  borderLeftWidth: string;
  borderRightWidth: string;
  borderTopWidth: string;
  boxShadow: string;
  outlineStyle: string;
  outlineWidth: string;
  ringShadow: string;
  ringOffsetShadow: string;
};

async function readFocusArtifactSnapshot(locator: Locator) {
  return locator.evaluate((element) => {
    const style = window.getComputedStyle(element);
    return {
      backgroundColor: style.backgroundColor,
      borderBottomWidth: style.borderBottomWidth,
      borderLeftWidth: style.borderLeftWidth,
      borderRightWidth: style.borderRightWidth,
      borderTopWidth: style.borderTopWidth,
      boxShadow: style.boxShadow,
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      ringShadow: style.getPropertyValue("--tw-ring-shadow").trim(),
      ringOffsetShadow: style
        .getPropertyValue("--tw-ring-offset-shadow")
        .trim(),
    } satisfies FocusArtifactSnapshot;
  });
}

function expectNoOutlineRingOrBorder(snapshot: FocusArtifactSnapshot) {
  expect(["none", "solid"]).toContain(snapshot.outlineStyle);
  if (snapshot.outlineStyle === "solid") {
    expect(snapshot.outlineWidth).toBe("2px");
  }
  expect(snapshot.borderTopWidth).toBe("0px");
  expect(snapshot.borderRightWidth).toBe("0px");
  expect(snapshot.borderBottomWidth).toBe("0px");
  expect(snapshot.borderLeftWidth).toBe("0px");
  expect(snapshot.ringShadow).toMatch(/^(?:0 0 #0000|none)?$/);
  expect(snapshot.ringOffsetShadow).toMatch(/^(?:0 0 #0000|none)?$/);
}

async function expectCleanFieldFocus(locator: Locator) {
  const before = await readFocusArtifactSnapshot(locator);

  await locator.focus();
  await expect(locator).toBeFocused();
  const focused = await readFocusArtifactSnapshot(locator);

  expectNoOutlineRingOrBorder(focused);
  expect(focused.boxShadow).toMatch(
    /^(?:none|(?:rgba\(0, 0, 0, 0\)[^,]*(?:,\s*)?)+)$/,
  );
  const tagName = await locator.evaluate((element) => element.tagName.toLowerCase());
  if (tagName === "textarea") {
    expect(focused.backgroundColor).toBe(before.backgroundColor);
  } else {
    expect(focused.backgroundColor).not.toBe(before.backgroundColor);
  }
}

async function expectCleanControlFocus(locator: Locator) {
  await locator.focus();
  await expect(locator).toBeFocused();
  const focused = await readFocusArtifactSnapshot(locator);

  expectNoOutlineRingOrBorder(focused);
  expect(focused.boxShadow).toContain("inset");
}

function parseRgb(value: string) {
  const hex = value.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    return [
      Number.parseInt(hex[1].slice(0, 2), 16),
      Number.parseInt(hex[1].slice(2, 4), 16),
      Number.parseInt(hex[1].slice(4, 6), 16),
    ] as const;
  }

  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) {
    const oklch = value.match(
      /oklch\(\s*([0-9.]+%?)\s+([0-9.]+)\s+([0-9.]+)/,
    );
    if (oklch) {
      const lightness = oklch[1].endsWith("%")
        ? Number.parseFloat(oklch[1]) / 100
        : Number.parseFloat(oklch[1]);
      const chroma = Number.parseFloat(oklch[2]);
      const hue = (Number.parseFloat(oklch[3]) * Math.PI) / 180;
      const okA = chroma * Math.cos(hue);
      const okB = chroma * Math.sin(hue);
      const lPrime = lightness + 0.3963377774 * okA + 0.2158037573 * okB;
      const mPrime = lightness - 0.1055613458 * okA - 0.0638541728 * okB;
      const sPrime = lightness - 0.0894841775 * okA - 1.291485548 * okB;
      const l = lPrime ** 3;
      const m = mPrime ** 3;
      const s = sPrime ** 3;
      const linear = [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
      ];
      return linear.map((channel) => {
        const value =
          channel <= 0.0031308
            ? 12.92 * channel
            : 1.055 * channel ** (1 / 2.4) - 0.055;
        return Math.round(Math.max(0, Math.min(1, value)) * 255);
      }) as [number, number, number];
    }
    throw new Error(`Expected a parseable color, received ${value}`);
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])] as const;
}

function relativeLuminance([red, green, blue]: readonly number[]) {
  const [r, g, b] = [red, green, blue].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(colorA: string, colorB: string) {
  const first = relativeLuminance(parseRgb(colorA));
  const second = relativeLuminance(parseRgb(colorB));
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

async function readComputedColor(
  locator: Locator,
  property: "backgroundColor" | "color",
) {
  return locator.evaluate((element, cssProperty) => {
    const value = window.getComputedStyle(element)[cssProperty];
    const canvas = element.ownerDocument.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return value;
    context.fillStyle = "#000000";
    context.fillStyle = value;
    return context.fillStyle;
  }, property);
}

async function readOutputColorSnapshot(panel: Locator, text: Locator) {
  return {
    panelBackgroundColor: await readComputedColor(panel, "backgroundColor"),
    textColor: await readComputedColor(text, "color"),
  };
}

async function readWarningColorSnapshot(warningText: Locator) {
  return warningText.evaluate((element) => {
    const normalizeColor = (value: string) => {
      const canvas = element.ownerDocument.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return value;
      context.fillStyle = "#000000";
      context.fillStyle = value;
      return context.fillStyle;
    };
    const panel = element.closest(".mw-surface") ?? element;
    const text = element.closest("p") ?? element;
    return {
      panelBackgroundColor: normalizeColor(
        window.getComputedStyle(panel).backgroundColor,
      ),
      textColor: normalizeColor(window.getComputedStyle(text).color),
    };
  });
}

async function expectStableReadableOutputPanel({
  focusTarget,
  panel,
  text,
}: {
  focusTarget?: Locator;
  panel: Locator;
  text: Locator;
}) {
  const before = await readOutputColorSnapshot(panel, text);
  expect(
    contrastRatio(before.panelBackgroundColor, before.textColor),
  ).toBeGreaterThan(7);

  await panel.hover();
  if (focusTarget) {
    await focusTarget.focus();
    await expect(focusTarget).toBeFocused();
    await focusTarget.click();
  } else {
    await panel.click();
  }

  const after = await readOutputColorSnapshot(panel, text);
  expect(after.panelBackgroundColor).toBe(before.panelBackgroundColor);
  expect(after.textColor).toBe(before.textColor);
  expect(
    contrastRatio(after.panelBackgroundColor, after.textColor),
  ).toBeGreaterThan(7);
}

function strobeWarning(page: Page) {
  return page
    .getByText("Strobe warning: flashing light may be uncomfortable", {
      exact: false,
    })
    .filter({ visible: true });
}

function flashLightButton(page: Page) {
  return page.locator("button:visible").filter({ hasText: "Flash Light" }).first();
}

async function revealFlashLightButton(page: Page) {
  const flashButton = flashLightButton(page);
  if (await flashButton.isVisible().catch(() => false)) return flashButton;

  const advancedButton = page
    .getByRole("button", { name: /Show advanced/ })
    .first();
  if (await advancedButton.isVisible().catch(() => false)) {
    await advancedButton.click();
  }
  await expect(flashButton).toBeVisible();
  return flashButton;
}

async function setFlashLightButton(page: Page, pressed: boolean) {
  await expect(async () => {
    const flashButton = await revealFlashLightButton(page);
    await expect(flashButton).toBeEnabled({ timeout: 1_000 });
    if ((await flashButton.getAttribute("aria-pressed")) !== String(pressed)) {
      await flashButton.click();
    }
    await expect(flashLightButton(page)).toHaveAttribute(
      "aria-pressed",
      String(pressed),
      { timeout: 1_000 },
    );
  }).toPass({ timeout: 15_000 });
}

test("shared UI control primitives keep accessibility and disabled-state contracts", () => {
  for (const filePath of sharedComponentFiles) {
    expect(fs.existsSync(path.join(ROOT, filePath)), filePath).toBe(true);
  }

  const appCss = readRepoFile("app/app.css");
  expect(appCss).toMatch(
    /\.mw-page-content\s+:where\(input:not\(\[type="range"\]\), select\):focus-visible/,
  );
  expect(appCss).toMatch(
    /background-color: var\(--mw-focus-field-bg\) !important;/,
  );
  expect(appCss).toMatch(
    /\.mw-page-content\s+:where\(input\[type="range"\]\):focus-visible/,
  );
  expect(appCss).toMatch(
    /\.mw-page-content\s+:where\(\.mw-panel-dark, \.mw-output-panel\):where\(:hover, :focus-within\)/,
  );
  expect(appCss).toMatch(
    /:where\(\s*textarea\[readonly\],\s*textarea\[readonly\]:focus,\s*textarea\[readonly\]:focus-visible\s*\)\s*\{[^}]*background-color: transparent !important;/s,
  );
  expect(appCss).toMatch(/textarea\.mw-stable-textarea:focus-visible\s*\{[^}]*background-color: transparent !important;/s);
  expect(appCss).toMatch(/--mw-focus-control-inset:/);
  expect(appCss).toMatch(/:focus-visible\s*\{[^}]*outline:\s*2px/s);

  const togglePill = readRepoFile(
    "app/client/components/shared/ui/TogglePill.tsx",
  );
  expect(togglePill).toContain("toolControlButtonClass");
  expect(togglePill).toContain("aria-pressed={checked}");
  expect(togglePill).toContain("aria-describedby={describedBy}");
  expect(togglePill).toContain("disabled={disabled}");
  expect(togglePill).toContain("onChange(!checked)");

  const flashSafety = readRepoFile(
    "app/client/components/shared/useFlashSafety.ts",
  );
  expect(flashSafety).toContain("shouldShowWholePageFlashWarning");
  expect(flashSafety).toContain("fullPageFlash && flashEnabled");

  const sliderRow = readRepoFile(
    "app/client/components/shared/ui/SliderRow.tsx",
  );
  expect(sliderRow).toContain("React.useId()");
  expect(sliderRow).toContain("htmlFor={inputId}");
  expect(sliderRow).toContain('type="range"');
  expect(sliderRow).toContain("disabled={disabled}");
  expect(sliderRow).toContain("cursor-not-allowed");

  const statusMessage = readRepoFile(
    "app/client/components/shared/ui/StatusMessage.tsx",
  );
  expect(statusMessage).toContain('role={kind === "error" ? "alert"');
  expect(statusMessage).toContain('aria-live={live && kind !== "error"');
});

test("targeted routes reuse shared controls instead of route-local copies", () => {
  for (const filePath of routeControlFiles) {
    const source = readRepoFile(filePath);
    expect(source, filePath).not.toContain("function TogglePill(");
    expect(source, filePath).not.toContain("function SliderRow(");
    expect(source, filePath).not.toMatch(
      /fullPageFlash\s*&&[\s\S]{0,80}player\.state/,
    );
    expect(source, filePath).not.toContain(
      'style={{ accentColor: "#38bdf8" }}',
    );
  }
});

test("homepage-equivalent playback routes keep Sound, Repeat, and Flash Light outside advanced settings", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/audio",
    "/morse-code-sound-generator",
    "/morse-code-mp3-generator",
    "/morse-code-audio-practice",
    "/morse-code-audio-quiz",
  ]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    for (const name of ["Sound", "Repeat", "Flash Light"]) {
      const control = page.getByRole("button", { name, exact: true });
      await expect(control, `${route}: ${name}`).toHaveCount(1);
      await expect(control).toBeVisible();
      expect(
        await control.evaluate((element) => Boolean(element.closest("details"))),
        `${route}: ${name} should remain in the primary playback controls`,
      ).toBe(false);
    }
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
      await expect(page.getByTestId("mw-flash-lamp")).toHaveCount(0);
    });
  }

  test("whole-page flash warning stays readable in dark mode on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/audio", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await page.evaluate(() => {
      window.localStorage.setItem("morsewords-theme", "dark");
      window.localStorage.setItem("morsewords-full-page-flash", "1");
      document.documentElement.dataset.theme = "dark";
      document.documentElement.dataset.flashEffects = "enabled";
      document.documentElement.dataset.fullPageFlash = "enabled";
      window.dispatchEvent(
        new CustomEvent("morsewords:display-settings-change", {
          detail: {
            showAmbientMorse: true,
            disableFlashEffects: false,
            fullPageFlash: true,
          },
        }),
      );
    });
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.dataset.fullPageFlash),
      )
      .toBe("enabled");

    await setFlashLightButton(page, true);

    const warning = strobeWarning(page);
    await expect(warning).toBeVisible();
    const warningColors = await readWarningColorSnapshot(warning.first());
    expect(
      contrastRatio(
        warningColors.panelBackgroundColor,
        warningColors.textColor,
      ),
    ).toBeGreaterThan(4.5);

    const horizontalOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(horizontalOverflow).toBeLessThanOrEqual(1);
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
  });

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

  test("shared route controls have clean keyboard focus states", async ({
    page,
  }) => {
    await page.goto("/morse-code-word-trainer", {
      waitUntil: "domcontentloaded",
    });
    await waitForRouteReady(page);

    const answerField = page.getByLabel("Your answer").first();
    await expect(answerField).toBeEnabled();
    await expectCleanFieldFocus(answerField);

    const speed = page.getByLabel("Character speed").first();
    await expectCleanFieldFocus(speed);

    const revealButton = page.getByRole("button", { name: "Reveal answer" });
    await expect(revealButton).toBeEnabled();
    await expectCleanControlFocus(revealButton);
  });

  test("homepage, book translator, audio, MP3, and separator controls avoid focus artifacts", async ({
    page,
  }) => {
    const cases = [
      { route: "/", label: "Input (Text)" },
      {
        route: "/morse-code-book-translator",
        label: "Paste long-form source text",
      },
      { route: "/audio", label: "Input (Text)" },
      {
        route: "/morse-code-mp3-generator",
        label: "Message to turn into MP3 audio",
      },
      { route: "/morse-code-word-separator", label: "Paste Morse" },
    ] as const;

    for (const item of cases) {
      await page.goto(item.route, { waitUntil: "domcontentloaded" });
      await waitForRouteReady(page);

      const field = page.getByLabel(item.label).first();
      await expect(field, `${item.route} focused field`).toBeVisible();
      await expectCleanFieldFocus(field);
    }

    await page.goto("/morse-code-book-translator", {
      waitUntil: "domcontentloaded",
    });
    await waitForRouteReady(page);
    await expectCleanControlFocus(
      page.getByRole("button", {
        name: /^(Upload a book source file|Replace book source file)$/,
      }),
    );

    await page.goto("/audio", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    const audioAdvanced = page.getByRole("button", {
      name: "Show advanced settings",
    });
    await expect(audioAdvanced).toBeEnabled();
    await expectCleanControlFocus(
      audioAdvanced,
    );

    await page.goto("/morse-code-sound-generator", {
      waitUntil: "domcontentloaded",
    });
    await waitForRouteReady(page);
    const soundAdvanced = page.getByRole("button", {
      name: "Show advanced settings",
    });
    await expect(soundAdvanced).toBeEnabled();
    await expectCleanControlFocus(
      soundAdvanced,
    );

    await page.goto("/morse-code-mp3-generator", {
      waitUntil: "domcontentloaded",
    });
    await waitForRouteReady(page);
    const mp3Advanced = page.getByRole("button", {
      name: "Show advanced settings",
    });
    await expect(mp3Advanced).toBeEnabled();
    await mp3Advanced.click();
    await expectCleanFieldFocus(page.getByLabel("Sample rate").first());
  });

  test("output panels stay dark and readable on hover, click, and focus", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await page.getByLabel("Input (Text)").fill("HELLO WORLD");
    const homeOutput = page.locator("#mw_output");
    await expect(homeOutput).toHaveValue(/\.{4}/);
    await expectStableReadableOutputPanel({
      focusTarget: homeOutput,
      panel: homeOutput.locator(
        "xpath=ancestor::div[contains(@class, 'mw-panel-dark')][1]",
      ),
      text: homeOutput,
    });

    await page.goto("/audio", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await page.getByLabel("Input (Text)").fill("HELLO WORLD");
    const audioPanel = page
      .locator(".mw-output-panel")
      .filter({ hasText: "Output (Morse)" })
      .first();
    await expect(audioPanel).toBeVisible();
    await expectStableReadableOutputPanel({
      panel: audioPanel,
      text: audioPanel.locator("pre").first(),
    });

    await page.goto("/morse-code-mp3-generator", {
      waitUntil: "domcontentloaded",
    });
    await waitForRouteReady(page);
    const mp3Output = page.getByLabel("Generated Morse output");
    await expect(mp3Output).toBeVisible();
    await expectStableReadableOutputPanel({
      focusTarget: mp3Output,
      panel: mp3Output.locator("xpath=ancestor::div[contains(@class, 'mw-output-panel')][1]"),
      text: mp3Output,
    });

    await page.goto("/morse-code-video-generator", {
      waitUntil: "domcontentloaded",
    });
    await waitForRouteReady(page);
    const videoOutput = page.getByLabel("Generated Morse output");
    await expect(videoOutput).toBeVisible();
    await expectStableReadableOutputPanel({
      focusTarget: videoOutput,
      panel: videoOutput.locator("xpath=ancestor::div[contains(@class, 'mw-output-panel')][1]"),
      text: videoOutput,
    });

    await page.goto("/morse-code-word-separator", {
      waitUntil: "domcontentloaded",
    });
    await waitForRouteReady(page);
    await page.getByLabel("Paste Morse").fill(".... . .-.. .-.. ---");
    const separatorPanel = page.locator(".mw-output-panel").first();
    await expect(separatorPanel).toBeVisible();
    await expectStableReadableOutputPanel({
      panel: separatorPanel,
      text: separatorPanel.locator("pre").first(),
    });

    await page.goto("/morse-code-book-translator", {
      waitUntil: "domcontentloaded",
    });
    await waitForRouteReady(page);
    const bookSource = page.getByLabel("Paste long-form source text");
    const bookPanel = page
      .locator(
        "section[aria-label='Book source review and download tool'] .mw-output-panel",
      )
      .filter({ hasText: "Morse preview" })
      .first();
    await expect(async () => {
      await bookSource.fill("HELLO WORLD SOS HELP");
      await expect(bookSource).toHaveValue("HELLO WORLD SOS HELP", {
        timeout: 1_000,
      });
      await expect(bookPanel).toBeVisible({ timeout: 1_000 });
      await expect(bookPanel.locator("pre").first()).toBeVisible({
        timeout: 1_000,
      });
    }).toPass({ timeout: 15_000 });
    await expectStableReadableOutputPanel({
      panel: bookPanel,
      text: bookPanel.locator("pre").first(),
    });
  });

  test("disabled controls remain disabled and do not look clickable", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const stopButton = page.getByRole("button", { name: /Stop/i }).first();
    await expect(stopButton).toBeDisabled();
    await expect(stopButton).toHaveCSS("cursor", "not-allowed");
    await expect(stopButton).not.toHaveAttribute("aria-pressed", "true");
  });
});
