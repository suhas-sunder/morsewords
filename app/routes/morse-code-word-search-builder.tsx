import * as React from "react";
import QRCode from "qrcode";
import type { Route } from "./+types/morse-code-word-search-builder";

import {
  CheckCircleIcon,
  CloseIcon,
  ListIcon,
  PrintIcon,
  QrCodeIcon,
  SearchIcon,
  ShareIcon,
  ShuffleIcon,
  TuneIcon,
  VisibilityIcon,
  VisibilityOffIcon,
  WarningIcon,
} from "~/client/assets/svg/Icons";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import ToolHowItWorks from "~/client/components/shared/ToolHowItWorks";
import { textToMorse } from "~/client/components/shared/morseUtils";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-word-search-builder";
const CANONICAL = canonicalUrl(CANONICAL_PATH);
const DISPLAY_URL = "www.morsewords.com/morse-code-word-search-builder";
const DEFAULT_WORD_SEARCH_SEED = 73051;
const MAX_WORDS = 20;
const MAX_TITLE_LENGTH = 80;
const MAX_INSTRUCTIONS_LENGTH = 220;
const MAX_BRAND_NAME_LENGTH = 42;
const MAX_WORD_SEARCH_INPUT_LENGTH = 700;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type Difficulty = "easy" | "standard" | "challenge";
type PrintMode = "student" | "answerKey";
type PrintSelection = PrintMode | "both";

type Direction = {
  key: string;
  dr: number;
  dc: number;
  label: string;
};

type CellCoordinate = { row: number; col: number };

type ParsedWordSearchInput = {
  words: string[];
  cleanedEntries: number;
  duplicateCount: number;
  skippedEntries: Array<{ raw: string; reason: string }>;
  overflowCount: number;
};

type Placement = {
  word: string;
  morse: string;
  startRow: number;
  startCol: number;
  directionLabel: string;
  cells: CellCoordinate[];
};

type PuzzleResult = {
  grid: string[][];
  placements: Placement[];
  skippedWords: Array<{ word: string; reason: string }>;
  notices: string[];
};

type WordSearchSettings = {
  title: string;
  instructions: string;
  size: number;
  difficulty: Difficulty;
  allowBackwards: boolean;
  showPlainAnswersOnStudentCopy: boolean;
  includeBranding: boolean;
  includeQrCode: boolean;
  brandName: string;
  includeStudentNameLine: boolean;
  includeDateLine: boolean;
};

const DIRECTIONS: Record<string, Direction> = {
  east: { key: "east", dr: 0, dc: 1, label: "Across" },
  south: { key: "south", dr: 1, dc: 0, label: "Down" },
  southeast: { key: "southeast", dr: 1, dc: 1, label: "Diagonal down" },
  northeast: { key: "northeast", dr: -1, dc: 1, label: "Diagonal up" },
  west: { key: "west", dr: 0, dc: -1, label: "Across backward" },
  north: { key: "north", dr: -1, dc: 0, label: "Up" },
  northwest: { key: "northwest", dr: -1, dc: -1, label: "Diagonal up backward" },
  southwest: { key: "southwest", dr: 1, dc: -1, label: "Diagonal down backward" },
};

const faqItems = [
  {
    q: "How does a Morse code word search work?",
    a: "Students read each Morse clue, translate it into a plain word, then find that alphabetic word in the letter grid.",
  },
  {
    q: "Are the plain answers shown on the student copy?",
    a: "No. Plain answers are hidden by default. Teachers can optionally include them on the student copy, or print a separate answered version.",
  },
  {
    q: "Can I make a new puzzle from the same words?",
    a: "Yes. Generate new puzzle keeps your words and settings but changes the seed, placements, and filler letters.",
  },
  {
    q: "What words work best?",
    a: "Use A-Z words with at least two letters. Short and medium words print best, especially for 10 x 10 or 12 x 12 grids.",
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Word Search Builder | Printable Morse Puzzles",
    description:
      "Create printable Morse code word searches with Morse clues, alphabet grids, answer keys, QR branding, and classroom-ready print versions.",
    path: CANONICAL_PATH,
    keywords:
      "morse code word search, morse word search builder, printable morse code puzzle, morse code puzzle maker",
  });
}

export function normalizeWordSearchWord(raw: string) {
  return raw.toUpperCase().replace(/[^A-Z]/g, "");
}

