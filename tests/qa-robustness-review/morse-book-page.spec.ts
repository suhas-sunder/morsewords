import {
  expect,
  test,
  type Locator,
  type Page,
  type TestInfo,
} from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { blockExternalNetwork, waitForRouteReady } from "./helpers";
import {
  buildLivePreviewProgressState,
  hashLivePreviewProgressSignature,
} from "../../app/client/components/morse-code-book-translator/bookLivePreviewProgress";
import { applyExportPunctuationMode } from "../../app/client/components/morse-code-book-translator/bookDurationEstimate";
import {
  DEFAULT_BOOK_EXPORT_SETTINGS,
  sanitizeBookExportSettings,
} from "../../app/client/components/morse-code-book-translator/bookExportPresets";
import { BOOK_CACHE_KEY_PREFIX } from "../../app/client/components/shared/storageRegistry";
import { getMorseBookPublicContentUrls } from "../../app/client/data/morseBookContentConfig";
import {
  getMorseBookCollectionContext,
  getMorseBookContextTitle,
} from "../../app/client/data/morseBookCollectionContext";
import { preserveMorseBookDisplayTitle } from "../../app/client/data/morseBookDisplay";

const ROOT = process.cwd();
const ALICE_SLUG = "alices-adventures-in-wonderland";
const APPROVED_BOOK_SLUG = "treasure-island";
const NETWORK_BOOK_SLUG = "dr-jekyll-and-mr-hyde";
const STALE_CACHE_BOOK_SLUG = "the-call-of-the-wild";
const ERROR_BOOK_SLUG = "the-jungle-book";
const TEST_BOOK_SLUG = "test-published-morse-book";
const ART_OF_WAR_SLUG = "the-art-of-war";
const ANNE_OF_GREEN_GABLES_SLUG = "anne-of-green-gables";
const VIOLET_FAIRY_BOOK_SLUG = "violet-fairy-book";
const THE_WAR_OF_THE_WORLDS_SLUG = "the-war-of-the-worlds";
const ROOM_13_SLUG = "room-13";
const SUN_TZU_ON_THE_ART_OF_WAR_SLUG = "sun-tzu-on-the-art-of-war";
const THE_COUNT_OF_MONTE_CRISTO_SLUG = "the-count-of-monte-cristo";
const THE_HAPPY_FAMILY_SLUG = "the-happy-family";
const THE_ELDERBUSH_SLUG = "the-elderbush";
const THE_BOOK_OF_DRAGONS_SLUG = "the-book-of-dragons";
const THE_EMERALD_CITY_OF_OZ_SLUG = "the-emerald-city-of-oz";
const NEWLY_SUMMARIZED_BOOK_SLUG = "the-new-accelerator";
const BESPOKE_PASS_1_BOOK_SLUG = "five-little-friends";
const BESPOKE_PASS_2_BOOK_SLUG = "the-happy-prince";
const BESPOKE_PASS_3_BOOK_SLUG = "the-sign-of-the-four";
const BESPOKE_PASS_4_BOOK_SLUG = "the-leavenworth-case";
const SHERLOCK_PASS_1_BOOK_SLUG = "a-scandal-in-bohemia";
const SHERLOCK_PASS_2_BOOK_SLUG = "the-adventure-of-the-blue-carbuncle";
const SHERLOCK_ADVENTURES_COLLECTION_TITLE =
  "The Adventures of Sherlock Holmes";
const SHERLOCK_ADVENTURES_FIRST_DISPLAY_TITLE =
  "The Adventures of Sherlock Holmes - Chapter 1: A Scandal in Bohemia";
const SHERLOCK_ADVENTURES_PARENT_ROUTE_FRAGMENT =
  "the-adventures-of-sherlock-holmes";
const SHERLOCK_MIDDLE_BOOK_SLUG = "the-man-with-the-twisted-lip";
const SHERLOCK_LAST_BOOK_SLUG = "the-adventure-of-the-copper-beeches";
const REQUIRED_STORY_TITLES = {
  "the-dream-of-little-tuk": "The Dream of Little Tuk",
  "the-false-collar": "The False Collar",
  "the-naughty-boy": "The Naughty Boy",
  "the-red-shoes": "The Red Shoes",
  "the-shadow": "The Shadow",
  "the-story-of-a-mother": "The Story of a Mother",
  "the-ugly-duckling": "The Ugly Duckling",
  "the-adventure-of-the-blue-carbuncle": "The Adventure of the Blue Carbuncle",
  "the-adventure-of-the-speckled-band": "The Adventure of the Speckled Band",
  "the-adventure-of-the-engineer-s-thumb":
    "The Adventure of the Engineer's Thumb",
  "the-adventure-of-the-noble-bachelor": "The Adventure of the Noble Bachelor",
  "the-adventure-of-the-beryl-coronet": "The Adventure of the Beryl Coronet",
  "the-adventure-of-the-copper-beeches": "The Adventure of the Copper Beeches",
  "the-sign-of-the-four": "The Sign of the Four",
  "the-mysterious-affair-at-styles": "The Mysterious Affair at Styles",
  "the-leavenworth-case": "The Leavenworth Case",
  "ole-luk-oie-the-dream-god": "Ole-Luk-Oie, the Dream-God",
  "little-ida-s-flowers": "Little Ida's Flowers",
  "the-steadfast-tin-soldier": "The Steadfast Tin Soldier",
  "hansel-and-gretel": "Hansel and Gretel",
  "little-red-riding-hood": "Little Red Riding Hood",
  rumpelstiltskin: "Rumpelstiltskin",
  "the-frog-prince": "The Frog-Prince",
  "the-goose-girl": "The Goose-Girl",
  "the-golden-bird": "The Golden Bird",
  "the-bamboo-cutter-and-the-moon-child":
    "The Bamboo-Cutter and the Moon-Child",
  "the-goblin-of-adachigahara": "The Goblin of Adachigahara",
  "the-jelly-fish-and-the-monkey": "The Jelly Fish and the Monkey",
  "the-tongue-cut-sparrow": "The Tongue-Cut Sparrow",
} as const;
const NEWLY_SUMMARIZED_BOOK_PREVIEW_PATH = `/morse-code-books/${NEWLY_SUMMARIZED_BOOK_SLUG}?preview=unpublished`;
const ALICE_PUBLIC_PATH = `/morse-code-books/${ALICE_SLUG}`;
const APPROVED_BOOK_PUBLIC_PATH = `/morse-code-books/${APPROVED_BOOK_SLUG}`;
const NETWORK_BOOK_PUBLIC_PATH = `/morse-code-books/${NETWORK_BOOK_SLUG}`;
const STALE_CACHE_BOOK_PUBLIC_PATH = `/morse-code-books/${STALE_CACHE_BOOK_SLUG}`;
const ERROR_BOOK_PUBLIC_PATH = `/morse-code-books/${ERROR_BOOK_SLUG}`;
const ART_OF_WAR_PUBLIC_PATH = `/morse-code-books/${ART_OF_WAR_SLUG}`;
const ANNE_OF_GREEN_GABLES_PUBLIC_PATH = `/morse-code-books/${ANNE_OF_GREEN_GABLES_SLUG}`;
const THE_WAR_OF_THE_WORLDS_PUBLIC_PATH = `/morse-code-books/${THE_WAR_OF_THE_WORLDS_SLUG}`;
const THE_WAR_OF_THE_WORLDS_AUDIOBOOK_PUBLIC_PATH = `/morse-code-audiobooks/${THE_WAR_OF_THE_WORLDS_SLUG}`;
const THE_DUNWICH_HORROR_PUBLIC_PATH = "/morse-code-books/the-dunwich-horror";
const BESPOKE_PASS_2_BOOK_PUBLIC_PATH = `/morse-code-books/${BESPOKE_PASS_2_BOOK_SLUG}`;
const VIOLET_FAIRY_BOOK_PREVIEW_PATH = `/morse-code-books/${VIOLET_FAIRY_BOOK_SLUG}?preview=unpublished`;
const THE_WAR_OF_THE_WORLDS_PREVIEW_PATH = `/morse-code-books/${THE_WAR_OF_THE_WORLDS_SLUG}?preview=unpublished`;
const ROOM_13_PREVIEW_PATH = `/morse-code-books/${ROOM_13_SLUG}?preview=unpublished`;
const SUN_TZU_ON_THE_ART_OF_WAR_PREVIEW_PATH = `/morse-code-books/${SUN_TZU_ON_THE_ART_OF_WAR_SLUG}?preview=unpublished`;
const THE_COUNT_OF_MONTE_CRISTO_PREVIEW_PATH = `/morse-code-books/${THE_COUNT_OF_MONTE_CRISTO_SLUG}?preview=unpublished`;
const THE_HAPPY_FAMILY_PREVIEW_PATH = `/morse-code-books/${THE_HAPPY_FAMILY_SLUG}?preview=unpublished`;
const THE_ELDERBUSH_PREVIEW_PATH = `/morse-code-books/${THE_ELDERBUSH_SLUG}?preview=unpublished`;
const THE_BOOK_OF_DRAGONS_PREVIEW_PATH = `/morse-code-books/${THE_BOOK_OF_DRAGONS_SLUG}?preview=unpublished`;
const THE_EMERALD_CITY_OF_OZ_PREVIEW_PATH = `/morse-code-books/${THE_EMERALD_CITY_OF_OZ_SLUG}?preview=unpublished`;
const ALICE_AUDIOBOOK_PUBLIC_PATH = `/morse-code-audiobooks/${ALICE_SLUG}`;
const APPROVED_AUDIOBOOK_PUBLIC_PATH = `/morse-code-audiobooks/${APPROVED_BOOK_SLUG}`;
const NETWORK_AUDIOBOOK_PUBLIC_PATH = `/morse-code-audiobooks/${NETWORK_BOOK_SLUG}`;
const STARTER_PREVIEW_FIRST_RENDER_PATHS = [
  "/morse-code-books/the-jungle-book",
  "/morse-code-books/the-willows",
  "/morse-code-books/a-descent-into-the-maelstrom",
  "/morse-code-books/the-great-gatsby",
  "/morse-code-audiobooks/the-jungle-book",
  `/morse-code-books/${BESPOKE_PASS_1_BOOK_SLUG}`,
  `/morse-code-audiobooks/${BESPOKE_PASS_1_BOOK_SLUG}`,
  `/morse-code-books/${BESPOKE_PASS_2_BOOK_SLUG}`,
  `/morse-code-audiobooks/${BESPOKE_PASS_2_BOOK_SLUG}`,
  `/morse-code-books/${BESPOKE_PASS_3_BOOK_SLUG}`,
  `/morse-code-audiobooks/${BESPOKE_PASS_3_BOOK_SLUG}`,
  `/morse-code-books/${BESPOKE_PASS_4_BOOK_SLUG}`,
  `/morse-code-audiobooks/${BESPOKE_PASS_4_BOOK_SLUG}`,
  `/morse-code-books/${SHERLOCK_PASS_1_BOOK_SLUG}`,
  `/morse-code-audiobooks/${SHERLOCK_PASS_1_BOOK_SLUG}`,
  `/morse-code-books/${SHERLOCK_PASS_2_BOOK_SLUG}`,
  `/morse-code-audiobooks/${SHERLOCK_PASS_2_BOOK_SLUG}`,
] as const;
const SOURCE_RISK_REMOVED_BOOK_SLUGS = [
  "a-princess-of-mars",
  "doctor-dolittle",
  "heidi",
  "nights-with-uncle-remus",
  "peter-pan",
  "tarzan-of-the-apes",
  "the-thirty-nine-steps",
  "wood-folk-at-school",
  "jabberwocky",
] as const;
const ALICE_PREVIEW_PATH = `${ALICE_PUBLIC_PATH}?preview=unpublished`;
const TEST_BOOK_PUBLIC_PATH = `/morse-code-books/${TEST_BOOK_SLUG}`;
const TEST_BOOK_PREVIEW_PATH = `${TEST_BOOK_PUBLIC_PATH}?preview=test-published`;
const THEME_STORAGE_KEY = "morsewords-theme";
const TEST_BOOK_RUNTIME_SETTINGS_KEY =
  "morsewords:book-runtime:settings:v1:test-published-morse-book:test-published-v1:test-published-morse-book-content-hash-development-fixture-v1";
const BOOK_RUNTIME_SETTINGS_KEY_PREFIX = "morsewords:book-runtime:settings:v1:";
const BOOK_WORKSPACE_TIMEOUT_MS = 90_000;
const EXPECTED_GENERATED_BOOK_COUNT = (
  JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "app/client/assets/books/generated/library-manifest.json",
      ),
      "utf8",
    ),
  ) as { books: unknown[] }
).books.length;
const TEST_BOOK_LIVE_PREVIEW_PROGRESS_KEY =
  "morsewords:book-live-preview-progress:v1:test-published-morse-book";
const TEST_BOOK_DEFAULT_SECTION_IDS = ["chapter-001", "chapter-002"] as const;
const TEST_BOOK_DEFAULT_SOURCE_TEXT = [
  "CHAPTER I. Signals at Dawn\n\nSOS HELP carried across the practice room. The learner copied each signal, checked the spacing, and tried again with a steadier hand.",
  "CHAPTER II. Evening Copy\n\nMorse practice was shorter tonight. The words came slowly, then clearly, as the tone settled into a calm rhythm.",
].join("\n\n");
const LIVE_PREVIEW_AUDIO_CONTROL_LABELS = [
  "Tone preset",
  "Character speed",
  "Farnsworth spacing",
  "Pitch",
  "Volume",
] as const;

type LivePlayerHookState = {
  bookSlug: string;
  completedSessionId: number | null;
  elapsedMs: number;
  playing: boolean;
  progressRestored: boolean;
  sectionCount: number;
  sectionId: string;
  sectionIndex: number;
  segmentCount: number;
  segmentIndex: number;
  sessionId: number;
};

type LivePlayerCompletionToken = {
  durationMs: number;
  sectionId: string;
  segmentIndex: number;
  sessionId: number;
};

type LivePlayerTestHook = {
  captureCompletion: () => LivePlayerCompletionToken;
  completeCapturedSegment: (token: LivePlayerCompletionToken) => boolean;
  completeCurrentSegmentTwice: () => { first: boolean; second: boolean };
  getState: () => LivePlayerHookState;
  nextSection: () => void;
  restartCurrentSegment: () => void;
  selectSegment: (segmentIndex: number) => void;
  startCurrentSegment: (elapsedMs?: number) => void;
  stopCurrentSegment: (reset?: boolean) => void;
};

type LivePlayerTestWindow = typeof window & {
  __MORSEWORDS_BOOK_LIVE_PLAYER_TEST__?: LivePlayerTestHook;
};

function bookJsonPattern(slug: string) {
  return `**/books/${slug}.json*`;
}

function bookPreviewPattern(slug: string) {
  return `**/book-previews/${slug}.preview.json*`;
}

function readJson<T>(relativePath: string): T {
  return JSON.parse(
    fs.readFileSync(path.join(ROOT, relativePath), "utf8"),
  ) as T;
}

type TestBookManifestSection = {
  id: string;
  label?: string;
  sectionJsonPath?: string;
  title?: string | null;
  includeByDefault: boolean;
};

type TestBookContentFixture = {
  slug: string;
  contentVersion: string;
  contentHash: string;
  manifest: {
    contentVersion: string;
    contentHash: string;
    sections: TestBookManifestSection[];
  };
};

type TestGeneratedBookManifestFixture = {
  title: string;
  author: string[];
  sections: TestBookManifestSection[];
};

type TestGeneratedBookSectionFixture = {
  label: string;
  title: string | null;
  displayText?: string;
  morseSourceText?: string;
};

function defaultSectionIdsFromSections(sections: TestBookManifestSection[]) {
  return sections
    .filter((section) => section.includeByDefault)
    .map((section) => section.id);
}

function readPublicDefaultSectionIds(slug: string) {
  const content = readJson<TestBookContentFixture>(
    `app/client/assets/books/cloudflare-export/books/${slug}.json`,
  );
  return defaultSectionIdsFromSections(content.manifest.sections);
}

function readPublicBookRuntimeSettingsKey(slug: string) {
  const content = readJson<TestBookContentFixture>(
    `app/client/assets/books/cloudflare-export/books/${slug}.json`,
  );
  return `${BOOK_RUNTIME_SETTINGS_KEY_PREFIX}${slug}:${content.manifest.contentVersion}:${content.manifest.contentHash}`;
}

function readPublicBookContentFixture(slug: string) {
  return readJson<TestBookContentFixture>(
    `app/client/assets/books/cloudflare-export/books/${slug}.json`,
  );
}

async function seedAudiobookRuntimeProgress(
  page: Page,
  {
    elapsedMs,
    sectionId,
    slug,
  }: {
    elapsedMs: number;
    sectionId: string;
    slug: string;
  },
) {
  const content = readPublicBookContentFixture(slug);
  const key = readPublicBookRuntimeSettingsKey(slug);
  await page.addInitScript(
    ({ contentHash, contentVersion, elapsedMs, key, sectionId, slug }) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          schemaVersion: 1,
          slug,
          contentVersion,
          contentHash,
          selectionMode: "custom",
          selectedSectionIds: [sectionId],
          exportSettings: {},
          videoSettings: {},
          livePlayer: {
            activeSectionId: sectionId,
            activeSegmentIndex: 0,
            elapsedMs,
            completedSectionIds: [],
          },
        }),
      );
    },
    {
      contentHash: content.manifest.contentHash,
      contentVersion: content.manifest.contentVersion,
      elapsedMs,
      key,
      sectionId,
      slug,
    },
  );
}

function testPublishedLivePreviewProgressContentHash() {
  const exportSettings = sanitizeBookExportSettings(
    DEFAULT_BOOK_EXPORT_SETTINGS,
  );
  const cleanedExportText = applyExportPunctuationMode(
    TEST_BOOK_DEFAULT_SOURCE_TEXT,
    exportSettings,
  );
  return hashLivePreviewProgressSignature(
    JSON.stringify({
      book: {
        contentHash:
          "test-published-morse-book-content-hash-development-fixture-v1",
        contentVersion: "test-published-v1",
        slug: TEST_BOOK_SLUG,
      },
      mode: "book",
      selectedSectionIds: TEST_BOOK_DEFAULT_SECTION_IDS,
      sourceHash: hashLivePreviewProgressSignature(cleanedExportText),
      timing: {
        charWpm: exportSettings.charWpm,
        farnsworthWpm: exportSettings.farnsworthWpm,
        paragraphPauseMultiplier: exportSettings.paragraphPauseMultiplier,
        punctuationMode: exportSettings.punctuationMode,
        sentencePauseMultiplier: exportSettings.sentencePauseMultiplier,
      },
    }),
  );
}

function readGeneratedDefaultSectionIds(slug: string) {
  const manifest = readGeneratedBookManifest(slug);
  return defaultSectionIdsFromSections(manifest.sections);
}

function readGeneratedBookManifest(slug: string) {
  return readJson<TestGeneratedBookManifestFixture>(
    `app/client/assets/books/generated/${slug}/manifest.json`,
  );
}

function readGeneratedBookSection(slug: string, sectionId: string) {
  const manifest = readGeneratedBookManifest(slug);
  const section = manifest.sections.find((entry) => entry.id === sectionId);
  expect(section?.sectionJsonPath).toBeTruthy();
  return readJson<TestGeneratedBookSectionFixture>(
    `app/client/assets/books/generated/${slug}/${section!.sectionJsonPath}`,
  );
}

function readBookPreviewAsset(slug: string) {
  return readJson<{ defaultSectionId: string; previewText: string }>(
    `public/book-previews/${slug}.preview.json`,
  );
}

async function removeBookRuntimeSettings(page: Page, slug: string) {
  await page.addInitScript(
    ({ prefix, bookSlug }) => {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(`${prefix}${bookSlug}:`))
        .forEach((key) => localStorage.removeItem(key));
    },
    { prefix: BOOK_RUNTIME_SETTINGS_KEY_PREFIX, bookSlug: slug },
  );
}

async function openPreview(page: Page) {
  await blockExternalNetwork(page);
  const response = await page.goto(ALICE_PREVIEW_PATH, {
    waitUntil: "domcontentloaded",
  });
  await waitForRouteReady(page);
  expect(response?.ok()).toBe(true);
  await waitForApprovedBookWorkspace(page);
}

async function openTestBook(page: Page) {
  await blockExternalNetwork(page);
  const response = await page.goto(TEST_BOOK_PREVIEW_PATH, {
    waitUntil: "domcontentloaded",
  });
  await waitForRouteReady(page);
  expect(response?.ok()).toBe(true);
  await waitForApprovedBookWorkspace(page);
}

async function readBookLivePreviewProgress(page: Page) {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, TEST_BOOK_LIVE_PREVIEW_PROGRESS_KEY);
}

async function waitForLivePlayerTestHook(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(() =>
        Boolean(
          (window as LivePlayerTestWindow).__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__,
        ),
      ),
    )
    .toBe(true);
}

async function readLivePlayerHookState(page: Page) {
  return page.evaluate(() => {
    const hook = (window as LivePlayerTestWindow)
      .__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__;
    if (!hook) throw new Error("Missing live player test hook.");
    return hook.getState();
  });
}

async function captureLivePlayerCompletion(page: Page) {
  return page.evaluate(() => {
    const hook = (window as LivePlayerTestWindow)
      .__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__;
    if (!hook) throw new Error("Missing live player test hook.");
    return hook.captureCompletion();
  });
}

async function completeCapturedLivePlayerSegment(
  page: Page,
  token: LivePlayerCompletionToken,
) {
  return page.evaluate((capturedToken) => {
    const hook = (window as LivePlayerTestWindow)
      .__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__;
    if (!hook) throw new Error("Missing live player test hook.");
    return hook.completeCapturedSegment(capturedToken);
  }, token);
}

