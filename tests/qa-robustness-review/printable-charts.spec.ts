import fs from "node:fs";
import { PDFDocument } from "pdf-lib";
import { expect, test } from "@playwright/test";
import { PRINTABLE_CHARTS, getPrintableChartsForPage } from "../../app/client/data/printableCharts";
import { CANONICAL_ROUTE_PATHS, REDIRECT_ALIASES, ROUTES } from "../../app/client/data/routes";
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

test("chart manifest preserves remote keys, placements, and the intentionally expanded URL footprint", () => {
  expect(PRINTABLE_CHARTS).toHaveLength(39);
  for (const field of ["id", "key", "url"] as const) expect(new Set(PRINTABLE_CHARTS.map(c => c[field])).size).toBe(39);
  expect(getPrintableChartsForPage("/morse-code-printable-chart")).toHaveLength(39);
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
  expect(sitemap.match(/<loc>/g)).toHaveLength(1179);
  expect(sitemap).not.toContain("assets.morsewords.com");
  expect(sitemap).not.toContain("/printable-charts/");
});

test("each existing page exposes precisely its charts in server-rendered HTML", async ({ request }) => {
  test.setTimeout(120_000);
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

test("printable products have distinct canonical identities and direct intent-specific aliases", async ({ request }) => {
  for (const [path, title] of [
    [ROUTES.printableChart, "Printable Morse Code Charts"],
    [ROUTES.printableWorksheets, "Printable Morse Code Worksheets"],
    [ROUTES.printablePages, "Printable Morse"],
  ]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain(title);
    expect(html).toContain(`href="https://www.morsewords.com${path}"`);
    expect(html).toMatch(/name="robots" content="index,\s*follow"/);
    expect(html.includes('id="builder"')).toBe(path === ROUTES.printableWorksheets);
    expect(html.includes('data-printable-chart=')).toBe(path === ROUTES.printableChart);
  }
  for (const [alias, target] of Object.entries(REDIRECT_ALIASES).filter(([, target]) => target === ROUTES.printableChart || target === ROUTES.printableWorksheets)) {
    const response = await request.get(`${alias}?print=1`, { maxRedirects: 0 });
    expect(response.status(), alias).toBe(301);
    expect(new URL(response.headers().location, "https://www.morsewords.com").pathname, alias).toBe(target);
    expect(response.headers().location).toContain("?print=1");
  }
});

for (const [path, count] of [["/morse-code-printable-chart", 39], ["/morse-code-by-language", 22]] as const) {
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
    const link = section.getByRole("link", { name: "Open full-size PNG", exact: true }).first();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).not.toHaveAttribute("download");
    await link.focus();
    await expect(link).toBeFocused();
    if (path === "/morse-code-printable-chart") await expect(page.locator("#builder")).toHaveCount(0);
    else await expect(page.locator("#language-list")).toBeVisible();
  });
}

test("downloads real files in every offered format and recovers from an asset failure", async ({ page }) => {
  await blockExternalNetwork(page);
  await page.goto("/morse-code-timing");
  const png = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 48;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 32, 48);
    context.fillStyle = "#000000";
    context.fillRect(8, 8, 16, 32);
    return canvas.toDataURL("image/png").split(",")[1];
  });
  let fail = false;
  await page.route("https://assets.morsewords.com/printable-charts/**", route => route.fulfill({
    status: fail ? 403 : 200,
    contentType: fail ? "text/html" : "image/png",
    headers: { "access-control-allow-origin": "*" },
    body: fail ? "Unavailable" : Buffer.from(png, "base64"),
  }));
  const figure = page.locator('[data-printable-chart="timing-spacing"]');
  for (const format of ["pdf", "png", "jpg", "webp"]) {
    await figure.getByLabel("Download format").selectOption(format);
    const downloadPromise = page.waitForEvent("download");
    await figure.getByRole("button", { name: `Download ${format.toUpperCase()}` }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(`morsewords-timing-spacing-chart.${format}`);
    const bytes = fs.readFileSync((await download.path())!);
    if (format === "pdf") {
      const pdf = await PDFDocument.load(bytes);
      expect(pdf.getPageCount()).toBe(1);
      expect(pdf.getPage(0).getWidth()).toBeCloseTo(595.28);
      expect(pdf.getPage(0).getHeight()).toBeCloseTo(841.89);
    } else if (format === "png") {
      expect(bytes.equals(Buffer.from(png, "base64"))).toBe(true);
    } else if (format === "jpg") {
      expect([...bytes.subarray(0, 3)]).toEqual([255, 216, 255]);
    } else {
      expect(bytes.subarray(0, 4).toString()).toBe("RIFF");
      expect(bytes.subarray(8, 12).toString()).toBe("WEBP");
    }
    await expect(figure.getByRole("status")).toHaveText("Download started.");
  }
  fail = true;
  await figure.getByRole("button", { name: "Download WEBP" }).click();
  await expect(figure.getByRole("status")).toContainText("Try again");
  await expect(figure.getByRole("button", { name: "Download WEBP" })).toBeEnabled();
  await expect(figure.getByRole("link", { name: "Open full-size PNG", exact: true })).toHaveAttribute("href", /assets\.morsewords\.com/);
});
