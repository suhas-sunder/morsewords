import * as React from "react";
import { safeWriteStorage, type StorageClearResult } from "~/client/components/shared/settingsStorage";
import { emptySoundFirstProgress, parseSoundFirstProgress, SOUND_FIRST_STORAGE_KEY, validSoundFirstSet, type SoundFirstProgress } from "./soundFirstSchema";

export function useSoundFirstProgress() {
  const [progress, setProgress] = React.useState(emptySoundFirstProgress);
  const [notice, setNotice] = React.useState("");
  const [ready, setReady] = React.useState(false);
  const current = React.useRef(progress);
  const unreadable = React.useRef(false);
  React.useEffect(() => {
    const read = () => {
      try {
        const next = parseSoundFirstProgress(localStorage.getItem(SOUND_FIRST_STORAGE_KEY));
        unreadable.current = next === null;
        current.current = next ?? emptySoundFirstProgress(); setProgress(current.current);
        setNotice(next ? "" : "Saved path progress could not be read and has not been changed. New progress stays in this tab until you clear the saved path progress.");
      } catch { unreadable.current = true; setNotice("Browser storage is unavailable. Path progress stays in this tab; saved data has not been overwritten."); }
      setReady(true);
    };
    const storage = (event: StorageEvent) => { if (event.key === SOUND_FIRST_STORAGE_KEY || event.key === null) read(); };
    const clear = (event: Event) => { if ((event as CustomEvent<StorageClearResult>).detail?.removedKeys.includes(SOUND_FIRST_STORAGE_KEY)) read(); };
    read(); window.addEventListener("storage", storage); window.addEventListener("morsewords:storage-clear", clear);
    return () => { window.removeEventListener("storage", storage); window.removeEventListener("morsewords:storage-clear", clear); };
  }, []);
  const write = (next: SoundFirstProgress, explicitClear = false) => {
    if (!ready) return;
    if (explicitClear) unreadable.current = false;
    current.current = next; setProgress(next);
    if (unreadable.current) return;
    const saved = safeWriteStorage(SOUND_FIRST_STORAGE_KEY, JSON.stringify(next));
    setNotice(saved ? "" : "Path progress stays in this tab because browser storage could not save it. Older saved progress may return after reload.");
  };
  return {
    progress, notice, ready,
    choose: (index: number) => { if (validSoundFirstSet(index)) write({ ...current.current, selectedSet: index }); },
    finishRound: (index: number) => {
      if (!validSoundFirstSet(index)) return;
      const completedRounds = [...current.current.completedRounds];
      completedRounds[index] = Math.min(9999, completedRounds[index] + 1);
      write({ ...current.current, completedRounds });
    },
    clear: () => write(emptySoundFirstProgress(), true),
  };
}
