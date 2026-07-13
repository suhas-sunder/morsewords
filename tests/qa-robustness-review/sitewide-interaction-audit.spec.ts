import fs from "node:fs";
import path from "node:path";

import { expect, test, type Browser, type Page } from "@playwright/test";

import { waitForRouteReady } from "./helpers";

const ROOT = process.cwd();
const SITEMAP_PATH = path.join(ROOT, "public", "sitemap.xml");
const EXPECTED_CANONICAL_ROUTE_COUNT = 1_708;
const RUN_EXHAUSTIVE = process.env.RUN_EXHAUSTIVE_INTERACTION_AUDIT === "1";
const CHUNK_COUNT = Math.max(1, Number(process.env.INTERACTION_AUDIT_CHUNKS ?? "1"));
const CHUNK_INDEX = Math.max(0, Number(process.env.INTERACTION_AUDIT_CHUNK ?? "0"));
const AUDIT_WORKER_COUNT = Math.min(
  2,
  Math.max(1, Number(process.env.INTERACTION_AUDIT_WORKERS ?? "1")),
);
const ROUTE_PATH_FILTER = process.env.INTERACTION_AUDIT_ROUTE_PATHS
  ?.split(",")
  .map((route) => route.trim())
  .filter(Boolean);

const INTERACTION_PRIMITIVE_AUDIT_COVERAGE = [
  "app/client/components/shared/ToolWorkspace.tsx",
  "app/client/components/shared/ActionControls.tsx",
  "app/client/components/shared/ui/SliderRow.tsx",
  "app/client/components/shared/ui/TogglePill.tsx",
  "app/client/components/shared/AudioSettingsPanel.tsx",
  "app/client/components/navigation/ThemeToggle.tsx",
  "app/client/components/navigation/DisplaySettingsToggle.tsx",
] as const;

