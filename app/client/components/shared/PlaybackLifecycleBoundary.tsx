import { useEffect } from "react";
import { useLocation } from "react-router";
import { stopOwnedPlayback } from "./playbackOwnership";
import { dispatchFlashClear } from "./useFlashSafety";

export default function PlaybackLifecycleBoundary() {
  const { pathname } = useLocation();
  useEffect(() => () => stopOwnedPlayback(), [pathname]);
  useEffect(() => {
    const hide = () => { if (document.hidden) dispatchFlashClear(); };
    window.addEventListener("pagehide", stopOwnedPlayback);
    document.addEventListener("visibilitychange", hide);
    return () => {
      window.removeEventListener("pagehide", stopOwnedPlayback);
      document.removeEventListener("visibilitychange", hide);
    };
  }, []);
  return null;
}
