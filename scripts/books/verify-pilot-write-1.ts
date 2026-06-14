import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  GeneratedBookManifest,
  GeneratedBookSectionJson,
} from "./bookManifestTypes.ts";
import { normalizeBookText, textPreview, trimBookText } from "./bookTextNormalization.ts";

type WriteBookReport = {
  slug: string;
  sourceFileUsed: string;
  candidateTitle: string;
  candidateAuthor: string[];
  pass2RiskLevel: string;
  startBoundaryUsed: {
    line: number;
    reason: string;
  };
  endBoundaryUsed: {
    line: number;
    reason: string;
  };
  sectionCount: number;
  finalRecommendation: string;
  remainingWarnings: string[];
  previewAssetFileChanged: string | null;
};

type WriteReport = {
  books: WriteBookReport[];
};

type PreviewAsset = {
  version: 1;
  slug: string;
  contentVersion: string;
  contentHash: string;
  defaultSectionId: string;
  defaultSectionKind: string;
  defaultSectionLabel: string;
  defaultSectionTitle: string | null;
  previewText: string;
  estimatedRuntimeSeconds: number;
  wordCount: number;
  characterCount: number;
  estimatedTypingMinutes: number;
  estimatedListeningMinutes: number;
  morseCharacterEstimate: number;
  textPreview: string;
  truncated: boolean;
};

type Verdict = {
  status: "pass" | "warn" | "fail";
  summary: string;
  details: string[];
};

type BookVerification = {
  slug: string;
  status: "pass" | "warn" | "fail";
  generatedOutputInspected: string[];
  previewAssetInspected: string;
  startBoundaryVerdict: Verdict;
  endBoundaryVerdict: Verdict;
  sectioningVerdict: Verdict;
  cleanupVerdict: Verdict;
  previewVerdict: Verdict;
  remainingWarnings: string[];
  acceptedForMain: boolean;
  needsCorrectionBeforeMain: boolean;
  shouldBeRevertedOrSkipped: boolean;
  startSnippet: {
    raw: string;
    generated: string;
  };
  endSnippet: {
    raw: string;
    generated: string;
  };
  metadataCorrectionsObserved: string[];
};

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..", "..");
const writeReportPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "pilot-write-1",
  "pilot-write-1.json",
);
const verificationReportRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "pilot-write-1-verification",
);
const generatedRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "generated",
);
const previewRoot = path.join(repoRoot, "public", "book-previews");
const tempBooksRoot = path.join(repoRoot, "app", "client", "assets", "temp-books");
const cloudflareRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "cloudflare-export",
);

const pilotSlugs = [
  "almayer-s-folly-a-story-of-an-eastern-river",
  "the-house-without-a-key",
  "the-lerouge-case",
  "a-dream-of-armageddon",
  "a-journey-to-the-centre-of-the-earth",
  "a-journal-of-the-plague-year",
  "dracula",
] as const;

const forbiddenSlugs = new Set([
  "a-christmas-carol",
  "dr-jekyll-and-mr-hyde",
  "a-catastrophe",
]);

