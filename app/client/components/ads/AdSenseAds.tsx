import * as React from "react";
import { useLocation } from "react-router";

import { ROUTES } from "~/client/data/routes";

export const ADSENSE_CLIENT_ID = "ca-pub-4810616735714570";

export const ADSENSE_SLOTS = {
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

type AdKind = "banner" | "vertical" | "square";
type AdLabel = "Advertisements" | "Sponsored Links";
type AdStatus =
  | "pending"
  | "filled"
  | "unfilled"
  | "unfill-optimized"
  | "blocked";

type ViewportRule = {
  minWidth?: number;
  maxWidth?: number;
};

type ReservedSize = {
  width?: number | string;
  height: number | string;
};

type AdSlotProps = ViewportRule & {
  slot: string;
  placement: string;
  kind: AdKind;
  reservedSize: ReservedSize;
  allowExcludedPaths?: boolean;
  placeholder?: boolean;
  label?: AdLabel;
  className?: string;
  isPathEligible?: (pathname: string) => boolean;
};

const TABLET_MIN_WIDTH = 768;
const DESKTOP_MIN_WIDTH = 1280;
const SIDEBAR_MIN_WIDTH = 1536;

function canAccessDOM() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const TRUST_AND_UTILITY_EXCLUDED_PATHS = new Set<string>([
  ROUTES.about,
  ROUTES.contact,
  ROUTES.sitemap,
  ROUTES.sources,
  ROUTES.misc,
  ROUTES.miscCookies,
  ROUTES.miscPrivacy,
  ROUTES.miscSocials,
  ROUTES.miscTerms,
  ROUTES.privacy,
  ROUTES.terms,
  ROUTES.cookies,
]);

declare global {
  interface Window {
    __mwAdsenseScriptStatus?: "pending" | "loaded" | "blocked";
  }
}

const DENSE_POST_HERO_EXCLUDED_PATHS = new Set<string>([
  ROUTES.audioDecoder,
  ROUTES.audioPractice,
  ROUTES.audioQuiz,
  ROUTES.bookTranslator,
  ROUTES.decoder,
  ROUTES.dictionary,
  ROUTES.encoder,
  ROUTES.mp3Generator,
  ROUTES.morseAudiobooks,
  ROUTES.morseBooks,
  ROUTES.printableChart,
  ROUTES.printablePages,
  ROUTES.reader,
  ROUTES.soundGenerator,
  ROUTES.test,
  ROUTES.typing,
  ROUTES.videoGenerator,
  ROUTES.visualPractice,
  ROUTES.visualQuiz,
  ROUTES.wordSearchBuilder,
  ROUTES.wordTrainer,
]);

function normalizePathname(pathname: string) {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
}

function isMorseBookPrintPath(pathname: string) {
  return /^\/morse-code-books\/[^/]+\/print$/.test(pathname);
}

function isMorseBookRuntimePath(pathname: string) {
  return /^\/morse-code-(?:audio)?books\/[^/]+$/.test(pathname);
}

export function isAdsExcludedPath(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);
  return (
    TRUST_AND_UTILITY_EXCLUDED_PATHS.has(normalizedPathname) ||
    isMorseBookPrintPath(normalizedPathname)
  );
}

export function isPostHeroAdEligiblePath(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);
  return (
    !isAdsExcludedPath(normalizedPathname) &&
    !isMorseBookRuntimePath(normalizedPathname) &&
    !DENSE_POST_HERO_EXCLUDED_PATHS.has(normalizedPathname)
  );
}

export function isTopBannerAdEligiblePath(pathname: string) {
  return Boolean(pathname);
}

export function isBookPlayerAdEligiblePath(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);
  return (
    !isAdsExcludedPath(normalizedPathname) &&
    isMorseBookRuntimePath(normalizedPathname)
  );
}

export function isPrintableChartSquareAdEligiblePath(pathname: string) {
  return normalizePathname(pathname) === ROUTES.printableChart;
}

