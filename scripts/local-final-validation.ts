import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { CORE_ROUTE_CONTRACTS } from "./core-route-contracts.ts";
import { startNetlifyBuildServer } from "./serve-netlify-build.mjs";
import { checkNavigationBookIndex } from "./books/navigation-index.ts";

// Current release gate. The historical two-book upload gate is preserved in
// historical-local-final-validation.ts; neither needs fabricated upload files.
const checks: { name: string; pass: boolean; details: unknown }[] = [];
function check(name: string, pass: boolean, details: unknown) { checks.push({ name, pass, details }); }
const readJson = async (file: string) => JSON.parse(await fs.readFile(file, "utf8"));
// Fail before starting the server; never silently regenerate a release artifact.
await checkNavigationBookIndex();
check("navigation index freshness", true, "Exact read-only comparison with the current publishable library");
const library = await readJson("app/client/assets/books/generated/library-manifest.json");
const reviews = await readJson("app/client/assets/books/seo-summaries/book-seo-summaries.json");
const previews = await readJson("public/book-previews/manifest.json");
const sitemap = await fs.readFile("public/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
check("frozen train footprint", urls.length === 1179 && new Set(urls).size === 1179, { urls: urls.length, note: "A deliberate inventory change requires an explicit reviewed baseline update." });
check("no print or alias ownership in sitemap", !urls.some(url => /\/print$|\/morse-code-translator$|\/morse-code-audio-generator$/.test(url)), "Existing print noindex and historical aliases");
const missing: string[] = [];
for (const book of library.books) {
  if (!reviews.summaries.some((entry: {slug:string}) => entry.slug === book.slug)) missing.push(`${book.slug}: reviewed summary`);
  if (!previews.books.some((entry: {slug:string}) => entry.slug === book.slug)) missing.push(`${book.slug}: preview manifest`);
  for (const mode of ["books", "audiobooks"]) if (!urls.includes(`https://www.morsewords.com/morse-code-${mode}/${book.slug}`)) missing.push(`${book.slug}: ${mode} sitemap`);
  try { const preview = await readJson(`public/book-previews/${book.slug}.preview.json`); if (!preview.previewText?.trim()) missing.push(`${book.slug}: empty preview`); } catch { missing.push(`${book.slug}: preview file`); }
}
check("library evidence coverage", library.books.length === 524 && missing.length === 0, { books: library.books.length, missing });
const config = await fs.readFile("netlify.toml", "utf8");
check("protected Netlify build contract", config.includes('command = "npm run build:netlify"') && config.includes('publish = "build/client"') && config.includes('book-seo-summaries.json') && config.includes('--max-old-space-size=6144'), "Build, publish, required server JSON, memory setting");
const built = await fs.stat("build/server/server.js");
check("bounded server bundle", built.size > 0 && built.size < 10_000_000, { bytes: built.size, note: "Full book payloads must stay external; investigate rather than raising this guard." });
const server = await startNetlifyBuildServer();
try {
  for (const [route] of [...CORE_ROUTE_CONTRACTS, ["/morse-code-books/the-time-machine"], ["/morse-code-audiobooks/the-time-machine"], ["/morse-code-books/the-time-machine/print"]]) {
    const response = await fetch(server.baseUrl + route, { redirect: "manual" });
    const html = await response.text();
    const canonical = html.match(/<link rel="canonical" href="([^"]+)/)?.[1];
    const robots = html.match(/<meta name="robots" content="([^"]+)/)?.[1];
    const h1 = (html.match(/<h1\b/g) || []).length;
    if (/\/morse-code-(?:audio)?books\//.test(route) && !route.endsWith("/print")) {
      check(`initial book workspace ${route}`, html.includes('data-mw-morse-book-page="true"') && !html.includes('data-testid="morse-book-loading"'), "Title-specific startup content, not a loading-only shell");
    }
    check(`SSR ${route}`, response.status === 200 && canonical === `https://www.morsewords.com${route}` && h1 === 1 && robots === (route.endsWith("/print") ? "noindex,follow" : "index,follow") && html.includes("<main") && Buffer.byteLength(html) < 600_000, { status: response.status, canonical, robots, h1, bytes: Buffer.byteLength(html) });
  }
  for (const [alias, target] of [["/morse-code-translator", "/"], ["/morse-code-audio-generator", "/audio"]]) {
    const response = await fetch(server.baseUrl + alias, { redirect: "manual" });
    check(`redirect ${alias}`, response.status === 301 && response.headers.get("location") === target, { status: response.status, location: response.headers.get("location") });
  }
} finally { await server.close(); }
await fs.mkdir("output/quality", { recursive: true });
const failed = checks.filter(item => !item.pass);
await fs.writeFile("output/quality/local-final-validation.json", JSON.stringify({ sha: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(), checks, passed: failed.length === 0, limitations: ["Local built handler, not a deployed-SHA assertion", "Remote payload availability is measured separately by library report", "Run browser gates in addition to raw SSR"] }, null, 2));
console.log(`${checks.length - failed.length}/${checks.length} current-checkout checks passed.`);
for (const item of failed) console.error(item.name, item.details);
process.exitCode = failed.length ? 1 : 0;
