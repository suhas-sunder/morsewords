import { expect, test, type Page } from "@playwright/test";

import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const PRINT_ROUTES = [
  "/morse-code-books/walden/print",
  "/morse-code-books/the-call-of-cthulhu/print",
  "/morse-code-books/the-adventures-of-roderick-random/print",
] as const;

type PrintProbe = {
  calls: number;
  modeAtCall: string | null;
  singlePageAtCall: string | null;
  printablePageNumbersAtCall: string[];
};

declare global {
  interface Window {
    __mwPrintProbe?: PrintProbe;
  }
}

async function installPrintProbe(page: Page) {
  await page.addInitScript(() => {
    window.__mwPrintProbe = {
      calls: 0,
      modeAtCall: null,
      singlePageAtCall: null,
      printablePageNumbersAtCall: [],
    };

    window.print = () => {
      const root = document.querySelector<HTMLElement>(
        '[data-testid="printable-morse-pages"]',
      );
      const printablePageNumbersAtCall = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[data-testid="printable-page"][data-mw-single-page-printable="true"]',
        ),
      ).map((pageNode) => pageNode.dataset.mwPrintPageNumber || "");
      const previous = window.__mwPrintProbe;

      window.__mwPrintProbe = {
        calls: (previous?.calls ?? 0) + 1,
        modeAtCall: root?.dataset.mwPrintMode ?? null,
        singlePageAtCall: root?.dataset.mwPrintSinglePage ?? null,
        printablePageNumbersAtCall,
      };
    };
  });
}

async function gotoPrintRoute(page: Page, route: string) {
  await blockExternalNetwork(page);
  await installPrintProbe(page);
  const response = await page.goto(route, { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);

  expect(response?.status(), `${route} status`).toBeLessThan(400);
  await expect(page.getByText("Book text unavailable")).toHaveCount(0);
  await expect(page.getByTestId("printable-preview")).toBeVisible();
  await expect(page.getByTestId("printable-book-content-suitability")).toBeVisible();
  await expect(page.getByTestId("printable-morse-pages")).toHaveAttribute(
    "data-mw-print-client-ready",
    "true",
  );
  await expect(page.getByTestId("printable-morse-pages")).not.toHaveAttribute(
    "data-mw-print-section-count",
    "0",
  );
}

async function getPrintProbe(page: Page) {
  return page.evaluate(() => window.__mwPrintProbe);
}

async function getSinglePageFlags(page: Page) {
  return page.getByTestId("printable-page").evaluateAll((pageNodes) =>
    pageNodes.map((pageNode) => ({
      pageNumber:
        (pageNode as HTMLElement).dataset.mwPrintPageNumber ||
        pageNode.getAttribute("data-mw-print-page-number") ||
        "",
      printable:
        (pageNode as HTMLElement).dataset.mwSinglePagePrintable === "true",
    })),
  );
}

async function getChromeFlags(page: Page, testId: string) {
  return page.getByTestId(testId).evaluateAll((nodes) =>
    nodes.map(
      (node) =>
        (node as HTMLElement).dataset.mwFullBookPrintableChrome ||
        node.getAttribute("data-mw-full-book-printable-chrome") ||
        "",
    ),
  );
}

test.describe("Morse book print page UX", () => {
  for (const route of PRINT_ROUTES) {
    test(`${route} supports one-page print and cleaner full-book chrome`, async ({
      page,
    }) => {
      await gotoPrintRoute(page, route);

      const root = page.getByTestId("printable-morse-pages");
      const printThisPageButtons = page.getByTestId(
        "printable-print-this-page-button",
      );
      const pageCount = await page.getByTestId("printable-page").count();
      expect(pageCount, `${route} preview page count`).toBeGreaterThan(1);

      await expect(printThisPageButtons.first()).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Print or save PDF" }),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "Full book" })).toBeVisible();

      await page.emulateMedia({ media: "print" });
      await expect(page.getByTestId("printable-book-content-suitability")).toBeVisible();
      await page.emulateMedia({ media: "screen" });

      const qrChromeFlags = await getChromeFlags(page, "printable-qr");
      const footerChromeFlags = await getChromeFlags(page, "printable-page-footer");
      const contextChromeFlags = await getChromeFlags(page, "printable-page-context");
      expect(qrChromeFlags[0], `${route} first QR chrome`).toBe("true");
      expect(footerChromeFlags[0], `${route} first footer chrome`).toBe("true");
      expect(contextChromeFlags[0], `${route} first context chrome`).toBe("true");
      expect(qrChromeFlags.slice(1), `${route} repeated QR chrome`).toContain(
        "false",
      );
      expect(
        footerChromeFlags.slice(1),
        `${route} repeated footer chrome`,
      ).toContain("false");
      expect(
        contextChromeFlags.slice(1),
        `${route} repeated context chrome`,
      ).toContain("false");

      const selectedPageNumber = "2";
      await printThisPageButtons.nth(1).click();
      await expect(root).toHaveAttribute("data-mw-print-mode", "single-page");
      await expect(root).toHaveAttribute(
        "data-mw-print-single-page",
        selectedPageNumber,
      );

      const singlePageFlags = await getSinglePageFlags(page);
      expect(
        singlePageFlags
          .filter((flag) => flag.printable)
          .map((flag) => flag.pageNumber),
      ).toEqual([selectedPageNumber]);

      await page.emulateMedia({ media: "print" });
      const visiblePreviewPages = await page
        .getByTestId("printable-page-preview")
        .evaluateAll((previews) =>
          previews
            .filter(
              (preview) =>
                window.getComputedStyle(preview as HTMLElement).display !== "none",
            )
            .map(
              (preview) =>
                (preview as HTMLElement).dataset.mwPrintPageNumber || "",
            ),
        );
      expect(visiblePreviewPages).toEqual([selectedPageNumber]);
      await page.emulateMedia({ media: "screen" });

      await expect
        .poll(async () => (await getPrintProbe(page))?.calls ?? 0)
        .toBe(1);
      const singlePageProbe = await getPrintProbe(page);
      expect(singlePageProbe?.modeAtCall).toBe("single-page");
      expect(singlePageProbe?.singlePageAtCall).toBe(selectedPageNumber);
      expect(singlePageProbe?.printablePageNumbersAtCall).toEqual([
        selectedPageNumber,
      ]);

      await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
      await expect(root).toHaveAttribute("data-mw-print-mode", "idle");

      await page.getByTestId("printable-print-button").click();
      await expect(root).toHaveAttribute("data-mw-print-mode", "full-book");
      await expect
        .poll(async () => (await getPrintProbe(page))?.calls ?? 0)
        .toBe(2);
      const fullBookProbe = await getPrintProbe(page);
      expect(fullBookProbe?.modeAtCall).toBe("full-book");
      expect(fullBookProbe?.printablePageNumbersAtCall).toEqual([]);
    });
  }
});
