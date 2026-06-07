import fs from "node:fs";
import path from "node:path";

import { expect, test, type TestInfo } from "@playwright/test";

import type {
  BookMetadata,
  BookRightsReport,
  ProcessedBookJson,
} from "../../scripts/books/bookManifestTypes.ts";
import { buildBookLibrary, scanBookInventory } from "../../scripts/books/build-book-library.ts";
import { cleanGutenbergText } from "../../scripts/books/clean-gutenberg.ts";
import { detectBookSections } from "../../scripts/books/detect-book-sections.ts";
import { generateBookReviewQueue } from "../../scripts/books/generate-book-review-queue.ts";
import { generateBookRightsReports } from "../../scripts/books/generate-book-rights-reports.ts";
import { scaffoldBookMetadata } from "../../scripts/books/scaffold-book-metadata.ts";
import { applyBookReviewApprovals } from "../../scripts/books/apply-book-review-approvals.ts";

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

function writeRawBook(textRoot: string, fileName: string, rawText: string) {
  const rawPath = path.join(textRoot, "raw", fileName);
  fs.mkdirSync(path.dirname(rawPath), { recursive: true });
  fs.writeFileSync(rawPath, rawText, "utf8");
  return rawPath;
}

function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeApprovedPeople(
  textRoot: string,
  people: Record<string, { name: string; deathYear: number | null; canadaLifePlus70Safe?: boolean; notes: string }>,
) {
  writeJson(path.join(textRoot, "approved-metadata", "authors.json"), people);
}

function writeOwnerPeopleApprovals(
  textRoot: string,
  people: Array<{
    slug: string;
    name: string;
    roles: Array<"author" | "translator" | "editor" | "illustrator" | "introduction_author">;
    deathYear: number | null;
    canadaLifePlus70Safe: boolean;
    reviewedByOwner: boolean;
    notes: string;
    reviewDate?: string;
    sourceNotes?: string;
  }>,
) {
  writeJson(path.join(textRoot, "approved-metadata", "people.json"), {
    schemaVersion: 1,
    people,
  });
}

function writeBookApprovals(
  textRoot: string,
  books: Array<{
    bookSlug: string;
    approvedForWebsite: boolean;
    approvedForYoutubeNarration?: boolean;
    approvedRegions?: string[];
    originalPublicationYear: number | null;
    ownerReviewed: boolean;
    editionNotes?: string;
    translationNotes?: string;
    excludeModernAdditions?: boolean;
    notes?: string;
  }>,
) {
  writeJson(path.join(textRoot, "approved-metadata", "book-approvals.json"), {
    schemaVersion: 1,
    books: books.map((book) => ({
      approvedForYoutubeNarration: false,
      approvedRegions: ["US", "CA"],
      editionNotes: "",
      translationNotes: "",
      excludeModernAdditions: true,
      notes: "Test-only owner book approval.",
      ...book,
    })),
  });
}

function writeDuplicateResolutions(
  textRoot: string,
  duplicates: Array<{
    gutenbergId: string;
    keepSlug: string | null;
    duplicateSlugs: string[];
    resolution: "keep-one" | "allow-multiple" | "ignore-until-reviewed";
    reason: string;
    ownerReviewed: boolean;
  }>,
) {
  writeJson(path.join(textRoot, "approved-metadata", "duplicate-resolutions.json"), {
    schemaVersion: 1,
    duplicates,
  });
}

function approvedMetadata(
  slug: string,
  overrides: Partial<BookMetadata> = {},
): BookMetadata {
  const base = baseMetadata(slug);
  return {
    ...base,
    ...overrides,
    originalPublicationYear: overrides.originalPublicationYear ?? 1900,
    source: {
      ...base.source,
      rightsReviewed: true,
      rightsNotes: "Test fixture rights metadata has been reviewed.",
      ...(overrides.source ?? {}),
    },
  };
}

