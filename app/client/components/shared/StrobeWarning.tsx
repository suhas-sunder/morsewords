import { WarningIcon } from "~/client/assets/svg/Icons";

export const STROBE_WARNING_TEXT =
  "flashing light may be uncomfortable or unsafe for people with photosensitive epilepsy or light sensitivity. Turn off Flash or use audio-only practice if you are sensitive to strobing.";

export default function StrobeWarning({
  id,
  className = "",
}: {
  id?: string;
  className?: string;
}) {
  return (
    <div
      id={id}
      className={
        "mw-surface mw-text-muted flex gap-3 rounded-xl bg-[#fffdf8] p-3 text-sm leading-relaxed text-slate-700 " +
        className
      }
    >
      <WarningIcon
        size={18}
        title="Strobe warning"
        className="mw-link mt-0.5 shrink-0 text-sky-900"
      />
      <p>
        <strong className="mw-heading text-sky-950">Strobe warning:</strong>{" "}
        {STROBE_WARNING_TEXT}
      </p>
    </div>
  );
}

export function FlashEffectsDisabledNotice({
  className = "",
  id,
}: {
  className?: string;
  id?: string;
}) {
  return (
    <p
      id={id}
      className={
        "mw-text-soft text-sm font-semibold leading-relaxed text-slate-600 " +
        className
      }
    >
      Flashing effects are disabled in display settings. Audio playback still
      works.
    </p>
  );
}
