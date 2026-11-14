import { expect, test } from "@playwright/test";
import { inspectSsrHtml, localQualityFindings, payloadVersionEvidence } from "../../scripts/books/library-quality-report";
import { canonicalEvidenceJson, compactLibraryEvidence } from "../../scripts/books/library-quality-artifacts";
import { createHash } from "node:crypto";

test("compact evidence preserves unknowns, deterministic full hashes and actionable deltas", () => {
  const report = { scope: { ssr: "all", payloads: "sample" }, totals: { titles: 1, detailPages: 2 }, limitations: ["Not interaction tested"], records: [{ slug: "test", findings: ["source-link-missing"], payload: { state: "not-probed" }, pages: [{ mode: "books", ssr: { state: "observed" } }, { mode: "audiobooks", ssr: { state: "unavailable" } }] }] };
  const first = compactLibraryEvidence(report);
  expect(first.compact.records[0].payload).toBe("not-probed");
  expect(first.compact.records[0].ssr.audiobooks).toBe("unavailable");
  expect(first.compact.findingInventory["source-link-missing"]).toEqual(["test"]);
  expect(first.compact.fullReport.sha256).toBe(createHash("sha256").update(first.fullJson).digest("hex"));
  expect(canonicalEvidenceJson({ b: 2, a: 1 })).toBe(canonicalEvidenceJson({ a: 1, b: 2 }));
  expect(compactLibraryEvidence(report, first.compact).compact.delta!.changed).toEqual([]);
  const changed = structuredClone(report); changed.records[0].payload.state = "unavailable";
  expect(compactLibraryEvidence(changed, first.compact).compact.delta!.changed).toHaveLength(1);
  expect(compactLibraryEvidence(report, report).compact.delta!.removed).toEqual([]);
  expect(first.markdown).toContain("Scope changes are not improvements");
});

test("export envelope hashes are compared separately from source-content hashes", () => {
  expect(payloadVersionEvidence({ contentHash: "export-v2", manifest: { contentHash: "source-v1" } }, "export-v2", "source-v1")).toEqual({ exportHashMatchesLiveManifest: true, sourceHashMatchesCheckout: true });
  expect(payloadVersionEvidence({ contentHash: "stale-export", manifest: { contentHash: "old-source" } }, "export-v2", "source-v1")).toEqual({ exportHashMatchesLiveManifest: false, sourceHashMatchesCheckout: false });
});

test("missing evidence remains a repair finding, never an index mutation or score", () => {
  const findings = localQualityFindings({ sourceUrl: null, authorCount: 0, rightsApproved: false, previewCharacters: 0, previewHashMatches: false, summaryWords: 0, sectionCount: 0, missingSections: 1 });
  expect(findings).toEqual(["source-link-missing", "author-missing", "recorded-rights-need-review", "starter-preview-unavailable", "starter-preview-version-mismatch", "reviewed-summary-unavailable", "section-data-incomplete"]);
  expect(findings.join(" ")).not.toMatch(/noindex|retire|score/);
  expect(localQualityFindings({ sourceUrl: "https://www.gutenberg.org/ebooks/35", authorCount: 1, rightsApproved: true, previewCharacters: 100, previewHashMatches: true, summaryWords: 100, sectionCount: 2, missingSections: 0 })).toEqual([]);
});

test("SSR evidence parses HTML semantics and never mistakes serialized script content for a tool", async ({ page }) => {
  const result = await page.evaluate(inspectSsrHtml, `<!doctype html><html><head><title>A &amp; B</title><meta content="noindex,follow" name="robots"><link href="https://www.morsewords.com/example" rel="canonical"><meta name="description" content="A &quot;quoted&quot; description"></head><body><script>window.fake='<main data-mw-morse-book-page="true">Fake ready workspace</main>'</script><main><h1>Real title</h1><section data-testid="morse-book-loading"><button>Retry</button></section><a href="/audio">Audio</a><a href="/audio">Again</a><a href="https://external.example/">External</a><a href="//external.example/">Protocol relative</a></main></body></html>`);
  expect(result.title).toBe("A & B");
  expect(result.description).toBe('A "quoted" description');
  expect(result.canonical).toBe("https://www.morsewords.com/example");
  expect(result.robots).toBe("noindex,follow");
  expect(result.workspacePresent).toBe(false);
  expect(result.loadingShell).toBe(true);
  expect(result.summaryText).toBe("");
  expect(result.internalLinks).toEqual(["/audio"]);
  expect(result.controlLabels).toEqual(["Retry"]);
});

test("SSR distinguishes an initial excerpt from a failure shell and captures actual task text", async ({ page }) => {
  const result = await page.evaluate(inspectSsrHtml, `<main data-mw-morse-book-page="true" data-mw-morse-book-page-mode="audiobook"><header class="tool-header"><h1>Test work</h1><p>Listen to selected chapters.</p></header><div data-testid="morse-book-seo-summary-body"><p>A work-specific summary.</p></div><button aria-label="Play selected chapter">Play</button></main>`);
  expect(result.workspaceMode).toBe("audiobook");
  expect(result.workspacePresent).toBe(true);
  expect(result.loadingShell).toBe(false);
  expect(result.failureShell).toBe(false);
  expect(result.visibleTask).toBe("Listen to selected chapters.");
  expect(result.summaryText).toBe("A work-specific summary.");
  expect(result.controlLabels).toEqual(["Play selected chapter"]);
});
