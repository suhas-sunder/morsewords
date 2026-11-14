export default function InternationalMorseSourceNote({
  className = "",
  includesExtensions = false,
  characterOverview = false,
}: {
  className?: string;
  includesExtensions?: boolean;
  characterOverview?: boolean;
}) {
  return (
    <p
      data-testid="international-morse-source-note"
      className={["mt-5 max-w-[68ch] text-sm leading-relaxed text-slate-600", className]
        .filter(Boolean)
        .join(" ")}
    >
      {characterOverview ? "A–Z, 0–9 and listed punctuation follow " : <>MorseWords is not an official standards body. {includesExtensions ? "The written-character labels distinguish ITU entries from compatibility extensions supported by this tool. Compare their scope with " : "These mappings are referenced against "}</>}
      <a
        href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I/"
        className="cursor-pointer font-semibold text-sky-900 underline-offset-4 hover:underline"
        rel="noopener noreferrer"
        target="_blank"
      >
        ITU-R Recommendation M.1677-1
      </a>
      {characterOverview ? ", Annex 1, Part I, sections 1.1.1 and 1.1.2 (letters and digits) and 1.1.3 (punctuation). Inline notes explain compatibility extensions and operating-signal collisions. MorseWords is not an official standards body." : ", International Morse code."}
    </p>
  );
}
