export default function InternationalMorseSourceNote({
  className = "",
}: {
  className?: string;
}) {
  return (
    <p
      data-testid="international-morse-source-note"
      className={["mt-5 max-w-[68ch] text-sm leading-relaxed text-slate-600", className]
        .filter(Boolean)
        .join(" ")}
    >
      MorseWords is not an official standards body. These mappings are
      referenced against{" "}
      <a
        href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I/"
        className="cursor-pointer font-semibold text-sky-900 underline-offset-4 hover:underline"
        rel="noopener noreferrer"
        target="_blank"
      >
        ITU-R Recommendation M.1677-1
      </a>
      {", International Morse code."}
    </p>
  );
}
