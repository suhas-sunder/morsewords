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

const PLACEMENT_LABEL_SELECTOR = ".mw-signal-caption";
const FALLBACK_CLASS_BLOCKLIST = /(ad|ads|adsense|advert|sponsor|placeholder)/i;

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

async function expectNoHorizontalOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
}

async function gotoRouteForLayoutCheck(page: Page, route: string) {
  try {
    await gotoRoute(page, route);
  } catch (error) {
    await expect(
      page.locator("main h1, h1").first(),
      `${route} should be visibly rendered even if local navigation bookkeeping is slow`,
    ).toBeVisible({ timeout: 5_000 });
    if (route !== "/") {
      expect(page.url()).toContain(route);
    }
  }
}

function adPlacement(page: Page, placement: string) {
  return page.locator(`[data-mw-ad-placement="${placement}"]`);
}

function seoSectionAd(page: Page) {
  return page.locator(
    '[data-mw-ad-placement="seo-section-inline"], [data-mw-ad-placement="seo-section-vertical"]',
  );
}

async function setAdStatus(
  page: Page,
  placement: string,
  status: "filled" | "unfilled",
) {
  const shell = adPlacement(page, placement);
  await expect(shell).toHaveCount(1);
  await expect(shell.locator("ins")).toHaveCount(1);
  await shell.locator("ins").evaluate((element, nextStatus) => {
    element.setAttribute("data-ad-status", nextStatus);
  }, status);
  await expect(shell).toHaveAttribute("data-mw-ad-status", status);
}

async function expectPlaceholderVisible(page: Page, placement: string) {
  const shell = adPlacement(page, placement);
  const label = shell.locator(PLACEMENT_LABEL_SELECTOR);
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
  }, PLACEMENT_LABEL_SELECTOR);
  expect(labelOutsideIns).toBe(true);
  const classNames = await shell.evaluate((element, selector) => {
    const labelElement = element.querySelector<HTMLElement>(selector);
    return {
      label: labelElement?.className ?? "",
      shell: element.className,
    };
  }, PLACEMENT_LABEL_SELECTOR);
  expect(classNames.shell).not.toMatch(FALLBACK_CLASS_BLOCKLIST);
  expect(classNames.label).not.toMatch(FALLBACK_CLASS_BLOCKLIST);
}

async function expectFilledChromeHidden(page: Page, placement: string) {
  const shell = adPlacement(page, placement);
  await expect(shell).toHaveAttribute("data-mw-ad-status", "filled");
  await expect(shell).toHaveAttribute("data-mw-ad-placeholder-visible", "false");
  await expect(shell.locator(PLACEMENT_LABEL_SELECTOR)).toBeHidden();
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

async function expectPlacementWidthWithinViewport(page: Page, placement: string) {
  const box = await adPlacement(page, placement).boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(box!.width).toBeLessThanOrEqual((viewport?.width ?? 0) + 1);
  expect(box!.x).toBeGreaterThanOrEqual(-1);
  expect(box!.x + box!.width).toBeLessThanOrEqual((viewport?.width ?? 0) + 1);
}

async function expectPlacementCentered(page: Page, placement: string) {
  const centered = await adPlacement(page, placement).evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const parentRect = element.parentElement?.getBoundingClientRect();
    const containerRect = parentRect && parentRect.width < window.innerWidth - 2
      ? parentRect
      : { x: 0, width: document.documentElement.clientWidth };
    const adCenter = rect.x + rect.width / 2;
    const containerCenter = containerRect.x + containerRect.width / 2;
    return Math.abs(adCenter - containerCenter);
  });
  expect(centered).toBeLessThanOrEqual(2);
}

test.beforeEach(async ({ page }) => {
  await blockAdNetwork(page);
});

test("loads one AdSense script and the expected eligible homepage slots", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await gotoRoute(page, "/");

  const script = page.locator("script#mw-adsense-script");
  await expect(script).toHaveCount(1);
  await expect(script).toHaveAttribute("src", new RegExp(ADSENSE_CLIENT_ID));

  await expect(
    page.locator(
      `[data-mw-ad-request-eligible="true"] ins[data-ad-client="${ADSENSE_CLIENT_ID}"]`,
    ),
  ).toHaveCount(4);
  await expect(page.locator(`ins[data-ad-slot="${SLOTS.topBanner}"]`)).toHaveCount(1);
  await expect(page.locator(`ins[data-ad-slot="${SLOTS.postHeroBanner}"]`)).toHaveCount(1);
  await expect(page.locator(`ins[data-ad-slot="${SLOTS.inContent}"]`)).toHaveCount(1);
  await expect(page.locator(`ins[data-ad-slot="${SLOTS.toolkitBanner}"]`)).toHaveCount(1);
  await expect(page.locator(`ins[data-ad-slot="${SLOTS.leftSidebar}"]`)).toHaveCount(0);
  await expect(page.locator(`ins[data-ad-slot="${SLOTS.rightSidebar}"]`)).toHaveCount(0);
});

