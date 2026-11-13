import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { morseAudiobookDescription } from "../../app/client/data/morseAudiobookMetadata";

const summaries = JSON.parse(readFileSync("app/client/assets/books/seo-summaries/book-seo-summaries.json", "utf8")).summaries as { slug: string; title: string; description: string }[];

test("every reviewed audiobook description retains its work-specific information", () => {
  expect(summaries.length).toBe(524);
  for (const summary of summaries) {
    expect(summary.description.trim(), summary.slug).not.toBe("");
    const description = morseAudiobookDescription(summary.title, summary.description);
    expect(description).toContain(summary.description.trim());
    expect(description).toContain("in Morse code.");
  }
  expect(morseAudiobookDescription("Example", "  ")).toContain("chapter selection");
  expect(morseAudiobookDescription("Example", null)).not.toContain("undefined");
});

for (const slug of ["the-time-machine", "the-war-of-the-worlds"]) {
  test(`${slug}: raw SSR metadata and WebPage schema use the reviewed audio description`, async ({ request }) => {
    const response = await request.get(`/morse-code-audiobooks/${slug}`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    const description = summaries.find(summary => summary.slug === slug)!.description;
    expect(html).toContain(description);
    const meta = html.match(/<meta name="description" content="([^"]+)"/);
    expect(meta?.[1]).toContain(description);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(match => JSON.parse(match[1]));
    const page = schemas.find(schema => schema["@type"] === "WebPage");
    expect(page.description).toContain(description);
    expect(page.description).toContain("in Morse code.");
    expect(html).toContain(`href="https://www.morsewords.com/morse-code-audiobooks/${slug}"`);
  });
}