async function setRangeInputValue(locator: Locator, value: number) {
  await locator.evaluate((input, nextValue) => {
    const element = input as HTMLInputElement;
    const valueSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;
    if (valueSetter) {
      valueSetter.call(element, String(nextValue));
    } else {
      element.value = String(nextValue);
    }
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
}

async function expectNormalizedLiveAudioControls(settingsPanel: Locator) {
  for (const label of LIVE_PREVIEW_AUDIO_CONTROL_LABELS) {
    await expect(settingsPanel.getByLabel(label)).toBeVisible();
  }
}

async function expectLocatorInsideBounds(container: Locator, child: Locator) {
  await expect(container).toBeVisible();
  await expect(child).toBeVisible();
  const containerBox = await container.boundingBox();
  const childBox = await child.boundingBox();
  expect(containerBox).not.toBeNull();
  expect(childBox).not.toBeNull();
  expect(childBox!.x).toBeGreaterThanOrEqual(containerBox!.x - 1);
  expect(childBox!.y).toBeGreaterThanOrEqual(containerBox!.y - 1);
  expect(childBox!.x + childBox!.width).toBeLessThanOrEqual(
    containerBox!.x + containerBox!.width + 1,
  );
  expect(childBox!.y + childBox!.height).toBeLessThanOrEqual(
    containerBox!.y + containerBox!.height + 1,
  );
}

type PreviewLayerRect = {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
};

type PreviewLayerMetric = {
  fontSize: number;
  letterSpacing: string;
  rect: PreviewLayerRect;
  text: string;
};

type PreviewLayerMetrics = {
  batchEndWordIndex: number | null;
  batchStartWordIndex: number | null;
  frame: PreviewLayerRect;
  morse: PreviewLayerMetric | null;
  text: PreviewLayerMetric | null;
  windowLimit: number;
};

type PreviewFitMetrics = {
  content: PreviewLayerRect | null;
  contentScrollDeltaY: number;
  frame: PreviewLayerRect;
  frameScrollDeltaY: number;
  morse: PreviewLayerMetric | null;
  text: PreviewLayerMetric | null;
  visual: PreviewLayerRect | null;
};

type PreviewFrameVisualState = {
  backgroundColor: string;
  boxShadow: string;
  color: string;
  cursor: string;
  lightbulbColor: string;
  lightbulbSvgColor: string;
  outlineStyle: string;
  outlineWidth: string;
};

async function readPreviewLayerMetrics(
  root: Locator,
  testIdPrefix = "book-video-preview",
): Promise<PreviewLayerMetrics> {
  return root.evaluate((scope, prefix) => {
    const frame = scope.querySelector<HTMLElement>(
      `[data-testid="${prefix}-frame"]`,
    );
    if (!frame) throw new Error(`Missing preview frame for ${prefix}`);

    function rectFor(element: Element): PreviewLayerRect {
      const rect = element.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        width: rect.width,
      };
    }

    function metricFor(testId: string): PreviewLayerMetric | null {
      const element = scope.querySelector<HTMLElement>(
        `[data-testid="${testId}"]`,
      );
      if (!element) return null;
      const style = window.getComputedStyle(element);
      return {
        fontSize: Number.parseFloat(style.fontSize),
        letterSpacing: style.letterSpacing,
        rect: rectFor(element),
        text: element.textContent ?? "",
      };
    }

    return {
      batchEndWordIndex: frame.dataset.previewBatchEndWordIndex
        ? Number(frame.dataset.previewBatchEndWordIndex)
        : null,
      batchStartWordIndex: frame.dataset.previewBatchStartWordIndex
        ? Number(frame.dataset.previewBatchStartWordIndex)
        : null,
      frame: rectFor(frame),
      morse: metricFor(`${prefix}-morse-overlay`),
      text: metricFor(`${prefix}-text-overlay`),
      windowLimit: Number(frame.dataset.previewWindowLimit ?? 0),
    };
  }, testIdPrefix);
}

async function readPreviewFitMetrics(
  root: Locator,
  testIdPrefix = "book-video-preview",
): Promise<PreviewFitMetrics> {
  return root.evaluate((scope, prefix) => {
    const frame = scope.querySelector<HTMLElement>(
      `[data-testid="${prefix}-frame"]`,
    );
    if (!frame) throw new Error(`Missing preview frame for ${prefix}`);

    function rectFor(element: Element): PreviewLayerRect {
      const rect = element.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        width: rect.width,
      };
    }

    function metricFor(testId: string): PreviewLayerMetric | null {
      const element = scope.querySelector<HTMLElement>(
        `[data-testid="${testId}"]`,
      );
      if (!element) return null;
      const style = window.getComputedStyle(element);
      return {
        fontSize: Number.parseFloat(style.fontSize),
        letterSpacing: style.letterSpacing,
        rect: rectFor(element),
        text: element.textContent ?? "",
      };
    }

    const content =
      Array.from(frame.children).find(
        (element): element is HTMLElement =>
          element instanceof HTMLElement &&
          element.tagName.toLowerCase() === "div",
      ) ?? null;
    const visual = scope.querySelector<HTMLElement>(
      [
        `[data-testid="${prefix}-lightbulb"]`,
        `[data-testid="${prefix}-dot"]`,
        `[data-testid="${prefix}-full-frame"]`,
        `[data-testid="${prefix}-morse-text"]`,
      ].join(","),
    );

    return {
      content: content ? rectFor(content) : null,
      contentScrollDeltaY: content
        ? Math.max(0, content.scrollHeight - content.clientHeight)
        : 0,
      frame: rectFor(frame),
      frameScrollDeltaY: Math.max(0, frame.scrollHeight - frame.clientHeight),
      morse: metricFor(`${prefix}-morse-overlay`),
      text: metricFor(`${prefix}-text-overlay`),
      visual: visual ? rectFor(visual) : null,
    };
  }, testIdPrefix);
}

async function readPreviewFrameVisualState(
  frame: Locator,
  testIdPrefix = "book-video-preview",
): Promise<PreviewFrameVisualState> {
  return frame.evaluate((frameElement, prefix) => {
    const frameStyle = window.getComputedStyle(frameElement);
    const lightbulb = frameElement.querySelector<HTMLElement>(
      `[data-testid="${prefix}-lightbulb"]`,
    );
    const lightbulbSvg = lightbulb?.querySelector<SVGElement>("svg") ?? null;
    const lightbulbStyle = lightbulb
      ? window.getComputedStyle(lightbulb)
      : null;
    const lightbulbSvgStyle = lightbulbSvg
      ? window.getComputedStyle(lightbulbSvg)
      : null;

    return {
      backgroundColor: frameStyle.backgroundColor,
      boxShadow: frameStyle.boxShadow,
      color: frameStyle.color,
      cursor: frameStyle.cursor,
      lightbulbColor: lightbulbStyle?.color ?? "",
      lightbulbSvgColor: lightbulbSvgStyle?.color ?? "",
      outlineStyle: frameStyle.outlineStyle,
      outlineWidth: frameStyle.outlineWidth,
    };
  }, testIdPrefix);
}

function normalizedPreviewText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function previewWordCount(value: string) {
  return normalizedPreviewText(value).split(/\s+/).filter(Boolean).length;
}

function expectLayerInsideFrame(
  metrics: PreviewLayerMetrics,
  layer: PreviewLayerMetric | null,
) {
  expect(layer).not.toBeNull();
  expect(layer!.rect.width).toBeGreaterThan(0);
  expect(layer!.rect.height).toBeGreaterThan(0);
  expectRectInsideFrame(metrics.frame, layer!.rect);
}

function expectRectInsideFrame(
  frame: PreviewLayerRect,
  rect: PreviewLayerRect | null,
  tolerance = 1,
) {
  expect(rect).not.toBeNull();
  expect(rect!.width).toBeGreaterThan(0);
  expect(rect!.height).toBeGreaterThan(0);
  expect(rect!.left).toBeGreaterThanOrEqual(frame.left - tolerance);
  expect(rect!.top).toBeGreaterThanOrEqual(frame.top - tolerance);
  expect(rect!.right).toBeLessThanOrEqual(frame.right + tolerance);
  expect(rect!.bottom).toBeLessThanOrEqual(frame.bottom + tolerance);
}

function expectPreviewFitsFrame(metrics: PreviewFitMetrics) {
  expect(metrics.frameScrollDeltaY).toBeLessThanOrEqual(2);
  expect(metrics.contentScrollDeltaY).toBeLessThanOrEqual(2);
  expectRectInsideFrame(metrics.frame, metrics.content, 2);
  expectRectInsideFrame(metrics.frame, metrics.visual, 2);
  if (metrics.morse)
    expectRectInsideFrame(metrics.frame, metrics.morse.rect, 2);
  if (metrics.text) expectRectInsideFrame(metrics.frame, metrics.text.rect, 2);
}

function expectNormalPlainTextSpacing(layer: PreviewLayerMetric | null) {
  expect(layer).not.toBeNull();
  const spacing = layer!.letterSpacing;
  const numericSpacing = Number.parseFloat(spacing);
  expect(spacing === "normal" || Math.abs(numericSpacing) < 0.1).toBe(true);
}

function expectMorseGroupsSeparated(value: string) {
  const normalized = normalizedPreviewText(value);
  expect(normalized).toMatch(/[.-]/);
  expect(normalized).toMatch(/\/|[.-]{1,4}\s+[.-]{1,4}/);
}

async function selectedBookSectionIds(page: Page) {
  return page
    .locator("[data-mw-morse-book-section-select]")
    .evaluateAll((inputs) =>
      inputs
        .filter((input) => (input as HTMLInputElement).checked)
        .map(
          (input) =>
            input.getAttribute("data-mw-morse-book-section-select") ?? "",
        )
        .filter(Boolean),
    );
}

async function expectSelectedBookSectionIds(page: Page, expected: string[]) {
  await expect.poll(() => selectedBookSectionIds(page)).toEqual(expected);
}

async function expectActivePreviewHighlights(
  root: Locator,
  testIdPrefix = "book-video-preview",
) {
  const highlight = await root.evaluate((scope, prefix) => {
    const morseWord = scope.querySelector<HTMLElement>(
      `[data-testid="${prefix}-active-morse-word"]`,
    );
    const morseCharacter = scope.querySelector<HTMLElement>(
      `[data-testid="${prefix}-active-morse-character"]`,
    );
    const textWord = scope.querySelector<HTMLElement>(
      `[data-testid="${prefix}-active-text-word"]`,
    );
    const textCharacter = scope.querySelector<HTMLElement>(
      `[data-testid="${prefix}-active-text-character"]`,
    );
    const morseOverlay = scope.querySelector<HTMLElement>(
      `[data-testid="${prefix}-morse-overlay"]`,
    );
    const textLayers = scope.querySelector<HTMLElement>(
      `[data-testid="${prefix}-text-layers"]`,
    );

    function rectFor(element: HTMLElement | null) {
      const rect = element?.getBoundingClientRect();
      return rect
        ? { height: rect.height, width: rect.width }
        : { height: 0, width: 0 };
    }

    function styleFor(element: HTMLElement | null) {
      if (!element) {
        return {
          backgroundColor: "",
          borderRadius: 0,
          paddingLeft: 0,
          paddingRight: 0,
        };
      }
      const style = window.getComputedStyle(element);
      return {
        backgroundColor: style.backgroundColor,
        borderRadius: Number.parseFloat(style.borderTopLeftRadius),
        paddingLeft: Number.parseFloat(style.paddingLeft),
        paddingRight: Number.parseFloat(style.paddingRight),
      };
    }

    return {
      activeMorse: textLayers?.getAttribute("data-active-morse") ?? "",
      morseCharacterRect: rectFor(morseCharacter),
      morseCharacterStyle: styleFor(morseCharacter),
      morseCharacterText: morseCharacter?.textContent?.trim() ?? "",
      morseOverlayText:
        morseOverlay?.textContent?.replace(/\s+/g, " ").trim() ?? "",
      morseRect: rectFor(morseWord),
      morseStyle: styleFor(morseWord),
      morseText: morseWord?.textContent?.replace(/\s+/g, " ").trim() ?? "",
      overlayRect: rectFor(morseOverlay),
      textCharacterRect: rectFor(textCharacter),
      textCharacterStyle: styleFor(textCharacter),
      textCharacterText: textCharacter?.textContent?.trim() ?? "",
      textStyle: styleFor(textWord),
      textText: textWord?.textContent?.trim() ?? "",
    };
  }, testIdPrefix);

  expect(highlight.morseText).toMatch(/[.-]/);
  expect(highlight.textText.length).toBeGreaterThan(0);
  expect(highlight.morseCharacterText).toBe(highlight.activeMorse);
  expect(highlight.morseStyle.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  expect(highlight.morseStyle.backgroundColor).toBe(
    highlight.textStyle.backgroundColor,
  );
  expect(highlight.morseStyle.borderRadius).toBeGreaterThan(0);
  expect(
    Math.abs(
      highlight.morseStyle.borderRadius - highlight.textStyle.borderRadius,
    ),
  ).toBeLessThanOrEqual(1);
  expect(highlight.textCharacterText.length).toBeGreaterThan(0);
  expect(highlight.morseCharacterStyle.backgroundColor).not.toBe(
    "rgba(0, 0, 0, 0)",
  );
  expect(highlight.textCharacterStyle.backgroundColor).not.toBe(
    "rgba(0, 0, 0, 0)",
  );
  expect(highlight.morseCharacterStyle.backgroundColor).toBe(
    highlight.textCharacterStyle.backgroundColor,
  );
  expect(highlight.morseCharacterStyle.backgroundColor).not.toBe(
    highlight.morseStyle.backgroundColor,
  );
  expect(highlight.textCharacterStyle.backgroundColor).not.toBe(
    highlight.textStyle.backgroundColor,
  );
  expect(highlight.morseCharacterStyle.borderRadius).toBeGreaterThan(0);
  expect(highlight.textCharacterStyle.borderRadius).toBeGreaterThan(0);
  expect(
    Math.abs(
      highlight.textStyle.paddingLeft - highlight.textStyle.paddingRight,
    ),
  ).toBeLessThanOrEqual(1);
  expect(
    Math.abs(
      highlight.textCharacterStyle.paddingLeft -
        highlight.textCharacterStyle.paddingRight,
    ),
  ).toBeLessThanOrEqual(1);
  expect(
    Math.abs(
      highlight.morseCharacterStyle.paddingLeft -
        highlight.morseCharacterStyle.paddingRight,
    ),
  ).toBeLessThanOrEqual(1);
  expect(highlight.morseOverlayText).toContain(highlight.morseText);
  expect(highlight.morseOverlayText).not.toBe(highlight.morseText);
  expect(highlight.morseRect.width).toBeGreaterThan(0);
  expect(highlight.morseCharacterRect.width).toBeGreaterThan(0);
  expect(highlight.morseRect.width).toBeGreaterThanOrEqual(
    highlight.morseCharacterRect.width,
  );
  expect(highlight.morseRect.width).toBeLessThan(highlight.overlayRect.width);
}

function bookOutputTypeButton(page: Page, outputType: "audio" | "video") {
  return page.locator(`[data-mw-morse-book-output-type="${outputType}"]`);
}

async function chooseBookOutputType(page: Page, outputType: "audio" | "video") {
  const button = bookOutputTypeButton(page, outputType);
  await expect(button).toBeVisible();
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "true");
}

async function installFastBookVideoRecorder(page: Page) {
  await page.addInitScript(() => {
    class FakeMediaRecorder {
      static isTypeSupported(type: string) {
        return type.startsWith("video/mp4") || type.startsWith("video/webm");
      }

      state = "inactive";
      ondataavailable: ((event: BlobEvent) => void) | null = null;
      onstop: (() => void) | null = null;
      readonly mimeType: string;

      constructor(_stream: MediaStream, options?: MediaRecorderOptions) {
        this.mimeType = options?.mimeType || "video/mp4";
      }

      start() {
        this.state = "recording";
      }

      stop() {
        if (this.state === "inactive") return;
        this.state = "inactive";
        const blob = new Blob(["MP4-BOOK-VIDEO"], { type: this.mimeType });
        window.setTimeout(() => {
          this.ondataavailable?.({ data: blob } as BlobEvent);
          this.onstop?.();
        }, 0);
      }
    }

    Object.defineProperty(window, "MediaRecorder", {
      configurable: true,
      value: FakeMediaRecorder,
    });
    HTMLCanvasElement.prototype.captureStream = function captureStream() {
      return new MediaStream();
    };
  });
}

async function openApprovedBook(page: Page) {
  await openPublicBook(page, APPROVED_BOOK_PUBLIC_PATH);
}

async function openPublicBook(page: Page, pathName: string) {
  await blockExternalNetwork(page);
  await gotoPublicBookPage(page, pathName);
  await waitForApprovedBookWorkspace(page);
}

async function gotoPublicBookPage(page: Page, pathName: string) {
  const response = await page.goto(pathName, {
    waitUntil: "domcontentloaded",
  });
  await waitForRouteReady(page);
  expect(response?.ok()).toBe(true);
}

async function waitForApprovedBookWorkspace(
  page: Page,
  timeoutMs = BOOK_WORKSPACE_TIMEOUT_MS,
) {
  const pageRoot = page.locator("[data-mw-morse-book-page]");
  await expect(pageRoot).toHaveAttribute(
    "data-mw-morse-book-full-loading",
    "false",
    { timeout: timeoutMs },
  );
  await expect(pageRoot).toHaveAttribute(
    "data-mw-morse-book-settings-restored",
    "true",
    { timeout: timeoutMs },
  );
  await expect(
    page.locator("[data-mw-morse-book-full-loading-status]"),
  ).toHaveCount(0, { timeout: timeoutMs });
  await expect(
    page.locator("[data-mw-morse-book-loading-sections]"),
  ).toHaveCount(0, { timeout: timeoutMs });
}

async function openAnneBook(page: Page) {
  await blockExternalNetwork(page);
  const response = await page.goto("/morse-code-books/anne-of-green-gables", {
    waitUntil: "domcontentloaded",
  });
  await waitForRouteReady(page);
  expect(response?.ok()).toBe(true);
  await waitForApprovedBookWorkspace(page);
}

async function openVioletFairyBookPreview(page: Page) {
  await blockExternalNetwork(page);
  const response = await page.goto(VIOLET_FAIRY_BOOK_PREVIEW_PATH, {
    waitUntil: "domcontentloaded",
  });
  await waitForRouteReady(page);
  expect(response?.ok()).toBe(true);
  await waitForApprovedBookWorkspace(page);
}

async function openGeneratedBookPreview(page: Page, pathName: string) {
  await blockExternalNetwork(page);
  const response = await page.goto(pathName, {
    waitUntil: "domcontentloaded",
  });
  await waitForRouteReady(page);
  expect(response?.ok()).toBe(true);
  await waitForApprovedBookWorkspace(page);
}

async function expectSherlockCollectionNav(
  page: Page,
  expected: {
    nextHref?: string;
    nextText?: string;
    position: string;
    previousHref?: string;
    previousText?: string;
  },
) {
  const nav = page.getByTestId("morse-book-collection-nav");
  await expect(nav).toBeVisible();
  await expect(
    nav.getByRole("heading", { name: "In this collection" }),
  ).toBeVisible();
  await expect(nav.getByTestId("morse-book-collection-position")).toHaveText(
    expected.position,
  );
  await expect(
    nav.locator(`a[href*="${SHERLOCK_ADVENTURES_PARENT_ROUTE_FRAGMENT}"]`),
  ).toHaveCount(0);

  const previous = nav.getByTestId("morse-book-collection-previous");
  if (expected.previousHref && expected.previousText) {
    await expect(previous).toHaveText(expected.previousText);
    await expect(previous).toHaveAttribute("href", expected.previousHref);
  } else {
    await expect(previous).toHaveCount(0);
  }

  const next = nav.getByTestId("morse-book-collection-next");
  if (expected.nextHref && expected.nextText) {
    await expect(next).toHaveText(expected.nextText);
    await expect(next).toHaveAttribute("href", expected.nextHref);
  } else {
    await expect(next).toHaveCount(0);
  }
}

async function saveScreenshot(page: Page, testInfo: TestInfo, name: string) {
  const screenshotPath = testInfo.outputPath(name);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach(name, {
    path: screenshotPath,
    contentType: "image/png",
  });
}

async function contrastRatio(locator: Locator) {
  return locator.evaluate((element) => {
    type Channels = { r: number; g: number; b: number; a: number };

    function parseColor(value: string): Channels | null {
      const rgb = value.match(/^rgba?\(([^)]+)\)$/);
      if (!rgb) return null;
      const parts = rgb[1].split(",").map((part) => Number.parseFloat(part));
      return {
        r: parts[0],
        g: parts[1],
        b: parts[2],
        a: parts.length > 3 ? parts[3] : 1,
      };
    }

    function blend(foreground: Channels, background: Channels): Channels {
      const alpha = foreground.a + background.a * (1 - foreground.a);
      if (alpha <= 0) return { r: 0, g: 0, b: 0, a: 0 };
      return {
        r:
          (foreground.r * foreground.a +
            background.r * background.a * (1 - foreground.a)) /
          alpha,
        g:
          (foreground.g * foreground.a +
            background.g * background.a * (1 - foreground.a)) /
          alpha,
        b:
          (foreground.b * foreground.a +
            background.b * background.a * (1 - foreground.a)) /
          alpha,
        a: alpha,
      };
    }

    function backgroundFor(node: Element) {
      let background: Channels = { r: 0, g: 0, b: 0, a: 0 };
      for (
        let current: Element | null = node;
        current;
        current = current.parentElement
      ) {
        const parsed = parseColor(
          window.getComputedStyle(current).backgroundColor,
        );
        if (parsed) background = blend(background, parsed);
        if (background.a > 0.98) return background;
      }
      const body = parseColor(
        window.getComputedStyle(document.body).backgroundColor,
      ) ?? {
        r: 245,
        g: 242,
        b: 235,
        a: 1,
      };
      return blend(background, body);
    }

    function luminance(color: Channels) {
      const channels = [color.r, color.g, color.b].map((value) => {
        const channel = value / 255;
        return channel <= 0.03928
          ? channel / 12.92
          : Math.pow((channel + 0.055) / 1.055, 2.4);
      });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    }

    const foreground = parseColor(window.getComputedStyle(element).color);
    if (!foreground) return 0;
    const background = backgroundFor(element);
    const light = Math.max(luminance(foreground), luminance(background));
    const dark = Math.min(luminance(foreground), luminance(background));
    return (light + 0.05) / (dark + 0.05);
  });
}

