import fs from "node:fs";
import { expect, test } from "@playwright/test";
import { PRINTABLE_CHARTS, getPrintableChartsForPage } from "../../app/client/data/printableCharts";
import { CANONICAL_ROUTE_PATHS } from "../../app/client/data/routes";
import { blockExternalNetwork } from "./helpers";

const placements: Record<string, string[]> = {
  "/international-morse-code-reference": ["international-reference"],
  "/morse-code-chart": ["numbers-punctuation", "color-reference"],
  "/morse-code-alphabet": ["beginner-alphabet", "color-reference"],
  "/learn-morse-code": ["pattern-families", "learning-order", "letter-frequency", "binary-tree"],
  "/morse-code-numbers": ["numbers-punctuation", "numbers"],
  "/morse-code-punctuation": ["numbers-punctuation", "punctuation"],
  "/morse-code-timing": ["timing-spacing", "international-timing"],
  "/morse-code-word-separator": ["word-spacing"],
  "/morse-code-prosigns": ["prosigns"],
  "/morse-code-q-codes": ["q-signals"],
  "/morse-code-amateur-radio-cw": ["nato-alphabet", "cw-abbreviations"],
  "/morse-code-by-language/japanese": ["wabun", "japanese-study-sheet"],
  "/morse-code-by-language/russian": ["russian"],
  "/morse-code-by-language/greek": [],
};

test("chart manifest preserves remote keys, placements, and the existing URL footprint", () => {
  expect(PRINTABLE_CHARTS).toHaveLength(39);
  for (const field of ["id", "key", "url"] as const) expect(new Set(PRINTABLE_CHARTS.map(c => c[field])).size).toBe(39);
  expect(getPrintableChartsForPage("/morse-code-printable-chart")).toHaveLength(17);
  expect(getPrintableChartsForPage("/morse-code-by-language")).toHaveLength(22);
  for (const [path, ids] of Object.entries(placements)) expect(getPrintableChartsForPage(path).map(c => c.id)).toEqual(ids);
  for (const chart of PRINTABLE_CHARTS) {
    const url = new URL(chart.url);
    expect(url.origin).toBe("https://assets.morsewords.com");
    expect(decodeURIComponent(url.pathname)).toBe(`/printable-charts/${chart.key}`);
    expect(chart.alt.length).toBeGreaterThan(20);
    expect(chart.width).toBeGreaterThan(0);
    expect(chart.height).toBeGreaterThan(0);
    for (const path of [...chart.placements, chart.referencePath]) expect(CANONICAL_ROUTE_PATHS).toContain(path);
  }
  expect(PRINTABLE_CHARTS.find(c => c.id === "polish")!.url).toContain("%27");
  expect(PRINTABLE_CHARTS.find(c => c.id === "cw-abbreviations")!.key).toBe("morese-cod-cw-abbreviation-printable-chart.png");
  expect(PRINTABLE_CHARTS.find(c => c.id === "german")!.key).toBe("international-morse-code-deustsches-morsealphabet-printable-chart.png");
  const sitemap = fs.readFileSync("public/sitemap.xml", "utf8");
  expect(sitemap.match(/<loc>/g)).toHaveLength(1178);
  expect(sitemap).not.toContain("assets.morsewords.com");
  expect(sitemap).not.toContain("/printable-charts/");
});

test("each existing page exposes precisely its charts in server-rendered HTML", async ({ request }) => {
  for (const path of ["/morse-code-printable-chart", "/morse-code-by-language", ...Object.keys(placements)]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    const ids = [...html.matchAll(/data-printable-chart="([^"]+)"/g)].map(match => match[1]);
    expect(ids.sort(), path).toEqual(getPrintableChartsForPage(path).map(c => c.id).sort());
    expect(html).toContain(`href="https://www.morsewords.com${path}"`);
    for (const chart of getPrintableChartsForPage(path)) expect(html).toContain(`href="${chart.url}"`);
  }
});

for (const [path, count] of [["/morse-code-printable-chart", 17], ["/morse-code-by-language", 22]] as const) {
  test(`${path} reserves lazy preview space and keeps download links usable`, async ({ page }) => {
    await blockExternalNetwork(page);
    await page.goto(path);
    const images = page.locator("[data-printable-chart] img");
    await expect(images).toHaveCount(count);
    for (const img of await images.all()) {
      await expect(img).toHaveAttribute("loading", "lazy");
      await expect(img).toHaveAttribute("decoding", "async");
      expect(Number(await img.getAttribute("width"))).toBeGreaterThan(0);
      expect(Number(await img.getAttribute("height"))).toBeGreaterThan(0);
    }
    const section = page.locator("#printable-charts");
    await section.scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const link = section.getByRole("link", { name: /^Open \/ download/ }).first();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).not.toHaveAttribute("download");
    await link.focus();
    await expect(link).toBeFocused();
    if (path === "/morse-code-printable-chart") await expect(page.locator("#builder")).toHaveCount(1);
    else await expect(page.locator("#language-list")).toBeVisible();
  });
}
