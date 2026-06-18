import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type GeneratedBookManifest = {
  slug: string;
  title: string;
  author: string[];
  sections: Array<{
    id: string;
    kind: string;
    label: string;
    title: string | null;
    includeByDefault: boolean;
    sectionJsonPath: string;
  }>;
};

type GeneratedBookSection = {
  sectionId: string;
  kind: string;
  label: string;
  title: string | null;
  includeByDefault: boolean;
  displayText?: string;
  morseSourceText?: string;
};

type PreviewAsset = {
  slug: string;
  defaultSectionId: string;
  defaultSectionLabel: string;
  defaultSectionTitle: string | null;
  previewText: string;
};

type CheckedSlug =
  | "the-book-of-dragons"
  | "the-emerald-city-of-oz"
  | "the-call-of-the-wild"
  | "the-elderbush"
  | "the-old-house"
  | "the-snow-queen"
  | "the-swineherd"
  | "the-winning-of-olwen";

type BookVerdict =
  | "acceptable"
  | "corrected"
  | "acceptance revoked pending correction"
  | "needs manual review";

type BookFollowup = {
  slug: CheckedSlug;
  rawSourceFileUsed: string;
  generatedTitle: string;
  generatedAuthor: string[];
  currentSectionLabels: string[];
  firstDefaultSection: {
    id: string;
    kind: string;
    label: string;
    title: string | null;
  } | null;
  firstDefaultSnippet: string | null;
  previewStartSnippet: string | null;
  genericPartLabelsJustified: boolean;
  genericPartLabelExplanation: string;
  meaningfulSourceHeadingsExist: boolean;
  meaningfulSourceHeadingExamples: string[];
  titleSourceBylineIllustrationMetadataLeaksIntoDefaultPlayback: boolean;
  selectedSourceOrderIsCorrect: boolean;
  evidence: string[];
  warnings: string[];
  verdict: BookVerdict;
};

type FollowupReport = {
  reportName: "manual-ui-defect-followup-1";
  generatedAt: string;
  scope: string;
  checkedSlugs: CheckedSlug[];
  summary: {
    checked: number;
    acceptable: number;
    corrected: number;
    acceptanceRevokedPendingCorrection: number;
    needsManualReview: number;
  };
  books: BookFollowup[];
  protectedPaths: {
    rawSources: string;
    cloudflareExport: string;
  };
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const tempBooksRoot = path.join(repoRoot, "app/client/assets/temp-books");
const previewRoot = path.join(repoRoot, "public/book-previews");
const reportRoot = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/manual-ui-defect-followup-1",
);
const reportJsonPath = path.join(reportRoot, "manual-ui-defect-followup-1.json");
const reportMdPath = path.join(reportRoot, "manual-ui-defect-followup-1.md");

const checkedSlugs: CheckedSlug[] = [
  "the-book-of-dragons",
  "the-emerald-city-of-oz",
  "the-call-of-the-wild",
  "the-elderbush",
  "the-old-house",
  "the-snow-queen",
  "the-swineherd",
  "the-winning-of-olwen",
];

const sourceFileOverrides: Record<CheckedSlug, string> = {
  "the-book-of-dragons": "the-book-of-dragons.txt",
  "the-emerald-city-of-oz": "the-emerald-city-of-oz.txt",
  "the-call-of-the-wild": "The call of the wild.txt",
  "the-elderbush": "The Elderbush.txt",
  "the-old-house": "The Old House.txt",
  "the-snow-queen": "THE SNOW QUEEN.txt",
  "the-swineherd": "The Swineherd.txt",
  "the-winning-of-olwen": "The Winning of Olwen.txt",
};

const expectedStoryTitles: Partial<Record<CheckedSlug, string[]>> = {
  "the-book-of-dragons": [
    "The Book of Beasts",
    "Uncle James, or The Purple Stranger",
    "The Deliverers of Their Country",
    "The Ice Dragon, or Do as You Are Told",
    "The Island of the Nine Whirlpools",
    "The Dragon Tamers",
    "The Fiery Dragon",
    "Kind Little Edmund, or The Caves and the Cockatrice",
  ],
};

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeText(filePath: string, value: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, "utf8");
}

