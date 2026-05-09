import * as React from "react";

import { CopyIcon, PlayIcon } from "~/client/assets/svg/Icons";
import MorseAnswerCard from "~/client/components/content/MorseAnswerCard";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  PageHero,
  SectionCard,
  SimpleGrid,
  WAVE_PAGE_MAIN_CLASS,
} from "~/client/components/shared/MorseLearningLayout";
import { playMorsePattern } from "~/client/components/shared/playMorsePattern";
import { encodeToolQueryValue } from "~/client/components/shared/queryPrefill";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import {
  ToolOutputPanel,
  toolControlButtonClass,
} from "~/client/components/shared/ToolWorkspace";
import styles from "~/client/components/shared/pageStyles";
import {
  getCharacterBreakdown,
  getWordBreakdown,
  morseForText,
  type ContentFaqItem,
  type ContentTile,
  type GuidePageContent,
  type LetterContentItem,
  type MorseLeafContent,
  NUMBER_ITEMS,
  NUMBER_PAGE_FAQ_ITEMS,
} from "~/client/data/morseContent";

type JsonLdInput = {
  siteUrl: string;
  canonicalUrl: string;
  path: string;
  name: string;
  description: string;
  faqItems?: ContentFaqItem[];
  schemaType?: "WebPage" | "LearningResource" | "CollectionPage" | "WebApplication";
};

export function buildBreadcrumbJsonLd({
  siteUrl,
  canonicalUrl,
  name,
}: Pick<JsonLdInput, "siteUrl" | "canonicalUrl" | "name">) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: canonicalUrl,
      },
    ],
  };
}

export function buildFaqJsonLd(items: ContentFaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function buildPageJsonLd({
  siteUrl,
  canonicalUrl,
  name,
  description,
  schemaType = "WebPage",
}: JsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    name,
    url: canonicalUrl,
    description,
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: siteUrl },
  };
}

export function buildPageJsonLdSet(input: JsonLdInput) {
  const jsonLd: unknown[] = [
    buildBreadcrumbJsonLd(input),
    buildPageJsonLd(input),
  ];

  if (input.faqItems?.length) {
    jsonLd.push(buildFaqJsonLd(input.faqItems));
  }

  return jsonLd;
}

function textLinkTiles(tiles: ContentTile[]) {
  return tiles.map((item) => ({
    title: item.title,
    text: item.text,
    href: item.href,
    badge: item.badge,
  }));
}

export function MorseGuidePage({
  content,
  jsonLd,
}: {
  content: GuidePageContent;
  jsonLd: unknown;
}) {
  return (
    <div className="mw-non-home-page mw-wave-content-page" style={styles.page}>
      <main className={WAVE_PAGE_MAIN_CLASS}>
        <PageHero
          eyebrow={content.eyebrow}
          title={content.h1}
          description={content.answerSummary}
        >
          <ActionLinks links={content.relatedLinks.slice(0, 4)} />
        </PageHero>

        <ReferenceSupportSections
          guide={{
            eyebrow: "Step by step",
            title: content.guideTitle,
            description: content.guideDescription,
            items: textLinkTiles(content.steps),
          }}
          examples={{
            title: content.examplesTitle,
            description: content.examplesDescription,
            items: content.examples.map((example) => ({
              title: example.title,
              morse: example.morse,
              children: (
                <p>
                  <span className="font-semibold text-sky-950">
                    {example.text}
                  </span>
                  {": "}
                  {example.note}
                </p>
              ),
            })),
          }}
          mistakes={{
            title: content.mistakesTitle,
            description: content.mistakesDescription,
            items: content.commonMistakes.map((mistake) => ({
              title: mistake.title,
              children: <p>{mistake.text}</p>,
            })),
          }}
          comparison={{
            title: content.comparisonTitle,
            description: content.comparisonDescription,
            items: textLinkTiles(content.comparisonItems),
          }}
          nextStep={{
            title: content.nextStepTitle,
            description: content.nextStepDescription,
            links: content.relatedLinks,
          }}
        />

        <FaqSectionGeneric
          title={`${content.h1} FAQ`}
          items={content.faqItems}
          variant="home"
        />
        <JsonLdScript jsonLd={jsonLd} />
      </main>
      <BreadcrumbTrail current={content.h1} />
    </div>
  );
}

