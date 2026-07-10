import * as React from "react";

import {
  ActionButton,
  copyTextToClipboard,
} from "~/client/components/shared/ActionControls";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import { transliterateForInternationalMorse } from "~/client/components/shared/internationalMorse";
import { textToMorse } from "~/client/components/shared/morseUtils";
import styles from "~/client/components/shared/pageStyles";
import TranslatorSectionsBasic from "~/client/components/shared/TranslatorSectionsBasic";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";

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
    title: "International Text to Morse Code Converter | MorseWords",
    description:
      "Convert English, accented Latin text, and common non-Latin words into International Morse code with readable transliteration before encoding.",
    path: CANONICAL_PATH,
    keywords:
      "international text to morse code, morse code translator languages, english to morse code, spanish morse code, japanese morse code, hindi morse code",
  });
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
    <article className="mw-static-panel rounded-2xl bg-[#fffdf8] p-4">
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
          className="min-h-10 cursor-pointer rounded-lg bg-white px-3 py-1.5 text-sm font-bold text-slate-700 transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none sm:min-h-0"
        >
          Try
        </button>
      </div>
      <code className="mw-static-code mt-4 block break-words rounded-xl bg-[#f7f4ee] px-3 py-3 text-sm font-black text-slate-950">
        {morse}
      </code>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-sm text-slate-600">{transliteration}</span>
        <ActionButton
          unstyled
          onClick={async () => {
            const didCopy = await copyTextToClipboard(morse);
            if (!didCopy) return;
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1000);
          }}
          className="min-h-10 cursor-pointer rounded-lg bg-slate-950 px-3 py-1.5 text-sm font-bold text-sky-100 transition hover:bg-slate-800 hover:text-white focus:outline-none sm:min-h-0"
        >
          {copied ? "Copied" : "Copy"}
        </ActionButton>
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

  const [morseB, setMorseB] = React.useState("");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "International Text to Morse Code Converter",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: CANONICAL_URL,
    description:
      "A browser-based Morse code translator that accepts English and international words by transliterating them into Latin characters before Morse encoding.",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "International Text to Morse Code Converter",
        item: CANONICAL_URL,
      },
    ],
  };

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <TranslatorSectionsBasic
          title="International Text to Morse Code Converter"
          subtitle={
            <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              Convert English and world-language words into Morse using
              readable transliteration before encoding. This page does not
              reconstruct the original accents or script from Morse.
            </p>
          }
          examples={EXAMPLES.slice(0, 5).map((item) => item.word)}
          plainA={plainA}
          setPlainA={setPlainA}
          morseA={morseA}
          morseB={morseB}
          textB=""
          setMorseB={setMorseB}
          plainValidationValue={transliterated}
          quietInputFocus
          allowDecode={false}
        />

        <section className="pb-8">
          <p className="max-w-3xl text-base leading-relaxed text-slate-700">
            For broad two-way Morse translation, use the{" "}
            <a
              href={ROUTES.home}
              className="font-semibold text-sky-900 underline-offset-4 hover:underline"
            >
              main Morse translator
            </a>
            . For language adaptations, see{" "}
            <a
              href={ROUTES.morseCodeByLanguage}
              className="font-semibold text-sky-900 underline-offset-4 hover:underline"
            >
              Morse code by language
            </a>
            , or consult the{" "}
            <a
              href={ROUTES.internationalReference}
              className="font-semibold text-sky-900 underline-offset-4 hover:underline"
            >
              International Morse code reference
            </a>
            .
          </p>
        </section>

        <section className="mw-static-surface-soft relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-[#fffaf2]/40 py-8">
          <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-sky-800" />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
                International Morse
              </span>
            </div>
            <h2 className="mt-3 max-w-4xl text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
              Convert International Text into Morse Code
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-700 sm:text-lg">
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
          <div className="mw-static-panel rounded-2xl bg-[#fffdf8] p-5 text-slate-700">
            <h2 className="m-0 text-xl font-extrabold text-sky-950">
              International translation disclaimer
            </h2>
            <p className="mt-2 leading-relaxed">
              International Morse code encodes letters and symbols, not meaning.
              For non-Latin scripts, this page uses practical transliteration
              before conversion. This page does not reconstruct the original
              accents or script from Morse. International translations and
              transliterations may not be perfect, especially for names,
              regional pronunciation, or languages with more than one
              romanization standard.
            </p>
          </div>
        </section>

        <JsonLdScript jsonLd={[jsonLd, breadcrumbJsonLd]} />
      </main>
      <BreadcrumbTrail current="International Text to Morse Code Converter" />
    </div>
  );
}