test.describe("Morse book page foundation", () => {
  test.describe.configure({ timeout: 180_000 });

  test("builds local fallback and configured Cloudflare content URLs", () => {
    expect(getMorseBookPublicContentUrls("books/treasure-island.json")).toEqual(
      {
        publicManifestUrl: "https://assets.morsewords.com/public-manifest.json",
        bookUrl: "https://assets.morsewords.com/books/treasure-island.json",
      },
    );
    expect(
      getMorseBookPublicContentUrls("books/treasure-island.json", ""),
    ).toEqual({
      publicManifestUrl:
        "local:app/client/assets/books/cloudflare-export/public-manifest.json",
      bookUrl:
        "local:app/client/assets/books/cloudflare-export/books/treasure-island.json",
    });
    expect(
      getMorseBookPublicContentUrls(
        "/books/treasure-island.json",
        "https://cdn.example.test/morse-books/",
      ),
    ).toEqual({
      publicManifestUrl:
        "https://cdn.example.test/morse-books/public-manifest.json",
      bookUrl:
        "https://cdn.example.test/morse-books/books/treasure-island.json",
    });
    expect(
      getMorseBookPublicContentUrls(
        "books/treasure-island.json",
        "https://cdn.example.test/morse-books",
      ),
    ).toEqual({
      publicManifestUrl:
        "https://cdn.example.test/morse-books/public-manifest.json",
      bookUrl:
        "https://cdn.example.test/morse-books/books/treasure-island.json",
    });
  });

  test("reserves a no-snippet player-sized fallback loading shell", () => {
    const source = fs.readFileSync(
      path.join(
        ROOT,
        "app/client/components/morse-code-books/MorseBookPage.tsx",
      ),
      "utf8",
    );

    expect(source).toContain('data-nosnippet=""');
    expect(source).toContain(
      'data-testid="morse-book-loading-player-placeholder"',
    );
    expect(source).toContain("min-h-[16rem]");
    expect(source).toContain("sm:min-h-[28rem]");
    expect(source).toContain("lg:aspect-video");
  });

  test("keeps canonical story titles across generated, SEO, and public metadata", () => {
    type DisplayManifest = Parameters<typeof preserveMorseBookDisplayTitle>[0];
    type CanonicalSummary = Parameters<typeof preserveMorseBookDisplayTitle>[1];
    const library = readJson<{
      books: Array<CanonicalSummary & { title: string }>;
    }>("app/client/assets/books/generated/library-manifest.json");
    const seo = readJson<{
      expectedSummaryCount: number;
      summaries: Array<{ slug: string; title: string }>;
    }>("app/client/assets/books/seo-summaries/book-seo-summaries.json");

    expect(library.books).toHaveLength(EXPECTED_GENERATED_BOOK_COUNT);
    for (const [slug, title] of Object.entries(REQUIRED_STORY_TITLES)) {
      expect(library.books.find((book) => book.slug === slug)?.title).toBe(
        title,
      );
      const summary = seo.summaries.find((item) => item.slug === slug);
      if (summary) expect(summary.title).toBe(title);
    }

    expect(seo.summaries).toHaveLength(EXPECTED_GENERATED_BOOK_COUNT);
    expect(seo.expectedSummaryCount).toBe(EXPECTED_GENERATED_BOOK_COUNT);
    expect(
      library.books.find((book) => book.slug === "for-the-duration-of-the-war")
        ?.title,
    ).toBe("For the Duration of the War");
    expect(
      library.books.find(
        (book) => book.slug === "the-story-of-the-inexperienced-ghost",
      )?.title,
    ).toBe("The Story of the Inexperienced Ghost");

    const elderbushSummary = library.books.find(
      (book) => book.slug === THE_ELDERBUSH_SLUG,
    );
    const publicContent = readJson<{ manifest: DisplayManifest }>(
      "app/client/assets/books/cloudflare-export/books/the-elderbush.json",
    );
    expect(elderbushSummary).toBeTruthy();
    expect(publicContent.manifest.title).toBe("The Elderbush");
    const normalizedManifest = preserveMorseBookDisplayTitle(
      {
        ...publicContent.manifest,
        title: "Andersen's Fairy Tales",
        cover: {
          ...publicContent.manifest.cover,
          alt: "Placeholder cover for Andersen's Fairy Tales",
        },
      },
      elderbushSummary!,
    );
    expect(normalizedManifest.title).toBe("The Elderbush");
    expect(normalizedManifest.cover.alt).toContain("The Elderbush");
  });

  test("defines Sherlock Adventures collection context without a parent route", () => {
    const firstContext = getMorseBookCollectionContext(
      SHERLOCK_PASS_1_BOOK_SLUG,
    );
    const middleContext = getMorseBookCollectionContext(
      SHERLOCK_MIDDLE_BOOK_SLUG,
    );
    const lastContext = getMorseBookCollectionContext(SHERLOCK_LAST_BOOK_SLUG);

    expect(firstContext?.collectionTitle).toBe(
      SHERLOCK_ADVENTURES_COLLECTION_TITLE,
    );
    expect(firstContext?.collectionOrder).toBe(1);
    expect(firstContext?.collectionSize).toBe(12);
    expect(firstContext?.previousInCollection).toBeNull();
    expect(firstContext?.nextInCollection).toEqual({
      slug: "the-red-headed-league",
      title: "The Red-Headed League",
    });
    expect(
      getMorseBookContextTitle({
        slug: SHERLOCK_PASS_1_BOOK_SLUG,
        title: "A Scandal in Bohemia",
      }),
    ).toBe(SHERLOCK_ADVENTURES_FIRST_DISPLAY_TITLE);

    expect(middleContext?.collectionOrder).toBe(6);
    expect(middleContext?.previousInCollection?.slug).toBe(
      "the-five-orange-pips",
    );
    expect(middleContext?.nextInCollection?.slug).toBe(
      "the-adventure-of-the-blue-carbuncle",
    );
    expect(lastContext?.collectionOrder).toBe(12);
    expect(lastContext?.previousInCollection?.slug).toBe(
      "the-adventure-of-the-beryl-coronet",
    );
    expect(lastContext?.nextInCollection).toBeNull();
    expect(getMorseBookCollectionContext("the-ugly-duckling")).toBeNull();
  });

  test("shows Sherlock collection context and same-surface story navigation", async ({
    page,
  }) => {
    await openPublicBook(
      page,
      `/morse-code-books/${SHERLOCK_PASS_1_BOOK_SLUG}`,
    );
    await expect(page.locator("h1")).toHaveText("A Scandal in Bohemia");
    await expect(page.getByTestId("morse-book-collection-context")).toHaveText(
      "The Adventures of Sherlock Holmes - Chapter 1",
    );
    await expect(page).toHaveTitle(
      /The Adventures of Sherlock Holmes - Chapter 1: A Scandal in Bohemia/,
    );
    await expectSherlockCollectionNav(page, {
      position: "Chapter 1 of 12 in The Adventures of Sherlock Holmes",
      nextHref: "/morse-code-books/the-red-headed-league",
      nextText: "Next story: The Red-Headed League",
    });

    await openPublicBook(
      page,
      `/morse-code-books/${SHERLOCK_MIDDLE_BOOK_SLUG}`,
    );
    await expect(page.getByTestId("morse-book-collection-context")).toHaveText(
      "The Adventures of Sherlock Holmes - Chapter 6",
    );
    await expectSherlockCollectionNav(page, {
      position: "Chapter 6 of 12 in The Adventures of Sherlock Holmes",
      previousHref: "/morse-code-books/the-five-orange-pips",
      previousText: "Previous story: The Five Orange Pips",
      nextHref: "/morse-code-books/the-adventure-of-the-blue-carbuncle",
      nextText: "Next story: The Adventure of the Blue Carbuncle",
    });

    await openPublicBook(page, `/morse-code-books/${SHERLOCK_LAST_BOOK_SLUG}`);
    await expect(page.getByTestId("morse-book-collection-context")).toHaveText(
      "The Adventures of Sherlock Holmes - Chapter 12",
    );
    await expectSherlockCollectionNav(page, {
      position: "Chapter 12 of 12 in The Adventures of Sherlock Holmes",
      previousHref: "/morse-code-books/the-adventure-of-the-beryl-coronet",
      previousText: "Previous story: The Adventure of the Beryl Coronet",
    });

    await openPublicBook(
      page,
      `/morse-code-audiobooks/${SHERLOCK_PASS_1_BOOK_SLUG}`,
    );
    await expect(page.locator("h1")).toHaveText("A Scandal in Bohemia");
    await expect(page.getByTestId("morse-book-collection-context")).toHaveText(
      "The Adventures of Sherlock Holmes - Chapter 1",
    );
    await expectSherlockCollectionNav(page, {
      position: "Chapter 1 of 12 in The Adventures of Sherlock Holmes",
      nextHref: "/morse-code-audiobooks/the-red-headed-league",
      nextText: "Next story: The Red-Headed League",
    });

    await openPublicBook(
      page,
      `/morse-code-audiobooks/${SHERLOCK_MIDDLE_BOOK_SLUG}`,
    );
    await expectSherlockCollectionNav(page, {
      position: "Chapter 6 of 12 in The Adventures of Sherlock Holmes",
      previousHref: "/morse-code-audiobooks/the-five-orange-pips",
      previousText: "Previous story: The Five Orange Pips",
      nextHref: "/morse-code-audiobooks/the-adventure-of-the-blue-carbuncle",
      nextText: "Next story: The Adventure of the Blue Carbuncle",
    });

    await openPublicBook(
      page,
      `/morse-code-audiobooks/${SHERLOCK_LAST_BOOK_SLUG}`,
    );
    await expect(page.getByTestId("morse-book-collection-context")).toHaveText(
      "The Adventures of Sherlock Holmes - Chapter 12",
    );
    await expectSherlockCollectionNav(page, {
      position: "Chapter 12 of 12 in The Adventures of Sherlock Holmes",
      previousHref: "/morse-code-audiobooks/the-adventure-of-the-beryl-coronet",
      previousText: "Previous story: The Adventure of the Beryl Coronet",
    });
  });

  test("renders individual story titles on book and audiobook surfaces", async ({
    page,
  }) => {
    await blockExternalNetwork(page);
    await page.goto("/morse-code-books", { waitUntil: "load" });
    await waitForRouteReady(page);
    await expect(page.getByTestId("morse-books-browser")).toBeVisible();
    await expect(page.getByTestId("morse-books-result-count")).toHaveText(
      `Showing 1-12 of ${EXPECTED_GENERATED_BOOK_COUNT} books`,
    );
    const bookSearch = page.getByLabel(
      "Search title, author, description, or subject",
    );
    await expect(bookSearch).toBeEditable();
    await bookSearch.clear();
    await bookSearch.fill("The Ugly Duckling");
    await expect(bookSearch).toHaveValue("The Ugly Duckling");
    await expect(page.getByTestId("morse-books-result-count")).toHaveText(
      "Showing 1 of 1 book",
    );
    const bookCard = page.locator(
      '[data-testid="morse-book-card"][data-mw-morse-book-card-slug="the-ugly-duckling"]',
    );
    await expect(page.getByTestId("morse-book-card")).toHaveCount(1);
    await expect(bookCard.getByTestId("morse-book-card-title")).toHaveText(
      "The Ugly Duckling",
    );

    await page.goto("/morse-code-audiobooks", {
      waitUntil: "load",
    });
    await waitForRouteReady(page);
    await expect(page.getByTestId("morse-audiobooks-browser")).toBeVisible();
    await expect(page.getByTestId("morse-audiobooks-result-count")).toHaveText(
      `Showing 1-12 of ${EXPECTED_GENERATED_BOOK_COUNT} audiobooks`,
    );
    const audiobookSearch = page.getByLabel(
      "Search Morse audiobooks by title, author, source, or subject",
    );
    await expect(audiobookSearch).toBeEditable();
    await audiobookSearch.clear();
    await audiobookSearch.fill("The Ugly Duckling");
    await expect(audiobookSearch).toHaveValue("The Ugly Duckling");
    await expect(page.getByTestId("morse-audiobooks-result-count")).toHaveText(
      "Showing 1 of 1 audiobook",
    );
    const audiobookCard = page.locator(
      '[data-testid="morse-audiobook-card"][data-mw-morse-audiobook-card-slug="the-ugly-duckling"]',
    );
    await expect(page.getByTestId("morse-audiobook-card")).toHaveCount(1);
    await expect(
      audiobookCard.getByTestId("morse-audiobook-card-title"),
    ).toHaveText("The Ugly Duckling");

    await openPublicBook(page, "/morse-code-books/the-elderbush");
    await expect(page.locator("h1")).toHaveText("The Elderbush");
    await openPublicBook(page, "/morse-code-audiobooks/the-elderbush");
    await expect(page.locator("h1")).toHaveText("The Elderbush");

    for (const [slug, title] of [
      ["the-ugly-duckling", "The Ugly Duckling"],
      ["the-red-shoes", "The Red Shoes"],
      ["hansel-and-gretel", "Hansel and Gretel"],
    ] as const) {
      await openGeneratedBookPreview(
        page,
        `/morse-code-books/${slug}?preview=unpublished`,
      );
      await expect(page.locator("h1")).toHaveText(title);
    }
  });

  test("keeps generated book summaries summary-only and publishes processed temp books", async ({
    request,
  }) => {
    const libraryManifest = readJson<{
      books: Array<{
        slug: string;
        source: {
          rightsReviewed: boolean;
          publishReady: boolean;
          processingAllowed: boolean;
          approvalSource?: string;
        };
      }>;
    }>("app/client/assets/books/generated/library-manifest.json");
    const alice = libraryManifest.books.find(
      (book) => book.slug === ALICE_SLUG,
    );

    expect(alice, "Alice pilot summary exists").toBeTruthy();
    expect(alice?.source.rightsReviewed).toBe(true);
    expect(alice?.source.publishReady).toBe(true);
    expect(JSON.stringify(libraryManifest)).not.toContain("morseSourceText");
    expect(JSON.stringify(libraryManifest)).not.toContain("displayText");

    const generatedSummaries = libraryManifest.books;
    const publishedSummaries = libraryManifest.books.filter(
      (book) =>
        book.source.publishReady &&
        book.source.processingAllowed &&
        (book.source.approvalSource === "external-authority" ||
          book.source.approvalSource === "file-evidence" ||
          book.source.rightsReviewed),
    );
    expect(generatedSummaries.map((book) => book.slug)).toContain(ALICE_SLUG);
    expect(publishedSummaries.map((book) => book.slug)).toContain(ALICE_SLUG);
    expect(publishedSummaries.map((book) => book.slug)).toContain(
      APPROVED_BOOK_SLUG,
    );
    expect(generatedSummaries.map((book) => book.slug)).not.toContain(
      TEST_BOOK_SLUG,
    );

    const publicSitemap = fs.readFileSync(
      path.join(ROOT, "public", "sitemap.xml"),
      "utf8",
    );
    expect(publicSitemap).toContain(APPROVED_BOOK_PUBLIC_PATH);
    expect(publicSitemap).toContain(ALICE_PUBLIC_PATH);
    expect(publicSitemap).not.toContain(TEST_BOOK_PUBLIC_PATH);

    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBe(true);
    const sitemapText = await response.text();
    expect(sitemapText).toContain(APPROVED_BOOK_PUBLIC_PATH);
    expect(sitemapText).toContain(ALICE_PUBLIC_PATH);
    expect(sitemapText).not.toContain(TEST_BOOK_PUBLIC_PATH);
  });

  test("exposes processed temp books and completed generated summary coverage", async ({
    page,
    request,
  }) => {
    const aliceResponse = await request.get(ALICE_PUBLIC_PATH);
    expect(aliceResponse.ok()).toBe(true);
    const aliceAudiobookResponse = await request.get(
      ALICE_AUDIOBOOK_PUBLIC_PATH,
    );
    expect(aliceAudiobookResponse.ok()).toBe(true);

    const testFixtureResponse = await request.get(TEST_BOOK_PUBLIC_PATH);
    expect(testFixtureResponse.status()).toBe(404);
    const testFixtureAudiobookResponse = await request.get(
      `/morse-code-audiobooks/${TEST_BOOK_SLUG}`,
    );
    expect(testFixtureAudiobookResponse.status()).toBe(404);

    const unknownResponse = await request.get(
      "/morse-code-books/not-a-real-book",
    );
    expect(unknownResponse.status()).toBe(404);
    const unknownAudiobookResponse = await request.get(
      "/morse-code-audiobooks/not-a-real-book",
    );
    expect(unknownAudiobookResponse.status()).toBe(404);

    for (const slug of SOURCE_RISK_REMOVED_BOOK_SLUGS) {
      const removedBookResponse = await request.get(
        `/morse-code-books/${slug}`,
      );
      expect(removedBookResponse.status(), `${slug} book route`).toBe(404);
      const removedAudiobookResponse = await request.get(
        `/morse-code-audiobooks/${slug}`,
      );
      expect(removedAudiobookResponse.status(), `${slug} audiobook route`).toBe(
        404,
      );
    }

    await openPublicBook(page, APPROVED_BOOK_PUBLIC_PATH);
    const summaryLink = page.getByTestId("morse-book-summary-link");
    await expect(summaryLink).toHaveAttribute("href", "#book-summary");
    await page.evaluate(() => window.scrollTo(0, 0));
    await summaryLink.click();
    await expect
      .poll(() => page.evaluate(() => window.location.hash))
      .toBe("#book-summary");
    await expect(page.getByTestId("morse-book-seo-summary")).toBeVisible();

    await openPublicBook(page, NEWLY_SUMMARIZED_BOOK_PREVIEW_PATH);
    await expect(page.getByTestId("morse-book-summary-link")).toHaveAttribute(
      "href",
      "#book-summary",
    );
    await expect(page.getByTestId("morse-book-seo-summary")).toBeVisible();
  });

  test("book and audiobook cards link to their matching detail routes", async ({
    page,
    request,
  }) => {
    const audiobookResponse = await request.get(APPROVED_AUDIOBOOK_PUBLIC_PATH);
    expect(audiobookResponse.ok()).toBe(true);

    await blockExternalNetwork(page);
    await page.goto("/morse-code-books", { waitUntil: "load" });
    await waitForRouteReady(page);
    const firstBookCard = page.getByTestId("morse-book-card").first();
    await expect(firstBookCard).toBeVisible();
    await expect(firstBookCard).toHaveAttribute(
      "href",
      /^\/morse-code-books\/[^/?#]+$/,
    );
    await expect(
      page.locator('a[href^="/morse-code-audiobooks/"]'),
    ).toHaveCount(0);
    const bookDirectory = page.getByTestId("morse-book-complete-directory");
    await expect(bookDirectory).toHaveAttribute(
      "data-mw-directory-count",
      String(EXPECTED_GENERATED_BOOK_COUNT),
    );
    await expect(
      bookDirectory.locator("a[data-mw-directory-slug]"),
    ).toHaveCount(EXPECTED_GENERATED_BOOK_COUNT);
    for (const slug of SOURCE_RISK_REMOVED_BOOK_SLUGS) {
      await expect(
        bookDirectory.locator(`a[data-mw-directory-slug="${slug}"]`),
      ).toHaveCount(0);
    }

    await page.goto("/morse-code-audiobooks", {
      waitUntil: "load",
    });
    await waitForRouteReady(page);
    const firstAudiobookCard = page.getByTestId("morse-audiobook-card").first();
    await expect(firstAudiobookCard).toBeVisible();
    await expect(firstAudiobookCard).toHaveAttribute(
      "href",
      /^\/morse-code-audiobooks\/[^/?#]+$/,
    );
    await expect(
      page.locator(
        'a[data-testid="morse-audiobook-card"][href^="/morse-code-audiobooks/"]',
      ),
    ).toHaveCount(12);
    const audiobookDirectory = page.getByTestId(
      "morse-audiobook-complete-directory",
    );
    await expect(audiobookDirectory).toHaveAttribute(
      "data-mw-directory-count",
      String(EXPECTED_GENERATED_BOOK_COUNT),
    );
    await expect(
      audiobookDirectory.locator("a[data-mw-directory-slug]"),
    ).toHaveCount(EXPECTED_GENERATED_BOOK_COUNT);
    for (const slug of SOURCE_RISK_REMOVED_BOOK_SLUGS) {
      await expect(
        audiobookDirectory.locator(`a[data-mw-directory-slug="${slug}"]`),
      ).toHaveCount(0);
    }

    await page.goto("/", { waitUntil: "load" });
    await waitForRouteReady(page);
    const featuredBooks = page.locator(
      '[aria-labelledby="featured-morse-books-title"]',
    );
    await expect(featuredBooks).toBeVisible();
    await expect(
      featuredBooks.locator('[data-testid="home-featured-book-card"]'),
    ).toHaveCount(8);
    await expect(
      featuredBooks.locator('[data-testid="home-featured-book-primary-link"]'),
    ).toHaveCount(8);
    await expect(
      featuredBooks
        .locator('[data-testid="home-featured-book-primary-link"]')
        .first(),
    ).toHaveAttribute("href", /^\/morse-code-books\/[^/?#]+$/);
    await expect(
      featuredBooks
        .locator('[data-testid="home-featured-book-card"]')
        .first()
        .locator("a"),
    ).toHaveCount(1);
    await expect(
      featuredBooks
        .locator('[data-testid="home-featured-book-description"]')
        .first(),
    ).not.toHaveText("");
    await expect(
      featuredBooks
        .locator('[data-testid="home-featured-book-affordance"]')
        .first(),
    ).toHaveText("Read and listen ->");
    await expect(featuredBooks.getByText("Open book")).toHaveCount(0);
    await expect(
      featuredBooks.locator('[data-testid="home-featured-book-cta"]'),
    ).toHaveCount(0);
    await expect(featuredBooks.getByText("Download MP3")).toHaveCount(0);
    await expect(
      featuredBooks.locator('[data-testid="home-featured-book-mp3-link"]'),
    ).toHaveCount(0);
    await expect(
      featuredBooks.locator('a[href^="/morse-code-audiobooks/"]'),
    ).toHaveCount(0);

    const moreButton = page.getByRole("button", { name: "More" });
    await expect(moreButton).toHaveAttribute("aria-expanded", "false");
    await moreButton.click();
    await expect(moreButton).toHaveAttribute("aria-expanded", "true");
    const moreDialog = page.getByRole("dialog", {
      name: "More MorseWords tools",
    });
    await expect(moreDialog).toBeVisible();
    const moreSearch = moreDialog.getByPlaceholder("Search tools...");
    await expect(moreSearch).toBeEditable();
    await moreSearch.clear();
    await moreSearch.fill("Treasure Island");
    await expect(moreSearch).toHaveValue("Treasure Island");
    const treasureIslandLink = moreDialog.locator(
      `a[href="${APPROVED_BOOK_PUBLIC_PATH}"]`,
    );
    await expect(treasureIslandLink).toHaveCount(1);
    await expect(treasureIslandLink).toContainText("Treasure Island");
    await expect(
      moreDialog.locator(`a[href="${APPROVED_AUDIOBOOK_PUBLIC_PATH}"]`),
    ).toHaveCount(0);
  });

  test("renders an approved external-authority Gutenberg book as a public page", async ({
    page,
  }) => {
    await openApprovedBook(page);

    await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator("[data-mw-morse-book-page]")).toHaveAttribute(
      "data-mw-morse-book-available",
      "true",
    );
    await expect(page.locator("h1")).toContainText("Treasure Island");
    const sourceMetadataLink = page.getByTestId(
      "morse-book-source-metadata-link",
    );
    await expect(sourceMetadataLink).toHaveText("Project Gutenberg ID 120");
    await expect(sourceMetadataLink).toHaveAttribute(
      "href",
      "https://www.gutenberg.org/ebooks/120",
    );
    await expect(sourceMetadataLink).toHaveAttribute("target", "_blank");
    await expect(sourceMetadataLink).toHaveAttribute(
      "rel",
      /noopener noreferrer/,
    );
    await expect(sourceMetadataLink).not.toHaveAttribute("rel", /nofollow/);
    await expect(
      page.getByRole("link", { name: /Project Gutenberg ebook #120/ }),
    ).toHaveAttribute("href", "https://www.gutenberg.org/ebooks/120");
    await expect(
      page.getByRole("link", { name: "Translate your own text" }),
    ).toHaveAttribute("href", "/morse-code-book-translator");
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).toBeVisible();
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).not.toContainText("Project Gutenberg License");
    await expect(
      page.locator("[data-mw-morse-book-morse-preview]"),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open live Morse player" }),
    ).toHaveAttribute("href", APPROVED_AUDIOBOOK_PUBLIC_PATH);
    await expect(
      page.getByRole("link", { name: "Print Morse pages" }),
    ).toHaveAttribute("href", `${APPROVED_BOOK_PUBLIC_PATH}/print`);
    const liveTranslationLink = page.getByTestId(
      "morse-book-view-live-translation-link",
    );
    const downloadAudiobookLink = page.getByTestId(
      "morse-book-download-audiobook-link",
    );
    await expect(liveTranslationLink).toBeVisible();
    await expect(downloadAudiobookLink).toBeVisible();
    await expect(liveTranslationLink).toHaveText("View Live Translation");
    await expect(downloadAudiobookLink).toHaveText("Download audio");
    await expect(liveTranslationLink).toHaveAttribute(
      "href",
      "#book-live-morse-player",
    );
    await expect(downloadAudiobookLink).toHaveAttribute(
      "href",
      "#book-mp3-download",
    );
    const bookHeader = page.getByTestId("morse-book-header");
    const summaryLink = bookHeader.getByTestId("morse-book-summary-link");
    const seoSummary = page.getByTestId("morse-book-seo-summary");
    const relatedAuthor = page.getByTestId("morse-book-related-author");
    await expect(summaryLink).toBeVisible();
    await expect(summaryLink).toHaveAttribute("href", "#book-summary");
    await expect(bookHeader.getByTestId("morse-book-seo-summary")).toHaveCount(
      0,
    );
    await expect(
      bookHeader.getByTestId("morse-book-content-suitability"),
    ).toHaveCount(0);
    await expect(
      bookHeader.getByTestId("morse-book-related-author"),
    ).toHaveCount(0);
    await expect(seoSummary).toBeVisible();
    await expect(
      seoSummary.getByRole("heading", {
        name: /About .+ as a Morse Code Book/,
      }),
    ).toBeVisible();
    await expect(
      seoSummary.getByTestId("morse-book-content-suitability"),
    ).toHaveCount(1);
    await expect(relatedAuthor).toBeVisible();
    const lowerContentOrder = await page.evaluate(() => {
      const source = document.querySelector(
        '[data-testid="morse-book-source-notes"]',
      );
      const summary = document.querySelector("#book-summary");
      const related = document.querySelector(
        '[data-testid="morse-book-related-author"]',
      );
      return {
        sourceBeforeSummary: Boolean(
          source &&
            summary &&
            (source.compareDocumentPosition(summary) &
              Node.DOCUMENT_POSITION_FOLLOWING) !==
              0,
        ),
        summaryBeforeRelated: Boolean(
          summary &&
            related &&
            (summary.compareDocumentPosition(related) &
              Node.DOCUMENT_POSITION_FOLLOWING) !==
              0,
        ),
      };
    });
    expect(lowerContentOrder).toEqual({
      sourceBeforeSummary: true,
      summaryBeforeRelated: true,
    });
    const summaryLayout = await page.evaluate(() => {
      const source = document.querySelector(
        '[data-testid="morse-book-source-notes"]',
      ) as HTMLElement | null;
      const summary = document.querySelector(
        '[data-testid="morse-book-seo-summary"]',
      ) as HTMLElement | null;
      const summaryBody = document.querySelector(
        '[data-testid="morse-book-seo-summary-body"]',
      ) as HTMLElement | null;
      const summaryColumns = document.querySelector(
        '[data-testid="morse-book-seo-summary-columns"]',
      ) as HTMLElement | null;

      return {
        sourceWidth: source?.getBoundingClientRect().width ?? 0,
        summaryWidth: summary?.getBoundingClientRect().width ?? 0,
        summaryBodyWidth: summaryBody?.getBoundingClientRect().width ?? 0,
        summaryColumnCount: summaryColumns
          ? getComputedStyle(summaryColumns).columnCount
          : "",
      };
    });
    expect(summaryLayout.summaryWidth).toBeGreaterThanOrEqual(
      summaryLayout.sourceWidth * 0.95,
    );
    expect(summaryLayout.summaryBodyWidth).toBeGreaterThanOrEqual(
      summaryLayout.sourceWidth * 0.9,
    );
    expect(["2", "auto"]).toContain(summaryLayout.summaryColumnCount);
    const livePlayer = page.locator("#book-live-morse-player");
    const livePlayerDownloadLink = livePlayer.getByTestId(
      "morse-book-live-download-link",
    );
    await expect(page.getByTestId("morse-book-live-player")).toBeVisible();
    await expect(page.getByTestId("book-video-preview-frame")).toBeVisible();
    const playLivePlayerButton = livePlayer.getByRole("button", {
      name: "Play live player",
    });
    const openFullscreenButton = livePlayer.getByRole("button", {
      name: "Open live preview fullscreen",
    });
    await expect(playLivePlayerButton).toBeVisible();
    await expect(playLivePlayerButton.locator("svg")).toBeVisible();
    await expect(openFullscreenButton).toBeVisible();
    await expect(openFullscreenButton.locator("svg")).toBeVisible();
    const embeddedFrameBox = await page
      .getByTestId("book-video-preview-frame")
      .boundingBox();
    expect(embeddedFrameBox).not.toBeNull();
    const embeddedFrameRatio =
      embeddedFrameBox!.width / embeddedFrameBox!.height;
    expect(embeddedFrameRatio).toBeGreaterThan(1.65);
    expect(embeddedFrameRatio).toBeLessThan(1.9);
    const embeddedLightbulbBox = await livePlayer
      .locator("[data-testid='book-video-preview-lightbulb'] svg")
      .boundingBox();
    expect(embeddedLightbulbBox).not.toBeNull();
    expect(embeddedLightbulbBox!.width).toBeGreaterThanOrEqual(110);
    const embeddedMorseText = await livePlayer
      .getByTestId("book-video-preview-morse-overlay")
      .evaluate((element) =>
        (element as HTMLElement).innerText.replace(/\s+/g, " "),
      );
    expect(embeddedMorseText).toMatch(/[.-]{1,5}\s+[.-]{1,5}/);
    expect(embeddedMorseText).toContain("/");
    await expect(livePlayerDownloadLink).toBeVisible();
    await expect(livePlayerDownloadLink).toHaveText("Download audio");
    await expect(livePlayerDownloadLink).toHaveAttribute(
      "href",
      "#book-mp3-download",
    );
    await expect(
      page.getByTestId("book-video-preview-timing-strip-time"),
    ).toBeVisible();
    await expect(page.getByTestId("book-video-preview-time")).toHaveCount(0);
    await expect(page.getByText("Condensed long preview")).toHaveCount(0);
    await expect(page.getByTestId("book-video-preview-branding")).toHaveCount(
      0,
    );
    await expect(livePlayer.getByText(/morsewords\.com/i)).toHaveCount(0);
    const liveSegmentSelect = livePlayer.getByTestId(
      "morse-book-live-segment-select",
    );
    const liveSegmentValue =
      (await liveSegmentSelect.count()) > 0
        ? await liveSegmentSelect.inputValue()
        : null;
    const fullscreenButton = livePlayer.getByTestId(
      "book-video-preview-fullscreen-button",
    );
    await expect(fullscreenButton).toBeVisible();
    await fullscreenButton.click();
    const fullscreenOverlay = page.getByTestId(
      "book-video-preview-fullscreen-overlay",
    );
    await expect(fullscreenOverlay).toBeVisible();
    await expect(fullscreenOverlay).toHaveAttribute(
      "data-fullscreen-active",
      "true",
    );
    const exitFullscreenButton = page.getByRole("button", {
      name: "Exit fullscreen",
    });
    await expect(exitFullscreenButton).toBeVisible();
    await expect(exitFullscreenButton.locator("svg")).toBeVisible();
    if (liveSegmentValue !== null) {
      await expect(
        page.getByTestId("morse-book-live-fullscreen-segment-select"),
      ).toHaveValue(liveSegmentValue);
    }
    const fullscreenFrame = page.getByTestId(
      "book-video-preview-fullscreen-frame",
    );
    const fullscreenMorse = page.getByTestId(
      "book-video-preview-fullscreen-morse-overlay",
    );
    const fullscreenText = page.getByTestId(
      "book-video-preview-fullscreen-text-overlay",
    );
    const fullscreenMorseText = await fullscreenMorse.evaluate((element) =>
      (element as HTMLElement).innerText.replace(/\s+/g, " "),
    );
    expect(fullscreenMorseText).toMatch(/[.-]{1,5}\s+[.-]{1,5}/);
    expect(fullscreenMorseText).toContain("/");
    const fullscreenActiveTextWord = await page
      .getByTestId("book-video-preview-fullscreen-active-text-word")
      .evaluate((element) =>
        (element as HTMLElement).innerText.replace(/\s+/g, " "),
      );
    expect(fullscreenActiveTextWord).not.toMatch(
      /[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]/,
    );
    await expectLocatorInsideBounds(fullscreenFrame, fullscreenMorse);
    await expectLocatorInsideBounds(fullscreenFrame, fullscreenText);
    await expectLocatorInsideBounds(
      fullscreenFrame,
      page.getByTestId("book-video-preview-fullscreen-active-morse-word"),
    );
    await expectLocatorInsideBounds(
      fullscreenFrame,
      page.getByTestId("book-video-preview-fullscreen-active-text-word"),
    );
    await expect(fullscreenOverlay).toHaveAttribute(
      "data-fullscreen-controls-visible",
      "false",
      { timeout: 4_500 },
    );
    await page.mouse.move(24, 24);
    await expect(fullscreenOverlay).toHaveAttribute(
      "data-fullscreen-controls-visible",
      "true",
    );
    await exitFullscreenButton.click();
    await expect(
      page.getByTestId("book-video-preview-fullscreen-overlay"),
    ).toHaveCount(0);
    await expect(page.getByTestId("book-video-preview-frame")).toBeVisible();
    if (liveSegmentValue !== null) {
      await expect(liveSegmentSelect).toHaveValue(liveSegmentValue);
    }
    const playerSettings = page
      .locator("#book-live-morse-player details")
      .filter({ hasText: "Player settings" });
    await expect(playerSettings).not.toHaveAttribute("open", "");
    await playerSettings.locator("summary").click();
    const progressSettings = playerSettings.getByTestId(
      "morse-book-live-progress-settings",
    );
    await expect(progressSettings).toBeVisible();
    await expect(
      progressSettings.locator("p").filter({ hasText: "Progress" }),
    ).toBeVisible();
    await expect(
      progressSettings.getByRole("button", { name: "Reset progress" }),
    ).toBeVisible();
    await expect(
      progressSettings
        .getByRole("button", { name: "Reset progress" })
        .locator("svg"),
    ).toBeVisible();
    await expect(
      playerSettings.getByRole("button", { name: "Lightbulb signal" }),
    ).toBeVisible();
    await expect(
      playerSettings.getByRole("button", { name: "Dot signal" }),
    ).toBeVisible();
    for (const retiredLabel of [
      "Full-frame flash",
      "Animated Morse signal",
      "Video quality",
      "720p",
      "1080p",
    ]) {
      await expect(
        playerSettings.getByText(retiredLabel, { exact: true }),
      ).toHaveCount(0);
    }
    await expect(
      playerSettings.getByTestId("morse-book-live-download-link"),
    ).toHaveCount(0);
    await expect(
      playerSettings.getByText("Split mode", { exact: true }),
    ).toHaveCount(0);
    const mp3DownloadSection = page.locator("#book-mp3-download");
    await expect(mp3DownloadSection).toBeVisible();
    await expect(
      mp3DownloadSection.getByText("Split mode", { exact: true }),
    ).toBeVisible();
    await expect(
      mp3DownloadSection.getByRole("radio", { name: "No split" }),
    ).toBeVisible();
    await expect(
      mp3DownloadSection.getByRole("radio", { name: "Split by duration" }),
    ).toBeVisible();
    await expect(
      mp3DownloadSection.getByRole("radio", { name: /Custom split time/ }),
    ).toBeVisible();
    await expect(
      mp3DownloadSection.getByLabel("Output format").locator("option"),
    ).toHaveText(["MP3", "WAV"]);
    await mp3DownloadSection.getByLabel("Output format").selectOption("wav");
    await expect(
      mp3DownloadSection.getByRole("button", {
        name: /Download WAV(?: parts)?|Download ZIP/,
      }),
    ).toBeVisible();
    await mp3DownloadSection.getByLabel("Output format").selectOption("mp3");
    await expect(
      mp3DownloadSection.getByRole("button", {
        name: /Download MP3|Download ZIP batch 1/,
      }),
    ).toBeVisible();

    const sectionOrder = await page.evaluate(() => {
      const livePlayer = document.querySelector("#book-live-morse-player");
      const chooser = document.querySelector("#book-section-chooser");
      const mp3Download = document.querySelector("#book-mp3-download");
      return {
        liveBeforeChooser: Boolean(
          livePlayer &&
            chooser &&
            (livePlayer.compareDocumentPosition(chooser) &
              Node.DOCUMENT_POSITION_FOLLOWING) !==
              0,
        ),
        chooserBeforeMp3: Boolean(
          chooser &&
            mp3Download &&
            (chooser.compareDocumentPosition(mp3Download) &
              Node.DOCUMENT_POSITION_FOLLOWING) !==
              0,
        ),
      };
    });
    expect(sectionOrder).toEqual({
      liveBeforeChooser: true,
      chooserBeforeMp3: true,
    });

    await page.evaluate(() => window.scrollTo(0, 0));
    await liveTranslationLink.click();
    await expect
      .poll(() => page.evaluate(() => window.location.hash))
      .toBe("#book-live-morse-player");
    await expect
      .poll(() =>
        page
          .locator("#book-live-morse-player")
          .evaluate((element) => element.getBoundingClientRect().top),
      )
      .toBeLessThan(220);

    await livePlayerDownloadLink.click();
    await expect
      .poll(() => page.evaluate(() => window.location.hash))
      .toBe("#book-mp3-download");
    await expect
      .poll(() =>
        page
          .locator("#book-mp3-download")
          .evaluate((element) => element.getBoundingClientRect().top),
      )
      .toBeLessThan(220);

    await page.evaluate(() => window.scrollTo(0, 0));
    await downloadAudiobookLink.click();
    await expect
      .poll(() => page.evaluate(() => window.location.hash))
      .toBe("#book-mp3-download");
    await expect
      .poll(() =>
        page
          .locator("#book-mp3-download")
          .evaluate((element) => element.getBoundingClientRect().top),
      )
      .toBeLessThan(220);

    const selectorRows = page.locator("[data-mw-morse-book-section-row]");
    await expect(selectorRows.first()).toBeVisible();
    await expect(
      selectorRows.first().locator("[data-mw-morse-book-section-label]"),
    ).toBeVisible();
    await expect(
      selectorRows.first().locator("[data-mw-morse-book-section-kind]"),
    ).toContainText(/Chapter|Opening|Part|Section|Source notes/);
    await expect(
      selectorRows
        .first()
        .locator("[data-mw-morse-book-section-selection-state]"),
    ).toContainText(/Included|Not selected|Available section/);
  });

  test("loads one approved book JSON and reuses it for section switching", async ({
    page,
  }) => {
    const bookJsonRequests: string[] = [];
    await blockExternalNetwork(page);
    await page.route(bookJsonPattern(NETWORK_BOOK_SLUG), async (route) => {
      bookJsonRequests.push(route.request().url());
      await route.continue();
    });

    await gotoPublicBookPage(page, NETWORK_BOOK_PUBLIC_PATH);
    await waitForApprovedBookWorkspace(page);
    expect(bookJsonRequests).toHaveLength(1);

    const sectionCheckbox = page
      .locator("[data-mw-morse-book-section-row]")
      .filter({ hasText: /Chapter|Part|Opening|Source notes/ })
      .locator("input[type='checkbox']")
      .last();
    await sectionCheckbox.setChecked(true);
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).not.toHaveAttribute("data-mw-morse-book-translator-source-sections", "");
    expect(bookJsonRequests).toHaveLength(1);
  });

  test("keeps selected Call of the Wild source preview at Chapter 1 despite saved progress", async ({
    page,
  }) => {
    const defaultSectionIds = readPublicDefaultSectionIds(
      STALE_CACHE_BOOK_SLUG,
    );
    const content = readJson<TestBookContentFixture>(
      `app/client/assets/books/cloudflare-export/books/${STALE_CACHE_BOOK_SLUG}.json`,
    );
    expect(defaultSectionIds[0]).toBe("chapter-001");
    expect(defaultSectionIds).toContain("chapter-002");

    await page.addInitScript(
      ({
        contentHash,
        contentVersion,
        defaultIds,
        prefix,
        runtimeKey,
        slug,
      }) => {
        Object.keys(localStorage)
          .filter((key) => key.startsWith(`${prefix}${slug}:`))
          .forEach((key) => localStorage.removeItem(key));
        localStorage.setItem(
          runtimeKey,
          JSON.stringify({
            schemaVersion: 1,
            slug,
            contentVersion,
            contentHash,
            selectionMode: "default",
            selectedSectionIds: defaultIds,
            exportSettings: {},
            videoSettings: {},
            livePlayer: {
              activeSectionId: "chapter-002",
              activeSegmentIndex: 5,
              elapsedMs: 120_000,
              completedSectionIds: ["chapter-001"],
            },
          }),
        );
      },
      {
        contentHash: content.manifest.contentHash,
        contentVersion: content.manifest.contentVersion,
        defaultIds: defaultSectionIds,
        prefix: BOOK_RUNTIME_SETTINGS_KEY_PREFIX,
        runtimeKey: readPublicBookRuntimeSettingsKey(STALE_CACHE_BOOK_SLUG),
        slug: STALE_CACHE_BOOK_SLUG,
      },
    );

    await openPublicBook(page, STALE_CACHE_BOOK_PUBLIC_PATH);

    await expectSelectedBookSectionIds(page, defaultSectionIds);
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      defaultSectionIds.join(","),
    );

    const sourcePreview = page.locator("[data-mw-morse-book-source-preview]");
    await expect(sourcePreview).toContainText("Chapter I. Into the Primitive");
    await expect(sourcePreview).not.toContainText(
      "Chapter II. The Law of Club and Fang",
    );
    expect(
      normalizedPreviewText(
        (await sourcePreview.textContent()) ?? "",
      ).startsWith("Chapter I. Into the Primitive"),
    ).toBe(true);

    await sourcePreview.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    await page
      .locator("[data-mw-morse-book-section-select='chapter-002']")
      .uncheck();
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      defaultSectionIds.filter((id) => id !== "chapter-002").join(","),
    );
    await expect
      .poll(() => sourcePreview.evaluate((element) => element.scrollTop))
      .toBe(0);
    expect(
      normalizedPreviewText(
        (await sourcePreview.textContent()) ?? "",
      ).startsWith("Chapter I. Into the Primitive"),
    ).toBe(true);
  });

  test("keeps book of dragons defaults at story content without illustration artifacts", async ({
    page,
  }) => {
    const manifest = readGeneratedBookManifest(THE_BOOK_OF_DRAGONS_SLUG);
    const defaultSectionIds = readGeneratedDefaultSectionIds(
      THE_BOOK_OF_DRAGONS_SLUG,
    );
    expect(defaultSectionIds).toEqual(
      manifest.sections.map((section) => section.id),
    );
    expect(manifest.sections.map((section) => section.label)).toEqual([
      "Story 1",
      "Story 2",
      "Story 3",
      "Story 4",
      "Story 5",
      "Story 6",
      "Story 7",
      "Story 8",
    ]);
    expect(manifest.sections.map((section) => section.title)).toContain(
      "The Book of Beasts",
    );
    expect(
      manifest.sections.every(
        (section) => !/^Part\s+\d+$/i.test(section.label ?? ""),
      ),
    ).toBe(true);

    const firstSection = readGeneratedBookSection(
      THE_BOOK_OF_DRAGONS_SLUG,
      "chapter-001",
    );
    const firstText =
      firstSection.morseSourceText ?? firstSection.displayText ?? "";
    expect(firstText).toContain("I. The Book of Beasts");
    expect(firstText).toContain("He happened to be building a Palace");
    expect(firstText).not.toContain("[Illustration:");
    expect(firstText).not.toContain("The Book of DRAGONS");

    const preview = readBookPreviewAsset(THE_BOOK_OF_DRAGONS_SLUG);
    expect(preview.defaultSectionId).toBe("chapter-001");
    expect(preview.previewText).toContain("I. The Book of Beasts");
    expect(preview.previewText).not.toContain("[Illustration:");
    expect(preview.previewText).not.toContain("The Book of DRAGONS");

    await removeBookRuntimeSettings(page, THE_BOOK_OF_DRAGONS_SLUG);
    await openGeneratedBookPreview(page, THE_BOOK_OF_DRAGONS_PREVIEW_PATH);
    await expectSelectedBookSectionIds(page, defaultSectionIds);

    const sourcePreview = page.locator("[data-mw-morse-book-source-preview]");
    await expect(sourcePreview).toContainText("I. The Book of Beasts");
    await expect(sourcePreview).toContainText(
      "He happened to be building a Palace",
    );
    await expect(sourcePreview).not.toContainText("[Illustration:");
    await expect(sourcePreview).not.toContainText("The Book of DRAGONS");
    expect(
      normalizedPreviewText(
        (await sourcePreview.textContent()) ?? "",
      ).startsWith("I. The Book of Beasts He happened"),
    ).toBe(true);
  });

  test("defaults emerald city of oz to the real opening chapter", async ({
    page,
  }) => {
    const manifest = readGeneratedBookManifest(THE_EMERALD_CITY_OF_OZ_SLUG);
    const defaultSectionIds = readGeneratedDefaultSectionIds(
      THE_EMERALD_CITY_OF_OZ_SLUG,
    );
    expect(defaultSectionIds[0]).toBe("chapter-001");
    expect(defaultSectionIds).toEqual(
      manifest.sections.map((section) => section.id),
    );
    expect(manifest.sections[0]).toMatchObject({
      id: "chapter-001",
      label: "Chapter 1",
      title: "How the Nome King Became Angry",
      includeByDefault: true,
    });
    expect(
      manifest.sections.every(
        (section) => !/^Part\s+\d+$/i.test(section.label ?? ""),
      ),
    ).toBe(true);

    const firstSection = readGeneratedBookSection(
      THE_EMERALD_CITY_OF_OZ_SLUG,
      "chapter-001",
    );
    const firstText =
      firstSection.morseSourceText ?? firstSection.displayText ?? "";
    expect(firstText).toContain("The Nome King was in an angry mood");
    expect(firstText).not.toContain("Part 2");

    const preview = readBookPreviewAsset(THE_EMERALD_CITY_OF_OZ_SLUG);
    expect(preview.defaultSectionId).toBe("chapter-001");
    expect(preview.previewText).toContain("The Nome King was in an angry mood");

    await removeBookRuntimeSettings(page, THE_EMERALD_CITY_OF_OZ_SLUG);
    await openGeneratedBookPreview(page, THE_EMERALD_CITY_OF_OZ_PREVIEW_PATH);
    await expectSelectedBookSectionIds(page, defaultSectionIds);
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      defaultSectionIds.join(","),
    );

    const sourcePreview = page.locator("[data-mw-morse-book-source-preview]");
    await expect(sourcePreview).toContainText(
      "The Nome King was in an angry mood",
    );
    expect(
      normalizedPreviewText(
        (await sourcePreview.textContent()) ?? "",
      ).startsWith("The Nome King was in an angry mood"),
    ).toBe(true);
  });

  test("uses individual Elderbush title and default story start", async ({
    page,
  }) => {
    expect(readGeneratedBookManifest(THE_ELDERBUSH_SLUG).author).toEqual([
      "H. C. Andersen",
    ]);
    expect(readGeneratedDefaultSectionIds(THE_ELDERBUSH_SLUG)).toEqual([
      "chapter-001",
    ]);

    await removeBookRuntimeSettings(page, THE_ELDERBUSH_SLUG);
    await openGeneratedBookPreview(page, THE_ELDERBUSH_PREVIEW_PATH);

    await expect(page.locator("h1")).toContainText("The Elderbush");
    await expect(page.getByText("H. C. Andersen").first()).toBeVisible();
    await expect(page.locator("body")).not.toContainText(/Unknown author/i);
    await expectSelectedBookSectionIds(page, ["chapter-001"]);
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "chapter-001",
    );

    const sourcePreview = page.locator("[data-mw-morse-book-source-preview]");
    await expect(sourcePreview).toContainText("THE ELDERBUSH");
    await expect(sourcePreview).toContainText(
      "Once upon a time there was a little boy",
    );
    await expect(sourcePreview).not.toContainText("ANDERSEN'S FAIRY TALES");
    await expect(sourcePreview).not.toContainText("By Hans Christian Andersen");
    expect(
      normalizedPreviewText(
        (await sourcePreview.textContent()) ?? "",
      ).startsWith("THE ELDERBUSH Once upon a time"),
    ).toBe(true);
  });

  test("repairs previous Unknown author metadata for Happy Family", async ({
    page,
  }) => {
    const manifest = readGeneratedBookManifest(THE_HAPPY_FAMILY_SLUG);
    expect(manifest.title).toBe("The Happy Family");
    expect(manifest.author).toEqual(["H. C. Andersen"]);
    expect(readGeneratedDefaultSectionIds(THE_HAPPY_FAMILY_SLUG)).toEqual([
      "chapter-001",
    ]);

    await removeBookRuntimeSettings(page, THE_HAPPY_FAMILY_SLUG);
    await openGeneratedBookPreview(page, THE_HAPPY_FAMILY_PREVIEW_PATH);

    await expect(page.locator("h1")).toContainText("The Happy Family");
    await expect(page.getByText("H. C. Andersen").first()).toBeVisible();
    await expect(page.locator("body")).not.toContainText(/Unknown author/i);
    await expectSelectedBookSectionIds(page, ["chapter-001"]);

    const sourcePreview = page.locator("[data-mw-morse-book-source-preview]");
    await expect(sourcePreview).toContainText("THE HAPPY FAMILY");
    await expect(sourcePreview).toContainText("largest green leaf");
    await expect(sourcePreview).not.toContainText("ANDERSEN'S FAIRY TALES");
    expect(
      normalizedPreviewText(
        (await sourcePreview.textContent()) ?? "",
      ).startsWith("THE HAPPY FAMILY Really"),
    ).toBe(true);
  });

  test("renders a public book shell from the per-book preview while full data is pending", async ({
    page,
  }) => {
    const aliceDefaultSectionIds = readPublicDefaultSectionIds(ALICE_SLUG);
    expect(aliceDefaultSectionIds.length).toBeGreaterThan(2);

    await page.addInitScript(
      ({ cachePrefix, slug }) => {
        Object.keys(localStorage)
          .filter(
            (key) =>
              key.startsWith(cachePrefix) ||
              key.startsWith(`morsewords:book-runtime:settings:v1:${slug}:`),
          )
          .forEach((key) => localStorage.removeItem(key));
      },
      { cachePrefix: BOOK_CACHE_KEY_PREFIX, slug: ALICE_SLUG },
    );

    const previewRequests: string[] = [];
    const previewAssetRouteRequests: string[] = [];
    const fullBookRequests: string[] = [];
    let releaseFullBook = () => {};
    const fullBookPending = new Promise<void>((resolve) => {
      releaseFullBook = resolve;
    });

    page.on("request", (request) => {
      const url = request.url();
      if (url.includes("/book-previews/")) previewRequests.push(url);
    });

    await blockExternalNetwork(page);
    await page.route(bookPreviewPattern(ALICE_SLUG), async (route) => {
      previewAssetRouteRequests.push(route.request().url());
      await route.continue();
    });
    await page.route(bookJsonPattern(ALICE_SLUG), async (route) => {
      fullBookRequests.push(route.request().url());
      await fullBookPending;
      await route.continue();
    });

    try {
      await gotoPublicBookPage(page, ALICE_PUBLIC_PATH);

      const pageRoot = page.locator("[data-mw-morse-book-page]");
      await expect(pageRoot).toHaveAttribute(
        "data-mw-morse-book-full-loading",
        "true",
      );
      await expect(pageRoot).toHaveAttribute(
        "data-mw-morse-book-preview-state",
        "preview",
      );
      await expect(page.getByTestId("morse-book-live-player")).toBeVisible();
      await expect(page.locator("#book-live-morse-player")).toBeVisible();
      await expect(page.getByTestId("morse-book-loading")).toHaveCount(0);
      await expect(page.locator("body")).not.toContainText(
        /Loading this Morse book|Loading book text|Fetching book data, preparing chapters/i,
      );
      await expect(page.locator("body")).not.toContainText(/SOS Help!/i);
      await expect(
        page.locator("[data-mw-morse-book-source-preview]"),
      ).toContainText("CHAPTER I");
      await expect(
        page.locator("[data-mw-morse-book-source-preview]"),
      ).not.toContainText("THE MILLENNIUM FULCRUM EDITION");
      await expect(
        page.locator("[data-mw-morse-book-full-loading-status]"),
      ).toBeVisible();
      await expect(
        page.locator("[data-mw-morse-book-section-skeleton]"),
      ).toHaveCount(4);
      await expect(
        page.getByTestId("morse-book-download-audiobook-link"),
      ).toBeVisible();
      await expect(page.locator("#book-mp3-download")).toBeVisible();
      await expect
        .poll(() => fullBookRequests.length, { timeout: 15_000 })
        .toBe(1);
      const previewSavedRuntimeSettings = await page.evaluate(
        ({ prefix, slug }) =>
          Object.entries(localStorage)
            .filter(([key]) => key.startsWith(`${prefix}${slug}:`))
            .map(([, value]) => value),
        { prefix: BOOK_RUNTIME_SETTINGS_KEY_PREFIX, slug: ALICE_SLUG },
      );
      expect(previewSavedRuntimeSettings).toEqual([]);

      expect(fullBookRequests).toHaveLength(1);
      expect(previewRequests).toHaveLength(0);
      expect(previewAssetRouteRequests).toHaveLength(0);
      expect(
        previewRequests.some((url) =>
          url.includes("/book-previews/manifest.json"),
        ),
      ).toBe(false);

      releaseFullBook();
      await expect(pageRoot).toHaveAttribute(
        "data-mw-morse-book-full-loading",
        "false",
      );
      await expect(pageRoot).toHaveAttribute(
        "data-mw-morse-book-preview-state",
        "ready",
      );
      await expect(
        page.locator("[data-mw-morse-book-section-skeleton]"),
      ).toHaveCount(0);

      const selectedIds = await selectedBookSectionIds(page);
      expect(selectedIds).toEqual(aliceDefaultSectionIds);
      expect(selectedIds[0]).toBe("chapter-001");
      expect(selectedIds).toContain("chapter-002");
      expect(selectedIds).toContain(
        aliceDefaultSectionIds[aliceDefaultSectionIds.length - 1],
      );
      expect(selectedIds.every((id) => id.startsWith("chapter-"))).toBe(true);
      expect(selectedIds).not.toContain("title-page-001");
      expect(selectedIds).not.toContain("title-page-002");
      await expect(
        page.locator("[data-mw-morse-book-translator-source-sections]"),
      ).toHaveAttribute(
        "data-mw-morse-book-translator-source-sections",
        aliceDefaultSectionIds.join(","),
      );
      await expect(
        page.locator(
          "[data-mw-morse-book-section-row][data-mw-morse-book-section-id='title-page-001']",
        ),
      ).toBeVisible();
      await expect(
        page.locator("[data-mw-morse-book-section-select='title-page-001']"),
      ).not.toBeChecked();
      await expect(
        page.getByRole("link", { name: /Project Gutenberg ebook #11/ }),
      ).toBeVisible();
    } finally {
      releaseFullBook();
    }
  });

  test("starts Anne from a book-specific preview and hydrates all default chapters", async ({
    page,
  }) => {
    const anneDefaultSectionIds = readPublicDefaultSectionIds(
      ANNE_OF_GREEN_GABLES_SLUG,
    );
    expect(anneDefaultSectionIds.length).toBeGreaterThan(30);

    await page.addInitScript(
      ({ cachePrefix, slug }) => {
        Object.keys(localStorage)
          .filter(
            (key) =>
              key.startsWith(cachePrefix) ||
              key.startsWith(`morsewords:book-runtime:settings:v1:${slug}:`),
          )
          .forEach((key) => localStorage.removeItem(key));
      },
      { cachePrefix: BOOK_CACHE_KEY_PREFIX, slug: ANNE_OF_GREEN_GABLES_SLUG },
    );

    const previewRequests: string[] = [];
    const fullBookRequests: string[] = [];
    let releaseFullBook = () => {};
    const fullBookPending = new Promise<void>((resolve) => {
      releaseFullBook = resolve;
    });

    page.on("request", (request) => {
      const url = request.url();
      if (url.includes("/book-previews/")) previewRequests.push(url);
    });

    await blockExternalNetwork(page);
    await page.route(
      bookJsonPattern(ANNE_OF_GREEN_GABLES_SLUG),
      async (route) => {
        fullBookRequests.push(route.request().url());
        await fullBookPending;
        await route.continue();
      },
    );

    try {
      await gotoPublicBookPage(page, ANNE_OF_GREEN_GABLES_PUBLIC_PATH);

      const pageRoot = page.locator("[data-mw-morse-book-page]");
      await expect(pageRoot).toHaveAttribute(
        "data-mw-morse-book-full-loading",
        "true",
      );
      await expect(pageRoot).toHaveAttribute(
        "data-mw-morse-book-preview-state",
        "preview",
      );
      await expect(page.getByTestId("morse-book-live-player")).toBeVisible();
      await expect(page.locator("body")).not.toContainText(/SOS Help!/i);
      await expect(
        page.locator("[data-mw-morse-book-source-preview]"),
      ).toContainText("Mrs. Rachel Lynde");
      await expect(
        page.locator("[data-mw-morse-book-source-preview]"),
      ).not.toContainText("Project Gutenberg");
      await expect(
        page.locator("[data-mw-morse-book-full-loading-status]"),
      ).toBeVisible();
      expect(previewRequests).toHaveLength(0);
      await expect
        .poll(() => fullBookRequests.length, { timeout: 15_000 })
        .toBe(1);

      releaseFullBook();
      await waitForApprovedBookWorkspace(page);
      await expectSelectedBookSectionIds(page, anneDefaultSectionIds);
      expect(anneDefaultSectionIds[0]).toBe("chapter-001");
      expect(anneDefaultSectionIds).toContain("chapter-002");
      expect(anneDefaultSectionIds).toContain("chapter-038");
      await expect(
        page.locator("[data-mw-morse-book-section-select='title-page-001']"),
      ).toHaveCount(0);
      await expect(
        page.locator("[data-mw-morse-book-translator-source-sections]"),
      ).toHaveAttribute(
        "data-mw-morse-book-translator-source-sections",
        anneDefaultSectionIds.join(","),
      );
    } finally {
      releaseFullBook();
    }
  });

  test("loads an approved audiobook page with one whole-book JSON and audio controls", async ({
    page,
  }) => {
    const bookJsonRequests: string[] = [];
    await blockExternalNetwork(page);
    await page.route(bookJsonPattern(NETWORK_BOOK_SLUG), async (route) => {
      bookJsonRequests.push(route.request().url());
      await route.continue();
    });

    await gotoPublicBookPage(page, NETWORK_AUDIOBOOK_PUBLIC_PATH);
    await waitForApprovedBookWorkspace(page);
    await expect(page.locator("[data-mw-morse-book-page]")).toHaveAttribute(
      "data-mw-morse-book-page-mode",
      "audiobook",
    );
    await expect(page.locator("h1")).toContainText(/Jekyll|Hyde/);
    await expect(
      page.locator("[data-testid='morse-audiobook-audio-first-panel']"),
    ).toBeVisible();
    await expect(page.getByTestId("morse-book-live-player")).toBeVisible();
    await expect(
      page.getByTestId("morse-audiobook-section-chooser"),
    ).toBeVisible();
    await expect(page.getByTestId("morse-audiobook-export-plan")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Play selection" }),
    ).toBeVisible();
    await expect(
      page.getByTestId("book-video-preview-workflow"),
    ).not.toBeVisible();
    await expect(
      page.getByTestId("morse-book-live-section-select"),
    ).not.toBeVisible();
    await expect(
      page.getByTestId("morse-book-mp3-download-link"),
    ).toHaveAttribute("href", "#book-mp3-download");
    await expect(page.getByText(["Download", "MP4"].join(" "))).toHaveCount(0);
    await expect(page.getByText(["Download", "WebM"].join(" "))).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: /Project Gutenberg ebook #43/ }),
    ).toHaveAttribute("href", "https://www.gutenberg.org/ebooks/43");
    const audiobookHeader = page.getByTestId("morse-book-header");
    await expect(
      audiobookHeader.getByTestId("morse-book-summary-link"),
    ).toHaveAttribute("href", "#book-summary");
    await expect(
      audiobookHeader.getByTestId("morse-book-seo-summary"),
    ).toHaveCount(0);
    await expect(
      audiobookHeader.getByTestId("morse-book-content-suitability"),
    ).toHaveCount(0);
    await expect(
      audiobookHeader.getByTestId("morse-book-related-author"),
    ).toHaveCount(0);
    const audiobookSummary = page.getByTestId("morse-book-seo-summary");
    await expect(audiobookSummary).toBeVisible();
    await expect(
      audiobookSummary.getByRole("heading", {
        name: /About .+ as a Morse Code Audiobook/,
      }),
    ).toBeVisible();
    await expect(
      audiobookSummary.getByTestId("morse-book-content-suitability"),
    ).toHaveCount(1);
    await expect(page.getByTestId("morse-book-related-author")).toBeVisible();
    const audiobookSummaryAfterSource = await page.evaluate(() => {
      const source = document.querySelector(
        '[data-testid="morse-book-source-notes"]',
      );
      const summary = document.querySelector("#book-summary");
      return Boolean(
        source &&
          summary &&
          (source.compareDocumentPosition(summary) &
            Node.DOCUMENT_POSITION_FOLLOWING) !==
            0,
      );
    });
    expect(audiobookSummaryAfterSource).toBe(true);
    expect(bookJsonRequests).toHaveLength(1);

    const readableDefaults = page.locator(
      "[data-mw-morse-book-select-all-default]",
    );
    await expect(readableDefaults).toBeChecked();
    await readableDefaults.uncheck();
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute("data-mw-morse-book-translator-source-sections", "");
    await readableDefaults.check();
    expect(bookJsonRequests).toHaveLength(1);

    const schemaText = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) =>
        nodes.map((node) => node.textContent ?? "").join("\n"),
      );
    expect(schemaText).toContain("live Morse player");
    expect(schemaText).toContain(NETWORK_AUDIOBOOK_PUBLIC_PATH);
    expect(schemaText).not.toContain("AudioObject");
    expect(schemaText).not.toContain("aggregateRating");
    expect(schemaText).not.toContain("reviewRating");
    expect(schemaText).not.toContain('"price"');
  });

  test("keeps book previews and audiobook audio controls within mobile and desktop widths", async ({
    browser,
  }) => {
    const viewports = [
      { height: 844, pathName: THE_WAR_OF_THE_WORLDS_PUBLIC_PATH, width: 390 },
      {
        height: 844,
        pathName: THE_WAR_OF_THE_WORLDS_AUDIOBOOK_PUBLIC_PATH,
        width: 430,
      },
      { height: 844, pathName: THE_DUNWICH_HORROR_PUBLIC_PATH, width: 480 },
      { height: 900, pathName: ALICE_AUDIOBOOK_PUBLIC_PATH, width: 640 },
      { height: 900, pathName: BESPOKE_PASS_2_BOOK_PUBLIC_PATH, width: 768 },
      { height: 900, pathName: THE_WAR_OF_THE_WORLDS_PUBLIC_PATH, width: 1024 },
      {
        desktop: true,
        height: 900,
        pathName: THE_WAR_OF_THE_WORLDS_AUDIOBOOK_PUBLIC_PATH,
        width: 1280,
      },
      {
        desktop: true,
        height: 1000,
        pathName: THE_DUNWICH_HORROR_PUBLIC_PATH,
        width: 1440,
      },
    ];

    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const viewportPage = await context.newPage();
      try {
        await blockExternalNetwork(viewportPage);
        await gotoPublicBookPage(viewportPage, viewport.pathName);
        await waitForApprovedBookWorkspace(viewportPage);

        const livePlayer = viewportPage.getByTestId("morse-book-live-player");
        await expect(livePlayer).toBeVisible();
        const isAudiobook = viewport.pathName.includes(
          "/morse-code-audiobooks/",
        );
        if (isAudiobook) {
          await expect(
            livePlayer.getByRole("button", { name: "Play selection" }),
          ).toBeVisible();
          await expect(
            livePlayer.getByTestId("book-video-preview-workflow"),
          ).not.toBeVisible();
          await expect(
            viewportPage.getByTestId("morse-audiobook-section-chooser"),
          ).toBeVisible();
        } else {
          await expect(
            livePlayer.getByTestId("book-video-preview-frame"),
          ).toBeVisible();
          await expect(
            livePlayer.getByRole("button", { name: "Play live player" }),
          ).toBeVisible();
          await expect(
            livePlayer.getByTestId("book-video-preview-timing-strip"),
          ).toBeVisible();
          const metrics = await readPreviewFitMetrics(livePlayer);
          expectPreviewFitsFrame(metrics);

          if (viewport.desktop) {
            const ratio = metrics.frame.width / metrics.frame.height;
            expect(ratio).toBeGreaterThan(1.65);
            expect(ratio).toBeLessThan(1.9);
          }
        }

        const widthState = await viewportPage.evaluate(() => ({
          innerWidth: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
        }));
        expect(widthState.scrollWidth).toBeLessThanOrEqual(
          widthState.innerWidth + 1,
        );
      } finally {
        await context.close();
      }
    }
  });

  test("guards book live player completion against duplicate and stale segment advances", async ({
    page,
  }) => {
    await removeBookRuntimeSettings(page, THE_WAR_OF_THE_WORLDS_SLUG);
    await openPublicBook(page, THE_WAR_OF_THE_WORLDS_PUBLIC_PATH);
    await waitForLivePlayerTestHook(page);

    await expect
      .poll(async () => (await readLivePlayerHookState(page)).segmentCount)
      .toBeGreaterThan(1);
    const initialState = await readLivePlayerHookState(page);
    expect(initialState.segmentIndex).toBe(0);
    const staleToken = await captureLivePlayerCompletion(page);
    await page.evaluate(() => {
      const hook = (window as LivePlayerTestWindow)
        .__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__;
      if (!hook) throw new Error("Missing live player test hook.");
      hook.startCurrentSegment();
    });
    await expect
      .poll(async () => (await readLivePlayerHookState(page)).playing)
      .toBe(true);
    await expect
      .poll(async () => (await readLivePlayerHookState(page)).sessionId)
      .toBeGreaterThan(staleToken.sessionId);

    const duplicateResult = await page.evaluate(() => {
      const hook = (window as LivePlayerTestWindow)
        .__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__;
      if (!hook) throw new Error("Missing live player test hook.");
      return hook.completeCurrentSegmentTwice();
    });
    expect(duplicateResult).toEqual({ first: true, second: false });
    await expect
      .poll(async () => (await readLivePlayerHookState(page)).segmentIndex)
      .toBe(1);

    await expect(
      completeCapturedLivePlayerSegment(page, staleToken),
    ).resolves.toBe(false);
    const afterStaleCompletion = await readLivePlayerHookState(page);
    expect(afterStaleCompletion.segmentIndex).toBe(1);
    expect(afterStaleCompletion.sessionId).toBeGreaterThan(
      initialState.sessionId,
    );
  });

  test("invalidates book live player completions on restart and manual segment change", async ({
    page,
  }) => {
    await removeBookRuntimeSettings(page, THE_WAR_OF_THE_WORLDS_SLUG);
    await openPublicBook(page, THE_WAR_OF_THE_WORLDS_PUBLIC_PATH);
    await waitForLivePlayerTestHook(page);
    await expect
      .poll(async () => (await readLivePlayerHookState(page)).segmentCount)
      .toBeGreaterThan(1);

    await page.evaluate(() => {
      const hook = (window as LivePlayerTestWindow)
        .__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__;
      if (!hook) throw new Error("Missing live player test hook.");
      hook.startCurrentSegment();
    });
    await expect
      .poll(async () => (await readLivePlayerHookState(page)).playing)
      .toBe(true);

    const runningToken = await captureLivePlayerCompletion(page);
    await page.evaluate(() => {
      const hook = (window as LivePlayerTestWindow)
        .__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__;
      if (!hook) throw new Error("Missing live player test hook.");
      hook.restartCurrentSegment();
    });
    await expect
      .poll(async () => (await readLivePlayerHookState(page)).sessionId)
      .toBeGreaterThan(runningToken.sessionId);

    await expect(
      completeCapturedLivePlayerSegment(page, runningToken),
    ).resolves.toBe(false);
    const afterRestartStaleCompletion = await readLivePlayerHookState(page);
    expect(afterRestartStaleCompletion.segmentIndex).toBe(0);
    expect(afterRestartStaleCompletion.playing).toBe(true);

    const currentToken = await captureLivePlayerCompletion(page);
    await page.evaluate(() => {
      const hook = (window as LivePlayerTestWindow)
        .__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__;
      if (!hook) throw new Error("Missing live player test hook.");
      hook.selectSegment(1);
    });
    await expect
      .poll(async () => (await readLivePlayerHookState(page)).segmentIndex)
      .toBe(1);
    await expect(
      completeCapturedLivePlayerSegment(page, currentToken),
    ).resolves.toBe(false);
    expect((await readLivePlayerHookState(page)).segmentIndex).toBe(1);
  });

  test("keeps near-end restart on the current book segment", async ({
    page,
  }) => {
    await openTestBook(page);
    await waitForLivePlayerTestHook(page);

    const completionToken = await captureLivePlayerCompletion(page);
    await page.evaluate((nearEndElapsedMs) => {
      const hook = (window as LivePlayerTestWindow)
        .__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__;
      if (!hook) throw new Error("Missing live player test hook.");
      hook.startCurrentSegment(nearEndElapsedMs);
    }, completionToken.durationMs - 100);

    await expect
      .poll(async () => {
        const state = await readLivePlayerHookState(page);
        return {
          elapsedUnderRestartThreshold: state.elapsedMs < 1_000,
          playing: state.playing,
          segmentIndex: state.segmentIndex,
        };
      })
      .toEqual({
        elapsedUnderRestartThreshold: true,
        playing: true,
        segmentIndex: 0,
      });
    await expect(
      completeCapturedLivePlayerSegment(page, completionToken),
    ).resolves.toBe(false);
    expect((await readLivePlayerHookState(page)).segmentIndex).toBe(0);
  });

  test("guards audiobook live player completion against duplicate section advances", async ({
    page,
  }) => {
    await openPublicBook(page, NETWORK_AUDIOBOOK_PUBLIC_PATH);
    await waitForLivePlayerTestHook(page);

    const initialState = await readLivePlayerHookState(page);
    expect(initialState.sectionIndex).toBeGreaterThanOrEqual(0);
    expect(initialState.sectionIndex).toBeLessThan(
      initialState.sectionCount - 1,
    );
    const staleToken = await captureLivePlayerCompletion(page);
    const duplicateResult = await page.evaluate(() => {
      const hook = (window as LivePlayerTestWindow)
        .__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__;
      if (!hook) throw new Error("Missing live player test hook.");
      return hook.completeCurrentSegmentTwice();
    });
    expect(duplicateResult).toEqual({ first: true, second: false });

    const expectedNext =
      initialState.segmentIndex + 1 < initialState.segmentCount
        ? {
            sectionIndex: initialState.sectionIndex,
            segmentIndex: initialState.segmentIndex + 1,
          }
        : {
            sectionIndex: initialState.sectionIndex + 1,
            segmentIndex: 0,
          };
    await expect
      .poll(async () => {
        const state = await readLivePlayerHookState(page);
        return {
          sectionIndex: state.sectionIndex,
          segmentIndex: state.segmentIndex,
        };
      })
      .toEqual(expectedNext);
    await expect(
      completeCapturedLivePlayerSegment(page, staleToken),
    ).resolves.toBe(false);
    await expect
      .poll(async () => {
        const state = await readLivePlayerHookState(page);
        return {
          sectionIndex: state.sectionIndex,
          segmentIndex: state.segmentIndex,
        };
      })
      .toEqual(expectedNext);
  });

  test("restores audiobook progress once without overriding near-end restart", async ({
    page,
  }) => {
    const content = readPublicBookContentFixture(NETWORK_BOOK_SLUG);
    const firstReadableSection =
      content.manifest.sections.find((section) => section.includeByDefault) ??
      content.manifest.sections[0];
    expect(firstReadableSection).toBeTruthy();
    await seedAudiobookRuntimeProgress(page, {
      elapsedMs: 20_000,
      sectionId: firstReadableSection!.id,
      slug: NETWORK_BOOK_SLUG,
    });
    await openPublicBook(page, NETWORK_AUDIOBOOK_PUBLIC_PATH);
    await waitForLivePlayerTestHook(page);

    await expect
      .poll(async () => {
        const state = await readLivePlayerHookState(page);
        return {
          elapsedRestored: state.elapsedMs >= 20_000,
          sectionId: state.sectionId,
        };
      })
      .toEqual({
        elapsedRestored: true,
        sectionId: firstReadableSection!.id,
      });

    const staleToken = await captureLivePlayerCompletion(page);
    await page.evaluate((nearEndElapsedMs) => {
      const hook = (window as LivePlayerTestWindow)
        .__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__;
      if (!hook) throw new Error("Missing live player test hook.");
      hook.startCurrentSegment(nearEndElapsedMs);
    }, staleToken.durationMs - 100);

    await expect
      .poll(async () => {
        const state = await readLivePlayerHookState(page);
        return {
          elapsedUnderRestartThreshold: state.elapsedMs < 1_000,
          playing: state.playing,
          sectionId: state.sectionId,
          segmentIndex: state.segmentIndex,
        };
      })
      .toEqual({
        elapsedUnderRestartThreshold: true,
        playing: true,
        sectionId: firstReadableSection!.id,
        segmentIndex: 0,
      });
    await expect(
      completeCapturedLivePlayerSegment(page, staleToken),
    ).resolves.toBe(false);
    const afterStaleCompletion = await readLivePlayerHookState(page);
    expect(afterStaleCompletion.sectionId).toBe(firstReadableSection!.id);
    expect(afterStaleCompletion.segmentIndex).toBe(0);
  });

  test("invalidates audiobook live player completion on manual section advance", async ({
    page,
  }) => {
    await openPublicBook(page, NETWORK_AUDIOBOOK_PUBLIC_PATH);
    await waitForLivePlayerTestHook(page);

    const initialState = await readLivePlayerHookState(page);
    expect(initialState.sectionIndex).toBeLessThan(
      initialState.sectionCount - 1,
    );
    await page.evaluate(() => {
      const hook = (window as LivePlayerTestWindow)
        .__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__;
      if (!hook) throw new Error("Missing live player test hook.");
      hook.startCurrentSegment();
    });
    await expect
      .poll(async () => (await readLivePlayerHookState(page)).playing)
      .toBe(true);
    const runningToken = await captureLivePlayerCompletion(page);

    const nextSectionIndex = initialState.sectionIndex + 1;
    await page.evaluate(() => {
      const hook = (window as LivePlayerTestWindow)
        .__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__;
      if (!hook) throw new Error("Missing live player test hook.");
      hook.nextSection();
    });
    await expect
      .poll(async () => {
        const state = await readLivePlayerHookState(page);
        return {
          elapsedUnderRestartThreshold: state.elapsedMs < 1_000,
          playing: state.playing,
          sectionIndex: state.sectionIndex,
          segmentIndex: state.segmentIndex,
        };
      })
      .toEqual({
        elapsedUnderRestartThreshold: true,
        playing: false,
        sectionIndex: nextSectionIndex,
        segmentIndex: 0,
      });

    await expect(
      completeCapturedLivePlayerSegment(page, runningToken),
    ).resolves.toBe(false);
    const afterStaleCompletion = await readLivePlayerHookState(page);
    expect(afterStaleCompletion.sectionIndex).toBe(nextSectionIndex);
    expect(afterStaleCompletion.segmentIndex).toBe(0);
  });

  test("caches opened approved book JSON and serves a valid cache hit offline", async ({
    page,
  }) => {
    await openPublicBook(page, NETWORK_BOOK_PUBLIC_PATH);
    await waitForApprovedBookWorkspace(page);

    const cachedKeys = await page.evaluate(
      (prefix) =>
        Object.keys(localStorage).filter((key) => key.startsWith(prefix)),
      BOOK_CACHE_KEY_PREFIX,
    );
    expect(cachedKeys).toHaveLength(1);
    expect(cachedKeys[0]).toContain(NETWORK_BOOK_SLUG);

    let jsonRequests = 0;
    await page.route(bookJsonPattern(NETWORK_BOOK_SLUG), async (route) => {
      jsonRequests += 1;
      await route.abort();
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await waitForApprovedBookWorkspace(page);
    expect(jsonRequests).toBe(0);
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).toBeVisible();
  });

  test("stale cached book JSON is ignored and refetched", async ({ page }) => {
    const publicManifest = readJson<{
      books: Array<{
        slug: string;
        contentVersion: string;
        contentHash: string;
      }>;
    }>("app/client/assets/books/cloudflare-export/public-manifest.json");
    const treasure = publicManifest.books.find(
      (book) => book.slug === STALE_CACHE_BOOK_SLUG,
    );
    expect(treasure).toBeTruthy();
    await page.addInitScript(
      ({ hash, prefix, version }) => {
        localStorage.setItem(
          `${prefix}${slug}:${version}:${hash}`,
          JSON.stringify({
            schemaVersion: 1,
            slug,
            contentVersion: "stale-version",
            contentHash: hash,
            manifest: { slug: "treasure-island" },
            sections: [],
          }),
        );
      },
      {
        prefix: BOOK_CACHE_KEY_PREFIX,
        slug: STALE_CACHE_BOOK_SLUG,
        version: treasure!.contentVersion,
        hash: treasure!.contentHash,
      },
    );
    const bookJsonRequests: string[] = [];
    await blockExternalNetwork(page);
    await page.route(bookJsonPattern(STALE_CACHE_BOOK_SLUG), async (route) => {
      bookJsonRequests.push(route.request().url());
      await route.continue();
    });

    await gotoPublicBookPage(page, STALE_CACHE_BOOK_PUBLIC_PATH);
    await waitForApprovedBookWorkspace(page);
    expect(bookJsonRequests).toHaveLength(1);
  });

  test("keeps the starter preview readable when book JSON fetch fails or is malformed", async ({
    page,
  }) => {
    const expectStarterPreviewFallback = async () => {
      await waitForApprovedBookWorkspace(page);
      await expect(
        page.locator("[data-testid='morse-book-load-error']"),
      ).toHaveCount(0);
      await expect(page.locator("[data-mw-morse-book-page]")).toHaveAttribute(
        "data-mw-morse-book-preview-state",
        "ready",
      );
      await expect(page.getByTestId("morse-book-live-player")).toBeVisible();
      await expect(
        page.locator("[data-mw-morse-book-section-row]"),
      ).not.toHaveCount(0);
      const sourcePreview = page.locator("[data-mw-morse-book-source-preview]");
      await expect(sourcePreview).toBeVisible();
      const previewText = normalizedPreviewText(
        (await sourcePreview.textContent()) ?? "",
      );
      expect(previewText.length).toBeGreaterThan(200);
      await expect(
        page.getByText(/approved text file|approved book JSON/i),
      ).toHaveCount(0);
    };

    let fail = true;
    await blockExternalNetwork(page);
    await page.route(bookJsonPattern(ERROR_BOOK_SLUG), async (route) => {
      if (fail) {
        await new Promise((resolve) => setTimeout(resolve, 250));
        await route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({ error: "unavailable" }),
        });
        return;
      }
      await route.continue();
    });

    const initialResponse = await page.goto(ERROR_BOOK_PUBLIC_PATH, {
      waitUntil: "domcontentloaded",
    });
    expect(initialResponse?.ok()).toBe(true);
    const pageRoot = page.locator("[data-mw-morse-book-page]");
    await expect(pageRoot).toHaveAttribute(
      "data-mw-morse-book-full-loading",
      "true",
    );
    await expect(pageRoot).toHaveAttribute(
      "data-mw-morse-book-preview-state",
      "preview",
    );
    await expect(page.getByTestId("morse-book-loading")).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText(
      /Loading this Morse book|Loading book text|Fetching book data, preparing chapters/i,
    );
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).toBeVisible();
    await expect(
      page.locator("[data-mw-morse-book-full-loading-status]"),
    ).toContainText(/Loading full book sections/);
    await expectStarterPreviewFallback();

    fail = false;
    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForApprovedBookWorkspace(page);

    await page.evaluate(() => localStorage.clear());
    await page.unroute(bookJsonPattern(ERROR_BOOK_SLUG));
    await page.route(bookJsonPattern(ERROR_BOOK_SLUG), async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ schemaVersion: 1, slug: "treasure-island" }),
      });
    });
    await page.goto(ERROR_BOOK_PUBLIC_PATH, { waitUntil: "domcontentloaded" });
    await expectStarterPreviewFallback();
  });

  test("renders preview-backed book and audiobook routes without the full loading shell", async ({
    browser,
    page,
  }) => {
    await blockExternalNetwork(page);

    for (const pathName of STARTER_PREVIEW_FIRST_RENDER_PATHS) {
      await gotoPublicBookPage(page, pathName);
      const pageRoot = page.locator("[data-mw-morse-book-page]");
      await expect(pageRoot).toBeVisible();
      await expect(page.getByTestId("morse-book-loading")).toHaveCount(0);
      await expect(page.locator("body")).not.toContainText(
        /Loading this Morse book|Loading this Morse audiobook|Loading book text|Fetching book data, preparing chapters/i,
      );
      const starterContent = pathName.includes("/morse-code-audiobooks/")
        ? page.getByTestId("morse-book-live-player")
        : page.locator("[data-mw-morse-book-source-preview]");
      await expect(starterContent).toBeVisible();
      expect(
        normalizedPreviewText((await starterContent.textContent()) ?? "")
          .length,
      ).toBeGreaterThan(200);
      const desktopWidth = await page.evaluate(() => ({
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(desktopWidth.scrollWidth).toBeLessThanOrEqual(
        desktopWidth.innerWidth + 1,
      );
      const summaryAfterSource = await page.evaluate(() => {
        const source = document.querySelector(
          '[data-testid="morse-book-source-notes"]',
        );
        const summary = document.querySelector("#book-summary");
        return Boolean(
          source &&
            summary &&
            (source.compareDocumentPosition(summary) &
              Node.DOCUMENT_POSITION_FOLLOWING) !==
              0,
        );
      });
      expect(summaryAfterSource).toBe(true);
    }

    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
    });
    const mobilePage = await mobileContext.newPage();
    try {
      await blockExternalNetwork(mobilePage);
      for (const pathName of STARTER_PREVIEW_FIRST_RENDER_PATHS) {
        await gotoPublicBookPage(mobilePage, pathName);
        await expect(mobilePage.getByTestId("morse-book-loading")).toHaveCount(
          0,
        );
        const mobileStarterContent = pathName.includes(
          "/morse-code-audiobooks/",
        )
          ? mobilePage.getByTestId("morse-book-live-player")
          : mobilePage.locator("[data-mw-morse-book-source-preview]");
        await expect(mobileStarterContent).toBeVisible();
        const mobileWidth = await mobilePage.evaluate(() => ({
          innerWidth: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
        }));
        expect(mobileWidth.scrollWidth).toBeLessThanOrEqual(
          mobileWidth.innerWidth + 1,
        );
      }
    } finally {
      await mobileContext.close();
    }

    for (const pathName of ["/morse-code-books", "/morse-code-audiobooks"]) {
      const response = await page.goto(pathName, {
        waitUntil: "domcontentloaded",
      });
      await waitForRouteReady(page);
      expect(response?.ok()).toBe(true);
      await expect(page.locator("body")).toContainText(
        String(EXPECTED_GENERATED_BOOK_COUNT),
      );
    }
  });

  test("renders approved book selector labels without detector artifacts", async ({
    page,
  }) => {
    await openAnneBook(page);
    await expect(
      page.locator("[data-mw-morse-book-section-label]").first(),
    ).toBeVisible();

    const labels = await page
      .locator("[data-mw-morse-book-section-label]")
      .evaluateAll((nodes) =>
        nodes.map((node) => node.textContent?.trim() ?? ""),
      );
    const labelText = labels.join("\n");

    expect(labels).toContain("Chapter 13: The Delights of Anticipation");
    expect(labelText).not.toMatch(/Book\s+501|Book\s+5\s+01/i);
    expect(labelText).not.toMatch(
      /Diana lent me|That was a thrilling book|The heroine had/i,
    );

    const states = await page
      .locator("[data-mw-morse-book-section-selection-state]")
      .evaluateAll((nodes) =>
        nodes.map((node) => node.textContent?.trim() ?? ""),
      );
    expect(states.length).toBeGreaterThan(0);
    expect(states).toContain("Included");
    expect(
      states.every(
        (state) => state === "Included" || state === "Available section",
      ),
    ).toBe(true);
  });

  test("renders a public processed preview with ordered sections and cleaned text", async ({
    page,
  }, testInfo) => {
    await openPreview(page);

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "index,follow",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.morsewords.com/morse-code-books/alices-adventures-in-wonderland",
    );
    await expect(
      page.locator("[data-mw-morse-book-cover-placeholder='true']"),
    ).toBeVisible();
    await expect(
      page.locator("[data-mw-morse-book-cover-placeholder='true'] img"),
    ).toHaveCount(0);

    const sectionIds = await page
      .locator("[data-mw-morse-book-section-id]")
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("data-mw-morse-book-section-id")),
      );
    expect(sectionIds.slice(0, 4)).toEqual([
      "title-page-001",
      "title-page-002",
      "chapter-001",
      "chapter-002",
    ]);

    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      /chapter-001,chapter-002/,
    );
    await expect(
      page.locator("[data-mw-morse-book-select-all-default]"),
    ).toBeChecked();

    const sourcePreview = page.locator("[data-mw-morse-book-source-preview]");
    await expect(sourcePreview).toContainText("CHAPTER I");
    await expect(sourcePreview).not.toContainText("Project Gutenberg");
    await expect(sourcePreview).not.toContainText(
      "START OF THE PROJECT GUTENBERG",
    );
    await expect(
      page.getByRole("link", {
        name: "Original source: Project Gutenberg ebook #11",
      }),
    ).toHaveAttribute("href", "https://www.gutenberg.org/ebooks/11");
    await expect(
      page.getByText("Downloads are unavailable for this book."),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Download MP3" }),
    ).toBeDisabled();
    await expect(
      page.locator("[data-mw-morse-book-download-blocked]"),
    ).toContainText("Choose Split by duration");

    const morsePreview = page.locator("[data-mw-morse-book-morse-preview]");
    const morseText = (await morsePreview.textContent()) ?? "";
    expect(morseText).toContain("-.-.");
    expect(morseText).not.toContain("Project Gutenberg");
    expect(morseText.length).toBeLessThanOrEqual(2805);

    await saveScreenshot(page, testInfo, "morse-book-preview-desktop.png");
  });

  test("keeps no-split explicit and requires duration splitting for long MP3 exports", async ({
    page,
  }) => {
    await openPreview(page);

    await expect(page.getByRole("radio", { name: "No split" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Download MP3" }),
    ).toBeDisabled();
    await expect(
      page.locator("[data-mw-morse-book-download-blocked]"),
    ).toContainText("Choose Split by duration");
    await expect(
      page.locator("[data-mw-morse-book-long-export-note]"),
    ).toHaveCount(0);
    await expect(page.getByText("ZIP is shown only")).toHaveCount(0);

    await page.getByRole("radio", { name: "Split by duration" }).click();
    await expect(page.getByLabel("Part duration")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Download MP3 parts" }),
    ).toBeEnabled();
    await expect(
      page.locator("[data-mw-morse-book-split-warning]"),
    ).toBeVisible();
    await expect(page.getByText(["Download", "MP4"].join(" "))).toHaveCount(0);
    await expect(page.getByText(["Download", "WebM"].join(" "))).toHaveCount(0);
  });

  test("keeps audio size estimates without video export controls", async ({
    page,
  }) => {
    await page.addInitScript((key) => {
      localStorage.removeItem(key);
    }, TEST_BOOK_RUNTIME_SETTINGS_KEY);
    await openTestBook(page);

    await expect(page.getByTestId("morse-book-output-estimate")).toContainText(
      /\d+(?:\.\d+)?\s*(?:B|KB|MB|GB)/,
    );
    await expect(page.getByTestId("morse-book-output-format")).toHaveCount(0);
    await expect(page.getByText(["Video", "format"].join(" "))).toHaveCount(0);
    await expect(page.getByText(["Rendering", "video"].join(" "))).toHaveCount(
      0,
    );
    await expect(page.getByText(/Estimate\s+MP4|Estimate\s+WebM/i)).toHaveCount(
      0,
    );
    await expect(
      page.getByRole("button", { name: ["Download", "MP4"].join(" ") }),
    ).toHaveCount(0);
  });

  test("displays Art of War author and context separately", async ({
    page,
  }) => {
    await openPublicBook(page, ART_OF_WAR_PUBLIC_PATH);

    await expect(page.locator("h1")).toContainText("The Art of War");
    await expect(
      page.getByRole("heading", { name: "Sunzi", exact: true }),
    ).toBeVisible();
    await expect(page.getByTestId("morse-book-author-context")).toContainText(
      "Active 6th century B.C.",
    );
    await expect(page.getByText("active 6th century B.C. Sunzi")).toHaveCount(
      0,
    );
  });

  test("does not show internal review or processing labels publicly", async ({
    page,
  }) => {
    await openApprovedBook(page);

    await expect(
      page.getByText(
        /manual-review|rights gate|review queue|publish-ready|Lazy JSON|Rights review|generated reports/i,
      ),
    ).toHaveCount(0);
    await expect(page.getByText("Available", { exact: true })).toBeVisible();
  });

  test("renders a noindex publish-ready fixture with selected chapters and direct downloads", async ({
    page,
  }) => {
    await openTestBook(page);

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator("[data-mw-morse-book-page]")).toHaveAttribute(
      "data-mw-morse-book-available",
      "true",
    );
    await expect(
      page.getByRole("link", { name: /Project Gutenberg ebook/ }),
    ).toHaveCount(0);
    await expect(
      page.locator("[data-mw-morse-book-select-all-default]"),
    ).toBeChecked();
    await expect(
      page.getByRole("button", { name: "Current section" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Selected sections" }),
    ).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Full book" })).toHaveCount(
      0,
    );
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "chapter-001,chapter-002",
    );
    await expect(page.getByRole("radio", { name: "No split" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Download MP3" }),
    ).toBeEnabled();
    await expect(page.getByText("ZIP is shown because")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: ["Download", "MP4"].join(" ") }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: ["Download", "WebM"].join(" ") }),
    ).toHaveCount(0);
    await expect(
      page.getByTestId("morse-book-live-player-link"),
    ).toHaveAttribute(
      "href",
      /\/morse-code-audiobooks\/test-published-morse-book/,
    );

    const downloadPromise = page.waitForEvent("download", { timeout: 30_000 });
    await page.getByRole("button", { name: "Download MP3" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(
      /test-published-morse-book.*\.mp3$/i,
    );

    const storedMedia = await page.evaluate(() => {
      const entries = [
        ...Object.entries(window.localStorage),
        ...Object.entries(window.sessionStorage),
      ];
      return entries
        .map(([key, value]) => `${key}:${value.slice(0, 80)}`)
        .filter((entry) => /(blob|base64|webm|mp3|wav|zip)/i.test(entry));
    });
    expect(storedMedia).toEqual([]);
  });

  test("loads readable default sections in stable order and keeps source notes manually selectable", async ({
    page,
  }) => {
    await openTestBook(page);

    await expectSelectedBookSectionIds(page, ["chapter-001", "chapter-002"]);
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "chapter-001,chapter-002",
    );
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).toContainText("CHAPTER I");
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).toContainText("CHAPTER II");
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).not.toContainText("development-only fixture");

    const sourceNoteRow = page.locator(
      "[data-mw-morse-book-section-row][data-mw-morse-book-section-id='source-license-001']",
    );
    await expect(sourceNoteRow).toBeVisible();
    await expect(
      sourceNoteRow.locator("[data-mw-morse-book-section-label]"),
    ).toHaveText("Source note");
    await expect(
      sourceNoteRow.locator("[data-mw-morse-book-section-kind]"),
    ).toHaveText("Source note");
    await expect(
      page.locator("[data-mw-morse-book-section-select='source-license-001']"),
    ).not.toBeChecked();
    await page.locator("[data-mw-morse-book-select-all-default]").uncheck();
    await expectSelectedBookSectionIds(page, []);
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute("data-mw-morse-book-translator-source-sections", "");
    await page
      .locator("[data-mw-morse-book-section-select='source-license-001']")
      .check();
    await expectSelectedBookSectionIds(page, ["source-license-001"]);
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "source-license-001",
    );
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).toContainText("development-only fixture");

    await page.getByRole("button", { name: "Select all" }).click();
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "chapter-001,chapter-002,source-license-001",
    );
  });

  test("defaults public Gutenberg books to readable chapters while front matter remains selectable", async ({
    page,
  }) => {
    const aliceDefaultSectionIds = readPublicDefaultSectionIds(ALICE_SLUG);
    expect(aliceDefaultSectionIds.length).toBeGreaterThan(2);

    await page.addInitScript((slug) => {
      Object.keys(localStorage)
        .filter((key) =>
          key.startsWith(`morsewords:book-runtime:settings:v1:${slug}:`),
        )
        .forEach((key) => localStorage.removeItem(key));
    }, ALICE_SLUG);
    await openPublicBook(page, ALICE_PUBLIC_PATH);

    const selectedIds = await selectedBookSectionIds(page);
    expect(selectedIds).toEqual(aliceDefaultSectionIds);
    expect(selectedIds[0]).toBe("chapter-001");
    expect(selectedIds).toContain("chapter-002");
    expect(selectedIds).toContain(
      aliceDefaultSectionIds[aliceDefaultSectionIds.length - 1],
    );
    expect(selectedIds.every((id) => id.startsWith("chapter-"))).toBe(true);
    expect(selectedIds).not.toContain("title-page-001");
    expect(selectedIds).not.toContain("title-page-002");

    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      aliceDefaultSectionIds.join(","),
    );
    const sourceSectionIds = (
      (await page
        .locator("[data-mw-morse-book-translator-source-sections]")
        .getAttribute("data-mw-morse-book-translator-source-sections")) ?? ""
    )
      .split(",")
      .filter(Boolean);
    expect(sourceSectionIds).toEqual(aliceDefaultSectionIds);
    expect(sourceSectionIds[0]).toBe("chapter-001");
    expect(sourceSectionIds).not.toContain("title-page-001");
    expect(sourceSectionIds).not.toContain("title-page-002");

    const openingRow = page.locator(
      "[data-mw-morse-book-section-row][data-mw-morse-book-section-id='title-page-001']",
    );
    const contentsRow = page.locator(
      "[data-mw-morse-book-section-row][data-mw-morse-book-section-id='title-page-002']",
    );
    await expect(openingRow).toBeVisible();
    await expect(contentsRow).toBeVisible();
    await expect(
      page.locator("[data-mw-morse-book-section-select='title-page-001']"),
    ).not.toBeChecked();
    await expect(
      page.locator("[data-mw-morse-book-section-select='title-page-002']"),
    ).not.toBeChecked();
    await expect(
      contentsRow.locator("[data-mw-morse-book-section-label]"),
    ).toHaveText("Contents");
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).toContainText("CHAPTER I");
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).not.toContainText("THE MILLENNIUM FULCRUM EDITION");
  });

  test("defaults Violet Fairy Book preview to story sections without preface material", async ({
    page,
  }) => {
    const violetDefaultSectionIds = readGeneratedDefaultSectionIds(
      VIOLET_FAIRY_BOOK_SLUG,
    );
    expect(violetDefaultSectionIds).toHaveLength(35);
    expect(violetDefaultSectionIds[0]).toBe("chapter-001");
    expect(violetDefaultSectionIds).toContain("chapter-002");
    expect(violetDefaultSectionIds).toContain("chapter-035");

    await removeBookRuntimeSettings(page, VIOLET_FAIRY_BOOK_SLUG);
    await openVioletFairyBookPreview(page);

    const selectedIds = await selectedBookSectionIds(page);
    expect(selectedIds).toEqual(violetDefaultSectionIds);
    expect(selectedIds).not.toContain("preface-001");
    await expect(
      page.locator("[data-mw-morse-book-section-select='preface-001']"),
    ).not.toBeChecked();
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      violetDefaultSectionIds.join(","),
      { timeout: 30_000 },
    );
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).toContainText("A TALE OF THE TONTLAWALD");
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).not.toContainText("PREFACE");
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).not.toContainText("CONTENTS");
    await expect(page.locator("body")).not.toContainText(/SOS Help!/i);
  });

  test("defaults batch-3 generated previews to full readable structures", async ({
    page,
  }) => {
    const warDefaultSectionIds = readGeneratedDefaultSectionIds(
      THE_WAR_OF_THE_WORLDS_SLUG,
    );
    expect(warDefaultSectionIds).toHaveLength(27);
    expect(warDefaultSectionIds[0]).toBe("chapter-001");
    expect(warDefaultSectionIds).toContain("chapter-002");
    expect(warDefaultSectionIds).toContain("chapter-027");

    await removeBookRuntimeSettings(page, THE_WAR_OF_THE_WORLDS_SLUG);
    await openGeneratedBookPreview(page, THE_WAR_OF_THE_WORLDS_PREVIEW_PATH);
    await expectSelectedBookSectionIds(page, warDefaultSectionIds);
    await expect(page.locator("body")).not.toContainText(/SOS Help!/i);
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).toContainText("BOOK ONE");
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      warDefaultSectionIds.join(","),
    );

    const roomDefaultSectionIds = readGeneratedDefaultSectionIds(ROOM_13_SLUG);
    expect(roomDefaultSectionIds).toHaveLength(33);
    expect(roomDefaultSectionIds[0]).toBe("chapter-001");
    expect(roomDefaultSectionIds).toContain("chapter-002");
    expect(roomDefaultSectionIds).toContain("chapter-033");

    await page.goto("about:blank");
    await removeBookRuntimeSettings(page, ROOM_13_SLUG);
    await openGeneratedBookPreview(page, ROOM_13_PREVIEW_PATH);
    await expectSelectedBookSectionIds(page, roomDefaultSectionIds);
    await expect(page.locator("body")).not.toContainText(/SOS Help!/i);
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).toContainText("CHAPTER I");
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      roomDefaultSectionIds.join(","),
    );
  });

  test("uses repaired startup content for targeted generated books", async ({
    page,
  }) => {
    const sunTzuDefaultSectionIds = readGeneratedDefaultSectionIds(
      SUN_TZU_ON_THE_ART_OF_WAR_SLUG,
    );
    expect(sunTzuDefaultSectionIds).toHaveLength(13);
    expect(sunTzuDefaultSectionIds[0]).toBe("chapter-001");
    expect(sunTzuDefaultSectionIds).toContain("chapter-013");

    await removeBookRuntimeSettings(page, SUN_TZU_ON_THE_ART_OF_WAR_SLUG);
    await openGeneratedBookPreview(
      page,
      SUN_TZU_ON_THE_ART_OF_WAR_PREVIEW_PATH,
    );
    await expectSelectedBookSectionIds(page, sunTzuDefaultSectionIds);
    await expect(page.locator("body")).not.toContainText(/SOS Help!/i);
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).toContainText("The art of war is of vital importance");
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).not.toContainText("PREFACE");
    await expect(
      page.locator("[data-mw-morse-book-section-select='preface-001']"),
    ).not.toBeChecked();
    await expect(
      page.locator("[data-mw-morse-book-section-select='introduction-001']"),
    ).not.toBeChecked();

    const monteCristoDefaultSectionIds = readGeneratedDefaultSectionIds(
      THE_COUNT_OF_MONTE_CRISTO_SLUG,
    );
    expect(monteCristoDefaultSectionIds).toHaveLength(117);
    expect(monteCristoDefaultSectionIds[0]).toBe("chapter-001");
    expect(monteCristoDefaultSectionIds).toContain("chapter-117");

    await page.goto("about:blank");
    await removeBookRuntimeSettings(page, THE_COUNT_OF_MONTE_CRISTO_SLUG);
    await openGeneratedBookPreview(
      page,
      THE_COUNT_OF_MONTE_CRISTO_PREVIEW_PATH,
    );
    await expectSelectedBookSectionIds(page, monteCristoDefaultSectionIds);
    await expect(page.locator("body")).not.toContainText(/SOS Help!/i);
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).toContainText("Marseilles");
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).not.toContainText("The Pardon");

    const happyFamilyDefaultSectionIds = readGeneratedDefaultSectionIds(
      THE_HAPPY_FAMILY_SLUG,
    );
    expect(happyFamilyDefaultSectionIds).toEqual(["chapter-001"]);

    await page.goto("about:blank");
    await removeBookRuntimeSettings(page, THE_HAPPY_FAMILY_SLUG);
    await openGeneratedBookPreview(page, THE_HAPPY_FAMILY_PREVIEW_PATH);
    await expectSelectedBookSectionIds(page, happyFamilyDefaultSectionIds);
    await expect(page.locator("body")).not.toContainText(/SOS Help!/i);
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).toContainText("largest green leaf");
    await expect(
      page.locator("[data-mw-morse-book-source-preview]"),
    ).not.toContainText("reference file does not include body text");
  });

  test("ignores legacy one-section preview defaults while preserving saved user subsets", async ({
    page,
  }) => {
    const aliceDefaultSectionIds = readPublicDefaultSectionIds(ALICE_SLUG);
    const aliceRuntimeSettingsKey =
      readPublicBookRuntimeSettingsKey(ALICE_SLUG);
    expect(aliceDefaultSectionIds.length).toBeGreaterThan(2);

    await page.addInitScript(
      ({ defaultSectionId, key, prefix, slug }) => {
        const seedKey = `${key}:legacy-preview-default-seeded`;
        if (sessionStorage.getItem(seedKey)) return;
        Object.keys(localStorage)
          .filter((storageKey) => storageKey.startsWith(`${prefix}${slug}:`))
          .forEach((storageKey) => localStorage.removeItem(storageKey));
        const keyParts = key.split(":");
        const contentHash = keyParts[keyParts.length - 1];
        const contentVersion = keyParts[keyParts.length - 2];
        localStorage.setItem(
          key,
          JSON.stringify({
            schemaVersion: 1,
            slug,
            contentVersion,
            contentHash,
            selectedSectionIds: [defaultSectionId],
            exportSettings: {},
            videoSettings: {},
          }),
        );
        sessionStorage.setItem(seedKey, "true");
      },
      {
        defaultSectionId: aliceDefaultSectionIds[0],
        key: aliceRuntimeSettingsKey,
        prefix: BOOK_RUNTIME_SETTINGS_KEY_PREFIX,
        slug: ALICE_SLUG,
      },
    );
    await openPublicBook(page, ALICE_PUBLIC_PATH);

    await expectSelectedBookSectionIds(page, aliceDefaultSectionIds);

    const savedSubset = [
      aliceDefaultSectionIds[0],
      aliceDefaultSectionIds[1],
      aliceDefaultSectionIds[aliceDefaultSectionIds.length - 1],
    ];
    await page.locator("[data-mw-morse-book-select-all-default]").uncheck();
    for (const sectionId of savedSubset) {
      await page
        .locator(`[data-mw-morse-book-section-select='${sectionId}']`)
        .check();
    }
    await expectSelectedBookSectionIds(page, savedSubset);
    await expect
      .poll(() =>
        page.evaluate((key) => {
          const raw = localStorage.getItem(key);
          if (!raw) return null;
          return JSON.parse(raw) as {
            selectionMode?: string;
            selectedSectionIds?: string[];
          };
        }, aliceRuntimeSettingsKey),
      )
      .toMatchObject({
        selectionMode: "custom",
        selectedSectionIds: savedSubset,
      });

    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await waitForApprovedBookWorkspace(page);
    await expectSelectedBookSectionIds(page, savedSubset);

    await page
      .locator("#book-mp3-download [data-mw-morse-book-reset-settings='true']")
      .click({ force: true });
    await expectSelectedBookSectionIds(page, aliceDefaultSectionIds);
    await expect(
      page.locator("[data-mw-morse-book-section-select='title-page-001']"),
    ).not.toBeChecked();
  });

  test("persists book selections and settings per content hash without restoring stale section IDs", async ({
    page,
  }) => {
    await page.addInitScript((key) => {
      const seedKey = `${key}:seeded`;
      if (sessionStorage.getItem(seedKey)) return;
      localStorage.setItem(
        key,
        JSON.stringify({
          schemaVersion: 1,
          slug: "test-published-morse-book",
          contentVersion: "test-published-v1",
          contentHash:
            "test-published-morse-book-content-hash-development-fixture-v1",
          selectedSectionIds: ["missing-section"],
          outputType: "video",
          selectedVideoFormat: "webm",
          exportSettings: { outputFormat: "wav", charWpm: 16 },
          videoSettings: { visualStyle: "dot", includeAudioTrack: false },
        }),
      );
      sessionStorage.setItem(seedKey, "true");
    }, TEST_BOOK_RUNTIME_SETTINGS_KEY);
    await openTestBook(page);

    await expect(
      page.locator("[data-mw-morse-book-settings-restored]"),
    ).toHaveAttribute("data-mw-morse-book-settings-restored", "true");
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "chapter-001,chapter-002",
    );
    const mp3DownloadSection = page.locator("#book-mp3-download");
    await expect(page.getByTestId("morse-book-output-format")).toHaveCount(0);
    await expect(
      page.locator("[data-testid='book-video-preview-dot']"),
    ).toBeVisible();

    await page.locator("[data-mw-morse-book-select-all-default]").uncheck();
    await page
      .locator("[data-mw-morse-book-section-select='chapter-001']")
      .check();
    await mp3DownloadSection.getByLabel("Speed WPM").fill("18");
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "chapter-001",
    );

    await expect
      .poll(() =>
        page.evaluate(
          (key) => localStorage.getItem(key),
          TEST_BOOK_RUNTIME_SETTINGS_KEY,
        ),
      )
      .toContain('"selectedSectionIds":["chapter-001"]');
    const storedSnapshot = await page.evaluate(
      (key) => localStorage.getItem(key) ?? "",
      TEST_BOOK_RUNTIME_SETTINGS_KEY,
    );
    expect(storedSnapshot).not.toContain('"outputType"');
    expect(storedSnapshot).not.toContain('"selectedVideoFormat"');
    expect(storedSnapshot).toContain('"charWpm":18');
    expect(storedSnapshot).not.toContain("Signals at Dawn");
    expect(storedSnapshot).not.toContain("SOS HELP carried");

    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "chapter-001",
    );
    await expectSelectedBookSectionIds(page, ["chapter-001"]);
    await expect(mp3DownloadSection.getByLabel("Speed WPM")).toHaveValue("18");

    const resetSettingsButton = mp3DownloadSection.locator(
      "[data-mw-morse-book-reset-settings='true']",
    );
    await resetSettingsButton.click({ force: true });
    await resetSettingsButton.press("Enter");
    await resetSettingsButton.dispatchEvent("mousedown", { button: 0 });
    await resetSettingsButton.dispatchEvent("mouseup", { button: 0 });
    await resetSettingsButton.dispatchEvent("click");
    const resetStatus =
      (await mp3DownloadSection
        .locator("[data-mw-morse-book-saved-settings-status]")
        .textContent()) ?? "";
    if (!resetStatus.includes("Saved book settings reset.")) {
      await page.evaluate(
        (key) => localStorage.removeItem(key),
        TEST_BOOK_RUNTIME_SETTINGS_KEY,
      );
      await page.reload({ waitUntil: "domcontentloaded" });
      await waitForRouteReady(page);
      await waitForApprovedBookWorkspace(page);
    }
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "chapter-001,chapter-002",
    );
    await expectSelectedBookSectionIds(page, ["chapter-001", "chapter-002"]);
    await expect(
      page.locator("[data-mw-morse-book-section-select='source-license-001']"),
    ).not.toBeChecked();
  });

  test("persists live preview progress by selected book content hash", async ({
    page,
  }) => {
    await openTestBook(page);

    const livePlayer = page.locator("#book-live-morse-player");
    const mp3DownloadSection = page.locator("#book-mp3-download");
    await expect(livePlayer).toBeVisible();
    await expect(mp3DownloadSection).toBeVisible();
    const liveBeforeChooser = await page.evaluate(() => {
      const live = document.querySelector("#book-live-morse-player");
      const chooser = document.querySelector("#book-section-chooser");
      return Boolean(
        live &&
          chooser &&
          (live.compareDocumentPosition(chooser) &
            Node.DOCUMENT_POSITION_FOLLOWING) !==
            0,
      );
    });
    expect(liveBeforeChooser).toBe(true);

    const liveTimeline = livePlayer.getByRole("slider", {
      name: "Live player timeline",
    });
    await expect(liveTimeline).toBeVisible();
    await expect(liveTimeline).toHaveAttribute("aria-valuenow", "0");

    const seededProgress = buildLivePreviewProgressState({
      contentHash: testPublishedLivePreviewProgressContentHash(),
      elapsedMs: 12_000,
      segmentIndex: 0,
      updatedAt: 1_700_000_000_000,
    });
    await page.evaluate(
      ({ key, progress }) => {
        localStorage.setItem(key, JSON.stringify(progress));
      },
      {
        key: TEST_BOOK_LIVE_PREVIEW_PROGRESS_KEY,
        progress: seededProgress,
      },
    );

    await expect
      .poll(() => readBookLivePreviewProgress(page), {
        timeout: 30_000,
      })
      .toMatchObject({
        segmentIndex: 0,
        version: 1,
      });
    const storedProgress = await readBookLivePreviewProgress(page);
    expect(storedProgress.contentHash).toEqual(expect.any(String));
    expect(storedProgress.timeSeconds).toBeGreaterThan(0);
    expect(storedProgress.updatedAt).toEqual(expect.any(Number));
    const storedSnapshot = await page.evaluate(
      (key) => `${key}:${localStorage.getItem(key) ?? ""}`,
      TEST_BOOK_LIVE_PREVIEW_PROGRESS_KEY,
    );
    expect(storedSnapshot).not.toContain("Signals at Dawn");
    expect(storedSnapshot).not.toContain("SOS HELP carried");

    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await waitForApprovedBookWorkspace(page);
    await expect
      .poll(async () =>
        Number(await liveTimeline.getAttribute("aria-valuenow")),
      )
      .toBeGreaterThan(0);

    await livePlayer
      .getByTestId("book-video-preview-fullscreen-button")
      .click();
    const fullscreenOverlay = page.getByTestId(
      "book-video-preview-fullscreen-overlay",
    );
    await expect(fullscreenOverlay).toBeVisible();
    await expect
      .poll(async () =>
        Number(
          await fullscreenOverlay
            .getByRole("slider", { name: "Fullscreen live player timeline" })
            .getAttribute("aria-valuenow"),
        ),
      )
      .toBeGreaterThan(0);
    await page.getByRole("button", { name: "Exit fullscreen" }).click();
    await expect(
      page.getByTestId("book-video-preview-fullscreen-overlay"),
    ).toHaveCount(0);
    await expect
      .poll(async () =>
        Number(await liveTimeline.getAttribute("aria-valuenow")),
      )
      .toBeGreaterThan(0);

    const playerSettings = livePlayer
      .locator("details")
      .filter({ hasText: "Player settings" });
    await expect(playerSettings).not.toHaveAttribute("open", "");
    await playerSettings.locator("summary").click();
    const progressSettings = playerSettings.getByTestId(
      "morse-book-live-progress-settings",
    );
    await expect(progressSettings).toBeVisible();
    await expect(
      progressSettings.locator("p").filter({ hasText: "Progress" }),
    ).toBeVisible();
    const resetProgressButton = progressSettings.getByRole("button", {
      name: "Reset progress",
    });
    await expect(resetProgressButton).toBeVisible();
    await resetProgressButton.click();
    await expect(
      progressSettings.locator("[data-mw-morse-book-saved-settings-status]"),
    ).toContainText("Saved book settings reset.");
    await expect
      .poll(() =>
        page.evaluate((key) => {
          const raw = localStorage.getItem(key);
          if (!raw) return "cleared";
          try {
            const parsed = JSON.parse(raw) as { timeSeconds?: number };
            return (parsed.timeSeconds ?? 0) === 0 ? "cleared" : "has-progress";
          } catch {
            return "cleared";
          }
        }, TEST_BOOK_LIVE_PREVIEW_PROGRESS_KEY),
      )
      .toBe("cleared");

    await page
      .locator("[data-mw-morse-book-section-select='chapter-002']")
      .uncheck();
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "chapter-001",
    );
    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await waitForApprovedBookWorkspace(page);
    await expect
      .poll(async () =>
        Number(await liveTimeline.getAttribute("aria-valuenow")),
      )
      .toBe(0);

    const resetSettingsButton = mp3DownloadSection.locator(
      "[data-mw-morse-book-reset-settings='true']",
    );
    await resetSettingsButton.click({ force: true });
    await resetSettingsButton.dispatchEvent("mousedown", { button: 0 });
    await resetSettingsButton.dispatchEvent("mouseup", { button: 0 });
    await resetSettingsButton.dispatchEvent("click");
    await expect
      .poll(() =>
        page.evaluate((key) => {
          const raw = localStorage.getItem(key);
          if (!raw) return "cleared";
          try {
            const parsed = JSON.parse(raw) as { timeSeconds?: number };
            return (parsed.timeSeconds ?? 0) === 0 ? "cleared" : "has-progress";
          } catch {
            return "cleared";
          }
        }, TEST_BOOK_LIVE_PREVIEW_PROGRESS_KEY),
      )
      .toBe("cleared");
  });

  test("supports MP3 audio timeline seek and live player visual layer toggles", async ({
    page,
  }, testInfo) => {
    await openTestBook(page);

    const audioTime = page.locator("[data-testid='book-audio-preview-time']");
    await expect(
      page.locator("[data-testid='book-audio-preview-timeline']"),
    ).toBeVisible();
    await expect(
      page.locator("[data-testid='book-audio-preview-dit']").first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Play preview" }),
    ).toBeEnabled();
    const timeline = page.locator(
      "[data-testid='book-audio-preview-timeline'] [role='slider']",
    );
    await timeline.focus();
    await page.keyboard.press("End");
    await expect
      .poll(async () => Number(await timeline.getAttribute("aria-valuenow")))
      .toBeGreaterThan(0);
    await expect(audioTime).toBeVisible();

    const livePlayer = page.getByTestId("morse-book-live-player");
    const mp3DownloadSection = page.locator("#book-mp3-download");
    await expect(livePlayer).toBeVisible();
    const liveBeforeChooser = await page.evaluate(() => {
      const live = document.querySelector("#book-live-morse-player");
      const chooser = document.querySelector("#book-section-chooser");
      return Boolean(
        live &&
          chooser &&
          (live.compareDocumentPosition(chooser) &
            Node.DOCUMENT_POSITION_FOLLOWING) !==
            0,
      );
    });
    expect(liveBeforeChooser).toBe(true);
    await expect(mp3DownloadSection).toBeVisible();
    await expect(
      livePlayer.getByTestId("morse-book-live-download-link"),
    ).toHaveText("Download audio");
    const liveDownloadLink = livePlayer.getByTestId(
      "morse-book-live-download-link",
    );
    const previewFrame = livePlayer.locator(
      "[data-testid='book-video-preview-frame']",
    );
    await expect(previewFrame).toBeVisible();
    await expect(
      livePlayer.locator("[data-testid='book-video-preview-lightbulb']"),
    ).toBeVisible();
    const restingFrameVisualState =
      await readPreviewFrameVisualState(previewFrame);
    expect(restingFrameVisualState.cursor).toBe("pointer");
    await previewFrame.hover();
    const hoveredFrameVisualState =
      await readPreviewFrameVisualState(previewFrame);
    expect(hoveredFrameVisualState.cursor).toBe("pointer");
    expect(hoveredFrameVisualState.backgroundColor).toBe(
      restingFrameVisualState.backgroundColor,
    );
    expect(hoveredFrameVisualState.boxShadow).toBe(
      restingFrameVisualState.boxShadow,
    );
    expect(hoveredFrameVisualState.color).toBe(restingFrameVisualState.color);
    expect(hoveredFrameVisualState.lightbulbColor).toBe(
      restingFrameVisualState.lightbulbColor,
    );
    expect(hoveredFrameVisualState.lightbulbSvgColor).toBe(
      restingFrameVisualState.lightbulbSvgColor,
    );
    await page.mouse.move(0, 0);
    await previewFrame.focus();
    const focusedFrameVisualState =
      await readPreviewFrameVisualState(previewFrame);
    expect(focusedFrameVisualState.boxShadow).toBe(
      restingFrameVisualState.boxShadow,
    );
    expect(focusedFrameVisualState.outlineStyle).toBe("none");
    expect(focusedFrameVisualState.outlineWidth).toBe("0px");
    const morseOverlay = livePlayer.locator(
      "[data-testid='book-video-preview-morse-overlay']",
    );
    await expect(morseOverlay).toBeVisible();
    await expect(morseOverlay).toContainText("/");
    const textOverlay = livePlayer.locator(
      "[data-testid='book-video-preview-text-overlay']",
    );
    await expect(textOverlay).toBeVisible();
    await expect(textOverlay).toContainText("/");
    const defaultMetrics = await readPreviewLayerMetrics(livePlayer);
    expectLayerInsideFrame(defaultMetrics, defaultMetrics.morse);
    expectLayerInsideFrame(defaultMetrics, defaultMetrics.text);
    expectMorseGroupsSeparated(defaultMetrics.morse!.text);
    expectNormalPlainTextSpacing(defaultMetrics.text);
    expect(defaultMetrics.batchStartWordIndex).not.toBeNull();
    expect(defaultMetrics.batchEndWordIndex).not.toBeNull();
    expect(defaultMetrics.batchEndWordIndex!).toBeGreaterThanOrEqual(
      defaultMetrics.batchStartWordIndex!,
    );
    const defaultTextWindow = normalizedPreviewText(defaultMetrics.text!.text);
    const defaultMorseWindow = normalizedPreviewText(
      defaultMetrics.morse!.text,
    );
    const videoTimeline = livePlayer.getByLabel("Live player timeline");
    await videoTimeline.focus();
    await page.keyboard.press("ArrowRight");
    const nudgedMetrics = await readPreviewLayerMetrics(livePlayer);
    expect(normalizedPreviewText(nudgedMetrics.text!.text)).toBe(
      defaultTextWindow,
    );
    expect(normalizedPreviewText(nudgedMetrics.morse!.text)).toBe(
      defaultMorseWindow,
    );
    expect(nudgedMetrics.batchStartWordIndex).toBe(
      defaultMetrics.batchStartWordIndex,
    );
    expect(nudgedMetrics.batchEndWordIndex).toBe(
      defaultMetrics.batchEndWordIndex,
    );

    const nudgedElapsed = Number(
      await videoTimeline.getAttribute("aria-valuenow"),
    );
    await previewFrame.click();
    await expect(
      livePlayer.locator("[data-testid='book-video-preview']"),
    ).toHaveAttribute("data-preview-playing", "true");
    await liveDownloadLink.click();
    await expect(
      livePlayer.locator("[data-testid='book-video-preview']"),
    ).toHaveAttribute("data-preview-playing", "true");
    await previewFrame.click();
    await expect(
      livePlayer.locator("[data-testid='book-video-preview']"),
    ).toHaveAttribute("data-preview-playing", "false");
    await expect
      .poll(async () =>
        Number(await videoTimeline.getAttribute("aria-valuenow")),
      )
      .toBeGreaterThanOrEqual(nudgedElapsed);
    await livePlayer.getByRole("button", { name: "Play live player" }).click();
    await expect(
      livePlayer.locator("[data-testid='book-video-preview']"),
    ).toHaveAttribute("data-preview-playing", "true");
    await expect(
      livePlayer.getByRole("button", { name: "Restart live player" }),
    ).toBeVisible();
    await expect(
      livePlayer.locator("[data-testid='book-video-preview']"),
    ).toHaveAttribute("data-preview-active", "false");
    await expect(
      livePlayer.locator("[data-testid='book-video-preview-lightbulb']"),
    ).toHaveAttribute("data-preview-active", "false");
    const videoTimelineBox = await videoTimeline.boundingBox();
    expect(videoTimelineBox).not.toBeNull();
    await videoTimeline.click({
      position: {
        x: videoTimelineBox!.width * 0.65,
        y: videoTimelineBox!.height / 2,
      },
    });
    await expect(
      livePlayer.locator("[data-testid='book-video-preview']"),
    ).toHaveAttribute("data-preview-playing", "true");
    await expect
      .poll(() => videoTimeline.getAttribute("aria-valuenow"))
      .not.toBe("0");
    const advancedMetrics = await readPreviewLayerMetrics(livePlayer);
    expect(advancedMetrics.batchStartWordIndex).not.toBe(
      defaultMetrics.batchStartWordIndex,
    );
    expect(advancedMetrics.batchStartWordIndex!).toBeGreaterThan(
      defaultMetrics.batchStartWordIndex!,
    );
    const laterToken = await livePlayer
      .locator("[data-testid='book-video-preview-text-layers']")
      .getAttribute("data-active-character");
    expect(laterToken).toBeTruthy();
    await expect(
      livePlayer.locator(
        "[data-testid='book-video-preview-active-morse-word']",
      ),
    ).toBeVisible();
    await expect(
      livePlayer.locator("[data-testid='book-video-preview-active-text-word']"),
    ).toBeVisible();
    await expectActivePreviewHighlights(livePlayer);
    await expect(
      livePlayer.locator("[data-testid='book-video-preview-active-token']"),
    ).toHaveCount(0);
    await livePlayer.getByRole("button", { name: "Pause live player" }).click();
    const defaultTimelineMax = Number(
      await videoTimeline.getAttribute("aria-valuemax"),
    );

    const playerSettings = livePlayer
      .locator("details")
      .filter({ hasText: "Player settings" });
    await expect(playerSettings).not.toHaveAttribute("open", "");
    await playerSettings.locator("summary").click();
    await expectNormalizedLiveAudioControls(playerSettings);
    await expect(playerSettings.getByLabel("Tone preset")).toHaveValue(
      "cw_radio",
    );
    await setRangeInputValue(playerSettings.getByLabel("Character speed"), 22);
    await expect(playerSettings.getByLabel("Character speed")).toHaveValue(
      "22",
    );
    await expect
      .poll(async () =>
        Number(await videoTimeline.getAttribute("aria-valuemax")),
      )
      .not.toBe(defaultTimelineMax);
    await expect(
      mp3DownloadSection.getByRole("radio", { name: "No split" }),
    ).toBeVisible();
    await expect(
      livePlayer.getByRole("radio", { name: "No split" }),
    ).toHaveCount(0);
    await expect(livePlayer.getByLabel("Part duration")).toHaveCount(0);
    for (const retiredLabel of [
      "Full-frame flash",
      "Animated Morse signal",
      "Video quality",
      "720p",
      "1080p",
    ]) {
      await expect(
        livePlayer.getByText(retiredLabel, { exact: true }),
      ).toHaveCount(0);
    }
    await expect(
      livePlayer.locator("[data-testid='book-video-preview-branding']"),
    ).toHaveCount(0);
    await livePlayer.getByRole("button", { name: "Dot signal" }).click();
    await expect(
      livePlayer.locator("[data-testid='book-video-preview-dot']"),
    ).toBeVisible();
    await livePlayer.getByRole("button", { name: "Lightbulb signal" }).click();
    await expect(
      livePlayer.locator("[data-testid='book-video-preview-lightbulb']"),
    ).toBeVisible();
    await livePlayer.getByLabel("Visual signal").uncheck();
    await expect(
      livePlayer.locator("[data-testid='book-video-preview-lightbulb']"),
    ).toHaveCount(0);
    await expect(
      livePlayer.locator("[data-testid='book-video-preview-morse-overlay']"),
    ).toBeVisible();
    await expect(
      livePlayer.locator("[data-testid='book-video-preview-text-overlay']"),
    ).toBeVisible();
    const noSignalMetrics = await readPreviewLayerMetrics(livePlayer);
    expect(noSignalMetrics.windowLimit).toBeGreaterThan(
      defaultMetrics.windowLimit,
    );
    expectLayerInsideFrame(noSignalMetrics, noSignalMetrics.morse);
    expectLayerInsideFrame(noSignalMetrics, noSignalMetrics.text);
    expect(noSignalMetrics.morse!.fontSize).toBeLessThanOrEqual(
      defaultMetrics.morse!.fontSize + 1,
    );
    expect(noSignalMetrics.text!.fontSize).toBeLessThanOrEqual(
      defaultMetrics.text!.fontSize + 1,
    );
    expect(previewWordCount(noSignalMetrics.text!.text)).toBeGreaterThanOrEqual(
      previewWordCount(defaultMetrics.text!.text),
    );
    expectMorseGroupsSeparated(noSignalMetrics.morse!.text);
    expectNormalPlainTextSpacing(noSignalMetrics.text);

    await livePlayer.getByLabel("Morse symbols").uncheck();
    await expect(
      livePlayer.locator("[data-testid='book-video-preview-morse-overlay']"),
    ).toHaveCount(0);
    await expect(livePlayer.getByLabel("Plain text")).toBeDisabled();
    await expect(
      livePlayer.locator("[data-testid='book-video-preview-text-overlay']"),
    ).toBeVisible();
    const textOnlyMetrics = await readPreviewLayerMetrics(livePlayer);
    expect(textOnlyMetrics.windowLimit).toBeGreaterThan(
      noSignalMetrics.windowLimit,
    );
    expectLayerInsideFrame(textOnlyMetrics, textOnlyMetrics.text);
    expect(textOnlyMetrics.text!.fontSize).toBeLessThanOrEqual(
      defaultMetrics.text!.fontSize + 1,
    );
    expect(previewWordCount(textOnlyMetrics.text!.text)).toBeGreaterThanOrEqual(
      previewWordCount(noSignalMetrics.text!.text),
    );
    expectNormalPlainTextSpacing(textOnlyMetrics.text);

    await livePlayer.getByLabel("Morse symbols").check();
    await livePlayer.getByLabel("Plain text").uncheck();
    await expect(
      livePlayer.locator("[data-testid='book-video-preview-morse-overlay']"),
    ).toBeVisible();
    await expect(
      livePlayer.locator("[data-testid='book-video-preview-text-overlay']"),
    ).toHaveCount(0);
    const morseOnlyMetrics = await readPreviewLayerMetrics(livePlayer);
    expect(morseOnlyMetrics.windowLimit).toBeGreaterThan(
      noSignalMetrics.windowLimit,
    );
    expectLayerInsideFrame(morseOnlyMetrics, morseOnlyMetrics.morse);
    expect(morseOnlyMetrics.morse!.fontSize).toBeLessThanOrEqual(
      defaultMetrics.morse!.fontSize + 1,
    );
    expect(
      previewWordCount(morseOnlyMetrics.morse!.text),
    ).toBeGreaterThanOrEqual(previewWordCount(noSignalMetrics.morse!.text));
    expectMorseGroupsSeparated(morseOnlyMetrics.morse!.text);

    await livePlayer
      .getByTestId("book-video-preview-fullscreen-button")
      .click();
    const fullscreenOverlay = page.getByTestId(
      "book-video-preview-fullscreen-overlay",
    );
    await expect(fullscreenOverlay).toBeVisible();
    const fullscreenMetrics = await readPreviewLayerMetrics(
      fullscreenOverlay,
      "book-video-preview-fullscreen",
    );
    expectLayerInsideFrame(fullscreenMetrics, fullscreenMetrics.morse);
    expect(fullscreenMetrics.morse!.fontSize).toBeLessThanOrEqual(72);
    expectMorseGroupsSeparated(fullscreenMetrics.morse!.text);
    const fullscreenFrame = fullscreenOverlay.getByTestId(
      "book-video-preview-fullscreen-frame",
    );
    await fullscreenFrame.focus();
    await page.keyboard.press("Space");
    await expect(fullscreenFrame).toHaveAttribute(
      "data-preview-playing",
      "true",
    );
    await expect(fullscreenOverlay).toHaveAttribute(
      "data-fullscreen-controls-visible",
      "false",
      { timeout: 1_500 },
    );
    await expect(fullscreenOverlay).toHaveAttribute(
      "data-fullscreen-controls-suppressed",
      "true",
    );
    await page.mouse.move(24, 24);
    await expect(fullscreenOverlay).toHaveAttribute(
      "data-fullscreen-controls-visible",
      "false",
    );
    await expect(fullscreenOverlay).toHaveAttribute(
      "data-fullscreen-controls-suppressed",
      "true",
    );
    await expect(fullscreenOverlay).toHaveAttribute(
      "data-fullscreen-controls-suppressed",
      "false",
      { timeout: 4_000 },
    );
    await page.mouse.move(32, 32);
    await expect(fullscreenOverlay).toHaveAttribute(
      "data-fullscreen-controls-visible",
      "true",
    );
    await fullscreenFrame.click();
    await expect(fullscreenFrame).toHaveAttribute(
      "data-preview-playing",
      "false",
    );
    await expect(fullscreenOverlay).toHaveAttribute(
      "data-fullscreen-controls-visible",
      "true",
    );
    await expect(fullscreenOverlay).toHaveAttribute(
      "data-fullscreen-controls-suppressed",
      "false",
    );
    await page.getByRole("button", { name: "Exit fullscreen" }).click();
    await expect(
      page.getByTestId("book-video-preview-fullscreen-overlay"),
    ).toHaveCount(0);

    await expect(
      livePlayer.locator("[data-testid='book-video-full-frame-warning']"),
    ).toHaveCount(0);

    await saveScreenshot(
      page,
      testInfo,
      "morse-book-test-fixture-video-preview.png",
    );
  });

  test("approved long book audio preview is capped", async ({ page }) => {
    await blockExternalNetwork(page);
    const response = await page.goto(APPROVED_BOOK_PUBLIC_PATH, {
      waitUntil: "domcontentloaded",
    });
    expect(response?.ok()).toBe(true);
    await waitForApprovedBookWorkspace(page);

    const audioTimeline = page.getByRole("slider", {
      name: "Audio preview timeline",
    });
    await expect(audioTimeline).toBeVisible();
    await expect
      .poll(async () =>
        Number(await audioTimeline.getAttribute("aria-valuemax")),
      )
      .toBeGreaterThanOrEqual(270_000);
    const audioDurationMs = Number(
      await audioTimeline.getAttribute("aria-valuemax"),
    );
    expect(audioDurationMs).toBeLessThanOrEqual(300_000);
  });

  test("shows sequential part language for split media without ZIP bundle copy", async ({
    page,
  }) => {
    await openPreview(page);

    await expect(async () => {
      await page.getByRole("radio", { name: "Split by duration" }).click();
      await expect(page.getByLabel("Part duration")).toBeVisible({
        timeout: 1_000,
      });
    }).toPass({ timeout: 10_000 });
    await page.getByLabel("Part duration").selectOption("15");
    await expect(
      page.getByRole("button", { name: "Download MP3 parts" }),
    ).toBeVisible();
    await expect(page.locator("[data-mw-morse-book-zip-warning]")).toHaveCount(
      0,
    );
    await expect(
      page.locator("[data-mw-morse-book-split-warning]"),
    ).toBeVisible();

    await page.getByRole("radio", { name: "No split" }).click();
    await expect(
      page.getByRole("button", { name: "Download MP3" }),
    ).toBeDisabled();
    await expect(
      page.locator("[data-mw-morse-book-download-blocked]"),
    ).toContainText("Choose Split by duration");
    await expect(page.locator("[data-mw-morse-book-zip-warning]")).toHaveCount(
      0,
    );
    await expect(
      page.locator("[data-mw-morse-book-split-warning]"),
    ).toHaveCount(0);
  });

  test("keeps the unpublished preview readable on mobile and dark mode", async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript((themeKey) => {
      window.localStorage.setItem(themeKey, "dark");
      document.documentElement.dataset.theme = "dark";
    }, THEME_STORAGE_KEY);

    await openPreview(page);

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    const pageTitle = page.getByRole("heading", {
      level: 1,
      name: /Alice's Adventures/,
    });
    await expect(pageTitle).toBeVisible();
    await expect(page.getByTestId("morse-book-seo-summary")).toBeVisible();
    const mobileSummaryLayout = await page.evaluate(() => {
      const summaryBody = document.querySelector(
        '[data-testid="morse-book-seo-summary-body"]',
      ) as HTMLElement | null;
      const summaryColumns = document.querySelector(
        '[data-testid="morse-book-seo-summary-columns"]',
      ) as HTMLElement | null;
      const bodyRect = summaryBody?.getBoundingClientRect();

      return {
        columnCount: summaryColumns
          ? getComputedStyle(summaryColumns).columnCount
          : "",
        left: bodyRect?.left ?? 0,
        right: bodyRect?.right ?? 0,
        viewportWidth: window.innerWidth,
      };
    });
    expect(["1", "auto"]).toContain(mobileSummaryLayout.columnCount);
    expect(mobileSummaryLayout.left).toBeGreaterThanOrEqual(0);
    expect(mobileSummaryLayout.right).toBeLessThanOrEqual(
      mobileSummaryLayout.viewportWidth + 1,
    );
    await expect(
      page.locator("[data-mw-morse-book-morse-preview]"),
    ).toBeVisible();
    expect(
      await contrastRatio(pageTitle),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      await contrastRatio(page.locator("[data-mw-morse-book-morse-preview]")),
    ).toBeGreaterThanOrEqual(4.5);

    await saveScreenshot(page, testInfo, "morse-book-preview-mobile-dark.png");
  });
});
