import { expect, test, type Page } from "@playwright/test";

import { gotoRoute } from "./helpers";

const ADSENSE_CLIENT_ID = "ca-pub-4810616735714570";

const SLOTS = {
  topBanner: "3254861050",
  postHeroBanner: "1798344543",
  leftSidebar: "9293691189",
  rightSidebar: "5981132138",
  inContent: "7431733612",
  toolkitBanner: "8224152097",
  optionalSquare: "6390114680",
  optionalBanner: "3766032339",
  optionalVertical: "9213764742",
} as const;

const SLOT_BY_PLACEMENT: Record<string, string> = {
  "book-player-banner": SLOTS.postHeroBanner,
  "in-content": SLOTS.inContent,
  "left-sidebar": SLOTS.leftSidebar,
  "optional-banner": SLOTS.optionalBanner,
  "optional-square": SLOTS.optionalSquare,
  "optional-vertical": SLOTS.optionalVertical,
  "post-hero": SLOTS.postHeroBanner,
  "printable-chart-square": SLOTS.optionalSquare,
  "right-sidebar": SLOTS.rightSidebar,
  "seo-section-content": SLOTS.inContent,
  "seo-section-vertical": SLOTS.inContent,
  "toolkit-banner": SLOTS.toolkitBanner,
  "top-banner": SLOTS.topBanner,
  "upper-content": SLOTS.postHeroBanner,
  "upper-content-mobile": SLOTS.postHeroBanner,
};

type EligibleRouteSpec = {
  route: string;
  upperPlacement: "post-hero" | "upper-content" | "book-player-banner";
  supportPlacement:
    | "optional-square"
    | "printable-chart-square"
    | "seo-section-content"
    | "seo-section-vertical";
  supportSlot: string;
  supportMethod: string;
};

type RequestedAd = {
  format: string;
  fullWidthResponsive: string;
  kind: string;
  placement: string;
  requestEligible: string;
  slot: string;
  height: number;
  x: number;
  width: number;
};

const eligibleRoutes: EligibleRouteSpec[] = [
  ["/", "post-hero", "optional-square", "square aside in the translator support section"],
  ["/how-to-use", "upper-content", "optional-square", "square aside in the workflow support guide"],
  ["/audio", "post-hero", "optional-square", "square aside in the audio settings support section"],
  ["/typing", "upper-content", "optional-square", "square aside in the typing guide support section"],
  ["/practice", "upper-content", "optional-square", "square aside in the practice guide support section"],
  ["/dictionary", "upper-content", "optional-square", "square aside in the lookup support section"],
  [
    "/morse-code-printable-chart",
    "upper-content",
    "printable-chart-square",
    "square aside in the printable support block",
  ],
  ["/morse-code-chart", "upper-content", "optional-square", "square aside in the chart usage support section"],
  ["/morse-code-alphabet", "upper-content", "optional-square", "square aside in the alphabet support guide"],
  ["/morse-code-numbers", "upper-content", "optional-square", "square aside in the number-pattern support section"],
  ["/morse-code-punctuation", "upper-content", "optional-square", "square aside in the punctuation support guide"],
  ["/morse-code-word-separator", "upper-content", "optional-square", "square aside in the spacing support guide"],
  [
    "/how-to-separate-words-in-morse-code",
    "upper-content",
    "optional-square",
    "square aside in the word-spacing guide content",
  ],
  ["/morse-code-reader", "upper-content", "optional-square", "square aside in the reader support explanation"],
  ["/morse-code-decoder", "upper-content", "optional-square", "square aside in the decoder support guide"],
  ["/morse-code-encoder", "upper-content", "optional-square", "square aside in the encoder support guide"],
  ["/morse-code-mp3-generator", "upper-content", "optional-square", "square aside in the MP3 support explanation"],
  [
    "/morse-code-word-search-builder",
    "upper-content",
    "optional-square",
    "square aside in the printable puzzle support guide",
  ],
  ["/learn-morse-code", "upper-content", "optional-square", "square aside in the learning-path support section"],
  ["/morse-code-books", "upper-content", "optional-square", "square aside in the book-library support copy"],
  ["/morse-code-audiobooks", "upper-content", "optional-square", "square aside in the audiobook-library support copy"],
  [
    "/morse-code-books/the-gold-bug",
    "book-player-banner",
    "optional-square",
    "square aside in the long book summary support section",
  ],
  [
    "/morse-code-audiobooks/the-gold-bug",
    "book-player-banner",
    "optional-square",
    "square aside in the long audiobook summary support section",
  ],
].map(([route, upperPlacement, supportPlacement, supportMethod]) => ({
  route,
  upperPlacement: upperPlacement as EligibleRouteSpec["upperPlacement"],
  supportPlacement: supportPlacement as EligibleRouteSpec["supportPlacement"],
  supportSlot: SLOTS.optionalSquare,
  supportMethod,
}));

