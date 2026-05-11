import * as React from "react";
import type { Route } from "./+types/morse-code-alphabet";
import { CheckCircleIcon, CopyIcon } from "~/client/assets/svg/Icons";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  PageHero,
} from "~/client/components/shared/MorseLearningLayout";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import { LETTER_ITEMS } from "~/client/data/morseContent";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-alphabet";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title:
      "Morse Code Alphabet | A-Z Letter Chart and Learning Guide | MorseWords",
    description:
      "Learn the Morse code alphabet from A to Z with a clear letter chart, beginner examples, memorization tips, and links to practice tools.",
    path: CANONICAL_PATH,
    keywords:
      "morse code alphabet, morse code letters, morse alphabet, learn morse code alphabet, A-Z morse code",
  });
}

type Entry = {
  label: string;
  morse: string;
  meaning: string;
  category: "Letters";
  href?: string;
};

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = React.useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await copyToClipboard(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 900);
      }}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer transition-colors focus-visible:outline-none",
        "bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white active:bg-slate-900",
      ].join(" ")}
      aria-label={`Copy ${label}`}
    >
      {copied ? (
        <CheckCircleIcon size={16} title={undefined} aria-hidden="true" />
      ) : (
        <CopyIcon size={16} title={undefined} aria-hidden="true" />
      )}
      {copied ? "Copied" : `Copy ${label}`}
    </button>
  );
}

function AlphabetCard({ entry }: { entry: Entry }) {
  return (
    <article className="mw-static-surface-soft min-w-0 rounded-xl bg-white p-4">
      <div className="grid gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Character
            </div>
            <div className="text-2xl font-bold text-sky-950">{entry.label}</div>
          </div>

          <span className="mw-static-tile rounded-md bg-[#f7f4ee] px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
            {entry.category}
          </span>
        </div>

        <div>
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Morse
          </div>
          <div className="mw-static-tile mt-1 break-words rounded-xl bg-[#f7f4ee] px-3 py-3 font-mono text-base text-slate-900">
            {entry.morse}
          </div>
        </div>

        <div>
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Meaning
          </div>
          <div className="mt-1 text-sm text-slate-700">{entry.meaning}</div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <CopyButton value={entry.morse} label="Morse" />
          <CopyButton value={entry.label} label="Character" />
        </div>

        {entry.href ? (
          <a
            href={entry.href}
            className="mw-button-outline inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg bg-[#fffdf8] px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none"
          >
            Study {entry.label}
          </a>
        ) : null}
      </div>
    </article>
  );
}

function Section({
  id,
  title,
  description,
  items,
}: {
  id: string;
  title: string;
  description: string;
  items: Entry[];
}) {
  return (
    <section
      id={id}
      className="mw-static-panel w-full max-w-full min-w-0 overflow-hidden scroll-mt-28 rounded-2xl bg-[#fffdf8] p-5 sm:p-6"
      style={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-sky-950">{title}</h2>
          <p className="mt-2 text-slate-700">{description}</p>
        </div>

        <a
          href="#top"
          className="mw-button-outline inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none"
        >
          Top
        </a>
      </div>

      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((entry) => (
          <AlphabetCard
            key={`${entry.category}-${entry.label}-${entry.morse}`}
            entry={entry}
          />
        ))}
      </div>
    </section>
  );
}

const faqItems = [
  {
    q: "What is the Morse code alphabet?",
    a: "The Morse code alphabet is the standard A-Z letter set represented as dots and dashes in International Morse code.",
  },
  {
    q: "Does this page include numbers and punctuation?",
    a: "No. This page focuses on A-Z letters for memorization. Use the dictionary or international reference when you need numbers, punctuation, prosigns, or Q-codes.",
  },
  {
    q: "What is the easiest Morse letter to learn first?",
    a: "E and T are the easiest starting points because E is one dit and T is one dah. They help you hear the basic signal lengths before longer patterns.",
  },
  {
    q: "Should I memorize dots and dashes visually or by sound?",
    a: "Use the chart to recognize patterns, but practice by sound as soon as possible. Morse is easier to use when letters become rhythms instead of visual strings.",
  },
  {
    q: "How is this different from the dictionary?",
    a: "The alphabet page is a focused A-Z learning chart. The dictionary is better for quick lookup across letters, numbers, punctuation, prosigns, Q-codes, and phrases.",
  },
  {
    q: "What should I practice after A-Z?",
    a: "After reviewing the alphabet, use the practice page for recall, the typing page for rhythm, or the SOS page to see S and O in a recognizable signal.",
  },
];

