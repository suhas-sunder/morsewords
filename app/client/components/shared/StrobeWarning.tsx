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
        "flex gap-3 rounded-xl border border-slate-200 bg-[#fffdf8] p-3 text-sm leading-relaxed text-slate-700 " +
        className
      }
    >
      <WarningIcon
        size={18}
        title="Strobe warning"
        className="mt-0.5 shrink-0 text-sky-900"
      />
      <p>
        <strong className="text-sky-950">Strobe warning:</strong>{" "}
        {STROBE_WARNING_TEXT}
      </p>
    </div>
  );
}