eligibleRoutes.find(
  (spec) => spec.route === "/morse-code-printable-chart",
)!.supportSlot = SLOTS.optionalSquare;

const protectedOnlyRoutes = [
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  "/morse-code-books/the-gold-bug/print",
] as const;

const visualRoutes = [
  "/",
  "/how-to-use",
  "/audio",
  "/typing",
  "/practice",
  "/dictionary",
  "/morse-code-printable-chart",
  "/morse-code-chart",
  "/morse-code-alphabet",
  "/morse-code-numbers",
  "/morse-code-punctuation",
  "/morse-code-word-separator",
  "/how-to-separate-words-in-morse-code",
  "/morse-code-reader",
  "/morse-code-decoder",
  "/morse-code-encoder",
  "/morse-code-mp3-generator",
  "/morse-code-word-search-builder",
  "/learn-morse-code",
  "/morse-code-books",
  "/morse-code-audiobooks",
  "/morse-code-books/the-gold-bug",
  "/morse-code-audiobooks/the-gold-bug",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
] as const;
const architectureWidths = [390, 430, 1280, 1536] as const;
const midViewportWidths = [768, 1024] as const;
const protectedWidths = [390, 1536] as const;

const supportCandidatePlacements = new Set([
  "seo-section-content",
  "seo-section-vertical",
  "optional-square",
  "optional-banner",
  "optional-vertical",
  "printable-chart-square",
]);
const unusedSupportPlacements = [
  "seo-section-vertical",
  "optional-banner",
  "optional-vertical",
] as const;
const placementLabelSelector = ".mw-signal-caption";
const fallbackClassBlocklist = /(ad|ads|adsense|advert|sponsor|placeholder)/i;
const googleAdHosts =
  /(?:googlesyndication|doubleclick|googleadservices|googletagservices)\.com/i;

async function blockAdNetwork(page: Page) {
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (googleAdHosts.test(url.hostname)) {
      return route.abort("blockedbyclient");
    }
    return route.continue();
  });
}

async function gotoRouteForLayoutCheck(page: Page, route: string) {
  try {
    await gotoRoute(page, route);
  } catch {
    await expect(
      page.locator("main h1, h1").first(),
      `${route} should render before ad assertions run`,
    ).toBeVisible({ timeout: 5_000 });
    if (route !== "/") expect(page.url()).toContain(route);
  }
}

function adPlacement(page: Page, placement: string) {
  return page.locator(`[data-mw-ad-placement="${placement}"]`);
}

function expectedPlacementsFor(spec: EligibleRouteSpec, width: number) {
  const placements = [spec.upperPlacement, spec.supportPlacement, "toolkit-banner"];
  if (width >= 768) placements.unshift("top-banner");
  if (width >= 1536) {
    placements.splice(1, 0, "left-sidebar", "right-sidebar");
  }
  return placements;
}

async function requestedAds(page: Page) {
  await page.waitForFunction(
    () =>
      document.querySelectorAll<HTMLElement>("[data-mw-ad-placement]").length > 0,
    undefined,
    { timeout: 10_000 },
  );
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll<HTMLElement>("[data-mw-ad-placement]")].some(
        (ad) => ad.dataset.mwAdRequestEligible === "true",
      ),
    undefined,
    { timeout: 10_000 },
  );
  return page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("[data-mw-ad-placement]")]
      .map((ad) => ({
        kind: ad.dataset.mwAdKind ?? "",
        placement: ad.dataset.mwAdPlacement ?? "",
        requestEligible: ad.dataset.mwAdRequestEligible ?? "",
        slot: ad.dataset.mwAdSlot ?? "",
        format:
          ad.querySelector<HTMLElement>("ins.adsbygoogle")?.dataset.adFormat ?? "",
        fullWidthResponsive:
          ad.querySelector<HTMLElement>("ins.adsbygoogle")?.dataset
            .fullWidthResponsive ?? "",
        height: Math.round(ad.getBoundingClientRect().height),
        x: Math.round(ad.getBoundingClientRect().x),
        width: Math.round(ad.getBoundingClientRect().width),
      }))
      .filter(
        (ad) => Boolean(ad.placement && ad.slot) && ad.requestEligible === "true",
      ),
  );
}

