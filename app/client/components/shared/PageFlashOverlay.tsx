import * as React from "react";

import {
  FLASH_CLEAR_EVENT,
  FLASH_EVENT,
  getClampedFlashDurationMs,
  isFlashAllowedNow,
  isFullPageFlashEnabledNow,
  useFlashSafety,
} from "~/client/components/shared/useFlashSafety";

export default function PageFlashOverlay() {
  const { flashAllowed, fullPageFlash } = useFlashSafety();
  const [active, setActive] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const clearTimer = () => {
      if (timerRef.current === null) return;
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };

    const clearFlash = () => {
      clearTimer();
      setActive(false);
    };

    if (!flashAllowed || !fullPageFlash) {
      clearFlash();
      return;
    }

    const handleFlash = (event: Event) => {
      if (!isFlashAllowedNow() || !isFullPageFlashEnabledNow()) {
        clearFlash();
        return;
      }

      const detail = (event as CustomEvent).detail as { ms?: number } | undefined;
      const rawMs = detail?.ms ?? 0;
      if (!Number.isFinite(rawMs) || rawMs <= 0) return;

      clearTimer();
      setActive(true);
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setActive(false);
      }, getClampedFlashDurationMs(rawMs));
    };

    window.addEventListener(FLASH_EVENT, handleFlash as EventListener);
    window.addEventListener(FLASH_CLEAR_EVENT, clearFlash);

    return () => {
      window.removeEventListener(FLASH_EVENT, handleFlash as EventListener);
      window.removeEventListener(FLASH_CLEAR_EVENT, clearFlash);
      clearTimer();
    };
  }, [flashAllowed, fullPageFlash]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="mw-strobe-flash pointer-events-none fixed inset-0 z-[9998] bg-[#fffdf8]"
      data-mw-full-page-flash="active"
    />
  );
}
