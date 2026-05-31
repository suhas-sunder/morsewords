import { expect, test } from "@playwright/test";

import {
  buildWordSearchPrintHtml,
  buildWordSearchPuzzle,
  parseWordSearchInput,
} from "../../app/routes/morse-code-word-search-builder";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const PRINT_SETTINGS = {
  allowBackwards: false,
  brandName: "MorseWords",
  difficulty: "standard" as const,
  includeBranding: true,
  includeDateLine: true,
  includeQrCode: false,
  includeStudentNameLine: true,
  instructions: "Translate each Morse clue, then find the answer in the grid.",
  showPlainAnswersOnStudentCopy: false,
  size: 12,
  title: "Morse Code Word Search",
};

test.describe("word search builder helpers", () => {
  test("normalizes lowercase, repeated, spaced, and punctuated word input", () => {
    const parsed = parseWordSearchInput(
      "morse, MORSE, radio!, c o d e\nA\n123\ncopy\tbook",
    );

    expect(parsed.words).toEqual(["MORSE", "RADIO", "CODE", "COPYBOOK"]);
    expect(parsed.duplicateCount).toBe(1);
    expect(parsed.cleanedEntries).toBeGreaterThanOrEqual(1);
    expect(parsed.skippedEntries).toEqual([
      { raw: "A", reason: "Use at least two letters." },
      { raw: "123", reason: "Only A-Z letters can be hidden in the grid." },
    ]);
  });

  test("builds a bounded grid and reports words that cannot be placed", () => {
    const puzzle = buildWordSearchPuzzle({
      allowBackwards: false,
      difficulty: "easy",
      seed: 20260530,
      size: 10,
      words: ["MORSE", "RADIO", "THISWORDISTOOLONG"],
    });

    expect(puzzle.grid).toHaveLength(10);
    expect(puzzle.grid.every((row) => row.length === 10)).toBe(true);
    expect(puzzle.placements.map((placement) => placement.word).sort()).toEqual([
      "MORSE",
      "RADIO",
    ]);
    expect(puzzle.skippedWords).toEqual([
      {
        word: "THISWORDISTOOLONG",
        reason: "THISWORDISTOOLONG is too long for a 10 x 10 grid.",
      },
    ]);
    expect(puzzle.notices).toContain(
      "Some words are too long for the current grid and were left out.",
    );
  });

  test("handles malformed direct generation options without hanging", () => {
    const puzzle = buildWordSearchPuzzle({
      allowBackwards: true,
      difficulty: "challenge",
      seed: Number.NaN,
      size: 10.4,
      words: ["", "a", "signal!!!", "practice"],
    });

    expect(puzzle.grid).toHaveLength(10);
    expect(puzzle.grid.every((row) => row.length === 10)).toBe(true);
    expect(puzzle.placements.map((placement) => placement.word).sort()).toEqual([
      "PRACTICE",
      "SIGNAL",
    ]);
  });

  test("generated print HTML has complete print-safe CSS and puzzle content", () => {
    const puzzle = buildWordSearchPuzzle({
      allowBackwards: false,
      difficulty: "standard",
      seed: 73051,
      size: 12,
      words: ["MORSE", "SIGNAL", "RADIO"],
    });

    const html = buildWordSearchPrintHtml({
      mode: "both",
      puzzle,
      qrCodeDataUrl: "",
      settings: PRINT_SETTINGS,
    });

    expect(html).toContain('<div class="word-grid"');
    expect(html).toContain('<ol class="clue-list">');
    expect(html).toContain("<section class=\"answer-key\">");
    expect(html).toContain("border: 1px solid #94a3b8;");
    expect(html).toContain("border-radius: 3px;");
    expect(html).toContain("border-top: 1px solid #cbd5e1;");
    expect(html).not.toContain("box-sizing: -box");
    expect(html).not.toMatch(/(?:^|\n)\s*-radius\s*:/);
    expect(html).not.toContain("\n : 1px solid");
    expect(html).not.toContain("\n -top:");
  });
});

test.describe("word search builder route", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("loads and prints only after a generated puzzle exists", async ({ page }) => {
    await page.goto("/morse-code-word-search-builder", {
      waitUntil: "domcontentloaded",
    });
    await waitForRouteReady(page);

    await expect(page.locator("h1")).toHaveText("Morse Code Word Search Builder");
    const printButton = page.getByRole("button", { name: "Print selected output" });
    await expect(printButton).toBeEnabled();

    const wordInput = page.getByLabel("Plain words");
    await expect(async () => {
      await wordInput.fill("");
      await expect(printButton).toBeDisabled({ timeout: 1_000 });
    }).toPass({ timeout: 15_000 });
    await expect(async () => {
      await page.getByRole("button", { name: "Generate new puzzle" }).click();
      await expect(
        page.getByText("Add at least one valid A-Z word to generate a puzzle.").first(),
      ).toBeVisible({ timeout: 1_000 });
    }).toPass({ timeout: 15_000 });
    await expect(
      page.getByText("Add at least one valid A-Z word to generate a puzzle.").first(),
    ).toBeVisible();
    await expect(page.locator("body")).not.toContainText(/Application Error|NaN|Infinity/);
  });

  test("reports duplicates, unsupported entries, cleaned words, and oversized words", async ({
    page,
  }) => {
    await page.goto("/morse-code-word-search-builder", {
      waitUntil: "domcontentloaded",
    });
    await waitForRouteReady(page);

    await expect(async () => {
      await page
        .getByLabel("Plain words")
        .fill("morse, MORSE, radio!, A, 123, THISWORDISTOOLONGFORATENGRID");
      await expect(page.getByText("Unsupported characters were removed")).toBeVisible({
        timeout: 1_000,
      });
      await expect(page.getByText("1 duplicate word was ignored.")).toBeVisible({
        timeout: 1_000,
      });
      await expect(
        page.getByText("123: Only A-Z letters can be hidden in the grid."),
      ).toBeVisible({ timeout: 1_000 });
      await expect(
        page.getByText("A: Use at least two letters."),
      ).toBeVisible({ timeout: 1_000 });
      await expect(
        page.getByText("Some words are too long for the current grid and were left out."),
      ).toBeVisible({ timeout: 1_000 });
    }).toPass({ timeout: 15_000 });
  });
});