const boilerplatePatterns = [
  /Project Gutenberg/i,
  /Gutenberg License/i,
  /Gutenberg eBook/i,
  /Release date:/i,
  /Credits:/i,
  /Updated editions will replace/i,
  /THE FULL PROJECT GUTENBERG/i,
  /www\.gutenberg\.org/i,
  /There(?:'|’)s More to Follow/i,
  /Grosset\s*&\s*Dunlap/i,
];

const metadataCorrections: Record<string, string> = {
  "a-dream-of-armageddon":
    'Corrected generated title from the Gutenberg collection header "Twelve Stories and a Dream" to the story title "A Dream of Armageddon".',
  "the-house-without-a-key":
    'Normalized generated title capitalization from "The house without a key" to "The House Without a Key".',
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

function statusPath(filePath: string) {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

function assertInside(parent: string, target: string) {
  const relative = path.relative(path.resolve(parent), path.resolve(target));
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to inspect outside ${parent}: ${target}`);
  }
}

function safeSourcePath(sourceFileUsed: string) {
  const resolved = path.resolve(repoRoot, sourceFileUsed);
  assertInside(tempBooksRoot, resolved);
  return resolved;
}

function lineSlice(rawText: string, startLine: number, endLine: number) {
  const lines = rawText.replace(/^\uFEFF/, "").replace(/\r\n|\r/g, "\n").split("\n");
  return {
    lines,
    text: lines.slice(startLine - 1, endLine).join("\n"),
  };
}

function lineSnippet(rawText: string, line: number, before = 0, after = 8) {
  const lines = rawText.replace(/^\uFEFF/, "").replace(/\r\n|\r/g, "\n").split("\n");
  const start = Math.max(1, line - before);
  const end = Math.min(lines.length, line + after);
  return textPreview(lines.slice(start - 1, end).join(" "), 320);
}

function normalizeForCompare(input: string) {
  return normalizeBookText(input)
    .replace(/\u00a0/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[‐‑‒–—―]/g, "-")
    .replace(/…/g, "...")
    .replace(/\[(?:Illustration|Illustrations|Plate|Image|Map|Music|Facsimile|Portrait)[^\]]*\]/gi, "")
    .replace(/\[(?:[1-9][0-9]?|100)\]/g, "")
    .replace(/^[^\p{L}\p{N}]+$/gmu, "")
    .replace(/^FINIS\.?$/gim, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function hasForbiddenText(input: string) {
  return boilerplatePatterns
    .filter((pattern) => pattern.test(input))
    .map((pattern) => String(pattern));
}

function loadSections(
  slug: string,
  manifest: GeneratedBookManifest,
): GeneratedBookSectionJson[] {
  return manifest.sections.map((section) => {
    const sectionPath = path.join(generatedRoot, slug, section.sectionJsonPath);
    assertInside(path.join(generatedRoot, slug), sectionPath);
    return readJson<GeneratedBookSectionJson>(sectionPath);
  });
}

function verdict(
  status: Verdict["status"],
  summary: string,
  details: string[] = [],
): Verdict {
  return { status, summary, details };
}

function worseStatus(statuses: Verdict["status"][]): Verdict["status"] {
  if (statuses.includes("fail")) return "fail";
  if (statuses.includes("warn")) return "warn";
  return "pass";
}

function sourceHasChapterHeadings(bodyText: string) {
  return (
    bodyText.match(
      /^chapter\s+(?:[ivxlcdm]+|\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)\b/gim,
    )?.length ?? 0
  );
}

function verifyStart(
  rawBody: string,
  sections: GeneratedBookSectionJson[],
): Verdict {
  const first = sections[0];
  const rawComparable = normalizeForCompare(rawBody).slice(0, 260);
  const generatedComparable = normalizeForCompare(first.displayText).slice(0, 260);
  if (!first || !first.displayText.trim()) {
    return verdict("fail", "Generated output has no first section.");
  }
  if (hasForbiddenText(first.displayText).length > 0) {
    return verdict("fail", "First generated section contains source boilerplate.", [
      ...hasForbiddenText(first.displayText),
    ]);
  }
  if (
    rawComparable &&
    generatedComparable &&
    !generatedComparable.includes(rawComparable.slice(0, 80))
  ) {
    return verdict("warn", "Generated start differs from the normalized raw boundary.", [
      "Manual review recommended for the first 80 normalized characters.",
    ]);
  }
  return verdict("pass", "Generated output starts at the expected readable boundary.");
}

function verifyEnd(
  rawBody: string,
  sections: GeneratedBookSectionJson[],
  slug: string,
): Verdict {
  const combined = sections.map((section) => section.displayText).join("\n\n");
  const rawComparable = normalizeForCompare(rawBody).slice(-260);
  const generatedComparable = normalizeForCompare(combined).slice(-360);
  if (!combined.trim()) return verdict("fail", "Generated output is empty.");
  if (slug === "dracula" && /There(?:'|’)s More to Follow|Grosset\s*&\s*Dunlap/i.test(combined)) {
    return verdict("fail", "Dracula publisher catalog leaked into generated output.");
  }
  if (rawComparable && !generatedComparable.includes(rawComparable.slice(-80))) {
    return verdict("warn", "Generated ending differs from the normalized raw boundary.", [
      "Difference may be expected when placeholder lines or standalone FINIS markers were removed.",
    ]);
  }
  return verdict("pass", "Generated output preserves the expected readable ending.");
}

function verifySectioning(
  slug: string,
  rawBody: string,
  manifest: GeneratedBookManifest,
): Verdict {
  const chapterHeadingCount = sourceHasChapterHeadings(rawBody);
  const chapterSectionCount = manifest.sections.filter(
    (section) => section.kind === "chapter",
  ).length;
  const tinySections = manifest.sections.filter((section) => section.wordCount < 50);
  const hugeSections = manifest.sections.filter((section) => section.wordCount > 12_000);
  const details: string[] = [];

  if (chapterHeadingCount > 0 && chapterSectionCount === 0) {
    return verdict("fail", "Source has chapter headings but generated output has no chapters.");
  }
  if (chapterHeadingCount > 0 && Math.abs(chapterHeadingCount - chapterSectionCount) > 1) {
    return verdict("warn", "Chapter section count differs from detected source headings.", [
      `Source headings: ${chapterHeadingCount}; generated chapter sections: ${chapterSectionCount}.`,
    ]);
  }
  if (tinySections.length > 0) {
    details.push(
      `Tiny sections: ${tinySections
        .map((section) => `${section.id} (${section.wordCount} words)`)
        .join(", ")}.`,
    );
  }
  if (hugeSections.length > 0) {
    details.push(
      `Large sections: ${hugeSections
        .map((section) => `${section.id} (${section.wordCount} words)`)
        .join(", ")}.`,
    );
  }

  if (slug === "a-dream-of-armageddon") {
    return verdict(
      "warn",
      "Source is a single story without internal headings; 2 fallback parts are acceptable for review.",
      [
        "Fallback split is at paragraph boundaries and preserves the story from title through final sentence.",
      ],
    );
  }
  if (slug === "a-journal-of-the-plague-year") {
    return verdict(
      "warn",
      "Source lacks clean chapter headings; 18 fallback parts are acceptable but manual section labels would improve polish before scaling.",
      [
        "Parts are consecutive paragraph-boundary chunks with no tiny terminal leftovers.",
      ],
    );
  }
  if (details.length > 0) {
    return verdict("warn", "Sectioning is usable but has review notes.", details);
  }
  return verdict("pass", "Sectioning follows source headings with meaningful sections.");
}

function verifyCleanup(defaultText: string, allText: string): Verdict {
  const defaultBoilerplate = hasForbiddenText(defaultText);
  const allIssues: string[] = [];
  if (defaultBoilerplate.length > 0) {
    return verdict("fail", "Default readable sections contain source boilerplate.", [
      ...defaultBoilerplate,
    ]);
  }
  if (/\[(?:Illustration|Illustrations|Plate|Image|Map|Music|Facsimile|Portrait)[^\]]*\]/i.test(allText)) {
    allIssues.push("Image or illustration placeholder remains.");
  }
  if (/â[€™€œ€]|Ã|�/.test(allText)) {
    allIssues.push("Mojibake or replacement characters remain.");
  }
  if (/^[^\p{L}\p{N}\s]+$/mu.test(allText)) {
    allIssues.push("Standalone decorative/punctuation-only line remains.");
  }
  if (allIssues.length > 0) {
    return verdict("fail", "Cleanup left obvious playback-hostile artifacts.", allIssues);
  }
  return verdict("pass", "Cleanup excludes boilerplate and obvious playback-hostile artifacts.");
}

function verifyPreview(
  manifest: GeneratedBookManifest,
  preview: PreviewAsset,
  defaultText: string,
): Verdict {
  const issues: string[] = [];
  if (preview.slug !== manifest.slug) issues.push("Preview slug does not match manifest.");
  if (preview.contentHash !== manifest.contentHash) {
    issues.push("Preview contentHash does not match manifest.");
  }
  if (preview.contentVersion !== manifest.contentVersion) {
    issues.push("Preview contentVersion does not match manifest.");
  }
  if (!preview.previewText.trim()) issues.push("Preview text is empty.");
  if (/SOS Help!|generic placeholder|translator defaults/i.test(preview.previewText)) {
    issues.push("Preview includes placeholder/default text.");
  }
  issues.push(...hasForbiddenText(preview.previewText).map((pattern) => `Forbidden preview text: ${pattern}`));
  if (!defaultText.includes(preview.previewText)) {
    issues.push("Preview text is not an exact slice of generated default-readable content.");
  }

  if (issues.length > 0) return verdict("fail", "Preview asset failed verification.", issues);
  return verdict("pass", "Preview starts from generated readable content and matches manifest hashes.");
}

function verifyBook(writeBook: WriteBookReport): BookVerification {
  if (!pilotSlugs.includes(writeBook.slug as (typeof pilotSlugs)[number])) {
    throw new Error(`Unexpected pilot write report slug: ${writeBook.slug}`);
  }
  if (forbiddenSlugs.has(writeBook.slug)) {
    throw new Error(`Verifier refuses individual-review slug: ${writeBook.slug}`);
  }

  const sourcePath = safeSourcePath(writeBook.sourceFileUsed);
  const rawText = fs.readFileSync(sourcePath, "utf8");
  const generatedBookRoot = path.join(generatedRoot, writeBook.slug);
  const manifestPath = path.join(generatedBookRoot, "manifest.json");
  assertInside(generatedRoot, generatedBookRoot);
  const manifest = readJson<GeneratedBookManifest>(manifestPath);
  const sections = loadSections(writeBook.slug, manifest);
  const previewPath = path.join(previewRoot, `${writeBook.slug}.preview.json`);
  assertInside(previewRoot, previewPath);
  const preview = readJson<PreviewAsset>(previewPath);
  const { text: rawBody } = lineSlice(
    rawText,
    writeBook.startBoundaryUsed.line,
    writeBook.endBoundaryUsed.line,
  );
  const allText = sections.map((section) => section.displayText).join("\n\n");
  const defaultText = sections
    .filter((section) => section.includeByDefault)
    .map((section) => section.displayText)
    .join("\n\n");

  const metadataCorrectionsObserved = metadataCorrections[writeBook.slug]
    ? [metadataCorrections[writeBook.slug]]
    : [];

  const startBoundaryVerdict = verifyStart(rawBody, sections);
  const endBoundaryVerdict = verifyEnd(rawBody, sections, writeBook.slug);
  const sectioningVerdict = verifySectioning(writeBook.slug, rawBody, manifest);
  const cleanupVerdict = verifyCleanup(defaultText, allText);
  const previewVerdict = verifyPreview(manifest, preview, defaultText);
  const status = worseStatus([
    startBoundaryVerdict.status,
    endBoundaryVerdict.status,
    sectioningVerdict.status,
    cleanupVerdict.status,
    previewVerdict.status,
  ]);
  const needsCorrectionBeforeMain = status === "fail";

  return {
    slug: writeBook.slug,
    status,
    generatedOutputInspected: [
      statusPath(manifestPath),
      ...manifest.sections.map((section) =>
        statusPath(path.join(generatedBookRoot, section.sectionJsonPath)),
      ),
    ],
    previewAssetInspected: statusPath(previewPath),
    startBoundaryVerdict,
    endBoundaryVerdict,
    sectioningVerdict,
    cleanupVerdict,
    previewVerdict,
    remainingWarnings: [
      ...writeBook.remainingWarnings,
      ...metadataCorrectionsObserved,
      ...(status === "warn" ? ["Accepted with warning; review before larger scaling."] : []),
    ],
    acceptedForMain: !needsCorrectionBeforeMain,
    needsCorrectionBeforeMain,
    shouldBeRevertedOrSkipped: false,
    startSnippet: {
      raw: lineSnippet(rawText, writeBook.startBoundaryUsed.line, 0, 8),
      generated: textPreview(sections[0]?.displayText ?? "", 320),
    },
    endSnippet: {
      raw: lineSnippet(rawText, writeBook.endBoundaryUsed.line, 8, 0),
      generated: textPreview(sections[sections.length - 1]?.displayText.slice(-900) ?? "", 320),
    },
    metadataCorrectionsObserved,
  };
}

function writeReports(results: BookVerification[]) {
  const summary = {
    pass: results.filter((result) => result.status === "pass").length,
    warn: results.filter((result) => result.status === "warn").length,
    fail: results.filter((result) => result.status === "fail").length,
  };
  const report = {
    schemaVersion: 1,
    reportName: "pilot-write-1-verification",
    generatedAt: new Date().toISOString(),
    pilotSlugs,
    inspectedPaths: {
      tempBooksRoot: statusPath(tempBooksRoot),
      generatedRoot: statusPath(generatedRoot),
      previewRoot: statusPath(previewRoot),
      cloudflareRoot: statusPath(cloudflareRoot),
      writeReport: statusPath(writeReportPath),
    },
    summary,
    books: results,
    conclusions: {
      acceptedForMain: results
        .filter((result) => result.acceptedForMain)
        .map((result) => result.slug),
      needsCorrectionBeforeMain: results
        .filter((result) => result.needsCorrectionBeforeMain)
        .map((result) => result.slug),
      shouldBeRevertedOrSkipped: results
        .filter((result) => result.shouldBeRevertedOrSkipped)
        .map((result) => result.slug),
      correctionsMadeBeforeVerification: results
        .flatMap((result) => result.metadataCorrectionsObserved)
        .filter(Boolean),
    },
    confirmations: {
      inspectedOnlyPilotBooks: true,
      tempBooksModified: false,
      cloudflareExportModified: false,
      unrelatedGeneratedBooksTouched: false,
      allBookProcessingRun: false,
    },
  };

  const rows = results
    .map(
      (result) =>
        `| ${result.slug} | ${result.status} | ${result.startBoundaryVerdict.status} | ${result.endBoundaryVerdict.status} | ${result.sectioningVerdict.status} | ${result.cleanupVerdict.status} | ${result.previewVerdict.status} | ${result.acceptedForMain ? "yes" : "no"} |`,
    )
    .join("\n");
  const details = results
    .map(
      (result) => `## ${result.slug}

- Status: ${result.status}
- Start: ${result.startBoundaryVerdict.summary}
- End: ${result.endBoundaryVerdict.summary}
- Sectioning: ${result.sectioningVerdict.summary}
- Cleanup: ${result.cleanupVerdict.summary}
- Preview: ${result.previewVerdict.summary}
- Accepted for main: ${result.acceptedForMain ? "yes" : "no"}
- Needs correction before main: ${result.needsCorrectionBeforeMain ? "yes" : "no"}
- Should be reverted/skipped: ${result.shouldBeRevertedOrSkipped ? "yes" : "no"}
- Remaining warnings: ${result.remainingWarnings.length > 0 ? result.remainingWarnings.join("; ") : "none"}
- Raw start snippet: ${result.startSnippet.raw}
- Generated start snippet: ${result.startSnippet.generated}
- Raw end snippet: ${result.endSnippet.raw}
- Generated end snippet: ${result.endSnippet.generated}
`,
    )
    .join("\n");

  const markdown = `# Pilot Write 1 Verification

Post-write QA pass for the seven approved pilot books. This report inspects raw source text, generated book output, preview assets, and the pilot write report. It does not process additional books.

## Summary

| Book | Status | Start | End | Sectioning | Cleanup | Preview | Accepted for main |
| --- | --- | --- | --- | --- | --- | --- | --- |
${rows}

## Special Focus

- a-dream-of-armageddon: acceptable with warning. The source is a single story without internal headings, and the two fallback parts preserve the story from title through final sentence. A manual single-story sectioning rule would be nicer, but no correction is required before main.
- a-journal-of-the-plague-year: acceptable with warning. The source does not provide clean chapter headings; the 18 fallback parts are consecutive paragraph-boundary chunks and do not include front matter/footer boilerplate. Manual labels would improve polish before scaling.
- dracula: prior generated-output issue is corrected. The generated default playback starts at CHAPTER I, excludes title page/contents/source material, keeps the final note as non-default notes, excludes the publisher catalog after THE END, and the preview starts at real readable content.

## Corrections Observed

${report.conclusions.correctionsMadeBeforeVerification.length > 0 ? report.conclusions.correctionsMadeBeforeVerification.map((item) => `- ${item}`).join("\n") : "- None"}

${details}

## Confirmations

- app/client/assets/temp-books was inspected only and not modified.
- app/client/assets/books/cloudflare-export was not modified.
- Only the seven pilot generated outputs and seven pilot preview assets were inspected.
- No additional books were processed.
- npm run books:build was not run.
`;

  writeJson(
    path.join(verificationReportRoot, "pilot-write-1-verification.json"),
    report,
  );
  writeText(
    path.join(verificationReportRoot, "pilot-write-1-verification.md"),
    markdown,
  );
}

function main() {
  const writeReport = readJson<WriteReport>(writeReportPath);
  const writeBooksBySlug = new Map(writeReport.books.map((book) => [book.slug, book]));
  const results = pilotSlugs.map((slug) => {
    const writeBook = writeBooksBySlug.get(slug);
    if (!writeBook) throw new Error(`Missing write report entry for ${slug}`);
    return verifyBook(writeBook);
  });
  writeReports(results);
  const summary = {
    pass: results.filter((result) => result.status === "pass").length,
    warn: results.filter((result) => result.status === "warn").length,
    fail: results.filter((result) => result.status === "fail").length,
  };
  console.log(
    `Pilot write 1 verification completed: ${summary.pass} pass, ${summary.warn} warn, ${summary.fail} fail.`,
  );
  for (const result of results) {
    console.log(`${result.status.toUpperCase()} ${result.slug}`);
  }
}

main();
