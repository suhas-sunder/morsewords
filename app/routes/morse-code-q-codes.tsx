import type { Route } from "./+types/morse-code-q-codes";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
 ActionLinks,
 DarkNote,
 PageHero,
 ReferenceTable,
 SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import { playMorsePattern } from "~/client/components/shared/playMorsePattern";
import { Q_CODES } from "~/client/data/morseLearning";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH ="/morse-code-q-codes";

export function links() {
 return [{ rel:"canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
 return seoMeta({
 title:"Morse Code Q-Codes | Meanings, Examples & Audio",
 description:"Browse common Morse Q-codes like QTH, QRM, QRN, QRS, QSL, QSO, QSY, QRT, QRV, and QRZ with meanings, examples, and audio playback.",
 path: CANONICAL_PATH,
 keywords:"morse code q codes, qth meaning, qsl meaning, qso morse, qrs morse, qrz morse",
 });
}

export default function MorseCodeQCodes() {
 const jsonLd = {"@context":"https://schema.org","@type":"CollectionPage",
 name:"Morse Code Q-Codes",
 url: canonicalUrl(CANONICAL_PATH),
 isPartOf: {"@type":"WebSite", name:"MorseWords", url: SITE_URL },
 };

 return (
 <div style={styles.page}>
 <main style={styles.wrap}>
 <PageHero
 eyebrow="Radio shorthand" title="Morse code Q-codes" description="Q-codes are short three-letter signals used to compress radio and Morse messages. Many can be used as statements or questions depending on context." aside={
 <DarkNote label="Example" value="QRS?">
 As a question, QRS? means"shall I send more slowly?"As a
 request, PSE QRS means"please send more slowly."</DarkNote>
 }
 >
 <ActionLinks
 links={[
 { href:"/morse-code-word-trainer", label:"Train Q-codes", primary: true },
 { href:"/audio", label:"Generate audio"},
 { href:"/morse-code-prosigns", label:"View prosigns"},
 ]}
 />
 </PageHero>

 <SectionCard
 eyebrow="Lookup table" title="Common Q-codes used in Morse practice" description="These examples focus on codes learners are likely to see in practice copy, radio examples, and Morse shorthand pages.">
 <ReferenceTable items={Q_CODES} onPlay={(morse) => playMorsePattern(morse)} />
 </SectionCard>

 <SectionCard
 eyebrow="Question or statement" title="How Q-codes change meaning" description="A Q-code can work as a question or a statement. Punctuation and context do the work.">
 <div className="grid gap-3 md:grid-cols-2">
 <div className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
 <h2 className="text-lg font-extrabold text-sky-950">Question</h2>
 <p className="mt-3 font-mono text-base font-bold tracking-[0.14em] text-slate-950">
 QTH?
 </p>
 <p className="mt-3 text-base leading-relaxed text-slate-700">
 Asks: what is your location?
 </p>
 </div>
 <div className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
 <h2 className="text-lg font-extrabold text-sky-950">Statement</h2>
 <p className="mt-3 font-mono text-base font-bold tracking-[0.14em] text-slate-950">
 QTH BOSTON
 </p>
 <p className="mt-3 text-base leading-relaxed text-slate-700">
 Means: my location is Boston.
 </p>
 </div>
 </div>
 </SectionCard>

 <JsonLdScript jsonLd={jsonLd} />
 </main>
 </div>
 );
}
