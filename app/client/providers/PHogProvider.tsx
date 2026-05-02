import { useEffect } from "react";
import type { ReactNode } from "react";

type PostHogClient = {
  init: (
    token: string,
    options: {
      api_host: string;
      person_profiles: "identified_only";
      capture_pageview: boolean;
    },
  ) => void;
};

declare global {
  interface Window {
    posthog?: PostHogClient;
  }
}

export function PHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    let cancelled = false;

    void import("posthog-js/dist/array.no-external.js").then(() => {
      if (cancelled) return;

      window.posthog?.init("phc_bM7udiE9SpQQnyERjIjmXBMGHaaesURgTEfdjLD0GBZ", {
        api_host: "https://us.i.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: true,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
}
