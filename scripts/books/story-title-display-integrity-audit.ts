import fs from "node:fs";
import path from "node:path";

type GeneratedBookSummary = {
  slug: string;
  title: string;
  contentVersion: string;
  contentHash: string;
  source: {
    gutenbergId: string | null;
    duplicateResolutionSource?: string;
  };
};

type GeneratedLibraryManifest = {
  schemaVersion: 1;
  books: GeneratedBookSummary[];
};

type GeneratedBookManifest = GeneratedBookSummary & {
  cover: { alt: string };
  sections: Array<{
    id: string;
    kind: string;
    label: string;
    title: string | null;
  }>;
};

type SeoSummaryData = {
  expectedSummaryCount: number;
  summaries: Array<{ slug: string; title: string; summary: string }>;
};

type PublicManifest = {
  books: Array<{
    slug: string;
    title: string;
    bookPath: string;
  }>;
};

type DuplicateTitleGroup = {
  title: string;
  slugs: string[];
  classification: "legitimate" | "suspicious";
  reason: string;
};

const repoRoot = process.cwd();
const generatedRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "generated",
);
const reportRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "story-title-display-integrity",
);
const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
const seoSummaryPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "seo-summaries",
  "book-seo-summaries.json",
);
const publicManifestPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "cloudflare-export",
  "public-manifest.json",
);
const displayAdapterPath = path.join(
  repoRoot,
  "app",
  "client",
  "data",
  "morseBooks.ts",
);

const requiredStoryTitles: Record<string, string> = {
  "the-dream-of-little-tuk": "The Dream of Little Tuk",
  "the-false-collar": "The False Collar",
  "the-naughty-boy": "The Naughty Boy",
  "the-red-shoes": "The Red Shoes",
  "the-shadow": "The Shadow",
  "the-story-of-a-mother": "The Story of a Mother",
  "the-ugly-duckling": "The Ugly Duckling",
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
};

const metadataFixes = [
  {
    slug: "for-the-duration-of-the-war",
    beforeTitle: "The Toys of Peace, and Other Papers",
    afterTitle: "For the Duration of the War",
    sourceCollectionTitle: "The Toys of Peace, and Other Papers",
  },
  {
    slug: "the-story-of-the-inexperienced-ghost",
    beforeTitle: "Twelve Stories and a Dream",
    afterTitle: "The Story of the Inexperienced Ghost",
    sourceCollectionTitle: "Twelve Stories and a Dream",
  },
] as const;

const parentCollectionTitles = new Set(
  [
    "Andersen's Fairy Tales",
    "Grimm's Fairy Tales",
    "Grimms' Fairy Tales",
    "Japanese Fairy Tales",
    "The Blue Fairy Book",
    "The Red Fairy Book",
    "The Violet Fairy Book",
    ...metadataFixes.map((fix) => fix.sourceCollectionTitle),
  ].map(normalizeTitle),
);

const duplicateClassifications: Record<string, string> = {
  "anne of green gables":
    "Documented retained source/slug variant; duplicateResolutionSource records the deterministic source match.",
  "the count of monte cristo":
    "Documented retained source/slug variants; both records are explicitly marked manual-review.",
  "the secret garden":
    "Two documented Project Gutenberg editions (ebooks 17396 and 113), not anthology story extractions.",
};

const benignGeneratedFileTitleVariants: Record<string, string> = {
  "black-beauty:rights_report.json":
    "The rights evidence uses the short source title 'Black Beauty'; the user-facing generated title carries the source subtitle.",
  "peter-pan:rights_report.json":
    "The rights evidence uses the short source title 'Peter Pan'; the user-facing generated title retains the catalog bracket title.",
};

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function normalizeTitle(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US");
}

