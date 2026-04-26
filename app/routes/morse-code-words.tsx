import * as React from "react";
import type { Route } from "./+types/morse-code-words";

import FaqSectionGeneric from "~/client/components/morse-code-words/FaqSectionGeneric";
import JsonLdScript from "~/client/components/morse-code-words/JsonLdScript";
import MorsePhraseLookupTable from "~/client/components/morse-code-words/MorsePhraseLookupTable";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Free Morse Code Words and Phrases",
    },
    {
      name: "description",
      content:
        "Browse common words and phrases in Morse code, including greetings, short messages, prosigns, Q-codes, and CW abbreviations for practice or quick lookup.",
    },
    {
      name: "keywords",
      content:
        "morse code words, morse words, words in morse code, common morse code words, morse code phrases, prosigns, q codes, morse code abbreviations",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },
    {
      rel: "canonical",
      href: "https://www.morsewords.com/morse-code-words",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:site_name",
      content: "MorseWords",
    },
    {
      property: "og:url",
      content: "https://www.morsewords.com/morse-code-words",
    },
    {
      property: "og:title",
      content: "Free Morse Code Words and Phrases",
    },
    {
      property: "og:description",
      content:
        "Browse common words and phrases in Morse code, including greetings, short messages, prosigns, Q-codes, and CW abbreviations.",
    },
    {
      name: "twitter:card",
      content: "summary",
    },
    {
      name: "twitter:title",
      content: "Free Morse Code Words and Phrases",
    },
    {
      name: "twitter:description",
      content:
        "Browse common words and phrases in Morse code for practice, puzzles, and quick lookup.",
    },
  ];
}

function CardSection(props: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={props.id}
      className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="p-4">
        <h2 className="m-0 text-sky-800 font-bold text-xl leading-tight">
          {props.title}
        </h2>
        <div className="mt-3">{props.children}</div>
      </div>
    </section>
  );
}

