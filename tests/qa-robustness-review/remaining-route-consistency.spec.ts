import fs from "node:fs";

import { expect, test, type Page } from "@playwright/test";

import { PHRASE_ROWS } from "../../app/client/components/dictionary/dictionaryData";
import {
  TEXT_TO_MORSE,
  formatMorseWords,
  splitMorseWords,
  textToMorse,
} from "../../app/client/components/shared/morseUtils";
import {
  blockExternalNetwork,
  collectConsoleErrors,
  expectNoVisiblePrematureWarning,
} from "./helpers";

const SITE_URL = "https://www.morsewords.com";
const TARGET_ROUTES = [
  "/morse-code-chart",
  "/morse-code-printable-chart",
  "/morse-code-reader",
  "/dictionary",
  "/morse-code-word-separator",
  "/typing",
  "/morse-code-word-trainer",
] as const;

function readRepoFile(relativePath: string) {
  return fs.readFileSync(new URL(`../../${relativePath}`, import.meta.url), "utf8");
}

function sharedDictionaryMorse(value: string) {
  return formatMorseWords(splitMorseWords(textToMorse(value)), {
    letterSeparator: " ",
    wordSeparator: " / ",
  });
}

async function waitForPageReady(page: Page) {
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
}

function isExpectedHarnessConsoleEntry(text: string) {
  return (
    text.includes("ERR_BLOCKED_BY_CLIENT") ||
    text.includes("Failed to fetch manifest patches") ||
    text.includes("WebSocket connection") ||
    text.includes("[vite] failed to connect to websocket") ||
    text.includes("WebSocket closed without opened.")
  );
}

