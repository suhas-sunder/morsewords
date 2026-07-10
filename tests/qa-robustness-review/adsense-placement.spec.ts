import { expect, test, type Page } from "@playwright/test";

import { gotoRoute } from "./helpers";

test.setTimeout(90_000);

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
  "post-primary-content": SLOTS.postHeroBanner,
  "printable-chart-square": SLOTS.optionalSquare,
  "right-sidebar": SLOTS.rightSidebar,
  "seo-section-content": SLOTS.inContent,
  "seo-section-vertical": SLOTS.inContent,
  "toolkit-banner": SLOTS.toolkitBanner,
  "top-banner": SLOTS.topBanner,
};

const primaryOrderCases = [
  ["/", "main textarea", "translator workspace"],
  ["/audio", "main textarea", "audio controls"],
  ["/morse-code-test", '[data-testid="morse-code-assessment"]', "skills test"],
  ["/morse-code-encoder", "main textarea", "encoder workspace"],
  ["/morse-code-decoder", "main textarea", "decoder workspace"],
  ["/practice", 'input[aria-label="Practice answer"]', "practice session"],
  ["/typing", "main textarea", "typing interface"],
  ["/morse-code-printable-chart", "#builder", "printable builder"],
  ["/morse-code-books/the-gold-bug", '[data-testid="morse-book-live-player"]', "book player"],
  ["/morse-code-alphabet", "main section", "reference content"],
] as const;

type EligibleRouteSpec = {
  route: string;
  upperPlacement: "post-hero" | "post-primary-content";
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
  ["/how-to-use", "post-primary-content", "optional-square", "square aside in the workflow support guide"],
  ["/audio", "post-hero", "optional-square", "square aside in the audio settings support section"],
  ["/typing", "post-primary-content", "optional-square", "square aside in the typing guide support section"],
  ["/practice", "post-primary-content", "optional-square", "square aside in the practice guide support section"],
  ["/dictionary", "post-primary-content", "optional-square", "square aside in the lookup support section"],
  [
    "/morse-code-printable-chart",
    "post-primary-content",
    "printable-chart-square",
    "square aside in the printable support block",
  ],
  ["/morse-code-chart", "post-primary-content", "optional-square", "square aside in the chart usage support section"],
  ["/morse-code-alphabet", "post-primary-content", "optional-square", "square aside in the alphabet support guide"],
  ["/morse-code-numbers", "post-primary-content", "optional-square", "square aside in the number-pattern support section"],
  ["/morse-code-punctuation", "post-primary-content", "optional-square", "square aside in the punctuation support guide"],
  ["/morse-code-word-separator", "post-primary-content", "optional-square", "square aside in the spacing support guide"],
  [
    "/how-to-separate-words-in-morse-code",
    "post-primary-content",
    "optional-square",
    "square aside in the word-spacing guide content",
  ],
  ["/morse-code-reader", "post-primary-content", "optional-square", "square aside in the reader support explanation"],
  ["/morse-code-decoder", "post-primary-content", "optional-square", "square aside in the decoder support guide"],
  ["/morse-code-encoder", "post-primary-content", "optional-square", "square aside in the encoder support guide"],
  ["/morse-code-mp3-generator", "post-primary-content", "optional-square", "square aside in the MP3 support explanation"],
  [
    "/morse-code-word-search-builder",
    "post-primary-content",
    "optional-square",
    "square aside in the printable puzzle support guide",
  ],
  ["/learn-morse-code", "post-primary-content", "optional-square", "square aside in the learning-path support section"],
  ["/morse-code-books", "post-primary-content", "optional-square", "square aside in the book-library support copy"],
  ["/morse-code-audiobooks", "post-primary-content", "optional-square", "square aside in the audiobook-library support copy"],
  [
    "/morse-code-books/the-gold-bug",
    "post-primary-content",
    "optional-square",
    "square aside in the long book summary support section",
  ],
  [
    "/morse-code-audiobooks/the-gold-bug",
    "post-primary-content",
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
    { timeout: 30_000 },
  );
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll<HTMLElement>("[data-mw-ad-placement]")].some(
        (ad) => ad.dataset.mwAdRequestEligible === "true",
      ),
    undefined,
    { timeout: 30_000 },
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

function expectedFormatForPlacement(
  placement: string,
  _kind: string,
  _width: number,
) {
  if (placement === "top-banner") return "horizontal";
  return "auto";
}