export default function MorseCodeWords() {
  const baseUrl = "https://morsewords.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Morse Code Words",
    url: baseUrl + "/morse-code-words",
    description:
      "Copy-ready Morse code words, phrases, prosigns, Q-codes, and CW abbreviations in International Morse, with links to encoder/decoder and practice tools.",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: baseUrl },
    about: [
      { "@type": "Thing", name: "International Morse code" },
      { "@type": "Thing", name: "Prosigns" },
      { "@type": "Thing", name: "Q-codes" },
    ],
  };

  const faqItems = [
    {
      q: "What are “Morse code words”?",
      a: "A Morse code word is a normal word spelled letter by letter using International Morse code. There is no separate word vocabulary in Morse. It is a character encoding system that uses dots and dashes for each letter, number, and some punctuation.",
    },
    {
      q: "How do you separate letters and words in Morse code text?",
      a: "When written as dots and dashes, letters are typically separated with a single space. Words use a larger gap. Many people use a slash ( / ) as a clear word separator when copying and pasting into puzzles, worksheets, or chat.",
    },
    {
      q: "Why does Morse decode incorrectly sometimes?",
      a: "Most decoding errors come from spacing and separators. If the input mixes multiple spaces, slashes, or inconsistent gaps, a decoder may interpret the boundaries differently. Normalize your spacing, or use the word-separator guidance page before decoding.",
    },
    {
      q: "Are prosigns and Q-codes real Morse “words”?",
      a: "They are not words in the language sense, but they are real-world shorthand used by operators. Prosigns are procedural signals (like end of message). Q-codes are standardized abbreviations used in radio communication.",
    },
    {
      q: "How should beginners practice Morse words?",
      a: "Start with short, common words and repeat them. Use Audio to hear the rhythm, then use Typing or Practice to copy what you hear. Consistent accuracy beats speed early on.",
    },
  ];

  const btnBase =
    "cursor-pointer inline-flex items-center justify-center rounded-xl px-4 py-2 font-extrabold transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 whitespace-nowrap";

  const btnPrimary =
    btnBase +
    " border border-[#0b2447] bg-[#0b2447] text-white shadow-sm hover:brightness-110";

  const btnSecondary =
    btnBase +
    " border border-[#0b2447] bg-white text-sky-800 shadow-sm hover:bg-slate-50";

  const btnGhost =
    btnBase +
    " border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50";

  const pClass = "my-3 text-slate-700 leading-relaxed";
  const linkClass =
    "font-extrabold text-sky-800 underline underline-offset-4 hover:opacity-90 cursor-pointer";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <section className="pt-3 pb-3">
          <h1 className="text-sky-800 font-bold text-3xl sm:text-4xl leading-tight m-0">
            Morse Code Words
          </h1>

          <p className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-slate-600 text-base sm:text-lg leading-relaxed">
            A practical, copy-ready collection of words, phrases, prosigns, and
            radio abbreviations in International Morse code. Use the converter
            pages for conversion (text → Morse and Morse → text), then use this
            page for the thing people actually mean by “morsewords”:
            ready-to-copy words, phrases, and real operator shorthand, plus the
            spacing rules that keep it decodable.
          </p>
        </section>

        <MorsePhraseLookupTable />

        <CardSection title="Common Morse code words, plus real-world shorthand">
          <p className={pClass}>
            Common words are the best place to start because they show up
            everywhere, and they train pattern recognition. Once you can hear
            and recognize a few words without spelling every letter in your
            head, you are moving from slow decoding to real reading. After the
            basics, you will run into operator shorthand: prosigns, Q-codes, and
            abbreviations used in CW (continuous wave) communication. These are
            not “words” in a language sense, but they are extremely common in
            practice material and real radio exchanges.
          </p>

          <p className={pClass}>
            Below you will find a copy-ready lookup table that mixes everyday
            words (HELLO, THANK YOU, PLEASE) with practical items like SOS, AR,
            SK, QSL, QRZ, and “73.” That mix reflects how people actually learn.
            Beginners start with words, then quickly run into standardized
            shorthand. Keeping them together on one page makes the site feel
            cohesive and reduces pogo-sticking between different resources.
          </p>

          <p className={pClass}>
            If you want to go deeper into learning, use{" "}
            <a href="/how-to-use" className={linkClass}>
              How to use
            </a>{" "}
            for the fundamentals, then switch to{" "}
            <a href="/practice" className={linkClass}>
              Practice
            </a>{" "}
            and{" "}
            <a href="/typing" className={linkClass}>
              Typing
            </a>{" "}
            to build speed. If you learn best by ear,{" "}
            <a href="/audio" className={linkClass}>
              Audio
            </a>{" "}
            turns any text or Morse into something you can listen to and copy.
          </p>
        </CardSection>

        <CardSection title="Why people search for “morse words”">
          <p className={pClass}>
            Most people are not looking for a full alphabet chart when they type{" "}
            <strong>morse code words</strong> into search. They want
            ready-to-use output: words like HELLO, PLEASE, THANK YOU, OK, HELP,
            and SOS in dots and dashes that they can copy into a message, a
            quiz, a worksheet, or a practice session. This page is built for
            that exact intent.
          </p>

          <p className={pClass}>
            If you want pure conversion, the dedicated routes are still the
            fastest path. Use{" "}
            <a href="/morse-code-encoder" className={linkClass}>
              Morse code encoder
            </a>{" "}
            for text to Morse, and{" "}
            <a href="/morse-code-decoder" className={linkClass}>
              Morse code decoder
            </a>{" "}
            for Morse to text. The goal here is broader: give you a strong list
            of common words and real operating shorthand, plus the context that
            prevents formatting mistakes.
          </p>
        </CardSection>

        <CardSection title="What “words in Morse code” actually means">
          <p className={pClass}>
            Morse code is an encoding system for characters. Each letter (A to
            Z) and number (0 to 9) has a dot and dash pattern. A “word in Morse
            code” is simply letters placed in sequence to spell the word. That
            sounds obvious, but it matters because spacing is part of what makes
            Morse readable.
          </p>

          <p className={pClass}>
            When Morse is transmitted (audio, keying, flashing light), there are
            timing rules for the gaps inside a letter, between letters, and
            between words. When Morse is shown as text, we represent those gaps
            with spaces and separators. If you copy Morse from different
            sources, the dot and dash patterns usually match, but the spacing
            rules might not. That is why two “correct” versions can look
            different while still meaning the same thing.
          </p>
        </CardSection>

        <CardSection
          title="Letter spacing, word spacing, and the slash separator"
          id="spacing"
        >
          <p className={pClass}>
            Clean spacing is the difference between something that decodes
            instantly and something that turns into gibberish. In text form, the
            safest convention is:
          </p>

          <ul className="my-3 ml-5 list-disc text-slate-700 leading-relaxed">
            <li>
              <strong>One space between letters</strong> (example: H E L L O
              becomes{" "}
              <code className="mx-1 rounded bg-slate-100 px-1 py-0.5">
                .... . .-.. .-.. ---
              </code>
              ).
            </li>
            <li>
              <strong>A larger gap between words</strong> (often multiple
              spaces).
            </li>
            <li>
              <strong>Optional slash for words</strong> when you need an
              explicit separator in puzzles, posts, or notes.
            </li>
          </ul>

          <p className={pClass}>
            If you are working with word boundaries a lot, the dedicated{" "}
            <a href="/morse-code-word-separator" className={linkClass}>
              Morse code word separator
            </a>{" "}
            page is the fastest reference. It explains how to normalize strings
            that use slashes, pipes, double spaces, or inconsistent gaps.
            Normalizing first saves time and avoids false “decode errors.”
          </p>

          <p className={pClass}>
            Tip that actually helps: if you are building a list of words for
            practice, keep one word per line in your source list. If you run it
            through the{" "}
            <a href="/morse-code-encoder" className={linkClass}>
              encoder
            </a>
            , it keeps the output consistent. That makes the output easy to
            copy, easy to re-order, and easy to feed into your own exercises.
          </p>
        </CardSection>

        <CardSection title="How to learn Morse code words faster (the loop that works)">
          <p className={pClass}>
            If you feel stuck, it is usually because you are practicing the
            wrong way. Random characters help you learn the alphabet, but words
            build fluency. Use this simple loop and keep it boring on purpose:
          </p>

          <ol className="my-3 ml-5 list-decimal text-slate-700 leading-relaxed">
            <li>
              Pick 10 short common words from the table (YES, NO, OK, HELP,
              PLEASE, THANK YOU, HELLO).
            </li>
            <li>
              Convert them on the{" "}
              <a href="/morse-code-encoder" className={linkClass}>
                Morse code encoder
              </a>{" "}
              (one word per line) so you get clean, consistent formatting.
            </li>
            <li>
              Play them using{" "}
              <a href="/audio" className={linkClass}>
                Audio
              </a>{" "}
              at a speed where you can copy accurately without guessing.
            </li>
            <li>
              Type what you hear on{" "}
              <a href="/typing" className={linkClass}>
                Typing
              </a>{" "}
              until you can stay accurate.
            </li>
            <li>
              Switch to{" "}
              <a href="/practice" className={linkClass}>
                Practice
              </a>{" "}
              drills once accuracy is stable, then increase speed gradually.
            </li>
          </ol>

          <p className={pClass}>
            The point is repetition with feedback. You want your brain to
            recognize the rhythm of common words, not just translate dots and
            dashes. Short sessions done consistently beat long sessions done
            occasionally.
          </p>
        </CardSection>

        <CardSection title="Using Morse words in puzzles, worksheets, and games">
          <p className={pClass}>
            Many people land on this page because they are building a puzzle, a
            scavenger hunt, a classroom worksheet, or a simple message in dots
            and dashes. The main pitfalls are spacing and mixed punctuation.
            Keep the content simple and your audience will decode it faster.
          </p>

          <ul className="my-3 ml-5 list-disc text-slate-700 leading-relaxed">
            <li>
              Use the slash separator for clarity when you expect beginners
              (example:{" "}
              <code className="mx-1 rounded bg-slate-100 px-1 py-0.5">
                .... .. / - .... . .-. .
              </code>
              ).
            </li>
            <li>
              Prefer short words with high familiarity before you introduce
              longer phrases.
            </li>
            <li>
              If you include punctuation, test it through the decoder so you
              know it round-trips correctly.
            </li>
            <li>
              For pangram practice, use the dedicated{" "}
              <a href="/the-quick-brown-fox-morse-code" className={linkClass}>
                quick brown fox page
              </a>{" "}
              as a reference.
            </li>
          </ul>

          <p className={pClass}>
            If you are sharing content publicly, consider adding the plain-text
            answer key below your Morse. It keeps the game fun while preventing
            frustration, and it helps learners confirm that spacing is the only
            barrier.
          </p>
        </CardSection>

        <FaqSectionGeneric title="Morse Code Words FAQ" items={faqItems} />

        <JsonLdScript jsonLd={jsonLd} />
      </div>
    </div>
  );
}
