import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { chromium, type Browser, type Page } from "playwright";
import type { MorseBookLibraryManifest, MorseBookLibrarySummary, MorseBookManifest, MorseBookPreviewAsset, MorseBookPublicContentJson, MorseBookPublicManifest } from "../../app/client/data/morseBookTypes.ts";
import type { MorseBookSeoSummaryData } from "../../app/client/data/morseBookSeoSummaries.ts";
import { MORSE_BOOK_CONTENT_BASE_URL } from "../../app/client/data/morseBookContentConfig.ts";

const SAMPLE_SLUGS = ["the-time-machine", "the-war-of-the-worlds", "alices-adventures-in-wonderland", "a-christmas-carol", "anne-of-green-gables", "the-count-of-monte-cristo"];
const SITE = "https://www.morsewords.com";
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const words = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;
const normalize = (value: string) => value.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const readJson = async <T>(file: string): Promise<T | null> => { try { return JSON.parse(await fs.readFile(file, "utf8")) as T; } catch { return null; } };
const exists = async (file: string) => fs.access(file).then(() => true, () => false);

// Minimal module-local DOM contract: do not introduce browser globals into the
// Node-only composite project and change types in unrelated audit scripts.
type QualityDomNode = { textContent: string | null; getAttribute(name: string): string | null; querySelector(selector: string): QualityDomNode | null; querySelectorAll(selector: string): QualityDomNode[]; matches(selector: string): boolean; remove(): void };
declare const DOMParser: { new(): { parseFromString(html: string, mime: string): QualityDomNode & { title: string } } };

export function localQualityFindings(input: { sourceUrl: string | null; authorCount: number; rightsApproved: boolean; previewCharacters: number; previewHashMatches: boolean; summaryWords: number; sectionCount: number; missingSections: number }) {
  const flags: string[] = [];
  if (!input.sourceUrl) flags.push("source-link-missing");
  if (!input.authorCount) flags.push("author-missing");
  if (!input.rightsApproved) flags.push("recorded-rights-need-review");
  if (!input.previewCharacters) flags.push("starter-preview-unavailable");
  if (!input.previewHashMatches) flags.push("starter-preview-version-mismatch");
  if (!input.summaryWords) flags.push("reviewed-summary-unavailable");
  if (!input.sectionCount || input.missingSections) flags.push("section-data-incomplete");
  return flags;
}

/** Evaluated in an inert DOM, never executes page scripts or hydrates the app. */
export function inspectSsrHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script,style").forEach((element) => element.remove());
  const main = doc.querySelector("main");
  const text = main?.textContent?.replace(/\s+/g, " ").trim() ?? "";
  const links = [...(main?.querySelectorAll("a[href]") ?? [])].map((link) => link.getAttribute("href")!).filter((href) => href.startsWith("/") && !href.startsWith("//"));
  return {
    title: doc.title, description: doc.querySelector('meta[name="description"]')?.getAttribute("content") ?? null,
    canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
    robots: doc.querySelector('meta[name="robots"]')?.getAttribute("content") ?? null,
    h1: [...doc.querySelectorAll("h1")].map((h1) => h1.textContent?.trim() ?? ""),
    mainTextWords: text ? text.split(/\s+/).length : 0,
    visibleTask: main?.querySelector(".tool-header p")?.textContent?.replace(/\s+/g, " ").trim() ?? null,
    summaryText: main?.querySelector('[data-testid="morse-book-seo-summary-body"]')?.textContent?.replace(/\s+/g, " ").trim() ?? "",
    workspacePresent: !!main?.matches('[data-mw-morse-book-page="true"]'),
    loadingShell: !!main?.querySelector('[data-testid="morse-book-loading"]'),
    failureShell: !!main?.querySelector('[data-testid="morse-book-load-error"]'),
    workspaceMode: main?.getAttribute("data-mw-morse-book-page-mode") ?? null,
    controlLabels: [...(main?.querySelectorAll("button") ?? [])].map((button) => (button.getAttribute("aria-label") || button.textContent || "").replace(/\s+/g, " ").trim()).filter(Boolean),
    internalLinks: [...new Set(links)].sort(),
  };
}

type SsrObservation = ({ state: "observed"; status: number; htmlBytes: number; summaryHash: string | null; summaryWords: number; summaryText?: never } & Omit<ReturnType<typeof inspectSsrHtml>, "summaryText">) | { state: "not-probed" | "unavailable"; reason: string };
type PayloadObservation = { state: "not-probed" | "unavailable" | "observed"; reason?: string; status?: number; bytes?: number; sectionCount?: number; wordCount?: number; exportHashMatchesLiveManifest?: boolean; sourceHashMatchesCheckout?: boolean; corsAllowsProduction?: boolean; url?: string };

