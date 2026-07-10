import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  redirect, // ⟵ add this
} from "react-router";

import type { Route } from "./+types/root";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-600.css";
import "@fontsource/space-grotesk/latin-700.css";
import "@fontsource/space-mono/latin-400.css";
import "@fontsource/space-mono/latin-700.css";
import "./app.css";
import { PHogProvider } from "./client/providers/PHogProvider";
import {
  AdSenseScriptLoader,
  PostPrimaryContentBannerAd,
  SidebarRailAds,
  TopBannerAd,
} from "./client/components/ads/AdSenseAds";
import Footer from "./client/components/navigation/Footer";
import NavBar from "./client/components/navigation/NavBar";
import RelatedTools from "./client/components/navigation/RelatedTools";
import PageBackdrop, {
  paperBackground,
} from "./client/components/shared/PageBackdrop";
import PageFlashOverlay from "./client/components/shared/PageFlashOverlay";
import {
  THEME_COOKIE_MAX_AGE,
  THEME_STORAGE_KEY,
  isThemeMode,
  type ThemeMode,
} from "./client/theme/themeStorage";
import { STORAGE_KEYS } from "./client/components/shared/storageRegistry";

/* ---------- Trailing slash helpers (one place, app-level) ---------- */
function needsStrip(pathname: string) {
  if (pathname === "/") return false;
  if (!/\/+$/.test(pathname)) return false;
  const last = pathname.split("/").filter(Boolean).pop() ?? "";
  const looksLikeFile = /\.[a-zA-Z0-9]+$/.test(last);
  return !looksLikeFile;
}
function strip(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

function readThemeCookie(cookieHeader: string | null): ThemeMode {
  if (!cookieHeader) return "light";

  const prefix = `${THEME_STORAGE_KEY}=`;
  const item = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  if (!item) return "light";

  try {
    const value = decodeURIComponent(item.slice(prefix.length));
    return isThemeMode(value) ? value : "light";
  } catch {
    return "light";
  }
}

/* ---------- Loader does the canonical 301 ---------- */
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const theme = readThemeCookie(request.headers.get("Cookie"));
  if (needsStrip(url.pathname)) {
    url.pathname = strip(url.pathname);
    return redirect(url.pathname + url.search, { status: 301 });
  }
  return { theme };
}

export const links: Route.LinksFunction = () => [];

const THEME_INIT_SCRIPT = `
(function () {
  var themeKey = ${JSON.stringify(THEME_STORAGE_KEY)};
  var showAmbientMorseKey = ${JSON.stringify(STORAGE_KEYS.showAmbientMorse)};
  var disableFlashEffectsKey = ${JSON.stringify(STORAGE_KEYS.disableFlashEffects)};
  var fullPageFlashKey = ${JSON.stringify(STORAGE_KEYS.fullPageFlash)};
  var cookieMaxAge = ${THEME_COOKIE_MAX_AGE};
  function isThemeMode(value) {
    return value === "dark" || value === "light";
  }
  function readCookie(name) {
    var prefix = name + "=";
    var parts = document.cookie ? document.cookie.split(";") : [];
    for (var index = 0; index < parts.length; index += 1) {
      var part = parts[index].trim();
      if (part.indexOf(prefix) === 0) {
        return decodeURIComponent(part.slice(prefix.length));
      }
    }
    return null;
  }
  function writeThemeCookie(theme) {
    try {
      document.cookie = themeKey + "=" + encodeURIComponent(theme) + "; Max-Age=" + cookieMaxAge + "; Path=/; SameSite=Lax";
    } catch (error) {}
  }

  var theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  var storedTheme = null;
  try {
    storedTheme = window.localStorage.getItem(themeKey);
  } catch (error) {}

  var cookieTheme = readCookie(themeKey);
  if (isThemeMode(storedTheme)) {
    theme = storedTheme;
  } else if (isThemeMode(cookieTheme)) {
    theme = cookieTheme;
  }
  document.documentElement.dataset.theme = theme;
  writeThemeCookie(theme);

  try {
    var showAmbientMorse = window.localStorage.getItem(showAmbientMorseKey);
    document.documentElement.dataset.ambientMorse = showAmbientMorse === "0" || showAmbientMorse === "false" ? "hidden" : "visible";
  } catch (error) {
    document.documentElement.dataset.ambientMorse = "visible";
  }

  try {
    var disableFlashEffects = window.localStorage.getItem(disableFlashEffectsKey);
    document.documentElement.dataset.flashEffects = disableFlashEffects === "1" || disableFlashEffects === "true" ? "disabled" : "enabled";
  } catch (error) {
    document.documentElement.dataset.flashEffects = "enabled";
  }

  try {
    var fullPageFlash = window.localStorage.getItem(fullPageFlashKey);
    document.documentElement.dataset.fullPageFlash = fullPageFlash === "1" || fullPageFlash === "true" ? "enabled" : "disabled";
  } catch (error) {
    document.documentElement.dataset.fullPageFlash = "disabled";
  }
})();
`;

export function Layout({ children }: { children: React.ReactNode }) {
  const rootData = useRouteLoaderData<typeof loader>("root");
  const initialTheme = rootData?.theme === "dark" ? "dark" : "light";

  return (
    <html lang="en" data-theme={initialTheme} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <AdSenseScriptLoader />
        <Meta />
        <Links />
      </head>
      <body>
        <PHogProvider>
          <NavBar initialTheme={initialTheme} />
          <PageFlashOverlay />
          <div
            className="relative min-h-screen overflow-hidden"
            style={paperBackground}
          >
            <PageBackdrop />
            <SidebarRailAds />
            <div className="mw-page-content relative z-10">
              <TopBannerAd />
              {children}
              <PostPrimaryContentBannerAd />
              <div data-nosnippet>
                <RelatedTools />
              </div>
            </div>
          </div>
          <ScrollRestoration />
          <Scripts />
        </PHogProvider>
        <div data-nosnippet>
          <Footer />
        </div>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
