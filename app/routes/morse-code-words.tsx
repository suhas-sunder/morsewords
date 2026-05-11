import * as React from "react";
import type { Route } from "./+types/morse-code-words";

import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
 ActionLinks,
 PageHero,
 SectionCard as SharedSectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import MorsePhraseLookupTable from "~/client/components/morse-code-words/MorsePhraseLookupTable";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";
import styles from "~/client/components/shared/pageStyles";
import { PHRASE_PAGES, morseForText } from "~/client/data/morseContent";

const CANONICAL_PATH ="/morse-code-words";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
 return [{ rel:"canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
 return seoMeta({
 title:"Morse Code Words | Common Word Examples and Practice Ideas | MorseWords",
 description:"Explore common words in Morse code, word spacing tips, practice ideas, and links to trainer and sentence tools.",
 path: CANONICAL_PATH,
 keywords:"morse code words, morse words, words in morse code, common morse code words, morse code phrases, morse code abbreviations",
 });
}

function CardSection(props: {
 title: string;
 children: React.ReactNode;
 id?: string;
}) {
 return (
 <SharedSectionCard eyebrow="Morse words" title={props.title}>
 <div id={props.id}>{props.children}</div>
 </SharedSectionCard>
 );
}

const featuredPhraseSlugs = [
 "hello-in-morse-code",
 "hi-in-morse-code",
 "help-in-morse-code",
 "help-me-in-morse-code",
 "yes-in-morse-code",
 "no-in-morse-code",
 "ok-in-morse-code",
 "sorry-in-morse-code",
 "love-in-morse-code",
 "hello-world-in-morse-code",
 "test-in-morse-code",
 "i-love-you-in-morse-code",
 "cq-in-morse-code",
] as const;

const featuredPhrasePages = featuredPhraseSlugs.map((slug) => PHRASE_PAGES[slug]);

export default function MorseCodeWords() {
 const baseUrl = SITE_URL;

 const jsonLd = {"@context":"https://schema.org","@type":"WebPage",
 name:"Morse Code Words",
 url: CANONICAL_URL,
 description:"Common Morse code word examples, spacing guidance, practice ideas, and links to word trainer and sentence practice tools.",
 isPartOf: {"@type":"WebSite", name:"MorseWords", url: baseUrl },
 about: [
 {"@type":"Thing", name:"International Morse code"},
 {"@type":"Thing", name:"Morse code words"},
 {"@type":"Thing", name:"Morse code practice"},
 ],
 };
 const breadcrumbJsonLd = {"@context":"https://schema.org","@type":"BreadcrumbList",
 itemListElement: [
 {"@type":"ListItem", position: 1, name:"Home", item: SITE_URL +"/"},
 {"@type":"ListItem", position: 2, name:"Morse Code Words", item: CANONICAL_URL},
 ],
 };

 const faqItems = [
 {
 q:"What are good words to practice in Morse code?",
 a:"Short familiar words such as HELLO, HELP, TEST, YES, NO, and CODE work well because they are easy to check and repeat.",
 },
 {
 q:"Should beginners practice words or letters first?",
 a:"Beginners should learn a small set of letters first, then use short words to make those letter patterns feel useful.",
 },
 {
 q:"How are words separated in Morse code?",
 a:"Written Morse usually separates letters with spaces and words with a larger gap or a slash. Clear word boundaries keep the decoder from joining separate words.",
 },
 {
 q:"Is this the same as the word trainer?",
 a:"No. This page gives common word examples and context. The word trainer is the interactive page for repeated custom-word practice.",
 },
 {
 q:"What should I practice after common words?",
 a:"Move into the word trainer for repetition, sentence practice for phrase flow, or audio practice if you want to recognize words by sound.",
 },
 ];
 const faqJsonLd = {"@context":"https://schema.org","@type":"FAQPage",
 mainEntity: faqItems.map((item) => ({"@type":"Question",
 name: item.q,
 acceptedAnswer: {"@type":"Answer", text: item.a },
 })),
 };

 const pClass ="my-3 text-slate-700 leading-relaxed";
 const linkClass ="font-semibold text-sky-900 underline underline-offset-4 hover:text-sky-950 hover:no-underline cursor-pointer";

 return (
 <div className="mw-non-home-page" style={styles.page}>
 <div style={styles.wrap}>
 <PageHero
 eyebrow="Word examples" title="Morse Code Words" description="Explore common word-level Morse examples, spacing guidance, and practice ideas. Use this page for useful words, then move into trainer, sentence, typing, or audio practice.">
 <ActionLinks
 links={[
 { href:"#lookup", label:"Browse words", primary: true },
 { href:"/hello-in-morse-code", label:"HELLO"},
 { href:"/help-in-morse-code", label:"HELP"},
 { href:"/yes-in-morse-code", label:"YES"},
 { href:"/i-love-you-in-morse-code", label:"I love you"},
 { href:"/cq-in-morse-code", label:"CQ"},
 ]}
 />
 </PageHero>

 <section id="lookup">
 <MorsePhraseLookupTable />
 </section>

 <CardSection title="Phrase pages with copy, audio, and breakdowns">
 <p className={pClass}>
 Use these focused phrase pages when you need the exact Morse output,
 clear word spacing, audio links, and a short explanation before copying a
 word into a message, worksheet, puzzle, or practice set.
 </p>
 <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
 {featuredPhrasePages.map((page) => (
 <a
 key={page.path}
 href={page.path}
 className="mw-button-outline mw-related-tool-link block cursor-pointer rounded-xl bg-[#fffdf8] p-4 text-sky-950 hover:bg-[#fffaf2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">
 <span className="block text-lg font-extrabold">{page.label}</span>
 <span className="mt-2 block break-words font-mono text-sm font-bold tracking-[0.12em] text-slate-950">
 {page.morseValue.replace(/\s{7,}/g, " / ")}
 </span>
 <span className="mt-3 block text-sm leading-relaxed text-slate-700">
 {page.context[0]?.text ?? page.metaDescription}
 </span>
 </a>
 ))}
 </div>
 </CardSection>

 <ReferenceSupportSections
 guide={{
 eyebrow:"Word practice",
 title:"How to use Morse word examples",
 description:"Use this page when you want useful words and phrase ideas before moving into active practice.",
 items:[
 {
 title:"Who it is for",
 text:"Learners, teachers, puzzle makers, and anyone who wants ready word-level examples instead of a blank translator.",
 },
 {
 title:"What words help with",
 text:"Words connect individual letters into patterns, expose spacing mistakes, and make practice feel closer to real messages.",
 },
 {
 title:"How to use it",
 text:"Pick a few short words, check their spacing, listen or type them, then repeat the weak ones in a focused trainer.",
 },
 ],
 }}
 examples={{
 title:"Worked word examples",
 description:"These words are useful because they are short, recognizable, and easy to reuse in practice.",
 items:[
 {
 title:"HELLO",
 morse:".... . .-.. .-.. ---",
 children:(
 <p>
 A common greeting with repeated L patterns. Use it after reviewing
 the{" "}
 <a className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline" href="/morse-code-alphabet">
 alphabet chart
 </a>
 .
 </p>
 ),
 },
 {
 title:"I LOVE YOU",
 morse:morseForText("I LOVE YOU").replace(/\s{7,}/g, " / "),
 children:(
 <p>
 A phrase people often copy for cards, gifts, or engravings. Use the{" "}
 <a className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline" href="/i-love-you-in-morse-code">
 I Love You page
 </a>{" "}
 to check spacing.
 </p>
 ),
 },
 {
 title:"CQ",
 morse:morseForText("CQ"),
 children:(
 <p>
 A common radio calling phrase. See{" "}
 <a className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline" href="/cq-in-morse-code">
 CQ in Morse code
 </a>{" "}
 for meaning and examples.
 </p>
 ),
 },
 {
 title:"HELP",
 morse:".... . .-.. .--.",
 children:(
 <p>
 A short practical word. Keep it separate from emergency signaling
 context unless you specifically need the{" "}
 <a className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline" href="/morse-code-sos">
 SOS pattern
 </a>
 .
 </p>
 ),
 },
 {
 title:"TEST",
 morse:"- . ... -",
 children:(
 <p>
 A useful check word for translation, audio, typing, and puzzle
 workflows because each letter is easy to verify.
 </p>
 ),
 },
 ],
 }}
 mistakes={{
 title:"Common word-practice mistakes",
 description:"Word practice works best when spacing and difficulty stay under control.",
 items:[
 {
 title:"Skipping letters too soon",
 children:(
 <p>
 If a word feels impossible, return to the letters inside it before
 repeating the full word.
 </p>
 ),
 },
 {
 title:"Losing word gaps",
 children:(
 <p>
 Use the{" "}
 <a className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline" href="/morse-code-word-separator">
 word separator
 </a>{" "}
 when copied Morse collapses spaces or mixes slashes with gaps.
 </p>
 ),
 },
 {
 title:"Only practicing visually",
 children:(
 <p>
 Visual examples are useful, but hearing the rhythm in{" "}
 <a className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline" href="/morse-code-audio-practice">
 audio practice
 </a>{" "}
 builds a different skill.
 </p>
 ),
 },
 ],
 }}
 comparison={{
 eyebrow:"Choose a word tool",
 title:"Words vs word trainer vs sentence practice",
 description:"Use the page that matches the level of practice you need.",
 items:[
 {
 title:"Morse words",
 text:"Use this page for common examples, spacing reminders, and ideas for what to practice next.",
 href:"/morse-code-words",
 badge:"Examples",
 },
 {
 title:"Word trainer",
 text:"Use the trainer when you want repeated practice with custom or weak words.",
 href:"/morse-code-word-trainer",
 badge:"Repetition",
 },
 {
 title:"Sentence practice",
 text:"Use sentence practice when you are ready to read or type words in context.",
 href:"/morse-code-sentence-practice",
 badge:"Context",
 },
 ],
 }}
 nextStep={{
 title:"Best next step after common words",
 description:"Choose the next tool based on whether you need repetition, context, spacing, or speed.",
 links:[
 { href:"/morse-code-word-trainer", label:"Train custom words", primary:true },
 { href:"/hello-in-morse-code", label:"HELLO in Morse" },
 { href:"/help-me-in-morse-code", label:"HELP ME in Morse" },
 { href:"/yes-in-morse-code", label:"YES in Morse" },
 { href:"/i-love-you-in-morse-code", label:"I love you in Morse" },
 { href:"/cq-in-morse-code", label:"CQ in Morse" },
 { href:"/morse-code-sentence-practice", label:"Practice sentences" },
 { href:"/typing", label:"Build typed recall" },
 { href:"/practice", label:"Start general practice" },
 ],
 }}
 />

 <CardSection title="Common Morse code words, plus real-world shorthand">
 <p className={pClass}>
 Common words are a useful next step after the alphabet because they
 train spacing, repeated letters, and real recognition. Once you can
 hear a few short words without spelling every letter in your head,
 you are moving from slow decoding toward practical reading. After the
 basics, you will run into operator shorthand: prosigns, Q-codes, and
 abbreviations used in CW (continuous wave) communication. Those items
 are shorthand rather than ordinary words, but they appear often in
 practice material and radio examples.
 </p>

 <p className={pClass}>
 Below you will find a copy-ready lookup table that mixes everyday
 words (HELLO, THANK YOU, PLEASE) with practical items like SOS, AR,
 SK, QSL, QRZ, and 73. Start with the everyday words, then use the
 shorthand entries when you are ready to compare operating-style terms,
 word spacing, and meaning in one place.
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

 <CardSection title="Choosing useful Morse words">
 <p className={pClass}>
 Use this page when an alphabet chart is too broad and a blank
 translator gives too little context. Words like HELLO, PLEASE, THANK
 YOU, OK, HELP, and SOS are short enough to copy, hear, and check in a
 quiz, worksheet, message, or practice session.
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
 of common words and operating shorthand, plus the context that
 prevents formatting mistakes.
 </p>
 </CardSection>

 <CardSection title="What words in Morse code actually means">
 <p className={pClass}>
 Morse code is an encoding system for characters. Each letter (A to
 Z) and number (0 to 9) has a dot and dash pattern. A word in Morse
 code is simply letters placed in sequence to spell the word. That
 sounds obvious, but it matters because spacing is part of what makes
 Morse readable.
 </p>

 <p className={pClass}>
 When Morse is transmitted (audio, keying, flashing light), there are
 timing rules for the gaps inside a letter, between letters, and
 between words. When Morse is shown as text, we represent those gaps
 with spaces and separators. If you copy Morse from different
 sources, the dot and dash patterns usually match, but the spacing
 rules might not. That is why two correct versions can look
 different while still meaning the same thing.
 </p>
 </CardSection>

 <CardSection
 title="Letter spacing, word spacing, and the slash separator" id="spacing">
 <p className={pClass}>
 Clean spacing is the difference between something that decodes
 instantly and something that turns into gibberish. In text form, the
 safest convention is:
 </p>

 <ul className="my-3 ml-5 list-disc text-slate-700 leading-relaxed">
 <li>
 <strong>One space between letters</strong> (example: H E L L O
 becomes{" "}
 <code className="mw-static-code mx-1 rounded bg-[#fffaf2] px-1 py-0.5">
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
 <code className="mw-static-code mx-1 rounded bg-[#fffaf2] px-1 py-0.5">
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

 <JsonLdScript jsonLd={[jsonLd, breadcrumbJsonLd, faqJsonLd]} />
 </div>
 <BreadcrumbTrail current="Morse Code Words" />
 </div>
 );
}