function expectPlacementList(
  ads: RequestedAd[],
  expectedPlacements: string[],
  route: string,
  width: number,
) {
  expect(
    ads.map((ad) => ad.placement).sort(),
    `${route} at ${width}px configured placement list`,
  ).toEqual([...expectedPlacements].sort());
}

function expectNoDuplicateSlots(
  ads: Array<{ placement: string; slot: string }>,
  route: string,
  width: number,
) {
  const duplicates = ads.filter(
    (ad, index) => ads.findIndex((candidate) => candidate.slot === ad.slot) !== index,
  );
  expect(duplicates, `${route} at ${width}px reused a slot ID`).toEqual([]);
}

async function expectNoHorizontalOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
}

async function expectPlacementWidthWithinViewport(page: Page, placement: string) {
  const box = await adPlacement(page, placement).boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(box!.width).toBeLessThanOrEqual((viewport?.width ?? 0) + 1);
  expect(box!.x).toBeGreaterThanOrEqual(-1);
  expect(box!.x + box!.width).toBeLessThanOrEqual((viewport?.width ?? 0) + 1);
}

function expectedFormatForKind(kind: string) {
  if (kind === "banner") return "horizontal";
  if (kind === "vertical") return "vertical";
  return "rectangle";
}

async function expectPlacementCentered(page: Page, placement: string) {
  const delta = await adPlacement(page, placement).evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const parentRect = element.parentElement?.getBoundingClientRect();
    const containerRect =
      parentRect && parentRect.width < window.innerWidth - 2
        ? parentRect
        : { x: 0, width: document.documentElement.clientWidth };
    return Math.abs(
      rect.x + rect.width / 2 - (containerRect.x + containerRect.width / 2),
    );
  });
  expect(delta).toBeLessThanOrEqual(3);
}

async function expectPlaceholderVisible(page: Page, placement: string) {
  const shell = adPlacement(page, placement);
  const label = shell.locator(placementLabelSelector);
  await expect(shell).toHaveAttribute("data-mw-ad-placeholder-visible", "true");
  await expect(label).toBeVisible();
  await expect(label).toHaveText("Advertisements");
  await expect(label).toHaveCSS("border-top-style", "dashed");
  await expect(label).toHaveCSS("border-top-width", "2px");
  await expect(shell).toHaveCSS("border-top-style", "none");
  const labelOutsideIns = await shell.evaluate((element, selector) => {
    const labelElement = element.querySelector(selector);
    const insElement = element.querySelector("ins.adsbygoogle");
    return Boolean(labelElement && (!insElement || !insElement.contains(labelElement)));
  }, placementLabelSelector);
  expect(labelOutsideIns).toBe(true);
  const classNames = await shell.evaluate((element, selector) => {
    const labelElement = element.querySelector<HTMLElement>(selector);
    return {
      label: labelElement?.className ?? "",
      shell: element.className,
    };
  }, placementLabelSelector);
  expect(classNames.shell).not.toMatch(fallbackClassBlocklist);
  expect(classNames.label).not.toMatch(fallbackClassBlocklist);
}

async function expectSidebarPendingVisible(page: Page, placement: string) {
  const shell = adPlacement(page, placement);
  const label = shell.locator(placementLabelSelector);
  await expect(shell).toHaveCount(1);
  await expect(shell).toHaveAttribute("data-mw-ad-status", "pending");
  await expect(shell).toHaveAttribute("data-mw-ad-placeholder-visible", "true");
  await expect(label).toBeVisible();
  await expect(label).toHaveText("Advertisements");
  await expect(shell).toHaveCSS("opacity", "1");
  await expect(shell).toHaveCSS("pointer-events", "auto");
}

