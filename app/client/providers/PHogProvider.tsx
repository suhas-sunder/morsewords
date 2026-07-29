import { useEffect } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router";

const POSTHOG_TOKEN = "phc_bM7udiE9SpQQnyERjIjmXBMGHaaesURgTEfdjLD0GBZ";
const POSTHOG_API_HOST = "https://us.i.posthog.com";
const LEGACY_POSTHOG_CONSENT_KEY = `__ph_opt_in_out_${POSTHOG_TOKEN}`;
const LEGACY_POSTHOG_PERSISTENCE_PREFIX = `ph_${POSTHOG_TOKEN}_posthog`;

type PostHogCaptureResult = {
  event: string;
  properties?: Record<string, unknown>;
  [key: string]: unknown;
};

type PostHogClient = {
  init: (
    token: string,
    options: {
      api_host: string;
      cookieless_mode: "always";
      persistence: "memory";
      disable_persistence: boolean;
      save_campaign_params: boolean;
      save_referrer: boolean;
      person_profiles: "never";
      capture_pageview: boolean;
      capture_pageleave: boolean;
      autocapture: boolean;
      rageclick: boolean;
      capture_dead_clicks: boolean;
      capture_exceptions: boolean;
      capture_heatmaps: boolean;
      capture_performance: boolean;
      disable_scroll_properties: boolean;
      disable_session_recording: boolean;
      enable_recording_console_log: boolean;
      disable_surveys: boolean;
      disable_surveys_automatic_display: boolean;
      disable_web_experiments: boolean;
      disable_external_dependency_loading: boolean;
      advanced_disable_flags: boolean;
      advanced_disable_feature_flags: boolean;
      request_batching: boolean;
      before_send: (
        event: PostHogCaptureResult | null,
      ) => PostHogCaptureResult | null;
    },
  ) => void;
  capture: (event: "$pageview", properties: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    posthog?: PostHogClient;
  }
}

const SAFE_PAGEVIEW_PROPERTY_KEYS = new Set([
  "$browser",
  "$browser_type",
  "$browser_version",
  "$config_defaults",
  "$cookieless_mode",
  "$current_url",
  "$device_type",
  "$host",
  "$is_identified",
  "$lib",
  "$lib_version",
  "$os",
  "$os_version",
  "$pageview_id",
  "$prev_pageview_duration",
  "$prev_pageview_id",
  "$prev_pageview_pathname",
  "$process_person_profile",
  "$screen_height",
  "$screen_width",
  "$timezone",
  "$timezone_offset",
  "$viewport_height",
  "$viewport_width",
  "distinct_id",
  "token",
]);

let posthogClientPromise: Promise<PostHogClient | null> | null = null;
let lastScheduledLocation: string | null = null;

function normalizePathname(value: unknown) {
  if (typeof value !== "string" || !value.startsWith("/")) return "/";

  try {
    return new URL(value, window.location.origin).pathname || "/";
  } catch {
    return "/";
  }
}

function safePageUrl(pathname: string) {
  return `${window.location.origin}${normalizePathname(pathname)}`;
}

function sanitizePageview(
  event: PostHogCaptureResult | null,
): PostHogCaptureResult | null {
  if (!event || event.event !== "$pageview") return null;

  const sourceProperties = event.properties ?? {};
  const pathname = normalizePathname(sourceProperties.$pathname);
  const properties: Record<string, unknown> = {};

  for (const key of SAFE_PAGEVIEW_PROPERTY_KEYS) {
    if (Object.hasOwn(sourceProperties, key)) {
      properties[key] = sourceProperties[key];
    }
  }

  properties.$current_url = safePageUrl(pathname);
  properties.$pathname = pathname;

  if (typeof properties.$prev_pageview_pathname === "string") {
    properties.$prev_pageview_pathname = normalizePathname(
      properties.$prev_pageview_pathname,
    );
  }

  return { ...event, properties };
}

function removeStorageEntries(
  storage: Storage,
  shouldRemove: (key: string) => boolean,
) {
  for (let index = storage.length - 1; index >= 0; index -= 1) {
    const key = storage.key(index);
    if (key && shouldRemove(key)) storage.removeItem(key);
  }
}

function isLegacyPostHogStorageKey(key: string) {
  return (
    key === LEGACY_POSTHOG_CONSENT_KEY ||
    key.startsWith(LEGACY_POSTHOG_PERSISTENCE_PREFIX)
  );
}

function removeLegacyPostHogStorage() {
  try {
    removeStorageEntries(window.localStorage, isLegacyPostHogStorageKey);
  } catch {
    // Storage can be unavailable in hardened browser contexts.
  }

  try {
    removeStorageEntries(window.sessionStorage, isLegacyPostHogStorageKey);
  } catch {
    // Storage can be unavailable in hardened browser contexts.
  }

  try {
    for (const cookie of document.cookie.split(";")) {
      const key = cookie.split("=", 1)[0]?.trim();
      if (key && isLegacyPostHogStorageKey(key)) {
        document.cookie = `${key}=; Max-Age=0; Path=/; SameSite=Lax`;
      }
    }
  } catch {
    // Cookie access can be unavailable in hardened browser contexts.
  }
}

function loadPostHogClient() {
  if (posthogClientPromise) return posthogClientPromise;

  posthogClientPromise = import("posthog-js/dist/array.no-external.js")
    .then(() => {
      const client = window.posthog;
      if (!client) return null;

      try {
        client.init(POSTHOG_TOKEN, {
          api_host: POSTHOG_API_HOST,
          cookieless_mode: "always",
          persistence: "memory",
          disable_persistence: true,
          save_campaign_params: false,
          save_referrer: false,
          person_profiles: "never",
          capture_pageview: false,
          capture_pageleave: false,
          autocapture: false,
          rageclick: false,
          capture_dead_clicks: false,
          capture_exceptions: false,
          capture_heatmaps: false,
          capture_performance: false,
          disable_scroll_properties: true,
          disable_session_recording: true,
          enable_recording_console_log: false,
          disable_surveys: true,
          disable_surveys_automatic_display: true,
          disable_web_experiments: true,
          disable_external_dependency_loading: true,
          advanced_disable_flags: true,
          advanced_disable_feature_flags: true,
          request_batching: false,
          before_send: sanitizePageview,
        });
        return client;
      } catch {
        return null;
      }
    })
    .catch(() => null);

  return posthogClientPromise;
}

export function PHogProvider({ children }: { children: ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    removeLegacyPostHogStorage();
  }, []);

  useEffect(() => {
    const pathname = normalizePathname(location.pathname);
    const locationIdentity = `${location.key}:${pathname}`;
    if (lastScheduledLocation === locationIdentity) return;
    lastScheduledLocation = locationIdentity;

    void loadPostHogClient().then((client) => {
      if (!client) return;

      try {
        client.capture("$pageview", {
          $current_url: safePageUrl(pathname),
          $pathname: pathname,
        });
      } catch {
        // Analytics must never interrupt navigation or tool behavior.
      }
    });
  }, [location.key, location.pathname]);

  return <>{children}</>;
}