for (const width of [390, 430, 767]) {
  test(`mobile-width keeps only the top banner gated at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await gotoRoute(page, "/");

    await expect(adPlacement(page, "top-banner")).toHaveCount(0);
    for (const placement of ["post-hero", "seo-section-inline", "toolkit-banner"]) {
      await expect(adPlacement(page, placement)).toBeVisible();
      await expectPlacementWidthWithinViewport(page, placement);
      await expectPlacementCentered(page, placement);
      await expectPlaceholderVisible(page, placement);
    }

    const navBox = await page.locator("header.mw-nav-shell").boundingBox();
    expect(navBox?.y ?? 0).toBeLessThanOrEqual(1);
    await expectNoHorizontalOverflow(page);
  });
}

for (const route of [
  "/dictionary",
  "/morse-code-alphabet",
  "/morse-code-chart",
  "/morse-code-printable-chart",
  "/morse-code-reader",
  "/morse-code-mp3-generator",
  "/learn-morse-code",
  "/morse-code-books",
]) {
  test(`mobile upper-content ad covers PageHero template on ${route}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 1000 });
    await gotoRoute(page, route);

    await expect(adPlacement(page, "top-banner")).toHaveCount(0);
    const upper = adPlacement(page, "upper-content-mobile");
    await expect(upper).toBeVisible();
    await expect(upper.locator("ins")).toHaveAttribute(
      "data-ad-slot",
      SLOTS.postHeroBanner,
    );
    await expectPlacementWidthWithinViewport(page, "upper-content-mobile");
    await expectPlacementCentered(page, "upper-content-mobile");
    await expectPlaceholderVisible(page, "upper-content-mobile");
    await expectNoHorizontalOverflow(page);
  });
}

