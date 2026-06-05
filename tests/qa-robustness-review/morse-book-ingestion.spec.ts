import fs from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import type { BookMetadata } from "../../scripts/books/bookManifestTypes.ts";
import { buildBookLibrary, scanBookInventory } from "../../scripts/books/build-book-library.ts";
import { cleanGutenbergText } from "../../scripts/books/clean-gutenberg.ts";
import { detectBookSections } from "../../scripts/books/detect-book-sections.ts";

const ROOT = process.cwd();

function baseMetadata(slug: string, rawTextFile = `../raw/${slug}.txt`): BookMetadata {
  return {
    schemaVersion: 1,
    slug,
    title: `Sample ${slug}`,
    author: ["Example Author"],
    language: "en",
    source: {
      provider: "Project Gutenberg",
      gutenbergId: slug.endsWith("two") ? "2002" : "1001",
      rawTextFile,
      releaseDate: null,
      rightsBasis: "public-domain-us",
      rightsReviewed: false,
      rightsNotes: "",
    },
    cover: {
      src: null,
      placeholder: true,
      alt: `Placeholder cover for ${slug}`,
    },
    description: "",
    subjects: [],
    originalPublicationYear: null,
    defaults: {
      includeKinds: ["chapter"],
      excludeKinds: ["source-license", "transcriber-note", "advertisement"],
      preferredPreset: "main-narrative",
    },
    sectionOverrides: [],
    cleanupRules: [],
  };
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeFixtureBook(
  textRoot: string,
  slug: string,
  rawText: string,
  metadata: BookMetadata = baseMetadata(slug),
) {
  const rawPath = path.join(textRoot, "raw", `${slug}.txt`);
  const metadataPath = path.join(textRoot, "meta", `${slug}.json`);
  fs.mkdirSync(path.dirname(rawPath), { recursive: true });
  fs.writeFileSync(rawPath, rawText, "utf8");
  writeJson(metadataPath, metadata);
}

function readGeneratedTree(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
      } else {
        result[path.relative(root, entryPath).split(path.sep).join("/")] =
          fs.readFileSync(entryPath, "utf8");
      }
    }
  };
  walk(root);
  return result;
}

