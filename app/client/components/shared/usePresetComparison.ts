import * as React from "react";
import type useMorseAudio from "./useMorseAudio";
import type { PlayOptions } from "./useMorseAudio";
import type { AudioTonePresetId } from "./audioPresetRegistry";

type Player = Pick<ReturnType<typeof useMorseAudio>, "play" | "stop" | "state">;
type ComparisonOptions = Pick<PlayOptions, "code" | "wpm" | "farnsworthWpm" | "hz" | "volume" | "attackMs" | "releaseMs" | "soundEnabled" | "preset" | "repeat" | "flash">;

// Audition uses the page's existing engine. Only its live-update effect pauses
// while comparison owns that engine; persisted preferences are never rewritten.
export function usePresetComparison(player: Player, options: ComparisonOptions) {
  const active = React.useRef(false);
  const version = React.useRef(0);
  const mounted = React.useRef(false);
  const latest = React.useRef({ player, options });
  latest.current = { player, options };
  const [playing, setPlaying] = React.useState<{ side: "A" | "B"; preset: AudioTonePresetId } | null>(null);
  const [message, setMessage] = React.useState("");
  const stop = React.useCallback(() => {
    version.current++;
    if (active.current) latest.current.player.stop();
    active.current = false;
    if (mounted.current) { setPlaying(null); setMessage(""); }
  }, []);
  React.useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; stop(); };
  }, [stop]);
  React.useEffect(() => { stop(); }, [stop, options.code, options.wpm, options.farnsworthWpm,
    options.hz, options.volume, options.attackMs, options.releaseMs, options.soundEnabled, options.preset, options.repeat, options.flash]);

  const play = React.useCallback(async (side: "A" | "B", preset: AudioTonePresetId) => {
    const current = latest.current;
    if (current.options.soundEnabled === false) return;
    const session = ++version.current;
    active.current = true;
    setPlaying({ side, preset }); setMessage("");
    const outcome = await current.player.play({ ...current.options, preset, repeat: false, flash: false });
    if (!mounted.current || session !== version.current) return;
    active.current = false; setPlaying(null);
    if (outcome === "unavailable") setMessage("Audio could not start. Try Play again to unlock sound.");
  }, []);
  return { active, playing, message, play, stop, paused: player.state === "paused" };
}