for (const route of [
  "/morse-code-decoder",
  "/morse-code-encoder",
  "/morse-code-word-separator",
]) {
  test(`mobile upper-content ad covers dense tool template on ${route}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 1000 });
    await gotoRoute(page, route);

    await expect(adPlacement(page, "top-banner")).toHaveCount(0);
    const upper = adPlacement(page, "upper-content");
    await expect(upper).toBeVisible();
    await expect(upper.locator("ins")).toHaveAttribute(
      "data-ad-slot",
      SLOTS.postHeroBanner,
    );
    await expectPlacementWidthWithinViewport(page, "upper-content");
    await expectPlacementCentered(page, "upper-content");
    await expectPlaceholderVisible(page, "upper-content");
    await expectNoHorizontalOverflow(page);
  });
}

test("top and content banners become eligible at tablet width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await gotoRoute(page, "/");

  for (const placement of ["top-banner", "post-hero", "toolkit-banner"]) {
    const banner = adPlacement(page, placement);
    await expect(banner).toBeVisible();
    await expect(banner).toHaveAttribute("data-mw-ad-request-eligible", "true");
    await expectPlacementWidthWithinViewport(page, placement);
    await expectPlacementCentered(page, placement);
    await expectPlaceholderVisible(page, placement);
  }

  const topBox = await adPlacement(page, "top-banner").boundingBox();
  const navBox = await page.locator("header.mw-nav-shell").boundingBox();
  expect(topBox?.y ?? 0).toBeGreaterThanOrEqual((navBox?.height ?? 0) - 1);
  expect(topBox?.height ?? 0).toBeGreaterThanOrEqual(90);
  expect(topBox?.height ?? 0).toBeLessThanOrEqual(100);
});

test("sidebar rails request only on wide desktop and hide empty towers", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await gotoRoute(page, "/");
  await expect(adPlacement(page, "left-sidebar")).toHaveCount(0);
  await expect(adPlacement(page, "right-sidebar")).toHaveCount(0);

  await page.setViewportSize({ width: 1536, height: 1000 });
  await gotoRoute(page, "/");

  const leftSidebar = adPlacement(page, "left-sidebar");
  const rightSidebar = adPlacement(page, "right-sidebar");
  await expect(leftSidebar).toHaveCount(1);
  await expect(rightSidebar).toHaveCount(1);
  await expect(leftSidebar).toHaveAttribute("data-mw-ad-request-eligible", "true");
  await expect(rightSidebar).toHaveAttribute("data-mw-ad-request-eligible", "true");
  await expect(leftSidebar).toHaveAttribute("data-mw-ad-has-placeholder", "false");
  await expect(rightSidebar).toHaveAttribute("data-mw-ad-has-placeholder", "false");
  await expect(
    page.locator(`[data-mw-ad-placement$="sidebar"] ${PLACEMENT_LABEL_SELECTOR}`),
  ).toHaveCount(0);
  await expect(leftSidebar).toHaveCSS("opacity", "0");
  await expect(rightSidebar).toHaveCSS("opacity", "0");

  const sidebarGeometry = await page.evaluate(() => {
    const left = document
      .querySelector('[data-mw-ad-placement="left-sidebar"]')
      ?.getBoundingClientRect();
    const right = document
      .querySelector('[data-mw-ad-placement="right-sidebar"]')
      ?.getBoundingClientRect();
    const topBanner = document
      .querySelector('[data-mw-ad-placement="top-banner"]')
      ?.getBoundingClientRect();
    const heading = document.querySelector("h1")?.getBoundingClientRect();
    return {
      clientWidth: document.documentElement.clientWidth,
      leftX: left?.x ?? null,
      leftY: left?.y ?? null,
      rightEdge: right ? right.x + right.width : null,
      rightY: right?.y ?? null,
      topBannerBottom: topBanner ? topBanner.y + topBanner.height : null,
      headingY: heading?.y ?? null,
    };
  });
  expect(sidebarGeometry.leftX ?? 999).toBeLessThanOrEqual(32);
  expect(sidebarGeometry.clientWidth - (sidebarGeometry.rightEdge ?? 0)).toBeLessThanOrEqual(48);
  expect(sidebarGeometry.leftY ?? 0).toBeGreaterThanOrEqual(
    (sidebarGeometry.topBannerBottom ?? 0) + 16,
  );
  expect(sidebarGeometry.rightY).toBe(sidebarGeometry.leftY);
  expect(sidebarGeometry.leftY ?? 999).toBeLessThanOrEqual(
    sidebarGeometry.headingY ?? 999,
  );

  await setAdStatus(page, "left-sidebar", "filled");
  await setAdStatus(page, "right-sidebar", "filled");
  await expect(leftSidebar).toHaveCSS("opacity", "1");
  await expect(rightSidebar).toHaveCSS("opacity", "1");
  await expectFilledChromeHidden(page, "left-sidebar");
  await expectFilledChromeHidden(page, "right-sidebar");
  await expectNoHorizontalOverflow(page);
});

test("script-blocked state keeps normal fallbacks visible and sidebars collapsed", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1536, height: 1000 });
  await gotoRoute(page, "/");

  for (const placement of ["top-banner", "post-hero", "toolkit-banner"]) {
    await expect(adPlacement(page, placement)).toHaveAttribute(
      "data-mw-ad-status",
      "pending",
    );
    await expectPlaceholderVisible(page, placement);
  }

  await expect(adPlacement(page, "left-sidebar")).toHaveCSS("opacity", "0");
  await expect(adPlacement(page, "right-sidebar")).toHaveCSS("opacity", "0");
  await expect(
    page.locator(`[data-mw-ad-placement$="sidebar"] ${PLACEMENT_LABEL_SELECTOR}`),
  ).toHaveCount(0);

  await gotoRoute(page, "/morse-code-alphabet");
  await expect(adPlacement(page, "seo-section-inline")).toHaveAttribute(
    "data-mw-ad-status",
    "pending",
  );
  await expectPlaceholderVisible(page, "seo-section-inline");

  await gotoRoute(page, "/morse-code-printable-chart");
  await expectPlaceholderVisible(page, "printable-chart-square");
  await expectNoHorizontalOverflow(page);
});

test("hidden ad elements keep normal fallbacks visible and sidebars collapsed", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1536, height: 1000 });
  await gotoRoute(page, "/");

  await page.addStyleTag({
    content: `
      ins.adsbygoogle,
      .mw-ad-shell,
      .mw-ad-post-hero,
      .mw-ad-in-content,
      .mw-ad-toolkit,
      .mw-ad-sidebar,
      .mw-placement-label {
        display: none !important;
        visibility: hidden !important;
      }
    `,
  });

  for (const placement of ["top-banner", "post-hero", "toolkit-banner"]) {
    await expect(adPlacement(page, placement).locator("ins")).toBeHidden();
    await expectPlaceholderVisible(page, placement);
  }

  await expect(adPlacement(page, "left-sidebar")).toHaveCSS("opacity", "0");
  await expect(adPlacement(page, "right-sidebar")).toHaveCSS("opacity", "0");
  await expect(
    page.locator(`[data-mw-ad-placement$="sidebar"] ${PLACEMENT_LABEL_SELECTOR}`),
  ).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});

test("removed ad elements keep normal fallbacks visible and sidebars collapsed", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1536, height: 1000 });
  await gotoRoute(page, "/");

  for (const placement of ["top-banner", "post-hero", "toolkit-banner"]) {
    await adPlacement(page, placement).locator("ins").evaluate((element) => {
      element.remove();
    });
    await expect(adPlacement(page, placement).locator("ins")).toHaveCount(0);
    await expectPlaceholderVisible(page, placement);
  }

  for (const placement of ["left-sidebar", "right-sidebar"]) {
    await adPlacement(page, placement).locator("ins").evaluate((element) => {
      element.remove();
    });
    await expect(adPlacement(page, placement).locator("ins")).toHaveCount(0);
    await expect(adPlacement(page, placement)).toHaveCSS("opacity", "0");
  }
  await expectNoHorizontalOverflow(page);
});

test("non-sidebar placeholders follow filled and unfilled AdSense states", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 1000 });
  await gotoRoute(page, "/");

  await expectPlaceholderVisible(page, "post-hero");
  await setAdStatus(page, "post-hero", "filled");
  await expectFilledChromeHidden(page, "post-hero");
  await setAdStatus(page, "post-hero", "unfilled");
  await expectPlaceholderVisible(page, "post-hero");
});

test("filled ads hide placeholder chrome for banners, toolkit, SEO ads, and sidebars", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1536, height: 1100 });
  await gotoRoute(page, "/");

  for (const placement of [
    "top-banner",
    "post-hero",
    "toolkit-banner",
    "left-sidebar",
    "right-sidebar",
  ]) {
    await setAdStatus(page, placement, "filled");
    await expectFilledChromeHidden(page, placement);
  }

  await gotoRoute(page, "/morse-code-alphabet");
  await setAdStatus(page, "seo-section-inline", "filled");
  await expectFilledChromeHidden(page, "seo-section-inline");

  await gotoRoute(page, "/morse-code-books/the-gold-bug");
  await setAdStatus(page, "seo-section-vertical", "filled");
  await expectFilledChromeHidden(page, "seo-section-vertical");
});

test("blocked or removed ad elements keep visible fallback labels outside ins", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 1000 });
  await gotoRoute(page, "/");

  await expectPlaceholderVisible(page, "post-hero");
  await adPlacement(page, "post-hero").locator("ins").evaluate((element) => {
    element.remove();
  });
  const label = adPlacement(page, "post-hero").locator(PLACEMENT_LABEL_SELECTOR);
  await expect(label).toBeVisible();
  await expect(label).toHaveText("Advertisements");
  const labelStillPresent = await adPlacement(page, "post-hero").evaluate(
    (element, selector) => Boolean(element.querySelector(selector)),
    PLACEMENT_LABEL_SELECTOR,
  );
  expect(labelStillPresent).toBe(true);
});

test("placeholder labels are policy-safe and use one shared dashed style", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1536, height: 1000 });
  await gotoRoute(page, "/");

  const visiblePlaceholderLabels = page.locator(
    '[data-mw-ad-placeholder-visible="true"] .mw-signal-caption',
  );
  await expect(visiblePlaceholderLabels.first()).toBeVisible();
  const placeholderLabels = await visiblePlaceholderLabels.evaluateAll((labels) =>
    labels.map((label) => {
      const style = getComputedStyle(label);
      return {
        borderColor: style.borderTopColor,
        borderStyle: style.borderTopStyle,
        borderWidth: style.borderTopWidth,
        text: label.textContent?.trim() ?? "",
      };
    }),
  );
  expect(placeholderLabels.length).toBeGreaterThan(0);
  for (const label of placeholderLabels) {
    expect(["Advertisements", "Sponsored Links"]).toContain(label.text);
    expect(label.borderStyle).toBe("dashed");
    expect(label.borderWidth).toBe("2px");
  }
  expect(new Set(placeholderLabels.map((label) => label.borderColor)).size).toBe(1);

  const shellBorders = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("[data-mw-ad-placement]")]
      .map((ad) => getComputedStyle(ad).borderTopStyle),
  );
  expect(new Set(shellBorders)).toEqual(new Set(["none"]));
  await expect(
    page.locator(`[data-mw-ad-placement$="sidebar"] ${PLACEMENT_LABEL_SELECTOR}`),
  ).toHaveCount(0);
});

for (const route of [
  "/",
  "/audio",
  "/morse-code-books",
  "/morse-code-audiobooks",
  "/morse-code-printable-chart",
  "/morse-code-chart",
  "/morse-code-alphabet",
  "/morse-code-numbers",
  "/morse-code-punctuation",
  "/morse-code-word-separator",
  "/how-to-separate-words-in-morse-code",
  "/morse-code-reader",
  "/morse-code-mp3-generator",
  "/morse-code-decoder",
  "/morse-code-encoder",
  "/morse-code-word-search-builder",
  "/learn-morse-code",
]) {
  test(`SEO-section inline ad uses the in-content slot on ${route}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1536, height: 1200 });
    await gotoRoute(page, route);

    await expect(adPlacement(page, "seo-section-vertical")).toHaveCount(0);
    const seoInline = adPlacement(page, "seo-section-inline");
    await expect(seoInline).toBeVisible();
    await expect(seoInline).toHaveAttribute("data-mw-ad-kind", "banner");
    await expect(seoInline).toHaveAttribute("data-mw-ad-request-eligible", "true");
    await expect(seoInline.locator("ins")).toHaveAttribute(
      "data-ad-slot",
      SLOTS.inContent,
    );
    await expectPlacementWidthWithinViewport(page, "seo-section-inline");
    await expectPlacementCentered(page, "seo-section-inline");
    await expectNoHorizontalOverflow(page);
  });
}