function expectedFullWidthResponsiveForPlacement(placement: string) {
  return placement === "top-banner" ? "" : "true";
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

async function expectAdContentCentered(page: Page, placement: string) {
  const delta = await adPlacement(page, placement).evaluate((element) => {
    const shellRect = element.getBoundingClientRect();
    const unit = element.querySelector<HTMLElement>(".mw-signal-unit");
    const firstChild = unit?.firstElementChild;
    const target =
      firstChild instanceof HTMLElement && firstChild.getBoundingClientRect().width > 0
        ? firstChild
        : unit;
    if (!target) return 0;
    const targetRect = target.getBoundingClientRect();
    return Math.abs(
      targetRect.x +
        targetRect.width / 2 -
        (shellRect.x + shellRect.width / 2),
    );
  });
  expect(delta, `${placement} creative should be centered inside its ad shell`).toBeLessThanOrEqual(3);
}

async function placementGeometry(page: Page, placement: string) {
  return adPlacement(page, placement).evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      height: rect.height,
      marginBottom: style.marginBottom,
      marginTop: style.marginTop,
      pageY: rect.top + window.scrollY,
      width: rect.width,
    };
  });
}

async function waitForStablePlacementGeometry(page: Page, placement: string) {
  let previous = await placementGeometry(page, placement);
  let stableSamples = 0;

  for (let attempt = 0; attempt < 30; attempt += 1) {
    await page.waitForTimeout(100);
    const current = await placementGeometry(page, placement);
    const stable =
      Math.abs(current.pageY - previous.pageY) <= 0.5 &&
      Math.abs(current.height - previous.height) <= 0.5 &&
      Math.abs(current.width - previous.width) <= 0.5;
    if (stable) {
      stableSamples += 1;
      if (stableSamples >= 5) return current;
    } else {
      stableSamples = 0;
    }
    previous = current;
  }

  return previous;
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
    const mobileBanner = kind === "banner" && window.innerWidth < 768;
    const width = mobileBanner
      ? document.documentElement.clientWidth
      : kind === "vertical"
        ? 120
        : kind === "square"
          ? 300
          : 728;
    const height = mobileBanner
      ? 100
      : kind === "vertical"
        ? 600
        : kind === "square"
          ? 250
          : 90;
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
    const stage = element.querySelector<HTMLElement>(".mw-signal-stage");
    const insStyle = ins ? getComputedStyle(ins) : null;
    const stageStyle = stage ? getComputedStyle(stage) : null;
    return {
      maxHeight: style.maxHeight,
      overflow: style.overflow,
      insMaxHeight: insStyle?.maxHeight ?? "",
      insOverflow: insStyle?.overflow ?? "",
      stageMaxHeight: stageStyle?.maxHeight ?? "",
      stageOverflow: stageStyle?.overflow ?? "",
    };
  });
  expect(metrics.maxHeight).toBe("none");
  expect(metrics.overflow).toBe("visible");
  expect(metrics.insMaxHeight).toBe("none");
  expect(metrics.insOverflow).toBe("visible");
  expect(metrics.stageMaxHeight).toBe("none");
  expect(metrics.stageOverflow).toBe("visible");
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
    fullWidthResponsive: "",
  },
  {
    route: "/",
    width: 1536,
    placement: "left-sidebar",
    slot: SLOTS.leftSidebar,
    format: "auto",
    fullWidthResponsive: "true",
  },
  {
    route: "/",
    width: 1536,
    placement: "right-sidebar",
    slot: SLOTS.rightSidebar,
    format: "auto",
    fullWidthResponsive: "true",
  },
  {
    route: "/",
    width: 1280,
    placement: "post-hero",
    slot: SLOTS.postHeroBanner,
    format: "auto",
    fullWidthResponsive: "true",
  },
  {
    route: "/",
    width: 1280,
    placement: "optional-square",
    slot: SLOTS.optionalSquare,
    format: "auto",
    fullWidthResponsive: "true",
  },
  {
    route: "/",
    width: 1280,
    placement: "toolkit-banner",
    slot: SLOTS.toolkitBanner,
    format: "auto",
    fullWidthResponsive: "true",
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
    expect((await ins.getAttribute("data-full-width-responsive")) ?? "").toBe(
      attributeCase.fullWidthResponsive,
    );
    await expect(ins).toHaveCSS("display", "block");
    await expect(ins).toHaveCSS("overflow", "visible");
    await expectAdContentCentered(page, attributeCase.placement);
    await setAdStatus(page, attributeCase.placement, "filled");
    await expectFilledChromeHidden(page, attributeCase.placement);
    await expectAdContentCentered(page, attributeCase.placement);
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
    expect(ad.format, `${spec.route}: ${ad.placement} keeps its ad preset`).toBe(
      expectedFormatForPlacement(ad.placement, ad.kind, width),
    );
    expect(
      ad.fullWidthResponsive,
      `${spec.route}: ${ad.placement} keeps its full-width-responsive preset`,
    ).toBe(expectedFullWidthResponsiveForPlacement(ad.placement));
    await expect(adPlacement(page, ad.placement)).toHaveAttribute(
      "data-mw-ad-request-eligible",
      "true",
    );
    await expectAdContentCentered(page, ad.placement);
    if (!ad.placement.includes("sidebar")) {
      await expectPlacementWidthWithinViewport(page, ad.placement);
      if (ad.kind === "banner") {
        if (width < 768) {
          expect(
            ad.height,
            `${spec.route}: ${ad.placement} should reserve its mobile fallback without constraining the creative`,
          ).toBeGreaterThanOrEqual(100);
        } else {
          expect(
            ad.height,
            `${spec.route}: ${ad.placement} should stay banner-shaped`,
          ).toBeLessThanOrEqual(110);
        }
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

test("the second banner follows primary page content without changing protected ad order", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1536, height: 1200 });

  for (const [route, primarySelector, label] of primaryOrderCases) {
    await gotoRouteForLayoutCheck(page, route);
    const order = await page.evaluate(({ primarySelector }) => {
      const primary = document.querySelector(primarySelector);
      const secondBanner = document.querySelector(
        '[data-mw-ad-placement="post-hero"], [data-mw-ad-placement="post-primary-content"]',
      );
      const topBanner = document.querySelector('[data-mw-ad-placement="top-banner"]');
      return {
        primaryBeforeSecond: Boolean(
          primary &&
            secondBanner &&
            (primary.compareDocumentPosition(secondBanner) & Node.DOCUMENT_POSITION_FOLLOWING),
        ),
        topBeforePrimary: Boolean(
          topBanner &&
            primary &&
            (topBanner.compareDocumentPosition(primary) & Node.DOCUMENT_POSITION_FOLLOWING),
        ),
      };
    }, { primarySelector });

    expect(order.primaryBeforeSecond, `${route}: ${label} precedes the second banner`).toBe(true);
    expect(order.topBeforePrimary, `${route}: top banner remains before page content`).toBe(true);
    await expect(page.locator(".mw-side-rail")).toHaveCount(2);
    await expectNoHorizontalOverflow(page);
  }
});

