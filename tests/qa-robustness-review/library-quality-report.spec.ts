import { expect, test } from "@playwright/test";
import { inspectSsrHtml, localQualityFindings, payloadVersionEvidence } from "../../scripts/books/library-quality-report";

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
