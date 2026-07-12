import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs/promises";

import {
  chooseLanguageStudySheetImageCandidate,
  getLanguageStudySheetPixelRatio,
  languageStudySheetFilename,
} from "../../app/client/components/morse-code-by-language/languageStudySheetExport";
import { MORSE_LANGUAGE_PAGES } from "../../app/client/data/morseLanguages";
import { absoluteUrl } from "../../app/client/data/routes";
import {
  blockExternalNetwork,
  collectConsoleErrors,
  waitForRouteReady,
} from "./helpers";

type DownloadProbe = {
  blobTypes: string[];
  calls: number;
  scrollOverflow?: string;
  scrollOverflowX?: string;
  scrollbarWidth?: string;
};

type PrintProbe = {
  calls: number;
  hasActions: boolean;
  sheetCount: number;
  text: string;
};

declare global {
  interface Window {
    __mwLanguageSheetDownloadProbe?: DownloadProbe;
    __mwLanguageSheetPrintProbe?: PrintProbe;
  }
}

async function gotoLanguagePage(page: Page, path: string) {
  await blockExternalNetwork(page);
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
  expect(response?.ok()).toBe(true);
  await expect(page.locator('[data-testid="language-print-qr"] img')).toBeVisible();
}

function readImageDimensions(image: Buffer) {
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (image.subarray(0, 8).equals(pngSignature)) {
    return {
      height: image.readUInt32BE(20),
      mimeType: "image/png",
      width: image.readUInt32BE(16),
    };
  }

  if (image[0] === 0xff && image[1] === 0xd8) {
    let offset = 2;
    while (offset < image.length) {
      if (image[offset] !== 0xff) break;
      const marker = image[offset + 1];
      const length = image.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xc3) {
        return {
          height: image.readUInt16BE(offset + 5),
          mimeType: "image/jpeg",
          width: image.readUInt16BE(offset + 7),
        };
      }
      offset += 2 + length;
    }
  }

  throw new Error("Downloaded sheet image is not a supported PNG or JPEG.");
}

