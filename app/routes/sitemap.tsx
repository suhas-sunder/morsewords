import * as React from "react";
import { Link } from "react-router";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/sitemap";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

type SitemapGroup = {
  title: string;
  description: string;
  links: Array<{ label: string; to: string; description: string }>;
};

const GROUPS: SitemapGroup[] = [
  {
    title: "Core Morse tools",
    description: "Translate, encode, decode, and play Morse code.",
    links: [
      {
        label: "Free Morse Code Translator with Audio",
        to: "/",
        description: "Convert text to Morse, decode Morse to text, and play audio.",
      },
      {
        label: "Morse Code Audio Generator",
        to: "/audio",
        description:
          "Generate Morse code audio from text or Morse input for practice and downloads.",
      },
      {
        label: "Morse Code Encoder",
        to: "/morse-code-encoder",
        description: "Turn English text into Morse code dots and dashes.",
      },
      {
        label: "Morse Code Decoder",
        to: "/morse-code-decoder",
        description: "Convert Morse code back into readable text.",
      },
      {
        label: "International Morse Code Translator",
        to: "/morse-code-international-translator",
        description:
          "Translate English and international words into Morse code with transliteration.",
      },
      {
        label: "International Morse Code Reference",
        to: "/international-morse-code-reference",
        description:
          "Browse letters, digits, punctuation, prosigns, Q-codes, and standards notes.",
      },
    ],
  },
  {
    title: "Practice and learning",
    description: "Build recognition, accuracy, and speed with practical drills.",
    links: [
      {
        label: "Learn Morse Code",
        to: "/learn-morse-code",
        description:
          "Follow a practical path through alphabet, practice, audio, words, sentences, and worksheets.",
      },
      {
        label: "Morse Code Practice Plan",
        to: "/morse-code-practice-plan",
        description:
          "Use a 2-week or 6-week routine across MorseWords tools.",
      },
      {
        label: "Practice",
        to: "/practice",
        description: "Train text-to-Morse and Morse-to-text recognition.",
      },
      {
        label: "Typing",
        to: "/typing",
        description: "Practice typing answers from Morse prompts.",
      },
      {
        label: "Morse Code Sentence Practice",
        to: "/morse-code-sentence-practice",
        description: "Decode and practice complete Morse code sentences.",
      },
      {
        label: "Morse Code Word Trainer",
        to: "/morse-code-word-trainer",
        description:
          "Practice built-in or custom word lists with audio and weak-word review.",
      },
      {
        label: "Morse Code Audio Practice",
        to: "/morse-code-audio-practice",
        description:
          "Practice copying Morse by ear with focused audio prompts.",
      },
      {
        label: "Morse Code Visual Practice",
        to: "/morse-code-visual-practice",
        description:
          "Practice reading Morse from a flashing light signal.",
      },
      {
        label: "Morse Code Audio Quiz",
        to: "/morse-code-audio-quiz",
        description:
          "Test Morse listening recall with a 10-question scored audio quiz.",
      },
      {
        label: "Morse Code Visual Quiz",
        to: "/morse-code-visual-quiz",
        description:
          "Test visual Morse recall with a 10-question scored flashing-light quiz.",
      },
      {
        label: "How to Use MorseWords",
        to: "/how-to-use",
        description: "Learn the site workflow and common Morse conventions.",
      },
      {
        label: "Printable Morse Code Worksheets",
        to: "/morse-code-printable-chart",
        description:
          "Print or download learner, teacher, and classroom Morse code templates.",
      },
      {
        label: "Morse Code Worksheet Generator",
        to: "/morse-code-worksheet-generator",
        description:
          "Create custom word and sentence worksheets with answer keys.",
      },
      {
        label: "Morse Code Word Search Builder",
        to: "/morse-code-word-search-builder",
        description:
          "Build printable Morse vocabulary word searches from custom lists.",
      },
    ],
  },
  {
    title: "Charts and references",
    description: "Look up alphabets, words, symbols, and spacing rules.",
    links: [
      {
        label: "Morse Code Alphabet",
        to: "/morse-code-alphabet",
        description: "Browse letters, numbers, and common Morse symbols.",
      },
      {
        label: "Dictionary",
        to: "/dictionary",
        description: "Find Morse code terms, abbreviations, and references.",
      },
      {
        label: "Morse Code Words",
        to: "/morse-code-words",
        description: "Copy common words, phrases, prosigns, and Q-codes.",
      },
      {
        label: "Morse Code Word Separator",
        to: "/morse-code-word-separator",
        description: "Understand spaces, slashes, and word breaks in Morse.",
      },
      {
        label: "Morse Code Timing",
        to: "/morse-code-timing",
        description:
          "Understand dot, dash, character gap, word gap, WPM, and PARIS timing.",
      },
      {
        label: "Farnsworth Timing",
        to: "/farnsworth-timing",
        description:
          "Learn character speed, effective speed, and learner spacing.",
      },
      {
        label: "Morse Code Prosigns",
        to: "/morse-code-prosigns",
        description:
          "Look up SOS, AR, SK, BT, and other procedural Morse signals.",
      },
      {
        label: "Morse Code Q-Codes",
        to: "/morse-code-q-codes",
        description:
          "Browse common Q-codes with meanings, examples, and audio.",
      },
      {
        label: "Morse Code Punctuation",
        to: "/morse-code-punctuation",
        description:
          "Find Morse punctuation for period, comma, question mark, slash, and symbols.",
      },
      {
        label: "The Quick Brown Fox in Morse Code",
        to: "/the-quick-brown-fox-morse-code",
        description: "Use the classic pangram as a full-alphabet practice phrase.",
      },
      {
        label: "SOS in Morse Code",
        to: "/morse-code-sos",
        description:
          "Play, copy, and learn the SOS Morse code distress signal.",
      },
    ],
  },
  {
    title: "Site information",
    description: "About MorseWords and site policies.",
    links: [
      {
        label: "About",
        to: "/about",
        description: "Learn what MorseWords is built for.",
      },
      {
        label: "Sources",
        to: "/sources",
        description:
          "See the standards and references used for MorseWords timing and reference pages.",
      },
      {
        label: "Socials",
        to: "/misc/socials",
        description: "Find MorseWords social links.",
      },
      {
        label: "Privacy Policy",
        to: "/misc/privacy-policy",
        description: "Read how privacy is handled on MorseWords.",
      },
      {
        label: "Terms of Service",
        to: "/misc/terms-of-service",
        description: "Review site terms and conditions.",
      },
      {
        label: "Cookie Policy",
        to: "/misc/cookies-policy",
        description: "Review cookie usage details.",
      },
    ],
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta() {
  return seoMeta({
    title: "HTML Sitemap - MorseWords",
    description:
      "Browse every MorseWords translator, audio tool, practice page, printable chart, reference guide, and site policy from one HTML sitemap.",
    path: CANONICAL_PATH,
    keywords:
      "morsewords sitemap, morse code tools, morse code translator sitemap, morse code practice pages",
  });
}

export default function HtmlSitemap() {
  const itemList = GROUPS.flatMap((group) => group.links).map((link, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: link.label,
    url: canonicalUrl(link.to),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HTML Sitemap",
    url: CANONICAL_URL,
    description:
      "A complete browsable sitemap for MorseWords tools, learning pages, reference guides, and policies.",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: itemList,
    },
  };

  return (
    <div style={styles.page}>
      <main style={styles.wrap}>
        <section className="py-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="m-0 text-sm font-extrabold uppercase tracking-wide text-sky-800">
              MorseWords sitemap
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
              HTML Sitemap
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
              A simple map of every main MorseWords page, including translator
              tools, audio generators, practice pages, printable learning
              resources, reference charts, and site information.
            </p>
          </div>
        </section>

        <div className="grid gap-5 pb-8 md:grid-cols-2">
          {GROUPS.map((group) => (
            <section
              key={group.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="m-0 text-2xl font-bold text-sky-800">
                {group.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {group.description}
              </p>
              <div className="mt-4 grid gap-3">
                {group.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 no-underline transition hover:bg-white hover:shadow-sm"
                  >
                    <span className="block font-extrabold text-sky-800">
                      {link.label}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                      {link.description}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}
