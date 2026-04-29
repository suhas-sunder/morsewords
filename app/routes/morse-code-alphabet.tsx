import * as React from "react";
import type { Route } from "./+types/home";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-alphabet";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Alphabet Chart - Letters, Numbers & Symbols",
    description:
      "View the International Morse code alphabet for A-Z letters, numbers, and common symbols. Copy any character or open the translator.",
    path: CANONICAL_PATH,
    keywords:
      "morse code alphabet, morse code chart, morse code letters, morse code numbers, international morse code, morse alphabet",
  });
}

type Entry = {
  label: string;
  morse: string;
  meaning: string;
  category: "Letters" | "Numbers" | "Symbols";
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
        "rounded-xl border px-3 py-2 text-sm font-semibold cursor-pointer transition-colors",
        "border-[#0b2447] bg-[#0b2447] text-white hover:bg-[#0b2447]/90 active:bg-[#0b2447]/80",
      ].join(" ")}
      aria-label={`Copy ${label}`}
    >
      {copied ? "Copied" : `Copy ${label}`}
    </button>
  );
}

function AlphabetCard({ entry }: { entry: Entry }) {
  return (
    <article className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="grid gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold tracking-wide text-gray-500">
              Character
            </div>
            <div className="text-2xl font-bold text-sky-800">{entry.label}</div>
          </div>

          <span className="rounded-full border px-3 py-1 text-xs font-semibold text-gray-700">
            {entry.category}
          </span>
        </div>

        <div>
          <div className="text-xs font-semibold tracking-wide text-gray-500">
            Morse
          </div>
          <div className="mt-1 break-words rounded-xl bg-gray-50 px-3 py-3 font-mono text-base text-gray-900">
            {entry.morse}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold tracking-wide text-gray-500">
            Meaning
          </div>
          <div className="mt-1 text-sm text-gray-800">{entry.meaning}</div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <CopyButton value={entry.morse} label="Morse" />
          <CopyButton value={entry.label} label="Character" />
        </div>
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
    <section id={id} className="scroll-mt-28">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-sky-800">{title}</h2>
          <p className="mt-2 text-gray-700">{description}</p>
        </div>

        <a
          href="#top"
          className="rounded-full border px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          Top
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

function InfoBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white p-5">
      <h2 className="text-xl font-semibold text-sky-800">{title}</h2>
      <div className="mt-3 text-gray-800">{children}</div>
    </section>
  );
}

