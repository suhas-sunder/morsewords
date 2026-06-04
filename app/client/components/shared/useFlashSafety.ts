import * as React from "react";

import {
  areFlashEffectsDisabled,
  areFullPageFlashEffectsEnabled,
  useDisplaySettings,
} from "~/client/settings/displaySettings";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
export const MIN_FLASH_MS = 30;
export const MAX_FLASH_MS = 1200;
export const FLASH_EVENT = "morsewords:flash";
export const FLASH_CLEAR_EVENT = "morsewords:flash-clear";

export type FlashSafetyState = {
  flashAllowed: boolean;
  reducedMotion: boolean;
  disableFlashEffects: boolean;
  fullPageFlash: boolean;
};

type WholePageFlashWarningState = Pick<
  FlashSafetyState,
  "disableFlashEffects" | "fullPageFlash"
> & {
  flashEnabled: boolean;
};

export function isFlashAllowedFromSafetyState({
  disableFlashEffects,
}: Pick<FlashSafetyState, "disableFlashEffects" | "reducedMotion">) {
  return !disableFlashEffects;
}

export function shouldShowWholePageFlashWarning({
  disableFlashEffects,
  flashEnabled,
  fullPageFlash,
}: WholePageFlashWarningState) {
  return fullPageFlash && flashEnabled && !disableFlashEffects;
}

export function prefersReducedMotionNow() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function isFlashAllowedNow() {
  return !areFlashEffectsDisabled();
}

export function isFullPageFlashEnabledNow() {
  return areFullPageFlashEffectsEnabled();
}

export function getClampedFlashDurationMs(ms: number) {
  return Math.min(MAX_FLASH_MS, Math.max(MIN_FLASH_MS, ms));
}

export function dispatchMorseFlash(ms: number) {
  if (typeof window === "undefined" || !isFlashAllowedNow()) return;
  if (!Number.isFinite(ms) || ms <= 0) return;

  window.dispatchEvent(
    new CustomEvent(FLASH_EVENT, {
      detail: { ms: getClampedFlashDurationMs(ms) },
    }),
  );
}

export function dispatchFlashClear() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(FLASH_CLEAR_EVENT));
}

export function useFlashSafety(): FlashSafetyState {
  const { disableFlashEffects, fullPageFlash } = useDisplaySettings();
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
    fullPageFlash,
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

    const clearHandler = () => {
      clearTimer();
      setActive(false);
    };

    const handler = (event: Event) => {
      if (!isFlashAllowedNow()) {
        clearHandler();
        return;
      }

      const detail = (event as CustomEvent).detail as { ms?: number } | undefined;
      const rawMs = detail?.ms ?? 0;
      if (!Number.isFinite(rawMs) || rawMs <= 0) return;

      clearTimer();
      setActive(true);
      const ms = getClampedFlashDurationMs(rawMs);
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setActive(false);
      }, ms);
    };

    window.addEventListener(FLASH_EVENT, handler as EventListener);
    window.addEventListener(FLASH_CLEAR_EVENT, clearHandler);
    return () => {
      window.removeEventListener(FLASH_EVENT, handler as EventListener);
      window.removeEventListener(FLASH_CLEAR_EVENT, clearHandler);
      clearTimer();
    };
  }, [enabled, safety.flashAllowed]);

  return {
    ...safety,
    active: enabled && safety.flashAllowed ? active : false,
    shouldShowWholePageFlashWarning: shouldShowWholePageFlashWarning({
      disableFlashEffects: safety.disableFlashEffects,
      flashEnabled: enabled,
      fullPageFlash: safety.fullPageFlash,
    }),
  };
}