export function isOptionalSquareAdEligiblePath(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);
  return (
    normalizedPathname !== ROUTES.printableChart &&
    isInContentAdEligiblePath(normalizedPathname)
  );
}

export function isSidebarAdEligiblePath(pathname: string) {
  return Boolean(pathname);
}

export function isInContentAdEligiblePath(pathname: string) {
  return !isAdsExcludedPath(pathname);
}

export function isSeoSectionRailAdEligiblePath(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);
  return isInContentAdEligiblePath(normalizedPathname);
}

function isViewportEligible({ minWidth = 0, maxWidth }: ViewportRule) {
  if (!canAccessDOM()) return false;
  const width = window.innerWidth;
  return width >= minWidth && (maxWidth === undefined || width <= maxWidth);
}

function useViewportEligibility(rule: ViewportRule) {
  const [eligible, setEligible] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!canAccessDOM()) return;

    const update = () => {
      const nextEligible = isViewportEligible(rule);
      setEligible((current) =>
        current === nextEligible ? current : nextEligible,
      );
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [rule.maxWidth, rule.minWidth]);

  return eligible;
}

function cssSize(value: number | string | undefined) {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

function adFormatForKind(kind: AdKind) {
  // Keep responsive units in the shape their placement was designed to hold.
  if (kind === "banner") return "horizontal";
  if (kind === "vertical") return "vertical";
  return "rectangle";
}

function adViewportClassName(minWidth: number) {
  if (minWidth >= SIDEBAR_MIN_WIDTH) return "mw-signal-min-wide";
  if (minWidth >= DESKTOP_MIN_WIDTH) return "mw-signal-min-desktop";
  if (minWidth >= TABLET_MIN_WIDTH) return "mw-signal-min-tablet";
  return "mw-signal-min-any";
}

function readAdStatus(element: HTMLElement | null): AdStatus {
  if (!element || !element.isConnected) return "blocked";
  const status = element?.getAttribute("data-ad-status");
  if (status === "filled") return "filled";
  if (status === "unfilled") return "unfilled";
  if (status === "unfill-optimized") return "unfill-optimized";
  const style = getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden")
    return "blocked";
  if (window.__mwAdsenseScriptStatus === "blocked") return "blocked";
  return "pending";
}

function useAdStatus(
  ref: React.RefObject<HTMLElement | null>,
  shouldRender: boolean,
) {
  const [status, setStatus] = React.useState<AdStatus>("pending");

  React.useEffect(() => {
    if (!shouldRender) {
      setStatus("pending");
      return;
    }

    const element = ref.current;
    const syncStatus = () => {
      setStatus(readAdStatus(ref.current));
    };
    syncStatus();
    if (!element || typeof MutationObserver === "undefined") return;

    const observer = new MutationObserver(syncStatus);
    observer.observe(element, {
      attributes: true,
      attributeFilter: ["class", "data-ad-status", "hidden", "style"],
    });
    const parent = element.parentElement;
    if (parent) {
      observer.observe(parent, {
        childList: true,
      });
    }
    window.addEventListener("mw:adsense-script-status", syncStatus);
    return () => {
      observer.disconnect();
      window.removeEventListener("mw:adsense-script-status", syncStatus);
    };
  }, [ref, shouldRender]);

  return status;
}

function setAdSenseScriptStatus(status: "loaded" | "blocked") {
  if (!canAccessDOM()) return;
  window.__mwAdsenseScriptStatus = status;
  window.dispatchEvent(new CustomEvent("mw:adsense-script-status"));
}

function pushAdSenseRequest(element: HTMLElement) {
  if (element.dataset.mwAdsensePushed === "true") return;

  const adWindow = window as Window & {
    adsbygoogle?: Array<Record<string, never>>;
  };
  const queue = (adWindow.adsbygoogle = adWindow.adsbygoogle ?? []);
  try {
    queue.push({});
    element.dataset.mwAdsensePushed = "true";
  } catch {
    delete element.dataset.mwAdsensePushed;
    // AdSense can throw during rapid SPA transitions; retry on the next eligible render.
  }
}

export function AdSenseScriptLoader() {
  return (
    <script
      async
      crossOrigin="anonymous"
      id="mw-adsense-script"
      onError={() => setAdSenseScriptStatus("blocked")}
      onLoad={() => setAdSenseScriptStatus("loaded")}
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
    />
  );
}

export function AdSlot({
  slot,
  placement,
  kind,
  reservedSize,
  allowExcludedPaths = false,
  minWidth = TABLET_MIN_WIDTH,
  maxWidth,
  placeholder = true,
  label = "Advertisements",
  className = "",
  isPathEligible,
}: AdSlotProps) {
  const location = useLocation();
  const normalizedPathname = normalizePathname(location.pathname);
  const pathEligible =
    (allowExcludedPaths || !isAdsExcludedPath(normalizedPathname)) &&
    (isPathEligible ? isPathEligible(normalizedPathname) : true);
  const viewportEligible = useViewportEligibility({ minWidth, maxWidth });
  const shouldRequestAd = pathEligible && viewportEligible;
  const adRef = React.useRef<HTMLModElement | null>(null);
  const status = useAdStatus(adRef, shouldRequestAd);
  const isFilled = status === "filled";
  const placeholderVisible = placeholder && !isFilled;

  React.useEffect(() => {
    if (!shouldRequestAd || !adRef.current) return;
    pushAdSenseRequest(adRef.current);
  }, [shouldRequestAd, slot]);

  if (!pathEligible) return null;

  const customProperties = {
    "--mw-ad-reserved-width": cssSize(reservedSize.width),
    "--mw-ad-reserved-height": cssSize(reservedSize.height),
  } as React.CSSProperties;
  const placementTestId = `mw-ad-slot-${placement}`;

  function adFormatForSlot(slot: string) {
    if (slot === ADSENSE_SLOTS.topBanner) return "horizontal";
    return "auto";
  }

  function adStyleForSlot(slot: string): React.CSSProperties {
    if (slot === ADSENSE_SLOTS.topBanner) {
      return {
        display: "block",
        margin: "0 auto",
      };
    }

    return {
      display: "block",
      margin: "0 auto",
      width: "100%",
    };
  }

  function fullWidthResponsiveForSlot(slot: string) {
    if (slot === ADSENSE_SLOTS.topBanner) return undefined;
    return "true";
  }

  return (
    <aside
      aria-label={label}
      className={["mw-signal-slot", adViewportClassName(minWidth), className]
        .filter(Boolean)
        .join(" ")}
      data-mw-ad-filled={status === "filled" ? "true" : "false"}
      data-mw-ad-fallback="placeholder"
      data-mw-ad-has-placeholder={placeholder ? "true" : "false"}
      data-mw-ad-kind={kind}
      data-mw-ad-placement={placement}
      data-mw-ad-placeholder-visible={placeholderVisible ? "true" : "false"}
      data-mw-ad-request-eligible={shouldRequestAd ? "true" : "false"}
      data-mw-ad-slot={slot}
      data-mw-ad-status={status}
      data-mw-ad-viewport-eligible={viewportEligible ? "true" : "false"}
      data-nosnippet
      data-testid={placementTestId}
      style={customProperties}
    >
      {shouldRequestAd ? (
        <ins
          ref={adRef}
          className="adsbygoogle mw-signal-unit"
          style={adStyleForSlot(slot)}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-format={adFormatForSlot(slot)}
          data-ad-slot={slot}
          data-adtest={import.meta.env.DEV ? "on" : undefined}
          data-full-width-responsive={fullWidthResponsiveForSlot(slot)}
        />
      ) : null}
      {placeholder ? (
        <div
          aria-hidden="true"
          className="mw-signal-caption"
          data-mw-placement-label-hidden={placeholderVisible ? "false" : "true"}
          data-testid={`${placementTestId}-placeholder`}
          hidden={!placeholderVisible}
        >
          {label}
        </div>
      ) : null}
    </aside>
  );
}

export function TopBannerAd() {
  return (
    <AdSlot
      allowExcludedPaths
      className="mw-signal-top"
      isPathEligible={isTopBannerAdEligiblePath}
      kind="banner"
      placement="top-banner"
      reservedSize={{ width: 970, height: 90 }}
      slot={ADSENSE_SLOTS.topBanner}
    />
  );
}

export function PostHeroBannerAd({ className = "" }: { className?: string }) {
  return (
    <AdSlot
      className={["mw-signal-post", className].filter(Boolean).join(" ")}
      isPathEligible={isPostHeroAdEligiblePath}
      kind="banner"
      minWidth={0}
      placement="post-hero"
      reservedSize={{ width: 970, height: 90 }}
      slot={ADSENSE_SLOTS.postHeroBanner}
    />
  );
}

export function MobileUpperContentBannerAd({
  className = "",
}: {
  className?: string;
}) {
  return (
    <AdSlot
      className={["mw-signal-mobile-upper", className]
        .filter(Boolean)
        .join(" ")}
      isPathEligible={isInContentAdEligiblePath}
      kind="banner"
      maxWidth={TABLET_MIN_WIDTH - 1}
      minWidth={0}
      placement="upper-content-mobile"
      reservedSize={{ width: "100%", height: 100 }}
      slot={ADSENSE_SLOTS.postHeroBanner}
    />
  );
}

export function UpperContentBannerAd({
  className = "",
  minWidth = 0,
  maxWidth,
}: {
  className?: string;
  minWidth?: number;
  maxWidth?: number;
}) {
  return (
    <AdSlot
      className={["mw-signal-upper-content", className]
        .filter(Boolean)
        .join(" ")}
      isPathEligible={isInContentAdEligiblePath}
      kind="banner"
      maxWidth={maxWidth}
      minWidth={minWidth}
      placement="upper-content"
      reservedSize={{ width: 728, height: 90 }}
      slot={ADSENSE_SLOTS.postHeroBanner}
    />
  );
}

export function BookPlayerBannerAd() {
  return (
    <AdSlot
      className="mw-signal-runtime-gap"
      isPathEligible={isBookPlayerAdEligiblePath}
      kind="banner"
      minWidth={0}
      placement="book-player-banner"
      reservedSize={{ width: 728, height: 90 }}
      slot={ADSENSE_SLOTS.postHeroBanner}
    />
  );
}

export function SidebarRailAds() {
  return (
    <>
      <AdSlot
        allowExcludedPaths
        className="mw-side-rail mw-side-rail-left"
        isPathEligible={isSidebarAdEligiblePath}
        kind="vertical"
        minWidth={SIDEBAR_MIN_WIDTH}
        placement="left-sidebar"
        reservedSize={{ width: 120, height: 600 }}
        slot={ADSENSE_SLOTS.leftSidebar}
      />
      <AdSlot
        allowExcludedPaths
        className="mw-side-rail mw-side-rail-right"
        isPathEligible={isSidebarAdEligiblePath}
        kind="vertical"
        minWidth={SIDEBAR_MIN_WIDTH}
        placement="right-sidebar"
        reservedSize={{ width: 120, height: 600 }}
        slot={ADSENSE_SLOTS.rightSidebar}
      />
    </>
  );
}

export function InContentAd({ className = "" }: { className?: string }) {
  return (
    <AdSlot
      className={["mw-signal-inline", className].filter(Boolean).join(" ")}
      isPathEligible={isInContentAdEligiblePath}
      kind="banner"
      minWidth={0}
      placement="in-content"
      reservedSize={{ width: 728, height: 90 }}
      slot={ADSENSE_SLOTS.inContent}
    />
  );
}

export function SeoSectionRailAd({ className = "" }: { className?: string }) {
  return (
    <AdSlot
      className={["mw-signal-seo-rail", className].filter(Boolean).join(" ")}
      isPathEligible={isSeoSectionRailAdEligiblePath}
      kind="vertical"
      minWidth={DESKTOP_MIN_WIDTH}
      placement="seo-section-vertical"
      reservedSize={{ width: 120, height: 600 }}
      slot={ADSENSE_SLOTS.inContent}
    />
  );
}

export function SeoSectionContentAd({
  className = "",
  maxWidth,
}: {
  className?: string;
  maxWidth?: number;
}) {
  return (
    <AdSlot
      className={["mw-signal-seo-content", className].filter(Boolean).join(" ")}
      isPathEligible={isSeoSectionRailAdEligiblePath}
      kind="square"
      maxWidth={maxWidth}
      minWidth={0}
      placement="seo-section-content"
      reservedSize={{ width: 300, height: 250 }}
      slot={ADSENSE_SLOTS.inContent}
    />
  );
}

export function ToolkitBannerAd() {
  return (
    <AdSlot
      allowExcludedPaths
      className="mw-signal-toolkit"
      kind="banner"
      minWidth={0}
      placement="toolkit-banner"
      reservedSize={{ width: 728, height: 90 }}
      slot={ADSENSE_SLOTS.toolkitBanner}
    />
  );
}

export function PrintableChartSquareAd() {
  return (
    <AdSlot
      className="mw-signal-print-square"
      isPathEligible={isPrintableChartSquareAdEligiblePath}
      kind="square"
      minWidth={0}
      placement="printable-chart-square"
      reservedSize={{ width: 300, height: 250 }}
      slot={ADSENSE_SLOTS.optionalSquare}
    />
  );
}

export function OptionalSquareAd({ className = "" }: { className?: string }) {
  return (
    <AdSlot
      className={["mw-signal-optional-square", className]
        .filter(Boolean)
        .join(" ")}
      isPathEligible={isOptionalSquareAdEligiblePath}
      kind="square"
      minWidth={0}
      placement="optional-square"
      reservedSize={{ width: 300, height: 250 }}
      slot={ADSENSE_SLOTS.optionalSquare}
    />
  );
}

export function OptionalBannerAd({ className = "" }: { className?: string }) {
  return (
    <AdSlot
      className={["mw-signal-optional-banner", className]
        .filter(Boolean)
        .join(" ")}
      isPathEligible={isInContentAdEligiblePath}
      kind="banner"
      minWidth={0}
      placement="optional-banner"
      reservedSize={{ width: 728, height: 90 }}
      slot={ADSENSE_SLOTS.optionalBanner}
    />
  );
}

export function OptionalVerticalRailAd({
  className = "",
  maxWidth,
  minWidth = DESKTOP_MIN_WIDTH,
}: {
  className?: string;
  maxWidth?: number;
  minWidth?: number;
}) {
  return (
    <AdSlot
      className={["mw-signal-optional-vertical", className]
        .filter(Boolean)
        .join(" ")}
      isPathEligible={isInContentAdEligiblePath}
      kind="vertical"
      maxWidth={maxWidth}
      minWidth={minWidth}
      placement="optional-vertical"
      reservedSize={{ width: 120, height: 600 }}
      slot={ADSENSE_SLOTS.optionalVertical}
    />
  );
}

export function OptionalLongPageAd({
  className = "",
  kind = "banner",
}: {
  className?: string;
  kind?: AdKind;
}) {
  const slot =
    kind === "vertical"
      ? ADSENSE_SLOTS.optionalVertical
      : kind === "square"
        ? ADSENSE_SLOTS.optionalSquare
        : ADSENSE_SLOTS.optionalBanner;
  const reservedSize =
    kind === "vertical"
      ? { width: 120, height: 600 }
      : kind === "square"
        ? { width: 300, height: 250 }
        : { width: 728, height: 90 };

  return (
    <AdSlot
      className={["mw-signal-optional-long-page", className]
        .filter(Boolean)
        .join(" ")}
      isPathEligible={isInContentAdEligiblePath}
      kind={kind}
      minWidth={kind === "square" ? 0 : TABLET_MIN_WIDTH}
      placement={`optional-${kind}`}
      reservedSize={reservedSize}
      slot={slot}
    />
  );
}