function FaqSection({ items }: { items: Array<{ q: string; a: string }> }) {
  return (
    <section className="rounded-2xl border bg-white p-5">
      <h2 className="text-2xl font-semibold text-sky-800">Alphabet FAQ</h2>
      <div className="mt-4 grid gap-4">
        {items.map((item) => (
          <article key={item.q} className="rounded-xl border bg-gray-50 p-4">
            <h3 className="text-base font-semibold text-gray-900">{item.q}</h3>
            <p className="mt-2 text-gray-800">{item.a}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
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
    "@type": "WebPage",
    name: "Morse Code Alphabet",
    url: CANONICAL_URL,
    description:
      "A clean Morse code alphabet chart with letters, numbers, and symbols.",
    breadcrumb: {
      "@id": CANONICAL_URL + "#breadcrumb",
    },
  };

  const letters: Entry[] = [
    { label: "A", morse: ".-", meaning: "Letter A", category: "Letters" },
    { label: "B", morse: "-...", meaning: "Letter B", category: "Letters" },
    { label: "C", morse: "-.-.", meaning: "Letter C", category: "Letters" },
    { label: "D", morse: "-..", meaning: "Letter D", category: "Letters" },
    { label: "E", morse: ".", meaning: "Letter E", category: "Letters" },
    { label: "F", morse: "..-.", meaning: "Letter F", category: "Letters" },
    { label: "G", morse: "--.", meaning: "Letter G", category: "Letters" },
    { label: "H", morse: "....", meaning: "Letter H", category: "Letters" },
    { label: "I", morse: "..", meaning: "Letter I", category: "Letters" },
    { label: "J", morse: ".---", meaning: "Letter J", category: "Letters" },
    { label: "K", morse: "-.-", meaning: "Letter K", category: "Letters" },
    { label: "L", morse: ".-..", meaning: "Letter L", category: "Letters" },
    { label: "M", morse: "--", meaning: "Letter M", category: "Letters" },
    { label: "N", morse: "-.", meaning: "Letter N", category: "Letters" },
    { label: "O", morse: "---", meaning: "Letter O", category: "Letters" },
    { label: "P", morse: ".--.", meaning: "Letter P", category: "Letters" },
    { label: "Q", morse: "--.-", meaning: "Letter Q", category: "Letters" },
    { label: "R", morse: ".-.", meaning: "Letter R", category: "Letters" },
    { label: "S", morse: "...", meaning: "Letter S", category: "Letters" },
    { label: "T", morse: "-", meaning: "Letter T", category: "Letters" },
    { label: "U", morse: "..-", meaning: "Letter U", category: "Letters" },
    { label: "V", morse: "...-", meaning: "Letter V", category: "Letters" },
    { label: "W", morse: ".--", meaning: "Letter W", category: "Letters" },
    { label: "X", morse: "-..-", meaning: "Letter X", category: "Letters" },
    { label: "Y", morse: "-.--", meaning: "Letter Y", category: "Letters" },
    { label: "Z", morse: "--..", meaning: "Letter Z", category: "Letters" },
  ];

  const numbers: Entry[] = [
    { label: "0", morse: "-----", meaning: "Number 0", category: "Numbers" },
    { label: "1", morse: ".----", meaning: "Number 1", category: "Numbers" },
    { label: "2", morse: "..---", meaning: "Number 2", category: "Numbers" },
    { label: "3", morse: "...--", meaning: "Number 3", category: "Numbers" },
    { label: "4", morse: "....-", meaning: "Number 4", category: "Numbers" },
    { label: "5", morse: ".....", meaning: "Number 5", category: "Numbers" },
    { label: "6", morse: "-....", meaning: "Number 6", category: "Numbers" },
    { label: "7", morse: "--...", meaning: "Number 7", category: "Numbers" },
    { label: "8", morse: "---..", meaning: "Number 8", category: "Numbers" },
    { label: "9", morse: "----.", meaning: "Number 9", category: "Numbers" },
  ];

  const symbols: Entry[] = [
    { label: ".", morse: ".-.-.-", meaning: "Period", category: "Symbols" },
    { label: ",", morse: "--..--", meaning: "Comma", category: "Symbols" },
    {
      label: "?",
      morse: "..--..",
      meaning: "Question mark",
      category: "Symbols",
    },
    {
      label: "!",
      morse: "-.-.--",
      meaning: "Exclamation mark",
      category: "Symbols",
    },
    { label: "/", morse: "-..-.", meaning: "Slash", category: "Symbols" },
    { label: "@", morse: ".--.-.", meaning: "At sign", category: "Symbols" },
    { label: "-", morse: "-....-", meaning: "Hyphen", category: "Symbols" },
    { label: "+", morse: ".-.-.", meaning: "Plus", category: "Symbols" },
    { label: "=", morse: "-...-", meaning: "Equals", category: "Symbols" },
    { label: ":", morse: "---...", meaning: "Colon", category: "Symbols" },
    { label: ";", morse: "-.-.-.", meaning: "Semicolon", category: "Symbols" },
    {
      label: "(",
      morse: "-.--.",
      meaning: "Open parenthesis",
      category: "Symbols",
    },
    {
      label: ")",
      morse: "-.--.-",
      meaning: "Close parenthesis",
      category: "Symbols",
    },
    {
      label: "&",
      morse: ".-...",
      meaning: "Ampersand",
      category: "Symbols",
    },
    {
      label: "'",
      morse: ".----.",
      meaning: "Apostrophe",
      category: "Symbols",
    },
    {
      label: '"',
      morse: ".-..-.",
      meaning: "Quotation mark",
      category: "Symbols",
    },
  ];

  const faqItems = [
    {
      q: "What is the Morse code alphabet?",
      a: "The Morse code alphabet is the standard A–Z letter set represented as dots and dashes in International Morse code.",
    },
    {
      q: "Does this page include numbers and symbols too?",
      a: "Yes. This chart includes letters, numbers, and common punctuation so you can copy or check each character quickly.",
    },
    {
      q: "What is the difference between this alphabet page and the dictionary?",
      a: "This page is a clean chart for quick lookup. The dictionary goes deeper with prosigns, Q-codes, abbreviations, and phrases.",
    },
    {
      q: "Can I copy individual Morse code entries?",
      a: "Yes. Each card includes copy buttons for both the Morse pattern and the character.",
    },
    {
      q: "Can I translate full words or sentences here?",
      a: "For full text conversion, use the Morse code translator, encoder, or decoder pages linked below.",
    },
  ];

  return (
    <main id="top" className="max-w-6xl mx-auto pt-4 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-sky-800">Morse Code Alphabet</h1>
        <p className="mt-3 text-lg text-gray-800">
          Browse a clean Morse code alphabet chart with letters, numbers, and
          common symbols. Copy any entry instantly, then jump to the translator,
          encoder, or decoder if you want to convert full text.
        </p>
      </header>

      <nav className="sticky top-0 z-10 bg-white -mx-4 px-4 py-3 mb-8 border-b overflow-x-auto">
        <div className="flex gap-2 whitespace-nowrap text-sm">
          <a
            href="#letters"
            className="border rounded-full px-3 py-1 hover:bg-gray-100 cursor-pointer"
          >
            Letters
          </a>
          <a
            href="#numbers"
            className="border rounded-full px-3 py-1 hover:bg-gray-100 cursor-pointer"
          >
            Numbers
          </a>
          <a
            href="#symbols"
            className="border rounded-full px-3 py-1 hover:bg-gray-100 cursor-pointer"
          >
            Symbols
          </a>
          <a
            href="#how-it-works"
            className="border rounded-full px-3 py-1 hover:bg-gray-100 cursor-pointer"
          >
            How It Works
          </a>
          <a
            href="#faq"
            className="border rounded-full px-3 py-1 hover:bg-gray-100 cursor-pointer"
          >
            FAQ
          </a>
        </div>
      </nav>

      <div className="grid gap-12">
        <Section
          id="letters"
          title="Letters A–Z"
          description="Use this section to look up each letter in the Morse code alphabet."
          items={letters}
        />

        <Section
          id="numbers"
          title="Numbers 0–9"
          description="These are the standard International Morse code patterns for numbers."
          items={numbers}
        />

        <Section
          id="symbols"
          title="Common Symbols"
          description="These are common punctuation and symbol entries used in International Morse code."
          items={symbols}
        />

        <div id="how-it-works" className="grid gap-6">
          <InfoBox title="How It Works">
            <div className="grid gap-3">
              <p>
                Each letter, number, or symbol is represented by a pattern of
                dots and dashes. Short signals are dots, longer signals are
                dashes.
              </p>
              <p>
                Use this page as a quick lookup chart. If you want to convert
                full text, translate Morse back to English, or listen to audio,
                use the dedicated tools below.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="/"
                  className="rounded-xl border px-4 py-2 font-semibold text-gray-900 hover:bg-gray-100 cursor-pointer"
                >
                  Morse Code Translator
                </a>
                <a
                  href="/morse-code-encoder"
                  className="rounded-xl border px-4 py-2 font-semibold text-gray-900 hover:bg-gray-100 cursor-pointer"
                >
                  Text to Morse Code
                </a>
                <a
                  href="/morse-code-decoder"
                  className="rounded-xl border px-4 py-2 font-semibold text-gray-900 hover:bg-gray-100 cursor-pointer"
                >
                  Decode Morse Code
                </a>
                <a
                  href="/dictionary"
                  className="rounded-xl border px-4 py-2 font-semibold text-gray-900 hover:bg-gray-100 cursor-pointer"
                >
                  Morse Code Dictionary
                </a>
              </div>
            </div>
          </InfoBox>
        </div>

        <div id="faq">
          <FaqSection items={faqItems} />
        </div>
      </div>

      <nav aria-label="Breadcrumb" className="mt-10 mb-4 text-sm text-gray-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <a href="/" className="underline hover:no-underline cursor-pointer">
              Home
            </a>
          </li>
          <li>/</li>
          <li className="font-semibold text-gray-900">Morse Code Alphabet</li>
        </ol>
      </nav>
    </main>
  );
}
