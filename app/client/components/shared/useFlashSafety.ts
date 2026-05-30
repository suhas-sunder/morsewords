import * as React from "react";

import {
  areFlashEffectsDisabled,
  useDisplaySettings,
} from "~/client/settings/displaySettings";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MIN_FLASH_MS = 30;
const MAX_FLASH_MS = 1200;

export type FlashSafetyState = {
  flashAllowed: boolean;
  reducedMotion: boolean;
  disableFlashEffects: boolean;
};

export function isFlashAllowedFromSafetyState({
  disableFlashEffects,
}: Pick<FlashSafetyState, "disableFlashEffects" | "reducedMotion">) {
  return !disableFlashEffects;
}

export function prefersReducedMotionNow() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function isFlashAllowedNow() {
  return !areFlashEffectsDisabled();
}

export function useFlashSafety(): FlashSafetyState {
  const { disableFlashEffects } = useDisplaySettings();
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => setReducedMotion(query.matches);
    update();

    try {
      query.addEventListener("change", update);
      return () => query.removeEventListener("change", update);
    } catch {
      query.addListener?.(update);
      return () => query.removeListener?.(update);
    }
  }, []);

  return {
    disableFlashEffects,
    reducedMotion,
    flashAllowed: isFlashAllowedFromSafetyState({
      disableFlashEffects,
      reducedMotion,
    }),
  };
}

export function useFlashLampState(enabled: boolean) {
  const safety = useFlashSafety();
  const [active, setActive] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const clearTimer = () => {
      if (timerRef.current === null) return;
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };

    if (!enabled || !safety.flashAllowed) {
      clearTimer();
      setActive(false);
      return;
    }

    const handler = (event: Event) => {
      if (!isFlashAllowedNow()) {
        clearTimer();
        setActive(false);
        return;
      }

      const detail = (event as CustomEvent).detail as { ms?: number } | undefined;
      const rawMs = detail?.ms ?? 0;
      if (!Number.isFinite(rawMs) || rawMs <= 0) return;

      clearTimer();
      setActive(true);
      const ms = Math.min(MAX_FLASH_MS, Math.max(MIN_FLASH_MS, rawMs));
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setActive(false);
      }, ms);
    };

    window.addEventListener("morsewords:flash", handler as EventListener);
    return () => {
      window.removeEventListener("morsewords:flash", handler as EventListener);
      clearTimer();
    };
  }, [enabled, safety.flashAllowed]);

  return {
    ...safety,
    active: enabled && safety.flashAllowed ? active : false,
  };
}
