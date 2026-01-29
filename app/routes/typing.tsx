import * as React from "react";
import type { Route } from "./+types/typing";

import styles from "~/client/components/home/styles";
import FaqSectionGeneric from "~/client/components/home/FaqSectionGeneric";
import JsonLdScript from "~/client/components/home/JsonLdScript";
import { morseToText } from "~/client/components/home/morseUtils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Morse Code Typing Tool | Type Dots and Dashes | MorseWords" },
    {
      name: "description",
      content:
        "Type Morse code using dots and dashes and see decoded text in real time. Includes on-screen buttons for mobile and copy output.",
    },
    {
      name: "keywords",
      content:
        "morse code typing tool, morse code typer online, type morse code, morse to text",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },
  ];
}

export default function Typing() {
  const [morse, setMorse] = React.useState("");
  const text = React.useMemo(() => morseToText(morse), [morse]);
  const [copied, setCopied] = React.useState(false);

  const append = (s: string) => setMorse((v) => v + s);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const faqItems = [
    {
      q: "How do I separate letters and words?",
      a: "Use 3 spaces between letters and 7 spaces between words. A slash can also be used as a word separator.",
    },
    {
      q: "Why does decoding look wrong?",
      a: "Most decoding problems come from missing separators. Add 3 spaces between letters and 7 spaces between words.",
    },
  ];

  const baseUrl = "https://morsewords.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Morse Code Typing Tool",
    url: baseUrl + "/typing",
    description: "Type dots and dashes and decode Morse to text in real time.",
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <section className="mt-6">
          <h1 style={styles.h1}>Morse code typing tool</h1>
          <p style={styles.lead}>
            Enter dots and dashes and the decoded text updates immediately. Use
            the buttons on mobile or your keyboard for fast input.
          </p>
        </section>

        <section className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold">Morse input</label>
              <textarea
                className="w-full border rounded-md p-3 font-mono h-56 focus:ring-2 focus:ring-[#0b2447]"
                value={morse}
                onChange={(e) => setMorse(e.target.value)}
                placeholder="Type . and - here"
                spellCheck={false}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => append(".")}
                  className="px-4 py-2 rounded-md cursor-pointer font-semibold bg-gray-200 hover:bg-gray-300 active:scale-95 transition"
                >
                  .
                </button>
                <button
                  onClick={() => append("-")}
                  className="px-4 py-2 rounded-md cursor-pointer font-semibold bg-gray-200 hover:bg-gray-300 active:scale-95 transition"
                >
                  -
                </button>
                <button
                  onClick={() => append(" ")}
                  className="px-4 py-2 rounded-md cursor-pointer font-semibold bg-gray-200 hover:bg-gray-300 active:scale-95 transition"
                >
                  Space
                </button>
                <button
                  onClick={() => append("/")}
                  className="px-4 py-2 rounded-md cursor-pointer font-semibold bg-gray-200 hover:bg-gray-300 active:scale-95 transition"
                >
                  /
                </button>
                <button
                  onClick={() => setMorse("")}
                  className="px-4 py-2 rounded-md cursor-pointer font-semibold bg-red-600 text-white hover:bg-red-700 active:scale-95 transition"
                >
                  Clear
                </button>
              </div>

              <p className="mt-3 text-sm text-gray-600">
                Tip: 3 spaces separate letters, 7 spaces separate words.
              </p>
            </div>

            <div>
              <label className="font-semibold">Decoded text</label>
              <textarea
                className="w-full border rounded-md p-3 font-mono h-56 bg-gray-50"
                value={text}
                readOnly
                placeholder="Decoded text appears here"
              />
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={copyText}
                  disabled={!text}
                  className={`px-4 py-2 rounded-md cursor-pointer font-semibold text-white active:scale-95 transition ${
                    text
                      ? "bg-[#0b2447] hover:bg-[#09203d]"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Copy output
                </button>
                {copied && (
                  <span className="text-green-700 font-semibold">Copied</span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#0b2447]">How it works</h2>
          <p className="mt-3 text-gray-700 leading-relaxed">
            The typing tool decodes Morse as you enter it. Type dots and dashes,
            then use spacing to mark boundaries. Three spaces indicate the end
            of a letter and seven spaces indicate the end of a word. A slash can
            also represent a word break. Use Clear to reset input and Copy
            output to move the decoded text into another app.
          </p>
        </section>

        <FaqSectionGeneric title="Typing FAQ" items={faqItems} />
      </div>

      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
