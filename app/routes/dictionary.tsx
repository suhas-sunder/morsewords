import * as React from "react";
import type { Route } from "./+types/dictionary";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
 ActionButton as SharedActionButton,
 copyTextToClipboard,
} from "~/client/components/shared/ActionControls";
import {
 ActionLinks,
 PageHero,
} from "~/client/components/shared/MorseLearningLayout";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import { PHRASE_ROWS } from "~/client/components/dictionary/dictionaryData";
import { TEXT_TO_MORSE } from "~/client/components/shared/morseUtils";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH ="/dictionary";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
 return [{ rel:"canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
 return seoMeta({
 title:"Morse Code Dictionary | Search Letters, Numbers, and Symbols | MorseWords",
 description:"Use the Morse code dictionary to look up letters, numbers, punctuation, prosigns, Q-codes, abbreviations, and common entries for copying and practice.",
 path: CANONICAL_PATH,
 keywords:"morse code dictionary, morse dictionary, morse code letters, morse code numbers, q codes, morse abbreviations",
 });
}

type Entry = {
 label: string;
 morse: string;
 meaning: string;
 category: string;
};

type DictionarySection = {
 id: string;
 title: string;
 items: Entry[];
};

const CHARACTER_MEANINGS: Record<string, string> = {
 ".": "Period",
 ",": "Comma",
 "?": "Question mark",
 "'": "Apostrophe",
 "!": "Exclamation",
 "/": "Slash",
 "(": "Open parenthesis",
 ")": "Close parenthesis",
 "&": "Ampersand",
 ":": "Colon",
 ";": "Semicolon",
 "=": "Equals",
 "+": "Plus",
 "-": "Hyphen",
 "_": "Underscore",
 '"': "Quotation mark",
 "@": "At sign",
};

const CHARACTER_ORDER = [
 ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
 ..."0123456789".split(""),
 ...Object.keys(TEXT_TO_MORSE).filter(
 (label) => !/^[A-Z0-9]$/.test(label),
 ),
];

function characterMeaning(label: string) {
 if (/^[A-Z]$/.test(label)) return `Letter ${label}`;
 if (/^[0-9]$/.test(label)) return `Number ${label}`;
 return CHARACTER_MEANINGS[label] ?? "Supported symbol";
}

const characterEntries: Entry[] = CHARACTER_ORDER.map((label) => ({
 label,
 morse: TEXT_TO_MORSE[label] ?? "",
 meaning: characterMeaning(label),
 category:"Characters",
})).filter((entry) => entry.morse);

const phraseEntries: Entry[] = PHRASE_ROWS.map((item) => ({
 label: item.phrase,
 morse: item.morse,
 meaning: item.meaning,
 category: item.category,
}));

function entriesForCategory(category: string) {
 return phraseEntries.filter((entry) => entry.category === category);
}

const dictionarySections: DictionarySection[] = [
 { id:"characters", title:"Characters", items: characterEntries },
 { id:"prosigns", title:"Prosigns", items: entriesForCategory("Prosigns") },
 { id:"qcodes", title:"Q-codes", items: entriesForCategory("Q-codes") },
 {
 id:"abbreviations",
 title:"Abbreviations",
 items: entriesForCategory("Abbreviations"),
 },
 { id:"phrases", title:"Phrases", items: entriesForCategory("Phrases") },
];

function normalize(s: string) {
 return s.trim().toLowerCase();
}

function CopyButton({
 kind,
 value,
 compact,
}: {
 kind:"Label"|"Morse";
 value: string;
 compact?: boolean;
}) {
 const [copied, setCopied] = React.useState(false);

 return (
 <SharedActionButton
 unstyled
 onClick={async () => {
 const didCopy = await copyTextToClipboard(value);
 if (!didCopy) return;
 setCopied(true);
 window.setTimeout(() => setCopied(false), 800);
 }}
 className={[
 "rounded-lg px-3 py-2 font-semibold cursor-pointer transition-colors focus-visible:outline-none",
 compact ? "text-sm" : "text-base",
 copied
 ? "bg-sky-50 text-sky-950"
 : kind === "Label"
 ? "bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white active:bg-slate-900"
 : "bg-[#fffdf8] text-slate-900 hover:bg-[#f7f4ee] active:bg-[#fffaf2]",
 ].join(" ")}
 style={{ whiteSpace:"nowrap"}}
 aria-label={`Copy ${kind}`}
 >
 {copied ?"Copied": `Copy ${kind}`}
 </SharedActionButton>
 );
}

function DesktopTable({ items }: { items: Entry[] }) {
 return (
 <div className="mw-static-panel hidden overflow-x-auto rounded-xl bg-[#fffdf8] md:block">
 <table className="w-full text-left">
 <thead className="bg-[#f7f4ee] font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
 <tr>
 <th className="px-4 py-3 w-[14%]">Label</th>
 <th className="px-4 py-3 w-[26%]">Morse</th>
 <th className="px-4 py-3">Meaning</th>
 <th className="px-4 py-3 w-[220px] text-right">Copy</th>
 </tr>
 </thead>
 <tbody className="text-sm">
 {items.map((e) => (
 <tr
 key={`${e.category}-${e.label}-${e.morse}`}
 className="odd:bg-[#fffdf8] even:bg-[#fffaf2]">
 <td className="px-4 py-3 font-semibold text-slate-900">
 {e.label}
 </td>
 <td className="px-4 py-3 font-mono text-slate-900">{e.morse}</td>
 <td className="px-4 py-3 text-slate-700">{e.meaning}</td>
 <td className="px-4 py-3">
 <div className="flex justify-end gap-2">
 <CopyButton kind="Morse" value={e.morse} compact />
 <CopyButton kind="Label" value={e.label} compact />
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 );
}

function MobileCards({ items }: { items: Entry[] }) {
 return (
 <div className="md:hidden space-y-4">
 {items.map((e) => (
 <article
 key={`${e.category}-${e.label}-${e.morse}`}
 className="mw-static-panel rounded-xl bg-[#fffdf8] p-4">
 <div className="grid gap-3">
 <div className="grid gap-1">
 <div className="text-xs font-semibold tracking-wide text-slate-500">
 Label
 </div>
 <div className="text-lg font-semibold text-sky-950">
 {e.label}
 </div>
 </div>

 <div className="grid gap-1">
 <div className="text-xs font-semibold tracking-wide text-slate-500">
 Morse
 </div>
 <div className="font-mono text-base text-slate-900">{e.morse}</div>
 </div>

 <div className="grid gap-1">
 <div className="text-xs font-semibold tracking-wide text-slate-500">
 Meaning
 </div>
 <div className="text-base text-slate-700">{e.meaning}</div>
 </div>

 <div className="grid grid-cols-2 gap-3 pt-1">
 <CopyButton kind="Morse" value={e.morse} />
 <CopyButton kind="Label" value={e.label} />
 </div>
 </div>
 </article>
 ))}
 </div>
 );
}

function emptyCategoryLabel(title: string) {
 if (title === "Q-codes") return "Q-code";
 return title.replace(/s$/, "").toLowerCase();
}

function Section({
 id,
 title,
 items,
 query,
}: {
 id: string;
 title: string;
 items: Entry[];
 query: string;
}) {
 return (
 <section id={id} className="mb-12 scroll-mt-28">
 <div className="mb-4 flex items-center justify-between gap-3 border-b border-transparent pb-1">
 <h2 className="text-2xl font-extrabold text-sky-950">{title}</h2>
 <a
                    href="#top" className="mw-button-outline inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg bg-[#fffdf8] px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none">
 Top
 </a>
 </div>

 {items.length > 0 ? (
 <>
 <DesktopTable items={items} />
 <MobileCards items={items} />
 </>
 ) : (
 <div className="mw-static-panel rounded-xl bg-[#fffdf8] p-5">
 <p className="text-base leading-relaxed text-slate-700">
 No {emptyCategoryLabel(title)} matches for{" "}
 <span className="font-mono font-bold text-sky-950">{query}</span>.
 Try a character, a Morse pattern like <span className="font-mono">.-</span>,
 or a meaning such as <span className="font-mono">wait</span>.
 </p>
 </div>
 )}

 <div className="pt-3 md:hidden">
 <a
                    href="#top" className="mw-button-outline block cursor-pointer rounded-lg bg-[#fffdf8] px-3 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-sky-100">
 Back to top
 </a>
 </div>
 </section>
 );
}

const faqItems = [
 {
 q:"What is included in this Morse code dictionary?",
 a:"The dictionary includes letters, numbers, common punctuation, prosigns, Q-codes, abbreviations, and practice phrases so you can look up a specific entry quickly.",
 },
 {
 q:"Is this the same as the Morse code alphabet page?",
 a:"No. The alphabet page is focused on A-Z letter memorization. The dictionary is broader and is better when you need to search or copy one specific entry.",
 },
 {
 q:"Can I search punctuation in the dictionary?",
 a:"Yes. You can filter by the punctuation mark, its Morse pattern, or its meaning. For a focused punctuation table, use the Morse punctuation page.",
 },
 {
 q:"Why do some entries have longer Morse patterns?",
 a:"Numbers, punctuation, Q-codes, and phrases are longer because they are made from multiple signals or less common symbol patterns, not just one short letter.",
 },
 {
 q:"What should I use after looking up a symbol?",
 a:"Use the decoder to check pasted Morse, the practice page to drill recall, or the international reference when you want the full supported set in one place.",
 },
];

export default function DictionaryRoute() {
 const breadcrumbJsonLd = {"@context":"https://schema.org","@type":"BreadcrumbList",
 itemListElement: [
 {"@type":"ListItem", position: 1, name:"Home", item: SITE_URL +"/"},
 {"@type":"ListItem",
 position: 2,
 name:"Morse Code Dictionary",
 item: CANONICAL_URL,
 },
 ],
 };
 const pageJsonLd = {"@context":"https://schema.org","@type":"CollectionPage",
 name:"Morse Code Dictionary",
 url: CANONICAL_URL,
 description:"A searchable Morse code lookup reference for letters, numbers, punctuation, prosigns, Q-codes, abbreviations, and common entries.",
 isPartOf: {"@type":"WebSite", name:"MorseWords", url: SITE_URL },
 };
 const faqJsonLd = {"@context":"https://schema.org","@type":"FAQPage",
 mainEntity: faqItems.map((item) => ({"@type":"Question",
 name: item.q,
 acceptedAnswer: {"@type":"Answer", text: item.a },
 })),
 };
 const jsonLd = [breadcrumbJsonLd, pageJsonLd, faqJsonLd];

 const sections = dictionarySections;

 const [query, setQuery] = React.useState("");
 const q = normalize(query);

 const filtered = React.useMemo(() => {
 if (!q) return sections.map((s) => ({ ...s, filteredItems: s.items }));
 return sections.map((s) => {
 const filteredItems = s.items.filter((e) => {
 const hay =
 `${e.label} ${e.morse} ${e.meaning} ${e.category}`.toLowerCase();
 return hay.includes(q);
 });
 return { ...s, filteredItems };
 });
 }, [q]);
 const totalMatches = filtered.reduce(
 (sum, section) => sum + section.filteredItems.length,
 0,
 );

 return (
      <main id="top" className="mw-non-home-page mx-auto w-full max-w-[1120px] px-4 pt-2 sm:px-6 sm:pt-4 lg:px-8">
 <JsonLdScript jsonLd={jsonLd} />

 <PageHero
 eyebrow="Lookup reference" title="Morse Code Dictionary" description="Search and look up Morse letters, numbers, punctuation, prosigns, Q-codes, abbreviations, and common entries when you need one specific pattern fast.">
 <ActionLinks
 links={[
 { href:"#characters", label:"Characters", primary: true },
 { href:"#prosigns", label:"Prosigns"},
 { href:"#qcodes", label:"Q-codes"},
 { href:"/morse-code-alphabet", label:"Alphabet chart"},
 { href:"#faq", label:"FAQ"},
 ]}
 />
 </PageHero>

 <div className="mw-static-panel mb-4 mt-3 rounded-xl bg-[#fffdf8]/80 p-4">
 <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
 <label
 htmlFor="dictionary-filter"
 className="block text-sm font-extrabold text-sky-950"
 >
 Filter dictionary
 </label>
 {q ? (
 <SharedActionButton
 unstyled
 type="button"
 onClick={() => setQuery("")}
 className="mw-button-outline inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg bg-[#fffdf8] px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-[#fffaf2] hover:text-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
 >
 Clear filter
 </SharedActionButton>
 ) : null}
 </div>
 <input
 id="dictionary-filter"
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 placeholder="Type to filter by label, Morse, or meaning…" className="w-full rounded-xl bg-[#fffdf8] px-4 py-3 text-slate-950 transition focus:outline-none focus:ring-0 focus-visible:outline-none"/>
 {q ? (
 <p className="mt-3 text-sm font-semibold text-slate-600" aria-live="polite">
 {totalMatches === 1 ? "1 match" : `${totalMatches} matches`} for{" "}
 <span className="font-mono text-sky-950">{query.trim()}</span>
 </p>
 ) : null}
 </div>

 <nav className="mb-8 rounded-xl bg-[#fffdf8]/70 px-3 py-3">
 <div className="flex flex-wrap gap-2 text-sm">
 {sections.map((s) => (
 <a
 key={s.id}
 href={`#${s.id}`}
 className="mw-button-outline cursor-pointer rounded-lg px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none">
 {s.title}
 </a>
 ))}
 </div>
 </nav>

 {filtered.map((s) => (
 <Section
 key={s.id}
 id={s.id}
 title={s.title}
 items={s.filteredItems}
 query={query.trim()}
 />
 ))}

 <ReferenceSupportSections
 guide={{
 eyebrow:"Dictionary guide",
 title:"How to use the Morse code dictionary",
 description:"Use this page as a lookup utility. It is built for finding one character, signal, abbreviation, or phrase quickly, then copying or comparing the result.",
 items:[
 { title:"Who it is for", text:"Use the dictionary when you know what you want to check and need the Morse pattern or meaning without reading a full lesson." },
 { title:"What it includes", text:"The dictionary covers letters, numbers, punctuation, prosigns, Q-codes, abbreviations, and common practice phrases." },
 { title:"How to search", text:"Filter by label, Morse pattern, meaning, or category. Copy the label or Morse pattern from the matching row." },
 ],
 }}
 examples={{
 title:"Worked lookup examples",
 description:"These examples show when the dictionary is useful and when a focused reference page is a better next stop.",
 items:[
 { title:"Look up A", morse:".-", children:<p>A is the letter pattern <strong>.-</strong>. Use the <a href="/morse-code-alphabet" className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline">alphabet page</a> when you want A-Z memorization context.</p> },
 { title:"Look up 5", morse:".....", children:<p>The number 5 is five dits. Compare it with other digits in the <a href="/international-morse-code-reference" className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline">international reference</a> when number spacing matters.</p> },
 { title:"Look up ?", morse:"..--..", children:<p>The question mark has a longer punctuation pattern. The <a href="/morse-code-punctuation" className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline">punctuation page</a> keeps symbol-only examples together.</p> },
 ],
 }}
 mistakes={{
 title:"Common lookup mistakes and fixes",
 description:"Most lookup errors come from using the wrong reference for the task.",
 items:[
 { title:"Using lookup for full messages", children:<p>Use this dictionary for one entry at a time. For full text, use the translator, encoder, or decoder so spacing is handled consistently.</p> },
 { title:"Treating Q-codes as characters", children:<p>Q-codes are shorthand groups made from letters. They are useful in radio-style examples, but they are not single-character Morse symbols.</p> },
 { title:"Mixing slash meanings", children:<p>A slash can be punctuation in text, while written Morse often uses / as a word separator. Check the word separator guide when spacing is the issue.</p> },
 ],
 }}
 comparison={{
 title:"Which Morse reference should I use?",
 description:"The dictionary is the fastest route for lookup, but the alphabet and international reference have different jobs.",
 items:[
 { title:"Dictionary", text:"Use this page when you want to search for a specific character, signal, abbreviation, or phrase.", href:"/dictionary", badge:"Lookup" },
 { title:"Alphabet", text:"Use the alphabet page when you only want to learn or review A-Z letter patterns.", href:"/morse-code-alphabet", badge:"A-Z" },
 { title:"International reference", text:"Use the international reference when you want the broader supported set in one place.", href:"/international-morse-code-reference", badge:"Full set" },
 ],
 }}
 nextStep={{
 title:"Best next step after a lookup",
 description:"After you find the entry, use a tool that matches what you are trying to do with it.",
 links:[
 { href:"/morse-code-decoder", label:"Decode pasted Morse", primary:true },
 { href:"/practice", label:"Practice recall" },
 { href:"/morse-code-punctuation", label:"Punctuation reference" },
 { href:"/morse-code-prosigns", label:"Prosigns" },
 { href:"/morse-code-q-codes", label:"Q-codes" },
 ],
 }}
 />

 <div id="faq">
 <FaqSectionGeneric title="Dictionary FAQ" items={faqItems} />
 </div>

 <BreadcrumbTrail
 current="Morse Code Dictionary"
 placement="contentFooterTight"
 />
 </main>
 );
}