test.describe("Morse book ingestion pipeline", () => {
  test("strips modern Gutenberg header and footer without keeping license boilerplate", () => {
    const result = cleanGutenbergText(`
Project Gutenberg header and license text
*** START OF THE PROJECT GUTENBERG EBOOK SAMPLE BOOK ***

CHAPTER I

The actual book starts here.

*** END OF THE PROJECT GUTENBERG EBOOK SAMPLE BOOK ***
Project Gutenberg license footer
`);

    expect(result.report.headerStripped).toBe(true);
    expect(result.report.footerStripped).toBe(true);
    expect(result.report.confidence).toBe("high");
    expect(result.cleanedText).toContain("The actual book starts here.");
    expect(result.cleanedText).not.toContain("license footer");
    expect(result.cleanedText).not.toContain("Project Gutenberg header");
  });

  test("missing Gutenberg markers warns and avoids destructive stripping", () => {
    const result = cleanGutenbergText(`
Title page that should remain

CHAPTER I

Body text.

Project Gutenberg-like notes without a reliable marker.
`);

    expect(result.report.headerStripped).toBe(false);
    expect(result.report.footerStripped).toBe(false);
    expect(result.report.confidence).toBe("low");
    expect(result.report.warnings.join(" ")).toContain("Missing Project Gutenberg");
    expect(result.cleanedText).toContain("Title page that should remain");
    expect(result.cleanedText).toContain("Project Gutenberg-like notes");
  });

  test("detects common section headings with stable ids and no empty sections", () => {
    const metadata = baseMetadata("section-sample");
    const result = detectBookSections(
      `
Opening note.

PART I

CHAPTER I

Chapter one text.

Chapter 1

Numbered chapter text.

I.

Roman heading text.
`,
      metadata,
    );

    expect(result.sections.map((section) => section.id)).toEqual([
      "title-page-001",
      "part-001",
      "chapter-001",
      "chapter-002",
      "chapter-003",
    ]);
    expect(result.sections.map((section) => section.kind)).toContain("part");
    expect(result.sections.every((section) => section.characterCount > 0)).toBe(true);
  });

  test("creates fallback chunk sections when no chapters are detected", () => {
    const metadata = baseMetadata("chunked-sample");
    const longText = Array.from({ length: 1_300 }, (_, index) =>
      `Paragraph ${index + 1} has no chapter heading but does have useful words.`,
    ).join("\n\n");
    const result = detectBookSections(longText, metadata);

    expect(result.warnings.join(" ")).toContain("No chapter headings");
    expect(result.sections.length).toBeGreaterThan(1);
    expect(result.sections[0].id).toBe("part-001");
    expect(result.sections.every((section) => section.characterCount > 0)).toBe(true);
  });

  test("reports duplicate metadata slugs and keeps unreviewed rights unpublished", ({}, testInfo) => {
    const textRoot = testInfo.outputPath("duplicate-library");
    const generatedRoot = testInfo.outputPath("duplicate-generated");
    writeFixtureBook(
      textRoot,
      "sample-one",
      "*** START OF THE PROJECT GUTENBERG EBOOK SAMPLE ***\nCHAPTER I\n\nText.\n*** END OF THE PROJECT GUTENBERG EBOOK SAMPLE ***",
    );
    writeJson(
      path.join(textRoot, "meta", "sample-one-copy.json"),
      baseMetadata("sample-one", "../raw/sample-one.txt"),
    );

    const inventory = scanBookInventory({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
    });
    expect(inventory.duplicateSlugs).toEqual(["sample-one"]);

    fs.rmSync(path.join(textRoot, "meta", "sample-one-copy.json"), {
      force: true,
    });
    const result = buildBookLibrary({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      generatedRoot,
      quiet: true,
    });
    expect(result.fatalErrors).toEqual([]);
    expect(result.processedBooks[0].source.publishReady).toBe(false);
    expect(result.warnings.join(" ")).toContain("Rights have not been reviewed");
  });

  test("builds summary-only manifests, per-section text, and deterministic output", ({
  }, testInfo) => {
    const textRoot = testInfo.outputPath("generated-library");
    const generatedRoot = testInfo.outputPath("generated-output");
    const rawText = `
*** START OF THE PROJECT GUTENBERG EBOOK SAMPLE ***

CHAPTER I

First chapter text.

CHAPTER II

Second chapter text.

*** END OF THE PROJECT GUTENBERG EBOOK SAMPLE ***
Project Gutenberg License
`;
    writeFixtureBook(textRoot, "sample-one", rawText);
    writeFixtureBook(
      textRoot,
      "sample-two",
      rawText.replace("SAMPLE", "SAMPLE TWO"),
      baseMetadata("sample-two"),
    );

    const first = buildBookLibrary({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      generatedRoot,
      quiet: true,
    });
    const firstTree = readGeneratedTree(generatedRoot);
    const second = buildBookLibrary({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      generatedRoot,
      quiet: true,
    });
    const secondTree = readGeneratedTree(generatedRoot);

    expect(first.fatalErrors).toEqual([]);
    expect(second.fatalErrors).toEqual([]);
    expect(first.processedBooks.map((book) => book.slug)).toEqual([
      "sample-one",
      "sample-two",
    ]);
    expect(secondTree).toEqual(firstTree);

    const libraryManifest = JSON.parse(
      firstTree["library-manifest.json"],
    ) as Record<string, unknown>;
    expect(JSON.stringify(libraryManifest)).not.toContain("First chapter text");
    expect(JSON.stringify(libraryManifest)).not.toContain("morseSourceText");

    const section = JSON.parse(
      firstTree["sample-one/sections/chapter-001.json"],
    ) as Record<string, unknown>;
    expect(section.displayText).toContain("First chapter text");
    expect(section.morseSourceText).toContain("First chapter text");
    expect(String(section.morseSourceText)).not.toContain("Project Gutenberg License");
  });

  test("committed Alice pilot artifact has publish flags and chapter sections", () => {
    const libraryManifestPath = path.join(
      ROOT,
      "app/client/assets/books/generated/library-manifest.json",
    );
    const bookManifestPath = path.join(
      ROOT,
      "app/client/assets/books/generated/alices-adventures-in-wonderland/manifest.json",
    );
    const firstChapterPath = path.join(
      ROOT,
      "app/client/assets/books/generated/alices-adventures-in-wonderland/sections/chapter-001.json",
    );

    const libraryManifest = JSON.parse(
      fs.readFileSync(libraryManifestPath, "utf8"),
    ) as Record<string, unknown>;
    const bookManifest = JSON.parse(
      fs.readFileSync(bookManifestPath, "utf8"),
    ) as {
      slug: string;
      source: { publishReady: boolean; rightsReviewed: boolean };
      sections: Array<{ kind: string; includeByDefault: boolean }>;
    };
    const firstChapter = JSON.parse(
      fs.readFileSync(firstChapterPath, "utf8"),
    ) as Record<string, unknown>;

    expect(JSON.stringify(libraryManifest)).not.toContain("morseSourceText");
    expect(bookManifest.slug).toBe("alices-adventures-in-wonderland");
    expect(bookManifest.source.rightsReviewed).toBe(false);
    expect(bookManifest.source.publishReady).toBe(false);
    expect(
      bookManifest.sections.filter(
        (section) => section.kind === "chapter" && section.includeByDefault,
      ).length,
    ).toBeGreaterThanOrEqual(12);
    expect(firstChapter.displayText).toContain("CHAPTER I");
    expect(firstChapter.morseSourceText).toContain("CHAPTER I");
    expect(String(firstChapter.morseSourceText)).not.toMatch(
      /PROJECT GUTENBERG|license|donation/i,
    );
  });
});