function assertInside(root: string, candidate: string) {
  const resolvedRoot = path.resolve(root);
  const resolvedCandidate = path.resolve(candidate);
  if (
    resolvedCandidate !== resolvedRoot &&
    !resolvedCandidate.startsWith(`${resolvedRoot}${path.sep}`)
  ) {
    throw new Error(`Refusing to read outside ${resolvedRoot}: ${resolvedCandidate}`);
  }
}

function compact(text: string | null | undefined, maxLength = 260) {
  const normalized = (text ?? "").replace(/\s+/g, " ").trim();
  if (!normalized) return null;
  return normalized.length <= maxLength
    ? normalized
    : `${normalized.slice(0, maxLength - 3)}...`;
}

function normalize(text: string | null | undefined) {
  return (text ?? "").replace(/\s+/g, " ").trim().toLowerCase();
}

function sectionText(section: GeneratedBookSection | null | undefined) {
  return (section?.morseSourceText || section?.displayText || "").trim();
}

function sourceLines(rawText: string) {
  return rawText.split(/\r?\n/).map((text, index) => ({
    lineNumber: index + 1,
    text,
    trimmed: text.trim(),
  }));
}

function meaningfulSourceHeadings(rawText: string) {
  const headings = sourceLines(rawText)
    .filter((line) =>
      /^(?:[IVX]+\.\s+\S|[0-9]+\.\s+\S|(?:FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH|EIGHTH)\s+STORY\b|CHAPTER\s+(?:[IVXLCDM]+|\d+)\b)/i.test(
        line.trimmed,
      ),
    )
    .map((line) => `${line.lineNumber}: ${line.trimmed}`);
  return [...new Set(headings)].slice(0, 12);
}