test("the skills test banner follows its panel without an artificial gap", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1200 });
  await gotoRouteForLayoutCheck(page, "/morse-code-test");
  const gap = await page.evaluate(() => {
    const assessment = document.querySelector('[data-testid="morse-code-assessment"]');
    const banner = document.querySelector('[data-mw-ad-placement="post-primary-content"]');
    if (!assessment || !banner) return Number.POSITIVE_INFINITY;
    return banner.getBoundingClientRect().top - assessment.getBoundingClientRect().bottom;
  });
  expect(gap).toBeLessThanOrEqual(64);
});

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

test("desktop sidebars request at wide width and remove fallback chrome globally when filled", async ({
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
  }

  await simulateFilledCreative(page, "left-sidebar");
  for (const placement of ["left-sidebar", "right-sidebar"]) {
    const shell = adPlacement(page, placement);
    await expect(shell).toHaveCount(1);
    await expect(shell).toHaveCSS("opacity", "1");
    await expect(shell.locator(placementLabelSelector)).toBeHidden();
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

test("a live creative hides every fallback frame before it can overlap an ad", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1536, height: 1100 });
  await gotoRouteForLayoutCheck(page, "/");

  await simulateFilledCreative(page, "top-banner");
  for (const placement of [
    "left-sidebar",
    "right-sidebar",
    "optional-square",
    "toolkit-banner",
  ]) {
    const shell = adPlacement(page, placement);
    await expect(shell).toHaveAttribute("data-mw-ad-any-rendered", "true");
    await expect(shell.locator(placementLabelSelector)).toBeHidden();
  }
});

test("a visible creative frame suppresses fallbacks before AdSense writes its final status", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1100 });
  await gotoRouteForLayoutCheck(page, "/");

  await adPlacement(page, "post-hero").locator("ins").evaluate((element) => {
    const frame = document.createElement("iframe");
    frame.title = "Simulated responsive creative";
    frame.style.display = "block";
    frame.style.width = "100%";
    frame.style.height = "120px";
    element.append(frame);
  });

  await page.waitForFunction(
    () => document.documentElement.dataset.mwAdsenseRendered === "true",
  );

  for (const placement of ["post-hero", "optional-square", "toolkit-banner"]) {
    const shell = adPlacement(page, placement);
    await expect(shell.locator(placementLabelSelector)).toBeHidden();
    await expect(shell).toHaveAttribute("data-mw-ad-placeholder-visible", "false");
  }
  await expectNoHorizontalOverflow(page);
});

