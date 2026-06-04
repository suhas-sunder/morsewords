import * as React from "react";
import type { Route } from "./+types/morse-code-sound-generator";

import styles from "~/client/components/shared/audioStyles";
import MorseAudioTranslator from "~/client/components/morse-code-sound-generator/MorseAudioTranslator";
import SoundGeneratorGuide from "~/client/components/morse-code-sound-generator/SoundGeneratorGuide";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = ROUTES.soundGenerator;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

const faqItems = [
  {
    q: "What does a Morse code sound generator do?",
    a: "It turns text or typed Morse into playable Morse sound so you can hear the dots, dashes, gaps, tone color, pitch, and practice rhythm.",
  },
  {
    q: "Can I turn text into Morse code sound?",
    a: "Yes. Use text mode to type a short message, then play it as Morse sound. You can also switch to Morse input and play pasted dots, dashes, spaces, and slashes.",
  },
  {
    q: "What tone should I use for Morse code?",
    a: "CW radio is the safest default for normal Morse listening. A clean tone around 600 to 700 Hz is usually comfortable, but the best pitch is the one you can hear clearly without fatigue.",
  },
  {
    q: "What is the CW radio tone preset?",
    a: "CW radio is a clean keyed sine-style tone shaped for Morse sidetone practice. It is less harsh than many synthetic beeps, which is why it works well as the default.",
  },
  {
    q: "Can I change the pitch or frequency?",
    a: "Yes. Use the pitch control for presets that support frequency changes. Pitch changes how high or low the tone sounds; it does not change Morse timing.",
  },
  {
    q: "Can I use creative sounds like bells or chirps?",
    a: "Yes. Creative presets such as soft bell, warm tone, low beacon, submarine ping, digital blip, soft click, and bird chirp are synthesized options for experiments. They are not sampled audio and are optional.",
  },
  {
    q: "Why is CW radio the default?",
    a: "CW radio keeps the Morse signal clear, simple, and familiar. Creative waveforms can be fun, but a plain CW-style tone usually makes timing and character recognition easier.",
  },
  {
    q: "Can I download the sound as MP3 or WAV?",
    a: "This page includes quick MP3 and WAV export for the current tone. Use the Morse code MP3 generator when a dedicated downloadable MP3 or WAV workflow is your main goal.",
  },
  {
    q: "Can I make long book-length Morse audio?",
    a: "Use this sound generator for short tone tests and practice signals. Use the book translator when long text should be split into manageable Morse audio or video parts.",
  },
  {
    q: "Can I decode Morse sound back into text?",
    a: "No. This page creates sound from text or typed Morse. Use the Morse code audio decoder when you already have an audio file or recording and need text.",
  },
  {
    q: "What is Farnsworth spacing?",
    a: "Farnsworth spacing keeps the character rhythm while adding extra silence between characters and words. It is useful when you want the tone speed to stay realistic but need more time to copy.",
  },
  {
    q: "Is my text uploaded to a server?",
    a: "No. The sound preview and quick audio exports are generated in your browser. Your message is not uploaded to MorseWords servers or stored in a database. The source may be saved only in this browser on this device and can be cleared from site settings.",
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Sound Generator | Tone, Beep & CW Audio | MorseWords",
    description:
      "Play Morse code sound from text or typed Morse. Shape CW radio tone, beep waveform, pitch, volume, WPM, and Farnsworth spacing in your browser.",
    path: CANONICAL_PATH,
    keywords:
      "morse code sound generator, morse code sound maker, morse code generator sound, morse code to sound, text to morse code sound, morse code tone generator, morse code beep generator, play morse code sound, morse code with sound, morse code audio generator",
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
          "Browser-based Morse code sound generator for playing and shaping beeps, CW tones, waveform presets, pitch, volume, and practice signals from text or Morse code.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "Text to Morse sound generation",
          "Morse code beep playback",
          "CW radio, sine, square, triangle, sawtooth, and sounder presets",
          "Synthesized creative tone presets",
          "Quick MP3 and WAV export for the current tone",
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
            text: "Choose CW radio or another synthesized tone preset, then adjust WPM, Farnsworth spacing, pitch, volume, attack, and release until the signal is readable.",
          },
          {
            "@type": "HowToStep",
            name: "Play or download the practice sound",
            text: "Play the generated Morse sound in the browser, loop it for drills, or use the related MP3 generator when downloadable audio is the main goal.",
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
          lead="Play Morse code sound from text or pasted Morse. Tune CW-style tone, beep waveform, pitch, volume, WPM, and Farnsworth spacing before moving to downloads, long audio, decoding, or listening drills."
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
        <div id="faq">
          <FaqSectionGeneric
            title="Morse code sound generator FAQ"
            items={faqItems}
          />
        </div>
      </div>
      <BreadcrumbTrail
        current="Morse Code Sound Generator"
        placement="pageBottom"
      />
      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
