import * as React from "react";
import type { Route } from "./+types/audio";

import styles from "~/client/components/shared/audioStyles";
import MorseAudioTranslator from "~/client/components/audio/MorseAudioTranslator";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import HowItWorksAudio from "~/client/components/shared/HowItWorksAudio";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/audio";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Audio Generator | Play, Tune, and Save Morse Sound | MorseWords",
    description:
      "Generate Morse code audio from text or dots and dashes. Play the signal, adjust listening settings, and save WAV audio for practice or sharing.",
    path: CANONICAL_PATH,
    keywords:
      "morse code audio generator, text to morse audio, morse code to audio, morse wav export, morse listening practice",
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
          "Browser-based Morse code audio generator for playing full messages, tuning listening settings, and exporting WAV practice audio.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "Text to Morse audio playback",
          "Pasted Morse code audio playback",
          "Adjustable WPM and Farnsworth spacing",
          "Adjustable pitch, waveform, volume, attack, and release",
          "Local WAV export",
          "Browser-based audio generation",
        ],
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
      q: "Can I save the Morse audio from this page?",
      a: "Yes. This page exports a WAV file rendered in your browser, so the timing in the saved file matches the Morse pattern and settings you preview.",
    },
    {
      q: "Can I paste Morse code directly and hear it?",
      a: "Yes. Switch to Morse input and paste dots, dashes, spaces, or slash-separated word gaps. The page plays the pasted pattern using the same timing grid shown in the preview.",
    },
    {
      q: "What speed should I use for listening practice?",
      a: "Start with a character speed you can recognize cleanly, often 12 to 18 WPM for early listening. If the characters sound clear but words feel rushed, increase Farnsworth spacing before lowering character speed.",
    },
    {
      q: "Why does changing pitch not change the Morse message?",
      a: "Pitch changes the frequency of the tone, not the dot, dash, letter, or word timing. Use speed and Farnsworth controls for timing changes, and use pitch only for listening comfort or tone character.",
    },
    {
      q: "Should I use the audio generator or the sound generator?",
      a: "Use this page when you want to hear or save a full Morse message as audio. Use the sound generator when you mainly want to shape the beep or tone signal for practice and testing.",
    },
    {
      q: "Why does the exported WAV sound larger than an MP3?",
      a: "WAV is uncompressed, which keeps symbol timing and short dits clean for editing. If you need a smaller shareable file, use the Morse code MP3 generator.",
    },
    {
      q: "Does this upload my message or audio anywhere?",
      a: "No. Playback and WAV export happen locally in your browser.",
    },
  ];

  (jsonLd as any)["@graph"][2].mainEntity = faqItems.map((item: any) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  }));

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <div style={{ ...styles.wrap, paddingTop: 16 }}>
        <MorseAudioTranslator enableQueryPrefill />
        <HowItWorksAudio />
        <SectionCard
          eyebrow="Try useful audio"
          title="Load common examples into audio"
          description="Use these links when you want to hear a name, short phrase, radio call, or punctuation mark without retyping it."
        >
          <ActionLinks
            links={[
              { href: "/name-to-morse-code", label: "Name to Morse", primary: true },
              { href: "/morse-code-mp3-generator", label: "Download MP3" },
              { href: "/morse-code-chart", label: "Complete chart" },
              { href: "/morse-code-audio-decoder", label: "Decode audio file" },
              { href: "/audio?text=I%20LOVE%20YOU", label: "I love you" },
              { href: "/audio?text=CQ", label: "CQ" },
              { href: "/audio?text=%3F", label: "Question mark" },
              { href: "/audio?text=%40", label: "At sign" },
            ]}
          />
        </SectionCard>
        <FaqSectionGeneric title="Audio FAQ" items={faqItems} />
      </div>
      <BreadcrumbTrail
        current="Morse Code Audio Generator"
        placement="pageBottom"
      />
      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
