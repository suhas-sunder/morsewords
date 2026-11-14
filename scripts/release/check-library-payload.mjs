import assert from "node:assert/strict";
import { chromium } from "playwright";
import { startNetlifyBuildServer } from "../serve-netlify-build.mjs";

// Read-only built-output guard. Never generates data, changes Git or deploys.
const server = await startNetlifyBuildServer();
const browser = await chromium.launch();
try {
  for (const route of ["/morse-code-books/alices-adventures-in-wonderland", "/morse-code-audiobooks/alices-adventures-in-wonderland", "/morse-code-books/the-time-machine/print"]) {
    const page = await browser.newPage();
    await page.route("**/*", r => new URL(r.request().url()).hostname === "127.0.0.1" ? r.continue() : r.abort());
    const scripts = new Map();
    const pending = [];
    page.on("response", response => {
      if (new URL(response.url()).pathname.endsWith(".js")) pending.push(response.body().then(body => scripts.set(response.url(), body)).catch(() => {}));
    });
    const response = await page.goto(server.baseUrl + route, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    await Promise.all(pending);
    assert.ok(scripts.size > 3, "Browser must actually load the route's JavaScript");
    let bytes = 0;
    for (const [url, body] of scripts) {
      bytes += body.length;
      const source = body.toString("utf8");
      assert.ok((source.match(/rightsReportPath/g) ?? []).length < 100, `Full library metadata in ${url}`);
      assert.ok((source.match(/strictReviewCandidate/g) ?? []).length < 100, `Bulk title suitability profiles in ${url}`);
    }
    assert.ok(bytes < 1_150_000, `${route}: ${bytes} JS bytes exceeds reviewed detail budget; investigate the import graph`);
    console.log(`${route}: ${bytes} loaded JS bytes; full-library payload absent`);
    await page.close();
  }
} finally { await browser.close(); await server.close(); }
