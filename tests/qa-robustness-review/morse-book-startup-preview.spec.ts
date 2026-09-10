import fs from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import { createMorseBookPreviewRuntimeContent } from "../../app/client/data/morseBookPreviews";
import {
  isStructurallyReadableMorseBookStartupSection,
  isValidMorseBookStartupPreviewText,
} from "../../app/client/data/morseBookStartupPreviewValidation";
import type {
  MorseBookLibraryManifest,
  MorseBookPreviewAsset,
} from "../../app/client/data/morseBookTypes";

const repoRoot = process.cwd();
const affectedSlugs = [
  "a-christmas-carol",
  "dr-jekyll-and-mr-hyde",
  "the-great-gatsby",
  "hero-myths-and-legends-of-the-british-race",
  "the-adventure-of-the-speckled-band",
  "the-five-orange-pips",
  "the-call-of-cthulhu",
  "the-crystal-egg",
  "the-time-machine",
] as const;

function readJson<T>(relativePath: string) {
  return JSON.parse(
    fs.readFileSync(path.join(repoRoot, relativePath), "utf8"),
  ) as T;
}

test("all nine affected assets provide valid startup runtime content", () => {
  const library = readJson<MorseBookLibraryManifest>(
    "app/client/assets/books/generated/library-manifest.json",
  );

  for (const slug of affectedSlugs) {
    const summary = library.books.find((book) => book.slug === slug);
    const preview = readJson<MorseBookPreviewAsset>(
      `public/book-previews/${slug}.preview.json`,
    );

    expect(summary, slug).toBeDefined();
    expect(isValidMorseBookStartupPreviewText(preview.previewText), slug).toBe(
      true,
    );
    expect(
      createMorseBookPreviewRuntimeContent(summary!, preview),
      slug,
    ).not.toBeNull();
  }
});

test("all current preview assets satisfy the runtime startup contract", () => {
  const library = readJson<MorseBookLibraryManifest>(
    "app/client/assets/books/generated/library-manifest.json",
  );
  const rejected: string[] = [];

  for (const summary of library.books) {
    const preview = readJson<MorseBookPreviewAsset>(
      `public/book-previews/${summary.slug}.preview.json`,
    );
    if (!createMorseBookPreviewRuntimeContent(summary, preview)) {
      rejected.push(summary.slug);
    }
  }

  expect(rejected).toEqual([]);
  expect(library.books).toHaveLength(
    readJson<{ books: unknown[] }>("public/book-previews/manifest.json").books
      .length,
  );
});

test("rejects structural front matter, placeholders, and source boilerplate", () => {
  const invalidText = [
    "",
    "SOS Help",
    "Type text here while the book route is available.",
    "CONTENTS\nChapter I\nChapter II\nChapter III",
    "Table of Contents\nI\nII\nIII\nIV",
    "*** START OF THE PROJECT GUTENBERG EBOOK SAMPLE ***",
    "Production note: this file was prepared by volunteers.",
    "Source note: reference file does not include body text.",
  ];

  for (const text of invalidText) {
    expect(isValidMorseBookStartupPreviewText(text), text).toBe(false);
  }

  for (const kind of ["title-page", "preface", "notes", "source-license"]) {
    expect(
      isStructurallyReadableMorseBookStartupSection({
        kind,
        label: kind,
        title: null,
        order: 1,
        wordCount: 200,
        textPreview: "Readable-looking words do not override section structure.",
      }),
      kind,
    ).toBe(false);
  }
});

test("accepts ordinary narrative uses of notes, contents, and introduction", () => {
  const validText = [
    "On glancing over my notes of the cases, I remembered one strange evening.",
    "The contents of its window were curiously variegated and drew a crowd.",
    "I. Introduction\nThe Time Traveller was expounding a recondite matter to us.",
    "CHAPTER I: BEOWULF\nIntroduction\nThe figure which meets us is a hero.",
    "The preface he remembered was discussed naturally inside the story.",
  ];

  for (const text of validText) {
    expect(isValidMorseBookStartupPreviewText(text), text).toBe(true);
  }
});
