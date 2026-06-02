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
      { route: "/morse-code-book-translator", label: "Paste long-form source text" },
      { route: "/audio", label: "Input (Text)" },
      { route: "/morse-code-mp3-generator", label: "Message to turn into MP3 audio" },
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
