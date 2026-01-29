import * as React from "react";
import type { Route } from "./+types/practice";

import styles from "../client/components/practice/styles";
import PracticePage from "../client/components/practice/PracticePage";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title:
        "Morse Code Practice (Quiz) | Flashcards, Drills, and Instant Feedback | MorseWords",
    },
    {
      name: "description",
      content:
        "Practice Morse code with prompt-based drills. One prompt at a time with instant correctness feedback. Train letters, numbers, and common signals.",
    },
    {
      name: "keywords",
      content:
        "morse code practice, morse code quiz, morse code drills, morse flashcards, learn morse code, morse training",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },
  ];
}

export default function PracticeRoute() {
  const baseUrl = "https://morsewords.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MorseWords Morse Code Practice (Quiz)",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    url: baseUrl + "/practice",
    description:
      "Prompt-based Morse code drills with instant correctness feedback.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <PracticePage jsonLd={jsonLd} />
      </div>
    </div>
  );
}