function metadataLeakText(text: string | null | undefined) {
  const normalized = text ?? "";
  return /\[Illustration[:\s]/i.test(normalized) ||
    /Project Gutenberg|START OF THE PROJECT GUTENBERG|END OF THE PROJECT GUTENBERG|Produced by|Release date:|Title:|Author:|Editor:|Transcriber/i.test(
      normalized,
    ) ||
    /^The Book of DRAGONS\s*$/m.test(normalized) ||
    /ANDERSEN'S FAIRY TALES|HANS ANDERSEN'S FAIRY TALES|THE LILAC FAIRY BOOK/i.test(
      normalized,
    );
}

function previewStartsWithFirstDefault(preview: PreviewAsset, firstDefaultText: string) {
  const previewStart = normalize(preview.previewText).slice(0, 160);
  const firstDefaultStart = normalize(firstDefaultText).slice(0, 160);
  return Boolean(previewStart && firstDefaultStart && firstDefaultStart.startsWith(previewStart.slice(0, 80)));
}

function readGeneratedBook(slug: CheckedSlug) {
  const bookDir = path.join(generatedRoot, slug);
  assertInside(generatedRoot, bookDir);
  const manifest = readJson<GeneratedBookManifest>(path.join(bookDir, "manifest.json"));
  const sections = manifest.sections.map((section) =>
    readJson<GeneratedBookSection>(path.join(bookDir, section.sectionJsonPath)),
  );
  return { manifest, sections };
}

function reportForSlug(slug: CheckedSlug): BookFollowup {
  const { manifest, sections } = readGeneratedBook(slug);
  const preview = readJson<PreviewAsset>(
    path.join(previewRoot, `${slug}.preview.json`),
  );
  const rawSourceFileUsed = sourceFileOverrides[slug];
  const rawSourcePath = path.join(tempBooksRoot, rawSourceFileUsed);
  assertInside(tempBooksRoot, rawSourcePath);
  const rawText = fs.readFileSync(rawSourcePath, "utf8");

  const firstDefaultSummary =
    manifest.sections.find((section) => section.includeByDefault) ?? null;
  const firstDefaultSection =
    sections.find((section) => section.sectionId === firstDefaultSummary?.id) ?? null;
  const firstDefaultText = sectionText(firstDefaultSection);
  const currentSectionLabels = manifest.sections.map((section) =>
    section.title ? `${section.label}: ${section.title}` : section.label,
  );
  const genericPartLabels = manifest.sections.filter((section) =>
    /^Part\s+\d+$/i.test(section.label),
  );
  const sourceHeadingExamples = meaningfulSourceHeadings(rawText);
  const meaningfulSourceHeadingsExist = sourceHeadingExamples.length > 0;
  const firstDefaultSnippet = compact(firstDefaultText);
  const previewStartSnippet = compact(preview.previewText);
  const firstDefaultLeaks = metadataLeakText(firstDefaultText);
  const previewLeaks = metadataLeakText(preview.previewText);
  const selectedSourceOrderIsCorrect =
    Boolean(firstDefaultSection) &&
    preview.defaultSectionId === firstDefaultSummary?.id &&
    previewStartsWithFirstDefault(preview, firstDefaultText);
  const expectedTitles = expectedStoryTitles[slug] ?? [];
  const missingExpectedTitles = expectedTitles.filter(
    (title) => !manifest.sections.some((section) => section.title === title),
  );
  const warnings: string[] = [];
  const evidence: string[] = [];

  if (missingExpectedTitles.length) {
    warnings.push(
      `Missing expected meaningful section titles: ${missingExpectedTitles.join("; ")}`,
    );
  }
  if (genericPartLabels.length && meaningfulSourceHeadingsExist) {
    warnings.push("Generic Part labels remain even though meaningful raw headings exist.");
  }
  if (firstDefaultLeaks || previewLeaks) {
    warnings.push("Metadata, byline, source, or illustration artifact leaks into default/preview text.");
  }
  if (!selectedSourceOrderIsCorrect) {
    warnings.push("Preview/default selected-source order does not start from the first default section.");
  }
  if (
    slug === "the-emerald-city-of-oz" &&
    firstDefaultSummary?.id !== "chapter-001"
  ) {
    warnings.push("Emerald City does not default-select the real opening chapter.");
  }
  if (
    slug === "the-call-of-the-wild" &&
    firstDefaultSummary?.id !== "chapter-001"
  ) {
    warnings.push("Call of the Wild does not default-select Chapter 1.");
  }

  if (slug === "the-book-of-dragons") {
    evidence.push(
      "Raw source contains title page and illustration captions before the first story; generated default starts at Story 1: The Book of Beasts.",
    );
    evidence.push(
      "Generated sections use story-level labels/titles and no generic Part labels.",
    );
  }
  if (slug === "the-emerald-city-of-oz") {
    evidence.push(
      "Generated default starts at chapter-001, Chapter 1: How the Nome King Became Angry.",
    );
  }
  if (slug === "the-call-of-the-wild") {
    evidence.push(
      "Runtime selected-source ordering is covered by the Call of the Wild saved-progress Playwright test.",
    );
  }
  if (
    [
      "the-elderbush",
      "the-old-house",
      "the-snow-queen",
      "the-swineherd",
      "the-winning-of-olwen",
    ].includes(slug)
  ) {
    evidence.push(
      "Generated title/default content use the individual story identity rather than parent collection title metadata.",
    );
  }

  const genericPartLabelsJustified = genericPartLabels.length === 0;
  const verdict: BookVerdict = warnings.length
    ? "acceptance revoked pending correction"
    : "acceptable";

  return {
    slug,
    rawSourceFileUsed: `app/client/assets/temp-books/${rawSourceFileUsed}`,
    generatedTitle: manifest.title,
    generatedAuthor: manifest.author,
    currentSectionLabels,
    firstDefaultSection: firstDefaultSummary
      ? {
          id: firstDefaultSummary.id,
          kind: firstDefaultSummary.kind,
          label: firstDefaultSummary.label,
          title: firstDefaultSummary.title,
        }
      : null,
    firstDefaultSnippet,
    previewStartSnippet,
    genericPartLabelsJustified,
    genericPartLabelExplanation: genericPartLabels.length
      ? meaningfulSourceHeadingsExist
        ? "Not justified: raw source has meaningful headings."
        : "Present; source heading evidence was not sufficient."
      : "No generic Part labels remain in checked generated output.",
    meaningfulSourceHeadingsExist,
    meaningfulSourceHeadingExamples: sourceHeadingExamples,
    titleSourceBylineIllustrationMetadataLeaksIntoDefaultPlayback:
      firstDefaultLeaks || previewLeaks,
    selectedSourceOrderIsCorrect,
    evidence,
    warnings,
    verdict,
  };
}

function markdownReport(report: FollowupReport) {
  const lines = [
    "# Manual UI Defect Follow-up 1",
    "",
    "Focused follow-up for manual UI reports involving title/default content, illustration artifacts, generic section labels, preview start, and selected-source order.",
    "",
    "## Summary",
    "",
    `- Checked: ${report.summary.checked}`,
    `- Acceptable: ${report.summary.acceptable}`,
    `- Corrected: ${report.summary.corrected}`,
    `- Acceptance revoked pending correction: ${report.summary.acceptanceRevokedPendingCorrection}`,
    `- Needs manual review: ${report.summary.needsManualReview}`,
    "",
    "## Checked Books",
    "",
    "| Slug | Verdict | First default | Preview/default order | Generic Part labels | Warnings |",
    "| --- | --- | --- | --- | --- | --- |",
    ...report.books.map((book) => {
      const firstDefault = book.firstDefaultSection
        ? `${book.firstDefaultSection.id} ${book.firstDefaultSection.label}${book.firstDefaultSection.title ? `: ${book.firstDefaultSection.title}` : ""}`
        : "none";
      return `| ${book.slug} | ${book.verdict} | ${firstDefault.replace(/\|/g, "\\|")} | ${book.selectedSourceOrderIsCorrect ? "correct" : "bad"} | ${book.genericPartLabelExplanation.replace(/\|/g, "\\|")} | ${book.warnings.join("; ").replace(/\|/g, "\\|") || "none"} |`;
    }),
    "",
    "## Evidence Details",
    "",
  ];

  for (const book of report.books) {
    lines.push(`### ${book.slug}`, "");
    lines.push(`- Raw source: ${book.rawSourceFileUsed}`);
    lines.push(`- Generated title: ${book.generatedTitle}`);
    lines.push(`- Generated author: ${book.generatedAuthor.join(", ") || "Unknown author"}`);
    lines.push(`- Current section labels: ${book.currentSectionLabels.join("; ")}`);
    lines.push(`- First default snippet: ${book.firstDefaultSnippet ?? "none"}`);
    lines.push(`- Preview start snippet: ${book.previewStartSnippet ?? "none"}`);
    lines.push(`- Meaningful source headings: ${book.meaningfulSourceHeadingsExist ? book.meaningfulSourceHeadingExamples.join("; ") : "none detected"}`);
    lines.push(`- Metadata/artifact leak into default playback: ${book.titleSourceBylineIllustrationMetadataLeaksIntoDefaultPlayback ? "yes" : "no"}`);
    lines.push(`- Selected-source order: ${book.selectedSourceOrderIsCorrect ? "correct" : "incorrect"}`);
    lines.push(`- Evidence: ${book.evidence.join(" ") || "No special evidence note."}`);
    lines.push("");
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

const books = checkedSlugs.map(reportForSlug);
const summary = {
  checked: books.length,
  acceptable: books.filter((book) => book.verdict === "acceptable").length,
  corrected: books.filter((book) => book.verdict === "corrected").length,
  acceptanceRevokedPendingCorrection: books.filter(
    (book) => book.verdict === "acceptance revoked pending correction",
  ).length,
  needsManualReview: books.filter((book) => book.verdict === "needs manual review").length,
};

const report: FollowupReport = {
  reportName: "manual-ui-defect-followup-1",
  generatedAt: new Date().toISOString(),
  scope:
    "Focused direct inspection of manual UI defect examples only; no new books processed.",
  checkedSlugs,
  summary,
  books,
  protectedPaths: {
    rawSources: "app/client/assets/temp-books was read-only for this pass.",
    cloudflareExport:
      "app/client/assets/books/cloudflare-export was not read for corrections or modified.",
  },
};

writeJson(reportJsonPath, report);
writeText(reportMdPath, markdownReport(report));

if (summary.acceptanceRevokedPendingCorrection || summary.needsManualReview) {
  throw new Error(
    `Manual UI defect follow-up found ${summary.acceptanceRevokedPendingCorrection} revoked and ${summary.needsManualReview} manual-review books.`,
  );
}

console.log(
  `Manual UI defect follow-up complete: ${summary.checked} checked, ${summary.acceptable} acceptable, ${summary.corrected} corrected, ${summary.acceptanceRevokedPendingCorrection} revoked, ${summary.needsManualReview} manual review.`,
);