export function parseWordSearchInput(input: string): ParsedWordSearchInput {
  const parts = input
    .split(/[\n,]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const seen = new Set<string>();
  const words: string[] = [];
  const skippedEntries: ParsedWordSearchInput["skippedEntries"] = [];
  let cleanedEntries = 0;
  let duplicateCount = 0;
  let overflowCount = 0;

  for (const raw of parts) {
    const normalized = normalizeWordSearchWord(raw);
    if (normalized !== raw.toUpperCase()) cleanedEntries += 1;

    if (!normalized) {
      skippedEntries.push({
        raw,
        reason: "No A-Z letters were found.",
      });
      continue;
    }

    if (normalized.length < 2) {
      skippedEntries.push({
        raw,
        reason: "Use at least two letters.",
      });
      continue;
    }

    if (seen.has(normalized)) {
      duplicateCount += 1;
      continue;
    }
    seen.add(normalized);

    if (words.length >= MAX_WORDS) {
      overflowCount += 1;
      continue;
    }

    words.push(normalized);
  }

  return { words, cleanedEntries, duplicateCount, skippedEntries, overflowCount };
}

export function createSeededRandom(seed: number) {
  let value = Math.max(1, Math.floor(seed) % 2147483647);
  return () => {
    value = (value * 48271) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function getAllowedDirections({
  difficulty,
  allowBackwards,
}: {
  difficulty: Difficulty;
  allowBackwards: boolean;
}) {
  const base =
    difficulty === "easy"
      ? [DIRECTIONS.east, DIRECTIONS.south]
      : difficulty === "standard"
        ? [
            DIRECTIONS.east,
            DIRECTIONS.south,
            DIRECTIONS.southeast,
            DIRECTIONS.northeast,
          ]
        : [
            DIRECTIONS.east,
            DIRECTIONS.south,
            DIRECTIONS.southeast,
            DIRECTIONS.northeast,
            DIRECTIONS.west,
            DIRECTIONS.north,
            DIRECTIONS.northwest,
            DIRECTIONS.southwest,
          ];

  if (difficulty === "challenge" || !allowBackwards) return base;

  const reverse =
    difficulty === "easy"
      ? [DIRECTIONS.west, DIRECTIONS.north]
      : [DIRECTIONS.west, DIRECTIONS.north, DIRECTIONS.northwest, DIRECTIONS.southwest];

  return [...base, ...reverse];
}

export function canPlaceWord(
  grid: Array<Array<string | null>>,
  word: string,
  row: number,
  col: number,
  direction: Direction,
) {
  const size = grid.length;
  for (let index = 0; index < word.length; index += 1) {
    const nextRow = row + direction.dr * index;
    const nextCol = col + direction.dc * index;
    if (nextRow < 0 || nextRow >= size || nextCol < 0 || nextCol >= size) {
      return false;
    }

    const existing = grid[nextRow][nextCol];
    if (existing && existing !== word[index]) return false;
  }

  return true;
}

export function placeWord(
  grid: Array<Array<string | null>>,
  word: string,
  row: number,
  col: number,
  direction: Direction,
) {
  const cells: CellCoordinate[] = [];
  for (let index = 0; index < word.length; index += 1) {
    const nextRow = row + direction.dr * index;
    const nextCol = col + direction.dc * index;
    grid[nextRow][nextCol] = word[index];
    cells.push({ row: nextRow, col: nextCol });
  }
  return cells;
}

export function fillEmptyCells(
  grid: Array<Array<string | null>>,
  rng: () => number,
) {
  return grid.map((row) =>
    row.map((cell) => cell ?? LETTERS[Math.floor(rng() * LETTERS.length)]),
  );
}

export function getAnswerCells(placements: Placement[]) {
  return new Set(
    placements.flatMap((placement) =>
      placement.cells.map((cell) => `${cell.row}-${cell.col}`),
    ),
  );
}

function shuffleWithRng<T>(items: T[], rng: () => number) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function buildWordSearchPuzzle(options: {
  words: string[];
  size: number;
  difficulty: Difficulty;
  allowBackwards: boolean;
  seed: number;
}): PuzzleResult {
  const { size, seed } = options;
  const rng = createSeededRandom(seed);
  const grid: Array<Array<string | null>> = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null),
  );
  const notices: string[] = [];
  const skippedWords: PuzzleResult["skippedWords"] = [];
  const placements: Placement[] = [];
  const directions = getAllowedDirections(options);

  if (!options.words.length) {
    notices.push("Add at least one valid A-Z word to generate a puzzle.");
    return {
      grid: fillEmptyCells(grid, rng),
      placements,
      skippedWords,
      notices,
    };
  }

  const sortedWords = [...options.words].sort((a, b) => b.length - a.length);

  for (const word of sortedWords) {
    if (word.length > size) {
      skippedWords.push({
        word,
        reason: `${word} is too long for a ${size} x ${size} grid.`,
      });
      continue;
    }

    let placed = false;
    const attemptCount = Math.max(size * size * directions.length * 8, 240);
    for (let attempt = 0; attempt < attemptCount && !placed; attempt += 1) {
      const direction = shuffleWithRng(directions, rng)[0];
      const row = Math.floor(rng() * size);
      const col = Math.floor(rng() * size);

      if (!canPlaceWord(grid, word, row, col, direction)) continue;

      const cells = placeWord(grid, word, row, col, direction);
      placements.push({
        word,
        morse: textToMorse(word),
        startRow: row,
        startCol: col,
        directionLabel: direction.label,
        cells,
      });
      placed = true;
    }

    if (!placed) {
      skippedWords.push({
        word,
        reason: `Could not place ${word} in a ${size} x ${size} grid. Increase the grid size or turn on more directions.`,
      });
    }
  }

  if (skippedWords.some((item) => item.word.length > size)) {
    notices.push("Some words are too long for the current grid and were left out.");
  }

  return {
    grid: fillEmptyCells(grid, rng),
    placements,
    skippedWords,
    notices,
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function makeQrCodeDataUrl() {
  return QRCode.toDataURL(CANONICAL, {
    width: 180,
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#075985", light: "#ffffff" },
  });
}

function buildWordSearchGridHtml(puzzle: PuzzleResult, mode: PrintMode) {
  const answerCells = getAnswerCells(puzzle.placements);
  return `
    <div class="word-grid" style="grid-template-columns: repeat(${puzzle.grid.length}, 1fr); --grid-size: ${puzzle.grid.length}">
      ${puzzle.grid
        .flatMap((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const isAnswer = mode === "answerKey" && answerCells.has(`${rowIndex}-${colIndex}`);
            return `<span class="${isAnswer ? "answer-cell" : ""}">${escapeHtml(letter)}</span>`;
          }),
        )
        .join("")}
    </div>
  `;
}

function buildWordSearchClueListHtml(
  puzzle: PuzzleResult,
  settings: WordSearchSettings,
  mode: PrintMode,
) {
  const showAnswer =
    mode === "answerKey" || settings.showPlainAnswersOnStudentCopy;
  return `
    <ol class="clue-list">
      ${puzzle.placements
        .map(
          (placement) => `
          <li>
            <span class="morse-clue">${escapeHtml(placement.morse)}</span>
            ${showAnswer ? `<strong>${escapeHtml(placement.word)}</strong>` : ""}
          </li>
        `,
        )
        .join("")}
    </ol>
  `;
}

function buildWordSearchAnswerKeyHtml(puzzle: PuzzleResult) {
  if (!puzzle.placements.length) return "";
  return `
    <section class="answer-key">
      <h2>Answer key</h2>
      <div class="answer-list">
        ${puzzle.placements
          .map(
            (placement) => `
              <div>
                <strong>${escapeHtml(placement.word)}</strong>
                <span>Row ${placement.startRow + 1}, column ${placement.startCol + 1} - ${escapeHtml(
                  placement.directionLabel,
                )}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function buildWordSearchPageHtml({
  puzzle,
  settings,
  mode,
  qrCodeDataUrl,
}: {
  puzzle: PuzzleResult;
  settings: WordSearchSettings;
  mode: PrintMode;
  qrCodeDataUrl: string;
}) {
  const showQr = settings.includeBranding && settings.includeQrCode && qrCodeDataUrl;
  return `
    <main class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">${mode === "answerKey" ? "ANSWER SHEET" : "QUESTION SHEET"}</p>
          <h1>${escapeHtml(settings.title)}</h1>
          <p class="instructions">${escapeHtml(settings.instructions)}</p>
          <div class="student-lines">
            ${settings.includeStudentNameLine ? "<span>Name: __________________________</span>" : ""}
            ${settings.includeDateLine ? "<span>Date: _______________</span>" : ""}
          </div>
        </div>
        ${
          settings.includeBranding
            ? `<aside class="brand-panel">
                ${showQr ? `<img src="${escapeHtml(qrCodeDataUrl)}" alt="QR code linking to MorseWords" />` : ""}
                <strong>${escapeHtml(settings.brandName || "MorseWords")}</strong>
                <span>${DISPLAY_URL}</span>
              </aside>`
            : ""
        }
      </header>

      <section class="clues">
        <h2>Morse clues</h2>
        ${buildWordSearchClueListHtml(puzzle, settings, mode)}
      </section>

      ${buildWordSearchGridHtml(puzzle, mode)}
      ${mode === "answerKey" ? buildWordSearchAnswerKeyHtml(puzzle) : ""}
    </main>
  `;
}

function buildWordSearchPrintHtml({
  puzzle,
  settings,
  mode,
  qrCodeDataUrl,
}: {
  puzzle: PuzzleResult;
  settings: WordSearchSettings;
  mode: PrintSelection;
  qrCodeDataUrl: string;
}) {
  const modes: PrintMode[] = mode === "both" ? ["student", "answerKey"] : [mode];
  const titleSuffix =
    mode === "both" ? "Question and Answer Sheets" : mode === "answerKey" ? "Answer Key" : "Question Sheet";
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(settings.title)} - ${titleSuffix}</title>
  <style>
    @page { size: letter; margin: 0.32in; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: #111317;
      font-family: Arial, Helvetica, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page { max-width: 7.85in; margin: 0 auto; }
    .page + .page { break-before: page; page-break-before: always; }
    .page-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 16px;
      align-items: start;
    }
    .brand-panel {
      display: grid;
      justify-items: end;
      gap: 4px;
      min-width: 1.2in;
      color: #475569;
      font-size: 9px;
      line-height: 1.2;
      text-align: right;
      overflow-wrap: anywhere;
    }
    .brand-panel strong {
      color: #082f49;
      font-size: 10px;
    }
    .brand-panel img {
      width: 0.72in;
      height: 0.72in;
      border: 1px solid #cbd5e1;
      border-radius: 7px;
      padding: 3px;
      background: #ffffff;
    }
    .eyebrow {
      margin: 0;
      color: #075985;
      font: 700 10px/1.4 "Courier New", monospace;
      letter-spacing: 0.16em;
    }
    h1 { margin: 6px 0 6px; color: #082f49; font-size: 25px; line-height: 1.08; }
    h2 { margin: 0 0 7px; color: #082f49; font-size: 14px; }
    .instructions { margin: 0; color: #334155; font-size: 11px; line-height: 1.35; }
    .student-lines {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      margin-top: 10px;
      color: #334155;
      font-size: 11px;
    }
    .clues {
      margin-top: 12px;
      border: 1px solid #cbd5e1;
      border-radius: 9px;
      padding: 10px;
      break-inside: avoid;
    }
    .clue-list {
      columns: 2;
      column-gap: 18px;
      margin: 0;
      padding-left: 18px;
      font-size: 10px;
    }
    .clue-list li { margin: 0 0 5px; break-inside: avoid; }
    .morse-clue {
      display: inline-block;
      min-width: 125px;
      font: 700 10.5px/1.18 "Courier New", monospace;
      letter-spacing: 0.06em;
    }
    .word-grid {
      display: grid;
      gap: 2px;
      margin: 12px auto 0;
      width: min(100%, 6.45in);
      break-inside: avoid;
    }
    .word-grid span {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #94a3b8;
      border-radius: 3px;
      font-family: "Courier New", monospace;
      font-weight: 800;
      font-size: clamp(7px, calc(14px - var(--grid-size) * 0.18px), 12px);
      line-height: 1;
      color: #0f172a;
    }
    .word-grid .answer-cell {
      background: #dbeafe;
      border: 2px solid #075985;
      color: #082f49;
    }
    .answer-key {
      margin-top: 12px;
      border-top: 1px solid #cbd5e1;
      padding-top: 10px;
      break-inside: avoid;
    }
    .answer-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 5px 12px;
      font-size: 10px;
    }
    .answer-list div { display: flex; justify-content: space-between; gap: 8px; }
  </style>
</head>
<body>
  ${modes
    .map((pageMode) => buildWordSearchPageHtml({ puzzle, settings, mode: pageMode, qrCodeDataUrl }))
    .join("")}
</body>
</html>`;
}

function printHtml(html: string) {
  const existingFrame = document.getElementById("morse-word-search-print-frame");
  if (existingFrame) existingFrame.remove();

  const iframe = document.createElement("iframe");
  iframe.id = "morse-word-search-print-frame";
  iframe.title = "Printable Morse code word search";
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
    return false;
  }

  iframeDocument.open();
  iframeDocument.write(html);
  iframeDocument.close();

  const printFrame = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    window.setTimeout(() => iframe.remove(), 1000);
  };

  iframe.onload = printFrame;
  window.setTimeout(printFrame, 250);
  return true;
}

function drawRoundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3,
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(nextLine).width <= maxWidth) {
      currentLine = nextLine;
      continue;
    }

    if (currentLine) lines.push(currentLine);
    currentLine = word;
    if (lines.length >= maxLines) break;
  }

  if (currentLine && lines.length < maxLines) lines.push(currentLine);

  lines.slice(0, maxLines).forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function renderWordSearchShareImage({
  puzzle,
  settings,
  qrCodeDataUrl,
}: {
  puzzle: PuzzleResult;
  settings: WordSearchSettings;
  qrCodeDataUrl: string;
}) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not supported in this browser.");

  context.fillStyle = "#f8fafc";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#ffffff";
  drawRoundRect(context, 64, 52, 1072, 526, 30);
  context.fill();
  context.strokeStyle = "#cbd5e1";
  context.lineWidth = 2;
  context.stroke();

  context.fillStyle = "#075985";
  context.fillRect(108, 112, 54, 3);
  context.font = "700 20px Courier New, monospace";
  context.fillText("MORSEWORDS PUZZLE", 184, 122);

  context.fillStyle = "#082f49";
  context.font = "900 58px Arial, Helvetica, sans-serif";
  drawWrappedText(context, settings.title, 108, 198, 680, 62, 2);

  context.fillStyle = "#334155";
  context.font = "400 26px Arial, Helvetica, sans-serif";
  drawWrappedText(
    context,
    "Decode the Morse clues, then find each answer in the letter grid.",
    108,
    330,
    700,
    34,
    2,
  );

  const stats = [
    `${puzzle.placements.length} words`,
    `${settings.size} x ${settings.size} grid`,
    settings.difficulty,
  ];
  stats.forEach((stat, index) => {
    const x = 108 + index * 210;
    context.fillStyle = "#e0f2fe";
    drawRoundRect(context, x, 422, 178, 54, 18);
    context.fill();
    context.fillStyle = "#082f49";
    context.font = "700 21px Arial, Helvetica, sans-serif";
    context.fillText(stat, x + 22, 456);
  });

  context.fillStyle = "#111317";
  drawRoundRect(context, 820, 108, 236, 236, 24);
  context.fill();

  context.fillStyle = "#f8fafc";
  context.font = "700 18px Courier New, monospace";
  context.fillText("SAMPLE CLUES", 850, 154);
  context.font = "700 21px Courier New, monospace";
  puzzle.placements.slice(0, 4).forEach((placement, index) => {
    context.fillText(placement.morse.slice(0, 20), 850, 198 + index * 36);
  });

  if (qrCodeDataUrl) {
    const qrImage = await loadImage(qrCodeDataUrl);
    context.fillStyle = "#ffffff";
    drawRoundRect(context, 878, 376, 118, 118, 18);
    context.fill();
    context.drawImage(qrImage, 888, 386, 98, 98);
  }

  context.fillStyle = "#475569";
  context.font = "700 20px Arial, Helvetica, sans-serif";
  context.fillText(DISPLAY_URL, 740, 538);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("The share image could not be generated in this browser."));
    }, "image/png");
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function MorseCodeWordSearchBuilder() {
  const [title, setTitle] = React.useState("Morse Code Word Search");
  const [instructions, setInstructions] = React.useState(
    "Translate each Morse clue into a word, then find that word in the letter grid.",
  );
  const [input, setInput] = React.useState(
    "MORSE\nSIGNAL\nRADIO\nTEACHER\nPRACTICE\nCOPY\nAUDIO\nLIGHT",
  );
  const [size, setSize] = React.useState(12);
  const [difficulty, setDifficulty] = React.useState<Difficulty>("standard");
  const [allowBackwards, setAllowBackwards] = React.useState(false);
  const [showPlainAnswersOnStudentCopy, setShowPlainAnswersOnStudentCopy] =
    React.useState(false);
  const [showAnswerKey, setShowAnswerKey] = React.useState(false);
  const [printSelection, setPrintSelection] =
    React.useState<PrintSelection>("student");
  const [includeBranding, setIncludeBranding] = React.useState(true);
  const [includeQrCode, setIncludeQrCode] = React.useState(true);
  const [brandName, setBrandName] = React.useState("MorseWords");
  const [includeStudentNameLine, setIncludeStudentNameLine] =
    React.useState(true);
  const [includeDateLine, setIncludeDateLine] = React.useState(true);
  const [puzzleSeed, setPuzzleSeed] = React.useState(DEFAULT_WORD_SEARCH_SEED);
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState("");
  const [status, setStatus] = React.useState<{
    kind: "info" | "error" | "ok";
    message: string;
  } | null>(null);
  const [isSharing, setIsSharing] = React.useState(false);

  const parsed = React.useMemo(() => parseWordSearchInput(input), [input]);
  const settings = React.useMemo<WordSearchSettings>(
    () => ({
      title: title.trim().slice(0, MAX_TITLE_LENGTH) || "Morse Code Word Search",
      instructions:
        instructions.trim().slice(0, MAX_INSTRUCTIONS_LENGTH) ||
        "Translate each Morse clue into a word, then find that word in the letter grid.",
      size,
      difficulty,
      allowBackwards,
      showPlainAnswersOnStudentCopy,
      includeBranding,
      includeQrCode,
      brandName: brandName.trim().slice(0, MAX_BRAND_NAME_LENGTH) || "MorseWords",
      includeStudentNameLine,
      includeDateLine,
    }),
    [
      title,
      instructions,
      size,
      difficulty,
      allowBackwards,
      showPlainAnswersOnStudentCopy,
      includeBranding,
      includeQrCode,
      brandName,
      includeStudentNameLine,
      includeDateLine,
    ],
  );
  const puzzle = React.useMemo(
    () =>
      buildWordSearchPuzzle({
        words: parsed.words,
        size,
        difficulty,
        allowBackwards,
        seed: puzzleSeed,
      }),
    [allowBackwards, difficulty, parsed.words, puzzleSeed, size],
  );
  const answerCells = React.useMemo(
    () => getAnswerCells(puzzle.placements),
    [puzzle.placements],
  );

  React.useEffect(() => {
    let isMounted = true;
    makeQrCodeDataUrl()
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

  function updatePuzzleInput(next: string) {
    setInput(next.slice(0, MAX_WORD_SEARCH_INPUT_LENGTH));
    setShowAnswerKey(false);
    setStatus(null);
  }

  function updateSize(next: number) {
    setSize(next);
    setShowAnswerKey(false);
    setStatus(null);
  }

  function updateDifficulty(next: Difficulty) {
    setDifficulty(next);
    setShowAnswerKey(false);
    setStatus(null);
  }

  function updateBackwards(next: boolean) {
    setAllowBackwards(next);
    setShowAnswerKey(false);
    setStatus(null);
  }

  function generateNewPuzzle() {
    setPuzzleSeed(Date.now());
    setShowAnswerKey(false);
    setStatus({
      kind: "ok",
      message: "Generated a new puzzle layout from the same words and settings.",
    });
  }

  function toggleAnswerKey() {
    setShowAnswerKey((value) => {
      const next = !value;
      if (next) setPrintSelection("answerKey");
      return next;
    });
    setStatus(null);
  }

  function printPuzzle(mode: PrintSelection) {
    if (!puzzle.placements.length) {
      setStatus({
        kind: "error",
        message: "Add at least one valid A-Z word to generate a puzzle.",
      });
      return;
    }

    const ok = printHtml(
      buildWordSearchPrintHtml({
        puzzle,
        settings,
        mode,
        qrCodeDataUrl,
      }),
    );

    setStatus(
      ok
        ? {
            kind: "ok",
            message:
              mode === "student"
                ? "Question sheet print view opened."
                : mode === "answerKey"
                  ? "Answer sheet print view opened."
                  : "Question and answer print view opened.",
          }
        : {
            kind: "error",
            message: "Print could not start in this browser. Try again from the page controls.",
          },
    );
  }

  async function sharePuzzle() {
    if (!puzzle.placements.length) {
      setStatus({
        kind: "error",
        message: "Add at least one valid A-Z word to generate a puzzle.",
      });
      return;
    }

    setIsSharing(true);
    setStatus(null);

    try {
      const blob = await renderWordSearchShareImage({
        puzzle,
        settings,
        qrCodeDataUrl,
      });
      const filename = `${settings.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 48) || "morse-code-word-search"}.png`;
      const file = new File([blob], filename, { type: "image/png" });
      const shareText =
        "Create a printable Morse code word search with Morse clues, answer keys, and classroom-ready QR branding.";

      if (
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          title: settings.title,
          text: shareText,
          url: CANONICAL,
          files: [file],
        });
        setStatus({ kind: "ok", message: "Share sheet opened with a puzzle preview image." });
      } else if (navigator.share) {
        await navigator.share({
          title: settings.title,
          text: shareText,
          url: CANONICAL,
        });
        setStatus({ kind: "ok", message: "Share sheet opened." });
      } else {
        downloadBlob(blob, filename);
        await navigator.clipboard?.writeText(CANONICAL);
        setStatus({
          kind: "ok",
          message: "Share image downloaded and the page link was copied.",
        });
      }
    } catch (error) {
      const wasCancelled =
        error instanceof DOMException && error.name === "AbortError";
      if (!wasCancelled) {
        setStatus({
          kind: "error",
          message:
            "The share image could not be generated in this browser. Try printing the puzzle or copying the page link.",
        });
      }
    } finally {
      setIsSharing(false);
    }
  }

  const notices = [
    parsed.cleanedEntries
      ? `Unsupported characters were removed from ${parsed.cleanedEntries} ${
          parsed.cleanedEntries === 1 ? "entry" : "entries"
        }.`
      : "",
    parsed.overflowCount
      ? `Only the first ${MAX_WORDS} valid unique words are used. ${parsed.overflowCount} extra ${
          parsed.overflowCount === 1 ? "word was" : "words were"
        } left out.`
      : "",
    parsed.duplicateCount
      ? `${parsed.duplicateCount} duplicate ${
          parsed.duplicateCount === 1 ? "word was" : "words were"
        } ignored.`
      : "",
    ...parsed.skippedEntries.map((entry) => `${entry.raw}: ${entry.reason}`),
    ...puzzle.notices,
    ...puzzle.skippedWords.map((item) => item.reason),
  ].filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Morse Code Word Search Builder",
    url: CANONICAL,
    applicationCategory: "EducationalApplication",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
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

  return (
    <div style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Printable puzzle"
          title="Morse code word search builder"
          description="Create a classroom-ready Morse word search where the clues are Morse code and the grid is alphabet letters. Print a student copy, reveal the solved grid, or print a separate answer key."
          aside={
            <DarkNote
              label="Puzzle status"
              value={`${puzzle.placements.length}/${parsed.words.length || 0} PLACED`}
            >
              Clues print in Morse. Plain answer words stay hidden unless you
              choose to show them or print the answered version.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              {
                href: "/morse-code-word-trainer",
                label: "Word trainer",
                primary: true,
              },
              { href: "/morse-code-printable-chart", label: "Worksheet builder" },
              { href: "/morse-code-alphabet", label: "Alphabet chart" },
            ]}
          />
        </PageHero>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-[#fffaf2] px-5 py-5 sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-sky-800" />
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
                    Puzzle builder
                  </span>
                </div>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950">
                  Build, preview, and print
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <ToolButton onClick={generateNewPuzzle} icon={<ShuffleIcon size={18} title="Generate new puzzle" />} primary>
                  Generate new puzzle
                </ToolButton>
                <ToolButton
                  onClick={toggleAnswerKey}
                  icon={
                    showAnswerKey ? (
                      <VisibilityOffIcon size={18} title="Hide answer" />
                    ) : (
                      <VisibilityIcon size={18} title="Reveal answer" />
                    )
                  }
                >
                  {showAnswerKey ? "Hide answer" : "Reveal answer"}
                </ToolButton>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-5">
              {[
                ["Valid words", parsed.words.length],
                ["Placed", puzzle.placements.length],
                ["Skipped", puzzle.skippedWords.length + parsed.skippedEntries.length],
                ["Grid", `${size} x ${size}`],
                ["Difficulty", difficulty],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    {label}
                  </p>
                  <p className="mt-1 text-lg font-black capitalize text-sky-950">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="space-y-4">
              <ControlGroup
                icon={<ListIcon size={18} title="Word list" />}
                title="Word list"
              >
                <label className="block">
                  <span className="text-sm font-extrabold text-sky-950">
                    Plain words
                  </span>
                  <textarea
                    value={input}
                    maxLength={MAX_WORD_SEARCH_INPUT_LENGTH}
                    onChange={(event) => updatePuzzleInput(event.target.value)}
                    className="mt-2 min-h-48 w-full rounded-xl border border-slate-200 bg-white p-4 font-mono text-base outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    spellCheck={false}
                  />
                </label>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Use A-Z words separated by commas or new lines. Numbers and
                  punctuation are removed from puzzle words. Up to {MAX_WORDS} unique
                  words and {MAX_WORD_SEARCH_INPUT_LENGTH} characters are used.
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {input.length}/{MAX_WORD_SEARCH_INPUT_LENGTH} characters -{" "}
                  {parsed.words.length}/{MAX_WORDS} valid words
                </p>
              </ControlGroup>

              <ControlGroup
                icon={<SearchIcon size={18} title="Puzzle details" />}
                title="Puzzle details"
              >
                <label className="block">
                  <span className="text-sm font-extrabold text-sky-950">
                    Title
                  </span>
                  <input
                    value={title}
                    maxLength={MAX_TITLE_LENGTH}
                    onChange={(event) => setTitle(event.target.value)}
                    className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-semibold outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </label>
                <label className="mt-3 block">
                  <span className="text-sm font-extrabold text-sky-950">
                    Instructions
                  </span>
                  <textarea
                    value={instructions}
                    maxLength={MAX_INSTRUCTIONS_LENGTH}
                    onChange={(event) => setInstructions(event.target.value)}
                    className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </label>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {instructions.length}/{MAX_INSTRUCTIONS_LENGTH} characters
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <CheckToggle
                    label="Name line"
                    checked={includeStudentNameLine}
                    onChange={setIncludeStudentNameLine}
                  />
                  <CheckToggle
                    label="Date line"
                    checked={includeDateLine}
                    onChange={setIncludeDateLine}
                  />
                </div>
              </ControlGroup>

              <ControlGroup
                icon={<TuneIcon size={18} title="Grid settings" />}
                title="Grid and difficulty"
              >
                <label className="block">
                  <span className="flex items-center justify-between gap-3 text-sm font-extrabold text-sky-950">
                    Grid size
                    <span className="font-mono text-slate-600">
                      {size} x {size}
                    </span>
                  </span>
                  <input
                    type="range"
                    min={10}
                    max={20}
                    value={size}
                    onChange={(event) => updateSize(Number(event.target.value))}
                    style={{ accentColor: "#38bdf8" }}
                    className="mt-3 w-full cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-sky-300"
                  />
                </label>
                <div className="mt-4 grid gap-2">
                  {(["easy", "standard", "challenge"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateDifficulty(option)}
                      className={
                        "min-h-11 cursor-pointer rounded-lg border px-3 py-2 text-left text-sm font-semibold capitalize transition focus:outline-none focus:ring-2 focus:ring-sky-300 " +
                        (difficulty === option
                          ? "border-slate-950 bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
                          : "border-slate-200 bg-white text-slate-900 hover:border-sky-300 hover:bg-sky-50")
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <CheckToggle
                  label="Allow backwards words"
                  checked={allowBackwards}
                  onChange={updateBackwards}
                  className="mt-3"
                />
              </ControlGroup>

              <ControlGroup
                icon={<VisibilityIcon size={18} title="Answers" />}
                title="Answers and print"
              >
                <CheckToggle
                  label="Show plain answers on student copy"
                  checked={showPlainAnswersOnStudentCopy}
                  onChange={setShowPlainAnswersOnStudentCopy}
                />
                <div className="mt-3" role="radiogroup" aria-label="Print output">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    Print output
                  </p>
                  <div className="grid gap-2">
                    {[
                      ["student", "Question sheet"],
                      ["answerKey", "Answer sheet"],
                      ["both", "Question + answer"],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setPrintSelection(value as PrintSelection)}
                        className={
                          "min-h-10 cursor-pointer rounded-lg border px-3 py-2 text-left text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-300 " +
                          (printSelection === value
                            ? "border-slate-950 bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
                            : "border-slate-200 bg-white text-slate-900 hover:border-sky-300 hover:bg-sky-50")
                        }
                        aria-pressed={printSelection === value}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-3 grid gap-2">
                  <ToolButton
                    onClick={() => printPuzzle(printSelection)}
                    icon={<PrintIcon size={18} title="Print selected output" />}
                    disabled={!puzzle.placements.length}
                    primary
                  >
                    Print selected output
                  </ToolButton>
                  <ToolButton
                    onClick={sharePuzzle}
                    icon={<ShareIcon size={18} title="Share puzzle" />}
                    disabled={!puzzle.placements.length || isSharing}
                  >
                    {isSharing ? "Preparing share" : "Share puzzle"}
                  </ToolButton>
                </div>
              </ControlGroup>

              <ControlGroup
                icon={<QrCodeIcon size={18} title="Branding and QR" />}
                title="Branding and QR"
              >
                <CheckToggle
                  label="Include MorseWords branding"
                  checked={includeBranding}
                  onChange={setIncludeBranding}
                />
                <CheckToggle
                  label="Include QR code"
                  checked={includeQrCode}
                  onChange={setIncludeQrCode}
                  className="mt-2"
                />
                <label className="mt-3 block">
                  <span className="text-sm font-extrabold text-sky-950">
                    Brand name
                  </span>
                  <input
                    value={brandName}
                    maxLength={MAX_BRAND_NAME_LENGTH}
                    onChange={(event) => setBrandName(event.target.value)}
                    className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-semibold outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </label>
              </ControlGroup>

              {status ? (
                <StatusNotice kind={status.kind}>{status.message}</StatusNotice>
              ) : null}

              {notices.length ? (
                <div className="rounded-xl border border-slate-200 bg-[#fffdf8] p-3 text-sm leading-relaxed text-slate-700">
                  <div className="flex items-center gap-2 font-extrabold text-sky-950">
                    <WarningIcon size={18} title="Puzzle notices" />
                    Puzzle notices
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {notices.map((notice) => (
                      <li key={notice}>{notice}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>

            <WordSearchPreview
              puzzle={puzzle}
              settings={settings}
              answerCells={answerCells}
              showAnswerKey={showAnswerKey}
              qrCodeDataUrl={qrCodeDataUrl}
            />
          </div>
        </section>

        <ToolHowItWorks
          eyebrow="Puzzle spec"
          title="How this Morse code word search works"
          description="This builder makes a Morse-specific puzzle: clues are Morse code, the grid is alphabet letters, and students solve it by translating each clue before searching the grid."
          referenceLabel="Student task"
          referenceValue="-- --- .-. ... ."
          referenceText="Translate the clue first, then find MORSE in the letter grid."
          chips={[
            { label: "Clues", href: "#word-search-clues" },
            { label: "Grid", href: "#word-search-grid" },
            { label: "Difficulty", href: "#word-search-difficulty" },
            { label: "Printing", href: "#word-search-printing" },
          ]}
          summary={[
            {
              title: "Morse clues",
              text: "The clue list uses dots and dashes instead of plain answer words.",
            },
            {
              title: "Alphabet grid",
              text: "The grid stays A-Z only, so students must decode before searching.",
            },
            {
              title: "Teacher key",
              text: "Reveal or print the answered version with highlighted cells and placements.",
            },
          ]}
          details={[
            {
              kicker: "Decode first",
              title: "Clues",
              text: "Students translate each Morse clue into a word, then search for that word in the grid. This makes the activity useful Morse practice instead of a plain vocabulary puzzle.",
            },
            {
              kicker: "Letter search",
              title: "Grid",
              text: "The board contains alphabet letters only. Unsupported characters are removed from the source words, and words that do not fit are reported instead of being silently cut off.",
            },
            {
              kicker: "Placement rules",
              title: "Difficulty",
              text: "Easy uses across and down words. Standard adds diagonals. Challenge includes reverse directions. Larger grids make long words easier to place and easier to read in print.",
            },
            {
              kicker: "Classroom copies",
              title: "Printing",
              text: "Print the student copy without answers, or print an answered version with highlighted cells and a placement table. Branding and QR controls stay local to the browser.",
            },
          ]}
        />

        <SectionCard
          eyebrow="Teaching flow"
          title="Pair word searches with real Morse practice"
          description="Use the puzzle as a warm-up, station activity, homework sheet, sub plan, or review task, then connect the same words to active practice."
        >
          <div className="space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
            <p>
              For beginners, start with the{" "}
              <a className="font-semibold text-sky-900 underline hover:no-underline" href="/morse-code-alphabet">
                Morse code alphabet
              </a>{" "}
              and a short grid. For classroom review, paste vocabulary into the{" "}
              <a className="font-semibold text-sky-900 underline hover:no-underline" href="/morse-code-word-trainer">
                word trainer
              </a>{" "}
              first, then turn those same words into a printable puzzle.
            </p>
            <p>
              If students need listening practice, send the word list into{" "}
              <a className="font-semibold text-sky-900 underline hover:no-underline" href="/morse-code-audio-practice">
                audio practice
              </a>
              . If they need a printable reference or answer sheet, use the{" "}
              <a className="font-semibold text-sky-900 underline hover:no-underline" href="/morse-code-printable-chart">
                printable worksheet builder
              </a>
              . For a longer routine, fold the puzzle into the{" "}
              <a className="font-semibold text-sky-900 underline hover:no-underline" href="/morse-code-practice-plan">
                Morse code practice plan
              </a>
              .
            </p>
          </div>
        </SectionCard>

        <FaqSectionGeneric title="Word search FAQ" items={faqItems} />

        <JsonLdScript jsonLd={[jsonLd, faqJsonLd]} />
      </main>
    </div>
  );
}

function WordSearchPreview({
  puzzle,
  settings,
  answerCells,
  showAnswerKey,
  qrCodeDataUrl,
}: {
  puzzle: PuzzleResult;
  settings: WordSearchSettings;
  answerCells: Set<string>;
  showAnswerKey: boolean;
  qrCodeDataUrl: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[#fffdf8] p-4 shadow-inner">
      <article className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
              {showAnswerKey ? "Answered preview" : "Student preview"}
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-sky-950">
              {settings.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {settings.instructions}
            </p>
          </div>
          {settings.includeBranding && settings.includeQrCode && qrCodeDataUrl ? (
            <img
              src={qrCodeDataUrl}
              alt="QR code to MorseWords"
              className="h-16 w-16 rounded-xl border border-slate-200 bg-white p-1"
            />
          ) : null}
        </div>

        {(settings.includeStudentNameLine || settings.includeDateLine) ? (
          <div className="mt-4 flex flex-wrap justify-between gap-3 border-b border-slate-100 pb-4 text-sm font-semibold text-slate-500">
            {settings.includeStudentNameLine ? (
              <span>Name: __________________________</span>
            ) : null}
            {settings.includeDateLine ? <span>Date: _______________</span> : null}
          </div>
        ) : null}

        <section className="mt-5 rounded-xl border border-slate-200 bg-[#fffdf8] p-4">
          <h3 className="text-lg font-extrabold text-sky-950">Morse clues</h3>
          {puzzle.placements.length ? (
            <ol className="mt-3 grid gap-2 pl-5 md:grid-cols-2">
              {puzzle.placements.map((placement) => (
                <li key={placement.word} className="break-inside-avoid">
                  <span className="font-mono text-sm font-bold tracking-[0.12em] text-slate-950">
                    {placement.morse}
                  </span>
                  {(showAnswerKey || settings.showPlainAnswersOnStudentCopy) ? (
                    <span className="ml-2 font-extrabold text-sky-950">
                      {placement.word}
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-sm text-slate-600">
              Add at least one valid A-Z word to generate clues.
            </p>
          )}
        </section>

        <div
          className="mt-5 grid gap-1"
          style={{ gridTemplateColumns: `repeat(${settings.size}, minmax(0, 1fr))` }}
        >
          {puzzle.grid.flatMap((row, rowIndex) =>
            row.map((letter, colIndex) => {
              const key = `${rowIndex}-${colIndex}`;
              const isAnswer = showAnswerKey && answerCells.has(key);
              return (
                <span
                  key={key}
                  className={
                    "flex aspect-square items-center justify-center rounded border font-mono text-xs font-black sm:text-sm " +
                    (isAnswer
                      ? "border-sky-800 bg-sky-100 text-sky-950 ring-1 ring-sky-700"
                      : "border-slate-200 bg-white text-slate-950")
                  }
                >
                  {letter}
                </span>
              );
            }),
          )}
        </div>

        {showAnswerKey && puzzle.placements.length ? (
          <section className="mt-5 rounded-xl border border-slate-200 bg-[#f7fbff] p-4">
            <h3 className="text-lg font-extrabold text-sky-950">Answer key</h3>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              {puzzle.placements.map((placement) => (
                <div
                  key={placement.word}
                  className="flex justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
                >
                  <strong>{placement.word}</strong>
                  <span className="text-slate-600">
                    R{placement.startRow + 1}, C{placement.startCol + 1} -{" "}
                    {placement.directionLabel}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {settings.includeBranding ? (
          <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-500">
            <div>
              <strong className="text-sky-950">
                {settings.brandName || "MorseWords"}
              </strong>
              <p>{DISPLAY_URL}</p>
            </div>
            {settings.includeQrCode ? (
              <span className="inline-flex items-center gap-2 font-semibold">
                <QrCodeIcon size={16} title="QR code" />
                QR links to MorseWords
              </span>
            ) : null}
          </footer>
        ) : null}
      </article>
    </div>
  );
}

function ControlGroup({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-[#fffdf8] p-4">
      <div className="flex items-center gap-2 text-sky-950">
        {icon}
        <h3 className="text-lg font-extrabold">{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function CheckToggle({
  label,
  checked,
  onChange,
  className = "",
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={
        "flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-300 " +
        (checked
          ? "border-slate-950 bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
          : "border-slate-200 bg-white text-slate-900 hover:border-sky-300 hover:bg-sky-50") +
        " " +
        className
      }
      aria-pressed={checked}
    >
      <span>{label}</span>
      {checked ? (
        <CheckCircleIcon size={18} title={`${label} enabled`} />
      ) : (
        <CloseIcon size={18} title={`${label} disabled`} />
      )}
    </button>
  );
}

function ToolButton({
  children,
  icon,
  onClick,
  primary,
  disabled,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-50 " +
        (primary
          ? "border-slate-950 bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
          : "border-slate-200 bg-white text-slate-900 hover:border-sky-300 hover:bg-sky-50")
      }
    >
      {icon}
      {children}
    </button>
  );
}

function StatusNotice({
  kind,
  children,
}: {
  kind: "info" | "error" | "ok";
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "flex gap-3 rounded-xl border p-3 text-sm font-semibold leading-relaxed " +
        (kind === "error"
          ? "border-slate-200 bg-[#fffdf8] text-slate-700"
          : kind === "ok"
            ? "border-sky-200 bg-sky-50 text-sky-950"
            : "border-slate-200 bg-white text-slate-700")
      }
    >
      {kind === "ok" ? (
        <CheckCircleIcon size={18} title="Success" className="shrink-0" />
      ) : (
        <WarningIcon size={18} title="Notice" className="shrink-0 text-sky-900" />
      )}
      <p>{children}</p>
    </div>
  );
}
