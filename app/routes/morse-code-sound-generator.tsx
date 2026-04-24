import * as React from "react";
import type { Route } from "./+types/morse-code-sound-generator";

import styles from "~/client/components/morse-code-sound-generator/styles";
import MorseAudioTranslator from "~/client/components/morse-code-sound-generator/MorseAudioTranslator";
import SoundGeneratorGuide from "~/client/components/morse-code-sound-generator/SoundGeneratorGuide";
import FaqSectionGeneric from "~/client/components/morse-code-sound-generator/FaqSectionGeneric";
import JsonLdScript from "~/client/components/morse-code-sound-generator/JsonLdScript";

const SITE_URL = "https://morsewords.com";
const CANONICAL_PATH = "/morse-code-sound-generator";
const CANONICAL_URL = `${SITE_URL}${CANONICAL_PATH}`;

const faqItems = [
  {
    q: "What does this Morse code sound generator do?",
    a: "It turns typed text or pasted Morse code into playable beep audio in your browser. You can control WPM, Farnsworth spacing, pitch, waveform, volume, repeat playback, flash mode, and audio export.",
  },
  {
    q: "Can I use this as a Morse code audio generator?",
    a: "Yes. The page is designed for audio output first. The Morse preview helps you verify the dot-dash pattern, but the main purpose is to generate sound that you can play, tune, loop, and download.",
  },
  {
    q: "Can I download MP3 audio from this Morse code sound maker?",
    a: "Yes. The page includes MP3 export for smaller shareable files and WAV export for lossless editing. MP3 encoding runs in the browser when you choose Download MP3.",
  },
  {
    q: "When should I export WAV instead of MP3?",
    a: "Use WAV when you want a lossless source file for editing, archiving, or later conversion. Use MP3 when you want a smaller file for sharing, embedding, videos, slides, or quick practice clips.",
  },
  {
    q: "What is a good pitch for Morse code beeps?",
    a: "A clean starting point is about 600 to 700 Hz with a sine or CW tone. Lower pitches sound softer, while higher pitches cut through more clearly but can become tiring over long practice sessions.",
  },
  {
    q: "What is the difference between a Morse code beep generator and a tone generator?",
    a: "A beep generator usually means short on-off sounds for dots and dashes. A tone generator focuses on frequency and waveform. This page does both: it creates Morse timing and lets you tune the tone.",
  },
  {
    q: "Does this Morse code generator upload my text or audio?",
    a: "No. Playback and audio rendering happen in your browser. Your text, Morse input, and generated audio are not uploaded by this tool.",
  },
  {
    q: "Can I paste Morse code directly instead of typing text?",
    a: "Yes. Switch to Morse input and paste dots, dashes, spaces, or slash-separated word gaps. The generator will play the pasted Morse pattern as audio.",
  },
  {
    q: "What settings should beginners use?",
    a: "Start with 12 to 18 WPM character speed, slower Farnsworth spacing, a sine or CW waveform, and a pitch around 650 Hz. Increase speed only after the rhythm is easy to follow.",
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Morse Code Sound Generator | MP3, WAV, Beep & Tone Maker",
    },
    {
      name: "description",
      content:
        "Use this Morse code sound generator to make beep and tone audio from text or Morse. Adjust WPM, pitch, waveform, and spacing, then export MP3 or WAV.",
    },
    {
      name: "keywords",
      content:
        "morse code sound generator, morse code audio generator, morse code sound maker, morse code generator audio, morse code mp3 generator, morse code beep generator, morse code tone generator",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },

    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "MorseWords" },
    {
      property: "og:title",
      content: "Morse Code Sound Generator | MP3, WAV, Beep & Tone Maker",
    },
    {
      property: "og:description",
      content:
        "Create Morse code beeps and tones from text or Morse, tune the sound, and export MP3 or WAV audio in your browser.",
    },
    { property: "og:url", content: CANONICAL_URL },

    { name: "twitter:card", content: "summary" },
    {
      name: "twitter:title",
      content: "Morse Code Sound Generator",
    },
    {
      name: "twitter:description",
      content:
        "Generate Morse code beeps, tones, MP3, and WAV audio from text or Morse code.",
    },
  ];
}

export default function MorseCodeSoundGeneratorRoute() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${CANONICAL_URL}#webapp`,
        name: "Morse Code Sound Generator",
        alternateName: [
          "Morse Code Audio Generator",
          "Morse Code Sound Maker",
          "Morse Code Generator Audio",
          "Morse Code MP3 Generator",
          "Morse Code Beep Generator",
          "Morse Code Tone Generator",
        ],
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        url: CANONICAL_URL,
        description:
          "Browser-based Morse code sound generator for creating beeps, tones, and downloadable MP3 or WAV audio from text or Morse code.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "Text to Morse sound generation",
          "Morse code to audio playback",
          "Morse code MP3 export",
          "Morse code WAV export",
          "Adjustable WPM and Farnsworth spacing",
          "Adjustable pitch, waveform, volume, attack, and release",
          "Browser-based audio generation",
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${CANONICAL_URL}#howto`,
        name: "How to generate Morse code sound",
        description:
          "Create playable Morse code beep audio from text or pasted Morse code and download it as MP3 or WAV.",
        step: [
          {
            "@type": "HowToStep",
            name: "Enter text or Morse code",
            text: "Type a plain-text message or switch to Morse input and paste dots and dashes.",
          },
          {
            "@type": "HowToStep",
            name: "Tune the sound",
            text: "Adjust WPM, Farnsworth spacing, pitch, waveform, volume, attack, and release.",
          },
          {
            "@type": "HowToStep",
            name: "Play or export audio",
            text: "Play the generated Morse sound in the browser, loop it, or export MP3 or WAV audio.",
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${CANONICAL_URL}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Morse Code Sound Generator", item: CANONICAL_URL },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${CANONICAL_URL}#faq`,
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <MorseAudioTranslator
          pageIntent="sound"
          introEyebrow="Morse code sound maker"
          heading="Morse Code Sound Generator"
          lead="Make Morse code sound from text or pasted Morse code. Generate beeps, tune the tone, adjust WPM and Farnsworth spacing, then export MP3 or WAV audio from your browser."
          defaultText="CQ CQ DE MORSEWORDS TEST 123"
          defaultMorse="-.-. --.-   -.-. --.-   -.. .   -- --- .-. ... . .-- --- .-. -.. ..."
          defaultFileName="morse-code-sound"
          storagePrefix="mw_sound_generator"
          textModeLabel="Text to Morse sound"
          morseModeLabel="Morse to beep audio"
          textInputLabel="Message to turn into Morse sound"
          morseInputLabel="Morse code to play as sound"
          primaryExampleText="CQ CQ DE MORSEWORDS TEST 123"
          secondaryExampleText="SEND HELP SLOWLY"
          morseExample="... --- ...   .... . .-.. .--."
          exportFormats={["wav", "mp3"]}
        />
        <SoundGeneratorGuide />
        <FaqSectionGeneric title="Morse code sound generator FAQ" items={faqItems} />
      </div>
      <nav
        aria-label="Breadcrumb"
        className="pb-4 text-sm text-gray-600 max-w-5xl mx-auto"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <a href="/" className="underline hover:no-underline cursor-pointer">
              Home
            </a>
          </li>
          <li>/</li>
          <li className="font-semibold text-gray-900">Morse Code Sound Generator</li>
        </ol>
      </nav>
      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