test.describe("language study-sheet export and print isolation", () => {
  for (const language of MORSE_LANGUAGE_PAGES) {
    test(`${language.languageName} inherits the shared study-sheet actions and canonical QR`, async ({
      page,
    }) => {
      await gotoLanguagePage(page, language.path);

      await expect(page.getByTestId("language-save-image-button")).toHaveAccessibleName(
        "Save image",
      );
      await expect(page.getByTestId("language-print-button")).toHaveAccessibleName(
        "Print sheet",
      );
      await expect(page.locator('[data-testid="language-printable-sheet"]')).toContainText(
        language.characters[0].target,
      );
      await expect(page.locator('[data-testid="language-print-qr"] img')).toHaveAttribute(
        "alt",
        `QR code for ${absoluteUrl(language.path)}`,
      );
    });
  }

  test("shared filename and scaling rules support registry-driven future language pages", () => {
    for (const language of MORSE_LANGUAGE_PAGES) {
      expect(languageStudySheetFilename(language.slug)).toBe(
        `${language.slug}-morse-code-language-sheet.png`,
      );
      expect(languageStudySheetFilename(language.slug, "jpg")).toBe(
        `${language.slug}-morse-code-language-sheet.jpg`,
      );
    }

    expect(languageStudySheetFilename("future-language")).toBe(
      "future-language-morse-code-language-sheet.png",
    );
    expect(languageStudySheetFilename("future-language", "jpg")).toBe(
      "future-language-morse-code-language-sheet.jpg",
    );
    expect(getLanguageStudySheetPixelRatio(816, 1200)).toBe(2);
    expect(getLanguageStudySheetPixelRatio(816, 12_000)).toBeGreaterThanOrEqual(1);
  });

  test("shared image format selection uses JPEG only when it is smaller than PNG", () => {
    const smallerPng = new Blob([new Uint8Array(50)], { type: "image/png" });
    const largerPng = new Blob([new Uint8Array(100)], { type: "image/png" });
    const smallerJpeg = new Blob([new Uint8Array(40)], { type: "image/jpeg" });
    const largerJpeg = new Blob([new Uint8Array(120)], { type: "image/jpeg" });

    expect(
      chooseLanguageStudySheetImageCandidate({
        jpeg: largerJpeg,
        png: smallerPng,
      }).extension,
    ).toBe("png");
    expect(
      chooseLanguageStudySheetImageCandidate({
        jpeg: smallerJpeg,
        png: largerPng,
      }).extension,
    ).toBe("jpg");
  });

  test("Save image downloads a complete, high-resolution image of only the Japanese study sheet", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const createObjectUrl = URL.createObjectURL.bind(URL);
      window.__mwLanguageSheetDownloadProbe = { blobTypes: [], calls: 0 };
      URL.createObjectURL = (value: Blob | MediaSource) => {
        const probe = window.__mwLanguageSheetDownloadProbe;
        if (probe && value instanceof Blob) {
          const scroll = document.querySelector<HTMLElement>(
            ".mw-language-sheet-export-root-image .mw-language-sheet-scroll",
          );
          const scrollStyle = scroll ? window.getComputedStyle(scroll) : null;
          probe.calls += 1;
          probe.blobTypes.push(value.type);
          probe.scrollOverflow = scrollStyle?.overflow;
          probe.scrollOverflowX = scrollStyle?.overflowX;
          probe.scrollbarWidth = scrollStyle?.getPropertyValue("scrollbar-width");
        }
        return createObjectUrl(value);
      };
    });
    await gotoLanguagePage(page, MORSE_LANGUAGE_PAGES[0].path);

    const sheet = page.locator('[data-testid="language-printable-sheet"]');
    const sheetBox = await sheet.boundingBox();
    expect(sheetBox).not.toBeNull();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("language-save-image-button").click(),
    ]);
    const filePath = await download.path();
    expect(filePath).not.toBeNull();
    expect(download.suggestedFilename()).toMatch(
      /^japanese-morse-code-language-sheet\.(png|jpg)$/,
    );

    const image = await fs.readFile(filePath!);
    const { height, mimeType, width } = readImageDimensions(image);
    expect(["image/jpeg", "image/png"]).toContain(mimeType);
    expect(image.length).toBeGreaterThan(20_000);
    expect(width).toBeGreaterThanOrEqual(Math.floor(sheetBox!.width * 1.5));
    expect(height).toBeGreaterThanOrEqual(Math.floor(sheetBox!.height * 1.5));

    const downloadProbe = await page.evaluate(() => window.__mwLanguageSheetDownloadProbe);
    expect(downloadProbe?.blobTypes.some((type) => ["image/jpeg", "image/png"].includes(type))).toBe(
      true,
    );
    expect(downloadProbe?.calls).toBeGreaterThan(0);
    expect(downloadProbe?.scrollOverflow).toBe("visible");
    expect(downloadProbe?.scrollOverflowX).toBe("visible");
    expect(downloadProbe?.scrollbarWidth).toBe("none");
    await expect(page.locator(".mw-language-sheet-export-root")).toHaveCount(0);
  });

  test("all supported scripts retain their sheet glyphs without hydration errors", async ({
    page,
  }) => {
    const consoleErrors = collectConsoleErrors(page);

    for (const language of MORSE_LANGUAGE_PAGES) {
      await gotoLanguagePage(page, language.path);
      await expect(page.locator('[data-testid="language-printable-sheet"]')).toContainText(
        language.characters.at(-1)?.target ?? "",
      );
    }

    expect(consoleErrors).toEqual([]);
  });

  test("Print sheet isolates exactly one study sheet and excludes page chrome", async ({
    page,
  }, testInfo) => {
    await page.addInitScript(() => {
      window.__mwLanguageSheetPrintProbe = {
        calls: 0,
        hasActions: false,
        sheetCount: 0,
        text: "",
      };
      window.print = () => {
        const root = document.querySelector<HTMLElement>(".mw-language-sheet-print-root");
        window.__mwLanguageSheetPrintProbe = {
          calls: (window.__mwLanguageSheetPrintProbe?.calls ?? 0) + 1,
          hasActions: Boolean(
            root?.querySelector(
              '[data-testid="language-save-image-button"], [data-testid="language-print-button"]',
            ),
          ),
          sheetCount: root?.querySelectorAll(".mw-language-print-sheet").length ?? 0,
          text: root?.innerText ?? "",
        };
      };
    });
    await gotoLanguagePage(page, MORSE_LANGUAGE_PAGES[0].path);

    await page.getByTestId("language-print-button").click();
    await expect
      .poll(async () => (await page.evaluate(() => window.__mwLanguageSheetPrintProbe?.calls)) ?? 0)
      .toBe(1);

    const printProbe = await page.evaluate(() => window.__mwLanguageSheetPrintProbe);
    expect(printProbe?.sheetCount).toBe(1);
    expect(printProbe?.hasActions).toBe(false);
    expect(printProbe?.text).toContain("Japanese Morse Code");
    expect(printProbe?.text).toContain("English A-Z comparison");
    expect(printProbe?.text).not.toContain("Hear each pattern");

    await page.emulateMedia({ media: "print" });
    const printRoot = page.locator(".mw-language-sheet-print-root");
    await expect(printRoot).toBeVisible();
    await expect(printRoot.locator(".mw-language-print-sheet")).toHaveCount(1);
    await expect(printRoot.locator(".mw-language-sheet-scroll")).toHaveCSS(
      "overflow",
      "visible",
    );
    await expect(page.locator("main").first()).toBeHidden();
    await expect(printRoot.getByText("Side-by-side study sheet")).toHaveCount(0);

    if (testInfo.project.name === "desktop-chromium") {
      const pdf = await page.pdf({
        format: "Letter",
        landscape: true,
        path: testInfo.outputPath("japanese-language-sheet.pdf"),
        printBackground: true,
      });
      expect(pdf.byteLength).toBeGreaterThan(10_000);
    }

    await page.emulateMedia({ media: "screen" });
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    await expect(page.locator(".mw-language-sheet-print-root")).toHaveCount(0);
  });

  test("390px language study-sheet actions wrap without horizontal overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoLanguagePage(page, MORSE_LANGUAGE_PAGES[2].path);

    await expect(page.getByTestId("language-save-image-button")).toBeVisible();
    await expect(page.getByTestId("language-print-button")).toBeVisible();
    const overflow = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });
});
