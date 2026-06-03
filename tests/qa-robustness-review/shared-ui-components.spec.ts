import { expect, test, type Locator, type Page } from "@playwright/test";
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
  expect(snapshot.outlineStyle).toBe("none");
  if (snapshot.outlineStyle !== "none") {
    expect(snapshot.outlineWidth).toBe("0px");
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
  expect(focused.boxShadow).toBe("none");
  expect(focused.backgroundColor).not.toBe(before.backgroundColor);
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
  return page.getByRole("button", { name: "Flash Light" }).first();
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

test("shared UI control primitives keep accessibility and disabled-state contracts", () => {
  for (const filePath of sharedComponentFiles) {
    expect(fs.existsSync(path.join(ROOT, filePath)), filePath).toBe(true);
  }

  const appCss = readRepoFile("app/app.css");
  expect(appCss).toMatch(
    /\.mw-page-content\s+:where\(input:not\(\[type="range"\]\), textarea, select\):focus-visible/,
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
    /:where\(textarea\[readonly\], textarea\[readonly\]:focus, textarea\[readonly\]:focus-visible\)\s*\{[^}]*background-color: transparent !important;/s,
  );
  expect(appCss).toMatch(/--mw-focus-control-inset:/);
  expect(appCss).not.toMatch(/:focus-visible\s*\{[^}]*outline:\s*2px/s);

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

  test("whole-page flash warning stays readable in dark mode on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.localStorage.setItem("morsewords-theme", "dark");
      window.localStorage.setItem("morsewords-full-page-flash", "1");
      document.documentElement.dataset.theme = "dark";
    });
    await page.goto("/audio", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const flashButton = await revealFlashLightButton(page);
    await flashButton.click();

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
      page.getByRole("button", { name: "Upload a book source file" }),
    );

    await page.goto("/audio", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    let tonePreset = page.getByLabel("Tone preset").first();
    if (!(await tonePreset.isVisible())) {
      await page.getByRole("button", { name: /Show advanced/i }).click();
      tonePreset = page.getByLabel("Tone preset").first();
    }
    await expectCleanFieldFocus(tonePreset);

    await page.goto("/morse-code-sound-generator", {
      waitUntil: "domcontentloaded",
    });
    await waitForRouteReady(page);
    tonePreset = page.getByLabel("Tone preset").first();
    if (!(await tonePreset.isVisible())) {
      await page.getByRole("button", { name: /Show advanced/i }).click();
      tonePreset = page.getByLabel("Tone preset").first();
    }
    await expectCleanFieldFocus(tonePreset);

    await page.goto("/morse-code-mp3-generator", {
      waitUntil: "domcontentloaded",
    });
    await waitForRouteReady(page);
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
    await page
      .getByLabel("Paste long-form source text")
      .fill("HELLO WORLD SOS HELP");
    const bookPanel = page
      .locator(
        "section[aria-label='Book source review and download tool'] .mw-output-panel",
      )
      .filter({ hasText: "Morse preview" })
      .first();
    await expect(bookPanel).toBeVisible();
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
