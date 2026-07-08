import * as React from "react";
import type { Route } from "./+types/audio";

import { PostHeroBannerAd } from "~/client/components/ads/AdSenseAds";
import styles from "~/client/components/shared/audioStyles";
import MorseAudioTranslator from "~/client/components/audio/MorseAudioTranslator";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import HowItWorksAudio from "~/client/components/shared/HowItWorksAudio";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  SectionCard,
  SimpleGrid,
} from "~/client/components/shared/MorseLearningLayout";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = ROUTES.audio;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

type AudioFaqItem = {
  q: string;
  a: string;
};

type AudioFaqQuestionSchema = {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
};

const audioToolPathItems = [
  {
    title: "Create Morse sound",
    text: "Shape a beep, tone, or radio-style signal when tone character matters more than a full message workflow.",
    href: ROUTES.soundGenerator,
    badge: "Sound",
  },
  {
    title: "Download MP3",
    text: "Use the MP3 generator when you need a smaller shareable file instead of the WAV export on this page.",
    href: ROUTES.mp3Generator,
    badge: "MP3",
  },
  {
    title: "Decode audio",
    text: "Use the audio decoder when you have a local Morse audio file and want to turn the tones back into readable text.",
    href: ROUTES.audioDecoder,
    badge: "Decode",
  },
  {
    title: "Convert long text or books",
    text: "Move TXT, EPUB, PDF, or chapter-length source material into the book translator for longer audio or video output.",
    href: ROUTES.bookTranslator,
    badge: "Books",
  },
  {
    title: "Make a Morse video",
    text: "Create a downloadable visual Morse clip with an optional audio track for short messages and demos.",
    href: ROUTES.videoGenerator,
    badge: "Video",
  },
  {
    title: "Practice listening",
    text: "Build ear training with focused copy practice after you understand the speed and spacing you want.",
    href: ROUTES.audioPractice,
    badge: "Listen",
  },
  {
    title: "Take an audio quiz",
    text: "Check recognition with short listening prompts and immediate review when you are ready for a test.",
    href: ROUTES.audioQuiz,
    badge: "Quiz",
  },
];

const faqItems: AudioFaqItem[] = [
  {
    q: "Can I translate text into Morse code audio?",
    a: "Yes. Type a message in text mode and the page converts it to Morse code, plays it as audio, and shows the Morse output beside the input.",
  },
  {
    q: "Can I change the Morse speed?",
    a: "Yes. Character speed controls how fast each dit and dah is sent, while Farnsworth spacing can add extra room between letters and words for easier listening.",
  },
  {
    q: "What is Farnsworth timing?",
    a: "Farnsworth timing keeps the characters crisp but stretches the gaps between characters and words. It is useful when you can hear individual letters but need more time to copy words.",
  },
  {
    q: "Can I change the tone or pitch?",
    a: "Yes. The tone preset, pitch, volume, attack, and release controls change how the audio sounds. They do not change the Morse letters, word gaps, or decoded message.",
  },
  {
    q: "Can I download the audio from this page?",
    a: "Yes. This page exports a WAV file rendered in your browser, so the saved file matches the timing and tone settings you preview.",
  },
  {
    q: "When should I use the MP3 generator instead?",
    a: "Use the Morse code MP3 generator when you need a smaller downloadable MP3 for sharing, embedding, or sending. Use this page when you want quick playback or a clean WAV export.",
  },
  {
    q: "Can I convert a whole book into Morse audio?",
    a: "Use the book to Morse code translator for long text, TXT, EPUB, or PDF input. The audio page is best for shorter messages you want to preview and tune quickly.",
  },
  {
    q: "Can I decode Morse audio back into text?",
    a: "Use the Morse code audio decoder for that job. This page creates and plays Morse audio; the decoder page analyzes a local audio file and turns recognizable Morse tones into text.",
  },
  {
    q: "Can I make a Morse code video?",
    a: "Yes, use the Morse code video generator when you need visual dots and dashes with an optional audio track. This page focuses on playable audio and WAV export.",
  },
  {
    q: "Which audio format should I use, MP3 or WAV?",
    a: "WAV is larger but keeps short Morse tones clean for editing and timing checks. MP3 is smaller and easier to share, but it is compressed.",
  },
  {
    q: "Is my text or audio uploaded to a server?",
    a: "No. Playback and WAV export happen locally in your browser. Your message is not uploaded to MorseWords servers or stored in a database. The audio source may be saved only in this browser on this device and can be cleared from site settings.",
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Audio Translator & Generator | WAV, MP3, Decoder Tools | MorseWords",
    description:
      "Translate text or Morse into playable audio, tune WPM and Farnsworth spacing, export WAV, and find Morse MP3, decoder, book, video, and listening tools.",
    path: CANONICAL_PATH,
    keywords:
      "morse code audio translator, morse code audio generator, text to morse audio, morse code to audio, morse code mp3 generator, morse code audio decoder, morse listening practice",
  });
}

export default function AudioRoute() {
  const faqMainEntity: AudioFaqQuestionSchema[] = faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${CANONICAL_URL}#webapp`,
        name: "Morse Code Audio Translator and Generator",
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        url: CANONICAL_URL,
        description:
          "Browser-based Morse code audio hub for playing messages, tuning listening settings, exporting WAV practice audio, and finding related MP3, decoder, book, video, and listening tools.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "Text to Morse audio playback",
          "Pasted Morse code audio playback",
          "Adjustable WPM and Farnsworth spacing",
          "Adjustable pitch, waveform, volume, attack, and release",
          "Local WAV export",
          "Browser-based audio generation",
          "Canonical links to Morse MP3, audio decoder, book, video, and listening practice tools",
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
        mainEntity: faqMainEntity,
      },
    ],
  };

  return (
    <main className="mw-non-home-page" style={styles.page}>
      <div style={{ ...styles.wrap, paddingTop: 16 }}>
        <MorseAudioTranslator enableQueryPrefill />
        <PostHeroBannerAd className="mw-signal-post-audio" />
        <HowItWorksAudio />
        <SectionCard
          eyebrow="Audio tools path"
          title="Choose the right Morse audio tool"
          description="Start here for playable text-to-Morse audio, then move to the specific audio, export, decoding, book, video, or listening-practice tool that matches the job."
          layout="stacked"
        >
          <SimpleGrid items={audioToolPathItems} linkedItemStyle="card" />
        </SectionCard>
        <FaqSectionGeneric title="Audio FAQ" items={faqItems} />
      </div>
      <BreadcrumbTrail
        current="Morse Code Audio Generator"
        placement="pageBottom"
      />
      <JsonLdScript jsonLd={jsonLd} />
    </main>
  );
}