function gutenbergFixtureText({
  title = "Approved Sample",
  author = "Example Author",
  language = "English",
  gutenbergId = "1001",
  releaseDate = "January 1, 2001",
  extraHeader = "",
  body = "CHAPTER I\n\nThe first approved chapter text.",
  footerExtra = "",
}: {
  title?: string;
  author?: string;
  language?: string;
  gutenbergId?: string;
  releaseDate?: string;
  extraHeader?: string;
  body?: string;
  footerExtra?: string;
} = {}) {
  return [
    `Title: ${title}`,
    `Author: ${author}`,
    `Release date: ${releaseDate} [eBook #${gutenbergId}]`,
    `Language: ${language}`,
    extraHeader,
    `*** START OF THE PROJECT GUTENBERG EBOOK ${title.toUpperCase()} ***`,
    "",
    body,
    "",
    `*** END OF THE PROJECT GUTENBERG EBOOK ${title.toUpperCase()} ***`,
    "Project Gutenberg License",
    "This eBook is for the use of anyone anywhere in the United States.",
    "You may copy it, give it away or re-use it under the terms of the Project Gutenberg License.",
    "If you are not located in the United States, check the laws of your country.",
    footerExtra,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function buildSingleFixture({
  testInfo,
  slug,
  rawText,
  metadata = approvedMetadata(slug),
  approvedPeople = {
    "example-author": {
      name: "Example Author",
      deathYear: 1920,
      canadaLifePlus70Safe: true,
      notes: "Test-only approved person metadata.",
    },
  },
  bookApprovals,
}: {
  testInfo: TestInfo;
  slug: string;
  rawText: string;
  metadata?: BookMetadata;
  approvedPeople?: Record<string, { name: string; deathYear: number | null; canadaLifePlus70Safe?: boolean; notes: string }>;
  bookApprovals?: Parameters<typeof writeBookApprovals>[1];
}) {
  const textRoot = testInfo.outputPath(`${slug}-library`);
  const generatedRoot = testInfo.outputPath(`${slug}-generated`);
  writeApprovedPeople(textRoot, approvedPeople);
  writeBookApprovals(
    textRoot,
    bookApprovals ?? [
      {
        bookSlug: slug,
        approvedForWebsite: true,
        approvedForYoutubeNarration: true,
        approvedRegions: ["US", "CA"],
        originalPublicationYear: metadata.originalPublicationYear ?? 1900,
        ownerReviewed: true,
      },
    ],
  );
  writeFixtureBook(textRoot, slug, rawText, metadata);
  const result = buildBookLibrary({
    textRoot,
    metadataRoot: path.join(textRoot, "meta"),
    approvedPeoplePath: path.join(textRoot, "approved-metadata", "authors.json"),
    bookApprovalsPath: path.join(textRoot, "approved-metadata", "book-approvals.json"),
    generatedRoot,
    quiet: true,
  });
  return { result, generatedRoot };
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

  test("scaffolds draft metadata for raw Gutenberg files without overwriting or publishing", ({
  }, testInfo) => {
    const textRoot = testInfo.outputPath("metadata-scaffold-library");
    const metadataRoot = path.join(textRoot, "meta");
    const reportPath = testInfo.outputPath("metadata-scaffold-report.json");
    const existingMetadata = baseMetadata("existing-book", "../raw/existing-book.txt");
    writeFixtureBook(
      textRoot,
      "existing-book",
      gutenbergFixtureText({
        title: "Existing Book",
        gutenbergId: "1001",
      }),
      {
        ...existingMetadata,
        source: {
          ...existingMetadata.source,
          rightsNotes: "Existing metadata must remain untouched.",
        },
      },
    );
    const existingMetadataPath = path.join(metadataRoot, "existing-book.json");
    const existingBefore = fs.readFileSync(existingMetadataPath, "utf8");

    writeRawBook(
      textRoot,
      "draft-one.txt",
      gutenbergFixtureText({
        title: "Draft One",
        author: "Sample Author",
        language: "English",
        gutenbergId: "42",
        releaseDate: "February 2, 2002",
        extraHeader: [
          "Credits: Built by a careful fixture",
          "Translator: Example Translator",
          "Illustrator: Example Illustrator",
          "Editor: Example Editor",
          "Original publication: 1901",
        ].join("\n"),
        body: "CHAPTER I\n\nVERY UNIQUE FULL STORY TEXT SHOULD NOT APPEAR.",
      }),
    );
    writeRawBook(
      textRoot,
      "Same Name.txt",
      gutenbergFixtureText({
        title: "Same Name Upper",
        gutenbergId: "77",
      }),
    );
    writeRawBook(
      textRoot,
      "same-name.txt",
      gutenbergFixtureText({
        title: "Same Name Lower",
        gutenbergId: "77",
      }),
    );
    writeRawBook(
      textRoot,
      "missing-fields.txt",
      "A tiny fixture without Project Gutenberg header fields.",
    );

    const beforeInventory = scanBookInventory({ textRoot, metadataRoot });
    expect(
      beforeInventory.rawWithoutMetadata.map((filePath) =>
        path.basename(filePath),
      ).sort(),
    ).toEqual([
      "draft-one.txt",
      "Same Name.txt",
      "missing-fields.txt",
      "same-name.txt",
    ].sort());

    const first = scaffoldBookMetadata({
      textRoot,
      metadataRoot,
      reportPath,
      quiet: true,
    });
    expect(first.fatalErrors).toEqual([]);
    expect(first.createdMetadata.map((entry) => entry.slug).sort()).toEqual([
      "draft-one",
      "missing-fields",
      "same-name",
      "same-name-gutenberg-77",
    ].sort());
    expect(fs.readFileSync(existingMetadataPath, "utf8")).toBe(existingBefore);

    const draftOne = readJsonFile<BookMetadata>(
      path.join(metadataRoot, "draft-one.json"),
    );
    expect(draftOne.metadataStatus).toBe("draft");
    expect(draftOne.manualReviewRequired).toBe(true);
    expect(draftOne.source.gutenbergId).toBe("42");
    expect(draftOne.source.sourceUrl).toBe("https://www.gutenberg.org/ebooks/42");
    expect(draftOne.source.rightsReviewed).toBe(false);
    expect(draftOne.source.rightsBasis).toBe("unknown");
    expect(draftOne.source).not.toHaveProperty("publishReady");
    expect(draftOne.author).toEqual(["Sample Author"]);
    expect(draftOne.scaffold?.extracted.translator).toBe("Example Translator");
    expect(JSON.stringify(draftOne)).not.toContain("deathYear");

    const missing = readJsonFile<BookMetadata>(
      path.join(metadataRoot, "missing-fields.json"),
    );
    expect(missing.title).toBe("Missing Fields");
    expect(missing.author).toEqual([]);
    expect(missing.language).toBe("und");
    expect(missing.manualReviewRequired).toBe(true);
    expect(missing.scaffold?.missingFields).toEqual(
      expect.arrayContaining(["title", "author", "language", "gutenbergEbookNumber"]),
    );

    const duplicateOne = readJsonFile<BookMetadata>(
      path.join(metadataRoot, "same-name.json"),
    );
    const duplicateTwo = readJsonFile<BookMetadata>(
      path.join(metadataRoot, "same-name-gutenberg-77.json"),
    );
    expect(duplicateOne.scaffold?.warnings).toContain(
      "Possible duplicate Gutenberg ID; verify whether this is a duplicate, alternate file, or renamed copy.",
    );
    expect(duplicateTwo.scaffold?.warnings).toContain(
      "Possible duplicate Gutenberg ID; verify whether this is a duplicate, alternate file, or renamed copy.",
    );
    expect(duplicateOne.source).not.toHaveProperty("allowDuplicateGutenbergId");
    expect(duplicateTwo.source).not.toHaveProperty("allowDuplicateGutenbergId");

    const report = readJsonFile<{
      newMetadataFilesCreated: number;
      rawFilesStillSkipped: string[];
      duplicateGutenbergIds: Array<{ gutenbergId: string; rawFiles: string[] }>;
      manualReviewCount: number;
    }>(reportPath);
    expect(report.newMetadataFilesCreated).toBe(4);
    expect(report.rawFilesStillSkipped).toEqual([]);
    expect(report.manualReviewCount).toBe(4);
    expect(report.duplicateGutenbergIds).toEqual([
      expect.objectContaining({
        gutenbergId: "77",
        rawFiles: ["raw/Same Name.txt", "raw/same-name.txt"],
      }),
    ]);
    expect(fs.readFileSync(reportPath, "utf8")).not.toContain(
      "VERY UNIQUE FULL STORY TEXT SHOULD NOT APPEAR",
    );

    const afterInventory = scanBookInventory({ textRoot, metadataRoot });
    expect(afterInventory.rawWithoutMetadata).toEqual([]);

    const metadataBeforeRerun = readGeneratedTree(metadataRoot);
    const reportBeforeRerun = fs.readFileSync(reportPath, "utf8");
    const second = scaffoldBookMetadata({
      textRoot,
      metadataRoot,
      reportPath,
      quiet: true,
    });
    expect(second.fatalErrors).toEqual([]);
    expect(second.createdMetadata).toEqual([]);
    expect(readGeneratedTree(metadataRoot)).toEqual(metadataBeforeRerun);
    expect(fs.readFileSync(reportPath, "utf8")).toBe(reportBeforeRerun);

    for (const content of Object.values(readGeneratedTree(metadataRoot))) {
      expect(content).not.toContain("\"publishReady\": true");
    }
  });

  test("books build skips draft metadata when raw text is not present", ({
  }, testInfo) => {
    const textRoot = testInfo.outputPath("draft-missing-raw-library");
    const generatedRoot = testInfo.outputPath("draft-missing-raw-generated");
    const metadata = baseMetadata("draft-missing-raw", "../raw/missing.txt");
    writeJson(path.join(textRoot, "meta", "draft-missing-raw.json"), {
      ...metadata,
      metadataStatus: "draft",
      manualReviewRequired: true,
      source: {
        ...metadata.source,
        rightsBasis: "unknown",
      },
    });

    const result = buildBookLibrary({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      generatedRoot,
      quiet: true,
    });

    expect(result.fatalErrors).toEqual([]);
    expect(result.processedBooks).toEqual([]);
    expect(result.warnings.join(" ")).toContain(
      "draft metadata raw text file is missing",
    );
  });

  test("rights report command classifies every metadata book without story artifacts", ({
  }, testInfo) => {
    const textRoot = testInfo.outputPath("rights-report-library");
    const generatedRoot = testInfo.outputPath("rights-report-generated");
    const approvedPeoplePath = path.join(
      textRoot,
      "approved-metadata",
      "authors.json",
    );
    writeApprovedPeople(textRoot, {
      "approved-author": {
        name: "Approved Author",
        deathYear: 1920,
        canadaLifePlus70Safe: true,
        notes: "Fixture author approved for Canada life-plus-70 checks.",
      },
    });
    writeBookApprovals(textRoot, [
      {
        bookSlug: "approved-rights",
        approvedForWebsite: true,
        approvedForYoutubeNarration: true,
        approvedRegions: ["US", "CA"],
        originalPublicationYear: 1900,
        ownerReviewed: true,
      },
    ]);

    const metadataFor = (
      slug: string,
      gutenbergId: string,
      overrides: Partial<BookMetadata> = {},
    ): BookMetadata => {
      const base = approvedMetadata(slug, {
        ...overrides,
        source: {
          ...approvedMetadata(slug).source,
          gutenbergId,
          ...(overrides.source ?? {}),
        },
      });
      return {
        ...base,
        author: overrides.author ?? ["Approved Author"],
        source: {
          ...base.source,
          gutenbergId,
          rightsBasis: overrides.source?.rightsBasis ?? "public-domain-us",
          rightsReviewed: overrides.source?.rightsReviewed ?? true,
          ...(overrides.source ?? {}),
        },
      };
    };
    const rawFor = (
      title: string,
      gutenbergId: string,
      extraHeader = "",
      body = "CHAPTER I\n\nFixture body text.",
      footerExtra = "",
    ) =>
      gutenbergFixtureText({
        title,
        author: "Approved Author",
        language: "English",
        gutenbergId,
        releaseDate: "January 1, 2001",
        extraHeader: ["Original publication: 1900", extraHeader]
          .filter(Boolean)
          .join("\n"),
        body,
        footerExtra,
      });

    writeFixtureBook(
      textRoot,
      "approved-rights",
      rawFor("Approved Rights", "2001"),
      metadataFor("approved-rights", "2001"),
    );
    writeFixtureBook(
      textRoot,
      "draft-rights",
      rawFor(
        "Draft Rights",
        "2002",
        "",
        "CHAPTER I\n\nUNIQUE FULL STORY TEXT SHOULD STAY OUT OF REVIEW REPORT.",
      ),
      metadataFor("draft-rights", "2002", {
        metadataStatus: "draft",
        manualReviewRequired: true,
        source: {
          ...approvedMetadata("draft-rights").source,
          gutenbergId: "2002",
          rightsBasis: "unknown",
          rightsReviewed: false,
        },
      }),
    );
    writeFixtureBook(
      textRoot,
      "duplicate-one",
      rawFor("Duplicate One", "2077"),
      metadataFor("duplicate-one", "2077"),
    );
    writeFixtureBook(
      textRoot,
      "duplicate-two",
      rawFor("Duplicate Two", "2077"),
      metadataFor("duplicate-two", "2077"),
    );
    writeFixtureBook(
      textRoot,
      "copyright-risk",
      rawFor("Copyright Risk", "2003", "", "CHAPTER I\n\nText.", "All rights reserved."),
      metadataFor("copyright-risk", "2003"),
    );
    writeFixtureBook(
      textRoot,
      "permission-risk",
      rawFor(
        "Permission Risk",
        "2004",
        "",
        "CHAPTER I\n\nText.",
        "Used by permission of the publisher.",
      ),
      metadataFor("permission-risk", "2004"),
    );
    writeFixtureBook(
      textRoot,
      "creative-commons-risk",
      rawFor(
        "Creative Commons Risk",
        "2005",
        "",
        "CHAPTER I\n\nText.",
        "Creative Commons Attribution license.",
      ),
      metadataFor("creative-commons-risk", "2005"),
    );
    writeFixtureBook(
      textRoot,
      "translation-intro-risk",
      rawFor(
        "Translation Intro Risk",
        "2006",
        [
          "Translator: Modern Translator",
          "Editor: Modern Editor",
          "Introduction by Modern Intro",
        ].join("\n"),
      ),
      metadataFor("translation-intro-risk", "2006"),
    );
    writeFixtureBook(
      textRoot,
      "transcriber-image-risk",
      rawFor(
        "Transcriber Image Risk",
        "2007",
        "Illustrator: Example Illustrator",
        "TRANSCRIBER'S NOTE\n\n[Illustration]\n\nCHAPTER I\n\nText.",
      ),
      metadataFor("transcriber-image-risk", "2007"),
    );

    const result = generateBookRightsReports({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      approvedPeoplePath,
      bookApprovalsPath: path.join(textRoot, "approved-metadata", "book-approvals.json"),
      generatedRoot,
      quiet: true,
    });

    expect(result.fatalErrors).toEqual([]);
    expect(result.rightsReports).toHaveLength(9);
    expect(result.processingNotes).toHaveLength(9);

    const approvedReport = readJsonFile<BookRightsReport>(
      path.join(generatedRoot, "approved-rights", "rights_report.json"),
    );
    expect(approvedReport.canada_us_v1_status).toBe("approved");
    expect(approvedReport.processing_allowed).toBe(true);
    expect(approvedReport.author_death_year).toBe(1920);
    expect(approvedReport.source_url).toBe("https://www.gutenberg.org/ebooks/2001");

    const draftReport = readJsonFile<BookRightsReport>(
      path.join(generatedRoot, "draft-rights", "rights_report.json"),
    );
    expect(draftReport.canada_us_v1_status).toBe("needs_manual_review");
    expect(draftReport.processing_allowed).toBe(false);
    expect(
      fs.existsSync(path.join(generatedRoot, "draft-rights", "processed_book.json")),
    ).toBe(false);
    expect(
      fs.existsSync(path.join(generatedRoot, "draft-rights", "sections")),
    ).toBe(false);
    expect(
      fs.readFileSync(
        path.join(generatedRoot, "draft-rights", "processing_notes.md"),
        "utf8",
      ),
    ).toContain("Section/story artifacts emitted by rights-only command: no");

    const duplicateReport = readJsonFile<BookRightsReport>(
      path.join(generatedRoot, "duplicate-one", "rights_report.json"),
    );
    expect(duplicateReport.canada_us_v1_status).toBe("needs_manual_review");
    expect(duplicateReport.reasoning_summary).toContain(
      "Duplicate Gutenberg ID requires explicit review",
    );

    expect(
      readJsonFile<BookRightsReport>(
        path.join(generatedRoot, "copyright-risk", "rights_report.json"),
      ).canada_us_v1_status,
    ).toBe("reject");
    expect(
      readJsonFile<BookRightsReport>(
        path.join(generatedRoot, "permission-risk", "rights_report.json"),
      ).contains_permission_based_language,
    ).toBe(true);
    expect(
      readJsonFile<BookRightsReport>(
        path.join(generatedRoot, "creative-commons-risk", "rights_report.json"),
      ).contains_creative_commons_license,
    ).toBe(true);

    const translationReport = readJsonFile<BookRightsReport>(
      path.join(generatedRoot, "translation-intro-risk", "rights_report.json"),
    );
    expect(translationReport.canada_us_v1_status).toBe("needs_manual_review");
    expect(translationReport.translator).toBe("Modern Translator");
    expect(translationReport.translator_death_year).toBeNull();
    expect(translationReport.editor).toBe("Modern Editor");
    expect(translationReport.introduction_author).toBe("Modern Intro");
    expect(translationReport.contains_modern_intro_or_notes).toBe(true);

    const transcriberImageReport = readJsonFile<BookRightsReport>(
      path.join(generatedRoot, "transcriber-image-risk", "rights_report.json"),
    );
    expect(transcriberImageReport.contains_transcriber_notes).toBe(true);
    expect(transcriberImageReport.contains_illustrations_or_image_references).toBe(true);

    const reviewReport = readJsonFile<{
      totalMetadataBooks: number;
      statusCounts: {
        approved: number;
        needsManualReview: number;
        rejected: number;
      };
      processingAllowed: number;
      duplicateGutenbergIds: Array<{
        gutenbergId: string;
        participants: Array<{ slug: string; rawTextFile: string }>;
      }>;
      riskCounts: {
        laterCopyrightOrPermission: number;
        translationRisk: number;
        introEditorAnnotationRisk: number;
        illustrationImageRisk: number;
        creativeCommons: number;
      };
    }>(path.join(generatedRoot, "review-report.json"));
    expect(reviewReport.totalMetadataBooks).toBe(9);
    expect(reviewReport.statusCounts.approved).toBe(1);
    expect(reviewReport.statusCounts.needsManualReview).toBe(5);
    expect(reviewReport.statusCounts.rejected).toBe(3);
    expect(reviewReport.processingAllowed).toBe(1);
    expect(reviewReport.duplicateGutenbergIds).toEqual([
      expect.objectContaining({
        gutenbergId: "2077",
        participants: expect.arrayContaining([
          expect.objectContaining({ slug: "duplicate-one" }),
          expect.objectContaining({ slug: "duplicate-two" }),
        ]),
      }),
    ]);
    expect(reviewReport.riskCounts.laterCopyrightOrPermission).toBe(2);
    expect(reviewReport.riskCounts.translationRisk).toBe(1);
    expect(reviewReport.riskCounts.introEditorAnnotationRisk).toBe(1);
    expect(reviewReport.riskCounts.illustrationImageRisk).toBe(1);
    expect(reviewReport.riskCounts.creativeCommons).toBe(1);

    const reportJson = fs.readFileSync(
      path.join(generatedRoot, "review-report.json"),
      "utf8",
    );
    const reportMarkdown = fs.readFileSync(
      path.join(generatedRoot, "review-report.md"),
      "utf8",
    );
    expect(reportJson).not.toContain(
      "UNIQUE FULL STORY TEXT SHOULD STAY OUT OF REVIEW REPORT",
    );
    expect(reportMarkdown).not.toContain(
      "UNIQUE FULL STORY TEXT SHOULD STAY OUT OF REVIEW REPORT",
    );

    for (const artifact of Object.keys(readGeneratedTree(generatedRoot))) {
      expect(artifact).not.toMatch(/\.(mp3|wav|webm|mp4)$/);
      expect(path.basename(artifact)).not.toBe("processed_book.json");
    }
  });

  test("review queue command groups actionable manual review work", ({
  }, testInfo) => {
    const textRoot = testInfo.outputPath("review-queue-library");
    const generatedRoot = testInfo.outputPath("review-queue-generated");
    const approvedPeoplePath = path.join(
      textRoot,
      "approved-metadata",
      "authors.json",
    );
    writeApprovedPeople(textRoot, {});

    const metadataFor = (
      slug: string,
      gutenbergId: string,
      title: string,
      author = "Shared Author",
      overrides: Partial<BookMetadata> = {},
    ): BookMetadata => ({
      ...approvedMetadata(slug, {
        ...overrides,
        title,
        author: [author],
        source: {
          ...approvedMetadata(slug).source,
          gutenbergId,
          rightsBasis: "public-domain-us",
          rightsReviewed: true,
          ...(overrides.source ?? {}),
        },
      }),
      title,
      author: [author],
      originalPublicationYear: overrides.originalPublicationYear ?? 1900,
    });
    const rawFor = (
      title: string,
      gutenbergId: string,
      author = "Shared Author",
      extraHeader = "",
      body = "CHAPTER I\n\nFixture review body.",
      footerExtra = "",
    ) =>
      gutenbergFixtureText({
        title,
        author,
        gutenbergId,
        extraHeader: ["Original publication: 1900", extraHeader]
          .filter(Boolean)
          .join("\n"),
        body,
        footerExtra,
      });

    writeFixtureBook(
      textRoot,
      "candidate-one",
      rawFor(
        "Candidate One",
        "3001",
        "Shared Author",
        "",
        "CHAPTER I\n\nUNIQUE REVIEW STORY TEXT SHOULD NOT APPEAR.",
      ),
      metadataFor("candidate-one", "3001", "Candidate One"),
    );
    writeFixtureBook(
      textRoot,
      "candidate-two",
      rawFor("Candidate Two", "3002"),
      metadataFor("candidate-two", "3002", "Candidate Two"),
    );
    writeFixtureBook(
      textRoot,
      "duplicate-one",
      rawFor("Duplicate Story", "3999"),
      metadataFor("duplicate-one", "3999", "Duplicate Story"),
    );
    writeFixtureBook(
      textRoot,
      "duplicate-two",
      rawFor("Duplicate Story", "3999"),
      metadataFor("duplicate-two", "3999", "Duplicate Story"),
    );
    writeFixtureBook(
      textRoot,
      "translator-editor-review",
      rawFor(
        "Translator Editor Review",
        "3003",
        "Other Author",
        [
          "Translator: Modern Translator",
          "Editor: Modern Editor",
          "Introduction by Modern Intro",
        ].join("\n"),
      ),
      metadataFor(
        "translator-editor-review",
        "3003",
        "Translator Editor Review",
        "Other Author",
      ),
    );
    writeFixtureBook(
      textRoot,
      "permission-reject",
      rawFor(
        "Permission Reject",
        "3004",
        "Blocked Author",
        "",
        "CHAPTER I\n\nRejected body.",
        "Used by permission of the publisher.",
      ),
      metadataFor("permission-reject", "3004", "Permission Reject", "Blocked Author"),
    );

    const rights = generateBookRightsReports({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      approvedPeoplePath,
      generatedRoot,
      quiet: true,
    });
    expect(rights.fatalErrors).toEqual([]);

    const result = generateBookReviewQueue({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      approvedPeoplePath,
      generatedRoot,
      quiet: true,
    });
    expect(result.fatalErrors).toEqual([]);
    expect(fs.existsSync(result.paths.reviewQueueJson)).toBe(true);
    expect(fs.existsSync(result.paths.reviewQueueMarkdown)).toBe(true);
    expect(fs.existsSync(result.paths.peopleReviewQueueJson)).toBe(true);
    expect(fs.existsSync(result.paths.peopleReviewQueueMarkdown)).toBe(true);
    expect(fs.existsSync(result.paths.duplicateGutenbergReviewJson)).toBe(true);
    expect(fs.existsSync(result.paths.duplicateGutenbergReviewMarkdown)).toBe(true);
    expect(fs.existsSync(result.paths.approvalCandidatesJson)).toBe(true);
    expect(fs.existsSync(result.paths.rejectedBooksMarkdown)).toBe(true);

    const reviewQueue = readJsonFile<{
      workflow: string[];
      summary: {
        totalBooks: number;
        processingAllowed: number;
        rejected: number;
      };
      books: Array<{
        slug: string;
        currentStatus: string;
        nextAction: string;
        processingAllowed: boolean;
      }>;
    }>(result.paths.reviewQueueJson);
    expect(reviewQueue.summary.totalBooks).toBe(6);
    expect(reviewQueue.summary.processingAllowed).toBe(0);
    expect(reviewQueue.summary.rejected).toBe(1);
    expect(reviewQueue.workflow.join(" ")).toContain("Run npm run books:rights-report");
    expect(
      reviewQueue.books.find((book) => book.slug === "candidate-one")?.nextAction,
    ).toContain("Add approved author death year metadata");

    const peopleQueue = readJsonFile<{
      people: Array<{
        suggestedKey: string;
        displayName: string;
        knownDeathYear: number | null;
        missingDeathYearCount: number;
        booksAffected: Array<{ slug: string; role: string }>;
        suggestedMetadataEntry: { deathYear: number | null; notes: string };
      }>;
    }>(result.paths.peopleReviewQueueJson);
    const sharedAuthor = peopleQueue.people.find(
      (person) => person.suggestedKey === "shared-author",
    );
    expect(sharedAuthor).toBeTruthy();
    expect(sharedAuthor?.displayName).toBe("Shared Author");
    expect(sharedAuthor?.knownDeathYear).toBeNull();
    expect(sharedAuthor?.suggestedMetadataEntry.deathYear).toBeNull();
    expect(sharedAuthor?.suggestedMetadataEntry.notes).toContain(
      "manual verification",
    );
    expect(sharedAuthor?.booksAffected.map((book) => book.slug)).toEqual(
      expect.arrayContaining([
        "candidate-one",
        "candidate-two",
        "duplicate-one",
        "duplicate-two",
      ]),
    );
    const modernTranslator = peopleQueue.people.find(
      (person) => person.suggestedKey === "modern-translator",
    );
    expect(modernTranslator?.knownDeathYear).toBeNull();
    expect(modernTranslator?.booksAffected).toEqual([
      expect.objectContaining({
        slug: "translator-editor-review",
        role: "translator",
      }),
    ]);

    const duplicateReport = readJsonFile<{
      duplicateGutenbergIds: Array<{
        gutenbergId: string;
        participants: Array<{ slug: string }>;
        hasExactDuplicateCandidates: boolean;
        nextActions: string[];
      }>;
    }>(result.paths.duplicateGutenbergReviewJson);
    expect(duplicateReport.duplicateGutenbergIds).toEqual([
      expect.objectContaining({
        gutenbergId: "3999",
        hasExactDuplicateCandidates: true,
        participants: expect.arrayContaining([
          expect.objectContaining({ slug: "duplicate-one" }),
          expect.objectContaining({ slug: "duplicate-two" }),
        ]),
      }),
    ]);
    expect(duplicateReport.duplicateGutenbergIds[0].nextActions.join(" ")).toContain(
      "Manually compare source files",
    );

    const candidates = readJsonFile<{
      candidates: Array<{
        slug: string;
        currentStatus: string;
        addingApprovedAuthorMetadataMightBeEnough: boolean;
      }>;
    }>(result.paths.approvalCandidatesJson);
    expect(candidates.candidates.map((candidate) => candidate.slug)).toEqual(
      expect.arrayContaining(["candidate-one", "candidate-two"]),
    );
    expect(candidates.candidates.every((candidate) => candidate.currentStatus !== "approved")).toBe(
      true,
    );
    expect(
      candidates.candidates.find((candidate) => candidate.slug === "candidate-one")
        ?.addingApprovedAuthorMetadataMightBeEnough,
    ).toBe(true);

    const rejectedMarkdown = fs.readFileSync(result.paths.rejectedBooksMarkdown, "utf8");
    expect(rejectedMarkdown).toContain("permission-reject");
    expect(rejectedMarkdown).toContain("Reject or remove modern/permission-based text");

    for (const reviewFile of Object.values(result.paths)) {
      const contents = fs.readFileSync(reviewFile, "utf8");
      expect(contents).not.toContain("UNIQUE REVIEW STORY TEXT SHOULD NOT APPEAR");
      expect(contents).not.toMatch(/\.(mp3|wav|webm|mp4)/);
      expect(path.basename(reviewFile)).not.toBe("processed_book.json");
    }
  });

  test("review queue fails helpfully when a generated rights report is missing", ({
  }, testInfo) => {
    const textRoot = testInfo.outputPath("missing-rights-review-library");
    const generatedRoot = testInfo.outputPath("missing-rights-review-generated");
    writeFixtureBook(
      textRoot,
      "missing-rights-report",
      gutenbergFixtureText({
        title: "Missing Rights Report",
        author: "Missing Author",
        gutenbergId: "3101",
        extraHeader: "Original publication: 1900",
      }),
      approvedMetadata("missing-rights-report", {
        title: "Missing Rights Report",
        author: ["Missing Author"],
        originalPublicationYear: 1900,
        source: {
          ...approvedMetadata("missing-rights-report").source,
          gutenbergId: "3101",
          rightsReviewed: true,
          rightsBasis: "public-domain-us",
        },
      }),
    );

    const result = generateBookReviewQueue({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      approvedPeoplePath: path.join(textRoot, "approved-metadata", "authors.json"),
      generatedRoot,
      quiet: true,
    });

    expect(result.fatalErrors.join(" ")).toContain("missing rights report");
    expect(result.fatalErrors.join(" ")).toContain(
      "Run npm run books:rights-report first",
    );
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

  test("books build preserves review and approval intake artifacts", ({}, testInfo) => {
    const textRoot = testInfo.outputPath("build-preserves-review-library");
    const generatedRoot = testInfo.outputPath("build-preserves-review-generated");
    const metadataRoot = path.join(textRoot, "meta");
    const approvedPeoplePath = path.join(textRoot, "approved-metadata", "authors.json");
    const bookApprovalsPath = path.join(
      textRoot,
      "approved-metadata",
      "book-approvals.json",
    );
    const duplicateResolutionsPath = path.join(
      textRoot,
      "approved-metadata",
      "duplicate-resolutions.json",
    );

    writeApprovedPeople(textRoot, {
      "example-author": {
        name: "Example Author",
        deathYear: 1920,
        canadaLifePlus70Safe: true,
        notes: "Test-only approved person metadata.",
      },
    });
    writeOwnerPeopleApprovals(textRoot, []);
    writeBookApprovals(textRoot, [
      {
        bookSlug: "build-preserved-approved",
        approvedForWebsite: true,
        approvedForYoutubeNarration: true,
        approvedRegions: ["US", "CA"],
        originalPublicationYear: 1900,
        ownerReviewed: true,
      },
    ]);
    writeDuplicateResolutions(textRoot, []);
    writeFixtureBook(
      textRoot,
      "build-preserved-approved",
      gutenbergFixtureText({
        title: "Build Preserved Approved",
        gutenbergId: "3101",
      }),
      approvedMetadata("build-preserved-approved", {
        source: {
          ...approvedMetadata("build-preserved-approved").source,
          gutenbergId: "3101",
        },
      }),
    );
    writeFixtureBook(
      textRoot,
      "build-preserved-draft",
      gutenbergFixtureText({
        title: "Build Preserved Draft",
        gutenbergId: "3102",
      }),
      approvedMetadata("build-preserved-draft", {
        metadataStatus: "draft",
        manualReviewRequired: true,
        source: {
          ...approvedMetadata("build-preserved-draft").source,
          gutenbergId: "3102",
          rightsBasis: "unknown",
          rightsReviewed: false,
        },
      }),
    );

    const rights = generateBookRightsReports({
      textRoot,
      metadataRoot,
      approvedPeoplePath,
      bookApprovalsPath,
      generatedRoot,
      quiet: true,
    });
    expect(rights.fatalErrors).toEqual([]);
    const applied = applyBookReviewApprovals({
      textRoot,
      metadataRoot,
      approvedPeoplePath,
      peopleApprovalsPath: path.join(textRoot, "approved-metadata", "people.json"),
      bookApprovalsPath,
      duplicateResolutionsPath,
      generatedRoot,
      reviewRoot: path.join(generatedRoot, "review"),
      quiet: true,
    });
    expect(applied.fatalErrors).toEqual([]);

    const preservedPaths = [
      "review-report.json",
      "review-report.md",
      "review/review-queue.json",
      "review/people-review-queue.json",
      "review/duplicate-gutenberg-review.json",
      "review/owner-input/books-to-review.csv",
      "review/approval-application-report.json",
      "build-preserved-draft/rights_report.json",
      "build-preserved-draft/processing_notes.md",
    ];
    const beforeBuild = Object.fromEntries(
      preservedPaths.map((relativePath) => [
        relativePath,
        fs.readFileSync(path.join(generatedRoot, ...relativePath.split("/")), "utf8"),
      ]),
    );

    const build = buildBookLibrary({
      textRoot,
      metadataRoot,
      approvedPeoplePath,
      bookApprovalsPath,
      generatedRoot,
      quiet: true,
    });
    expect(build.fatalErrors).toEqual([]);
    expect(build.processedBooks.map((book) => book.slug)).toEqual([
      "build-preserved-approved",
    ]);

    for (const [relativePath, contents] of Object.entries(beforeBuild)) {
      const artifactPath = path.join(generatedRoot, ...relativePath.split("/"));
      expect(fs.existsSync(artifactPath)).toBe(true);
      expect(fs.readFileSync(artifactPath, "utf8")).toBe(contents);
    }
    expect(
      fs.existsSync(
        path.join(generatedRoot, "build-preserved-draft", "processed_book.json"),
      ),
    ).toBe(false);
    expect(
      fs.existsSync(path.join(generatedRoot, "build-preserved-draft", "sections")),
    ).toBe(false);
  });

  test("generates rights reports and blocks processed story JSON for manual-review books", ({
  }, testInfo) => {
    const { result, generatedRoot } = buildSingleFixture({
      testInfo,
      slug: "manual-review-sample",
      rawText: gutenbergFixtureText(),
      metadata: {
        ...baseMetadata("manual-review-sample"),
        originalPublicationYear: 1900,
        source: {
          ...baseMetadata("manual-review-sample").source,
          rightsReviewed: false,
          rightsNotes: "Manual review has not been completed.",
        },
      },
      approvedPeople: {},
    });

    expect(result.fatalErrors).toEqual([]);
    const report = JSON.parse(
      fs.readFileSync(
        path.join(generatedRoot, "manual-review-sample", "rights_report.json"),
        "utf8",
      ),
    ) as BookRightsReport;
    const notes = fs.readFileSync(
      path.join(generatedRoot, "manual-review-sample", "processing_notes.md"),
      "utf8",
    );

    expect(report.source_url).toBe("https://www.gutenberg.org/ebooks/1001");
    expect(report.project_gutenberg_license_present).toBe(true);
    expect(report.us_reuse_language_found).toBe(true);
    expect(report.non_us_warning_found).toBe(true);
    expect(report.author_death_year).toBeNull();
    expect(report.canada_us_v1_status).toBe("needs_manual_review");
    expect(report.processing_allowed).toBe(false);
    expect(notes).toContain("Approval status: needs_manual_review");
    expect(notes).toContain("processed_book.json emitted: no");
    expect(
      fs.existsSync(
        path.join(generatedRoot, "manual-review-sample", "processed_book.json"),
      ),
    ).toBe(false);
  });

  test("approved metadata and rights evidence produce processed_book without boilerplate", ({
  }, testInfo) => {
    const { result, generatedRoot } = buildSingleFixture({
      testInfo,
      slug: "approved-sample",
      rawText: gutenbergFixtureText({
        body:
          "CHAPTER I\n\nThe approved chapter stays in story order.\n\nCHAPTER II\n\nThe second chapter stays available for Morse practice.",
        footerExtra: "Transcriber's Note: This footer note must not enter story text.",
      }),
      metadata: approvedMetadata("approved-sample"),
    });

    expect(result.fatalErrors).toEqual([]);
    expect(result.processedBooks[0].source.publishReady).toBe(true);
    expect(result.processedBooks[0].source.processingAllowed).toBe(true);
    expect(result.processedBooks[0].source.rightsStatus).toBe("approved");
    expect(result.processedBooks[0].source.sourceUrl).toBe(
      "https://www.gutenberg.org/ebooks/1001",
    );

    const report = JSON.parse(
      fs.readFileSync(
        path.join(generatedRoot, "approved-sample", "rights_report.json"),
        "utf8",
      ),
    ) as BookRightsReport;
    const processed = JSON.parse(
      fs.readFileSync(
        path.join(generatedRoot, "approved-sample", "processed_book.json"),
        "utf8",
      ),
    ) as ProcessedBookJson;

    expect(report.author_death_year).toBe(1920);
    expect(report.canada_us_v1_status).toBe("approved");
    expect(report.processing_allowed).toBe(true);
    expect(report.contains_transcriber_notes).toBe(true);
    expect(processed.rights.approved_regions).toEqual(["US", "CA"]);
    expect(processed.source.source_url).toBe("https://www.gutenberg.org/ebooks/1001");
    expect(JSON.stringify(processed.content)).toContain("The approved chapter");
    expect(JSON.stringify(processed.content)).not.toMatch(
      /Project Gutenberg License|Transcriber/i,
    );
  });

  test("rights gate keeps missing source IDs and missing death-year evidence out of publish-ready state", ({
  }, testInfo) => {
    const missingId = buildSingleFixture({
      testInfo,
      slug: "missing-id-sample",
      rawText: gutenbergFixtureText(),
      metadata: {
        ...approvedMetadata("missing-id-sample"),
        source: {
          ...approvedMetadata("missing-id-sample").source,
          gutenbergId: null,
        },
      },
    });
    const missingIdReport = JSON.parse(
      fs.readFileSync(
        path.join(missingId.generatedRoot, "missing-id-sample", "rights_report.json"),
        "utf8",
      ),
    ) as BookRightsReport;
    expect(missingIdReport.source_url).toBeNull();
    expect(missingIdReport.canada_us_v1_status).toBe("needs_manual_review");
    expect(missingId.result.processedBooks[0].source.publishReady).toBe(false);

    const missingDeathYear = buildSingleFixture({
      testInfo,
      slug: "missing-death-year",
      rawText: gutenbergFixtureText(),
      metadata: approvedMetadata("missing-death-year"),
      approvedPeople: {},
    });
    const missingDeathYearReport = JSON.parse(
      fs.readFileSync(
        path.join(
          missingDeathYear.generatedRoot,
          "missing-death-year",
          "rights_report.json",
        ),
        "utf8",
      ),
    ) as BookRightsReport;
    expect(missingDeathYearReport.author_death_year).toBeNull();
    expect(missingDeathYearReport.reasoning_summary).toContain(
      "Author death year is missing",
    );
    expect(missingDeathYear.result.processedBooks[0].source.publishReady).toBe(false);
  });

  test("rights gate flags copyright, license, translation, image, brand, and content risks", ({
  }, testInfo) => {
    const cases = [
      {
        slug: "copyright-risk",
        rawText: gutenbergFixtureText({
          extraHeader: "Copyright 1964 Example Estate. All rights reserved.",
        }),
        expectReport: (report: BookRightsReport) => {
          expect(report.contains_later_copyright_notice).toBe(true);
          expect(report.canada_us_v1_status).toBe("reject");
        },
      },
      {
        slug: "permission-risk",
        rawText: gutenbergFixtureText({
          extraHeader: "Used by permission of the publisher.",
        }),
        expectReport: (report: BookRightsReport) => {
          expect(report.contains_permission_based_language).toBe(true);
          expect(report.canada_us_v1_status).toBe("reject");
        },
      },
      {
        slug: "creative-commons-risk",
        rawText: gutenbergFixtureText({
          extraHeader: "Creative Commons Attribution 4.0",
        }),
        expectReport: (report: BookRightsReport) => {
          expect(report.contains_creative_commons_license).toBe(true);
          expect(report.canada_us_v1_status).toBe("reject");
        },
      },
      {
        slug: "translation-risk",
        rawText: gutenbergFixtureText({
          extraHeader:
            "Translator: Modern Translator\nIntroduction by Modern Scholar",
        }),
        expectReport: (report: BookRightsReport) => {
          expect(report.is_translation).toBe(true);
          expect(report.translation_risk).toBe("medium");
          expect(report.contains_modern_intro_or_notes).toBe(true);
          expect(report.processing_allowed).toBe(false);
        },
      },
      {
        slug: "image-risk",
        rawText: gutenbergFixtureText({
          body: "CHAPTER I\n\n[Illustration]\n\nStory text remains here.",
        }),
        expectReport: (report: BookRightsReport) => {
          expect(report.contains_illustrations_or_image_references).toBe(true);
          expect(report.canada_us_v1_status).toBe("needs_manual_review");
        },
      },
      {
        slug: "tarzan-risk",
        rawText: gutenbergFixtureText({
          title: "Tarzan Practice Sample",
          body: "CHAPTER I\n\nStory text remains here.",
        }),
        metadata: {
          ...approvedMetadata("tarzan-risk"),
          title: "Tarzan Practice Sample",
          subjects: ["Adventure fiction"],
        },
        expectReport: (report: BookRightsReport) => {
          expect(report.trademark_or_character_brand_risk).toBe("high");
          expect(report.processing_allowed).toBe(false);
        },
      },
      {
        slug: "content-brand-risk",
        rawText: gutenbergFixtureText({
          title: "Uncle Remus Practice Sample",
          body: "CHAPTER I\n\nStory text remains here.",
        }),
        metadata: {
          ...approvedMetadata("content-brand-risk"),
          title: "Uncle Remus Practice Sample",
          subjects: ["Dialect stories"],
        },
        expectReport: (report: BookRightsReport) => {
          expect(report.content_brand_safety_risk).toBe("medium");
          expect(report.trademark_or_character_brand_risk).toBe("none");
          expect(report.processing_allowed).toBe(false);
        },
      },
    ];

    for (const testCase of cases) {
      const { result, generatedRoot } = buildSingleFixture({
        testInfo,
        slug: testCase.slug,
        rawText: testCase.rawText,
        metadata: testCase.metadata ?? approvedMetadata(testCase.slug),
      });
      const report = JSON.parse(
        fs.readFileSync(
          path.join(generatedRoot, testCase.slug, "rights_report.json"),
          "utf8",
        ),
      ) as BookRightsReport;
      testCase.expectReport(report);
      expect(result.processedBooks[0].source.publishReady).toBe(false);
      expect(
        fs.existsSync(path.join(generatedRoot, testCase.slug, "processed_book.json")),
      ).toBe(false);
    }
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

  test("approval intake rejects invalid owner input without guessing rights data", ({
  }, testInfo) => {
    const textRoot = testInfo.outputPath("approval-invalid-library");
    const generatedRoot = testInfo.outputPath("approval-invalid-generated");
    writeFixtureBook(
      textRoot,
      "invalid-approval",
      gutenbergFixtureText({
        title: "Invalid Approval",
        author: "Invalid Author",
        gutenbergId: "5101",
        extraHeader: "Original publication: 1900",
        body: "CHAPTER I\n\nINVALID STORY TEXT SHOULD NOT APPEAR IN OWNER INPUT.",
      }),
      approvedMetadata("invalid-approval", {
        author: ["Invalid Author"],
        source: {
          ...approvedMetadata("invalid-approval").source,
          gutenbergId: "5101",
          rightsReviewed: false,
        },
      }),
    );
    writeOwnerPeopleApprovals(textRoot, [
      {
        slug: "invalid-author",
        name: "Invalid Author",
        roles: ["author"],
        deathYear: null,
        canadaLifePlus70Safe: false,
        reviewedByOwner: false,
        notes: "Invalid on purpose.",
      },
    ]);
    writeBookApprovals(textRoot, [
      {
        bookSlug: "invalid-approval",
        approvedForWebsite: true,
        originalPublicationYear: 1900,
        ownerReviewed: false,
      },
    ]);

    const result = applyBookReviewApprovals({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      generatedRoot,
      quiet: true,
    });

    expect(result.fatalErrors.join(" ")).toContain("deathYear must be a verified integer year");
    expect(result.fatalErrors.join(" ")).toContain("reviewedByOwner must be true");
    expect(result.fatalErrors.join(" ")).toContain("ownerReviewed must be true");
    expect(result.report.summary.invalidOwnerInputWarnings).toBeGreaterThan(0);
    expect(
      fs.existsSync(path.join(textRoot, "approved-metadata", "authors.json")),
    ).toBe(false);
    expect(JSON.stringify(readGeneratedTree(generatedRoot))).not.toContain(
      "INVALID STORY TEXT SHOULD NOT APPEAR IN OWNER INPUT",
    );
  });

  test("approval intake can apply a fully owner-approved safe fixture", ({
  }, testInfo) => {
    const textRoot = testInfo.outputPath("approval-safe-library");
    const generatedRoot = testInfo.outputPath("approval-safe-generated");
    const storyMarker = "SAFE OWNER APPROVAL STORY TEXT SHOULD STAY OUT OF OWNER INPUT";
    writeFixtureBook(
      textRoot,
      "owner-approved-safe",
      gutenbergFixtureText({
        title: "Owner Approved Safe",
        author: "Safe Author",
        gutenbergId: "5201",
        extraHeader: "Original publication: 1900",
        body: `CHAPTER I\n\n${storyMarker}.`,
      }),
      {
        ...approvedMetadata("owner-approved-safe", {
          author: ["Safe Author"],
          source: {
            ...approvedMetadata("owner-approved-safe").source,
            gutenbergId: "5201",
            rightsReviewed: false,
          },
        }),
        metadataStatus: "draft",
        manualReviewRequired: true,
        originalPublicationYear: null,
      },
    );
    writeOwnerPeopleApprovals(textRoot, [
      {
        slug: "safe-author",
        name: "Safe Author",
        roles: ["author"],
        deathYear: 1920,
        canadaLifePlus70Safe: true,
        reviewedByOwner: true,
        reviewDate: "2026-06-06",
        sourceNotes: "Fixture source checked by test owner.",
        notes: "Test-only owner person approval.",
      },
    ]);
    writeBookApprovals(textRoot, [
      {
        bookSlug: "owner-approved-safe",
        approvedForWebsite: true,
        approvedForYoutubeNarration: true,
        approvedRegions: ["US", "CA"],
        originalPublicationYear: 1900,
        ownerReviewed: true,
        notes: "Test-only owner book approval.",
      },
    ]);

    const applyResult = applyBookReviewApprovals({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      generatedRoot,
      quiet: true,
    });
    expect(applyResult.fatalErrors).toEqual([]);
    expect(applyResult.report.booksNewlyEligibleForProcessing).toContain(
      "owner-approved-safe",
    );
    expect(fs.existsSync(applyResult.paths.approvalApplicationReportJson)).toBe(true);
    expect(fs.existsSync(applyResult.paths.ownerInputDir)).toBe(true);

    const appliedMetadata = readJsonFile<BookMetadata>(
      path.join(textRoot, "meta", "owner-approved-safe.json"),
    );
    expect(appliedMetadata.metadataStatus).toBe("reviewed");
    expect(appliedMetadata.manualReviewRequired).toBe(false);
    expect(appliedMetadata.source.rightsReviewed).toBe(true);
    expect(appliedMetadata.originalPublicationYear).toBe(1900);

    const rightsReport = readJsonFile<BookRightsReport>(
      path.join(generatedRoot, "owner-approved-safe", "rights_report.json"),
    );
    expect(rightsReport.author_death_year).toBe(1920);
    expect(rightsReport.owner_reviewed_approval_present).toBe(true);
    expect(rightsReport.processing_allowed).toBe(true);

    const generatedText = JSON.stringify(readGeneratedTree(generatedRoot));
    expect(generatedText).not.toContain(storyMarker);
    expect(generatedText).not.toMatch(/\.(mp3|wav|webm|mp4)/);

    const build = buildBookLibrary({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      approvedPeoplePath: path.join(textRoot, "approved-metadata", "authors.json"),
      bookApprovalsPath: path.join(textRoot, "approved-metadata", "book-approvals.json"),
      generatedRoot: testInfo.outputPath("approval-safe-build-generated"),
      quiet: true,
    });
    expect(build.fatalErrors).toEqual([]);
    expect(build.processedBooks[0].source.publishReady).toBe(true);
    expect(build.processedBooks[0].source.processingAllowed).toBe(true);
  });

  test("approval intake keeps missing translator approval blocked", ({
  }, testInfo) => {
    const textRoot = testInfo.outputPath("approval-translator-library");
    const generatedRoot = testInfo.outputPath("approval-translator-generated");
    writeFixtureBook(
      textRoot,
      "translator-needs-review",
      gutenbergFixtureText({
        title: "Translator Needs Review",
        author: "Translated Author",
        gutenbergId: "5301",
        extraHeader: "Original publication: 1900\nTranslator: Modern Translator",
      }),
      approvedMetadata("translator-needs-review", {
        author: ["Translated Author"],
        source: {
          ...approvedMetadata("translator-needs-review").source,
          gutenbergId: "5301",
          rightsReviewed: false,
        },
      }),
    );
    writeOwnerPeopleApprovals(textRoot, [
      {
        slug: "translated-author",
        name: "Translated Author",
        roles: ["author"],
        deathYear: 1910,
        canadaLifePlus70Safe: true,
        reviewedByOwner: true,
        notes: "Author only; translator intentionally missing.",
      },
    ]);
    writeBookApprovals(textRoot, [
      {
        bookSlug: "translator-needs-review",
        approvedForWebsite: true,
        originalPublicationYear: 1900,
        ownerReviewed: true,
      },
    ]);

    const result = applyBookReviewApprovals({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      generatedRoot,
      quiet: true,
    });
    expect(result.fatalErrors).toEqual([]);
    const report = readJsonFile<BookRightsReport>(
      path.join(generatedRoot, "translator-needs-review", "rights_report.json"),
    );
    expect(report.translator).toBe("Modern Translator");
    expect(report.translator_death_year).toBeNull();
    expect(report.processing_allowed).toBe(false);
    expect(report.canada_us_v1_status).toBe("needs_manual_review");
  });

  test("approval intake requires owner duplicate resolution before duplicate books can proceed", ({
  }, testInfo) => {
    const textRoot = testInfo.outputPath("approval-duplicate-library");
    const generatedRoot = testInfo.outputPath("approval-duplicate-generated");
    const metadataOne = approvedMetadata("duplicate-approval-one", {
      title: "Duplicate Approval One",
      author: ["Duplicate Author"],
      source: {
        ...approvedMetadata("duplicate-approval-one").source,
        gutenbergId: "5401",
        rightsReviewed: false,
      },
    });
    const metadataTwo = approvedMetadata("duplicate-approval-two", {
      title: "Duplicate Approval Two",
      author: ["Duplicate Author"],
      source: {
        ...approvedMetadata("duplicate-approval-two").source,
        gutenbergId: "5401",
        rightsReviewed: false,
      },
    });
    writeFixtureBook(
      textRoot,
      "duplicate-approval-one",
      gutenbergFixtureText({
        title: "Duplicate Approval One",
        author: "Duplicate Author",
        gutenbergId: "5401",
        extraHeader: "Original publication: 1900",
      }),
      metadataOne,
    );
    writeFixtureBook(
      textRoot,
      "duplicate-approval-two",
      gutenbergFixtureText({
        title: "Duplicate Approval Two",
        author: "Duplicate Author",
        gutenbergId: "5401",
        extraHeader: "Original publication: 1900",
      }),
      metadataTwo,
    );
    writeOwnerPeopleApprovals(textRoot, [
      {
        slug: "duplicate-author",
        name: "Duplicate Author",
        roles: ["author"],
        deathYear: 1915,
        canadaLifePlus70Safe: true,
        reviewedByOwner: true,
        notes: "Test duplicate author approval.",
      },
    ]);
    writeBookApprovals(textRoot, [
      {
        bookSlug: "duplicate-approval-one",
        approvedForWebsite: true,
        originalPublicationYear: 1900,
        ownerReviewed: true,
      },
    ]);

    const unresolved = applyBookReviewApprovals({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      generatedRoot,
      quiet: true,
    });
    expect(unresolved.fatalErrors).toEqual([]);
    const unresolvedReport = readJsonFile<BookRightsReport>(
      path.join(generatedRoot, "duplicate-approval-one", "rights_report.json"),
    );
    expect(unresolvedReport.processing_allowed).toBe(false);
    expect(unresolvedReport.reasoning_summary).toContain("Duplicate Gutenberg ID");

    writeDuplicateResolutions(textRoot, [
      {
        gutenbergId: "5401",
        keepSlug: "duplicate-approval-one",
        duplicateSlugs: ["duplicate-approval-two"],
        resolution: "keep-one",
        reason: "Test owner resolution keeps one page for this source text.",
        ownerReviewed: true,
      },
    ]);

    const resolved = applyBookReviewApprovals({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      generatedRoot,
      quiet: true,
    });
    expect(resolved.fatalErrors).toEqual([]);
    const resolvedReport = readJsonFile<BookRightsReport>(
      path.join(generatedRoot, "duplicate-approval-one", "rights_report.json"),
    );
    expect(resolvedReport.processing_allowed).toBe(true);
    expect(resolved.report.booksNewlyEligibleForProcessing).toContain(
      "duplicate-approval-one",
    );
    const duplicateMetadata = readJsonFile<BookMetadata>(
      path.join(textRoot, "meta", "duplicate-approval-two.json"),
    );
    expect(duplicateMetadata.source.allowDuplicateGutenbergId).toBe(true);
  });

  test("approval intake cannot make rejected text public", ({
  }, testInfo) => {
    const textRoot = testInfo.outputPath("approval-rejected-library");
    const generatedRoot = testInfo.outputPath("approval-rejected-generated");
    writeFixtureBook(
      textRoot,
      "approval-rejected",
      gutenbergFixtureText({
        title: "Approval Rejected",
        author: "Rejected Author",
        gutenbergId: "5501",
        extraHeader: "Original publication: 1900\nCopyright 1964 Example Estate. All rights reserved.",
      }),
      approvedMetadata("approval-rejected", {
        author: ["Rejected Author"],
        source: {
          ...approvedMetadata("approval-rejected").source,
          gutenbergId: "5501",
          rightsReviewed: false,
        },
      }),
    );
    writeOwnerPeopleApprovals(textRoot, [
      {
        slug: "rejected-author",
        name: "Rejected Author",
        roles: ["author"],
        deathYear: 1900,
        canadaLifePlus70Safe: true,
        reviewedByOwner: true,
        notes: "Test person approval cannot override rejection.",
      },
    ]);
    writeBookApprovals(textRoot, [
      {
        bookSlug: "approval-rejected",
        approvedForWebsite: true,
        originalPublicationYear: 1900,
        ownerReviewed: true,
      },
    ]);

    const applyResult = applyBookReviewApprovals({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      generatedRoot,
      quiet: true,
    });
    expect(applyResult.fatalErrors).toEqual([]);
    const report = readJsonFile<BookRightsReport>(
      path.join(generatedRoot, "approval-rejected", "rights_report.json"),
    );
    expect(report.canada_us_v1_status).toBe("reject");
    expect(report.processing_allowed).toBe(false);

    const build = buildBookLibrary({
      textRoot,
      metadataRoot: path.join(textRoot, "meta"),
      approvedPeoplePath: path.join(textRoot, "approved-metadata", "authors.json"),
      bookApprovalsPath: path.join(textRoot, "approved-metadata", "book-approvals.json"),
      generatedRoot: testInfo.outputPath("approval-rejected-build-generated"),
      quiet: true,
    });
    expect(build.fatalErrors).toEqual([]);
    expect(build.processedBooks[0].source.publishReady).toBe(false);
    expect(
      fs.existsSync(
        path.join(
          testInfo.outputPath("approval-rejected-build-generated"),
          "approval-rejected",
          "processed_book.json",
        ),
      ),
    ).toBe(false);
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
    const rightsReportPath = path.join(
      ROOT,
      "app/client/assets/books/generated/alices-adventures-in-wonderland/rights_report.json",
    );
    const processingNotesPath = path.join(
      ROOT,
      "app/client/assets/books/generated/alices-adventures-in-wonderland/processing_notes.md",
    );
    const processedBookPath = path.join(
      ROOT,
      "app/client/assets/books/generated/alices-adventures-in-wonderland/processed_book.json",
    );

    const libraryManifest = JSON.parse(
      fs.readFileSync(libraryManifestPath, "utf8"),
    ) as Record<string, unknown>;
    const bookManifest = JSON.parse(
      fs.readFileSync(bookManifestPath, "utf8"),
    ) as {
      slug: string;
      source: {
        publishReady: boolean;
        rightsReviewed: boolean;
        sourceUrl: string | null;
        rightsStatus: string;
        processingAllowed: boolean;
        rightsReportPath: string;
      };
      sections: Array<{ kind: string; includeByDefault: boolean }>;
    };
    const firstChapter = JSON.parse(
      fs.readFileSync(firstChapterPath, "utf8"),
    ) as Record<string, unknown>;
    const rightsReport = JSON.parse(
      fs.readFileSync(rightsReportPath, "utf8"),
    ) as BookRightsReport;
    const processingNotes = fs.readFileSync(processingNotesPath, "utf8");

    expect(JSON.stringify(libraryManifest)).not.toContain("morseSourceText");
    expect(bookManifest.slug).toBe("alices-adventures-in-wonderland");
    expect(bookManifest.source.rightsReviewed).toBe(false);
    expect(bookManifest.source.publishReady).toBe(false);
    expect(bookManifest.source.sourceUrl).toBe("https://www.gutenberg.org/ebooks/11");
    expect(bookManifest.source.rightsStatus).toBe("needs_manual_review");
    expect(bookManifest.source.processingAllowed).toBe(false);
    expect(bookManifest.source.rightsReportPath).toBe("rights_report.json");
    expect(rightsReport.source_url).toBe("https://www.gutenberg.org/ebooks/11");
    expect(rightsReport.processing_allowed).toBe(false);
    expect(rightsReport.canada_us_v1_status).toBe("needs_manual_review");
    expect(processingNotes).toContain("Approval status: needs_manual_review");
    expect(processingNotes).toContain("processed_book.json emitted: no");
    expect(fs.existsSync(processedBookPath)).toBe(false);
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