for (const route of [
  "/morse-code-books/the-gold-bug",
  "/morse-code-audiobooks/the-gold-bug",
]) {
  test(`long book summary keeps an intentional SEO rail on ${route}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1536, height: 1200 });
    await gotoRoute(page, route);

    await expect(adPlacement(page, "seo-section-inline")).toHaveCount(0);
    const seoRail = adPlacement(page, "seo-section-vertical");
    await expect(seoRail).toBeVisible();
    await expect(seoRail).toHaveAttribute("data-mw-ad-kind", "vertical");
    await expect(seoRail).toHaveAttribute("data-mw-ad-request-eligible", "true");
    await expect(seoRail.locator("ins")).toHaveAttribute(
      "data-ad-slot",
      SLOTS.inContent,
    );
    const railBox = await seoRail.boundingBox();
    expect(railBox?.width).toBe(120);
    expect(railBox?.height).toBe(600);
    await expectNoHorizontalOverflow(page);
  });
}

test("SEO-section ads are gated on excluded pages and use inline layout before wide rail is justified", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 1000 });
  await gotoRoute(page, "/morse-code-alphabet");
  await expect(adPlacement(page, "seo-section-inline")).toBeVisible();
  await expect(adPlacement(page, "seo-section-vertical")).toHaveCount(0);

  await page.setViewportSize({ width: 1536, height: 1000 });
  for (const route of [
    "/contact",
    "/privacy",
    "/terms",
    "/cookies",
  ]) {
    await gotoRoute(page, route);
    await expect(seoSectionAd(page)).toHaveCount(0);
  }
});

test("reference pages do not force early post-hero banners or jammed SEO rails above side rails", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1536, height: 1000 });
  await gotoRoute(page, "/morse-code-alphabet");

  await expect(adPlacement(page, "post-hero")).toHaveCount(0);
  await expect(adPlacement(page, "seo-section-vertical")).toHaveCount(0);
  await expect(adPlacement(page, "seo-section-inline")).toBeVisible();

  const placementMetrics = await page.evaluate(() => {
    const left = document
      .querySelector('[data-mw-ad-placement="left-sidebar"]')
      ?.getBoundingClientRect();
    const railBottom = left ? left.y + left.height : 0;
    return [...document.querySelectorAll<HTMLElement>("[data-mw-ad-placement]")]
      .filter((ad) => {
        const style = getComputedStyle(ad);
        return (
          style.display !== "none" &&
          ad.dataset.mwAdPlacement !== "top-banner" &&
          !ad.dataset.mwAdPlacement?.includes("sidebar")
        );
      })
      .map((ad) => ({
        placement: ad.dataset.mwAdPlacement,
        railBottom,
        y: ad.getBoundingClientRect().y,
      }));
  });
  expect(placementMetrics.length).toBeGreaterThan(0);
  for (const metric of placementMetrics) {
    expect(metric.y, `${metric.placement} should sit below side rails`).toBeGreaterThan(
      metric.railBottom,
    );
  }
});

for (const route of [
  "/morse-code-books/the-gold-bug",
  "/morse-code-audiobooks/the-gold-bug",
]) {
  test(`book runtime route ${route} uses responsive player-gap banner placement`, async ({
    page,
  }) => {
    for (const width of [390, 430]) {
      await page.setViewportSize({ width, height: 1000 });
      await gotoRoute(page, route);
      await expect(adPlacement(page, "book-player-banner")).toHaveCount(0);
      await expectNoHorizontalOverflow(page);
    }

    await page.setViewportSize({ width: 1536, height: 1000 });
    await gotoRoute(page, route);

    await expect(adPlacement(page, "top-banner")).toHaveCount(0);
    const playerAd = adPlacement(page, "book-player-banner");
    await expect(playerAd).toBeVisible();
    await expect(playerAd).toHaveAttribute("data-mw-ad-request-eligible", "true");
    await expect(playerAd.locator("ins")).toHaveAttribute(
      "data-ad-slot",
      SLOTS.postHeroBanner,
    );

    const placement = await page.evaluate(() => {
      const ad = document.querySelector<HTMLElement>(
        '[data-mw-ad-placement="book-player-banner"]',
      );
      const leftRail = document
        .querySelector('[data-mw-ad-placement="left-sidebar"]')
        ?.getBoundingClientRect();
      const before = ad?.previousElementSibling?.getBoundingClientRect();
      const after = ad?.nextElementSibling?.getBoundingClientRect();
      const adRect = ad?.getBoundingClientRect();
      return {
        afterGap:
          after && adRect ? Math.round(after.y - adRect.bottom) : null,
        beforeGap:
          before && adRect ? Math.round(adRect.y - before.bottom) : null,
        railBottom: leftRail ? Math.round(leftRail.y + leftRail.height) : null,
        y: adRect ? Math.round(adRect.y) : null,
      };
    });

    expect(placement.y ?? 0).toBeGreaterThan(placement.railBottom ?? 0);
    expect(Math.abs((placement.beforeGap ?? 0) - (placement.afterGap ?? 0))).toBeLessThanOrEqual(8);
    expect(placement.beforeGap ?? 0).toBeGreaterThanOrEqual(16);
    await expectNoHorizontalOverflow(page);
  });
}

test("printable chart uses a viewport-safe square ad in the settings flow", async ({
  page,
}) => {
  for (const width of [390, 1536]) {
    await page.setViewportSize({ width, height: 1000 });
    await gotoRoute(page, "/morse-code-printable-chart");

    await expect(adPlacement(page, "post-hero")).toHaveCount(0);
    if (width < 768) {
      await expect(adPlacement(page, "seo-section-inline")).toBeVisible();
      await expect(adPlacement(page, "seo-section-vertical")).toHaveCount(0);
    } else {
      await expect(adPlacement(page, "seo-section-inline")).toBeVisible();
      await expect(adPlacement(page, "seo-section-vertical")).toHaveCount(0);
    }
    const squareAd = adPlacement(page, "printable-chart-square");
    await expect(squareAd).toBeVisible();
    await expect(squareAd.locator("ins")).toHaveAttribute(
      "data-ad-slot",
      SLOTS.optionalSquare,
    );
    await expectPlaceholderVisible(page, "printable-chart-square");
    await expectPlacementWidthWithinViewport(page, "printable-chart-square");
    await expectPlacementCentered(page, "printable-chart-square");
    await expectNoHorizontalOverflow(page);
  }

  await page.setViewportSize({ width: 1536, height: 1000 });
  await gotoRoute(page, "/morse-code-printable-chart");
  await expect(adPlacement(page, "printable-chart-square")).toBeVisible();
  const placement = await page.evaluate(() => {
    const ad = document.querySelector<HTMLElement>(
      '[data-mw-ad-placement="printable-chart-square"]',
    );
    const leftRail = document
      .querySelector('[data-mw-ad-placement="left-sidebar"]')
      ?.getBoundingClientRect();
    const before = ad?.previousElementSibling?.getBoundingClientRect();
    const after = ad?.nextElementSibling?.getBoundingClientRect();
    const rect = ad?.getBoundingClientRect();
    return {
      afterGap: after && rect ? Math.round(after.y - rect.bottom) : null,
      beforeGap: before && rect ? Math.round(rect.y - before.bottom) : null,
      height: rect ? Math.round(rect.height) : null,
      railBottom: leftRail ? Math.round(leftRail.y + leftRail.height) : null,
      width: rect ? Math.round(rect.width) : null,
      y: rect ? Math.round(rect.y) : null,
    };
  });

  expect(placement.width).toBe(300);
  expect(placement.height).toBe(250);
  expect(placement.y ?? 0).toBeGreaterThan(placement.railBottom ?? 0);
  expect(Math.abs((placement.beforeGap ?? 0) - (placement.afterGap ?? 0))).toBeLessThanOrEqual(8);
});

test("optional long-page slots are limited to evaluated safe placements", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1536, height: 1000 });
  await gotoRoute(page, "/morse-code-printable-chart");
  await expect(adPlacement(page, "upper-content")).toBeVisible();
  await expectPlacementCentered(page, "upper-content");
  await expect(page.locator(`ins[data-ad-slot="${SLOTS.optionalSquare}"]`)).toHaveCount(1);
  await expect(page.locator(`ins[data-ad-slot="${SLOTS.optionalBanner}"]`)).toHaveCount(1);
  await expect(adPlacement(page, "optional-banner")).toBeVisible();
  await expectPlacementCentered(page, "optional-banner");
  await expect(page.locator(`ins[data-ad-slot="${SLOTS.optionalVertical}"]`)).toHaveCount(0);

  for (const route of ["/", "/morse-code-alphabet", "/morse-code-reader"]) {
    await gotoRoute(page, route);
    await expect(page.locator(`ins[data-ad-slot="${SLOTS.optionalSquare}"]`)).toHaveCount(0);
    await expect(page.locator(`ins[data-ad-slot="${SLOTS.optionalBanner}"]`)).toHaveCount(0);
    await expect(page.locator(`ins[data-ad-slot="${SLOTS.optionalVertical}"]`)).toHaveCount(0);
  }
});

for (const route of [
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  "/morse-code-books/the-gold-bug/print",
]) {
  test(`excluded route ${route} renders no ad slots`, async ({ page }) => {
    await page.setViewportSize({ width: 1536, height: 1000 });
    await gotoRoute(page, route);

    await expect(page.locator("[data-mw-ad-placement]")).toHaveCount(0);
    await expect(page.locator(`ins[data-ad-client="${ADSENSE_CLIENT_ID}"]`)).toHaveCount(0);
  });
}

for (const route of [
  "/",
  "/audio",
  "/dictionary",
  "/morse-code-books",
  "/morse-code-audiobooks",
  "/morse-code-books/the-gold-bug",
  "/morse-code-audiobooks/the-gold-bug",
  "/morse-code-reader",
]) {
  test(`ads stay outside forms, players, and action-control clusters on ${route}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 1000 });
    await gotoRoute(page, route);
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
  });
}

for (const width of [390, 430, 768, 1024, 1280, 1536]) {
  for (const route of [
    "/",
    "/audio",
    "/dictionary",
    "/morse-code-books",
    "/morse-code-audiobooks",
    "/morse-code-books/the-gold-bug",
    "/morse-code-audiobooks/the-gold-bug",
    "/morse-code-printable-chart",
    "/morse-code-alphabet",
    "/morse-code-reader",
    "/contact",
  ]) {
    test(`representative route ${route} avoids horizontal overflow with ad gates at ${width}px`, async ({
      page,
    }) => {
      test.setTimeout(90_000);
      await page.setViewportSize({ width, height: 1000 });
      await gotoRouteForLayoutCheck(page, route);
      await expectNoHorizontalOverflow(page);
    });
  }
}
