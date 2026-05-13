import * as React from "react";
import QRCode from "qrcode";

import { DownloadIcon, ShareIcon, WarningIcon } from "~/client/assets/svg/Icons";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import {
  ActionButton,
  copyTextToClipboard,
} from "~/client/components/shared/ActionControls";
import {
  ActionLinks,
  DarkNote,
  PageHero,
} from "~/client/components/shared/MorseLearningLayout";
import { TEXT_TO_MORSE } from "~/client/components/shared/morseMaps";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";

const CANONICAL_PATH = "/morse-code-printable-chart";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

type CharacterRow = {
  character: string;
  name: string;
  morse: string;
};

type PrintMode = "packet" | "chart" | "worksheet";
type WorksheetLevel = "beginner" | "standard" | "challenge";
type ExportFormat = "png" | "jpg" | "jpeg" | "webp";
type DownloadFormat = "pdf" | ExportFormat;
type PresetName = "beginner" | "classroom" | "challenge";

type PrintableSettings = {
  printMode: PrintMode;
  worksheetLevel: WorksheetLevel;
  worksheetTitle: string;
  studentName: string;
  assignmentDate: string;
  className: string;
  teacherName: string;
  directions: string;
  customWords: string;
  customSentences: string;
  includeNumbers: boolean;
  includePunctuation: boolean;
  includeAnswerKey: boolean;
  includeBranding: boolean;
  includeTeacherReview: boolean;
  includeDirections: boolean;
  customLogoDataUrl: string;
  customLogoName: string;
  brandName: string;
  decodeAnswerLineCount: number;
  encodeAnswerLineCount: number;
  sentenceAnswerLineCount: number;
  ownMessageTextLineCount: number;
  ownMessageMorseLineCount: number;
  teacherFeedbackLineCount: number;
};

type StoredPresetMap = Partial<Record<PresetName, PrintableSettings>>;

const SITE_NAME = "MorseWords";
const WEBSITE_URL = "https://www.morsewords.com";
const DISPLAY_URL = "www.morsewords.com";
const SIGN_OFF_MORSE = "-- .- -.. . / .-- .. - .... / 💖";

const SETTINGS_STORAGE_KEY = "morsewords-printable-chart-settings-v6";
const PRESETS_STORAGE_KEY = "morsewords-printable-chart-presets-v3";

const EXPORT_WIDTH = 816;
const EXPORT_PAGE_HEIGHT = 1056;
const EXPORT_PAGE_GAP = 28;
const BRAND_NAME_MAX_LENGTH = 60;

const DEFAULT_WORDS = ["SOS", "HELP", "RADIO", "SIGNAL", "CODE", "MORSE"];
const DEFAULT_SENTENCES = ["SEND HELP", "LEARN MORSE", "RADIO SIGNAL"];

const BEGINNER_WORDS = ["SOS", "CAT", "DOG", "SUN"];
const BEGINNER_SENTENCES = ["SEND HELP"];

const CHALLENGE_WORDS = [
  "SIGNAL",
  "RADIO",
  "BEACON",
  "MESSAGE",
  "STATION",
  "DECODE",
  "TRANSMIT",
  "RECEIVE",
  "ALPHABET",
  "PRACTICE",
];

const CHALLENGE_SENTENCES = [
  "SEND THE SIGNAL",
  "DECODE THE MESSAGE",
  "RADIO STATION READY",
  "PRACTICE MORSE DAILY",
];

const DEFAULT_DIRECTIONS =
  "Use the chart to complete each section. Write neatly, keep spaces between Morse letters, and use a slash between words.";

