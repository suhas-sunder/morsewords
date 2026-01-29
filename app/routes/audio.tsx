import * as React from "react";
import type { Route } from "./+types/audio";

import styles from "~/client/components/audio/styles";
import MorseAudioTranslator from "~/client/components/audio/MorseAudioTranslator";
import HowItWorksAudio from "~/client/components/audio/HowItWorksAudio";
import FaqSectionGeneric from "~/client/components/audio/FaqSectionGeneric";
import JsonLdScript from "~/client/components/audio/JsonLdScript";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Morse Code Audio Translator | Generate Morse Sound and Export WAV | MorseWords",
    },
    {
      name: "description",
      content:
        "Generate Morse code audio from text or Morse. Tune WPM, Farnsworth spacing, pitch, and waveform, then export a WAV file instantly in your browser.",
    },
    {
      name: "keywords",
      content:
        "morse code audio, morse code sound, morse wav export, morse audio generator, farnsworth wpm, morse practice tone",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },
  ];
}

export default function AudioRoute() {
  const baseUrl = "https://morsewords.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MorseWords Morse Code Audio Translator",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: baseUrl + "/audio",
    description:
      "Browser-based Morse audio generator with adjustable timing and WAV export.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
  ];

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <MorseAudioTranslator />
        <HowItWorksAudio />
        <FaqSectionGeneric title="Audio FAQ" items={faqItems} />
      </div>

      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