const EXPECTED_SOURCE_INTERACTION_INVENTORY: Readonly<Record<string, number>> = {
  "app/client/components/audio/MorseAudioTranslator.tsx": 16,
  "app/client/components/audio/mp3Export.ts": 1,
  "app/client/components/content/MorseAnswerCard.tsx": 1,
  "app/client/components/content/MorseContentSections.tsx": 1,
  "app/client/components/content/NameToMorseTool.tsx": 2,
  "app/client/components/dictionary/DictionarySections.tsx": 17,
  "app/client/components/morse-code-audio-decoder/MorseAudioDecoderTool.tsx": 11,
  "app/client/components/morse-code-book-translator/BookTranslatorTool.tsx": 61,
  "app/client/components/morse-code-books/MorseBookPage.tsx": 36,
  "app/client/components/morse-code-books/MorseBookPagination.tsx": 6,
  "app/client/components/morse-code-books/PrintableMorsePages.tsx": 12,
  "app/client/components/morse-code-by-language/MorseCodeByLanguagePages.tsx": 6,
  "app/client/components/morse-code-mp3-generator/MorseMp3GeneratorTool.tsx": 12,
  "app/client/components/morse-code-reader/MorseCodeReaderTool.tsx": 2,
  "app/client/components/morse-code-sentence-practice/SentencePracticePage.tsx": 21,
  "app/client/components/morse-code-sound-generator/MorseAudioTranslator.tsx": 16,
  "app/client/components/morse-code-test/MorseCodeTestAssessment.tsx": 6,
  "app/client/components/morse-code-video-generator/MorseVideoGeneratorTool.tsx": 23,
  "app/client/components/morse-code-word-separator/WordSeparatorTool.tsx": 9,
  "app/client/components/morse-code-words/MorsePhraseLookupTable.tsx": 3,
  "app/client/components/navigation/DisplaySettingsToggle.tsx": 12,
  "app/client/components/navigation/NavBar.tsx": 13,
  "app/client/components/navigation/RelatedTools.tsx": 2,
  "app/client/components/navigation/ThemeToggle.tsx": 3,
  "app/client/components/other/MorseQuiz.tsx": 12,
  "app/client/components/practice/PracticeControls.tsx": 11,
  "app/client/components/practice/PracticePage.tsx": 20,
  "app/client/components/practice/ShareResultsButton.tsx": 3,
  "app/client/components/shared/ActionControls.tsx": 5,
  "app/client/components/shared/AudioPresetPicker.tsx": 1,
  "app/client/components/shared/AudioSettingsPanel.tsx": 1,
  "app/client/components/shared/Button.tsx": 1,
  "app/client/components/shared/FaqSectionGeneric.tsx": 2,
  "app/client/components/shared/MorseLearningLayout.tsx": 2,
  "app/client/components/shared/ToggleChip.tsx": 2,
  "app/client/components/shared/ToolWorkspace.tsx": 8,
  "app/client/components/shared/TranslatorSectionsBasic.tsx": 24,
  "app/client/components/shared/export/AudioExportFormatSplitControls.tsx": 6,
  "app/client/components/shared/export/ExportPlanStatus.tsx": 3,
  "app/client/components/shared/ui/SliderRow.tsx": 1,
  "app/client/components/shared/ui/TogglePill.tsx": 3,
  "app/client/components/shared/video/MorseVideoPreviewControls.tsx": 18,
  "app/client/components/typing/TypingControls.tsx": 4,
  "app/client/components/typing/TypingPage.tsx": 26,
  "app/client/components/typing/components/ShareResultsButton.tsx": 3,
  "app/routes/contact.tsx": 9,
  "app/routes/dictionary.tsx": 3,
  "app/routes/morse-code-audio-practice.tsx": 22,
  "app/routes/morse-code-audio-quiz.tsx": 20,
  "app/routes/morse-code-audiobooks.tsx": 7,
  "app/routes/morse-code-books.tsx": 7,
  "app/routes/morse-code-chart.tsx": 1,
  "app/routes/morse-code-international-translator.tsx": 3,
  "app/routes/morse-code-printable-chart.tsx": 23,
  "app/routes/morse-code-visual-practice.tsx": 5,
  "app/routes/morse-code-visual-quiz.tsx": 12,
  "app/routes/morse-code-word-search-builder.tsx": 19,
  "app/routes/morse-code-word-trainer.tsx": 27,
};

const SOURCE_INTERACTION_PATTERN =
  /<\s*(?:button|input|textarea|select|summary|details)\b|\bon(?:Click|PointerDown|MouseDown|KeyDown)=|\b(?:tabIndex|contentEditable)=|\brole="(?:button|slider|switch|tab|checkbox|radio|menuitem)"|\baria-(?:pressed|selected|expanded|disabled)=/g;

type AuditMode = {
  name: string;
  theme: "light" | "dark";
  viewport: { width: number; height: number };
};

const AUDIT_MODES: readonly AuditMode[] = [
  { name: "light-desktop", theme: "light", viewport: { width: 1440, height: 1000 } },
  { name: "dark-desktop", theme: "dark", viewport: { width: 1440, height: 1000 } },
  { name: "light-mobile", theme: "light", viewport: { width: 390, height: 844 } },
  { name: "dark-mobile", theme: "dark", viewport: { width: 390, height: 844 } },
];

function sitemapPaths() {
  const xml = fs.readFileSync(SITEMAP_PATH, "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    new URL(match[1]).pathname,
  );
}

function chunkPaths(paths: readonly string[]) {
  if (CHUNK_INDEX >= CHUNK_COUNT) {
    throw new Error(`Interaction audit chunk ${CHUNK_INDEX} is outside 0-${CHUNK_COUNT - 1}.`);
  }
  return paths.filter((_, index) => index % CHUNK_COUNT === CHUNK_INDEX);
}

