import type { Route } from "./+types/morse-code-timing";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
 ActionLinks,
 DarkNote,
 PageHero,
 SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH ="/morse-code-timing";

export function links() {
 return [{ rel:"canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
 return seoMeta({
 title:"Morse Code Timing | WPM, Spacing and PARIS Standard",
 description:"Understand Morse timing for dot length, dash length, element gaps, character gaps, word gaps, WPM, PARIS speed, and audio practice settings.",
 path: CANONICAL_PATH,
 keywords:"morse code timing, morse code wpm, PARIS standard morse, dot dash timing, morse code spacing",
 });
}

export default function MorseCodeTiming() {
 const jsonLd = {"@context":"https://schema.org","@type":"TechArticle",
 name:"Morse Code Timing",
 url: canonicalUrl(CANONICAL_PATH),
 about: ["Morse code","WPM","PARIS standard","Farnsworth timing"],
 isPartOf: {"@type":"WebSite", name:"MorseWords", url: SITE_URL },
 };

 return (
 <div style={styles.page}>
 <main style={styles.wrap}>
 <PageHero
 eyebrow="Timing reference" title="Morse code timing, WPM, and the PARIS standard" description="Morse timing is built from one unit: the dot. Dashes, gaps, words, and speed all come from that unit, which is why clean spacing matters when you translate, listen, practice, or print Morse." aside={
 <DarkNote label="Standard rhythm" value="1 : 3 : 7">
 A dot is 1 unit, a dash is 3 units, and the word gap is 7 units.
 MorseWords exports 3 spaces between letters and 7 spaces between
 words to keep that structure visible.
 </DarkNote>
 }
 >
 <ActionLinks
 links={[
 { href:"/audio", label:"Try audio timing", primary: true },
 { href:"/farnsworth-timing", label:"Farnsworth guide"},
 { href:"/sources", label:"View sources"},
 ]}
 />
 </PageHero>

 <SectionCard
 eyebrow="Unit rules" title="The basic Morse timing ratios" description="International Morse timing uses fixed proportions. Speed changes the unit length, but the relationships stay the same.">
 <div className="space-y-2 rounded-xl bg-[#f7f4ee] p-3">
 {[
 ["Dot","1 unit","The shortest signal."],
 ["Dash","3 units","Three times as long as a dot."],
 ["Inside a character","1 unit gap","Gap between dots and dashes within one letter."],
 ["Between letters","3 units","Gap after a completed character."],
 ["Between words","7 units","Gap between words."],
 ].map(([name, units, note]) => (
 <div
 key={name}
 className="grid gap-3 rounded-lg bg-white px-4 py-4 md:grid-cols-[180px_160px_1fr]">
 <p className="font-extrabold text-sky-950">{name}</p>
 <p className="font-mono text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
 {units}
 </p>
 <p className="text-base leading-relaxed text-slate-700">{note}</p>
 </div>
 ))}
 </div>
 </SectionCard>

 <SectionCard
 eyebrow="Speed" title="Why PARIS is used for WPM" description="Morse speed is commonly measured with the standard word PARIS. It is treated as 50 timing units when the trailing word gap is included.">
 <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
 <div className="max-w-[72ch] space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
 <p>
 At 20 WPM, the dot unit is shorter than at 10 WPM. The pattern
 does not change; only the time assigned to each unit changes.
 </p>
 <p>
 The PARIS standard gives tools a consistent way to translate a
 speed setting into a dot length. That is why the audio generator,
 <a
 href="/morse-code-audio-practice" className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline">
 {""}
 audio practice
 </a>
 , and timing explanations all talk about WPM instead of
 inventing page-specific speed labels. Use the{""}
 <a
 href="/audio" className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline">
 full audio generator
 </a>{""}
 when you need downloadable files.
 </p>
 </div>
 <DarkNote label="PARIS pattern" value=".--. .- .-. .. ...">
 Count the signal units and gaps as one standard word. This keeps
 speed controls comparable across tools.
 </DarkNote>
 </div>
 </SectionCard>

 <FaqSectionGeneric
 title="Timing FAQ" items={[
 {
 q:"How long is a dot in Morse code?",
 a:"A dot is one timing unit. Its actual length depends on WPM. Higher WPM makes the unit shorter; lower WPM makes it longer.",
 },
 {
 q:"How long is a dash?",
 a:"A dash is three dot units. If the dot is 60 ms, the dash is 180 ms.",
 },
 {
 q:"What is the difference between letter spacing and word spacing?",
 a:"The standard letter gap is 3 units. The standard word gap is 7 units. MorseWords shows that distinction with 3 spaces between letters and 7 spaces between words in exported Morse.",
 },
 ]}
 />

 <JsonLdScript jsonLd={jsonLd} />
 </main>
 </div>
 );
}