for (const width of [390, 430] as const) {
  test(`mobile ad requests have measurable centered containers at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1100 });
    await gotoRouteForLayoutCheck(page, "/");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1_000);

    for (const placement of ["post-hero", "optional-square", "toolkit-banner"]) {
      const shell = adPlacement(page, placement);
      const ins = shell.locator("ins.adsbygoogle");
      await expect(shell).toHaveAttribute("data-mw-ad-request-eligible", "true");
      await expect(ins).toHaveAttribute("data-mw-adsense-pushed", "true");
      await expect(ins).toHaveAttribute(
        "data-ad-format",
        "auto",
      );
      await expect(ins).toHaveAttribute("data-full-width-responsive", "true");

      const metrics = await ins.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          display: style.display,
          visibility: style.visibility,
          width: Math.round(rect.width),
        };
      });
      expect(metrics.display).toBe("block");
      expect(metrics.visibility).toBe("visible");
      expect(metrics.width).toBeGreaterThan(0);
      expect(metrics.width).toBeLessThanOrEqual(width);
      await expectAdContentCentered(page, placement);
    }

    await expectNoHorizontalOverflow(page);
  });

  test(`mobile fallback and filled creative keep stable geometry at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1100 });
    await gotoRouteForLayoutCheck(page, "/");

    for (const placement of ["post-hero", "optional-square", "toolkit-banner"]) {
      await expect(adPlacement(page, placement).locator("ins.adsbygoogle")).toHaveAttribute(
        "data-mw-adsense-pushed",
        "true",
      );
      const before = await waitForStablePlacementGeometry(page, placement);
      await simulateFilledCreative(page, placement);
      const after = await placementGeometry(page, placement);
      const geometry = {
        after,
        before,
        placement,
      };

      expect(
        Math.abs(after.pageY - before.pageY),
        `${placement} should keep its vertical position when filled: ${JSON.stringify(geometry)}`,
      ).toBeLessThanOrEqual(2);
      expect(
        Math.abs(after.height - before.height),
        `${placement} should keep its reserved height when filled: ${JSON.stringify(geometry)}`,
      ).toBeLessThanOrEqual(2);
      await expectAdContentCentered(page, placement);
    }

    await expectNoHorizontalOverflow(page);
  });
}

test("restored mobile pages re-request only non-filled measurable ad units", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1100 });
  await gotoRouteForLayoutCheck(page, "/");

  const postHero = adPlacement(page, "post-hero");
  const toolkit = adPlacement(page, "toolkit-banner");
  await expect(postHero).toHaveAttribute("data-mw-ad-request-revision", "0");
  await expect(postHero.locator("ins.adsbygoogle")).toHaveAttribute(
    "data-mw-adsense-pushed",
    "true",
  );

  await page.evaluate(() => {
    const pageHide = new Event("pagehide");
    Object.defineProperty(pageHide, "persisted", { value: true });
    window.dispatchEvent(pageHide);
    const pageShow = new Event("pageshow");
    Object.defineProperty(pageShow, "persisted", { value: true });
    window.dispatchEvent(pageShow);
  });

  await expect(postHero).toHaveAttribute("data-mw-ad-request-revision", "1");
  await expect(postHero.locator("ins.adsbygoogle")).toHaveAttribute(
    "data-mw-adsense-pushed",
    "true",
  );
  await expectPlaceholderVisible(page, "post-hero");

  await simulateFilledCreative(page, "toolkit-banner");
  const filledRevision = await toolkit.getAttribute("data-mw-ad-request-revision");

  await page.evaluate(() => {
    const pageHide = new Event("pagehide");
    Object.defineProperty(pageHide, "persisted", { value: true });
    window.dispatchEvent(pageHide);
    const pageShow = new Event("pageshow");
    Object.defineProperty(pageShow, "persisted", { value: true });
    window.dispatchEvent(pageShow);
  });

  await expect(toolkit).toHaveAttribute(
    "data-mw-ad-request-revision",
    filledRevision ?? "1",
  );
  await expectFilledChromeHidden(page, "toolkit-banner");
  await expectNoHorizontalOverflow(page);
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