test.describe("remaining route consistency pass", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("dictionary entries derive from shared Morse data and keep legacy coverage", async ({
    page,
  }) => {
    const dictionaryRouteSource = readRepoFile("app/routes/dictionary.tsx");
    const dictionaryDataSource = readRepoFile(
      "app/client/components/dictionary/dictionaryData.ts",
    );

    expect(dictionaryRouteSource).toContain("CHARACTER_ORDER");
    expect(dictionaryRouteSource).toContain("PHRASE_ROWS");
    expect(dictionaryRouteSource).not.toContain("const qcodes: Entry[]");
    expect(dictionaryRouteSource).not.toContain('morse:"- .... -..-"');
    expect(dictionaryDataSource).toContain('dictionaryTextToMorse("TNX")');

    const tnx = PHRASE_ROWS.find((item) => item.phrase === "TNX");
    expect(tnx?.morse).toBe(sharedDictionaryMorse("TNX"));
    expect(tnx?.morse).toBe("- -. -..-");

    for (const phrase of [
      "LOVE",
      "FRIEND",
      "NEED ASSISTANCE",
      "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
      "PACK MY BOX WITH FIVE DOZEN LIQUOR JUGS",
      "MORSE CODE IS FUN",
      "KEEP PRACTICING",
      "LISTEN LEARN REPEAT",
    ]) {
      expect(
        PHRASE_ROWS.some((item) => item.phrase === phrase),
        `${phrase} remains in shared dictionary data`,
      ).toBe(true);
    }

    await page.goto("/dictionary", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);
    await expect(page.locator("h1")).toHaveText("Morse Code Dictionary");

    const firstCharacterLabels = await page
      .locator("#characters tbody tr td:first-child")
      .evaluateAll((cells) =>
        cells.slice(0, 3).map((cell) => cell.textContent?.trim()),
      );
    expect(firstCharacterLabels).toEqual(["A", "B", "C"]);

    await page.getByLabel("Filter dictionary").fill("TNX");
    await expect(page.locator("main")).toContainText("- -. -..-");
    expect(await page.locator("main").textContent()).not.toContain("- .... -..-");

    await page.getByLabel("Filter dictionary").fill("THE QUICK");
    await expect(page.locator("main")).toContainText(
      "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
    );
    await expect(page.locator("main")).toContainText(" / ");
  });

  test("chart and printable chart punctuation stay tied to the shared map", async ({
    page,
  }) => {
    const chartSource = readRepoFile("app/routes/morse-code-chart.tsx");
    const printableSource = readRepoFile("app/routes/morse-code-printable-chart.tsx");
    const punctuationEntries = Object.entries(TEXT_TO_MORSE).filter(
      ([character]) => !/^[A-Z0-9]$/.test(character),
    );

    expect(chartSource).toContain("Object.keys(TEXT_TO_MORSE).filter");
    expect(printableSource).toContain("Object.keys(TEXT_TO_MORSE).filter");
    expect(printableSource).toContain("formatMorseWords");
    expect(printableSource).toContain("textToMorse");

    await page.goto("/morse-code-chart", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);
    await expect(
      page.locator('[data-chart-section="punctuation"] [data-chart-row]'),
    ).toHaveCount(punctuationEntries.length);

    for (const [, morse] of punctuationEntries) {
      await expect(page.locator('[data-chart-section="punctuation"]')).toContainText(
        morse,
      );
    }

    await page.goto("/morse-code-printable-chart", {
      waitUntil: "domcontentloaded",
    });
    await waitForPageReady(page);
    for (const [character, morse] of punctuationEntries) {
      await expect(
        page.locator("main"),
        `${character} printable punctuation row`,
      ).toContainText(morse);
    }
  });

  test("word separator uses shared parser output and disables empty copy", async ({
    page,
  }) => {
    await page.goto("/morse-code-word-separator", {
      waitUntil: "domcontentloaded",
    });
    await waitForPageReady(page);

    const morseInput = page.getByLabel("Paste Morse");
    await morseInput.fill("");
    await expect(morseInput).toHaveValue("");
    await expect(page.locator("pre").first()).toHaveText("-");
    await expect(page.getByRole("button", { name: "Copy output" })).toBeDisabled();

    await morseInput.fill("... /// //// --- ||| ...");
    await expect(page.locator("pre").first()).toHaveText(
      "...       ---       ...",
    );

    await page.getByRole("button", { name: "/", exact: true }).click();
    await expect(page.locator("pre").first()).toHaveText("... / --- / ...");

    await page.getByRole("button", { name: "English to Morse" }).click();
    await page.getByLabel("English input").fill("THANK YOU");
    await expect(page.locator("pre").first()).toHaveText(
      sharedDictionaryMorse("THANK YOU"),
    );
  });

  test("typing alias redirects while canonical typing keeps safe defaults", async ({
    page,
    request,
  }) => {
    const redirect = await request.get("/morse-code-typing-test", {
      maxRedirects: 0,
    });
    expect(redirect.status()).toBe(301);
    expect(redirect.headers().location).toBe("/morse-code-test");

    await page.addInitScript(() => {
      window.localStorage.setItem("mw_typing_input_mode", "vim");
      window.localStorage.setItem("mw_typing_show_stats", "sometimes");
      window.localStorage.setItem("mw_typing_duration_sec", "37");
    });

    await page.goto("/typing", { waitUntil: "domcontentloaded" });
    await waitForPageReady(page);
    await expect(page.getByText("Duration: 00:30")).toBeVisible();

    const input = page.getByLabel("Morse typing input");
    await input.fill(".- ");

    await expect(input).toHaveValue(".- ");
    await expect(page.locator("pre").first()).toContainText("A");
  });

  test("target pages keep canonical metadata, internal links, and no flash overlay", async ({
    page,
    request,
  }, testInfo) => {
    test.setTimeout(90_000);
    const checkInternalLinks = !testInfo.project.name.includes("mobile");
    const checkedPaths = new Map<string, number>();

    for (const routePath of TARGET_ROUTES) {
      const consoleEntries = collectConsoleErrors(page);
      await page.goto(routePath, { waitUntil: "domcontentloaded" });
      await waitForPageReady(page);
      await expect(page.locator("h1").first()).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `${SITE_URL}${routePath}`,
      );
      await expectNoVisiblePrematureWarning(page);
      await expect(page.locator('[data-testid*="flash" i]')).toHaveCount(0);

      if (checkInternalLinks) {
        const internalPaths = await page.locator("main a[href]").evaluateAll((links) =>
          [
            ...new Set(
              links
                .map((link) => (link as HTMLAnchorElement).getAttribute("href") ?? "")
                .filter((href) => href.startsWith("/"))
                .map((href) => new URL(href, window.location.origin).pathname),
            ),
          ],
        );

        for (const internalPath of internalPaths) {
          let status = checkedPaths.get(internalPath);
          if (status === undefined) {
            const response = await request.get(internalPath, { maxRedirects: 0 });
            status = response.status();
            checkedPaths.set(internalPath, status);
          }
          expect(
            status,
            `${routePath} links to reachable ${internalPath}`,
          ).toBeLessThan(400);
        }
      }

      expect(
        consoleEntries.filter(
          (entry) =>
            /TypeError|ReferenceError|Hydration failed/i.test(entry.text) &&
            !isExpectedHarnessConsoleEntry(entry.text),
        ),
        `${routePath} serious console errors`,
      ).toEqual([]);
    }
  });
});
