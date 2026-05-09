import * as React from "react";
import type { Route } from "./+types/home";

import styles from "~/client/components/shared/pageStyles";
import TranslatorSectionsBasic from "~/client/components/shared/TranslatorSectionsBasic";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import { morseToText, textToMorse } from "~/client/components/shared/morseUtils";
import HowItWorks from "~/client/components/home/HowItWorks";
import { seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/";

const homeRelatedToolsStyles = `
  .mw-home-page ~ #morse-code-navigation {
    margin-top: 1.75rem;
    background: transparent !important;
    border-radius: 0 !important;
    overflow: visible !important;
  }

  .mw-home-page ~ #morse-code-navigation > div {
    background: transparent !important;
  }

  @media (max-width: 767px) {
    .mw-home-page ~ #morse-code-navigation {
      margin-top: 1.25rem;
    }

    .mw-home-page ~ #morse-code-navigation > div {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
`;

export function links() {
  return [{ rel: "canonical", href: SITE_URL + "/" }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Translator, Audio, Practice, and Worksheets | MorseWords",
    description:
      "Convert text to Morse code and Morse to text, generate audio, run practice drills, and build printable worksheets with fast browser-based tools.",
    path: CANONICAL_PATH,
    keywords:
      "morse code translator, text to morse code, morse to text, morse code decoder, morse code audio, english to morse code",
  });
}

export default function Home() {
  const [plainA, setPlainA] = React.useState("sos help");
  const morseA = React.useMemo(() => textToMorse(plainA), [plainA]);

  const [morseB, setMorseB] = React.useState("... --- ...");
  const textB = React.useMemo(() => morseToText(morseB), [morseB]);

  const baseUrl = SITE_URL;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MorseWords Morse Code Translator",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: baseUrl + "/",
    description:
      "Browser-based Morse toolkit for translating, listening, practicing, and printing Morse code.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const faqItems = [
    {
      q: "What does this translator support?",
      a: "It supports A–Z, 0–9, and common punctuation (like . , ? ! / - @). When encoding, unsupported characters are ignored and listed under the input so you can spot what was skipped.",
    },
    {
      q: "How do I paste Morse code to decode it?",
      a: "Paste dots and dashes into the Morse input. For best results, separate letters with 3 spaces and words with 7 spaces. A single space between letters also works, and new lines are treated like word breaks.",
    },
    {
      q: "Can I use / as a word separator?",
      a: "Yes. A slash is treated as a word separator when decoding.",
    },
    {
      q: "Why is spacing important for decoding?",
      a: "The decoder needs separators to know where one letter ends and the next begins. This tool treats 1–6 spaces as a letter gap and 7+ spaces (or / or a new line) as a word gap.",
    },
    {
      q: "What if my Morse has an unknown sequence?",
      a: "Unknown Morse sequences are shown as “?” in the decoded output so mistakes don’t disappear silently.",
    },
  ];

  return (
    <div className="mw-home-page" style={styles.page}>
      <style dangerouslySetInnerHTML={{ __html: homeRelatedToolsStyles }} />

      <div className="mx-auto w-full max-w-[1120px] px-4 pb-0 pt-2 sm:px-6 sm:pt-4 lg:px-8">
        <TranslatorSectionsBasic
          variant="home"
          plainA={plainA}
          setPlainA={setPlainA}
          morseA={morseA}
          morseB={morseB}
          textB={textB}
          setMorseB={setMorseB}
          enableQueryPrefill
          subtitle={
            <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              Translate plain text, decode Morse, and listen to the signal in
              one focused workspace.
            </p>
          }
        />
      </div>

      <HowItWorks />

      <div className="mx-auto w-full max-w-[1040px] px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <FaqSectionGeneric
          title="Translator FAQ"
          items={faqItems}
          variant="home"
        />
      </div>

      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
