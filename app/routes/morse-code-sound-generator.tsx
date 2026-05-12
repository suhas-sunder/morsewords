import * as React from "react";
import type { Route } from "./+types/morse-code-sound-generator";

import styles from "~/client/components/shared/audioStyles";
import MorseAudioTranslator from "~/client/components/morse-code-sound-generator/MorseAudioTranslator";
import SoundGeneratorGuide from "~/client/components/morse-code-sound-generator/SoundGeneratorGuide";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-sound-generator";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

const faqItems = [
  {
    q: "What tone should I use for Morse practice?",
    a: "A sine or CW radio tone around 600 to 700 Hz is a clean starting point. Raise or lower the pitch for comfort, but keep the tone simple until the rhythm is easy to recognize.",
  },
  {
    q: "Is pitch the same as speed?",
    a: "No. Pitch controls how high or low the beep sounds. Speed controls the duration of dits, dahs, and spaces. If the Morse feels rushed, change WPM or Farnsworth spacing, not pitch.",
  },
  {
    q: "What waveform should I choose?",
    a: "Use sine or CW radio for normal listening practice, square for a sharper electronic beep, triangle for a softer tone, and sounder when you want a click-like telegraph feel.",
  },
  {
    q: "Why does my Morse sound too fast or too cramped?",
    a: "The character speed may be too high, or the Farnsworth spacing may be too low. Keep the tone settings steady, then slow the spacing between letters and words until the signal is readable.",
  },
  {
    q: "Is this page different from the audio generator?",
    a: "Yes. This page is for shaping the beep, tone, waveform, and downloadable sound. Use the audio generator when your main goal is to turn a full message into playable or saved WAV audio.",
  },
  {
    q: "Can I download the sound as MP3 or WAV?",
    a: "Yes. The sound generator supports WAV for lossless editing and MP3 for smaller practice clips. Both exports are generated in the browser.",
  },
  {
    q: "Can I paste Morse code directly instead of typing text?",
    a: "Yes. Switch to Morse input and paste dots, dashes, spaces, or slash-separated word gaps. The generator plays that pattern as a tone signal.",
  },
  {
    q: "Does this tool upload my message or generated sound?",
    a: "No. Playback, WAV rendering, and MP3 encoding happen in your browser.",
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Sound Generator | Create Beeps and Practice Tones | MorseWords",
    description:
      "Create Morse code beep sounds for practice. Adjust tone, speed, pitch, waveform, and signal settings while keeping the Morse pattern readable.",
    path: CANONICAL_PATH,
    keywords:
      "morse code sound generator, morse code beep generator, morse code tone generator, morse signal generator, morse practice tone, morse code mp3",
  });
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
          "Morse Code Sound Maker",
          "Morse Code Beep Generator",
          "Morse Code Tone Generator",
          "Morse Signal Generator",
        ],
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        url: CANONICAL_URL,
        description:
          "Browser-based Morse code sound generator for shaping beeps, tones, waveform, pitch, and practice signals from text or Morse code.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "Text to Morse sound generation",
          "Morse code beep playback",
          "Morse code tone and waveform controls",
          "MP3 and WAV export",
          "Adjustable WPM and Farnsworth spacing",
          "Adjustable pitch, waveform, volume, attack, and release",
          "Browser-based audio generation",
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${CANONICAL_URL}#howto`,
        name: "How to create a Morse code practice tone",
        description:
          "Create a playable Morse code beep or tone signal from text or pasted Morse code and tune it for practice.",
        step: [
          {
            "@type": "HowToStep",
            name: "Enter text or Morse code",
            text: "Type a short practice message or switch to Morse input and paste dots and dashes.",
          },
          {
            "@type": "HowToStep",
            name: "Shape the tone",
            text: "Adjust WPM, Farnsworth spacing, pitch, waveform, volume, attack, and release until the signal is readable.",
          },
          {
            "@type": "HowToStep",
            name: "Play or download the practice sound",
            text: "Play the generated Morse sound in the browser, loop it for drills, or download MP3 or WAV audio.",
          },
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
            name: "Morse Code Sound Generator",
            item: CANONICAL_URL,
          },
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
    <div className="mw-non-home-page" style={styles.page}>
      <div style={styles.wrap}>
        <MorseAudioTranslator
          pageIntent="sound"
          introEyebrow="Morse code sound maker"
          heading="Morse Code Sound Generator"
          lead="Create Morse beep and tone signals from text or pasted Morse code. Tune the sound character, adjust timing, then play or download the practice signal."
          defaultText="CQ CQ DE MORSEWORDS TEST 123"
          defaultMorse="-.-. --.-   -.-. --.-   -.. .   -- --- .-. ... . .-- --- .-. -.. ..."
          defaultFileName="morse-code-sound"
          storagePrefix="mw_sound_generator"
          textModeLabel="Text to Morse sound"
          morseModeLabel="Morse to beep tone"
          textInputLabel="Message to turn into a Morse tone"
          morseInputLabel="Morse code to play as a tone"
          exportFormats={["wav", "mp3"]}
        />
        <SoundGeneratorGuide />
        <FaqSectionGeneric
          title="Morse code sound generator FAQ"
          items={faqItems}
        />
      </div>
      <BreadcrumbTrail
        current="Morse Code Sound Generator"
        placement="pageBottom"
      />
      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