async function expectSidebarFallbackVisible(page: Page, placement: string) {
  const shell = adPlacement(page, placement);
  const label = shell.locator(placementLabelSelector);
  await expect(shell).toHaveCount(1);
  await expect(shell).toHaveAttribute("data-mw-ad-placeholder-visible", "true");
  await expect(label).toBeVisible();
  await expect(label).toHaveText("Advertisements");
  await expect(shell).toHaveCSS("opacity", "1");
  await expect(shell).toHaveCSS("pointer-events", "auto");
}

async function setAdStatus(
  page: Page,
  placement: string,
  status: "filled" | "unfilled",
) {
  const shell = adPlacement(page, placement);
  await expect(shell).toHaveCount(1);
  await shell.locator("ins").evaluate((element, nextStatus) => {
    element.setAttribute("data-ad-status", nextStatus);
  }, status);
  await expect(shell).toHaveAttribute("data-mw-ad-status", status);
}

async function simulateFilledCreative(page: Page, placement: string) {
  const shell = adPlacement(page, placement);
  await expect(shell).toHaveCount(1);
  await shell.locator("ins").evaluate((element) => {
    const host = element as HTMLElement;
    const wrapper = host.closest<HTMLElement>("[data-mw-ad-placement]");
    const kind = wrapper?.dataset.mwAdKind ?? "banner";
    const width = kind === "vertical" ? 120 : kind === "square" ? 300 : 728;
    const height = kind === "vertical" ? 600 : kind === "square" ? 250 : 90;
    host.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.title = "Simulated filled advertisement";
    iframe.width = String(width);
    iframe.height = String(height);
    iframe.style.display = "block";
    iframe.style.width = `${width}px`;
    iframe.style.maxWidth = "100%";
    iframe.style.height = `${height}px`;
    iframe.setAttribute("data-testid", "mw-simulated-filled-creative");
    host.append(iframe);
    host.setAttribute("data-ad-status", "filled");
  });
  await expectFilledChromeHidden(page, placement);
  await expect(shell.locator('[data-testid="mw-simulated-filled-creative"]')).toBeVisible();
}

async function expectFilledChromeHidden(page: Page, placement: string) {
  const shell = adPlacement(page, placement);
  await expect(shell).toHaveAttribute("data-mw-ad-status", "filled");
  await expect(shell).toHaveAttribute("data-mw-ad-placeholder-visible", "false");
  await expect(shell.locator(placementLabelSelector)).toBeHidden();
  await expect(shell).toHaveCSS("border-top-style", "none");
  await expect(shell).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  const metrics = await shell.evaluate((element) => {
    const style = getComputedStyle(element);
    const ins = element.querySelector<HTMLElement>("ins.adsbygoogle");
    const insStyle = ins ? getComputedStyle(ins) : null;
    return {
      maxHeight: style.maxHeight,
      overflow: style.overflow,
      insMaxHeight: insStyle?.maxHeight ?? "",
      insOverflow: insStyle?.overflow ?? "",
    };
  });
  expect(metrics.maxHeight).toBe("none");
  expect(metrics.overflow).toBe("visible");
  expect(metrics.insMaxHeight).toBe("none");
  expect(metrics.insOverflow).toBe("visible");
}

test.beforeEach(async ({ page }) => {
  await blockAdNetwork(page);
});

test("loads the AdSense script once with the configured client", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await gotoRoute(page, "/");

  const script = page.locator("script#mw-adsense-script");
  await expect(script).toHaveCount(1);
  await expect(script).toHaveAttribute("src", new RegExp(ADSENSE_CLIENT_ID));
});

const renderedAttributeCases = [
  {
    route: "/",
    width: 1536,
    placement: "top-banner",
    slot: SLOTS.topBanner,
    format: "horizontal",
  },
  {
    route: "/",
    width: 1536,
    placement: "left-sidebar",
    slot: SLOTS.leftSidebar,
    format: "vertical",
  },
  {
    route: "/",
    width: 1536,
    placement: "right-sidebar",
    slot: SLOTS.rightSidebar,
    format: "vertical",
  },
  {
    route: "/",
    width: 1280,
    placement: "post-hero",
    slot: SLOTS.postHeroBanner,
    format: "horizontal",
  },
  {
    route: "/",
    width: 1280,
    placement: "optional-square",
    slot: SLOTS.optionalSquare,
    format: "rectangle",
  },
  {
    route: "/",
    width: 1280,
    placement: "toolkit-banner",
    slot: SLOTS.toolkitBanner,
    format: "horizontal",
  },
] as const;

