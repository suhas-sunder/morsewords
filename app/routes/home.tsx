import * as React from "react";
import type { Route } from "./+types/home";

import styles from "~/client/components/home/styles";
import TranslatorSectionsBasic from "~/client/components/home/TranslatorSectionsBasic";
import FaqSectionGeneric from "~/client/components/home/FaqSectionGeneric";
import JsonLdScript from "~/client/components/home/JsonLdScript";
import { morseToText, textToMorse } from "~/client/components/home/morseUtils";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title:
        "Morse Code Translator | Text to Morse and Morse to Text | MorseWords",
    },
    {
      name: "description",
      content:
        "Free Morse code translator. Convert text to Morse code or decode Morse to text instantly. Supports letters, numbers, and common punctuation.",
    },
    {
      name: "keywords",
      content:
        "morse code translator, text to morse, morse to text, morse decoder, morse encoder",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },
  ];
}

export default function Home() {
  // Translator state (conversion logic stays in morseUtils)
  const [plainA, setPlainA] = React.useState("sos help");
  const morseA = React.useMemo(() => textToMorse(plainA), [plainA]);

  const [morseB, setMorseB] = React.useState("... --- ...");
  const textB = React.useMemo(() => morseToText(morseB), [morseB]);

  const baseUrl = "https://morsewords.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MorseWords Morse Code Translator",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: baseUrl + "/",
    description:
      "Browser-based Morse code translator for converting between text and Morse code.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const faqItems = [
    {
      q: "What does this translator support?",
      a: "It supports A–Z, 0–9, and common punctuation (like . , ? ! / - @). When encoding, unsupported characters are ignored and listed under the input so you can spot what was skipped.",
    },
    {
      q: "How do I paste Morse code to decode it?",
      a: "Paste dots and dashes into the Morse input. For best results, separate letters with 3 spaces and words with 7 spaces. A single space between letters also works, and new lines are treated like word breaks.",
    },
    {
      q: "Can I use / as a word separator?",
      a: "Yes. A slash is treated as a word separator when decoding.",
    },
    {
      q: "Why is spacing important for decoding?",
      a: "The decoder needs separators to know where one letter ends and the next begins. This tool treats 1–6 spaces as a letter gap and 7+ spaces (or / or a new line) as a word gap.",
    },
    {
      q: "What if my Morse has an unknown sequence?",
      a: "Unknown Morse sequences are shown as “?” in the decoded output so mistakes don’t disappear silently.",
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <section className="mt-6">
          <h1 style={styles.h1}>Morse code translator</h1>
          <p>
            All-in-one Morse code translator & decoder: encode text into Morse, or decode Morse back to
            readable text.
          </p>
        </section>

        <TranslatorSectionsBasic
          plainA={plainA}
          setPlainA={setPlainA}
          morseA={morseA}
          morseB={morseB}
          textB={textB}
          setMorseB={setMorseB}
        />

        <section className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-neutral-900">How it works</h2>
          <p style={styles.lead}>
            This page is a two-way Morse translator. It does one job: convert
            plain text to International Morse code, and convert Morse back to
            readable text. The tool runs entirely in your browser, and the
            output updates as you type.
          </p>

          <div className="mt-4 text-gray-700 leading-relaxed space-y-4">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Encoding rules (Text → Morse)</h3>
              <p>
                Your text is normalized and uppercased, then each supported
                character is looked up in an International Morse map. Letters
                are separated by <strong>3 spaces</strong>, and words are
                separated by <strong>7 spaces</strong>. Any extra whitespace in
                your input is treated as a word break.
              </p>
              <p>
                If you include characters that are not in the map (for example,
                emojis or uncommon symbols), they are <strong>ignored</strong>
                in the Morse output. The UI lists what was skipped so you can
                decide whether to remove it or replace it.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-neutral-900">Decoding rules (Morse → Text)</h3>
              <p>
                When decoding, the tool accepts dots and dashes and uses
                spacing to decide where letters and words start and stop. It
                treats <strong>1–6 spaces</strong> as a letter gap and
                <strong>7+ spaces</strong> as a word gap. You can also use a
                <strong>slash (/)</strong> as a word separator.
              </p>
              <p>
                Many sources use lookalike characters. The decoder normalizes
                common variants like “·” for dot and “–”/“—”/“−” for dash.
                New lines are treated as word breaks, which helps when you
                paste formatted Morse.
              </p>
              <p>
                If the input contains an invalid character (anything other than
                dot, dash, space, slash, or a recognized variant), the tool
                flags it under the input. If a Morse sequence is not recognized
                (for example, a typo like <code>...-.-</code> that is not in the
                map), it decodes to <strong>“?”</strong> so the error stays
                visible.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-neutral-900">Input formatting guide</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Letter separator:</strong> 3 spaces recommended. If
                  you only have single spaces, decoding still works.
                </li>
                <li>
                  <strong>Word separator:</strong> 7 spaces, a slash, or a new
                  line.
                </li>
                <li>
                  <strong>Do not rely on “pretty” punctuation:</strong> If you
                  paste text with curly quotes or full-width characters, the
                  encoder normalizes many of them, but unsupported symbols will
                  be skipped.
                </li>
                <li>
                  <strong>Long inputs:</strong> Very large pastes will still
                  work, but sharing an image snapshot truncates the text to fit
                  the image.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-neutral-900">Examples</h3>
              <p>
                <strong>Text → Morse</strong>: <code>HELLO WORLD</code> becomes
                <code>.... . .-.. .-.. ---</code> (3 spaces between letters)
                and a 7-space gap between words.
              </p>
              <p>
                <strong>Morse → Text</strong>: <code>... --- ...</code> becomes
                <code>SOS</code>. If you paste <code>... / --- / ...</code>, it
                becomes <code>S O S</code> because “/” is treated as a word
                break.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-neutral-900">Supported characters</h3>
              <p>
                This translator focuses on the most common International Morse
                set used in everyday tools: A–Z, 0–9, and a core set of
                punctuation. If you need a specialty or extended alphabet, this
                route intentionally does not guess.
              </p>
              <p>
                Supported punctuation includes: <code>. , ? / ' ! - @ : ; = +
                " ( ) &amp; _</code>.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-neutral-900">Normalization and assumptions</h3>
              <p>
                This tool aims to be strict and predictable so you can copy the
                output into other Morse utilities.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>International Morse mapping:</strong> Each supported
                  character maps to exactly one Morse sequence. There is no
                  auto-correction, and there are no alternate encodings.
                </li>
                <li>
                  <strong>Whitespace handling when encoding:</strong> Any run
                  of whitespace in your text input is treated as a word break.
                  The output always uses 3 spaces between letters and 7 spaces
                  between words.
                </li>
                <li>
                  <strong>Whitespace handling when decoding:</strong> The
                  decoder interprets spacing rather than trying to infer letter
                  boundaries from timing. Tabs and multiple spaces are treated
                  as whitespace.
                </li>
                <li>
                  <strong>Lookalike symbols:</strong> “·”/“•”/“∙” are treated as
                  dots, and “–”/“—”/“−” are treated as dashes. Everything else is
                  considered literal input and may be flagged as invalid.
                </li>
                <li>
                  <strong>Unknown Morse sequences:</strong> If a Morse chunk
                  does not match the map, it decodes to “?” instead of
                  disappearing.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-neutral-900">Troubleshooting</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Everything runs together:</strong> Add separators.
                  The safest format is 3 spaces between letters and 7 spaces
                  between words.
                </li>
                <li>
                  <strong>You get question marks:</strong> A “?” means at least
                  one Morse chunk was not recognized. Check for missing or extra
                  dots/dashes, or accidental characters like commas and periods
                  copied from a sentence.
                </li>
                <li>
                  <strong>You pasted from a PDF or formatted page:</strong>
                  Replace unusual dashes with a normal hyphen-minus, or just
                  paste directly. The decoder already normalizes the most
                  common variants.
                </li>
                <li>
                  <strong>Unsupported characters were skipped when encoding:</strong>
                  If you see an “Unsupported” warning under the text input,
                  remove those characters or replace them with supported
                  punctuation.
                </li>
              </ul>
              <p>
                If you need to preserve exact spacing or formatting (for
                example, keeping multiple spaces inside a single word), this
                translator is not designed for that. It favors predictable
                normalization over layout fidelity.
              </p>
            </div>
          </div>
        </section>

        <FaqSectionGeneric title="Translator FAQ" items={faqItems} />
      </div>

      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