export function payloadVersionEvidence(payload: { contentHash: string; manifest: { contentHash: string } }, liveExportHash: string, checkoutSourceHash: string) {
  // The export envelope and source manifest deliberately use different hashes.
  return { exportHashMatchesLiveManifest: payload.contentHash === liveExportHash, sourceHashMatchesCheckout: payload.manifest?.contentHash === checkoutSourceHash };
}

async function probeSsr(page: Page, url: string): Promise<SsrObservation> {
  try {
    const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(30_000) });
    const html = await response.text();
    const { summaryText, ...observed } = await page.evaluate(inspectSsrHtml, html);
    return { state: "observed", status: response.status, htmlBytes: Buffer.byteLength(html), ...observed, summaryHash: summaryText ? hash(summaryText) : null, summaryWords: words(summaryText) };
  } catch (error) { return { state: "unavailable", reason: error instanceof Error ? error.message : String(error) }; }
}

async function probePayload(book: MorseBookLibrarySummary, liveManifest: MorseBookPublicManifest | null): Promise<PayloadObservation> {
  const live = liveManifest?.books.find((entry) => entry.slug === book.slug);
  if (!live) return { state: "unavailable", reason: "Title absent from the observed live manifest, or manifest unavailable" };
  const url = new URL(live.bookPath, MORSE_BOOK_CONTENT_BASE_URL + "/");
  if (url.origin !== MORSE_BOOK_CONTENT_BASE_URL) return { state: "unavailable", reason: "Unexpected payload origin in manifest" };
  try {
    const response = await fetch(url, { headers: { Origin: SITE }, signal: AbortSignal.timeout(45_000) });
    if (!response.ok) { await response.body?.cancel(); return { state: "unavailable", status: response.status, url: url.href, reason: "Payload HTTP failure" }; }
    const text = await response.text();
    const payload = JSON.parse(text) as MorseBookPublicContentJson;
    if (payload.slug !== book.slug || !Array.isArray(payload.sections)) return { state: "unavailable", reason: "Payload identity/schema mismatch", url: url.href };
    return { state: "observed", url: url.href, status: response.status, bytes: Buffer.byteLength(text), sectionCount: payload.sections.length, wordCount: payload.manifest?.stats?.wordCount, ...payloadVersionEvidence(payload, live.contentHash, book.contentHash), corsAllowsProduction: [SITE, "*"].includes(response.headers.get("access-control-allow-origin") ?? "") };
  } catch (error) { return { state: "unavailable", url: url.href, reason: error instanceof Error ? error.message : String(error) }; }
}

