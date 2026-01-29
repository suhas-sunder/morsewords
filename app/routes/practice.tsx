import * as React from "react";
import type { Route } from "./+types/practice";

import styles from "~/client/components/home/styles";
import useAudio from "~/client/components/home/useAudio";
import MorsePractice from "~/client/components/home/MorseQuiz";
import JsonLdScript from "~/client/components/home/JsonLdScript";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Morse Code Practice | Visual and Audio Prompts | MorseWords" },
    {
      name: "description",
      content:
        "Practice Morse code with one prompt at a time. Choose visual prompts, audio prompts, or both and adjust WPM and tone for listening.",
    },
    {
      name: "keywords",
      content:
        "morse code practice, learn morse code online, morse listening practice, cw practice",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },
  ];
}

export default function Practice() {
  const [wpm, setWpm] = React.useState(20);
  const [freq, setFreq] = React.useState(600);
  const { playMorse, stop } = useAudio();

  function numWithin(v: string | number, d: number, min: number, max: number) {
    const n = parseFloat(String(v).replace(/[^0-9.]/g, ""));
    if (Number.isNaN(n)) return d;
    return Math.max(min, Math.min(max, n));
  }

  const baseUrl = "https://morsewords.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Morse Code Practice",
    url: baseUrl + "/practice",
    description:
      "Practice Morse code with configurable character sets and optional audio prompts.",
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <section className="mt-6">
          <h1 style={styles.h1}>Morse code practice</h1>
          <p style={styles.lead}>
            One prompt at a time. Pick the character set and use visual prompts,
            audio prompts, or both.
          </p>

          <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#0b2447]">
              Audio settings
            </h2>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
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
          </div>

          <section className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#0b2447]">How it works</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              Practice mode shows a single Morse prompt and checks your typed
              answer. You can choose whether prompts are visual, audio, or both.
              The character set changes which items can appear. If audio is
              enabled, WPM controls timing and tone controls pitch. Each correct
              answer advances to a new prompt automatically.
            </p>
          </section>

          <MorsePractice
            wpm={wpm}
            freq={freq}
            playMorse={playMorse}
            stop={stop}
          />
        </section>
      </div>

      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
