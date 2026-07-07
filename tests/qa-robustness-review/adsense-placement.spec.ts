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
} as const;

const PLACEMENT_LABEL_SELECTOR = ".mw-placement-label";

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

function adPlacement(page: Page, placement: string) {
  return page.locator(`[data-mw-ad-placement="${placement}"]`);
}

async function setAdStatus(
  page: Page,
  placement: string,
  status: "filled" | "unfilled",
) {
  const shell = adPlacement(page, placement);
  await shell.locator("ins").evaluate((element, nextStatus) => {
    element.setAttribute("data-ad-status", nextStatus);
  }, status);
  await expect(shell).toHaveAttribute("data-mw-ad-status", status);
}

async function expectPlaceholderVisible(page: Page, placement: string) {
  const shell = adPlacement(page, placement);
  const label = shell.locator(PLACEMENT_LABEL_SELECTOR);
  await expect(label).toBeVisible();
  await expect(label).toHaveText("Advertisements");
  await expect(shell).toHaveCSS("border-top-style", "dashed");
  const labelOutsideIns = await shell.evaluate((element, selector) => {
    const labelElement = element.querySelector(selector);
    const insElement = element.querySelector("ins.adsbygoogle");
    return Boolean(labelElement && insElement && !insElement.contains(labelElement));
  }, PLACEMENT_LABEL_SELECTOR);
  expect(labelOutsideIns).toBe(true);
}

async function expectFilledChromeHidden(page: Page, placement: string) {
  const shell = adPlacement(page, placement);
  await expect(shell.locator(PLACEMENT_LABEL_SELECTOR)).toBeHidden();
  await expect(shell).not.toHaveCSS("border-top-style", "dashed");
  await expect(shell).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
}

test.beforeEach(async ({ page }) => {
  await blockAdNetwork(page);
});

test("loads one AdSense script and the expected eligible homepage slots", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await gotoRoute(page, "/");

  const script = page.locator("script[data-mw-adsense-script]");
  await expect(script).toHaveCount(1);
  await expect(script).toHaveAttribute("src", new RegExp(ADSENSE_CLIENT_ID));

  await expect(
    page.locator(
      `[data-mw-ad-request-eligible="true"] ins[data-ad-client="${ADSENSE_CLIENT_ID}"]`,
    ),
  ).toHaveCount(3);
  await expect(page.locator(`ins[data-ad-slot="${SLOTS.topBanner}"]`)).toHaveCount(1);
  await expect(page.locator(`ins[data-ad-slot="${SLOTS.postHeroBanner}"]`)).toHaveCount(1);
  await expect(page.locator(`ins[data-ad-slot="${SLOTS.toolkitBanner}"]`)).toHaveCount(1);
  await expect(page.locator(`ins[data-ad-slot="${SLOTS.leftSidebar}"]`)).toHaveCount(1);
  await expect(page.locator(`ins[data-ad-slot="${SLOTS.rightSidebar}"]`)).toHaveCount(1);
  await expect(page.locator('[data-mw-ad-placement="left-sidebar"]')).toBeHidden();
  await expect(page.locator('[data-mw-ad-placement="right-sidebar"]')).toBeHidden();
});

