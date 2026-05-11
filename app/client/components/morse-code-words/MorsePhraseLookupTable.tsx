import * as React from "react";

import {
 ActionButton,
 copyTextToClipboard,
} from "~/client/components/shared/ActionControls";

type Category =
 |"Common"|"Distress"|"Prosign"|"Q-code"|"CW"|"Practice";

type Phrase = {
 phrase: string;
 morse: string;
 meaning: string;
 category: Category;
};

function normalizeForCopy(morse: string) {
 return morse
 .replace(/\s*\/\s*/g,"/")
 .replace(/\s{2,}/g,"")
 .trim();
}

function MorsePhraseLookupTable() {
 const phrases: Phrase[] = [
 // Common words
 {
 phrase:"HELLO",
 morse:".... . .-.. .-.. ---",
 meaning:"Friendly greeting",
 category:"Common",
 },
 {
 phrase:"PLEASE",
 morse:".--. .-.. . .- ... .",
 meaning:"Polite request",
 category:"Common",
 },
 {
 phrase:"THANK YOU",
 morse:"- .... .- -. -.- / -.-- --- ..-",
 meaning:"Expression of gratitude",
 category:"Common",
 },
 {
 phrase:"YES",
 morse:"-.-- . ...",
 meaning:"Affirmative / agreement",
 category:"Common",
 },
 {
 phrase:"NO",
 morse:"-. ---",
 meaning:"Negative / denial",
 category:"Common",
 },
 {
 phrase:"OK",
 morse:"--- -.-",
 meaning:"Confirmation / acknowledgment",
 category:"Common",
 },
 {
 phrase:"LOVE",
 morse:".-.. --- ...- .",
 meaning:"Affection / endearment",
 category:"Common",
 },
 {
 phrase:"GOOD MORNING",
 morse:"--. --- --- -.. / -- --- .-. -. .. -. --.",
 meaning:"Polite day greeting",
 category:"Common",
 },
 {
 phrase:"GOODBYE",
 morse:"--. --- --- -.. -... -.-- .",
 meaning:"Farewell / sign-off",
 category:"Common",
 },

 // Distress references
 {
 phrase:"SOS",
 morse:"... --- ...",
 meaning:"Distress signal reference",
 category:"Distress",
 },
 {
 phrase:"MAYDAY",
 morse:"-- .- -.-- -.. .- -.--",
 meaning:"Distress word reference for aviation or maritime context",
 category:"Distress",
 },
 {
 phrase:"HELP",
 morse:".... . .-.. .--.",
 meaning:"Assistance word for learning and reference",
 category:"Distress",
 },
 {
 phrase:"NEED ASSISTANCE",
 morse:"-. . . -.. / .- ... ... .. ... - .- -. -.-. .",
 meaning:"Assistance phrase reference",
 category:"Distress",
 },

 // Prosigns (procedure signals)
 {
 phrase:"AR (.-.-.)",
 morse:".-.-.",
 meaning:"End of message",
 category:"Prosign",
 },
 {
 phrase:"AS (.-...)",
 morse:".-...",
 meaning:"Wait / standby",
 category:"Prosign",
 },
 {
 phrase:"BT (-...-)",
 morse:"-...-",
 meaning:"Pause / new section",
 category:"Prosign",
 },
 {
 phrase:"CL (-.-..-..)",
 morse:"-.-..-..",
 meaning:"Going off air / closing station",
 category:"Prosign",
 },
 {
 phrase:"KN (-.-.-.)",
 morse:"-.-.-.",
 meaning:"Invitation to transmit specifically",
 category:"Prosign",
 },
 {
 phrase:"SK (...-.-)",
 morse:"...-.-",
 meaning:"End of contact / signing off",
 category:"Prosign",
 },

 // Q-codes (radio shorthand)
 {
 phrase:"QRL",
 morse:"--.- .-. .-..",
 meaning:"Is the frequency busy?",
 category:"Q-code",
 },
 {
 phrase:"QRZ",
 morse:"--.- .-. --..",
 meaning:"Who is calling me?",
 category:"Q-code",
 },
 {
 phrase:"QRS",
 morse:"--.- .-. ...",
 meaning:"Send more slowly",
 category:"Q-code",
 },
 {
 phrase:"QRQ",
 morse:"--.- .-. --.-",
 meaning:"Send faster",
 category:"Q-code",
 },
 {
 phrase:"QTH",
 morse:"--.- - ....",
 meaning:"My location is...",
 category:"Q-code",
 },
 {
 phrase:"QSL",
 morse:"--.- ... .-..",
 meaning:"Message received / acknowledgment",
 category:"Q-code",
 },
 {
 phrase:"QSY",
 morse:"--.- ... -.--",
 meaning:"Change frequency",
 category:"Q-code",
 },
 {
 phrase:"QRM",
 morse:"--.- .-. --",
 meaning:"Interference (man-made)",
 category:"Q-code",
 },
 {
 phrase:"QRN",
 morse:"--.- .-. -.",
 meaning:"Natural interference / static",
 category:"Q-code",
 },
 {
 phrase:"QRP",
 morse:"--.- .-. .--.",
 meaning:"Reduce power",
 category:"Q-code",
 },

 // Abbreviations (CW shorthand)
 {
 phrase:"73",
 morse:"--... ...--",
 meaning:"Best regards (friendly sign-off)",
 category:"CW",
 },
 {
 phrase:"88",
 morse:"---.. ---..",
 meaning:"Love and kisses (friendly end)",
 category:"CW",
 },
 {
 phrase:"OM",
 morse:"--- --",
 meaning:"Old man (friendly term for operator)",
 category:"CW",
 },
 {
 phrase:"YL",
 morse:"-.-- .-..",
 meaning:"Young lady (female operator)",
 category:"CW",
 },
 {
 phrase:"FB",
 morse:"..-. -...",
 meaning:"Fine business (good signal / message)",
 category:"CW",
 },
 {
 phrase:"TNX",
 morse:"- .... .- -. -..-",
 meaning:"Thanks",
 category:"CW",
 },
 {
 phrase:"CUL",
 morse:"-.-. ..- .-..",
 meaning:"See you later",
 category:"CW",
 },
 { phrase:"GL", morse:"--. .-..", meaning:"Good luck", category:"CW"},
 {
 phrase:"GA",
 morse:"--. .-",
 meaning:"Good afternoon",
 category:"CW",
 },
 { phrase:"GE", morse:"--. .", meaning:"Good evening", category:"CW"},
 { phrase:"GM", morse:"--. --", meaning:"Good morning", category:"CW"},

 // Practice phrases (balanced letter frequency)
 {
 phrase:"THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
 morse:"- .... . / --.- ..- .. -.-. -.- / -... .-. --- .-- -. / ..-. --- -..- / .--- ..- -- .--. ... / --- ...- . .-. / - .... . / .-.. .- --.. -.-- / -.. --- --.",
 meaning:"Pangram (uses every letter)",
 category:"Practice",
 },
 {
 phrase:"PACK MY BOX WITH FIVE DOZEN LIQUOR JUGS",
 morse:".--. .- -.-. -.- / -- -.-- / -... --- -..- / .-- .. - .... / ..-. .. ...- . / -.. --- --.. . -. / .-.. .. --.- ..- --- .-. / .--- ..- --. ...",
 meaning:"Another pangram for practice",
 category:"Practice",
 },
 {
 phrase:"MORSE CODE IS FUN",
 morse:"-- --- .-. ... . / -.-. --- -.. . / .. ... / ..-. ..- -.",
 meaning:"Short phrase for beginners",
 category:"Practice",
 },
 {
 phrase:"KEEP PRACTICING",
 morse:"-.- . . .--. / .--. .-. .- -.-. - .. -.-. .. -. --.",
 meaning:"Encouragement to practice regularly",
 category:"Practice",
 },
 {
 phrase:"LISTEN LEARN REPEAT",
 morse:".-.. .. ... - . -. / .-.. . .- .-. -. / .-. . .--. . .- -",
 meaning:"Training advice for beginners",
 category:"Practice",
 },
 ];

 const [query, setQuery] = React.useState("");
 const [category, setCategory] = React.useState<Category |"All">("All");
 const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

 const filtered = React.useMemo(() => {
 const q = query.trim().toLowerCase();
 return phrases.filter((p) => {
 if (category !=="All"&& p.category !== category) return false;
 if (!q) return true;
 return (
 p.phrase.toLowerCase().includes(q) ||
 p.meaning.toLowerCase().includes(q) ||
 p.morse.replace(/\s+/g,"").toLowerCase().includes(q)
 );
 });
 }, [phrases, query, category]);

 async function copy(text: string, key: string) {
 const value = normalizeForCopy(text);
 const didCopy = await copyTextToClipboard(value);
 if (!didCopy) return;
 setCopiedKey(key);
 window.setTimeout(
 () => setCopiedKey((k) => (k === key ? null : k)),
 1100,
 );
 }

 return (
 <section
 className="mt-4 overflow-hidden rounded-xl bg-[#fffaf2]/45" aria-labelledby="morse-words-table-title"itemScope
 itemType="https://schema.org/Table">
 <h2
 id="morse-words-table-title" className="px-5 pt-6 text-3xl font-extrabold tracking-tight text-sky-950 sm:px-8 sm:pt-7 sm:text-4xl" itemProp="name">
 Morse code words and operator shorthand
 </h2>
 <p
 className="mb-5 max-w-[72ch] px-5 pt-4 text-base leading-relaxed text-slate-700 sm:px-8 sm:text-lg" itemProp="description">
 This list combines common everyday words with shorthand used in CW
 practice and radio examples. Word boundaries are shown with a slash (
 <span className="font-mono">/</span>) so it stays readable when copying
 into puzzles, worksheets, or notes.
 </p>

 <div className="mw-static-panel mx-5 mb-5 flex flex-col gap-3 rounded-xl bg-[#fffdf8]/85 p-4 sm:mx-8 md:flex-row md:items-center md:justify-between">
 <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
 <label className="text-sm font-semibold text-sky-950">
 Search
 <input
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 placeholder='Try"SOS","QSL", or"thank"'
 className="mt-1 w-full rounded-xl bg-[#fffdf8] px-3 py-2 text-sm text-slate-950 transition focus:outline-none focus:ring-0 focus-visible:outline-none sm:ml-2 sm:mt-0 sm:w-80"/>
 </label>

 <label className="text-sm font-semibold text-sky-950">
 Category
 <select
 value={category}
 onChange={(e) => setCategory(e.target.value as Category |"All")}
 className="mt-1 cursor-pointer rounded-xl bg-[#fffdf8] px-3 py-2 text-sm text-slate-950 transition hover:bg-[#f7f4ee] focus:outline-none focus:ring-0 focus-visible:outline-none sm:ml-2 sm:mt-0">
 <option value="All">All</option>
 <option value="Common">Common words</option>
 <option value="Distress">Distress references</option>
 <option value="Prosign">Prosigns</option>
 <option value="Q-code">Q-codes</option>
 <option value="CW">CW abbreviations</option>
 <option value="Practice">Practice phrases</option>
 </select>
 </label>
 </div>

 <p className="text-sm text-slate-600">
 Showing{" "}
 <span className="font-semibold text-neutral-900">
 {filtered.length}
 </span>{" "}
 of {phrases.length}
 </p>
 </div>

 <div className="mw-static-panel mx-5 overflow-x-auto rounded-xl bg-[#fffdf8] sm:mx-8">
 <table className="min-w-full -collapse text-sm text-slate-800 md:text-base">
 <thead className="bg-[#f7f4ee] font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
 <tr>
 <th className="py-3 px-3 text-left font-bold">
 Word / Phrase
 </th>
 <th className="py-3 px-3 text-left font-bold">
 Morse
 </th>
 <th className="py-3 px-3 text-left font-bold">
 Meaning
 </th>
 <th className="py-3 px-3 text-left font-bold">Copy</th>
 </tr>
 </thead>
 <tbody>
 {filtered.map((p) => {
 const key = `${p.category}:${p.phrase}`;
 const copied = copiedKey === key;
 return (
 <tr
 key={key}
 className="odd:bg-[#fffdf8] even:bg-[#fffaf2]">
 <td className="py-3 px-3 font-semibold text-slate-950">
 {p.phrase}
 </td>
 <td className="py-3 px-3 font-mono break-words text-sky-950 tracking-wide">
 {normalizeForCopy(p.morse)}
 <span className="sr-only">{p.category}</span>
 </td>
 <td className="py-3 px-3 text-slate-700">
 {p.meaning}
 </td>
 <td className="py-3 px-3">
 <ActionButton
 unstyled
 onClick={() => copy(p.morse, key)}
 className={`rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer transition focus:outline-none ${
 copied
 ?"bg-slate-950 text-sky-100":"bg-[#fffdf8] text-slate-900 hover:bg-slate-900 hover:text-sky-100"}`}
 aria-label={`Copy Morse for ${p.phrase}`}
 >
 {copied ?"Copied":"Copy"}
 </ActionButton>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>

 <div className="px-5 pb-6 pt-6 text-sm leading-relaxed text-slate-700 space-y-2 sm:px-8 sm:pb-7">
 <p>
 For puzzles and learning, the slash separator is intentionally
 explicit. If you prefer spacing-only Morse, you can replace{" "}
 <span className="font-mono">/</span> with a larger word gap. If a
 decoder chokes on mixed spacing, normalize your separators first.
 </p>
 <p>
 Distress-related entries are reference examples only. In a real
 emergency, use official emergency services and reliable communication
 channels instead of a web lookup page.
 </p>
 <p>
 If you want to generate your own custom word list (for example a class
 roster, a scavenger hunt, or a training set), use the{" "}
 <a
 href="/morse-code-encoder"
 className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
 >
 Morse code encoder
 </a>{" "}
 and keep one entry per line. If you want to decode something you found
 online, use the{" "}
 <a
 href="/morse-code-decoder"
 className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
 >
 Morse code decoder
 </a>{" "}
 and clean up word boundaries.
 </p>
 </div>
 </section>
 );
}

export default MorsePhraseLookupTable;
