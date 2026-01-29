import * as React from "react";
import type { Route } from "./+types/dictionary";

import styles from "~/client/components/home/styles";
import MorseLookupTable from "~/client/components/home/MorseLookupTable";
import JsonLdScript from "~/client/components/home/JsonLdScript";
import MorsePhraseLookupTable from "~/client/components/home/MorsePhraseLookupTable";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title:
        "Morse Code Dictionary | Letters, Numbers, Punctuation | MorseWords",
    },
    {
      name: "description",
      content:
        "Morse code dictionary table for letters, numbers, and common punctuation. Copy a character’s dot and dash pattern quickly.",
    },
    {
      name: "keywords",
      content:
        "morse dictionary, morse code chart, morse code table, morse alphabet",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },
  ];
}

export default function Dictionary() {
  const baseUrl = "https://morsewords.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Morse Code Dictionary",
    url: baseUrl + "/dictionary",
    description: "Lookup table for Morse code characters.",
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <section className="mt-6">
          <h1 style={styles.h1}>Morse code dictionary</h1>
          <p style={styles.lead}>
            A compact reference for common characters. For translation, use the
            main translator.
          </p>
        </section>

        <section className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#0b2447]">How it works</h2>
          <p className="mt-3 text-gray-700 leading-relaxed">
            This page lists characters and their International Morse code
            patterns. Use it to look up a single character quickly or to verify
            punctuation. It is a reference table only and does not provide
            lessons or practice.
          </p>
        </section>

        <MorseLookupTable />
        <MorsePhraseLookupTable />
      </div>

      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