export default function MorseCodeAlphabetRoute() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Alphabet",
        item: CANONICAL_URL,
      },
    ],
  };

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Morse Code Alphabet",
    url: CANONICAL_URL,
    description:
      "A focused A-Z Morse code alphabet chart for learning and memorizing letter patterns.",
    breadcrumb: {
      "@id": CANONICAL_URL + "#breadcrumb",
    },
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const letters: Entry[] = LETTER_ITEMS.map((item) => ({
    label: item.letter,
    morse: item.morseValue,
    meaning: "Letter " + item.letter,
    category: "Letters" as const,
    href: item.path,
  }));

  return (
    <main id="top" className="mw-non-home-page" style={styles.wrap}>
      <JsonLdScript jsonLd={[breadcrumbJsonLd, pageJsonLd, faqJsonLd]} />

      <PageHero
        eyebrow="Letter chart"
        title="Morse Code Alphabet"
        description="Learn the A-Z Morse letter patterns in one focused chart. This page is for letter memorization; use the dictionary or international reference when you need numbers, punctuation, prosigns, or Q-codes."
      >
        <ActionLinks
          links={[
            { href: "#letters", label: "Letters A-Z", primary: true },
            { href: "/morse-code-numbers", label: "Numbers 0-9" },
            { href: "/dictionary", label: "Dictionary" },
            { href: "/international-morse-code-reference", label: "Full reference" },
            { href: "#faq", label: "FAQ" },
          ]}
        />
      </PageHero>

      <nav className="mb-8 mt-5 rounded-xl bg-[#fffdf8]/70 px-3 py-3">
        <div className="flex flex-wrap gap-2 text-sm">
          <a
            href="#letters"
            className="mw-button-outline cursor-pointer rounded-lg px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none"
          >
            Letters A-Z
          </a>
          <a
            href="#examples"
            className="mw-button-outline cursor-pointer rounded-lg px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none"
          >
            Examples
          </a>
          <a
            href="/morse-code-numbers"
            className="mw-button-outline cursor-pointer rounded-lg px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none"
          >
            Numbers 0-9
          </a>
          <a
            href="#faq"
            className="mw-button-outline cursor-pointer rounded-lg px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none"
          >
            FAQ
          </a>
        </div>
      </nav>

      <div
        className="grid min-w-0 gap-12"
        style={{ gridTemplateColumns: "minmax(0, 1fr)" }}
      >
        <Section
          id="letters"
          title="Letters A-Z"
          description="Use this section to review and copy the standard International Morse letter alphabet."
          items={letters}
        />

        <div id="examples">
          <ReferenceSupportSections
            guide={{
              eyebrow: "Alphabet guide",
              title: "How to use the A-Z Morse alphabet",
              description:
                "This page keeps the learning target narrow: letters only. That makes it easier to compare patterns, spot mirrored pairs, and start practicing by sound.",
              items: [
                {
                  title: "Who it is for",
                  text: "Use this chart when you are learning or reviewing letter patterns before moving into words and sentences.",
                },
                {
                  title: "What it includes",
                  text: "The chart includes A-Z letters only. Numbers, punctuation, prosigns, and Q-codes live in broader reference pages.",
                },
                {
                  title: "How to study it",
                  text: "Start with short letters, compare pairs, then use practice and typing drills to turn visual patterns into recall.",
                },
              ],
            }}
            examples={{
              title: "Worked letter examples",
              description:
                "These beginner patterns show why a letter-only chart is useful for memorization.",
              items: [
                {
                  title: "E and T",
                  morse: ".  -",
                  children: (
                    <p>
                      E is one dit and T is one dah. They are the shortest
                      patterns and the best first contrast for learning signal
                      length.
                    </p>
                  ),
                },
                {
                  title: "A and N",
                  morse: ".-  -.",
                  children: (
                    <p>
                      A and N are mirrored short patterns. Pairing them helps
                      you avoid reversing the order while reading or sending.
                    </p>
                  ),
                },
                {
                  title: "S and O",
                  morse: "...  ---",
                  children: (
                    <p>
                      S and O are the building blocks of{" "}
                      <a
                        href="/morse-code-sos"
                        className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                      >
                        SOS in Morse code
                      </a>
                      , one of the easiest complete signals to recognize.
                    </p>
                  ),
                },
              ],
            }}
            mistakes={{
              title: "Common alphabet learning mistakes",
              description:
                "The alphabet is small, but the learning method matters.",
              items: [
                {
                  title: "Learning only by sight",
                  children: (
                    <p>
                      Visual lookup is useful, but Morse becomes practical when
                      the letters are remembered as sound patterns.
                    </p>
                  ),
                },
                {
                  title: "Adding symbols too early",
                  children: (
                    <p>
                      Keep the first pass focused on A-Z. Add{" "}
                      <a
                        href="/morse-code-numbers"
                        className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                      >
                        numbers
                      </a>{" "}
                      and punctuation after letter recall is stable.
                    </p>
                  ),
                },
                {
                  title: "Skipping practice",
                  children: (
                    <p>
                      Reading the chart is not the same as recall. Use drills
                      after each small group of letters.
                    </p>
                  ),
                },
              ],
            }}
            comparison={{
              title: "Which Morse reference should I use?",
              description:
                "Use this alphabet chart for letter learning. Use the other reference pages when your task is broader.",
              items: [
                {
                  title: "Alphabet",
                  text: "Use this page when you want to learn the A-Z letter patterns without extra symbol categories.",
                  href: "/morse-code-alphabet",
                  badge: "Letters",
                },
                {
                  title: "Dictionary",
                  text: "Use the dictionary for quick lookup across letters, numbers, punctuation, prosigns, Q-codes, and phrases.",
                  href: "/dictionary",
                  badge: "Lookup",
                },
                {
                  title: "International reference",
                  text: "Use the international reference when you need the broader supported Morse set in one place.",
                  href: "/international-morse-code-reference",
                  badge: "Full set",
                },
              ],
            }}
            nextStep={{
              title: "Best next step after reviewing A-Z",
              description:
                "Move from recognition into recall, rhythm, and short complete signals.",
              links: [
                { href: "/practice", label: "Practice letters", primary: true },
                { href: "/morse-code-numbers", label: "Review numbers" },
                { href: "/typing", label: "Typing rhythm" },
                { href: "/learn-morse-code", label: "Learning path" },
                { href: "/morse-code-sos", label: "Study SOS" },
              ],
            }}
          />
        </div>

        <div id="faq">
          <FaqSectionGeneric title="Alphabet FAQ" items={faqItems} />
        </div>
      </div>

      <nav aria-label="Breadcrumb" className="mb-12 mt-10 text-sm text-slate-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <a href="/" className="underline hover:no-underline cursor-pointer">
              Home
            </a>
          </li>
          <li>/</li>
          <li className="font-semibold text-sky-950">Morse Code Alphabet</li>
        </ol>
      </nav>
    </main>
  );
}