export async function generateLibraryQualityReport(options: { ssr: "none" | "sample" | "all"; payloads: "none" | "sample" | "all"; output: string; baseUrl?: string }) {
  const root = process.cwd();
  const output = path.resolve(root, options.output);
  if (path.relative(root, output).startsWith("..") || !output.endsWith(".json")) throw new Error("Report output must be a JSON file inside the checkout.");
  const generated = path.join(root, "app/client/assets/books/generated");
  const library = await readJson<MorseBookLibraryManifest>(path.join(generated, "library-manifest.json"));
  const reviews = await readJson<MorseBookSeoSummaryData>(path.join(root, "app/client/assets/books/seo-summaries/book-seo-summaries.json"));
  if (!library || !reviews) throw new Error("Required library/review inventory is unavailable.");
  const sitemap = await fs.readFile(path.join(root, "public/sitemap.xml"), "utf8");
  const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
  const reviewMap = new Map(reviews.summaries.map((entry) => [entry.slug, entry]));
  const duplicateGroups = (key: (book: MorseBookLibrarySummary) => string) => {
    const map = new Map<string, string[]>();
    for (const book of library.books) { const value = key(book); if (value) map.set(value, [...(map.get(value) ?? []), book.slug]); }
    return map;
  };
  const titles = duplicateGroups((book) => normalize(book.title));
  const sources = duplicateGroups((book) => book.source.sourceUrl ?? "");
  const summaries = duplicateGroups((book) => reviewMap.get(book.slug)?.summary.trim() ? hash(reviewMap.get(book.slug)!.summary.trim()) : "");
  let server: { baseUrl: string; close: () => Promise<void> } | null = null;
  let liveManifest: MorseBookPublicManifest | null = null;
  let liveManifestState = "not-probed";
  if (options.payloads !== "none") {
    try { const response = await fetch(`${MORSE_BOOK_CONTENT_BASE_URL}/public-manifest.json`, { signal: AbortSignal.timeout(30_000) }); if (!response.ok) throw new Error(`HTTP ${response.status}`); liveManifest = await response.json() as MorseBookPublicManifest; if (!Array.isArray(liveManifest.books)) throw new Error("Invalid manifest"); liveManifestState = "observed"; }
    catch (error) { liveManifestState = `unavailable: ${error instanceof Error ? error.message : error}`; }
  }
  if (options.ssr !== "none" && !options.baseUrl) {
    const harness = await import(pathToFileURL(path.join(root, "scripts/serve-netlify-build.mjs")).href);
    server = await harness.startNetlifyBuildServer();
  }
  let browser: Browser | null = null;
  let parser: Page | null = null;
  const records = [];
  try {
    browser = options.ssr === "none" ? null : await chromium.launch();
    parser = browser ? await browser.newPage() : null;
    if (parser) await parser.route("**/*", (route) => route.abort());
    for (const book of library.books) {
      if (!/^[a-z0-9-]+$/.test(book.slug)) throw new Error(`Invalid library slug: ${book.slug}`);
      const manifestFile = path.resolve(generated, book.manifestPath);
      if (path.relative(generated, manifestFile).startsWith("..")) throw new Error("Manifest path escapes generated directory.");
      const manifest = await readJson<MorseBookManifest>(manifestFile);
      const preview = await readJson<MorseBookPreviewAsset>(path.join(root, `public/book-previews/${book.slug}.preview.json`));
      const summary = reviewMap.get(book.slug);
      const missingSectionFiles: string[] = [];
      for (const section of manifest?.sections ?? []) {
        const sectionFile = path.resolve(path.dirname(manifestFile), section.sectionJsonPath);
        if (path.relative(path.dirname(manifestFile), sectionFile).startsWith("..") || !await exists(sectionFile)) missingSectionFiles.push(section.id);
      }
      const previewCharacters = preview?.previewText?.trim().length ?? 0;
      const summaryWords = words(summary?.summary ?? "");
      const findings = localQualityFindings({ sourceUrl: book.source.sourceUrl, authorCount: book.author.length, rightsApproved: book.source.rightsStatus === "approved" && book.source.rightsReviewed && book.source.publishReady, previewCharacters, previewHashMatches: !!preview && preview.contentHash === book.contentHash, summaryWords, sectionCount: manifest?.sections.length ?? 0, missingSections: missingSectionFiles.length });
      if (manifest && manifest.sections.length !== book.stats.sectionCount) findings.push("declared-section-count-mismatch");
      if (preview && manifest && !manifest.sections.some((section) => section.id === preview.defaultSectionId)) findings.push("preview-section-missing-from-manifest");
      const duplicates = { titles: (titles.get(normalize(book.title)) ?? []).filter((slug) => slug !== book.slug), sources: (sources.get(book.source.sourceUrl ?? "") ?? []).filter((slug) => slug !== book.slug), summaries: (summaries.get(hash(summary?.summary.trim() ?? "")) ?? []).filter((slug) => slug !== book.slug) };
      if (duplicates.titles.length) findings.push("duplicate-title-review");
      if (duplicates.sources.length) findings.push("shared-source-review");
      if (duplicates.summaries.length) findings.push("duplicate-summary-review");
      const pages = [];
      for (const mode of ["books", "audiobooks"] as const) {
        const route = `/morse-code-${mode}/${book.slug}`;
        const shouldProbe = options.ssr === "all" || options.ssr === "sample" && SAMPLE_SLUGS.includes(book.slug);
        const ssr: SsrObservation = shouldProbe && parser ? await probeSsr(parser, (options.baseUrl ?? server!.baseUrl) + route) : { state: "not-probed", reason: "Not selected by SSR scope" };
        if (!sitemapUrls.has(SITE + route)) findings.push(`${mode}:sitemap-missing`);
        if (ssr.state === "unavailable") findings.push(`${mode}:ssr-unavailable`);
        if (ssr.state === "observed") {
          if (ssr.status !== 200 || ssr.canonical !== SITE + route || ssr.robots !== "index,follow" || ssr.h1.length !== 1) findings.push(`${mode}:http-or-index-contract-mismatch`);
          if (!ssr.workspacePresent || ssr.loadingShell || !ssr.summaryWords) findings.push(`${mode}:initial-content-review`);
        }
        pages.push({ mode, route, sitemapMember: sitemapUrls.has(SITE + route), expectedCanonical: SITE + route, expectedRobots: "index,follow", ssr, functionality: { state: "not-interaction-tested-by-report", browserSuites: ["morse-book-startup-preview.spec.ts", "morse-audiobook-parity.spec.ts"], note: "SSR controls are evidence of presence, not successful playback/export. Run browser tests separately." } });
      }
      const payload = options.payloads === "all" || options.payloads === "sample" && SAMPLE_SLUGS.includes(book.slug) ? await probePayload(book, liveManifest) : { state: "not-probed", reason: "Not selected by payload scope" } as PayloadObservation;
      if (payload.state === "unavailable") findings.push("live-payload-unavailable");
      if (payload.state === "observed" && (!payload.exportHashMatchesLiveManifest || !payload.sourceHashMatchesCheckout || !payload.corsAllowsProduction)) findings.push("live-payload-version-or-cors-review");
      const [bookPage, audioPage] = pages.map((page) => page.ssr);
      const distinction = bookPage.state === "observed" && audioPage.state === "observed" ? { state: "observed", titleDiffers: bookPage.title !== audioPage.title, descriptionDiffers: bookPage.description !== audioPage.description, taskCopyDiffers: bookPage.visibleTask !== audioPage.visibleTask, sameSummary: bookPage.summaryHash === audioPage.summaryHash, pairedLinksPresent: bookPage.internalLinks.includes(pages[1].route) && audioPage.internalLinks.includes(pages[0].route), note: "Different metadata is not proof of sufficient separate search value. Human task/content review remains required." } : { state: "not-probed", note: "Both initial SSR pages are needed to compare the pair." };
      records.push({ slug: book.slug, title: book.title, authors: book.author, language: book.language, source: { provider: book.source.provider, url: book.source.sourceUrl, gutenbergId: book.source.gutenbergId }, rights: { status: book.source.rightsStatus, basis: book.source.rightsBasis, reviewed: book.source.rightsReviewed, publishReady: book.source.publishReady, approvalSource: book.source.approvalSource, note: "Recorded repository decision, not a new legal determination or worldwide rights guarantee." }, preview: { available: previewCharacters > 0, characters: previewCharacters, words: preview?.wordCount ?? 0, truncated: preview?.truncated ?? null, sectionId: preview?.defaultSectionId ?? null, hashMatchesCheckout: preview?.contentHash === book.contentHash }, summary: { available: summaryWords > 0, words: summaryWords, description: summary?.description ?? null, hash: summary ? hash(summary.summary.trim()) : null, duplicateSlugs: duplicates.summaries }, sections: { declared: book.stats.sectionCount, observed: manifest?.sections.length ?? 0, included: manifest?.sections.filter((section) => section.includeByDefault).length ?? 0, kinds: [...new Set(manifest?.sections.map((section) => section.kind) ?? [])], missingSectionFiles, sampleLabels: manifest?.sections.slice(0, 3).map((section) => section.label) ?? [] }, contentAmount: { words: book.stats.wordCount, characters: book.stats.cleanedCharacterCount, evidence: "generated manifest, not an editorial quality score" }, duplicates, payload, distinction, findings, pages });
      if (records.length % 25 === 0) console.log(`Inventoried ${records.length}/${library.books.length} titles`);
    }
  } finally { await browser?.close(); await server?.close(); }
  const report = { schemaVersion: 1, generatedAt: new Date().toISOString(), checkoutSha: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(), worktreeChanges: execFileSync("git", ["diff", "--name-only"], { encoding: "utf8" }).trim().split(/\r?\n/).filter(Boolean), scope: { ssr: options.ssr, payloads: options.payloads, ssrOrigin: options.baseUrl ?? "local built Netlify handler", liveAssetOrigin: MORSE_BOOK_CONTENT_BASE_URL, liveManifestState, sampleSlugs: SAMPLE_SLUGS }, policy: "Evidence only: no numeric score, automatic index decision, sitemap mutation or rights-policy change.", totals: { titles: records.length, detailPages: records.length * 2, sitemapUrls: sitemapUrls.size, sourceLinksMissing: records.filter((record) => !record.source.url).length, titlesWithFindings: records.filter((record) => record.findings.length).length, ssrObserved: records.flatMap((record) => record.pages).filter((page) => page.ssr.state === "observed").length, payloadsObserved: records.filter((record) => record.payload.state === "observed").length }, limitations: ["Local built SSR is not a deployed-SHA assertion.", "Unprobed payloads and browser interactions remain unknown, not passes.", "Summary uniqueness is textual identity only; usefulness requires human review.", "Same source can be a legitimate excerpt/edition; duplicates require investigation.", "Rights records must be checked against source evidence and jurisdiction before policy changes."], records };
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report.totals));
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const value = (name: string, fallback: string) => process.argv.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;
  const ssr = value("ssr", "sample"), payloads = value("payloads", "sample");
  if (!["none", "sample", "all"].includes(ssr) || !["none", "sample", "all"].includes(payloads)) throw new Error("Scopes must be none, sample or all.");
  await generateLibraryQualityReport({ ssr: ssr as "none" | "sample" | "all", payloads: payloads as "none" | "sample" | "all", output: value("output", "output/quality/library-quality-report.json"), baseUrl: value("base-url", "") || undefined });
}
