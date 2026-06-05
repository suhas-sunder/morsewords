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

  test("supports older markers and malformed marker order safely", () => {
    const oldMarker = cleanGutenbergText(`
Header
*** START OF THIS PROJECT GUTENBERG EBOOK OLD SAMPLE ***

Preface

Real front matter.

End of the Project Gutenberg EBook of Old Sample
Footer license
`);

    expect(oldMarker.report.headerStripped).toBe(true);
    expect(oldMarker.report.footerStripped).toBe(true);
    expect(oldMarker.cleanedText).toContain("Real front matter.");
    expect(oldMarker.cleanedText).not.toContain("Footer license");

    const malformed = cleanGutenbergText(`
*** END OF THE PROJECT GUTENBERG EBOOK BAD SAMPLE ***
Header-ish text should stay because markers are reversed.
*** START OF THE PROJECT GUTENBERG EBOOK BAD SAMPLE ***
`);

    expect(malformed.report.confidence).toBe("low");
    expect(malformed.report.warnings.join(" ")).toContain("out of order");
    expect(malformed.cleanedText).toContain("Header-ish text should stay");
  });

  test("preserves preface and table of contents without creating bogus chapter stubs", () => {
    const metadata = baseMetadata("contents-sample");
    const result = detectBookSections(
      `
Title Page

Preface

This preface belongs to the book.

Contents
CHAPTER I
CHAPTER II
CHAPTER III


CHAPTER I

The first real chapter.

CHAPTER II

The second real chapter.
`,
      metadata,
    );

    expect(result.sections.map((section) => section.kind)).toEqual([
      "title-page",
      "preface",
      "title-page",
      "chapter",
      "chapter",
    ]);
    expect(result.sections.filter((section) => section.kind === "chapter")).toHaveLength(2);
    expect(result.sections[1].text).toContain("This preface belongs to the book.");
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

  test("detects transcriber and source-license sections as excluded support matter", () => {
    const metadata = baseMetadata("support-matter");
    const result = detectBookSections(
      `
CHAPTER I

Main chapter text.

Transcriber's Note

This note should not be included by default.

Project Gutenberg License

License text should not be included by default.
`,
      metadata,
    );

    const supportKinds = result.sections.map((section) => [
      section.kind,
      section.includeByDefault,
    ]);
    expect(supportKinds).toContainEqual(["chapter", true]);
    expect(supportKinds).toContainEqual(["transcriber-note", false]);
    expect(supportKinds).toContainEqual(["source-license", false]);
  });

  test("applies manual rename, kind, include, split, and merge overrides", () => {
    const metadata = {
      ...baseMetadata("override-sample"),
      defaults: {
        includeKinds: ["chapter", "preface"],
        excludeKinds: ["source-license", "transcriber-note", "advertisement"],
        preferredPreset: "main-narrative",
      },
      sectionOverrides: [
        {
          type: "rename-section",
          sectionId: "chapter-001",
          label: "Opening chapter",
          title: "Manual title",
        },
        {
          type: "change-kind",
          sectionId: "chapter-001",
          kind: "preface",
          includeByDefault: false,
        },
        {
          type: "split-section",
          sectionId: "chapter-002",
          markerText: "Split here.",
          newSectionId: "manual-split",
          label: "Manual split",
          kind: "chapter",
        },
        {
          type: "merge-sections",
          sectionIds: ["manual-split", "chapter-003"],
          id: "merged-manual-section",
          label: "Merged manual section",
          kind: "chapter",
        },
      ],
    } satisfies BookMetadata;

    const result = detectBookSections(
      `
CHAPTER I

Opening text.

CHAPTER II

Before split. Split here. After split.

CHAPTER III

Third chapter.
`,
      metadata,
    );

    expect(result.sections[0]).toMatchObject({
      id: "chapter-001",
      kind: "preface",
      label: "Opening chapter",
      title: "Manual title",
      includeByDefault: false,
    });
    expect(result.sections.map((section) => section.id)).toContain(
      "merged-manual-section",
    );
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

  test("reports raw duplicate Gutenberg IDs with file names without failing raw inventory growth", ({
  }, testInfo) => {
    const textRoot = testInfo.outputPath("raw-duplicates");
    const generatedRoot = testInfo.outputPath("raw-duplicates-generated");
    fs.mkdirSync(path.join(textRoot, "raw"), { recursive: true });
    fs.writeFileSync(
      path.join(textRoot, "raw", "one.txt"),
      "Title: One\nRelease date: Today [eBook #42]\n",
      "utf8",
    );
    fs.writeFileSync(
      path.join(textRoot, "raw", "two.txt"),
      "Title: Two\nOther information: www.gutenberg.org/ebooks/42\n",
      "utf8",
    );

    const inventory = scanBookInventory({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
    });
    expect(inventory.rawWithoutMetadata.map((filePath) => path.basename(filePath))).toEqual([
      "one.txt",
      "two.txt",
    ]);
    expect(inventory.duplicateGutenbergIds).toEqual([
      expect.objectContaining({
        gutenbergId: "42",
        rawFiles: expect.arrayContaining([
          expect.objectContaining({ relativePath: "raw/one.txt" }),
          expect.objectContaining({ relativePath: "raw/two.txt" }),
        ]),
      }),
    ]);

    const result = buildBookLibrary({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      generatedRoot,
      quiet: true,
    });
    expect(result.fatalErrors).toEqual([]);
  });

  test("fails duplicate metadata Gutenberg IDs unless both entries explain the duplicate", ({
  }, testInfo) => {
    const textRoot = testInfo.outputPath("metadata-duplicate-ids");
    const generatedRoot = testInfo.outputPath("metadata-duplicate-generated");
    const rawText =
      "*** START OF THE PROJECT GUTENBERG EBOOK SAMPLE ***\nCHAPTER I\n\nText.\n*** END OF THE PROJECT GUTENBERG EBOOK SAMPLE ***";
    writeFixtureBook(textRoot, "sample-one", rawText);
    writeFixtureBook(
      textRoot,
      "sample-two",
      rawText,
      {
        ...baseMetadata("sample-two"),
        source: {
          ...baseMetadata("sample-two").source,
          gutenbergId: "1001",
        },
      },
    );

    const failed = buildBookLibrary({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      generatedRoot,
      quiet: true,
    });
    expect(failed.fatalErrors.join(" ")).toContain(
      "Duplicate metadata Gutenberg ID 1001",
    );

    for (const slug of ["sample-one", "sample-two"]) {
      const metadata = baseMetadata(slug);
      writeJson(path.join(textRoot, "meta", `${slug}.json`), {
        ...metadata,
        source: {
          ...metadata.source,
          gutenbergId: "1001",
          allowDuplicateGutenbergId: true,
          duplicateReason: "Same source intentionally used for duplicate-id test.",
        },
      });
    }

    const allowed = buildBookLibrary({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      generatedRoot,
      quiet: true,
    });
    expect(allowed.fatalErrors).toEqual([]);
  });

  test("rejects invalid metadata shape, malformed overrides, and path traversal", ({
  }, testInfo) => {
    const textRoot = testInfo.outputPath("invalid-metadata");
    const generatedRoot = testInfo.outputPath("invalid-generated");
    fs.mkdirSync(path.join(textRoot, "meta"), { recursive: true });
    writeJson(path.join(textRoot, "meta", "bad-shape.json"), {
      slug: "Bad Shape",
      title: "",
      author: "Nobody",
      language: "",
      source: {
        provider: "Project Gutenberg",
        gutenbergId: "abc",
        rawTextFile: "../../outside.txt",
        releaseDate: null,
        rightsBasis: "not-real",
        rightsReviewed: "no",
        rightsNotes: "",
      },
      cover: { src: null, placeholder: false, alt: "" },
      description: "",
      subjects: [],
      originalPublicationYear: null,
      defaults: {
        includeKinds: ["chapter"],
        excludeKinds: ["chapter"],
        preferredPreset: "",
      },
      sectionOverrides: [{ type: "split-section", sectionId: "chapter-001" }],
      cleanupRules: [{ type: "replace", pattern: "[" }],
    });

    const result = buildBookLibrary({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      generatedRoot,
      quiet: true,
    });
    const errors = result.fatalErrors.join(" ");
    expect(errors).toContain("slug must be lowercase kebab-case");
    expect(errors).toContain("author must be an array of strings");
    expect(errors).toContain("source.gutenbergId must contain only digits");
    expect(errors).toContain("cover.placeholder must be true");
    expect(errors).toContain("defaults cannot both include and exclude");
    expect(errors).toContain("sectionOverrides[0] needs markerText or offset");
    expect(errors).toContain("cleanupRules[0].pattern must be a valid regular expression");
  });

  test("rejects safe-looking metadata that resolves outside the text asset root", ({
  }, testInfo) => {
    const textRoot = testInfo.outputPath("path-traversal");
    const generatedRoot = testInfo.outputPath("path-traversal-generated");
    fs.mkdirSync(path.join(textRoot, "meta"), { recursive: true });
    writeJson(
      path.join(textRoot, "meta", "escape.json"),
      baseMetadata("escape", "../../outside.txt"),
    );

    const result = buildBookLibrary({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      generatedRoot,
      quiet: true,
    });

    expect(result.fatalErrors.join(" ")).toContain(
      "source.rawTextFile must resolve inside",
    );
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
    expect(section.paragraphs).toEqual(expect.arrayContaining([
      expect.stringContaining("First chapter text"),
    ]));
    expect(section.textPreview).toContain("First chapter text");
    expect(String(section.morseSourceText)).not.toContain("Project Gutenberg License");
    expect(JSON.stringify(firstTree)).not.toMatch(/[A-Z]:\\\\|\/tmp\//);
    expect(Object.keys(firstTree).some((filePath) => /\.(mp3|wav|webm|zip)$/i.test(filePath))).toBe(
      false,
    );
  });

  test("fails generated duplicate section ids before writing a successful book", ({
  }, testInfo) => {
    const textRoot = testInfo.outputPath("duplicate-section-id");
    const generatedRoot = testInfo.outputPath("duplicate-section-generated");
    const metadata = {
      ...baseMetadata("duplicate-section-id"),
      sectionOverrides: [
        {
          type: "split-section",
          sectionId: "chapter-001",
          markerText: "Split marker.",
          newSectionId: "chapter-001",
          label: "Duplicate id",
        },
      ],
    } satisfies BookMetadata;
    writeFixtureBook(
      textRoot,
      "duplicate-section-id",
      "*** START OF THE PROJECT GUTENBERG EBOOK SAMPLE ***\nCHAPTER I\n\nBefore. Split marker. After.\n*** END OF THE PROJECT GUTENBERG EBOOK SAMPLE ***",
      metadata,
    );

    const result = buildBookLibrary({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      generatedRoot,
      quiet: true,
    });

    expect(result.fatalErrors.join(" ")).toContain(
      "duplicate generated section id chapter-001",
    );
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
    expect(firstChapter.paragraphs).toEqual(expect.arrayContaining([
      expect.stringContaining("Down the Rabbit-Hole"),
    ]));
    expect(firstChapter.textPreview).toContain("CHAPTER I");
    expect(String(firstChapter.morseSourceText)).not.toMatch(
      /PROJECT GUTENBERG|license|donation/i,
    );
  });
});
