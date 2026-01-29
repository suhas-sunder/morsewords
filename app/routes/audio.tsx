import * as React from "react";
import type { Route } from "./+types/audio";

import styles from "~/client/components/home/styles";
import TranslatorSections from "~/client/components/home/TranslatorSections";
import useAudio from "~/client/components/home/useAudio";
import { morseToText, textToMorse } from "~/client/components/home/morseUtils";
import FaqSectionGeneric from "~/client/components/home/FaqSectionGeneric";
import JsonLdScript from "~/client/components/home/JsonLdScript";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Morse Code Audio Translator | Play Morse Code Sound | MorseWords",
    },
    {
      name: "description",
      content:
        "Morse code audio translator. Convert text to Morse or Morse to text, then play clean audio with adjustable speed (WPM) and tone.",
    },
    {
      name: "keywords",
      content:
        "morse code audio translator, morse code sound translator, morse code player, wpm morse, morse tone",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },
  ];
}

export default function Audio() {
  const [wpm, setWpm] = React.useState(20);
  const [freq, setFreq] = React.useState(600);
  const { playMorse, stop } = useAudio();

  const [plainA, setPlainA] = React.useState("sos help");
  const morseA = React.useMemo(() => textToMorse(plainA), [plainA]);

  const [morseB, setMorseB] = React.useState("... --- ...");
  const textB = React.useMemo(() => morseToText(morseB), [morseB]);

  function numWithin(v: string | number, d: number, min: number, max: number) {
    const n = parseFloat(String(v).replace(/[^0-9.]/g, ""));
    if (Number.isNaN(n)) return d;
    return Math.max(min, Math.min(max, n));
  }

  const baseUrl = "https://morsewords.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MorseWords Morse Code Audio Translator",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: baseUrl + "/audio",
    description:
      "Browser-based Morse translator with audio playback and adjustable WPM and tone.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const faqItems = [
    {
      q: "What input formats are accepted?",
      a: "Use dots and dashes for Morse. Separate letters with 3 spaces and words with 7 spaces, or use a slash for word breaks.",
    },
    {
      q: "What does WPM change?",
      a: "WPM controls timing. Higher WPM plays shorter dits and dahs and reduces spacing.",
    },
    {
      q: "What does tone change?",
      a: "Tone changes the audio pitch. It does not affect decoding or encoding.",
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <section className="flex flex-col sm:flex-row gap-8 mt-6 mb-8 sm:mb-2">
          <div>
            <h1 style={styles.h1}>Morse code audio translator</h1>
            <p style={styles.lead}>
              Convert text to Morse code or decode Morse to text, then play it
              as audio. Adjust speed (WPM) and tone to match your preferred
              listening setup.
            </p>
          </div>

          <div className="card" style={{ ...styles.card, ...styles.cardPad }}>
            <h2 style={{ marginTop: 0, fontSize: "1.25rem" }}>
              Audio controls
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <label style={styles.label}>Speed (WPM)</label>
                <input
                  style={styles.input}
                  inputMode="numeric"
                  value={wpm}
                  onChange={(e) => setWpm(numWithin(e.target.value, 20, 5, 60))}
                />
              </div>
              <div>
                <label style={styles.label}>Tone (Hz)</label>
                <input
                  style={styles.input}
                  inputMode="numeric"
                  value={freq}
                  onChange={(e) =>
                    setFreq(numWithin(e.target.value, 600, 200, 2000))
                  }
                />
              </div>
            </div>
            <p style={{ ...styles.note, marginTop: 8 }}>
              Playback uses standard Morse timing: dit = 1 unit, dah = 3 units,
              letter gap = 3, word gap = 7.
            </p>
          </div>
        </section>

        <TranslatorSections
          plainA={plainA}
          setPlainA={setPlainA}
          morseA={morseA}
          morseB={morseB}
          textB={textB}
          setMorseB={setMorseB}
          wpm={wpm}
          freq={freq}
          playMorse={playMorse}
          stop={stop}
        />

        <section className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#0b2447]">How it works</h2>
          <p className="mt-3 text-gray-700 leading-relaxed">
            This tool converts text to International Morse code and can also
            decode Morse back to text. For audio playback, the Morse output is
            translated into timed dits and dahs. WPM controls the base unit
            length, so increasing WPM makes each dit shorter and speeds up the
            full message. Tone controls pitch only. To decode reliably, separate
            letters with three spaces and words with seven spaces, or use a
            slash for word breaks. Unsupported characters are ignored during
            encoding.
          </p>
        </section>

        <FaqSectionGeneric title="Audio FAQ" items={faqItems} />
      </div>

      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