test("source interactive inventory keeps shared primitives explicitly covered", () => {
  const sourceFiles = fs
    .readdirSync(path.join(ROOT, "app"), { recursive: true })
    .filter((entry): entry is string => typeof entry === "string" && /\.(tsx?|jsx?)$/.test(entry));
  const sourceInventory = Object.fromEntries(sourceFiles.map((relativePath) => {
    const source = fs.readFileSync(path.join(ROOT, "app", relativePath), "utf8");
    return [
      path.join("app", relativePath).replaceAll(path.sep, "/"),
      source.match(SOURCE_INTERACTION_PATTERN)?.length ?? 0,
    ];
  }).filter(([, count]) => count > 0));
  const sourceOccurrences = Object.values(sourceInventory).reduce(
    (total, count) => total + count,
    0,
  );

  expect(sourceInventory).toEqual(EXPECTED_SOURCE_INTERACTION_INVENTORY);
  expect(sourceOccurrences).toBe(606);
  for (const filePath of INTERACTION_PRIMITIVE_AUDIT_COVERAGE) {
    expect(fs.existsSync(path.join(ROOT, filePath)), filePath).toBe(true);
  }
  expect(fs.readFileSync(path.join(ROOT, "app", "app.css"), "utf8")).toContain(
    "--mw-focus-visible",
  );
});

test("exhaustive canonical route interaction audit", async ({ browser }) => {
  test.skip(!RUN_EXHAUSTIVE, "Run explicitly with RUN_EXHAUSTIVE_INTERACTION_AUDIT=1.");
  test.setTimeout(0);

  const allPaths = sitemapPaths();
  expect(allPaths).toHaveLength(EXPECTED_CANONICAL_ROUTE_COUNT);
  const paths = ROUTE_PATH_FILTER?.length
    ? allPaths.filter((route) => ROUTE_PATH_FILTER.includes(route))
    : chunkPaths(allPaths);
  if (ROUTE_PATH_FILTER?.length) {
    expect(paths).toHaveLength(ROUTE_PATH_FILTER.length);
  }
  const violations: string[] = [];
  let interactiveInstances = 0;
  const result = await auditPaths(browser, paths);
  violations.push(...result.violations);
  interactiveInstances += result.interactiveInstances;

  console.log(
    `[interaction-audit] complete chunk ${CHUNK_INDEX + 1}/${CHUNK_COUNT}; routes=${paths.length}; instances=${interactiveInstances}; violations=${violations.length}`,
  );
  expect(violations, violations.slice(0, 40).join("\n")).toEqual([]);
});

async function auditPaths(browser: Browser, paths: readonly string[]) {
  const buckets = Array.from({ length: AUDIT_WORKER_COUNT }, () => [] as string[]);
  paths.forEach((route, index) => buckets[index % buckets.length].push(route));
  const results = await Promise.all(
    buckets.filter((bucket) => bucket.length > 0).map((bucket, index) =>
      auditRouteBucket(browser, bucket, index + 1),
    ),
  );
  return {
    interactiveInstances: results.reduce(
      (total, result) => total + result.interactiveInstances,
      0,
    ),
    violations: results.flatMap((result) => result.violations),
  };
}

async function auditRouteBucket(
  browser: Browser,
  paths: readonly string[],
  workerIndex: number,
) {
  const context = await createAuditContext(browser);
  const page = await context.newPage();
  const violations: string[] = [];
  let interactiveInstances = 0;
  try {
    for (const [routeIndex, routePath] of paths.entries()) {
      try {
        await page.goto(routePath, { waitUntil: "domcontentloaded", timeout: 60_000 });
        await waitForRouteReady(page);
        await suppressAuditMotion(page);
        for (const mode of AUDIT_MODES) {
          await applyAuditMode(page, mode);
          const result = await inspectRoute(page);
          interactiveInstances += result.instanceCount;
          violations.push(
            ...result.violations.map(
              (violation) => `${mode.name} ${routePath}: ${violation}`,
            ),
          );
        }
      } catch (error) {
        violations.push(`route ${routePath}: navigation audit failed: ${String(error)}`);
      }
      if ((routeIndex + 1) % 25 === 0 || routeIndex + 1 === paths.length) {
        console.log(
          `[interaction-audit] worker ${workerIndex} routes ${routeIndex + 1}/${paths.length}`,
        );
      }
    }
  } finally {
    await context.close();
  }
  return { interactiveInstances, violations };
}

