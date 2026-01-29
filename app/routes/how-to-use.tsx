import * as React from "react";
import type { Route } from "./+types/how-to-use";

import styles from "~/client/components/home/styles";
import JsonLdScript from "~/client/components/home/JsonLdScript";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title:
        "How to Use MorseWords | Morse Translator, Audio, Practice, Typing",
    },
    {
      name: "description",
      content:
        "Step-by-step instructions for using the MorseWords translator, audio player, practice mode, and typing tool.",
    },
    {
      name: "keywords",
      content:
        "how to use morsewords, morse translator help, morse code tool instructions",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },
  ];
}

export default function HowToUse() {
  const baseUrl = "https://morsewords.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "How to Use MorseWords",
    url: baseUrl + "/how-to-use",
    description: "Procedural instructions for each MorseWords tool.",
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <section className="mt-6">
          <h1 style={styles.h1}>How to use MorseWords</h1>
          <p style={styles.lead}>
            This page explains how to use each tool. If you just want a quick
            conversion, start with the translator.
          </p>
        </section>

        <section className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#0b2447]">1. Translator</h2>
          <ol className="mt-3 list-decimal pl-5 text-gray-700 space-y-2">
            <li>
              Open{" "}
              <a
                className="text-[#0b2447] underline hover:no-underline"
                href="/"
              >
                /
              </a>
              .
            </li>
            <li>Type text to get Morse output, or paste Morse to decode it.</li>
            <li>
              Use 3 spaces between letters and 7 spaces between words when
              decoding.
            </li>
            <li>Copy the output using the copy buttons.</li>
          </ol>
        </section>

        <section className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#0b2447]">
            2. Audio translator
          </h2>
          <ol className="mt-3 list-decimal pl-5 text-gray-700 space-y-2">
            <li>
              Open{" "}
              <a
                className="text-[#0b2447] underline hover:no-underline"
                href="/audio"
              >
                /audio
              </a>
              .
            </li>
            <li>Set WPM and tone, then translate or paste Morse as needed.</li>
            <li>Press Play Audio to hear the current Morse string.</li>
            <li>Use Stop to end playback immediately.</li>
          </ol>
        </section>

        <section className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#0b2447]">3. Practice</h2>
          <ol className="mt-3 list-decimal pl-5 text-gray-700 space-y-2">
            <li>
              Open{" "}
              <a
                className="text-[#0b2447] underline hover:no-underline"
                href="/practice"
              >
                /practice
              </a>
              .
            </li>
            <li>Select visual prompts, audio prompts, or both.</li>
            <li>Choose a character set and type the answer for each prompt.</li>
            <li>A correct answer advances to the next prompt automatically.</li>
          </ol>
        </section>

        <section className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#0b2447]">4. Typing tool</h2>
          <ol className="mt-3 list-decimal pl-5 text-gray-700 space-y-2">
            <li>
              Open{" "}
              <a
                className="text-[#0b2447] underline hover:no-underline"
                href="/typing"
              >
                /typing
              </a>
              .
            </li>
            <li>
              Type dots and dashes. Add spacing to separate letters and words.
            </li>
            <li>Copy the decoded output when you are done.</li>
          </ol>
        </section>

        <section className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#0b2447]">5. Dictionary</h2>
          <ol className="mt-3 list-decimal pl-5 text-gray-700 space-y-2">
            <li>
              Open{" "}
              <a
                className="text-[#0b2447] underline hover:no-underline"
                href="/dictionary"
              >
                /dictionary
              </a>
              .
            </li>
            <li>
              Use the table as a quick reference for a character’s pattern.
            </li>
          </ol>
        </section>
      </div>

      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