function BreakdownGrid({ content }: { content: MorseLeafContent }) {
  const wordBreakdown = getWordBreakdown(content.plainTextValue);
  const characterBreakdown = getCharacterBreakdown(content.plainTextValue);

  return (
    <div className="grid gap-7 lg:grid-cols-2">
      {content.kind === "phrase" ? (
        <div>
          <h3 className="text-lg font-extrabold text-sky-950">
            Word-level breakdown
          </h3>
          <div className="mt-3 grid gap-0">
            {wordBreakdown.map((item) => (
              <div
                key={item.label}
                className="py-3"
              >
                <p className="font-bold text-sky-950">{item.label}</p>
                <p className="mt-2 break-words font-mono text-base font-bold tracking-[0.12em] text-slate-950">
                  {item.morse}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <h3 className="text-lg font-extrabold text-sky-950">
          Character-level breakdown
        </h3>
        <div className="mt-3 grid gap-0">
          {characterBreakdown.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-bold text-sky-950">{item.label}</p>
                <p className="break-words font-mono text-base font-bold tracking-[0.12em] text-slate-950">
                  {item.morse}
                </p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MorseLeafPage({
  content,
  jsonLd,
}: {
  content: MorseLeafContent;
  jsonLd: unknown;
}) {
  const queryValue = encodeToolQueryValue(content.plainTextValue);

  return (
    <div className="mw-non-home-page mw-wave-content-page" style={styles.page}>
      <main className={WAVE_PAGE_MAIN_CLASS}>
        <PageHero
          eyebrow={content.eyebrow}
          title={content.displayTitle}
          description={content.answerSummary}
        >
          <ActionLinks links={content.relatedLinks.slice(0, 4)} />
        </PageHero>

        <MorseAnswerCard
          label={content.label}
          plainText={content.plainTextValue}
          morse={content.morseValue}
          summary={content.answerSummary}
          translatorHref={`/?text=${queryValue}`}
          audioHref={`/audio?text=${queryValue}`}
          breakdown={
            content.kind === "phrase"
              ? getWordBreakdown(content.plainTextValue)
              : getCharacterBreakdown(content.plainTextValue)
          }
        />

        <SectionCard
          eyebrow="Breakdown"
          title={`${content.label} Morse breakdown`}
          description={content.breakdownIntro}
        >
          <BreakdownGrid content={content} />
        </SectionCard>

        <SectionCard
          eyebrow={content.kind === "phrase" ? "Practical context" : "Usage notes"}
          title={content.contextTitle}
          description="Use the exact pattern, then check the spacing before copying it into another app or permanent design."
        >
          <SimpleGrid items={textLinkTiles(content.context)} />
        </SectionCard>

        <SectionCard
          eyebrow="Worked examples"
          title={`${content.label} examples`}
          description="These examples keep the pattern in useful message contexts."
          layout="stacked"
        >
          <div className="grid gap-4 md:grid-cols-3">
            {content.examples.map((example) => (
              <article
                key={example.title}
                className="mw-static-panel rounded-xl bg-[#fffdf8] p-5"
              >
                <h3 className="text-lg font-extrabold text-sky-950">
                  {example.title}
                </h3>
                <p className="mt-2 font-mono text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
                  {example.text}
                </p>
                <p className="mt-3 break-words font-mono text-base font-bold tracking-[0.12em] text-slate-950">
                  {example.morse}
                </p>
                <p className="mt-3 text-base leading-relaxed text-slate-700">
                  {example.note}
                </p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Use it well"
          title="Common mistakes"
          description="Check these details before copying the result into a message, worksheet, gift, or practice drill."
        >
          <SimpleGrid items={textLinkTiles(content.commonMistakes)} />
        </SectionCard>

        <SectionCard
          eyebrow="Next step"
          title="Related Morse tools"
          description="Open the exact value in a tool, or move to the closest reference page."
        >
          <ActionLinks links={content.relatedLinks} />
        </SectionCard>

        <FaqSectionGeneric
          title={`${content.displayTitle} FAQ`}
          items={content.faqItems}
          variant="home"
        />
        <JsonLdScript jsonLd={jsonLd} />
      </main>
      <BreadcrumbTrail current={content.displayTitle} />
    </div>
  );
}

export function MorseLetterPage({
  content,
  jsonLd,
}: {
  content: LetterContentItem;
  jsonLd: unknown;
}) {
  const queryValue = encodeToolQueryValue(content.plainTextValue);

  return (
    <div className="mw-non-home-page mw-wave-content-page" style={styles.page}>
      <main className={WAVE_PAGE_MAIN_CLASS}>
        <PageHero
          eyebrow="Letter guide"
          title={content.displayTitle}
          description={content.answerSummary}
        >
          <ActionLinks
            links={[
              { href: "#answer", label: "Direct answer", primary: true },
              { href: "/morse-code-alphabet", label: "Alphabet chart" },
              { href: `/audio?text=${queryValue}`, label: "Hear it" },
              { href: "/practice", label: "Practice" },
            ]}
          />
        </PageHero>

        <div id="answer">
          <MorseAnswerCard
            label={`Letter ${content.letter}`}
            plainText={content.plainTextValue}
            morse={content.morseValue}
            summary={content.answerSummary}
            translatorHref={`/?text=${queryValue}`}
            audioHref={`/audio?text=${queryValue}`}
            encoderHref={`/morse-code-encoder?text=${queryValue}`}
            breakdown={[
              {
                label: content.letter,
                morse: content.morseValue,
                note: `${content.letter} is spoken as ${content.spokenRhythm}.`,
              },
            ]}
          />
        </div>

        <SectionCard
          eyebrow="Letter details"
          title={`What ${content.letter} is in Morse code`}
          description={content.whatItIs}
          layout="stacked"
        >
          <div className="grid gap-3">
            <div className="grid gap-3 md:grid-cols-3">
              <article className="mw-static-panel rounded-xl bg-[#fffdf8] p-4 sm:p-5">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Character
                </p>
                <p className="mt-2 text-3xl font-black text-sky-950">
                  {content.letter}
                </p>
              </article>
              <article className="mw-static-panel rounded-xl bg-[#fffdf8] p-4 sm:p-5">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Dot dash pattern
                </p>
                <p className="mt-2 break-words font-mono text-2xl font-bold tracking-[0.14em] text-slate-950">
                  {content.morseValue}
                </p>
              </article>
              <article className="mw-static-panel rounded-xl bg-[#fffdf8] p-4 sm:p-5">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Spoken rhythm
                </p>
                <p className="mt-2 text-xl font-extrabold text-sky-950">
                  {content.spokenRhythm}
                </p>
              </article>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-extrabold text-sky-950">
                  How it sounds
                </h3>
                <div className="mt-3">
                  <SimpleGrid items={textLinkTiles(content.soundNotes)} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-sky-950">
                  How to type it
                </h3>
                <div className="mt-3">
                  <SimpleGrid items={textLinkTiles(content.typingNotes)} />
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Avoid mixups"
          title="Common mistakes and confused letters"
          description="Small spacing or mark-count changes can turn one Morse letter into another."
        >
          <SimpleGrid items={textLinkTiles(content.commonConfusions)} />
        </SectionCard>

        <SectionCard
          eyebrow="Examples"
          title={`Words that contain ${content.letter}`}
          description="Use short words to practice the letter in real context instead of memorizing it only as a lookup."
          layout="stacked"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {content.exampleWords.map((example) => (
              <article
                key={example.title}
                className="mw-static-panel rounded-xl bg-[#fffdf8] p-5"
              >
                <h3 className="text-lg font-extrabold text-sky-950">
                  {example.title}
                </h3>
                <p className="mt-2 break-words font-mono text-base font-bold tracking-[0.12em] text-slate-950">
                  {example.morse}
                </p>
                <p className="mt-3 text-base leading-relaxed text-slate-700">
                  {example.note}
                </p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Mini practice"
          title={content.miniPracticePrompt.title}
          description={content.miniPracticePrompt.text}
        >
          <ActionLinks
            links={[
              {
                href: content.miniPracticePrompt.href ?? "/practice",
                label: "Practice now",
                primary: true,
              },
              { href: "/typing", label: "Typing drill" },
              { href: `/audio?text=${queryValue}`, label: "Hear it again" },
            ]}
          />
        </SectionCard>

        <SectionCard
          eyebrow="Next step"
          title="Related Morse tools"
          description="Compare the letter with the full alphabet, then move into audio, typing, and practice."
        >
          <ActionLinks links={content.relatedLinks} />
        </SectionCard>

        <FaqSectionGeneric
          title={`${content.displayTitle} FAQ`}
          items={content.faqItems}
          variant="home"
        />
        <JsonLdScript jsonLd={jsonLd} />
      </main>
      <BreadcrumbTrail current={content.displayTitle} />
    </div>
  );
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    if (typeof document === "undefined") return false;
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  }
}

function NumberCard({ item }: { item: (typeof NUMBER_ITEMS)[number] }) {
  const [copied, setCopied] = React.useState(false);
  const queryValue = encodeToolQueryValue(item.label);

  return (
    <article className="mw-static-panel rounded-xl bg-[#fffdf8] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Digit
          </p>
          <h3 className="mt-1 text-3xl font-black text-sky-950">
            {item.label}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => playMorsePattern(item.morseValue)}
          className={toolControlButtonClass({ size: "sm" })}
        >
          <PlayIcon size={16} title={`Play ${item.label}`} />
          Play
        </button>
      </div>

      <p className="mt-4 break-words font-mono text-lg font-bold tracking-[0.14em] text-slate-950">
        {item.morseValue}
      </p>
      <p className="mt-3 text-base leading-relaxed text-slate-700">
        {item.patternExplanation}
      </p>

      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={async () => {
            const ok = await copyText(item.morseValue);
            if (!ok) return;
            setCopied(true);
            window.setTimeout(() => setCopied(false), 900);
          }}
          className={toolControlButtonClass({ size: "sm", full: true })}
        >
          <CopyIcon size={16} title="Copy Morse" />
          {copied ? "Copied" : "Copy Morse"}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`/?text=${queryValue}`}
            className={toolControlButtonClass({ size: "sm", full: true })}
          >
            Translator
          </a>
          <a
            href={`/audio?text=${queryValue}`}
            className={toolControlButtonClass({ size: "sm", full: true })}
          >
            Audio
          </a>
        </div>
      </div>
    </article>
  );
}

export function MorseNumbersPage({
  jsonLd,
}: {
  jsonLd: unknown;
}) {
  return (
    <div className="mw-non-home-page mw-wave-content-page" style={styles.page}>
      <main className={WAVE_PAGE_MAIN_CLASS}>
        <PageHero
          eyebrow="Number chart"
          title="Morse Code Numbers"
          description="Morse code numbers use five marks each. 1 through 5 build dots then dashes, 6 through 9 build dashes then dots, and 0 is five dashes."
        >
          <ActionLinks
            links={[
              { href: "#number-chart", label: "0-9 chart", primary: true },
              { href: "/morse-code-alphabet", label: "Alphabet" },
              { href: "/audio", label: "Hear numbers" },
              { href: "/practice", label: "Practice" },
            ]}
          />
        </PageHero>

        <section className="mt-6">
          <ToolOutputPanel label="Direct answer" badge="0-9" className="h-fit">
            <div className="grid gap-4 px-4 pb-4 text-slate-200 lg:grid-cols-[minmax(0,0.72fr)_minmax(220px,0.28fr)]">
              <p className="max-w-[68ch] text-base leading-relaxed">
                The Morse number chart is 0 = -----, 1 = .----, 2 = ..---,
                3 = ...--, 4 = ....-, 5 = ....., 6 = -...., 7 = --...,
                8 = ---.., and 9 = ----.
              </p>
              <p className="max-w-[34ch] text-base leading-relaxed text-sky-100">
                Learn them as one five-mark system instead of ten unrelated
                patterns.
              </p>
            </div>
          </ToolOutputPanel>
        </section>

        <SectionCard
          eyebrow="Lookup chart"
          title="0-9 Morse number chart"
          description="Copy or play each digit, then open the exact value in the translator or audio tool."
          layout="stacked"
        >
          <div
            id="number-chart"
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
          >
            {NUMBER_ITEMS.map((item) => (
              <NumberCard key={item.label} item={item} />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Pattern logic"
          title="How Morse code numbers work"
          description="The digit set is easier to memorize when you notice the direction of the dots and dashes."
        >
          <SimpleGrid
            items={[
              {
                title: "1-5 build dots",
                text: "1 starts with one dot, 2 starts with two dots, and 5 is five dots.",
              },
              {
                title: "6-9 build dashes",
                text: "6 starts with one dash, 7 with two dashes, 8 with three, and 9 with four.",
              },
              {
                title: "0 is five dashes",
                text: "0 completes the number family with five dashes.",
              },
              {
                title: "Every digit has five marks",
                text: "That shared length helps you spot missing dots or dashes in copied Morse.",
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          eyebrow="Worked examples"
          title="Number examples in Morse"
          description="Numbers appear in practical text when you write dates, counts, codes, and radio-style copy."
          layout="stacked"
        >
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                title: "Date",
                text: "MAY 9 2026",
                morse: morseForText("MAY 9 2026").replace(/\s{7,}/g, " / "),
                note: "Dates mix letters and digits, so keep the word and number boundaries visible.",
              },
              {
                title: "Count",
                text: "COUNT 5",
                morse: morseForText("COUNT 5").replace(/\s{7,}/g, " / "),
                note: "Counts are useful short practice prompts because the digit is easy to check.",
              },
              {
                title: "Code",
                text: "CODE 73",
                morse: morseForText("CODE 73").replace(/\s{7,}/g, " / "),
                note: "Radio-style examples often mix short words, digits, and shorthand.",
              },
            ].map((example) => {
              return (
                <article
                  key={example.title}
                  className="mw-static-panel rounded-xl bg-[#fffdf8] p-5"
                >
                  <h3 className="text-lg font-extrabold text-sky-950">
                    {example.title}
                  </h3>
                  <p className="mt-2 font-mono text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
                    {example.text}
                  </p>
                  <p className="mt-3 break-words font-mono text-base font-bold tracking-[0.12em] text-slate-950">
                    {example.morse}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-slate-700">
                    {example.note}
                  </p>
                </article>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Next step"
          title="Practice numbers with the rest of Morse"
          description="Numbers become useful when they sit beside letters, words, and audio practice."
        >
          <ActionLinks
            links={[
              { href: "/morse-code-alphabet", label: "Alphabet", primary: true },
              { href: "/dictionary", label: "Dictionary" },
              { href: "/audio", label: "Audio" },
              { href: "/practice", label: "Practice" },
              { href: "/morse-code-encoder", label: "Encoder" },
            ]}
          />
        </SectionCard>

        <FaqSectionGeneric
          title="Morse Code Numbers FAQ"
          items={NUMBER_PAGE_FAQ_ITEMS}
          variant="home"
        />
        <JsonLdScript jsonLd={jsonLd} />
      </main>
      <BreadcrumbTrail current="Morse Code Numbers" />
    </div>
  );
}