const LETTERS: CharacterRow[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  .split("")
  .map((character) => ({
    character,
    name: `Letter ${character}`,
    morse: TEXT_TO_MORSE[character] ?? "",
  }));

const NUMBERS: CharacterRow[] = "0123456789".split("") .map((character) => ({
  character,
  name: `Number ${character}`,
  morse: TEXT_TO_MORSE[character] ?? "",
}));

const PUNCTUATION_NAMES: Record<string, string> = {
  ".": "Period",
  ",": "Comma",
  "?": "Question mark",
  "/": "Slash",
  "'": "Apostrophe",
  "!": "Exclamation mark",
  "-": "Hyphen",
  "@": "At sign",
  ":": "Colon",
  ";": "Semicolon",
  "=": "Equals",
  "+": "Plus",
  '"': "Quotation mark",
  "(": "Open parenthesis",
  ")": "Close parenthesis",
  "&": "Ampersand",
  _: "Underscore",
};

const PUNCTUATION_ORDER = [
  ".",
  ",",
  "?",
  "/",
  "'",
  "!",
  "-",
  "@",
  ":",
  ";",
  "=",
  "+",
  '"',
  "(",
  ")",
  "&",
  "_",
];

const PUNCTUATION: CharacterRow[] = PUNCTUATION_ORDER.map((character) => ({
  character,
  name: PUNCTUATION_NAMES[character],
  morse: TEXT_TO_MORSE[character] ?? "",
}));

const DEFAULT_SETTINGS: PrintableSettings = {
  printMode: "packet",
  worksheetLevel: "standard",
  worksheetTitle: "Morse Code Practice Sheet",
  studentName: "",
  assignmentDate: "",
  className: "",
  teacherName: "",
  directions: DEFAULT_DIRECTIONS,
  customWords: DEFAULT_WORDS.join(", "),
  customSentences: DEFAULT_SENTENCES.join(", "),
  includeNumbers: true,
  includePunctuation: true,
  includeAnswerKey: false,
  includeBranding: true,
  includeTeacherReview: true,
  includeDirections: true,
  customLogoDataUrl: "",
  customLogoName: "",
  brandName: SITE_NAME,
  decodeAnswerLineCount: 1,
  encodeAnswerLineCount: 1,
  sentenceAnswerLineCount: 2,
  ownMessageTextLineCount: 3,
  ownMessageMorseLineCount: 4,
  teacherFeedbackLineCount: 5,
};

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta() {
  return seoMeta({
    title: "Morse Code Printable Chart | Study Sheet and Reference PDF | MorseWords",
    description:
      "Print a Morse code chart for studying, teaching, or offline reference, with tips for using it alongside practice tools.",
    path: CANONICAL_PATH,
    keywords:
      "printable morse code chart, morse code worksheet, custom morse code worksheet, teacher morse code worksheet, morse code printable, morse code alphabet printable, morse code practice sheet",
  });
}

const faqItems = [
  {
    q: "Can I print the Morse code chart?",
    a: "Yes. Use the builder to create a chart, worksheet, or combined packet, then choose PDF export to open the browser print dialog.",
  },
  {
    q: "Is this printable chart for beginners?",
    a: "Yes. The beginner preset focuses the handout on shorter practice content and can leave numbers and punctuation out until the learner is ready.",
  },
  {
    q: "Does the printable chart replace the dictionary?",
    a: "No. The chart is best for offline study and classroom handouts. Use the Morse code dictionary when you need quick lookup across more entries.",
  },
  {
    q: "Should I print letters only or include more symbols?",
    a: "Start with letters only for brand-new learners. Add numbers and punctuation once the student can read the A-Z patterns reliably.",
  },
  {
    q: "What should I do after printing the chart?",
    a: "Use the chart beside short practice drills, a word search activity, or the practice plan so the handout supports real recall instead of passive review.",
  },
];

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeLegacyList(value: string) {
  return value.replace(/\r?\n/g, ",");
}

const MAX_CUSTOM_CONTENT_ITEMS = 12;

function parseCustomContentItems(value: string) {
  return normalizeLegacyList(value)
    .split(",")
    .map((item) => item.trim().replace(/\s+/g, " "))
    .filter(Boolean);
}

function parseCommaSeparatedItems(value: string, fallback: string[]) {
  const items = parseCustomContentItems(value);

  return items.length > 0 ? items.slice(0, MAX_CUSTOM_CONTENT_ITEMS) : fallback;
}

function cleanMorseInput(value: string) {
  return value.toUpperCase().replace(/\s+/g, " ").trim();
}

function encodeToMorse(value: string) {
  return cleanMorseInput(value)
    .split("")
    .map((character) => {
      if (character === " ") return "/";
      return TEXT_TO_MORSE[character] ?? "";
    })
    .filter(Boolean)
    .join(" ");
}

function clampLineCount(value: number, min = 1, max = 12) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function clampText(value: string, maxLength: number) {
  return value.slice(0, maxLength);
}

function normalizeBrandName(value: string) {
  return clampText(value, BRAND_NAME_MAX_LENGTH);
}

function getBrandName(settings: PrintableSettings) {
  const brandName = settings.brandName.trim();
  return brandName.length > 0 ? brandName : SITE_NAME;
}

function mergeSettings(value: unknown): PrintableSettings {
  if (!value || typeof value !== "object") return DEFAULT_SETTINGS;

  const incoming = value as Partial<PrintableSettings> & {
    customMessageLineCount?: number;
  };

  const legacyMessageLineCount = clampLineCount(
    Number(incoming.customMessageLineCount ?? 4),
    1,
    12,
  );

  return {
    ...DEFAULT_SETTINGS,
    ...incoming,
    customWords:
      typeof incoming.customWords === "string"
        ? normalizeLegacyList(incoming.customWords)
        : DEFAULT_SETTINGS.customWords,
    customSentences:
      typeof incoming.customSentences === "string"
        ? normalizeLegacyList(incoming.customSentences)
        : DEFAULT_SETTINGS.customSentences,
    brandName:
      typeof incoming.brandName === "string"
        ? normalizeBrandName(incoming.brandName)
        : DEFAULT_SETTINGS.brandName,
    includeAnswerKey:
      typeof incoming.includeAnswerKey === "boolean"
        ? incoming.includeAnswerKey
        : DEFAULT_SETTINGS.includeAnswerKey,
    decodeAnswerLineCount: clampLineCount(
      Number(
        incoming.decodeAnswerLineCount ??
          DEFAULT_SETTINGS.decodeAnswerLineCount,
      ),
      1,
      6,
    ),
    encodeAnswerLineCount: clampLineCount(
      Number(
        incoming.encodeAnswerLineCount ??
          DEFAULT_SETTINGS.encodeAnswerLineCount,
      ),
      1,
      6,
    ),
    sentenceAnswerLineCount: clampLineCount(
      Number(
        incoming.sentenceAnswerLineCount ??
          DEFAULT_SETTINGS.sentenceAnswerLineCount,
      ),
      1,
      8,
    ),
    ownMessageTextLineCount: clampLineCount(
      Number(
        incoming.ownMessageTextLineCount ?? legacyMessageLineCount ?? 3,
      ),
      1,
      12,
    ),
    ownMessageMorseLineCount: clampLineCount(
      Number(
        incoming.ownMessageMorseLineCount ?? legacyMessageLineCount ?? 4,
      ),
      1,
      12,
    ),
    teacherFeedbackLineCount: clampLineCount(
      Number(
        incoming.teacherFeedbackLineCount ??
          DEFAULT_SETTINGS.teacherFeedbackLineCount,
      ),
      2,
      12,
    ),
  };
}

function readInitialPrintableSettings(): PrintableSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    return stored ? mergeSettings(JSON.parse(stored)) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function chunkRows<T>(rows: T[], columns: number) {
  const chunkSize = Math.ceil(rows.length / columns);
  return Array.from({ length: columns }, (_, columnIndex) =>
    rows.slice(columnIndex * chunkSize, columnIndex * chunkSize + chunkSize),
  );
}

function printModeLabel(mode: PrintMode) {
  if (mode === "chart") return "Reference guide only";
  if (mode === "worksheet") return "Worksheet only";
  return "Worksheet + reference guide";
}

function worksheetLevelLabel(level: WorksheetLevel) {
  if (level === "beginner") return "Beginner";
  if (level === "challenge") return "Challenge";
  return "Standard";
}

function getWorksheetWordLimit(level: WorksheetLevel) {
  if (level === "beginner") return 4;
  if (level === "challenge") return 10;
  return 6;
}

function getWorksheetSentenceLimit(level: WorksheetLevel) {
  if (level === "beginner") return 1;
  if (level === "challenge") return 4;
  return 3;
}

function getCustomContentStats({
  value,
  fallback,
  activeLimit,
}: {
  value: string;
  fallback: string[];
  activeLimit: number;
}) {
  const rawItems = parseCustomContentItems(value);
  const sourceCount = rawItems.length || fallback.length;
  const cappedCount = Math.min(sourceCount, MAX_CUSTOM_CONTENT_ITEMS);

  return {
    sourceCount,
    usedCount: Math.min(cappedCount, activeLimit),
    activeLimit,
    cappedOutCount: Math.max(0, sourceCount - MAX_CUSTOM_CONTENT_ITEMS),
    unusedForLevelCount: Math.max(0, cappedCount - activeLimit),
    usesFallback: rawItems.length === 0,
  };
}

function getReferenceRows(settings: PrintableSettings) {
  const rows = [...LETTERS];

  if (settings.includeNumbers) rows.push(...NUMBERS);
  if (settings.includePunctuation) rows.push(...PUNCTUATION);

  return rows;
}

function getPageCount(settings: PrintableSettings) {
  const includeWorksheet =
    settings.printMode === "packet" || settings.printMode === "worksheet";
  const includeReference =
    settings.printMode === "packet" || settings.printMode === "chart";
  const includeAnswerKey = includeWorksheet && settings.includeAnswerKey;

  let count = 0;
  if (includeWorksheet) count += 1;
  if (includeReference) count += 1;
  if (includeAnswerKey) count += 1;

  return Math.max(1, count);
}

function getImageMimeType(format: ExportFormat) {
  if (format === "jpg" || format === "jpeg") return "image/jpeg";
  if (format === "webp") return "image/webp";
  return "image/png";
}

function getImageExtension(format: ExportFormat) {
  if (format === "jpg") return "jpg";
  if (format === "jpeg") return "jpeg";
  if (format === "webp") return "webp";
  return "png";
}

function getWorksheetWords(settings: PrintableSettings) {
  return parseCommaSeparatedItems(settings.customWords, DEFAULT_WORDS).slice(
    0,
    getWorksheetWordLimit(settings.worksheetLevel),
  );
}

function getWorksheetSentences(settings: PrintableSettings) {
  return parseCommaSeparatedItems(
    settings.customSentences,
    DEFAULT_SENTENCES,
  ).slice(0, getWorksheetSentenceLimit(settings.worksheetLevel));
}

function formatDisplayDate(value: string) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${month}/${day}/${year}`;
}

function buildLines(count: number, className = "answer-lines") {
  return `
    <div class="${className}">
      ${Array.from({ length: clampLineCount(count) }, () => "<span></span>").join("")}
    </div>
  `;
}

function shouldStackPrompt(value: string, type: "word" | "sentence" | "morse") {
  const length = value.trim().length;

  if (type === "sentence") return length > 28;
  if (type === "morse") return length > 34;
  return length > 18;
}

function buildPracticeRow({
  index,
  prompt,
  promptHtml,
  lineCount,
  type,
}: {
  index: number;
  prompt: string;
  promptHtml?: string;
  lineCount: number;
  type: "word" | "sentence" | "morse";
}) {
  const stackClass = shouldStackPrompt(prompt, type) ? "stacked" : "inline";

  return `
    <div class="practice-row ${stackClass}">
      <div class="prompt-text"><strong>${index}.</strong> ${
        promptHtml ?? escapeHtml(prompt)
      }</div>
      ${buildLines(lineCount)}
    </div>
  `;
}

async function makeWebsiteQrCodeDataUrl() {
  return QRCode.toDataURL(WEBSITE_URL, {
    width: 180,
    margin: 1,
    errorCorrectionLevel: "M",
    color: {
      dark: "#075985",
      light: "#ffffff",
    },
  });
}

function buildReferenceTableHtml({
  title,
  rows,
  columns,
}: {
  title: string;
  rows: CharacterRow[];
  columns: number;
}) {
  const chunks = chunkRows(rows, columns);

  return `
    <section class="print-section">
      <div class="section-heading">
        <h2>${escapeHtml(title)}</h2>
      </div>
      <div class="reference-grid reference-grid-${columns}">
        ${chunks
          .map(
            (chunk) => `
              <table class="reference-table">
                <thead>
                  <tr>
                    <th>Character</th>
                    <th>Morse</th>
                  </tr>
                </thead>
                <tbody>
                  ${chunk
                    .map(
                      (row) => `
                        <tr>
                          <td><strong class="prompt-text">${escapeHtml(
                            row.character,
                          )}</strong></td>
                          <td><code>${escapeHtml(row.morse)}</code></td>
                        </tr>
                      `,
                    )
                    .join("")}
                </tbody>
              </table>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function buildIdentityHtml(settings: PrintableSettings) {
  const hasCustomLogo = Boolean(settings.customLogoDataUrl);
  const brandName = getBrandName(settings);

  return `
    <div class="header-identity">
      ${
        hasCustomLogo
          ? `
            <div class="custom-logo-wrap">
              <img src="${escapeHtml(settings.customLogoDataUrl)}" alt="${escapeHtml(
                settings.customLogoName || `${brandName} logo`,
              )}" />
            </div>
          `
          : `
            <div class="default-logo-mark">${escapeHtml(
              brandName.charAt(0) || "M",
            )}</div>
          `
      }
      <div class="header-identity-copy">
        <strong>${escapeHtml(brandName)}</strong>
        <span>${escapeHtml(
          settings.className ||
            settings.teacherName ||
            "Printable Morse code practice",
        )}</span>
      </div>
    </div>
  `;
}

function buildPageHeaderHtml({
  settings,
  kicker,
  title,
  subtitle,
  badge,
  secondaryBadge,
}: {
  settings: PrintableSettings;
  kicker: string;
  title: string;
  subtitle: string;
  badge?: string;
  secondaryBadge?: string;
}) {
  return `
    <header class="page-header">
      <div class="page-header-top">
        ${buildIdentityHtml(settings)}
        <div class="page-header-badges">
          ${
            secondaryBadge
              ? `<span class="page-header-badge secondary">${escapeHtml(
                  secondaryBadge,
                )}</span>`
              : ""
          }
          ${
            badge
              ? `<span class="page-header-badge">${escapeHtml(badge)}</span>`
              : ""
          }
        </div>
      </div>
      <div class="page-header-main">
        <p class="page-kicker">${escapeHtml(kicker)}</p>
        <h1>${escapeHtml(title)}</h1>
        <p class="page-subtitle">${escapeHtml(subtitle)}</p>
      </div>
    </header>
  `;
}

function buildStudentMetaHtml(settings: PrintableSettings) {
  return `
    <section class="student-meta">
      <div>
        <span>Student name</span>
        <strong>${escapeHtml(settings.studentName)}</strong>
      </div>
      <div>
        <span>Date</span>
        <strong>${escapeHtml(formatDisplayDate(settings.assignmentDate))}</strong>
      </div>
      <div>
        <span>Class / group</span>
        <strong>${escapeHtml(settings.className)}</strong>
      </div>
      <div>
        <span>Teacher</span>
        <strong>${escapeHtml(settings.teacherName)}</strong>
      </div>
    </section>
  `;
}

function buildQrCodeHtml(qrCodeDataUrl: string) {
  if (!qrCodeDataUrl) {
    return `
      <div class="qr-fallback">
        <strong>Scan for more tools</strong>
        <span>${escapeHtml(DISPLAY_URL)}</span>
      </div>
    `;
  }

  return `
    <div class="qr-block">
      <img src="${escapeHtml(qrCodeDataUrl)}" alt="QR code linking to ${escapeHtml(
        DISPLAY_URL,
      )}" />
      <div>
        <strong>Scan for more Morse tools</strong>
        <span>${escapeHtml(DISPLAY_URL)}</span>
      </div>
    </div>
  `;
}

function buildReferenceGuideFooterHtml(
  settings: PrintableSettings,
  qrCodeDataUrl: string,
) {
  if (!settings.includeBranding) return "";

  return `
    <footer class="reference-footer">
      <div class="signoff-copy">
        <div class="signoff-brand">
          <strong>${escapeHtml(SITE_NAME)}</strong>
          <span>${escapeHtml(DISPLAY_URL)}</span>
        </div>
        <code>${escapeHtml(SIGN_OFF_MORSE)}</code>
      </div>
      ${buildQrCodeHtml(qrCodeDataUrl)}
    </footer>
  `;
}

function buildDirectionsHtml(settings: PrintableSettings) {
  if (!settings.includeDirections) return "";

  return `
    <section class="directions-box">
      <strong>Directions</strong>
      <span>${escapeHtml(settings.directions || DEFAULT_DIRECTIONS)}</span>
    </section>
  `;
}

function buildReferenceGuidePageHtml(
  settings: PrintableSettings,
  qrCodeDataUrl: string,
) {
  return `
    <section class="page reference-guide-page">
      ${buildPageHeaderHtml({
        settings,
        kicker: "Reference guide",
        title: "Printable Morse Code Reference Guide",
        subtitle:
          "A clean reference for letters, numbers, punctuation, and spacing rules.",
        badge: "Reference Chart",
      })}

      ${buildStudentMetaHtml(settings)}

      <section class="rules-grid">
        <div>
          <strong>Dot</strong>
          <span>1 unit</span>
        </div>
        <div>
          <strong>Dash</strong>
          <span>3 units</span>
        </div>
        <div>
          <strong>Inside a letter</strong>
          <span>1 unit gap</span>
        </div>
        <div>
          <strong>Between letters</strong>
          <span>3 unit gap</span>
        </div>
        <div>
          <strong>Between words</strong>
          <span>7 unit gap or slash</span>
        </div>
      </section>

      ${buildReferenceTableHtml({
        title: "Letters A-Z",
        rows: LETTERS,
        columns: 3,
      })}

      ${
        settings.includeNumbers || settings.includePunctuation
          ? `
            <div class="two-column">
              ${
                settings.includeNumbers
                  ? buildReferenceTableHtml({
                      title: "Numbers 0-9",
                      rows: NUMBERS,
                      columns: 2,
                    })
                  : ""
              }
              ${
                settings.includePunctuation
                  ? buildReferenceTableHtml({
                      title: "Common punctuation",
                      rows: PUNCTUATION,
                      columns: 2,
                    })
                  : ""
              }
            </div>
          `
          : ""
      }

      <aside class="tip-box">
        When writing Morse as text, place a space between letters and a slash between words.
      </aside>

      ${buildReferenceGuideFooterHtml(settings, qrCodeDataUrl)}
    </section>
  `;
}

function buildTeacherReviewHtml(settings: PrintableSettings) {
  if (!settings.includeTeacherReview) return "";

  return `
    <section class="teacher-review">
      <h2>Teacher scoring and feedback</h2>

      <div class="score-grid">
        <div>
          <span>Accuracy</span>
          <strong>____ / 10</strong>
        </div>
        <div>
          <span>Spacing</span>
          <strong>____ / 10</strong>
        </div>
        <div>
          <span>Completion</span>
          <strong>____ / 10</strong>
        </div>
        <div>
          <span>Total</span>
          <strong>____ / 30</strong>
        </div>
      </div>

      <div class="feedback-box">
        <span>Teacher feedback</span>
        ${buildLines(settings.teacherFeedbackLineCount, "feedback-lines")}
      </div>

      <div class="teacher-meta">
        <div>
          <span>Marked by</span>
          <strong>${escapeHtml(settings.teacherName)}</strong>
        </div>
        <div>
          <span>Date returned</span>
        </div>
      </div>
    </section>
  `;
}

function buildWorksheetPageHtml(settings: PrintableSettings) {
  const words = getWorksheetWords(settings);
  const sentences = getWorksheetSentences(settings);

  const decodeWords = words.slice(0, Math.max(3, Math.ceil(words.length / 2)));
  const encodeWords = words.slice(Math.max(3, Math.ceil(words.length / 2)));
  const encodeSource =
    encodeWords.length > 0 ? encodeWords : DEFAULT_WORDS.slice(0, 4);

  return `
    <section class="page worksheet-page">
      ${buildPageHeaderHtml({
        settings,
        kicker: "Learner worksheet",
        title: settings.worksheetTitle || "Morse Code Practice Sheet",
        subtitle:
          "Classroom-ready practice for copying, decoding, encoding, and writing Morse code.",
        badge: worksheetLevelLabel(settings.worksheetLevel),
      })}

      ${buildStudentMetaHtml(settings)}

      ${buildDirectionsHtml(settings)}

      <section class="worksheet-section">
        <h2>1. Copy practice</h2>
        <p>Copy each Morse code pattern neatly.</p>
        <div class="copy-grid">
          ${LETTERS.map(
            (row) => `
              <div class="copy-row">
                <strong class="prompt-text">${escapeHtml(
                  row.character,
                )} <code>${escapeHtml(row.morse)}</code></strong>
                <span></span>
              </div>
            `,
          ).join("")}
        </div>
      </section>

      <section class="worksheet-section">
        <h2>2. Decode these words</h2>
        <p>Translate each Morse code message into text.</p>
        <div class="drill-list">
          ${decodeWords
            .map((word, wordIndex) => {
              const morse = encodeToMorse(word);
              return buildPracticeRow({
                index: wordIndex + 1,
                prompt: morse,
                promptHtml: `<code>${escapeHtml(morse)}</code>`,
                lineCount: settings.decodeAnswerLineCount,
                type: "morse",
              });
            })
            .join("")}
        </div>
      </section>

      <section class="worksheet-section">
        <h2>3. Encode these words</h2>
        <p>Turn each word into dots, dashes, spaces, and slashes.</p>
        <div class="drill-list">
          ${encodeSource
            .map((word, wordIndex) =>
              buildPracticeRow({
                index: wordIndex + 1,
                prompt: cleanMorseInput(word),
                lineCount: settings.encodeAnswerLineCount,
                type: "word",
              }),
            )
            .join("")}
        </div>
      </section>

      ${
        sentences.length > 0
          ? `
            <section class="worksheet-section">
              <h2>4. Sentence practice</h2>
              <p>Encode each sentence. Use a slash between words.</p>
              <div class="sentence-list">
                ${sentences
                  .map((sentence, sentenceIndex) =>
                    buildPracticeRow({
                      index: sentenceIndex + 1,
                      prompt: cleanMorseInput(sentence),
                      lineCount: settings.sentenceAnswerLineCount,
                      type: "sentence",
                    }),
                  )
                  .join("")}
              </div>
            </section>
          `
          : ""
      }

      <section class="worksheet-section">
        <h2>${sentences.length > 0 ? "5" : "4"}. Write your own message</h2>
        <p>
          Write the original plain text first, then write the Morse code version below it.
        </p>

        <div class="own-message-group">
          <div class="own-message-box">
            <strong>Plain text message</strong>
            ${buildLines(settings.ownMessageTextLineCount, "message-lines")}
          </div>
          <div class="own-message-box">
            <strong>Morse code version</strong>
            ${buildLines(settings.ownMessageMorseLineCount, "message-lines")}
          </div>
        </div>
      </section>

      ${buildTeacherReviewHtml(settings)}
    </section>
  `;
}

function buildAnswerKeyPageHtml(settings: PrintableSettings) {
  const words = getWorksheetWords(settings);
  const sentences = getWorksheetSentences(settings);

  const decodeWords = words.slice(0, Math.max(3, Math.ceil(words.length / 2)));
  const encodeWords = words.slice(Math.max(3, Math.ceil(words.length / 2)));
  const encodeSource =
    encodeWords.length > 0 ? encodeWords : DEFAULT_WORDS.slice(0, 4);

  return `
    <section class="page answer-key-page">
      ${buildPageHeaderHtml({
        settings,
        kicker: "Teacher copy",
        title: "Answer Key",
        subtitle:
          "Keep this page at the end of the printable packet so answers are not shown to learners first.",
        badge: "Answer Key",
      })}

      ${buildStudentMetaHtml(settings)}

      <section class="answer-key-page-section">
        <h2>Decode words</h2>
        <div class="answer-grid single-column">
          ${decodeWords
            .map(
              (word, wordIndex) => `
                <div>
                  <strong>${wordIndex + 1}. <code>${escapeHtml(
                    encodeToMorse(word),
                  )}</code></strong>
                  <span>${escapeHtml(cleanMorseInput(word))}</span>
                </div>
              `,
            )
            .join("")}
        </div>
      </section>

      <section class="answer-key-page-section">
        <h2>Encode words</h2>
        <div class="answer-grid single-column">
          ${encodeSource
            .map(
              (word, wordIndex) => `
                <div>
                  <strong>${wordIndex + 1}. ${escapeHtml(
                    cleanMorseInput(word),
                  )}</strong>
                  <code>${escapeHtml(encodeToMorse(word))}</code>
                </div>
              `,
            )
            .join("")}
        </div>
      </section>

      ${
        sentences.length > 0
          ? `
            <section class="answer-key-page-section">
              <h2>Sentence practice</h2>
              <div class="answer-grid single-column">
                ${sentences
                  .map(
                    (sentence, sentenceIndex) => `
                      <div>
                        <strong>${sentenceIndex + 1}. ${escapeHtml(
                          cleanMorseInput(sentence),
                        )}</strong>
                        <code>${escapeHtml(encodeToMorse(sentence))}</code>
                      </div>
                    `,
                  )
                  .join("")}
              </div>
            </section>
          `
          : ""
      }

      <section class="answer-key-note">
        Teachers can optionally remove this final page before handing the worksheet to students.
      </section>
    </section>
  `;
}

function getPrintableCss({
  forImageExport = false,
}: {
  forImageExport?: boolean;
} = {}) {
  return `
    ${forImageExport ? "" : "@page { size: letter portrait; margin: 0.36in; }"}

    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      background: ${forImageExport ? "#eaf6ff" : "#ffffff"};
      color: #0f172a;
      font-family: "DM Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .export-wrap {
      width: ${EXPORT_WIDTH}px;
      min-height: 100%;
      background: #eaf6ff;
      padding: 0;
      overflow: visible;
    }

    .page {
      position: relative;
      width: ${forImageExport ? `${EXPORT_WIDTH}px` : "auto"};
      min-height: ${forImageExport ? `${EXPORT_PAGE_HEIGHT}px` : "10.25in"};
      page-break-after: always;
      overflow: ${forImageExport ? "visible" : "hidden"};
      background: #ffffff;
      ${
        forImageExport
          ? `padding: 34px; margin: 0 0 ${EXPORT_PAGE_GAP}px 0;`
          : ""
      }
    }

    .page:last-child {
      page-break-after: auto;
      margin-bottom: 0;
    }

    .page-header {
      border-bottom: 1px solid #bae6fd;
      padding-bottom: 0.12in;
      margin-bottom: 0.12in;
    }

    .page-header-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.14in;
    }

    .header-identity {
      display: flex;
      align-items: center;
      gap: 0.1in;
      min-width: 0;
    }

    .header-identity-copy {
      min-width: 0;
    }

    .header-identity-copy strong {
      display: block;
      color: #075985;
      font-size: 10.5pt;
      font-weight: 900;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .header-identity-copy span {
      display: block;
      margin-top: 0.01in;
      color: #475569;
      font-size: 8.2pt;
      font-weight: 800;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .custom-logo-wrap {
      width: 0.56in;
      height: 0.56in;
      flex: 0 0 auto;
      border: 1px solid #bae6fd;
      border-radius: 12px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 0.04in;
    }

    .custom-logo-wrap img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      display: block;
    }

    .default-logo-mark {
      width: 0.42in;
      height: 0.42in;
      flex: 0 0 auto;
      border-radius: 12px;
      background: #075985;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13pt;
      font-weight: 900;
    }

    .page-header-badges {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 0.06in;
      flex: 0 0 auto;
    }

    .page-header-badge {
      border: 1px solid #7dd3fc;
      border-radius: 999px;
      background: #ffffff;
      padding: 0.06in 0.14in;
      color: #075985;
      font-size: 7.8pt;
      font-weight: 900;
      white-space: nowrap;
    }

    .page-header-badge.secondary {
      background: #f0f9ff;
    }

    .page-header-main {
      margin-top: 0.08in;
    }

    .page-kicker {
      margin: 0;
      color: #334155;
      font-size: 8.2pt;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0.03in 0 0;
      color: #075985;
      font-size: 19pt;
      font-weight: 900;
      line-height: 1.08;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .page-subtitle {
      margin: 0.05in 0 0;
      color: #1f2937;
      font-size: 8.8pt;
      font-weight: 700;
      line-height: 1.35;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .rules-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.08in;
      margin: 0.14in 0;
    }

    .rules-grid div {
      border: 1px solid #bae6fd;
      border-radius: 12px;
      background: #f8fafc;
      padding: 0.09in;
    }

    .rules-grid strong,
    .rules-grid span {
      display: block;
      font-weight: 900;
    }

    .rules-grid strong {
      color: #075985;
      font-size: 8pt;
    }

    .rules-grid span {
      margin-top: 0.03in;
      color: #1f2937;
      font-size: 7.7pt;
    }

    .student-meta {
      display: grid;
      grid-template-columns: 1fr 0.72fr 0.9fr 0.9fr;
      gap: 0.1in;
      margin: 0.1in 0 0.12in;
    }

    .student-meta div {
      min-height: 0.36in;
      border-bottom: 1.6px solid #64748b;
      color: #1f2937;
      font-size: 8pt;
      min-width: 0;
    }

    .student-meta span {
      display: block;
      font-weight: 900;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .student-meta strong {
      display: block;
      margin-top: 0.04in;
      color: #0f172a;
      font-size: 8.8pt;
      font-weight: 900;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .print-section {
      margin-top: 0.12in;
    }

    .section-heading h2,
    .worksheet-section h2,
    .teacher-review h2,
    .answer-key-page-section h2 {
      margin: 0 0 0.07in;
      color: #075985;
      font-size: 12pt;
      font-weight: 900;
      line-height: 1.1;
    }

    .reference-grid {
      display: grid;
      gap: 0.08in;
    }

    .reference-grid-2 {
      grid-template-columns: repeat(2, 1fr);
    }

    .reference-grid-3 {
      grid-template-columns: repeat(3, 1fr);
    }

    .reference-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      overflow: hidden;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      font-size: 8.8pt;
    }

    .reference-table th {
      background: #e0f2fe;
      color: #075985;
      text-align: left;
      font-size: 7.5pt;
      font-weight: 900;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .reference-table th,
    .reference-table td {
      border-bottom: 1px solid #e2e8f0;
      padding: 0.04in 0.065in;
    }

    .reference-table tr:last-child td {
      border-bottom: 0;
    }

    code {
      color: #0f172a;
      font-family: "Space Mono", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      font-weight: 900;
      letter-spacing: 0.04em;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .prompt-text {
      color: #0f172a;
      font-weight: 900;
      overflow-wrap: anywhere;
      word-break: break-word;
      min-width: 0;
    }

    .two-column {
      display: grid;
      grid-template-columns: 0.78fr 1.22fr;
      gap: 0.14in;
      margin-top: 0.12in;
    }

    .two-column .print-section {
      margin-top: 0;
    }

    .tip-box,
    .directions-box,
    .answer-key-note {
      margin-top: 0.12in;
      border: 1px solid #bae6fd;
      border-radius: 14px;
      background: #f8fafc;
      padding: 0.1in 0.13in;
      color: #1f2937;
      font-size: 9pt;
      font-weight: 800;
    }

    .directions-box,
    .answer-key-note {
      display: grid;
      gap: 0.03in;
    }

    .directions-box strong {
      color: #075985;
      font-size: 8pt;
      font-weight: 900;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .directions-box span {
      font-weight: 800;
      line-height: 1.35;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .worksheet-section,
    .answer-key-page-section {
      break-inside: avoid;
      margin-top: 0.11in;
      border: 1px solid #dbeafe;
      border-radius: 16px;
      padding: 0.11in;
    }

    .worksheet-section p {
      margin: -0.035in 0 0.08in;
      color: #1f2937;
      font-size: 8.4pt;
      font-weight: 700;
    }

    .copy-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.042in 0.12in;
    }

    .copy-row {
      display: grid;
      grid-template-columns: 0.95in 1fr;
      align-items: end;
      gap: 0.08in;
      font-size: 8.05pt;
    }

    .copy-row span,
    .answer-lines span,
    .message-lines span,
    .feedback-lines span,
    .teacher-meta div {
      display: block;
      height: 0.22in;
      border-bottom: 1.6px solid #64748b;
    }

    .copy-row span {
      height: 0.17in;
    }

    .drill-list,
    .sentence-list {
      display: grid;
      gap: 0.09in;
    }

    .practice-row {
      font-size: 9pt;
      min-width: 0;
    }

    .practice-row.inline {
      display: grid;
      grid-template-columns: minmax(1.5in, 2.25in) 1fr;
      align-items: start;
      gap: 0.12in;
    }

    .practice-row.stacked {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.06in;
    }

    .practice-row.stacked .answer-lines {
      width: 100%;
    }

    .answer-lines,
    .message-lines,
    .feedback-lines {
      display: grid;
      gap: 0.1in;
      padding-top: 0.02in;
      min-width: 0;
    }

    .message-lines span {
      height: 0.28in;
    }

    .feedback-lines span {
      height: 0.26in;
    }

    .own-message-group {
      display: grid;
      gap: 0.12in;
    }

    .own-message-box {
      border: 1px solid #dbeafe;
      border-radius: 14px;
      background: #f8fafc;
      padding: 0.09in;
    }

    .own-message-box strong {
      display: block;
      color: #075985;
      font-size: 8.4pt;
      font-weight: 900;
      margin-bottom: 0.04in;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .teacher-review {
      break-inside: avoid;
      margin-top: 0.11in;
      border: 1px solid #dbeafe;
      border-radius: 16px;
      background: #f8fafc;
      padding: 0.11in;
    }

    .score-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.08in;
    }

    .score-grid div {
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      background: #ffffff;
      padding: 0.08in;
      min-height: 0.46in;
    }

    .score-grid span,
    .feedback-box span,
    .teacher-meta span {
      display: block;
      color: #334155;
      font-size: 7.4pt;
      font-weight: 900;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .score-grid strong {
      display: block;
      margin-top: 0.05in;
      color: #0f172a;
      font-size: 9.5pt;
      font-weight: 900;
    }

    .feedback-box {
      margin-top: 0.09in;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      background: #ffffff;
      padding: 0.08in;
    }

    .teacher-meta {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.12in;
      margin-top: 0.09in;
    }

    .teacher-meta div {
      min-height: 0.34in;
      height: auto;
      padding-bottom: 0.03in;
    }

    .teacher-meta strong {
      display: block;
      margin-top: 0.04in;
      color: #0f172a;
      font-size: 8.5pt;
      font-weight: 900;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .answer-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.08in 0.12in;
      color: #1f2937;
      font-size: 8.2pt;
      font-weight: 800;
    }

    .answer-grid.single-column {
      grid-template-columns: 1fr;
    }

    .answer-grid div {
      display: grid;
      gap: 0.03in;
      overflow-wrap: anywhere;
      word-break: break-word;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: #ffffff;
      padding: 0.08in;
    }

    .answer-grid strong {
      color: #075985;
      font-weight: 900;
    }

    .reference-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.16in;
      margin-top: 0.18in;
      border-top: 1px solid #bae6fd;
      padding-top: 0.08in;
      color: #075985;
      font-size: 8pt;
      font-weight: 800;
      background: #ffffff;
    }

    .signoff-copy {
      display: grid;
      gap: 0.04in;
      min-width: 0;
    }

    .signoff-brand {
      display: flex;
      gap: 0.08in;
      align-items: center;
      flex-wrap: wrap;
    }

    .reference-footer span {
      color: #334155;
      font-weight: 900;
    }

    .reference-footer code {
      color: #0f172a;
      font-size: 8.3pt;
      font-weight: 900;
    }

    .qr-block {
      display: flex;
      align-items: center;
      gap: 0.08in;
      border: 1px solid #bae6fd;
      border-radius: 12px;
      background: #f0f9ff;
      padding: 0.055in 0.07in;
      flex: 0 0 auto;
    }

    .qr-block img {
      width: 0.52in;
      height: 0.52in;
      display: block;
      border-radius: 6px;
      background: #ffffff;
    }

    .qr-block div {
      display: grid;
      gap: 0.02in;
    }

    .qr-block strong {
      color: #075985;
      font-size: 7.4pt;
      font-weight: 900;
      line-height: 1.1;
    }

    .qr-block span,
    .qr-fallback span {
      color: #334155;
      font-size: 7.2pt;
      font-weight: 900;
    }

    .qr-fallback {
      border: 1px solid #bae6fd;
      border-radius: 12px;
      background: #f0f9ff;
      padding: 0.07in;
      display: grid;
      gap: 0.03in;
    }

    .qr-fallback strong {
      color: #075985;
      font-size: 7.4pt;
      font-weight: 900;
    }

    @media print {
      html,
      body {
        width: 100%;
      }
    }
  `;
}

function buildPrintableHtml(settings: PrintableSettings, qrCodeDataUrl: string) {
  const includeReference =
    settings.printMode === "packet" || settings.printMode === "chart";
  const includeWorksheet =
    settings.printMode === "packet" || settings.printMode === "worksheet";
  const includeAnswerKey = includeWorksheet && settings.includeAnswerKey;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(settings.worksheetTitle || "Morse Code Printable")}</title>
  <style>
    ${getPrintableCss()}
  </style>
</head>
<body>
  ${includeWorksheet ? buildWorksheetPageHtml(settings) : ""}
  ${includeReference ? buildReferenceGuidePageHtml(settings, qrCodeDataUrl) : ""}
  ${includeAnswerKey ? buildAnswerKeyPageHtml(settings) : ""}
</body>
</html>`;
}

function buildExportHtml(settings: PrintableSettings, qrCodeDataUrl: string) {
  const includeReference =
    settings.printMode === "packet" || settings.printMode === "chart";
  const includeWorksheet =
    settings.printMode === "packet" || settings.printMode === "worksheet";
  const includeAnswerKey = includeWorksheet && settings.includeAnswerKey;

  return `
    <div xmlns="http://www.w3.org/1999/xhtml" class="export-wrap">
      <style>${getPrintableCss({ forImageExport: true })}</style>
      ${includeWorksheet ? buildWorksheetPageHtml(settings) : ""}
      ${includeReference ? buildReferenceGuidePageHtml(settings, qrCodeDataUrl) : ""}
      ${includeAnswerKey ? buildAnswerKeyPageHtml(settings) : ""}
    </div>
  `;
}

function printHtml(html: string) {
  const existingFrame = document.getElementById("morse-print-frame");
  if (existingFrame) existingFrame.remove();

  const iframe = document.createElement("iframe");
  iframe.id = "morse-print-frame";
  iframe.title = "Printable Morse Code Worksheet";
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";

  document.body.appendChild(iframe);

  const iframeDocument =
    iframe.contentDocument || iframe.contentWindow?.document;

  if (!iframeDocument) {
    iframe.remove();
    return;
  }

  iframeDocument.open();
  iframeDocument.write(html);
  iframeDocument.close();

  const printFrame = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    window.setTimeout(() => {
      iframe.remove();
    }, 1000);
  };

  iframe.onload = printFrame;
  window.setTimeout(printFrame, 250);
}

function downloadBlob({
  blob,
  filename,
}: {
  blob: Blob;
  filename: string;
}) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function waitForImagesToLoad(container: HTMLElement) {
  const images = Array.from(container.querySelectorAll("img"));

  await Promise.all(
    images.map((image) => {
      if (image.complete) return Promise.resolve();

      return new Promise<void>((resolve) => {
        image.onload = () => resolve();
        image.onerror = () => resolve();
      });
    }),
  );
}

async function measureExportHeight(
  settings: PrintableSettings,
  qrCodeDataUrl: string,
) {
  const exportHtml = buildExportHtml(settings, qrCodeDataUrl);
  const fallbackHeight =
    getPageCount(settings) * EXPORT_PAGE_HEIGHT +
    Math.max(0, getPageCount(settings) - 1) * EXPORT_PAGE_GAP;

  const wrapper = document.createElement("div");

  wrapper.style.position = "absolute";
  wrapper.style.left = "-100000px";
  wrapper.style.top = "0";
  wrapper.style.width = `${EXPORT_WIDTH}px`;
  wrapper.style.pointerEvents = "none";
  wrapper.style.opacity = "0";
  wrapper.style.zIndex = "-1";
  wrapper.innerHTML = exportHtml;

  document.body.appendChild(wrapper);

  await waitForImagesToLoad(wrapper);

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });

  const measuredHeight = Math.ceil(
    Math.max(
      wrapper.scrollHeight,
      wrapper.offsetHeight,
      wrapper.getBoundingClientRect().height,
    ),
  );

  document.body.removeChild(wrapper);

  return Math.max(measuredHeight, fallbackHeight);
}

async function makePrintableImageBlob(
  settings: PrintableSettings,
  qrCodeDataUrl: string,
  format: ExportFormat,
) {
  const exportHeight = await measureExportHeight(settings, qrCodeDataUrl);
  const exportHtml = buildExportHtml(settings, qrCodeDataUrl);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${EXPORT_WIDTH}" height="${exportHeight}" viewBox="0 0 ${EXPORT_WIDTH} ${exportHeight}">
      <foreignObject width="${EXPORT_WIDTH}" height="${exportHeight}">
        ${exportHtml}
      </foreignObject>
    </svg>
  `;

  const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  const image = new Image();

  const imageLoaded = new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Image export failed."));
  });

  image.src = svgUrl;
  await imageLoaded;

  if ("decode" in image) {
    await image.decode().catch(() => undefined);
  }

  const canvas = document.createElement("canvas");
  const scale = 2;

  canvas.width = EXPORT_WIDTH * scale;
  canvas.height = exportHeight * scale;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable.");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.scale(scale, scale);
  context.drawImage(image, 0, 0);

  const mimeType = getImageMimeType(format);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error("Could not create image export."));
          return;
        }

        resolve(result);
      },
      mimeType,
      mimeType === "image/png" ? undefined : 0.94,
    );
  });
}

async function exportPrintableImage(
  settings: PrintableSettings,
  qrCodeDataUrl: string,
  format: ExportFormat,
) {
  const blob = await makePrintableImageBlob(settings, qrCodeDataUrl, format);

  downloadBlob({
    blob,
    filename: `morse-code-chart-and-worksheet.${getImageExtension(format)}`,
  });
}

async function sharePrintable({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const shareData = {
    title,
    text: "Create a printable Morse code worksheet and reference guide.",
    url,
  };

  if (navigator.share) {
    await navigator.share(shareData);
    return "";
  }

  const didCopy = await copyTextToClipboard(url);
  if (didCopy) {
    return "Link copied to clipboard.";
  }

  return `Copy this link: ${url}`;
}

function FormField({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className="block text-sm font-extrabold text-sky-800">{label}</span>
      {description ? (
        <span className="mt-1 block text-xs leading-relaxed text-slate-500">
          {description}
        </span>
      ) : null}
      <span className="mt-2 block min-w-0">{children}</span>
    </label>
  );
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mw-static-surface-soft min-w-0 rounded-xl bg-[#fffaf2]/45 p-4">
      <h3 className="m-0 break-words text-lg font-extrabold text-sky-950">
        {title}
      </h3>
      <p className="mt-1 break-words text-sm leading-relaxed text-slate-600">
        {description}
      </p>
      <div className="mt-4 grid min-w-0 gap-4">{children}</div>
    </section>
  );
}

function ContentLimitNote({
  label,
  stats,
}: {
  label: string;
  stats: ReturnType<typeof getCustomContentStats>;
}) {
  const hasTriggeredLimit =
    stats.unusedForLevelCount > 0 || stats.cappedOutCount > 0;

  if (!hasTriggeredLimit) return null;

  const notices = [
    `${stats.usedCount} of ${stats.sourceCount} ${label.toLowerCase()} will print for the current difficulty.`,
    stats.unusedForLevelCount
      ? `${stats.unusedForLevelCount} ${
          stats.unusedForLevelCount === 1 ? "item is" : "items are"
        } saved here but not used at this difficulty.`
      : "",
    stats.cappedOutCount
      ? `Only the first ${MAX_CUSTOM_CONTENT_ITEMS} custom items are available for worksheet generation.`
      : "",
  ].filter(Boolean);

  return (
    <div className="mw-static-tile mt-3 rounded-xl bg-[#f7f4ee] p-3 text-xs leading-relaxed text-slate-600">
      <div className="flex items-center gap-2 font-bold text-sky-900">
        <WarningIcon size={16} title={`${label} limits`} />
        Content limits
      </div>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {notices.map((notice) => (
          <li key={notice}>{notice}</li>
        ))}
      </ul>
    </div>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-w-0 cursor-pointer items-center justify-between gap-3 rounded-xl bg-[#fffdf8] p-3 transition hover:bg-[#f7f4ee]">
      <span className="min-w-0 break-words text-sm font-bold text-slate-800">
        {label}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 shrink-0 cursor-pointer accent-sky-700"
      />
    </label>
  );
}

function QuickButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <ActionButton
      size="sm"
      onClick={onClick}
      className="active:scale-95"
    >
      {children}
    </ActionButton>
  );
}

function NumberField({
  label,
  value,
  min = 1,
  max = 12,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <FormField label={label}>
      <input
        className="input-control"
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) =>
          onChange(clampLineCount(Number(event.target.value), min, max))
        }
      />
    </FormField>
  );
}

function PreviewReferenceTable({ rows }: { rows: CharacterRow[] }) {
  return (
    <section className="mw-static-surface-soft min-w-0 rounded-xl bg-[#fffaf2]/45 p-4">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <h3 className="m-0 min-w-0 break-words text-base font-black text-sky-800">
          Reference guide page
        </h3>
        <span className="mw-static-tile shrink-0 rounded-full bg-[#f7f4ee] px-3 py-1 text-xs font-black text-sky-800">
          Included
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        {rows.slice(0, 15) .map((row) => (
          <div
            key={`preview-chart-${row.character}`}
            className="mw-static-tile min-w-0 rounded-xl bg-[#f7f4ee] px-2 py-2"
          >
            <strong>{row.character}</strong>{" "}
            <code className="break-words font-bold">{row.morse}</code>
          </div>
        ))}
      </div>
    </section>
  );
}

function WorksheetPaperPreview({
  settings,
}: {
  settings: PrintableSettings;
}) {
  const words = getWorksheetWords(settings);
  const sentences = getWorksheetSentences(settings);

  return (
    <section className="mw-static-surface-soft min-w-0 rounded-xl bg-[#fffaf2]/45 p-4">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <h3 className="m-0 min-w-0 break-words text-base font-black text-sky-800">
          Worksheet page
        </h3>
        <span className="mw-static-tile shrink-0 rounded-full bg-[#f7f4ee] px-3 py-1 text-xs font-black text-sky-800">
          {worksheetLevelLabel(settings.worksheetLevel)}
        </span>
      </div>

      <div className="mw-static-tile mt-3 min-w-0 rounded-2xl bg-[#f7f4ee] p-3">
        <div className="flex min-w-0 items-center gap-3">
          {settings.customLogoDataUrl ? (
            <img
              src={settings.customLogoDataUrl}
              alt={settings.customLogoName || `${getBrandName(settings)} logo`}
              className="h-12 w-12 shrink-0 rounded-xl bg-white object-contain p-1"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-800 text-lg font-black text-white">
              {getBrandName(settings).charAt(0)}
            </div>
          )}

          <div className="min-w-0">
            <div className="break-words text-xs font-black uppercase tracking-wide text-sky-800">
              {getBrandName(settings)}
            </div>
            <div className="mt-1 break-words text-sm font-black text-slate-900">
              {settings.worksheetTitle || "Morse Code Practice Sheet"}
            </div>
            <div className="mt-1 text-xs text-slate-600">
              Student name, date, class, and teacher fields included.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid min-w-0 gap-2">
        {words.slice(0, 4) .map((word) => (
          <div
            key={`preview-word-${word}`}
            className="mw-static-tile min-w-0 rounded-xl bg-[#f7f4ee] px-3 py-2 text-xs"
          >
            <strong className="break-words">{cleanMorseInput(word)}</strong>{" "}
            <code className="break-words font-bold">{encodeToMorse(word)}</code>
          </div>
        ))}
      </div>

      {sentences.length > 0 ? (
        <div className="mw-static-tile mt-3 min-w-0 rounded-xl bg-[#f7f4ee] px-3 py-2 text-xs text-slate-700">
          <strong>Sentences:</strong>{" "}
          <span className="break-words">{sentences.join(" · ")}</span>
        </div>
      ) : null}

        <div className="mw-static-surface-soft mt-3 min-w-0 rounded-xl bg-[#fffaf2] px-3 py-2 text-xs text-slate-700">
        <strong>Own message fields:</strong>{" "}
        <span className="break-words">
          Plain text {settings.ownMessageTextLineCount} lines, Morse{" "}
          {settings.ownMessageMorseLineCount} lines
        </span>
      </div>
    </section>
  );
}

function AnswerKeyPreview({ settings }: { settings: PrintableSettings }) {
  const sentences = getWorksheetSentences(settings);

  return (
    <section className="mw-static-surface-soft min-w-0 rounded-xl bg-[#fffaf2]/45 p-4">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <h3 className="m-0 min-w-0 break-words text-base font-black text-sky-800">
          Answer key page
        </h3>
        <span className="mw-static-tile shrink-0 rounded-full bg-[#f7f4ee] px-3 py-1 text-xs font-black text-sky-800">
          Last page
        </span>
      </div>

      <div className="mw-static-tile mt-3 rounded-xl bg-[#f7f4ee] p-3 text-xs text-slate-700">
        <div className="font-black text-sky-800">Included at the very end</div>
        <div className="mt-2">
          Answers for decode words, encode words, and sentence practice
          {sentences.length > 0 ? "" : " when sentences are added"}.
        </div>
      </div>
    </section>
  );
}

function LivePreview({
  settings,
  qrCodeDataUrl,
  downloadFormat,
  isExporting,
  statusMessage,
  onDownloadFormatChange,
  onDownload,
  onShare,
}: {
  settings: PrintableSettings;
  qrCodeDataUrl: string;
  downloadFormat: DownloadFormat;
  isExporting: boolean;
  statusMessage: string;
  onDownloadFormatChange: (format: DownloadFormat) => void;
  onDownload: () => void;
  onShare: () => void;
}) {
  const isPdf = downloadFormat === "pdf";

  return (
    <aside className="mw-static-surface-soft min-w-0 rounded-xl bg-[#fffaf2]/45 p-5 lg:sticky lg:top-4">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="m-0 font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
            Output preview
          </p>
          <h2 className="mt-2 break-words text-2xl font-extrabold text-sky-950">
            {printModeLabel(settings.printMode)}
          </h2>
          <p className="mt-2 max-w-2xl break-words text-sm leading-relaxed text-slate-700">
            PDF is the default output. The answer key is off by default and, if
            enabled, prints as the final page.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl p-0">
        <label className="block">
          <span className="block text-sm font-semibold text-sky-950">
            Download format
          </span>
          <select
            className="select-control mt-2"
            value={downloadFormat}
            onChange={(event) =>
              onDownloadFormatChange(event.target.value as DownloadFormat)
            }
          >
            <option value="pdf">PDF</option>
            <option value="png">PNG image</option>
            <option value="jpg">JPG image</option>
            <option value="jpeg">JPEG image</option>
            <option value="webp">WEBP image</option>
          </select>
        </label>

        <div className="mt-3 flex flex-wrap gap-2">
          <ActionButton
            onClick={onDownload}
            tone="dark"
            disabled={isExporting}
            className="active:scale-95"
            leadingIcon={<DownloadIcon size={18} title="Download printable" />}
          >
            {isExporting
              ? "Preparing export..."
              : isPdf
                ? "Download PDF"
                : `Download ${downloadFormat.toUpperCase()}`}
          </ActionButton>

          <ActionButton
            onClick={onShare}
            className="active:scale-95"
            leadingIcon={<ShareIcon size={18} title="Share printable" />}
          >
            Share
          </ActionButton>
        </div>

        {statusMessage ? (
          <p className="mw-static-surface-soft mt-3 rounded-xl bg-[#fffaf2] px-3 py-2 text-sm font-semibold text-slate-700">
            {statusMessage}
          </p>
        ) : null}

        {isPdf ? (
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            PDF opens the browser print dialog so users can save as PDF or print.
          </p>
        ) : (
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Image export downloads the generated worksheet/reference output as a
            single image file.
          </p>
        )}
      </div>

      <div className="mt-5 grid min-w-0 gap-4 xl:grid-cols-2">
        {settings.printMode !== "chart" ? (
          <WorksheetPaperPreview settings={settings} />
        ) : null}

        {settings.printMode !== "worksheet" ? (
          <PreviewReferenceTable rows={getReferenceRows(settings)} />
        ) : null}

        {settings.includeAnswerKey &&
        (settings.printMode === "packet" || settings.printMode === "worksheet") ? (
          <AnswerKeyPreview settings={settings} />
        ) : null}
      </div>

      {settings.includeBranding && qrCodeDataUrl ? (
        <div className="mw-static-tile mt-4 min-w-0 rounded-xl bg-[#f7f4ee] p-3 text-xs text-slate-700">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={qrCodeDataUrl}
              alt="QR code to MorseWords"
              className="h-12 w-12 shrink-0 rounded-lg bg-white p-1"
            />
            <div className="min-w-0">
              <strong className="break-words text-sky-950">
                QR appears on the reference guide
              </strong>
              <div className="break-words">{DISPLAY_URL}</div>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}

function CharacterGrid({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: CharacterRow[];
}) {
  return (
    <section style={styles.section}>
      <div className="mb-4 min-w-0">
        <h2 className="m-0 break-words text-2xl font-bold text-sky-800">
          {title}
        </h2>
        <p className="mt-2 break-words text-slate-600">{description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <article
            key={`${row.character}-${row.morse}`}
            className="mw-static-tile min-w-0 rounded-xl bg-[#f7f4ee] p-4"
          >
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="break-words text-xs font-bold uppercase tracking-wide text-slate-500">
                  {row.name}
                </div>
                <div className="mt-1 text-3xl font-black text-sky-800">
                  {row.character}
                </div>
              </div>
              <code className="mw-static-code shrink-0 rounded-xl bg-[#f2eee6] px-3 py-2 text-base font-black text-slate-900">
                {row.morse}
              </code>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function MorseCodePrintableChart() {
  const [settings, setSettings] = React.useState<PrintableSettings>(() =>
    readInitialPrintableSettings(),
  );
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState("");
  const [hasLoadedStorage, setHasLoadedStorage] = React.useState(false);
  const [downloadFormat, setDownloadFormat] =
    React.useState<DownloadFormat>("pdf");
  const [isExporting, setIsExporting] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState("");
  const wordContentStats = getCustomContentStats({
    value: settings.customWords,
    fallback: DEFAULT_WORDS,
    activeLimit: getWorksheetWordLimit(settings.worksheetLevel),
  });
  const sentenceContentStats = getCustomContentStats({
    value: settings.customSentences,
    fallback: DEFAULT_SENTENCES,
    activeLimit: getWorksheetSentenceLimit(settings.worksheetLevel),
  });

  React.useEffect(() => {
    setHasLoadedStorage(true);
  }, []);

  React.useEffect(() => {
    if (!hasLoadedStorage) return;

    try {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // localStorage can fail in private mode or if storage quota is full.
    }
  }, [settings, hasLoadedStorage]);

  React.useEffect(() => {
    if (!hasLoadedStorage) return;

    try {
      const defaultPresets: StoredPresetMap = {
        beginner: mergeSettings({
          ...DEFAULT_SETTINGS,
          worksheetLevel: "beginner",
          customWords: BEGINNER_WORDS.join(", "),
          customSentences: BEGINNER_SENTENCES.join(", "),
          includeNumbers: false,
          includePunctuation: false,
          includeAnswerKey: false,
          decodeAnswerLineCount: 1,
          encodeAnswerLineCount: 1,
          sentenceAnswerLineCount: 1,
          ownMessageTextLineCount: 2,
          ownMessageMorseLineCount: 3,
          teacherFeedbackLineCount: 4,
        }),
        classroom: mergeSettings({
          ...DEFAULT_SETTINGS,
          worksheetLevel: "standard",
          customWords: DEFAULT_WORDS.join(", "),
          customSentences: DEFAULT_SENTENCES.join(", "),
          directions: DEFAULT_DIRECTIONS,
          includeNumbers: true,
          includePunctuation: true,
          includeAnswerKey: false,
          includeTeacherReview: true,
          includeDirections: true,
          includeBranding: true,
          decodeAnswerLineCount: 1,
          encodeAnswerLineCount: 1,
          sentenceAnswerLineCount: 2,
          ownMessageTextLineCount: 3,
          ownMessageMorseLineCount: 4,
          teacherFeedbackLineCount: 5,
        }),
        challenge: mergeSettings({
          ...DEFAULT_SETTINGS,
          worksheetLevel: "challenge",
          customWords: CHALLENGE_WORDS.join(", "),
          customSentences: CHALLENGE_SENTENCES.join(", "),
          includeNumbers: true,
          includePunctuation: true,
          includeAnswerKey: false,
          includeTeacherReview: true,
          includeDirections: true,
          decodeAnswerLineCount: 1,
          encodeAnswerLineCount: 2,
          sentenceAnswerLineCount: 3,
          ownMessageTextLineCount: 4,
          ownMessageMorseLineCount: 6,
          teacherFeedbackLineCount: 6,
        }),
      };

      const stored = window.localStorage.getItem(PRESETS_STORAGE_KEY);
      const existing = stored ? (JSON.parse(stored) as StoredPresetMap) : {};

      window.localStorage.setItem(
        PRESETS_STORAGE_KEY,
        JSON.stringify({
          ...defaultPresets,
          ...existing,
        }),
      );
    } catch {
      // Presets remain available from constants if storage fails.
    }
  }, [hasLoadedStorage]);

  React.useEffect(() => {
    let isMounted = true;

    makeWebsiteQrCodeDataUrl()
      .then((dataUrl) => {
        if (isMounted) setQrCodeDataUrl(dataUrl);
      })
      .catch(() => {
        if (isMounted) setQrCodeDataUrl("");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const printableHtml = React.useMemo(
    () => buildPrintableHtml(settings, qrCodeDataUrl),
    [settings, qrCodeDataUrl],
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Morse Code Printable Chart",
    url: CANONICAL_URL,
    description:
      "A printable Morse code chart and worksheet builder for study sheets, classroom handouts, offline reference, and practice packets.",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    learningResourceType: ["Worksheet", "Reference chart"],
    educationalUse: ["Practice", "Classroom activity", "Self-study"],
    teaches:
      "International Morse code letters, numbers, punctuation, spacing, encoding, and decoding",
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Printable Chart",
        item: CANONICAL_URL,
      },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const updateSettings = <Key extends keyof PrintableSettings>(
    key: Key,
    value: PrintableSettings[Key],
  ) => {
    setSettings((current) => mergeSettings({ ...current, [key]: value }));
  };

  const savePresetSnapshot = (
    presetName: PresetName,
    nextSettings: PrintableSettings,
  ) => {
    try {
      const stored = window.localStorage.getItem(PRESETS_STORAGE_KEY);
      const existing = stored ? (JSON.parse(stored) as StoredPresetMap) : {};

      window.localStorage.setItem(
        PRESETS_STORAGE_KEY,
        JSON.stringify({
          ...existing,
          [presetName]: nextSettings,
        }),
      );
    } catch {
      // Ignore storage failure.
    }
  };

  const applyPreset = (
    presetName: PresetName,
    fallbackSettings: PrintableSettings,
  ) => {
    let nextSettings = fallbackSettings;

    try {
      const stored = window.localStorage.getItem(PRESETS_STORAGE_KEY);
      const existing = stored ? (JSON.parse(stored) as StoredPresetMap) : {};
      nextSettings = mergeSettings(existing[presetName] || fallbackSettings);
    } catch {
      nextSettings = fallbackSettings;
    }

    setSettings(nextSettings);
    savePresetSnapshot(presetName, nextSettings);
  };

  const applyBeginnerPreset = () => {
    applyPreset(
      "beginner",
      mergeSettings({
        ...settings,
        worksheetLevel: "beginner",
        customWords: BEGINNER_WORDS.join(", "),
        customSentences: BEGINNER_SENTENCES.join(", "),
        includeNumbers: false,
        includePunctuation: false,
        includeAnswerKey: false,
        decodeAnswerLineCount: 1,
        encodeAnswerLineCount: 1,
        sentenceAnswerLineCount: 1,
        ownMessageTextLineCount: 2,
        ownMessageMorseLineCount: 3,
        teacherFeedbackLineCount: 4,
      }),
    );
  };

  const applyClassroomPreset = () => {
    applyPreset(
      "classroom",
      mergeSettings({
        ...settings,
        worksheetLevel: "standard",
        customWords: DEFAULT_WORDS.join(", "),
        customSentences: DEFAULT_SENTENCES.join(", "),
        directions: DEFAULT_DIRECTIONS,
        includeNumbers: true,
        includePunctuation: true,
        includeAnswerKey: false,
        includeTeacherReview: true,
        includeDirections: true,
        includeBranding: true,
        decodeAnswerLineCount: 1,
        encodeAnswerLineCount: 1,
        sentenceAnswerLineCount: 2,
        ownMessageTextLineCount: 3,
        ownMessageMorseLineCount: 4,
        teacherFeedbackLineCount: 5,
      }),
    );
  };

  const applyChallengePreset = () => {
    applyPreset(
      "challenge",
      mergeSettings({
        ...settings,
        worksheetLevel: "challenge",
        customWords: CHALLENGE_WORDS.join(", "),
        customSentences: CHALLENGE_SENTENCES.join(", "),
        includeNumbers: true,
        includePunctuation: true,
        includeAnswerKey: false,
        includeTeacherReview: true,
        includeDirections: true,
        decodeAnswerLineCount: 1,
        encodeAnswerLineCount: 2,
        sentenceAnswerLineCount: 3,
        ownMessageTextLineCount: 4,
        ownMessageMorseLineCount: 6,
        teacherFeedbackLineCount: 6,
      }),
    );
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);

    try {
      window.localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(DEFAULT_SETTINGS),
      );
    } catch {
      // Ignore storage failure.
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";

      setSettings((current) =>
        mergeSettings({
          ...current,
          customLogoDataUrl: result,
          customLogoName: file.name,
        }),
      );
    };

    reader.readAsDataURL(file);
  };

  const clearCustomLogo = () => {
    setSettings((current) =>
      mergeSettings({
        ...current,
        customLogoDataUrl: "",
        customLogoName: "",
      }),
    );
  };

  const handleDownload = async () => {
    if (isExporting) return;
    setStatusMessage("");

    if (downloadFormat === "pdf") {
      printHtml(printableHtml);
      setStatusMessage("PDF print dialog opened.");
      return;
    }

    setIsExporting(true);

    try {
      await exportPrintableImage(settings, qrCodeDataUrl, downloadFormat);
      setStatusMessage("Download started.");
    } catch {
      setStatusMessage(
        "The image export could not be generated in this browser. Try PDF export or remove uploaded images.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      const message = await sharePrintable({
        title: settings.worksheetTitle || "Printable Morse Code Worksheet",
        url: typeof window !== "undefined" ? window.location.href : CANONICAL_URL,
      });
      if (message) setStatusMessage(message);
    } catch {
      // User cancelled share sheet or browser blocked it. No action needed.
    }
  };

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <style>{`
        .mw-printable-chart-page,
        .mw-printable-chart-page * {
          box-shadow: none !important;
          filter: none !important;
          text-shadow: none !important;
        }

        .input-control,
        .textarea-control,
        .select-control {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          border-radius: 0.9rem;
          background: var(--mw-surface);
          color: var(--mw-input-text);
          font-weight: 700;
          transition:
            background-color 160ms ease;
        }

        .input-control,
        .select-control {
          min-height: 2.75rem;
          padding: 0.75rem 0.9rem;
        }

        .textarea-control {
          min-height: 6.25rem;
          resize: vertical;
          padding: 0.85rem 0.9rem;
          line-height: 1.5;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .textarea-control-large {
          min-height: 7.25rem;
        }

        .select-control {
          cursor: pointer;
        }

        .input-control:hover,
        .textarea-control:hover,
        .select-control:hover {
          background: var(--mw-input-hover-bg);
        }

        .input-control:focus,
        .textarea-control:focus,
        .select-control:focus {
          outline: none;
        }

        .file-control {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          cursor: pointer;
          border-radius: 1rem;
          background: var(--mw-surface);
          padding: 0.85rem;
          color: var(--mw-input-text);
          font-weight: 800;
        }

        .file-control:hover {
          background: var(--mw-input-hover-bg);
        }

        .input-control::placeholder,
        .textarea-control::placeholder {
          color: var(--mw-input-placeholder);
          opacity: 1;
        }

        .content-card {
          min-width: 0;
          border-radius: 1.25rem;
          background: var(--mw-static-quiet-bg);
          padding: 1rem;
        }

        .content-card + .content-card {
          margin-top: 1rem;
        }

        .content-card-title {
          margin: 0;
          color: var(--mw-eyebrow-line);
          font-size: 1rem;
          font-weight: 900;
        }

        .content-card-copy {
          margin-top: 0.35rem;
          color: var(--mw-text-soft);
          font-size: 0.875rem;
          line-height: 1.5;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .safe-text {
          min-width: 0;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        @media print {
          body * {
            visibility: hidden !important;
          }
        }
      `}</style>

      <main className="mw-printable-chart-page" style={styles.wrap}>
        <PageHero
          eyebrow="Printable chart"
          title="Morse Code Printable Chart"
          description="Build a study sheet, classroom handout, or offline Morse reference with chart, worksheet, answer key, PDF, and image export controls."
          aside={
            <DarkNote label="Print defaults" value="PDF">
              <p>Answer keys stay off until you include them.</p>
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "#builder", label: "Build printable", primary: true },
              { href: "/morse-code-chart", label: "Complete chart" },
              { href: "/morse-code-word-search-builder", label: "Word search" },
              { href: "/morse-code-alphabet", label: "Alphabet chart" },
              { href: "/practice", label: "Practice drills" },
            ]}
          />
        </PageHero>

        <section className="hidden">
          <div className="mw-static-panel min-w-0 rounded-xl bg-[#fffdf8]/85 p-4">
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-extrabold uppercase tracking-wide text-sky-800">
                  MorseWords
                </div>
                <p className="mt-1 break-words text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
                  Printable Morse Code Chart and Worksheet Builder
                </p>
                <p className="mt-2 max-w-3xl break-words text-sm leading-relaxed text-slate-600">
                  Create a clean teacher-ready printable with student fields,
                  answer key controls, own-message sections, branding, QR code,
                  sharing, PDF export, and image exports.
                </p>
              </div>

              <div className="mw-static-surface-soft rounded-lg bg-[#fffaf2] px-4 py-2 text-sm font-semibold text-slate-900">
                PDF default · Answer key off by default
              </div>
            </div>
          </div>
        </section>

        <section
          id="builder"
          className="grid min-w-0 items-start gap-5 py-4 lg:grid-cols-[0.88fr_1.12fr]"
        >
          <div className="grid min-w-0 gap-4">
            <section className="mw-static-surface-soft min-w-0 rounded-xl bg-[#fffaf2]/45 p-5">
              <p className="m-0 font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
                Worksheet settings
              </p>
              <h2 className="mt-2 break-words text-2xl font-extrabold text-sky-950">
                Build the printable
              </h2>
              <p className="mt-2 break-words text-sm leading-relaxed text-slate-600">
                Start with a preset, then customize the classroom details,
                practice content, line counts, branding, scoring, and output.
                Settings are saved in this browser.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <QuickButton onClick={applyBeginnerPreset}>Beginner</QuickButton>
                <QuickButton onClick={applyClassroomPreset}>
                  Classroom
                </QuickButton>
                <QuickButton onClick={applyChallengePreset}>
                  Challenge
                </QuickButton>
                <QuickButton onClick={resetSettings}>Reset</QuickButton>
              </div>
            </section>

            <SettingsSection
              title="1. Output"
              description="Choose what the teacher or learner gets when they print or export."
            >
              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                <FormField label="Print format">
                  <select
                    className="select-control"
                    value={settings.printMode}
                    onChange={(event) =>
                      updateSettings(
                        "printMode",
                        event.target.value as PrintMode,
                      )
                    }
                  >
                    <option value="packet">Worksheet + reference guide</option>
                    <option value="worksheet">Worksheet only</option>
                    <option value="chart">Reference guide only</option>
                  </select>
                </FormField>

                <FormField label="Worksheet difficulty">
                  <select
                    className="select-control"
                    value={settings.worksheetLevel}
                    onChange={(event) =>
                      updateSettings(
                        "worksheetLevel",
                        event.target.value as WorksheetLevel,
                      )
                    }
                  >
                    <option value="beginner">Beginner</option>
                    <option value="standard">Standard</option>
                    <option value="challenge">Challenge</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Worksheet title">
                <input
                  className="input-control"
                  value={settings.worksheetTitle}
                  onChange={(event) =>
                    updateSettings("worksheetTitle", event.target.value)
                  }
                  placeholder="Morse Code Practice Sheet"
                  maxLength={90}
                />
              </FormField>
            </SettingsSection>

            <SettingsSection
              title="2. Classroom details"
              description="These fields appear at the top of the worksheet and reference guide."
            >
              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                <FormField label="Student name" description="Optional.">
                  <input
                    className="input-control"
                    value={settings.studentName}
                    onChange={(event) =>
                      updateSettings("studentName", event.target.value)
                    }
                    placeholder="Leave blank for students"
                    maxLength={80}
                  />
                </FormField>

                <FormField label="Date" description="Optional.">
                  <input
                    className="input-control"
                    type="date"
                    value={settings.assignmentDate}
                    onChange={(event) =>
                      updateSettings("assignmentDate", event.target.value)
                    }
                  />
                </FormField>

                <FormField label="Class or group" description="Optional.">
                  <input
                    className="input-control"
                    value={settings.className}
                    onChange={(event) =>
                      updateSettings("className", event.target.value)
                    }
                    placeholder="Class, group, or lesson"
                    maxLength={80}
                  />
                </FormField>

                <FormField label="Teacher name" description="Optional.">
                  <input
                    className="input-control"
                    value={settings.teacherName}
                    onChange={(event) =>
                      updateSettings("teacherName", event.target.value)
                    }
                    placeholder="Teacher or marker"
                    maxLength={80}
                  />
                </FormField>
              </div>

              <FormField
                label="Student directions"
                description="Short instructions printed near the top of the worksheet."
              >
                <textarea
                  className="textarea-control"
                  value={settings.directions}
                  onChange={(event) =>
                    updateSettings("directions", event.target.value)
                  }
                  maxLength={260}
                />
              </FormField>
            </SettingsSection>

            <SettingsSection
              title="3. Practice content"
              description="Use commas to separate items. Sentences stay intact and are not broken into words."
            >
              <div className="content-card">
                <h4 className="content-card-title">Custom words</h4>
                <p className="content-card-copy">
                  Add individual words separated by commas. Example: RADIO,
                  SIGNAL, CODE, MORSE.
                </p>
                <div className="mt-3">
                  <textarea
                    className="textarea-control"
                    value={settings.customWords}
                    onChange={(event) =>
                      updateSettings("customWords", event.target.value)
                    }
                    placeholder="RADIO, SIGNAL, CODE, MORSE"
                    maxLength={300}
                  />
                </div>
                <ContentLimitNote label="Words" stats={wordContentStats} />
              </div>

              <div className="content-card">
                <h4 className="content-card-title">Custom sentences</h4>
                <p className="content-card-copy">
                  Add full sentences separated by commas. Long sentences will
                  print above the answer lines so the layout stays readable.
                </p>
                <div className="mt-3">
                  <textarea
                    className="textarea-control textarea-control-large"
                    value={settings.customSentences}
                    onChange={(event) =>
                      updateSettings("customSentences", event.target.value)
                    }
                    placeholder="SEND HELP, LEARN MORSE, RADIO SIGNAL"
                    maxLength={420}
                  />
                </div>
                <ContentLimitNote label="Sentences" stats={sentenceContentStats} />
              </div>
            </SettingsSection>

            <SettingsSection
              title="4. Line counts"
              description="Control how much writing space each section gets."
            >
              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                <NumberField
                  label="Decode answer lines"
                  value={settings.decodeAnswerLineCount}
                  min={1}
                  max={6}
                  onChange={(value) =>
                    updateSettings("decodeAnswerLineCount", value)
                  }
                />

                <NumberField
                  label="Encode answer lines"
                  value={settings.encodeAnswerLineCount}
                  min={1}
                  max={6}
                  onChange={(value) =>
                    updateSettings("encodeAnswerLineCount", value)
                  }
                />

                <NumberField
                  label="Sentence answer lines"
                  value={settings.sentenceAnswerLineCount}
                  min={1}
                  max={8}
                  onChange={(value) =>
                    updateSettings("sentenceAnswerLineCount", value)
                  }
                />

                <NumberField
                  label="Own message plain text lines"
                  value={settings.ownMessageTextLineCount}
                  min={1}
                  max={12}
                  onChange={(value) =>
                    updateSettings("ownMessageTextLineCount", value)
                  }
                />

                <NumberField
                  label="Own message Morse lines"
                  value={settings.ownMessageMorseLineCount}
                  min={1}
                  max={12}
                  onChange={(value) =>
                    updateSettings("ownMessageMorseLineCount", value)
                  }
                />

                <NumberField
                  label="Teacher feedback lines"
                  value={settings.teacherFeedbackLineCount}
                  min={2}
                  max={12}
                  onChange={(value) =>
                    updateSettings("teacherFeedbackLineCount", value)
                  }
                />
              </div>
            </SettingsSection>

            <SettingsSection
              title="5. Branding"
              description="Use your own brand name and optional logo. The file name is not used as the brand name."
            >
              <FormField
                label="Brand name"
                description={`Defaults to MorseWords. Maximum ${BRAND_NAME_MAX_LENGTH} characters including spaces.`}
              >
                <input
                  className="input-control"
                  value={settings.brandName}
                  onChange={(event) =>
                    updateSettings(
                      "brandName",
                      normalizeBrandName(event.target.value),
                    )
                  }
                  placeholder="MorseWords"
                  maxLength={BRAND_NAME_MAX_LENGTH}
                />
              </FormField>

              <div className="text-xs font-bold text-slate-500">
                {settings.brandName.length}/{BRAND_NAME_MAX_LENGTH} characters
              </div>

              <FormField
                label="Upload custom logo"
                description="PNG, JPG, WEBP, or SVG works best. The logo appears beside the brand name."
              >
                <input
                  className="file-control"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </FormField>

              {settings.customLogoDataUrl ? (
                <div className="mw-static-surface-soft flex min-w-0 items-center justify-between gap-4 rounded-xl bg-[#fffaf2]/70 p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={settings.customLogoDataUrl}
                      alt={
                        settings.customLogoName ||
                        `${getBrandName(settings)} logo preview`
                      }
                      className="h-14 w-14 shrink-0 rounded-xl bg-white object-contain p-1"
                    />
                    <div className="min-w-0">
                      <div className="safe-text text-sm font-black text-sky-800">
                        {getBrandName(settings)}
                      </div>
                      <div className="safe-text text-xs text-slate-600">
                        Logo uploaded. Brand name stays editable above.
                      </div>
                    </div>
                  </div>
                  <ActionButton
                    size="sm"
                    onClick={clearCustomLogo}
                    className="shrink-0 active:scale-95"
                  >
                    Remove
                  </ActionButton>
                </div>
              ) : null}
            </SettingsSection>

            <SettingsSection
              title="6. Sections"
              description="Control what appears on the final printable."
            >
              <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                <ToggleField
                  label="Include student directions"
                  checked={settings.includeDirections}
                  onChange={(checked) =>
                    updateSettings("includeDirections", checked)
                  }
                />
                <ToggleField
                  label="Include numbers"
                  checked={settings.includeNumbers}
                  onChange={(checked) =>
                    updateSettings("includeNumbers", checked)
                  }
                />
                <ToggleField
                  label="Include punctuation"
                  checked={settings.includePunctuation}
                  onChange={(checked) =>
                    updateSettings("includePunctuation", checked)
                  }
                />
                <ToggleField
                  label="Include answer key as the last page"
                  checked={settings.includeAnswerKey}
                  onChange={(checked) =>
                    updateSettings("includeAnswerKey", checked)
                  }
                />
                <ToggleField
                  label="Teacher scoring and feedback"
                  checked={settings.includeTeacherReview}
                  onChange={(checked) =>
                    updateSettings("includeTeacherReview", checked)
                  }
                />
                <ToggleField
                  label="MorseWords QR on reference guide"
                  checked={settings.includeBranding}
                  onChange={(checked) =>
                    updateSettings("includeBranding", checked)
                  }
                />
              </div>
            </SettingsSection>
          </div>

          <LivePreview
            settings={settings}
            qrCodeDataUrl={qrCodeDataUrl}
            downloadFormat={downloadFormat}
            isExporting={isExporting}
            statusMessage={statusMessage}
            onDownloadFormatChange={setDownloadFormat}
            onDownload={handleDownload}
            onShare={handleShare}
          />
        </section>

        <section className="grid gap-4 py-4 md:grid-cols-3">
          <article className="mw-static-tile min-w-0 rounded-2xl bg-[#f7f4ee] p-5">
            <h2 className="m-0 break-words text-xl font-bold text-sky-800">
              Teacher-ready defaults
            </h2>
            <p className="mt-2 break-words text-sm leading-relaxed text-slate-600">
              Student name and date fields are built in, and the answer key is
              off by default so learners do not immediately see the solutions.
            </p>
          </article>

          <article className="mw-static-tile min-w-0 rounded-2xl bg-[#f7f4ee] p-5">
            <h2 className="m-0 break-words text-xl font-bold text-sky-800">
              Cleaner own-message section
            </h2>
            <p className="mt-2 break-words text-sm leading-relaxed text-slate-600">
              Learners now get one area for the original plain text and one area
              for the Morse version so teachers can judge the translation
              properly.
            </p>
          </article>

          <article className="mw-static-tile min-w-0 rounded-2xl bg-[#f7f4ee] p-5">
            <h2 className="m-0 break-words text-xl font-bold text-sky-800">
              PDF and image export
            </h2>
            <p className="mt-2 break-words text-sm leading-relaxed text-slate-600">
              PDF remains the default. Users can still switch to PNG, JPG, JPEG,
              or WEBP when they want image output instead.
            </p>
          </article>
        </section>

        <CharacterGrid
          title="Letters A-Z"
          description="The complete International Morse code alphabet for letters."
          rows={LETTERS}
        />

        <CharacterGrid
          title="Numbers 0-9"
          description="Standard Morse code number patterns for counting, call signs, and exercises."
          rows={NUMBERS}
        />

        <CharacterGrid
          title="Punctuation and characters"
          description="Common punctuation and symbol entries supported by MorseWords."
          rows={PUNCTUATION}
        />

        <section className="pb-8">
          <div className="mw-static-surface-soft min-w-0 rounded-xl bg-[#fffaf2]/45 p-5">
            <h2 className="m-0 break-words text-2xl font-bold text-sky-800">
              How this printable works
            </h2>

            <div className="mt-4 grid min-w-0 gap-4 md:grid-cols-3">
              <div className="min-w-0">
                <h3 className="m-0 break-words text-base font-bold text-slate-900">
                  Add comma-separated content
                </h3>
                <p className="mt-2 break-words text-sm leading-relaxed text-slate-600">
                  Enter words and full sentences with commas between each item.
                  Sentences stay intact in the worksheet.
                </p>
              </div>

              <div className="min-w-0">
                <h3 className="m-0 break-words text-base font-bold text-slate-900">
                  Choose PDF or image
                </h3>
                <p className="mt-2 break-words text-sm leading-relaxed text-slate-600">
                  PDF is the default. Switch the format selector when an image
                  export is better for sharing or saving.
                </p>
              </div>

              <div className="min-w-0">
                <h3 className="m-0 break-words text-base font-bold text-slate-900">
                  Return later
                </h3>
                <p className="mt-2 break-words text-sm leading-relaxed text-slate-600">
                  The browser saves worksheet settings and preset snapshots with
                  localStorage for future visits.
                </p>
              </div>
            </div>
          </div>
        </section>

        <ReferenceSupportSections
          guide={{
            eyebrow: "Teaching export",
            title: "How to use the printable Morse chart",
            description:
              "Use this page when the output needs to leave the screen as a study sheet, class handout, or offline reference.",
            items: [
              {
                title: "Who it is for",
                text: "Teachers, parents, club leaders, and learners who want a printable Morse chart or worksheet for practice away from the live tools.",
              },
              {
                title: "What it includes",
                text: "Choose chart-only, worksheet-only, or a packet with letters, optional numbers, optional punctuation, custom words, answer keys, and export controls.",
              },
              {
                title: "How to use it",
                text: "Pick a preset, trim the chart to the learner's level, add practice words or sentences, then export the version you want to print or share.",
              },
            ],
          }}
          examples={{
            title: "Printable chart scenarios",
            description:
              "These are the main ways the chart supports teaching and self-study.",
            items: [
              {
                title: "Student study sheet",
                morse: "A-Z",
                children: (
                  <p>
                    Print the letter chart first, then pair it with short
                    drills from the{" "}
                    <a
                      href="/morse-code-alphabet"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      Morse code alphabet
                    </a>{" "}
                    page.
                  </p>
                ),
              },
              {
                title: "Classroom handout",
                morse: "SOS, HELP, RADIO",
                children: (
                  <p>
                    Add familiar practice words, leave the answer key off on
                    the student copy, and keep a separate solved packet for
                    review.
                  </p>
                ),
              },
              {
                title: "Offline quick reference",
                morse: "PDF / PNG",
                children: (
                  <p>
                    Export a compact reference before a practice session so the
                    live{" "}
                    <a
                      href="/practice"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      practice tools
                    </a>{" "}
                    can stay focused on recall.
                  </p>
                ),
              },
            ],
          }}
          mistakes={{
            title: "Common printable chart mistakes",
            description:
              "A good handout should match the learner's level and the activity that follows it.",
            items: [
              {
                title: "Printing too much",
                children: (
                  <p>
                    Brand-new learners usually need letters first. Add numbers
                    and punctuation after the A-Z patterns are familiar.
                  </p>
                ),
              },
              {
                title: "Wrong answer-key setting",
                children: (
                  <p>
                    Keep answer keys off for student copies. Turn them on only
                    when you are printing a teacher packet or review sheet.
                  </p>
                ),
              },
              {
                title: "Using it as the only activity",
                children: (
                  <p>
                    A chart helps lookup, but recall grows through practice.
                    Follow the printout with short drills or a puzzle.
                  </p>
                ),
              },
            ],
          }}
          comparison={{
            eyebrow: "Choose an export",
            title: "Printable chart vs word search vs lookup pages",
            description:
              "Use the export page that matches the classroom or study job.",
            items: [
              {
                title: "Printable chart",
                text: "Use this page for static reference sheets, worksheets, answer keys, and printable study packets.",
                href: "/morse-code-printable-chart",
                badge: "Handout",
              },
              {
                title: "Complete chart",
                text: "Use the on-screen chart when you need quick lookup, copy actions, audio checks, and links to detailed reference pages.",
                href: "/morse-code-chart",
                badge: "Lookup",
              },
              {
                title: "Word search builder",
                text: "Use the puzzle builder when you want a printable activity based on custom words.",
                href: "/morse-code-word-search-builder",
                badge: "Puzzle",
              },
              {
                title: "Dictionary",
                text: "Use the dictionary when you need quick on-screen lookup instead of a handout.",
                href: "/dictionary",
                badge: "Lookup",
              },
            ],
          }}
          nextStep={{
            title: "Best next step after printing",
            description:
              "Turn the handout into active recall by pairing it with a short task.",
            links: [
              { href: "/morse-code-word-search-builder", label: "Create a word search", primary: true },
              { href: "/learn-morse-code", label: "Review the learning path" },
              { href: "/practice", label: "Start practice drills" },
              { href: "/dictionary", label: "Open the dictionary" },
            ],
          }}
        />

        <FaqSectionGeneric title="Printable chart FAQ" items={faqItems} />

        <JsonLdScript jsonLd={[jsonLd, breadcrumbJsonLd, faqJsonLd]} />
      </main>
      <BreadcrumbTrail current="Morse Code Printable Chart" />
    </div>
  );
}