for (const width of [390, 430, 767]) {
  test(`top banner renders no visible box or space at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await gotoRoute(page, "/");

    const topBanner = page.locator('[data-mw-ad-placement="top-banner"]');
    await expect(topBanner).toBeHidden();
    await expect(topBanner).toHaveAttribute("data-mw-ad-request-eligible", "false");
    expect(await topBanner.boundingBox()).toBeNull();
    for (const placement of ["post-hero", "toolkit-banner"]) {
      const inPageBanner = page.locator(`[data-mw-ad-placement="${placement}"]`);
      await expect(inPageBanner).toHaveAttribute(
        "data-mw-ad-request-eligible",
        "true",
      );
      expect(await inPageBanner.boundingBox()).not.toBeNull();
    }

    const navBox = await page.locator("header.mw-nav-shell").boundingBox();
    expect(navBox?.y ?? 0).toBeLessThanOrEqual(1);
  });
}

test("top banner becomes eligible at tablet width", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await gotoRoute(page, "/");

  const topBanner = page.locator('[data-mw-ad-placement="top-banner"]');
  await expect(topBanner).toBeVisible();
  const box = await topBanner.boundingBox();
  const navBox = await page.locator("header.mw-nav-shell").boundingBox();
  expect(box?.y ?? 0).toBeGreaterThanOrEqual((navBox?.height ?? 0) - 1);
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(90);
  expect(box?.height ?? 0).toBeLessThanOrEqual(100);
  await expect(topBanner).toHaveCSS("border-top-style", "dashed");
});

test("sidebar rails only display and request ads on wide desktop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await gotoRoute(page, "/");
  const leftHiddenSidebar = page.locator('[data-mw-ad-placement="left-sidebar"]');
  const rightHiddenSidebar = page.locator('[data-mw-ad-placement="right-sidebar"]');
  await expect(leftHiddenSidebar).toBeHidden();
  await expect(rightHiddenSidebar).toBeHidden();
  await expect(leftHiddenSidebar).toHaveAttribute(
    "data-mw-ad-request-eligible",
    "false",
  );
  await expect(rightHiddenSidebar).toHaveAttribute(
    "data-mw-ad-request-eligible",
    "false",
  );
  expect(await leftHiddenSidebar.boundingBox()).toBeNull();
  expect(await rightHiddenSidebar.boundingBox()).toBeNull();

  await page.setViewportSize({ width: 1536, height: 1000 });
  await gotoRoute(page, "/");

  const leftSidebar = page.locator('[data-mw-ad-placement="left-sidebar"]');
  const rightSidebar = page.locator('[data-mw-ad-placement="right-sidebar"]');
  await expect(leftSidebar).toBeVisible();
  await expect(rightSidebar).toBeVisible();
  await expect(leftSidebar).toHaveAttribute("data-mw-ad-has-placeholder", "true");
  await expect(rightSidebar).toHaveAttribute("data-mw-ad-has-placeholder", "true");
  await expect(
    page.locator(`[data-mw-ad-placement$="sidebar"] ${PLACEMENT_LABEL_SELECTOR}`),
  ).toHaveText(["Advertisements", "Advertisements"]);
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

  const sidebarLabelTransforms = await page.evaluate(() => {
    const labelStyle = (selector: string) => {
      const element = document.querySelector(selector);
      return element ? getComputedStyle(element).transform : "";
    };
    return {
      left: labelStyle(
        '[data-mw-ad-placement="left-sidebar"] .mw-placement-label',
      ),
      right: labelStyle(
        '[data-mw-ad-placement="right-sidebar"] .mw-placement-label',
      ),
    };
  });
  expect(sidebarLabelTransforms.left).not.toBe(sidebarLabelTransforms.right);
  expect(sidebarLabelTransforms.right).toBe("none");
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

test("filled ads hide placeholder chrome for banners, toolkit, SEO rail, and sidebars", async ({
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
  await setAdStatus(page, "seo-section-vertical", "filled");
  await expectFilledChromeHidden(page, "seo-section-vertical");
});

test("blocked ad shell still shows a visible MorseWords placeholder label", async ({
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
});

test("ad labels are policy-safe wherever placeholders are shown", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1536, height: 1000 });
  await gotoRoute(page, "/");

  const placeholderAds = page.locator('[data-mw-ad-has-placeholder="true"]');
  await expect(placeholderAds.first()).toBeVisible();
  const placeholderLabels = await page
    .locator('[data-mw-ad-has-placeholder="true"]')
    .evaluateAll((ads) =>
      ads.map((ad) => ({
        ariaLabel: ad.getAttribute("aria-label")?.trim() ?? "",
        text:
          ad.querySelector(".mw-placement-label")?.textContent?.trim() ?? "",
      })),
    );
  expect(placeholderLabels.length).toBeGreaterThan(0);
  for (const label of placeholderLabels) {
    expect(["Advertisements", "Sponsored Links"]).toContain(label.ariaLabel);
    expect(["Advertisements", "Sponsored Links"]).toContain(label.text);
  }

  const placeholderBorders = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("[data-mw-ad-placement]")]
      .filter((ad) => getComputedStyle(ad).display !== "none")
      .map((ad) => {
        const style = getComputedStyle(ad);
        return {
          color: style.borderTopColor,
          style: style.borderTopStyle,
          width: style.borderTopWidth,
        };
      }),
  );
  expect(placeholderBorders.length).toBeGreaterThan(0);
  expect(new Set(placeholderBorders.map((border) => border.style))).toEqual(
    new Set(["dashed"]),
  );
  expect(new Set(placeholderBorders.map((border) => border.width))).toEqual(
    new Set(["2px"]),
  );
  expect(new Set(placeholderBorders.map((border) => border.color)).size).toBe(1);

  await expect(
    page.locator(`[data-mw-ad-placement$="sidebar"] ${PLACEMENT_LABEL_SELECTOR}`),
  ).toHaveText(["Advertisements", "Advertisements"]);
});

test("SEO-section vertical rail uses the in-content slot on suitable guide pages", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1536, height: 1200 });
  await gotoRoute(page, "/morse-code-alphabet");

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

  await page.setViewportSize({ width: 1024, height: 1000 });
  await gotoRoute(page, "/morse-code-alphabet");
  const hiddenRail = adPlacement(page, "seo-section-vertical");
  await expect(hiddenRail).toBeHidden();
  await expect(hiddenRail).toHaveAttribute("data-mw-ad-request-eligible", "false");
  expect(await hiddenRail.boundingBox()).toBeNull();

  await page.setViewportSize({ width: 1536, height: 1000 });
  for (const route of ["/contact", "/privacy", "/terms", "/cookies"]) {
    await gotoRoute(page, route);
    await expect(adPlacement(page, "seo-section-vertical")).toHaveCount(0);
  }
});

test("reference pages do not force early post-hero banners above side rails", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1536, height: 1000 });
  await gotoRoute(page, "/morse-code-alphabet");

  await expect(page.locator('[data-mw-ad-placement="post-hero"]')).toHaveCount(0);

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
  test(`book runtime route ${route} uses player-gap banner placement`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1536, height: 1000 });
    await gotoRoute(page, route);

    await expect(page.locator('[data-mw-ad-placement="top-banner"]')).toHaveCount(0);
    const playerAd = page.locator('[data-mw-ad-placement="book-player-banner"]');
    await expect(playerAd).toBeVisible();
    await expect(playerAd).toHaveAttribute("data-mw-ad-request-eligible", "true");

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
  });
}

test("printable chart uses a square ad in the settings flow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1536, height: 1000 });
  await gotoRoute(page, "/morse-code-printable-chart");

  await expect(page.locator('[data-mw-ad-placement="post-hero"]')).toHaveCount(0);
  await expect(page.locator('[data-mw-ad-placement="seo-section-vertical"]')).toHaveCount(0);
  const squareAd = page.locator('[data-mw-ad-placement="printable-chart-square"]');
  await expect(squareAd).toBeVisible();
  await expect(squareAd.locator("ins")).toHaveAttribute(
    "data-ad-slot",
    SLOTS.optionalSquare,
  );

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

test("ads stay outside forms, players, and action-control clusters", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 1000 });

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
  }
});

test("representative routes avoid horizontal overflow with ad gates", async ({
  page,
}) => {
  for (const width of [390, 768, 1536]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/",
      "/audio",
      "/dictionary",
      "/morse-code-books/the-gold-bug",
      "/morse-code-alphabet",
      "/contact",
    ]) {
      await gotoRoute(page, route);
      await expectNoHorizontalOverflow(page);
    }
  }
});
