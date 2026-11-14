import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { startNetlifyBuildServer } from "../serve-netlify-build.mjs";

// Observe actual built SSR, independent of the application's module loader.
const { books } = JSON.parse(await fs.readFile("app/client/assets/books/generated/library-manifest.json", "utf8"));
const { profiles } = JSON.parse(await fs.readFile("app/client/data/morseBookSuitability.generated.json", "utf8"));
const authorKey = value => value.trim().replace(/\s+/g, " ").toLowerCase();
const escape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
assert.equal(books.length, 524);
const server = await startNetlifyBuildServer();
let checked = 0;
try {
  for (const book of books) {
    const related = books.filter(other => other.slug !== book.slug && other.author.some(a => book.author.some(b => authorKey(a) && authorKey(a) === authorKey(b))))
      .sort((a, b) => a.title.localeCompare(b.title) || a.slug.localeCompare(b.slug)).slice(0, 4);
    const route = `/morse-code-books/${book.slug}`;
    const response = await fetch(server.baseUrl + route, { redirect: "manual" });
    const html = await response.text();
    assert.equal(response.status, 200, route);
    assert.ok(html.includes(`href="https://www.morsewords.com${route}"`), `${route}: canonical`);
    assert.ok(html.includes('name="robots" content="index,follow"'), `${route}: robots`);
    assert.ok(html.includes('data-mw-morse-book-page="true"'), `${route}: substantive workspace`);
    assert.ok(!html.includes('data-testid="morse-book-loading"'), `${route}: startup preview`);
    const inert = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
    const observed = [...inert.matchAll(/data-mw-related-author-slug="([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(observed, related.map(b => b.slug), `${route}: related order and eligibility`);
    const duplicate = books.filter(b => b.title.trim().toLowerCase() === book.title.trim().toLowerCase()).length > 1;
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? "";
    if (duplicate) assert.ok(title.includes(book.slug.includes("-gutenberg-") ? "(Gutenberg source)" : "(MorseWords source)"), `${route}: duplicate identity`);
    const profile = profiles?.[book.slug];
    if (profile?.contentNote) assert.ok(inert.includes(escape(profile.contentNote)), `${route}: original suitability note`);
    assert.ok(Buffer.byteLength(html) < 600_000, `${route}: unexpected HTML inflation`);
    checked++;
  }
  console.log(`${checked}/524 built title, related, source-profile, preview, canonical and robots projections passed.`);
} finally { await server.close(); }