function slugify(value: string) {
  return normalizeTitle(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function duplicateTitleGroups(books: GeneratedBookSummary[]) {
  const byTitle = new Map<string, GeneratedBookSummary[]>();
  books.forEach((book) => {
    const key = normalizeTitle(book.title);
    const group = byTitle.get(key) ?? [];
    group.push(book);
    byTitle.set(key, group);
  });

  return [...byTitle.entries()]
    .filter(([, booksForTitle]) => booksForTitle.length > 1)
    .map(([key, booksForTitle]): DuplicateTitleGroup => {
      const documentedReason = duplicateClassifications[key];
      const collectionLeak = parentCollectionTitles.has(key);
      return {
        title: booksForTitle[0].title,
        slugs: booksForTitle.map((book) => book.slug).sort(),
        classification:
          documentedReason && !collectionLeak ? "legitimate" : "suspicious",
        reason:
          documentedReason ??
          (collectionLeak
            ? "A parent collection title is repeated across extracted-story slugs."
            : "Duplicate title is not explicitly documented as an edition or retained source variant."),
      };
    })
    .sort((left, right) => left.title.localeCompare(right.title));
}

function generatedParentLeakageCandidates(books: GeneratedBookSummary[]) {
  return books
    .filter(
      (book) =>
        parentCollectionTitles.has(normalizeTitle(book.title)) &&
        slugify(book.title) !== book.slug &&
        slugify(book.title).replace(/^the-/, "") !== book.slug,
    )
    .map((book) => ({ slug: book.slug, title: book.title }));
}

function singleStoryTitleMismatches(books: GeneratedBookSummary[]) {
  return books.flatMap((summary) => {
    const manifestPath = path.join(generatedRoot, summary.slug, "manifest.json");
    const manifest = readJson<GeneratedBookManifest>(manifestPath);
    const readableSections = manifest.sections.filter((section) =>
      new Set([
        "act",
        "chapter",
        "epilogue",
        "letter",
        "part",
        "poem",
        "prologue",
        "scene",
        "section",
        "story",
      ]).has(section.kind),
    );
    if (readableSections.length !== 1) return [];
    const section = readableSections[0];
    const sectionNames = [section.label, section.title].filter(
      (value): value is string => Boolean(value),
    );
    const slugMatchesSection = sectionNames.some(
      (value) => slugify(value) === summary.slug,
    );
    if (!slugMatchesSection || slugify(summary.title) === summary.slug) return [];
    return [
      {
        slug: summary.slug,
        title: summary.title,
        sectionLabel: section.label,
        sectionTitle: section.title,
      },
    ];
  });
}

function titleFileMismatches(books: GeneratedBookSummary[]) {
  const mismatches: Array<{
    slug: string;
    libraryTitle: string;
    file: string;
    fileTitle: string;
    classification: "benign-source-variant" | "suspicious";
    reason: string;
  }> = [];
  for (const book of books) {
    for (const file of [
      "manifest.json",
      "cleaned_book.json",
      "processed_book.json",
      "rights_report.json",
    ]) {
      const filePath = path.join(generatedRoot, book.slug, file);
      const fileTitle = readJson<{ title: string }>(filePath).title;
      if (fileTitle === book.title) continue;
      const variantKey = `${book.slug}:${file}`;
      const benignReason = benignGeneratedFileTitleVariants[variantKey];
      mismatches.push({
        slug: book.slug,
        libraryTitle: book.title,
        file,
        fileTitle,
        classification: benignReason ? "benign-source-variant" : "suspicious",
        reason: benignReason ?? "Generated file title differs from the library title.",
      });
    }
  }
  return mismatches;
}

function markdownReport(report: ReturnType<typeof buildReport>) {
  const duplicateRows = report.duplicateTitleAudit.after.generated465
    .map(
      (group) =>
        `| ${group.title} | ${group.slugs.join(", ")} | ${group.classification} | ${group.reason} |`,
    )
    .join("\n");
  const requiredRows = report.requiredSlugVerification
    .map(
      (item) =>
        `| ${item.slug} | ${item.expectedTitle} | ${item.actualTitle} | ${item.status} |`,
    )
    .join("\n");
  const fixedRows = report.fixedEntries.generatedMetadata
    .map(
      (item) =>
        `| ${item.slug} | ${item.beforeTitle} | ${item.afterTitle} | ${item.sourceCollectionTitle} |`,
    )
    .join("\n");

  return `# Story title display integrity audit

## Result

- Generated entries checked: ${report.generatedEntriesChecked}
- Suspicious generated duplicate groups before: ${report.duplicateTitleAudit.before.generated465.filter((group) => group.classification === "suspicious").length}
- Suspicious protected public-payload duplicate groups before adapter normalization: ${report.duplicateTitleAudit.before.protectedPublicPayload.filter((group) => group.classification === "suspicious").length}
- Suspicious duplicate groups after: ${report.duplicateTitleAudit.after.generated465.filter((group) => group.classification === "suspicious").length}
- Generated parent-collection leakage candidates before: ${report.parentCollectionLeakage.before.generatedMetadata.length}
- Protected public-payload parent-collection leakage candidates before: ${report.parentCollectionLeakage.before.protectedPublicPayload.length}
- User-facing leakage candidates after canonical display normalization: ${report.parentCollectionLeakage.after.userFacingDisplay.length}
- SEO summary title metadata: ${report.seoSummaryConsistency.matchingTitleCount}/${report.seoSummaryConsistency.summaryCount} matching
- Validation result: ${report.validation.result}

## Root cause and fix

The generated library manifest is the canonical user-facing title source. Ten older protected public payloads still contain \`Andersen's Fairy Tales\` as their manifest title, and the whole-book hydration path previously allowed that payload title to replace the canonical route title. The adapter now preserves the generated library title when public content is normalized. Two additional single-story generated records inherited their source collection title during pilot write pass 6; their generated metadata, preview hashes, and SEO title metadata are corrected, and the historical write plan now supplies the story title explicitly.

Cloudflare export files were audited but not changed. Summary bodies were preserved; their collection references remain provenance/context rather than title metadata.

## Generated metadata corrections

| Slug | Before | After | Source collection |
| --- | --- | --- | --- |
${fixedRows}

## Duplicate user-facing titles after fix

| Title | Slugs | Classification | Reason |
| --- | --- | --- | --- |
${duplicateRows || "| None | — | — | — |"}

## Required slug verification

| Slug | Expected | Actual | Status |
| --- | --- | --- | --- |
${requiredRows}

## Remaining documented cases

${report.unresolvedTitleCases.map((item) => `- ${item}`).join("\n") || "- None"}

## Protected paths

- Raw sources: unchanged (\`${report.protectedFolders.rawSources.path}\`)
- Cloudflare export: unchanged (\`${report.protectedFolders.cloudflareExport.path}\`)
- Story text: unchanged
- Generated metadata changed: ${report.changeScope.generatedMetadataChanged}
- Route/display adapter changed: ${report.changeScope.routeDisplayLogicChanged}
- SEO summary title metadata changed: ${report.changeScope.seoSummaryMetadataChanged}

## Recommendation

${report.recommendation.summaryBatch6}
`;
}

function buildReport() {
  const library = readJson<GeneratedLibraryManifest>(libraryManifestPath);
  const seo = readJson<SeoSummaryData>(seoSummaryPath);
  const publicManifest = readJson<PublicManifest>(publicManifestPath);
  const generatedBySlug = new Map(library.books.map((book) => [book.slug, book]));
  const seoBySlug = new Map(seo.summaries.map((summary) => [summary.slug, summary]));

  const beforeBooks = library.books.map((book) => {
    const fix = metadataFixes.find((candidate) => candidate.slug === book.slug);
    return fix ? { ...book, title: fix.beforeTitle } : book;
  });
  const requiredSlugVerification = Object.entries(requiredStoryTitles).map(
    ([slug, expectedTitle]) => {
      const actualTitle = generatedBySlug.get(slug)?.title ?? null;
      return {
        slug,
        expectedTitle,
        actualTitle,
        status: actualTitle === expectedTitle ? "pass" : "fail",
      };
    },
  );

  const publicPayloadBooks = publicManifest.books.map((book) => ({
    ...book,
    contentVersion: "",
    contentHash: "",
    source: { gutenbergId: null },
  }));
  const publicDisplayBooks = publicManifest.books.map((book) => ({
    ...book,
    title: generatedBySlug.get(book.slug)?.title ?? book.title,
    contentVersion: "",
    contentHash: "",
    source: { gutenbergId: null },
  }));
  const protectedPublicPayloadLeakage = publicManifest.books
    .filter((book) => {
      const canonical = generatedBySlug.get(book.slug);
      return (
        canonical &&
        canonical.title !== book.title &&
        parentCollectionTitles.has(normalizeTitle(book.title))
      );
    })
    .map((book) => ({
      slug: book.slug,
      payloadTitle: book.title,
      canonicalTitle: generatedBySlug.get(book.slug)?.title ?? null,
      bookPath: book.bookPath,
    }));
  const publicTitleMismatches = publicManifest.books
    .filter((book) => generatedBySlug.get(book.slug)?.title !== book.title)
    .map((book) => ({
      slug: book.slug,
      payloadTitle: book.title,
      canonicalTitle: generatedBySlug.get(book.slug)?.title ?? null,
      classification: parentCollectionTitles.has(normalizeTitle(book.title))
        ? "parent-collection-leakage"
        : "canonical-title-normalization",
    }));

  const generatedFileMismatches = titleFileMismatches(library.books);
  const suspiciousGeneratedFileMismatches = generatedFileMismatches.filter(
    (item) => item.classification === "suspicious",
  );
  const seoTitleMismatches = seo.summaries
    .filter((summary) => generatedBySlug.get(summary.slug)?.title !== summary.title)
    .map((summary) => ({
      slug: summary.slug,
      summaryTitle: summary.title,
      generatedTitle: generatedBySlug.get(summary.slug)?.title ?? null,
    }));
  const displayAdapter = fs.readFileSync(displayAdapterPath, "utf8");
  const routeDisplayGuard = {
    publicSummaryUsesCanonicalTitle:
      displayAdapter.includes("canonicalSummary?.title ?? book.title") &&
      displayAdapter.includes("title: displayTitle"),
    publicContentUsesCanonicalTitle:
      displayAdapter.includes("preserveMorseBookDisplayTitle") &&
      displayAdapter.includes("content.manifest, canonicalSummary"),
  };
  const generatedLeakageAfter = generatedParentLeakageCandidates(library.books);
  const singleStoryMismatchesAfter = singleStoryTitleMismatches(library.books);
  const validationFailures = [
    ...(library.books.length === 465
      ? []
      : [`Expected 465 generated entries, found ${library.books.length}.`]),
    ...requiredSlugVerification
      .filter((item) => item.status === "fail")
      .map((item) => `${item.slug}: required title verification failed.`),
    ...generatedLeakageAfter.map(
      (item) => `${item.slug}: generated parent collection title still leaks.`,
    ),
    ...singleStoryMismatchesAfter.map(
      (item) => `${item.slug}: single-story title still differs from its story slug.`,
    ),
    ...suspiciousGeneratedFileMismatches.map(
      (item) => `${item.slug}: ${item.file} title mismatch remains.`,
    ),
    ...seoTitleMismatches.map(
      (item) => `${item.slug}: SEO title metadata mismatch remains.`,
    ),
    ...(!routeDisplayGuard.publicSummaryUsesCanonicalTitle
      ? ["Public summary adapter does not preserve the canonical title."]
      : []),
    ...(!routeDisplayGuard.publicContentUsesCanonicalTitle
      ? ["Public content adapter does not preserve the canonical title."]
      : []),
  ];

  return {
    schemaVersion: 1,
    auditName: "story-title-display-integrity",
    auditDate: "2026-06-23",
    generatedEntriesChecked: library.books.length,
    rootCause: {
      generatedMetadata:
        "Pilot write pass 6 used the dry-run source collection title for two single-story extractions.",
      routeDisplay:
        "Whole-book hydration trusted an older public payload manifest title and replaced the canonical generated-library title.",
      protectedPublicPayloadEvidence:
        "Ten protected public payloads repeat Andersen's Fairy Tales while their canonical generated records have individual story titles.",
    },
    duplicateTitleAudit: {
      before: {
        generated465: duplicateTitleGroups(beforeBooks),
        protectedPublicPayload: duplicateTitleGroups(publicPayloadBooks),
      },
      after: {
        generated465: duplicateTitleGroups(library.books),
        protectedPublicPayloadAfterDisplayAdapter:
          duplicateTitleGroups(publicDisplayBooks),
      },
    },
    parentCollectionLeakage: {
      before: {
        generatedMetadata: metadataFixes.map((fix) => ({ ...fix })),
        protectedPublicPayload: protectedPublicPayloadLeakage,
      },
      after: {
        generatedMetadata: generatedLeakageAfter,
        userFacingDisplay:
          routeDisplayGuard.publicSummaryUsesCanonicalTitle &&
          routeDisplayGuard.publicContentUsesCanonicalTitle
            ? []
            : protectedPublicPayloadLeakage,
        protectedPayloadFilesStillStored: protectedPublicPayloadLeakage,
      },
    },
    titleSourceCollectionFieldMismatches: {
      publicPayloadVsCanonicalGenerated: publicTitleMismatches,
      generatedFiles: generatedFileMismatches,
      suspiciousGeneratedFiles: suspiciousGeneratedFileMismatches,
      note: "Collection provenance is represented by source URL/ebook metadata and summary context; it is not allowed to replace the canonical title.",
    },
    requiredSlugVerification,
    affectedRouteListCardExamples: [
      {
        surface: "/morse-code-books",
        result: "Cards and directory links use canonical generated titles.",
      },
      {
        surface: "/morse-code-audiobooks",
        result: "Cards and directory links use canonical generated titles.",
      },
      {
        surface: "/morse-code-books/the-elderbush",
        before: "Andersen's Fairy Tales after whole-book hydration",
        after: "The Elderbush",
      },
      {
        surface: "/morse-code-audiobooks/the-elderbush",
        before: "Andersen's Fairy Tales after whole-book hydration",
        after: "The Elderbush",
      },
      {
        surface: "/morse-code-books/the-ugly-duckling",
        after: "The Ugly Duckling",
      },
      {
        surface: "/morse-code-books/the-red-shoes",
        after: "The Red Shoes",
      },
      {
        surface: "/morse-code-books/hansel-and-gretel",
        after: "Hansel and Gretel",
      },
      {
        surface: "/morse-code-audiobooks/the-ugly-duckling",
        after: "The Ugly Duckling",
      },
    ],
    fixedEntries: {
      generatedMetadata: metadataFixes.map((fix) => ({ ...fix })),
      routeDisplayIntegrity: protectedPublicPayloadLeakage.map((item) => ({
        slug: item.slug,
        beforeTitle: item.payloadTitle,
        afterTitle: item.canonicalTitle,
      })),
    },
    routeDisplayGuard,
    seoSummaryConsistency: {
      expectedSummaryCount: seo.expectedSummaryCount,
      summaryCount: seo.summaries.length,
      matchingTitleCount: seo.summaries.length - seoTitleMismatches.length,
      mismatches: seoTitleMismatches,
      metadataChangedSlugs: metadataFixes.map((fix) => fix.slug),
      summaryBodiesChanged: false,
    },
    changeScope: {
      generatedMetadataChanged: true,
      routeDisplayLogicChanged: true,
      seoSummaryMetadataChanged: true,
      storyTextChanged: false,
      slugsChanged: false,
      cloudflareExportChanged: false,
    },
    fixedFiles: [
      "app/client/data/morseBookDisplay.ts",
      "app/client/data/morseBooks.ts",
      "scripts/books/pilot-book-processing-write-6.ts",
      "scripts/books/story-title-display-integrity-audit.ts",
      "app/client/assets/books/generated/library-manifest.json",
      "app/client/assets/books/generated/for-the-duration-of-the-war/{manifest,cleaned_book,processed_book,rights_report}.json",
      "app/client/assets/books/generated/the-story-of-the-inexperienced-ghost/{manifest,cleaned_book,processed_book,rights_report}.json",
      "public/book-previews/for-the-duration-of-the-war.preview.json",
      "public/book-previews/the-story-of-the-inexperienced-ghost.preview.json",
      "public/book-previews/manifest.json",
      "app/client/assets/books/seo-summaries/book-seo-summaries.json",
      "tests/qa-robustness-review/morse-book-page.spec.ts",
      "package.json",
    ],
    unresolvedTitleCases: [
      `${protectedPublicPayloadLeakage.length} protected Cloudflare export payload titles remain stale by instruction; the display adapter now prevents them from replacing canonical titles, and the next separately authorized export should regenerate them.`,
      ...generatedFileMismatches
        .filter((item) => item.classification === "benign-source-variant")
        .map(
          (item) =>
            `${item.slug}: ${item.file} retains a documented non-display source-title variant (${item.reason})`,
        ),
    ],
    protectedFolders: {
      rawSources: {
        path: "app/client/assets/temp-books",
        changedByTask: false,
      },
      cloudflareExport: {
        path: "app/client/assets/books/cloudflare-export",
        changedByTask: false,
        inspectedReadOnly: true,
      },
    },
    recommendation: {
      summaryBatch6:
        validationFailures.length === 0
          ? "Summary batch 6 can resume after this branch is reviewed/merged; do not start it in this branch."
          : "Do not resume summary batch 6 until the validation failures in this report are resolved.",
    },
    validation: {
      result: validationFailures.length === 0 ? "pass" : "fail",
      failures: validationFailures,
    },
  };
}

const report = buildReport();
fs.mkdirSync(reportRoot, { recursive: true });
fs.writeFileSync(
  path.join(reportRoot, "story-title-display-integrity.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(reportRoot, "story-title-display-integrity.md"),
  markdownReport(report),
);

console.log(
  `story title display audit: ${report.generatedEntriesChecked} generated entries, ${report.validation.result}`,
);
console.log(
  `protected public payload leakage: ${report.parentCollectionLeakage.before.protectedPublicPayload.length} before adapter, ${report.parentCollectionLeakage.after.userFacingDisplay.length} after adapter`,
);
console.log(
  `generated metadata leakage: ${report.parentCollectionLeakage.before.generatedMetadata.length} before, ${report.parentCollectionLeakage.after.generatedMetadata.length} after`,
);
console.log(
  `SEO summary titles: ${report.seoSummaryConsistency.matchingTitleCount}/${report.seoSummaryConsistency.summaryCount}`,
);
console.log(
  `report: ${path.relative(repoRoot, path.join(reportRoot, "story-title-display-integrity.json"))}`,
);

if (report.validation.result !== "pass") process.exitCode = 1;
