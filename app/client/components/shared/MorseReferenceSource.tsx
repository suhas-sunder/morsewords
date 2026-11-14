import { getMorseReferenceSource } from "~/client/data/morseReferenceSources";

const linkClass = "cursor-pointer font-semibold text-sky-900 underline-offset-4 hover:underline";

export default function MorseReferenceSource({ character, detail = "full" }: { character: string; detail?: "full" | "exceptions" }) {
  const source = getMorseReferenceSource(character);
  if (!source) return null;
  // Generic lookup uses one page-level authority note. Keep inline provenance
  // where an extension or operating collision changes interpretation.
  if (detail === "exceptions" && source.standard && !source.operatingContext) return null;
  return (
    <span className="mt-2 block max-w-[58ch] text-xs leading-relaxed text-slate-600" data-mw-reference-character={character}>
      <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.08em]">{source.label}</span>
      <a href={source.href} className={linkClass} target="_blank" rel="noreferrer">ITU-R M.1677-1 §{source.section}</a>
      {source.note && <span className="mt-1 block">{source.note}</span>}
      {source.operatingContext && <span className="mt-1 block">{source.operatingContext.note} <a href={source.operatingContext.href} className={linkClass} target="_blank" rel="noreferrer">ARRL operating reference (PDF)</a></span>}
    </span>
  );
}
