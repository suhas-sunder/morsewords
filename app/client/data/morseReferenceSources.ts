import { getMorseRegistryEntries } from "~/client/components/shared/morseRegistry";

export const ITU_MORSE_SOURCE = "https://www.itu.int/dms_pubrec/itu-r/rec/m/R-REC-M.1677-1-200910-I!!PDF-E.pdf";
const entries = new Map(getMorseRegistryEntries({ systemId: "international", defaultGlobal: true }).map((entry) => [entry.character, entry]));

const operatingContext: Record<string, { note: string; href: string }> = {
  "+": { note: "The same pattern is used for AR, marking the end of a message in radiograms. Context distinguishes the signal from a plus sign.", href: "https://www.arrl.org/files/file/Public%20Service/fsd218.pdf" },
  "=": { note: "The same pattern is used for BT, a separator in radiograms. It need not mean a written equals sign.", href: "https://www.arrl.org/files/file/Public%20Service/fsd218.pdf" },
  "(": { note: "The same pattern is used for KN, inviting only the named station to answer.", href: "https://www.arrl.org/files/file/Public%20Service/fsd220.pdf" },
  "&": { note: "The pattern is also AS, the wait signal. ITU lists the wait signal, not an ampersand character.", href: "https://www.arrl.org/files/file/Public%20Service/fsd220.pdf" },
};

/** Presentation of existing registry decisions; never changes encoding or reverse decoding. */
export function getMorseReferenceSource(character: string) {
  const entry = entries.get(character);
  if (!entry || !["letter", "digit", "punctuation"].includes(entry.category)) return null;
  const standard = entry.provenance.sourceCategorySummary === "international-standard";
  const section = entry.category === "letter" ? "1.1.1" : entry.category === "digit" ? "1.1.2" : "1.1.3";
  return {
    standard,
    label: standard ? "ITU written character" : "Compatibility extension",
    section,
    href: `${ITU_MORSE_SOURCE}#page=${entry.category === "punctuation" ? 5 : 4}`,
    note: standard ? null : "Supported by MorseWords; not listed as this punctuation in the ITU recommendation.",
    operatingContext: operatingContext[character] ?? null,
  };
}
