import * as React from "react";
import type { Route } from "./+types/audio";

import styles from "~/client/components/shared/audioStyles";
import MorseAudioTranslator from "~/client/components/audio/MorseAudioTranslator";
import HowItWorksAudio from "~/client/components/shared/HowItWorksAudio";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/audio";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Audio Generator with WAV Export | MorseWords",
    description:
      "Create clean Morse code audio from text or Morse input. Adjust WPM, Farnsworth spacing, pitch, waveform, volume, and export WAV files locally in your browser.",
    path: CANONICAL_PATH,
    keywords:
      "morse code audio generator, text to morse audio, morse code to audio, morse audio generator, morse wav, morse code sound",
  });
}

export default function AudioRoute() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${CANONICAL_URL}#webapp`,
        name: "Morse Code Audio Generator",
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        url: CANONICAL_URL,
        description:
          "Browser-based Morse audio generator with adjustable timing and local audio export.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${CANONICAL_URL}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Morse Code Audio Generator",
            item: CANONICAL_URL,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${CANONICAL_URL}#faq`,
        mainEntity: [],
      },
    ],
  };

  const faqItems = [
    {
      q: "Is this just a translator with sound, or an audio tool?",
      a: "It is audio-first. The Morse preview exists so you can verify what will be played, but the main output is sound and the exported WAV file.",
    },
    {
      q: "What is the difference between Character speed and Farnsworth spacing?",
      a: "Character speed sets the dit length (the core sound timing). Farnsworth spacing stretches the pauses between letters and words without changing the dit and dah lengths, which is useful for learning.",
    },
    {
      q: "What file format do exports use?",
      a: "Exports are standard PCM WAV files generated in your browser using an offline render, so timing is consistent even if your device is busy.",
    },
    {
      q: "Why does my Morse spacing matter if I am only making audio?",
      a: "Spacing controls the gaps in the audio. 3 units separates letters and 7 units separates words. If you paste Morse, using 3 spaces for letters and 7 spaces for words produces predictable timing.",
    },
    {
      q: "Does this upload my message or audio anywhere?",
      a: "No. Audio generation and export happen locally in your browser.",
    },
    {
      q: "What are good default settings for a clean practice tone?",
      a: "Start with a sine waveform around 600 Hz, moderate volume, and a small attack and release to reduce clicks. Set character speed to your target WPM, then adjust Farnsworth spacing if you want extra thinking time between letters and words.",
    },
    {
      q: "Can I paste Morse directly and export the exact timing?",
      a: "Yes. If you paste dots and dashes, the generator uses the same unit grid for symbols and gaps. The exported WAV is rendered offline, so what you hear is what the file contains.",
    },
  ];

  (jsonLd as any)["@graph"][2].mainEntity = faqItems.map((item: any) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  }));

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <MorseAudioTranslator />
        <HowItWorksAudio />
        <FaqSectionGeneric title="Audio FAQ" items={faqItems} />
      </div>
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-5xl pb-4 text-sm text-slate-600"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <a href="/" className="underline hover:no-underline cursor-pointer">
              Home
            </a>
          </li>
          <li>/</li>
          <li className="font-semibold text-sky-950">
            Morse Code Audio Generator
          </li>
        </ol>
      </nav>
      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
