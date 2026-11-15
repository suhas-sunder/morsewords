import * as React from "react";
import { morseVisualEvents } from "./playMorsePattern";
import { claimPlayback, releasePlayback } from "./playbackOwnership";
import { dispatchFlashClear, dispatchMorseFlash, isFlashAllowedNow } from "./useFlashSafety";

/** The two visual drills share timing, cancellation and ownership. No autoplay. */
export function useVisualMorsePlayback(pattern: string, wpm: number, farnsworthWpm: number) {
  const [active, setActive] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const owner = React.useRef({});
  const timers = React.useRef<number[]>([]);
  const generation = React.useRef(0);
  const stop = React.useCallback(() => {
    generation.current++;
    timers.current.forEach(timer => window.clearTimeout(timer)); timers.current = [];
    setActive(false); setPlaying(false); dispatchFlashClear(); releasePlayback(owner.current);
  }, []);
  React.useEffect(() => {
    const hidden = () => { if (document.hidden) stop(); };
    document.addEventListener("visibilitychange", hidden);
    return () => { document.removeEventListener("visibilitychange", hidden); stop(); };
  }, [stop]);
  React.useEffect(stop, [pattern, wpm, farnsworthWpm, stop]);
  const play = React.useCallback(() => {
    stop();
    if (!isFlashAllowedNow() || document.hidden) return;
    const events = morseVisualEvents(pattern, wpm, farnsworthWpm);
    if (!events.length) return;
    claimPlayback(owner.current, stop);
    const session = generation.current;
    let cursor = 0; setPlaying(true);
    for (const event of events) {
      timers.current.push(window.setTimeout(() => {
        if (session !== generation.current) return;
        if (!isFlashAllowedNow() || document.hidden) { stop(); return; }
        setActive(event.on);
        if (event.on) dispatchMorseFlash(event.ms); else dispatchFlashClear();
      }, cursor));
      cursor += event.ms;
    }
    timers.current.push(window.setTimeout(() => { if (session === generation.current) stop(); }, cursor + 80));
  }, [pattern, wpm, farnsworthWpm, stop]);
  return { active, playing, play, stop };
}