async function createAuditContext(browser: Browser) {
  const context = await browser.newContext({ viewport: AUDIT_MODES[0].viewport });
  await context.addInitScript(() => {
    localStorage.setItem("morsewords-theme", "light");
    document.documentElement.dataset.theme = "light";
  });
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname !== "127.0.0.1" && url.hostname !== "localhost") {
      await route.abort("blockedbyclient");
      return;
    }
    await route.continue();
  });
  return context;
}

async function applyAuditMode(page: Page, mode: AuditMode) {
  await page.setViewportSize(mode.viewport);
  await page.evaluate((theme) => {
    localStorage.setItem("morsewords-theme", theme);
    document.cookie = `morsewords-theme=${theme}; Path=/; SameSite=Lax`;
    document.documentElement.dataset.theme = theme;
    window.dispatchEvent(
      new CustomEvent("morsewords:theme-mode-change", { detail: theme }),
    );
  }, mode.theme);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      }),
  );
}

async function suppressAuditMotion(page: Page) {
  await page.evaluate(() => {
    if (document.getElementById("mw-interaction-audit-motion")) return;
    const style = document.createElement("style");
    style.id = "mw-interaction-audit-motion";
    style.textContent = `*, *::before, *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }`;
    document.head.append(style);
  });
}

async function inspectRoute(page: Page) {
  return page.evaluate(() => {
    const colorCanvas = document.createElement("canvas");
    colorCanvas.width = 1;
    colorCanvas.height = 1;
    const colorContext = colorCanvas.getContext("2d", { willReadFrequently: true });
    const selector = [
      "a[href]",
      "button",
      "input",
      "textarea",
      "select",
      "summary",
      "[role=button]",
      "[role=checkbox]",
      "[role=radio]",
      "[role=slider]",
      "[role=switch]",
      "[role=tab]",
      "[role=menuitem]",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");
    const isVisible = (element: Element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    };
    const isVisuallyHidden = (element: Element) => {
      const style = getComputedStyle(element);
      return (
        style.clip !== "auto" ||
        style.clipPath !== "none" ||
        (style.position === "absolute" &&
          Number.parseFloat(style.width) <= 1 &&
          Number.parseFloat(style.height) <= 1 &&
          style.overflow === "hidden")
      );
    };
    const effectiveName = (element: HTMLElement) => {
      const labelledBy = element.getAttribute("aria-labelledby");
      if (labelledBy) {
        const label = labelledBy
          .split(/\s+/)
          .map((id) => document.getElementById(id)?.textContent?.trim() ?? "")
          .join(" ")
          .trim();
        if (label) return label;
      }
      return (
        element.getAttribute("aria-label") ??
        (element as HTMLInputElement).labels?.[0]?.textContent?.trim() ??
        element.getAttribute("title") ??
        element.getAttribute("placeholder") ??
        element.textContent?.replace(/\s+/g, " ").trim() ??
        ""
      );
    };
    const parseColor = (value: string) => {
      const match = value.match(/rgba?\(([^)]+)\)/);
      if (match) {
        const parts = match[1].replace("/", " ").trim().split(/[\s,]+/).map(Number);
        if (parts.length >= 3 && parts.slice(0, 3).every(Number.isFinite)) {
          return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
        }
      }
      if (!colorContext) return null;
      colorContext.clearRect(0, 0, 1, 1);
      colorContext.fillStyle = value;
      colorContext.fillRect(0, 0, 1, 1);
      const [r, g, b, alpha] = colorContext.getImageData(0, 0, 1, 1).data;
      return alpha > 0 ? { r, g, b, a: alpha / 255 } : null;
    };
    const blend = (foreground: NonNullable<ReturnType<typeof parseColor>>, background: NonNullable<ReturnType<typeof parseColor>>) => ({
      r: foreground.r * foreground.a + background.r * (1 - foreground.a),
      g: foreground.g * foreground.a + background.g * (1 - foreground.a),
      b: foreground.b * foreground.a + background.b * (1 - foreground.a),
      a: 1,
    });
    const backgroundFor = (element: Element) => {
      let current: Element | null = element;
      const layers: NonNullable<ReturnType<typeof parseColor>>[] = [];
      // Computed backgrounds are reported per element. Paint starts at the
      // page surface, then each ancestor, and finally the control itself.
      // Reversing this child-to-parent walk keeps translucent panels honest.
      while (current) {
        const parsed = parseColor(getComputedStyle(current).backgroundColor);
        if (parsed && parsed.a > 0) layers.push(parsed);
        current = current.parentElement;
      }
      let background = { r: 245, g: 242, b: 235, a: 1 };
      for (const layer of layers.reverse()) {
        background = blend(layer, background);
      }
      return background;
    };
    const luminance = (color: { r: number; g: number; b: number }) =>
      [color.r, color.g, color.b]
        .map((value) => {
          const channel = value / 255;
          return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        })
        .reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
    const contrast = (foreground: NonNullable<ReturnType<typeof parseColor>>, background: ReturnType<typeof backgroundFor>) => {
      const first = luminance(blend(foreground, background));
      const second = luminance(background);
      return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
    };

    const violations: string[] = [];
    const controls = [...document.querySelectorAll<HTMLElement>(selector)].filter(isVisible);
    for (const control of controls) {
      const name = effectiveName(control);
      const style = getComputedStyle(control);
      const role = control.getAttribute("role") ?? control.tagName.toLowerCase();
      if (!name && (control as HTMLInputElement).type !== "hidden") {
        violations.push(`unnamed ${role}`);
      }
      const inputType = (control as HTMLInputElement).type;
      const isGraphicalControl =
        role === "slider" || ["range", "checkbox", "radio"].includes(inputType);
      if (!isVisuallyHidden(control) && !isGraphicalControl) {
        const foreground = parseColor(style.color);
        const isLargeText =
          Number.parseFloat(style.fontSize) >= 24 ||
          (Number.parseFloat(style.fontSize) >= 18.66 && Number.parseInt(style.fontWeight, 10) >= 700);
        const minimumContrast = isLargeText ? 3 : 4.5;
        if (foreground && contrast(foreground, backgroundFor(control)) < minimumContrast) {
          violations.push(`low control contrast ${role} ${name || "(unnamed)"}`);
        }
      }
      if (!isVisuallyHidden(control) && isGraphicalControl) {
        const trackBackground = backgroundFor(control);
        const visibleSignals = role === "slider"
          ? [...control.querySelectorAll<HTMLElement>("[aria-hidden='true']")]
              .filter(isVisible)
              .map((signal) => parseColor(getComputedStyle(signal).backgroundColor))
              .filter((color): color is NonNullable<ReturnType<typeof parseColor>> => Boolean(color))
          : [parseColor(style.accentColor)].filter(
              (color): color is NonNullable<ReturnType<typeof parseColor>> => Boolean(color),
            );
        if (!visibleSignals.some((signal) => contrast(signal, trackBackground) >= 3)) {
          violations.push(`low control contrast ${role} ${name || "(unnamed)"}`);
        }
      }
      if ((control as HTMLInputElement).type === "range") {
        const input = control as HTMLInputElement;
        const min = Number(input.min);
        const max = Number(input.max);
        const value = Number(input.value);
        const step = Number(input.step || "1");
        if (![min, max, value, step].every(Number.isFinite) || min > max || step <= 0 || value < min || value > max) {
          violations.push(`invalid range bounds ${name || "(unnamed)"}`);
        }
      }
      if (control.matches("textarea[readonly]") && !control.closest(".mw-noneditable-output")) {
        violations.push(`uncovered read-only textarea ${name || "(unnamed)"}`);
      }
    }
    const root = document.documentElement;
    if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) {
      violations.push("horizontal overflow");
    }
    return { instanceCount: controls.length, violations, theme: root.dataset.theme };
  });
}