for (const attributeCase of renderedAttributeCases) {
  test(`rendered AdSense attributes: ${attributeCase.placement}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: attributeCase.width, height: 1200 });
    await gotoRouteForLayoutCheck(page, attributeCase.route);
    const ins = adPlacement(page, attributeCase.placement).locator("ins.adsbygoogle");
    await expect(ins).toHaveCount(1);
    await expect(ins).toHaveAttribute("data-ad-client", ADSENSE_CLIENT_ID);
    await expect(ins).toHaveAttribute("data-ad-slot", attributeCase.slot);
    await expect(ins).toHaveAttribute("data-ad-format", attributeCase.format);
    await expect(ins).toHaveAttribute("data-full-width-responsive", "true");
    await expect(ins).toHaveCSS("display", "block");
    await expect(ins).toHaveCSS("overflow", "visible");
    await setAdStatus(page, attributeCase.placement, "filled");
    await expectFilledChromeHidden(page, attributeCase.placement);
    const metrics = await ins.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        height: Math.round(rect.height),
        maxHeight: style.maxHeight,
        maxWidth: style.maxWidth,
        width: Math.round(rect.width),
      };
    });
    expect(metrics.width).toBeGreaterThan(0);
    expect(metrics.maxHeight).toBe("none");
    expect(metrics.maxWidth).toBe("100%");
  });
}

async function assertEligibleRouteArchitecture(
  page: Page,
  spec: EligibleRouteSpec,
  width: number,
) {
  await page.setViewportSize({ width, height: 1200 });
  await gotoRouteForLayoutCheck(page, spec.route);

  const ads = await requestedAds(page);
  const expectedPlacements = expectedPlacementsFor(spec, width);
  expectPlacementList(ads, expectedPlacements, spec.route, width);
  expectNoDuplicateSlots(ads, spec.route, width);

  for (const ad of ads) {
    expect(SLOT_BY_PLACEMENT[ad.placement]).toBe(ad.slot);
    expect(ad.format, `${spec.route}: ${ad.placement} keeps its ad shape`).toBe(
      expectedFormatForKind(ad.kind),
    );
    expect(
      ad.fullWidthResponsive,
      `${spec.route}: ${ad.placement} remains responsive`,
    ).toBe("true");
    await expect(adPlacement(page, ad.placement)).toHaveAttribute(
      "data-mw-ad-request-eligible",
      "true",
    );
    if (!ad.placement.includes("sidebar")) {
      await expectPlacementWidthWithinViewport(page, ad.placement);
      if (ad.kind === "banner") {
        expect(
          ad.height,
          `${spec.route}: ${ad.placement} should stay banner-shaped`,
        ).toBeLessThanOrEqual(width < 768 ? 120 : 110);
      }
      if (ad.kind === "square") {
        expect(
          ad.width,
          `${spec.route}: ${ad.placement} should stay square-width`,
        ).toBeLessThanOrEqual(320);
        expect(
          ad.height,
          `${spec.route}: ${ad.placement} should stay square-height`,
        ).toBeLessThanOrEqual(270);
      }
    } else {
      await expectSidebarFallbackVisible(page, ad.placement);
    }
  }

  const supportAds = ads.filter((ad) =>
    supportCandidatePlacements.has(ad.placement),
  );
  expect(supportAds, `${spec.route}: ${spec.supportMethod}`).toHaveLength(1);
  expect(supportAds[0].placement).toBe(spec.supportPlacement);
  expect(supportAds[0].slot).toBe(spec.supportSlot);

  for (const placement of unusedSupportPlacements) {
    await expect(adPlacement(page, placement)).toHaveCount(0);
  }

  await expectNoHorizontalOverflow(page);
}

for (const spec of eligibleRoutes) {
  for (const width of architectureWidths) {
    test(`eligible route architecture: ${spec.route} at ${width}px`, async ({
      page,
    }) => {
      await assertEligibleRouteArchitecture(page, spec, width);
    });
  }
}

test("banner-like placements are centered on representative templates", async ({
  page,
}) => {
  for (const spec of [
    eligibleRoutes[0],
    eligibleRoutes[1],
    eligibleRoutes[2],
    eligibleRoutes.find((item) => item.route === "/morse-code-books/the-gold-bug")!,
  ]) {
    await page.setViewportSize({ width: 1280, height: 1200 });
    await gotoRouteForLayoutCheck(page, spec.route);
    await expectPlacementCentered(page, "top-banner");
    await expectPlacementCentered(page, spec.upperPlacement);
    await expectPlacementCentered(page, "toolkit-banner");
    await expectNoHorizontalOverflow(page);
  }
});

async function assertProtectedRouteArchitecture(
  page: Page,
  route: string,
  width: number,
) {
  await page.setViewportSize({ width, height: 1100 });
  await gotoRouteForLayoutCheck(page, route);
  const ads = await requestedAds(page);
  const expectedPlacements =
    width >= 1536
      ? ["top-banner", "left-sidebar", "right-sidebar", "toolkit-banner"]
      : ["toolkit-banner"];
  expectPlacementList(ads, expectedPlacements, route, width);
  expectNoDuplicateSlots(ads, route, width);
  await expectNoHorizontalOverflow(page);

  if (width >= 1536) {
    await expectPlaceholderVisible(page, "top-banner");
    await expectSidebarFallbackVisible(page, "left-sidebar");
    await expectSidebarFallbackVisible(page, "right-sidebar");
    await expectPlaceholderVisible(page, "toolkit-banner");
  } else {
    await expectPlaceholderVisible(page, "toolkit-banner");
  }
}

for (const route of protectedOnlyRoutes) {
  for (const width of protectedWidths) {
    test(`protected route architecture: ${route} at ${width}px`, async ({
      page,
    }) => {
      await assertProtectedRouteArchitecture(page, route, width);
    });
  }
}

test("desktop sidebars request at wide width, keep stable fallback, and clean up when filled", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1536, height: 1100 });
  await gotoRouteForLayoutCheck(page, "/");

  for (const placement of ["left-sidebar", "right-sidebar"]) {
    const shell = adPlacement(page, placement);
    await expect(shell).toHaveCount(1);
    await expect(shell).toHaveAttribute("data-mw-ad-request-eligible", "true");
    await expect(shell).toHaveAttribute("data-mw-ad-fallback", "placeholder");
    await expect(shell).toHaveAttribute("data-mw-ad-has-placeholder", "true");
    await expectSidebarFallbackVisible(page, placement);

    await simulateFilledCreative(page, placement);
    await expect(shell).toHaveCSS("opacity", "1");
  }
});

test("desktop sidebars keep stable fallback through pending, blocked, and unfilled states", async ({
  page,
}) => {
  await page.unroute("**/*");
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (googleAdHosts.test(url.hostname)) {
      return route.fulfill({
        body: "window.adsbygoogle = window.adsbygoogle || [];",
        contentType: "application/javascript",
        status: 200,
      });
    }
    return route.continue();
  });

  await page.setViewportSize({ width: 1536, height: 1100 });
  await gotoRouteForLayoutCheck(page, "/");

  for (const placement of ["left-sidebar", "right-sidebar"]) {
    await expectSidebarPendingVisible(page, placement);
    await setAdStatus(page, placement, "unfilled");
    await expectSidebarFallbackVisible(page, placement);
  }
});

test("book detail support ad preserves readable summary text width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1536, height: 1200 });
  await gotoRouteForLayoutCheck(page, "/morse-code-books/the-gold-bug");
  await expect(
    page.locator(
      '[data-testid="morse-book-seo-summary"] [data-mw-ad-placement="optional-square"]',
    ),
  ).toHaveCount(1);

  const summaryMetrics = await page
    .locator('[data-testid="morse-book-seo-summary"]')
    .evaluate((section) => {
      const layout = section.querySelector<HTMLElement>(
        '[data-testid="morse-book-seo-summary-body"] > div',
      );
      const text = layout?.firstElementChild as HTMLElement | null;
      const ad = section.querySelector<HTMLElement>("[data-mw-ad-placement]");
      const textRect = text?.getBoundingClientRect();
      const adRect = ad?.getBoundingClientRect();
      return {
        adHeight: Math.round(adRect?.height ?? 0),
        adPlacement: ad?.dataset.mwAdPlacement ?? "",
        adWidth: Math.round(adRect?.width ?? 0),
        columnCount: text ? getComputedStyle(text).columnCount : "",
        textWidth: Math.round(textRect?.width ?? 0),
      };
    });

  expect(summaryMetrics.adPlacement).toBe("optional-square");
  expect(summaryMetrics.textWidth).toBeGreaterThanOrEqual(680);
  expect(summaryMetrics.columnCount).toBe("auto");
  expect(summaryMetrics.adWidth).toBeLessThanOrEqual(320);
  expect(summaryMetrics.adHeight).toBeLessThanOrEqual(270);
});

test("fallback and filled states remain separate", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1100 });
  await gotoRouteForLayoutCheck(page, "/");

  for (const placement of ["top-banner", "post-hero", "optional-square", "toolkit-banner"]) {
    await expectPlaceholderVisible(page, placement);
  }

  await adPlacement(page, "post-hero").locator("ins").evaluate((element) => {
    (element as HTMLElement).style.display = "none";
  });
  await expectPlaceholderVisible(page, "post-hero");

  await adPlacement(page, "optional-square").locator("ins").evaluate((element) => {
    element.remove();
  });
  await expect(adPlacement(page, "optional-square").locator("ins")).toHaveCount(0);
  await expectPlaceholderVisible(page, "optional-square");

  for (const placement of ["top-banner", "post-hero", "optional-square", "toolkit-banner"]) {
    const ins = adPlacement(page, placement).locator("ins");
    if ((await ins.count()) === 0) continue;
    const before = await adPlacement(page, placement).boundingBox();
    await simulateFilledCreative(page, placement);
    const after = await adPlacement(page, placement).boundingBox();
    expect(Math.abs((after?.y ?? 0) - (before?.y ?? 0))).toBeLessThanOrEqual(
      2,
    );
    expect(Math.abs((after?.height ?? 0) - (before?.height ?? 0))).toBeLessThanOrEqual(
      2,
    );
  }
});

test("placeholder labels are policy-safe and consistently styled", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await gotoRouteForLayoutCheck(page, "/");

  const visibleLabels = page.locator(
    '[data-mw-ad-placeholder-visible="true"] .mw-signal-caption',
  );
  await expect(visibleLabels.first()).toBeVisible();
  const labels = await visibleLabels.evaluateAll((elements) =>
    elements.map((element) => {
      const style = getComputedStyle(element);
      return {
        borderColor: style.borderTopColor,
        borderStyle: style.borderTopStyle,
        borderWidth: style.borderTopWidth,
        className: element.className,
        text: element.textContent?.trim() ?? "",
      };
    }),
  );
  expect(labels.length).toBe(4);
  for (const label of labels) {
    expect(["Advertisements", "Sponsored Links"]).toContain(label.text);
    expect(label.borderStyle).toBe("dashed");
    expect(label.borderWidth).toBe("2px");
    expect(label.className).not.toMatch(fallbackClassBlocklist);
  }
  expect(new Set(labels.map((label) => label.borderColor)).size).toBe(1);
});

test("ads stay outside forms, player, output, and action-control clusters", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/audio",
    "/dictionary",
    "/morse-code-printable-chart",
    "/morse-code-reader",
    "/morse-code-books",
    "/morse-code-books/the-gold-bug",
  ]) {
    await page.setViewportSize({ width: 1024, height: 1200 });
    await gotoRouteForLayoutCheck(page, route);
    const unsafePlacements = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("[data-mw-ad-placement]")]
        .filter((ad) =>
          Boolean(
            ad.closest(
              [
                "form",
                "textarea",
                "select",
                "button",
                '[data-testid*="toolbar"]',
                '[data-testid*="download"]',
                '[data-mw-morse-book-output-foundation="true"]',
              ].join(","),
            ),
          ),
        )
        .map((ad) => ad.dataset.mwAdPlacement),
    );
    expect(unsafePlacements, `${route} has unsafe ad placement`).toEqual([]);
  }
});

for (const route of visualRoutes) {
  for (const width of midViewportWidths) {
    test(`mid-viewport overflow guard: ${route} at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await gotoRouteForLayoutCheck(page, route);
      await expectNoHorizontalOverflow(page);
    });
  }
}
