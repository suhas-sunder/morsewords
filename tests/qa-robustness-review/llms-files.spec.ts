import { expect, test, type APIResponse } from "@playwright/test";

import { ROUTES, absoluteUrl } from "../../app/client/data/routes";

const expectedConciseLinks = [
  absoluteUrl(ROUTES.home),
  absoluteUrl(ROUTES.encoder),
  absoluteUrl(ROUTES.decoder),
  absoluteUrl(ROUTES.audio),
  absoluteUrl(ROUTES.mp3Generator),
  absoluteUrl(ROUTES.videoGenerator),
  absoluteUrl(ROUTES.practice),
  absoluteUrl(ROUTES.morseBooks),
  absoluteUrl(ROUTES.morseAudiobooks),
  absoluteUrl(ROUTES.printablePages),
  absoluteUrl(ROUTES.morseCodeByLanguage),
  absoluteUrl(ROUTES.sitemap),
  absoluteUrl("/sitemap.xml"),
] as const;

const forbiddenPatterns = [
  /temp-books/i,
  /\basdf\b/i,
  /app\/client\/assets\/text/i,
  /app\\client\\assets\\text/i,
  /generated\/review/i,
  /generated\\review/i,
  /rights_report/i,
  /processing_notes/i,
  /review report/i,
  /api[_ -]?key/i,
  /\bsecret\b/i,
  /\bVITE_[A-Z0-9_]*\b/,
  /\bPUBLIC_[A-Z0-9_]*\b/,
  /process\.env/i,
  /google rankings?/i,
  /AI visibility/i,
  /aggregateRating/i,
  /\bratings?\b/i,
  /\breviews?\b/i,
  /\boffers?\b/i,
  /\bprices?\b/i,
] as const;

async function expectPlainText(response: APIResponse) {
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(
    /text\/plain(?:;|$).*charset=utf-8/i,
  );
}

function expectNoInternalOrInflatedClaims(body: string) {
  for (const pattern of forbiddenPatterns) {
    expect(body, `Unexpected llms content matching ${pattern}`).not.toMatch(pattern);
  }
}

test.describe("llms discovery files", () => {
  test("/llms.txt returns concise public site guidance", async ({ request }) => {
    const response = await request.get("/llms.txt", { maxRedirects: 0 });
    await expectPlainText(response);

    const body = await response.text();
    expect(body).toContain("# MorseWords");
    expect(body).toContain(
      "MorseWords is a beginner-friendly Morse code toolkit",
    );
    expect(body).toContain("Cloudflare-hosted book JSON contains cleaned approved book content only");
    expect(body).toContain(
      "Audio and video downloads are generated in the browser",
    );

    for (const url of expectedConciseLinks) {
      expect(body).toContain(url);
    }

    expectNoInternalOrInflatedClaims(body);
  });

  test("/llms-full.txt returns route groups and agent guidance", async ({
    request,
  }) => {
    const response = await request.get("/llms-full.txt", { maxRedirects: 0 });
    await expectPlainText(response);

    const body = await response.text();
    expect(body).toContain("# MorseWords full site guide");
    expect(body).toContain("## Public route groups");
    expect(body).toContain("## Translation and lookup tools");
    expect(body).toContain("## Audio and MP3 tools");
    expect(body).toContain("## Video tools");
    expect(body).toContain("## Practice, drills, and games");
    expect(body).toContain("## Books and audiobooks");
    expect(body).toContain("## Printables");
    expect(body).toContain("## Morse Code by Language");
    expect(body).toContain("## Agent guidance");

    for (const url of [
      absoluteUrl(ROUTES.morseBooks),
      absoluteUrl(ROUTES.morseAudiobooks),
      absoluteUrl(ROUTES.printablePages),
      absoluteUrl(ROUTES.morseCodeJapanese),
      absoluteUrl(ROUTES.morseCodeRussian),
      absoluteUrl(ROUTES.morseCodeGreek),
      absoluteUrl(ROUTES.wordSearchBuilder),
      absoluteUrl("/sitemap.xml"),
    ]) {
      expect(body).toContain(url);
    }

    expectNoInternalOrInflatedClaims(body);
  });

  test("llms files stay out of normal user-facing sitemaps", async ({
    request,
  }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const html = await (await request.get(ROUTES.sitemap)).text();

    for (const body of [xml, html]) {
      expect(body).not.toContain("/llms.txt");
      expect(body).not.toContain("/llms-full.txt");
    }
  });
});
