import * as React from "react";
import type { Route } from "./+types/dictionary";
import {
 ActionLinks,
 PageHero,
} from "~/client/components/shared/MorseLearningLayout";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH ="/dictionary";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
 return [{ rel:"canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
 return seoMeta({
 title:"Morse Code Dictionary | Letters, Numbers, Signals & Q-Codes",
 description:"Look up Morse code letters, numbers, punctuation, prosigns, Q-codes, abbreviations, and phrases in one clean reference built for fast copying and practice.",
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

function normalize(s: string) {
 return s.trim().toLowerCase();
}

async function copyToClipboard(text: string) {
 try {
 await navigator.clipboard.writeText(text);
 } catch {
 // Fallback for older browsers
 const ta = document.createElement("textarea");
 ta.value = text;
 ta.style.position ="fixed";
 ta.style.opacity ="0";
 document.body.appendChild(ta);
 ta.select();
 document.execCommand("copy");
 document.body.removeChild(ta);
 }
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
 <button
 type="button" onClick={async () => {
 await copyToClipboard(value);
 setCopied(true);
 window.setTimeout(() => setCopied(false), 800);
 }}
 className={["rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold cursor-pointer transition-colors focus-visible:outline-none","hover:bg-slate-900 hover:text-sky-100 active:bg-[#fffaf2]",
 compact ?"text-sm":"text-base",
 copied ?"bg-sky-50":"",
 kind ==="Label"?"bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white active:bg-slate-900":"",
 ].join("")}
 style={{ whiteSpace:"nowrap"}}
 aria-label={`Copy ${kind}`}
 >
 {copied ?"Copied": `Copy ${kind}`}
 </button>
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

function Section({
 id,
 title,
 items,
}: {
 id: string;
 title: string;
 items: Entry[];
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

 <DesktopTable items={items} />
 <MobileCards items={items} />

 <div className="pt-3 md:hidden">
 <a
                    href="#top" className="mw-button-outline block cursor-pointer rounded-lg bg-[#fffdf8] px-3 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-sky-100">
 Back to top
 </a>
 </div>
 </section>
 );
}

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

 const characterEntries: Entry[] = [
 // Letters
 { label:"A", morse:".-", meaning:"Letter A", category:"Characters"},
 { label:"B", morse:"-...", meaning:"Letter B", category:"Characters"},
 { label:"C", morse:"-.-.", meaning:"Letter C", category:"Characters"},
 { label:"D", morse:"-..", meaning:"Letter D", category:"Characters"},
 { label:"E", morse:".", meaning:"Letter E", category:"Characters"},
 { label:"F", morse:"..-.", meaning:"Letter F", category:"Characters"},
 { label:"G", morse:"--.", meaning:"Letter G", category:"Characters"},
 { label:"H", morse:"....", meaning:"Letter H", category:"Characters"},
 { label:"I", morse:"..", meaning:"Letter I", category:"Characters"},
 { label:"J", morse:".---", meaning:"Letter J", category:"Characters"},
 { label:"K", morse:"-.-", meaning:"Letter K", category:"Characters"},
 { label:"L", morse:".-..", meaning:"Letter L", category:"Characters"},
 { label:"M", morse:"--", meaning:"Letter M", category:"Characters"},
 { label:"N", morse:"-.", meaning:"Letter N", category:"Characters"},
 { label:"O", morse:"---", meaning:"Letter O", category:"Characters"},
 { label:"P", morse:".--.", meaning:"Letter P", category:"Characters"},
 { label:"Q", morse:"--.-", meaning:"Letter Q", category:"Characters"},
 { label:"R", morse:".-.", meaning:"Letter R", category:"Characters"},
 { label:"S", morse:"...", meaning:"Letter S", category:"Characters"},
 { label:"T", morse:"-", meaning:"Letter T", category:"Characters"},
 { label:"U", morse:"..-", meaning:"Letter U", category:"Characters"},
 { label:"V", morse:"...-", meaning:"Letter V", category:"Characters"},
 { label:"W", morse:".--", meaning:"Letter W", category:"Characters"},
 { label:"X", morse:"-..-", meaning:"Letter X", category:"Characters"},
 { label:"Y", morse:"-.--", meaning:"Letter Y", category:"Characters"},
 { label:"Z", morse:"--..", meaning:"Letter Z", category:"Characters"},

 // Numbers
 { label:"1", morse:".----", meaning:"Number 1", category:"Characters"},
 { label:"2", morse:"..---", meaning:"Number 2", category:"Characters"},
 { label:"3", morse:"...--", meaning:"Number 3", category:"Characters"},
 { label:"4", morse:"....-", meaning:"Number 4", category:"Characters"},
 { label:"5", morse:".....", meaning:"Number 5", category:"Characters"},
 { label:"6", morse:"-....", meaning:"Number 6", category:"Characters"},
 { label:"7", morse:"--...", meaning:"Number 7", category:"Characters"},
 { label:"8", morse:"---..", meaning:"Number 8", category:"Characters"},
 { label:"9", morse:"----.", meaning:"Number 9", category:"Characters"},
 { label:"0", morse:"-----", meaning:"Number 0", category:"Characters"},

 // Punctuation
 { label:".", morse:".-.-.-", meaning:"Period", category:"Characters"},
 { label:",", morse:"--..--", meaning:"Comma", category:"Characters"},
 {
 label:"?",
 morse:"..--..",
 meaning:"Question mark",
 category:"Characters",
 },
 {
 label:"'",
 morse:".----.",
 meaning:"Apostrophe",
 category:"Characters",
 },
 {
 label:"!",
 morse:"-.-.--",
 meaning:"Exclamation",
 category:"Characters",
 },
 { label:"/", morse:"-..-.", meaning:"Slash", category:"Characters"},
 {
 label:"(",
 morse:"-.--.",
 meaning:"Open parenthesis",
 category:"Characters",
 },
 {
 label:")",
 morse:"-.--.-",
 meaning:"Close parenthesis",
 category:"Characters",
 },
 {
 label:"&",
 morse:".-...",
 meaning:"Ampersand",
 category:"Characters",
 },
 { label:":", morse:"---...", meaning:"Colon", category:"Characters"},
 {
 label:";",
 morse:"-.-.-.",
 meaning:"Semicolon",
 category:"Characters",
 },
 { label:"=", morse:"-...-", meaning:"Equals", category:"Characters"},
 { label:"+", morse:".-.-.", meaning:"Plus", category:"Characters"},
 { label:"-", morse:"-....-", meaning:"Hyphen", category:"Characters"},
 {
 label:"_",
 morse:"..--.-",
 meaning:"Underscore",
 category:"Characters",
 },
 {
 label: '"',
 morse:".-..-.",
 meaning:"Quotation mark",
 category:"Characters",
 },
 { label:"@", morse:".--.-.", meaning:"At sign", category:"Characters"},
 ];

 const prosigns: Entry[] = [
 {
 label:"AR",
 morse:".-.-.",
 meaning:"End of message",
 category:"Prosigns",
 },
 {
 label:"AS",
 morse:".-...",
 meaning:"Wait / standby",
 category:"Prosigns",
 },
 {
 label:"BT",
 morse:"-...-",
 meaning:"Pause / new section",
 category:"Prosigns",
 },
 {
 label:"CL",
 morse:"-.-..-..",
 meaning:"Closing station",
 category:"Prosigns",
 },
 {
 label:"KN",
 morse:"-.-.-.",
 meaning:"Invite specific station",
 category:"Prosigns",
 },
 {
 label:"SK",
 morse:"...-.-",
 meaning:"End of contact",
 category:"Prosigns",
 },
 ];

 const qcodes: Entry[] = [
 {
 label:"QRL",
 morse:"--.- .-. .-..",
 meaning:"Is the frequency busy?",
 category:"Q-codes",
 },
 {
 label:"QRZ",
 morse:"--.- .-. --..",
 meaning:"Who is calling me?",
 category:"Q-codes",
 },
 {
 label:"QRS",
 morse:"--.- .-. ...",
 meaning:"Send more slowly",
 category:"Q-codes",
 },
 {
 label:"QRQ",
 morse:"--.- .-. --.-",
 meaning:"Send faster",
 category:"Q-codes",
 },
 {
 label:"QTH",
 morse:"--.- - ....",
 meaning:"My location is…",
 category:"Q-codes",
 },
 {
 label:"QSL",
 morse:"--.- ... .-..",
 meaning:"Acknowledgment / received",
 category:"Q-codes",
 },
 {
 label:"QSY",
 morse:"--.- ... -.--",
 meaning:"Change frequency",
 category:"Q-codes",
 },
 {
 label:"QRM",
 morse:"--.- .-. --",
 meaning:"Man-made interference",
 category:"Q-codes",
 },
 {
 label:"QRN",
 morse:"--.- .-. -.",
 meaning:"Natural interference / static",
 category:"Q-codes",
 },
 {
 label:"QRP",
 morse:"--.- .-. .--.",
 meaning:"Reduce power",
 category:"Q-codes",
 },
 ];

 const abbreviations: Entry[] = [
 {
 label:"73",
 morse:"--... ...--",
 meaning:"Best regards",
 category:"Abbreviations",
 },
 {
 label:"88",
 morse:"---.. ---..",
 meaning:"Love and kisses",
 category:"Abbreviations",
 },
 {
 label:"OM",
 morse:"--- --",
 meaning:"Friendly term for operator",
 category:"Abbreviations",
 },
 {
 label:"YL",
 morse:"-.-- .-..",
 meaning:"Female operator",
 category:"Abbreviations",
 },
 {
 label:"FB",
 morse:"..-. -...",
 meaning:"Fine business (good)",
 category:"Abbreviations",
 },
 {
 label:"HR",
 morse:".... .-.",
 meaning:"Here",
 category:"Abbreviations",
 },
 {
 label:"TNX",
 morse:"- .... -..-",
 meaning:"Thanks",
 category:"Abbreviations",
 },
 {
 label:"CUL",
 morse:"-.-. ..- .-..",
 meaning:"See you later",
 category:"Abbreviations",
 },
 {
 label:"GL",
 morse:"--. .-..",
 meaning:"Good luck",
 category:"Abbreviations",
 },
 {
 label:"GA",
 morse:"--. .-",
 meaning:"Good afternoon",
 category:"Abbreviations",
 },
 {
 label:"GE",
 morse:"--. .",
 meaning:"Good evening",
 category:"Abbreviations",
 },
 {
 label:"GM",
 morse:"--. --",
 meaning:"Good morning",
 category:"Abbreviations",
 },
 ];

 const phrases: Entry[] = [
 {
 label:"HELLO",
 morse:".... . .-.. .-.. ---",
 meaning:"Friendly greeting",
 category:"Phrases",
 },
 {
 label:"GOOD MORNING",
 morse:"--. --- --- -.. -- --- .-. -. .. -. --.",
 meaning:"Polite day greeting",
 category:"Phrases",
 },
 {
 label:"THANK YOU",
 morse:"- .... .- -. -.- -.-- --- ..-",
 meaning:"Gratitude",
 category:"Phrases",
 },
 {
 label:"YES",
 morse:"-.-- . ...",
 meaning:"Affirmative",
 category:"Phrases",
 },
 { label:"NO", morse:"-. ---", meaning:"Negative", category:"Phrases"},
 {
 label:"PLEASE",
 morse:".--. .-.. . .- ... .",
 meaning:"Polite request",
 category:"Phrases",
 },
 {
 label:"LOVE",
 morse:".-.. --- ...- .",
 meaning:"Affection",
 category:"Phrases",
 },
 {
 label:"FRIEND",
 morse:"..-. .-. .. . -. -..",
 meaning:"Companionship",
 category:"Phrases",
 },
 {
 label:"GOODBYE",
 morse:"--. --- --- -.. -... -.-- .",
 meaning:"Sign-off",
 category:"Phrases",
 },
 {
 label:"SOS",
 morse:"... --- ...",
 meaning:"Universal distress",
 category:"Phrases",
 },
 {
 label:"MAYDAY",
 morse:"-- .- -.-- -.. .- -.--",
 meaning:"Distress call",
 category:"Phrases",
 },
 {
 label:"HELP",
 morse:".... . .-.. .--.",
 meaning:"Request assistance",
 category:"Phrases",
 },
 {
 label:"NEED ASSISTANCE",
 morse:"-. . . -.. .- ... ... .. ... - .- -. -.-. .",
 meaning:"Emergency request",
 category:"Phrases",
 },
 {
 label:"STOP",
 morse:"... - --- .--.",
 meaning:"End / stop",
 category:"Phrases",
 },
 {
 label:"THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
 morse:"- .... . --.- ..- .. -.-. -.- -... .-. --- .-- -. ..-. --- -..- .--- ..- -- .--. ... --- ...- . .-. - .... . .-.. .- --.. -.-- -.. --- --.",
 meaning:"Pangram",
 category:"Phrases",
 },
 {
 label:"PACK MY BOX WITH FIVE DOZEN LIQUOR JUGS",
 morse:".--. .- -.-. -.- -- -.-- -... --- -..- .-- .. - .... ..-. .. ...- . -.. --- --.. . -. .-.. .. --.- ..- --- .-. .--- ..- --. ...",
 meaning:"Pangram",
 category:"Phrases",
 },
 {
 label:"MORSE CODE IS FUN",
 morse:"-- --- .-. ... . -.-. --- -.. . .. ... ..-. ..- -.",
 meaning:"Practice phrase",
 category:"Phrases",
 },
 {
 label:"KEEP PRACTICING",
 morse:"-.- . . .--. .--. .-. .- -.-. - .. -.-. .. -. --.",
 meaning:"Encouragement",
 category:"Phrases",
 },
 {
 label:"LISTEN LEARN REPEAT",
 morse:".-.. .. ... - . -. .-.. . .- .-. -. .-. . .--. . .- -",
 meaning:"Training advice",
 category:"Phrases",
 },
 ];

 const sections = [
 { id:"characters", title:"Characters", items: characterEntries },
 { id:"prosigns", title:"Prosigns", items: prosigns },
 { id:"qcodes", title:"Q-codes", items: qcodes },
 { id:"abbreviations", title:"Abbreviations", items: abbreviations },
 { id:"phrases", title:"Phrases", items: phrases },
 ] as const;

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

 return (
      <main id="top" className="mw-non-home-page mx-auto w-full max-w-[1120px] px-4 pt-2 sm:px-6 sm:pt-4 lg:px-8">
 <script
 type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
 />

 <PageHero
 eyebrow="Reference" title="Morse Code Dictionary" description="Look up Morse letters, numbers, punctuation, prosigns, Q-codes, and practice phrases in one clean reference.">
 <ActionLinks
 links={[
 { href:"#characters", label:"Characters", primary: true },
 { href:"#prosigns", label:"Prosigns"},
 { href:"#qcodes", label:"Q-codes"},
 { href:"/morse-code-alphabet", label:"Alphabet chart"},
 ]}
 />
 </PageHero>

 <div className="mw-static-panel mb-4 mt-3 rounded-xl bg-[#fffdf8]/80 p-4">
 <label className="mb-2 block text-sm font-extrabold text-sky-950">
 Filter dictionary
 </label>
 <input
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 placeholder="Type to filter by label, Morse, or meaning…" className="w-full rounded-xl bg-[#fffdf8] px-4 py-3 text-slate-950 transition focus:outline-none focus:ring-0 focus-visible:outline-none"/>
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
 <Section key={s.id} id={s.id} title={s.title} items={s.filteredItems} />
 ))}

 <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-600">
 <ol className="flex flex-wrap items-center gap-2">
 <li>
 <a href="/" className="underline hover:no-underline cursor-pointer">
 Home
 </a>
 </li>
 <li>/</li>
 <li className="font-semibold text-sky-950">Morse Code Dictionary</li>
 </ol>
 </nav>
 </main>
 );
}
