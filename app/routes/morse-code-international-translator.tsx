import * as React from "react";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import { transliterateForInternationalMorse } from "~/client/components/shared/internationalMorse";
import { morseToText, textToMorse } from "~/client/components/shared/morseUtils";
import styles from "~/client/components/shared/pageStyles";
import TranslatorSectionsBasic from "~/client/components/shared/TranslatorSectionsBasic";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-international-translator";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

const EXAMPLES = [
  { word: "Maestro", language: "Spanish" },
  { word: "Professeur", language: "French" },
  { word: "Professor", language: "Portuguese" },
  { word: "Lehrer", language: "German" },
  {
    word: "\u0936\u093f\u0915\u094d\u0937\u0915",
    language: "Hindi",
    transliteration: "shikshak",
  },
  { word: "Guro", language: "Tagalog" },
  { word: "\u5148\u751f", language: "Japanese", transliteration: "sensei" },
  { word: "Guru", language: "Indonesian" },
  {
    word: "\u0423\u0447\u0438\u0442\u0435\u043b\u044c",
    language: "Russian",
    transliteration: "uchitel'",
  },
  {
    word: "\uc120\uc0dd\ub2d8",
    language: "Korean",
    transliteration: "seonsaengnim",
  },
  { word: "Insegnante", language: "Italian" },
  { word: "Leraar", language: "Dutch" },
  { word: "\u00d6\u011fretmen", language: "Turkish" },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta() {
  return seoMeta({
    title: "International Morse Code Translator | English & World Words",
    description:
      "Translate English and international words into Morse code with readable transliteration examples for Spanish, French, German, Hindi, Japanese, Korean, Russian, and more.",
    path: CANONICAL_PATH,
    keywords:
      "international morse code translator, morse code translator languages, english to morse code, spanish morse code, japanese morse code, hindi morse code",
  });
}

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

function ExampleCard({
  item,
  onUse,
}: {
  item: (typeof EXAMPLES)[number];
  onUse: (word: string) => void;
}) {
  const [copied, setCopied] = React.useState(false);
  const transliteration =
    item.transliteration ?? transliterateForInternationalMorse(item.word);
  const morse = textToMorse(transliteration);

  return (
    <article className="rounded-2xl border border-slate-200 bg-[#fffdf8] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="m-0 text-xl font-extrabold text-sky-950">
            {item.word}
          </h3>
          <p className="mt-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
            {item.language}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onUse(item.word)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-950"
        >
          Try
        </button>
      </div>
      <code className="mt-4 block break-words rounded-xl border border-slate-200 bg-[#f7f4ee] px-3 py-3 text-sm font-black text-slate-950">
        {morse}
      </code>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-sm text-slate-600">{transliteration}</span>
        <button
          type="button"
          onClick={async () => {
            await copyText(morse);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1000);
          }}
          className="rounded-xl bg-[#171717] px-3 py-1.5 text-sm font-bold text-sky-100 transition hover:bg-slate-800 hover:text-white"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </article>
  );
}

export default function InternationalTranslator() {
  const [plainA, setPlainA] = React.useState("Maestro");
  const transliterated = React.useMemo(
    () => transliterateForInternationalMorse(plainA),
    [plainA],
  );
  const morseA = React.useMemo(
    () => textToMorse(transliterated),
    [transliterated],
  );

  const [morseB, setMorseB] = React.useState("-- .- . ... - .-. ---");
  const textB = React.useMemo(() => morseToText(morseB), [morseB]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "International Morse Code Translator",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: CANONICAL_URL,
    description:
      "A browser-based Morse code translator that accepts English and international words by transliterating them into Latin characters before Morse encoding.",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div style={styles.page}>
      <main style={styles.wrap}>
        <TranslatorSectionsBasic
          title="International Morse Code Translator"
          subtitle={
            <p className="mt-2 max-w-none text-base leading-7 text-slate-700 sm:text-[1.08rem]">
              Convert English and world-language words into Morse using
              readable transliteration before encoding.
            </p>
          }
          examples={EXAMPLES.slice(0, 5).map((item) => item.word)}
          plainA={plainA}
          setPlainA={setPlainA}
          morseA={morseA}
          morseB={morseB}
          textB={textB}
          setMorseB={setMorseB}
          plainValidationValue={transliterated}
        />

        <section className="pb-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-[#fffdf8] shadow-sm">
            <div className="border-b border-slate-200 bg-[#fffaf2] px-5 py-6 sm:px-8">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-sky-800" />
                <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
                  International Morse
                </span>
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
                Translate English and International Words into Morse Code
              </h2>
            </div>
            <p className="max-w-3xl px-5 py-6 text-base leading-relaxed text-slate-700 sm:px-8 sm:text-lg">
              Type English, accented Latin words, or common non-Latin scripts.
              MorseWords transliterates the text into readable Latin characters
              first, then converts that pronunciation-friendly text into
              International Morse code.
            </p>
          </div>
        </section>

        <section className="pb-4">
          <h2 className="m-0 text-2xl font-extrabold text-sky-950">
            International Morse code examples
          </h2>
          <p className="mt-2 max-w-3xl text-slate-700">
            These examples match the English-speaking intent behind
            international Morse code: a word from another language is shown as
            readable transliteration, then converted into dots and dashes.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXAMPLES.map((item) => (
              <ExampleCard
                key={`${item.language}-${item.word}`}
                item={item}
                onUse={setPlainA}
              />
            ))}
          </div>
        </section>

        <section className="pb-8">
          <div className="rounded-2xl border border-amber-200 bg-[#fffaf2] p-5 text-amber-950 shadow-sm">
            <h2 className="m-0 text-xl font-extrabold">
              International translation disclaimer
            </h2>
            <p className="mt-2 leading-relaxed">
              International Morse code encodes letters and symbols, not meaning.
              For non-Latin scripts, this page uses practical transliteration
              before conversion. International translations and transliterations
              may not be perfect, especially for names, regional pronunciation,
              or languages with more than one romanization standard.
            </p>
          </div>
        </section>

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}
