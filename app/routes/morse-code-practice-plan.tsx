import type { Route } from "./+types/morse-code-practice-plan";

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

const CANONICAL_PATH ="/morse-code-practice-plan";

const faqItems = [
 {
 q:"How long should each session be?",
 a:"Start with 10 minutes. If accuracy stays strong, add another short block for audio, sentence copy, or worksheet review.",
 },
 {
 q:"When should I use worksheets?",
 a:"Use worksheets after practice sessions to review weak words, classroom lists, or sentence patterns away from the screen.",
 },
 {
 q:"Should I practice visually or by audio?",
 a:"Use both. Visual practice helps you understand written Morse, while audio practice builds the rhythm needed for real copy.",
 },
 {
 q:"How should I use Farnsworth timing?",
 a:"Keep the character speed comfortable and lower the Farnsworth spacing speed when you need more time between letters or words. That slows spacing only, not the sound of each character.",
 },
 {
 q:"Can teachers use this as a classroom plan?",
 a:"Yes. Use short drills for warm-ups, audio or visual practice for stations, and printable worksheets or word searches for homework, substitute plans, and review.",
 },
];

export function links() {
 return [{ rel:"canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
 return seoMeta({
 title:"Morse Code Practice Plan | 2-Week and 6-Week Routines",
 description:"Follow a practical Morse code routine for beginners, students, teachers, and radio learners using drills, audio copy, visual practice, quizzes, and printable worksheets.",
 path: CANONICAL_PATH,
 keywords:"morse code practice plan, learn morse code schedule, morse code drills, morse code audio practice",
 });
}

const toolMap = [
 {
 href:"/morse-code-alphabet",
 title:"Alphabet chart",
 text:"Use when you need a quick reference for letters, numbers, and common symbols before a drill.",
 },
 {
 href:"/practice",
 title:"Quick drills",
 text:"Use for short recall sessions, weak-symbol review, and fast feedback.",
 },
 {
 href:"/morse-code-word-trainer",
 title:"Word trainer",
 text:"Use after alphabet drills so letters become words and repeated chunks.",
 },
 {
 href:"/morse-code-audio-practice",
 title:"Audio practice",
 text:"Use for listening copy with WPM, Farnsworth spacing, tone, and repeat controls.",
 },
 {
 href:"/morse-code-visual-practice",
 title:"Visual practice",
 text:"Use for flash-based recognition when you want a light signal instead of tones.",
 },
 {
 href:"/morse-code-sentence-practice",
 title:"Sentence practice",
 text:"Use when words feel easy and you are ready for longer message copy.",
 },
 {
 href:"/typing",
 title:"Typing practice",
 text:"Use for manual dot-dash entry and real-time typed recall.",
 },
 {
 href:"/morse-code-audio-quiz",
 title:"Audio quiz",
 text:"Use when you want scored listening tests and shareable results.",
 },
 {
 href:"/morse-code-visual-quiz",
 title:"Visual quiz",
 text:"Use when you want scored flash-signal tests and shareable results.",
 },
 {
 href:"/morse-code-printable-chart",
 title:"Worksheet builder",
 text:"Use for printable review sheets, answer keys, reference charts, and classroom packets.",
 },
 {
 href:"/morse-code-word-search-builder",
 title:"Word search builder",
 text:"Use for low-prep Morse clue puzzles where students translate first, then find the word.",
 },
];

function PlanList({
 title,
 items,
}: {
 title: string;
 items: Array<{ week: string; task: string; href: string }>;
}) {
 return (
 <div className="rounded-xl bg-[#f7f4ee] p-5">
 <h3 className="text-2xl font-extrabold text-sky-950">{title}</h3>
 <ol className="mt-4 space-y-3">
 {items.map((item) => (
 <li key={item.week} className="grid gap-2 rounded-lg bg-white px-3 py-2 sm:grid-cols-[120px_1fr]">
 <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
 {item.week}
 </span>
 <a href={item.href} className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline">
 {item.task}
 </a>
 </li>
 ))}
 </ol>
 </div>
 );
}

export default function MorseCodePracticePlan() {
 const jsonLd = {"@context":"https://schema.org","@type":"HowTo",
 name:"Morse Code Practice Plan",
 url: canonicalUrl(CANONICAL_PATH),
 isPartOf: {"@type":"WebSite", name:"MorseWords", url: SITE_URL },
 };
 const faqJsonLd = {"@context":"https://schema.org","@type":"FAQPage",
 mainEntity: faqItems.map((item) => ({"@type":"Question",
 name: item.q,
 acceptedAnswer: {"@type":"Answer", text: item.a },
 })),
 };

 return (
 <div style={styles.page}>
 <main style={styles.wrap}>
 <PageHero
 eyebrow="Practice routine" title="Morse code practice plan" description="Use this plan to turn MorseWords from a set of tools into a repeatable routine. Pick the short plan for a focused reset or the longer plan for steadier progress." aside={
 <DarkNote label="Best habit" value="10 MINUTES">
 Short daily sessions beat rare marathon sessions. Review weak
 symbols, then end with one small success.
 </DarkNote>
 }
 >
 <ActionLinks
 links={[
 { href:"/practice", label:"Start practice", primary: true },
 { href:"/morse-code-audio-practice", label:"Audio practice"},
 { href:"/morse-code-printable-chart", label:"Print review"},
 ]}
 />
 </PageHero>

 <SectionCard
 eyebrow="Two paths" title="Choose a 2-week reset or 6-week build" description="Both plans reuse the same pages, but the 6-week path gives more room for listening and sentence work.">
 <div className="grid gap-5 lg:grid-cols-2">
 <PlanList
 title="2-week reset" items={[
 { week:"Days 1-2", task:"Review alphabet and digits", href:"/morse-code-alphabet"},
 { week:"Days 3-5", task:"Run quick recognition drills", href:"/practice"},
 { week:"Days 6-8", task:"Practice common words", href:"/morse-code-word-trainer"},
 { week:"Days 9-11", task:"Copy short audio prompts", href:"/morse-code-audio-practice"},
 { week:"Days 12-14", task:"Test sentences and print weak-word sheets", href:"/morse-code-sentence-practice"},
 ]}
 />
 <PlanList
 title="6-week build" items={[
 { week:"Week 1", task:"Alphabet, numbers, and spacing rules", href:"/morse-code-timing"},
 { week:"Week 2", task:"Daily practice drills with weak-symbol review", href:"/practice"},
 { week:"Week 3", task:"Word trainer and printable word sheets", href:"/morse-code-word-trainer"},
 { week:"Week 4", task:"Audio practice with Farnsworth spacing", href:"/farnsworth-timing"},
 { week:"Week 5", task:"Sentence practice and typing recall", href:"/morse-code-sentence-practice"},
 { week:"Week 6", task:"Audio quiz, visual quiz, and review worksheets", href:"/morse-code-audio-quiz"},
 ]}
 />
 </div>
 </SectionCard>

 <SectionCard
 eyebrow="Practice strategy" title="How to use this Morse code practice plan" description="A good practice plan should match how people actually learn Morse: short sessions, clear spacing, frequent recall, and enough listening work to make the symbols feel like sound instead of memorized marks." aside={
 <DarkNote label="Routine" value="LISTEN + RECALL">
 Start each session with one review block, then finish with a
 small test or worksheet so weak symbols do not disappear.
 </DarkNote>
 }
 >
 <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
 <div className="space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
 <p>
 This routine is built for adults, students, radio learners,
 puzzle makers, and teachers in English-speaking audiences who
 want practical progress without turning Morse into a full-time
 course. Use the{" "}
 <a
 href="/practice" className="font-semibold text-sky-900 underline hover:no-underline">
 quick practice drills
 </a>{" "}
 for symbol recall, then move into the{" "}
 <a
 href="/morse-code-word-trainer" className="font-semibold text-sky-900 underline hover:no-underline">
 word trainer
 </a>{" "}
 so letters become useful chunks.
 </p>
 <p>
 For listening practice, start with a comfortable character
 speed and slower spacing. The{" "}
 <a
 href="/farnsworth-timing" className="font-semibold text-sky-900 underline hover:no-underline">
 Farnsworth timing guide
 </a>{" "}
 explains why slowing gaps can help without ruining the shape of
 each character, while the{" "}
 <a
 href="/morse-code-timing" className="font-semibold text-sky-900 underline hover:no-underline">
 Morse timing guide
 </a>{" "}
 covers dots, dashes, letter gaps, word gaps, and WPM.
 </p>
 <p>
 Once a list feels familiar, switch to{" "}
 <a
 href="/morse-code-audio-practice" className="font-semibold text-sky-900 underline hover:no-underline">
 audio practice
 </a>{" "}
 or the{" "}
 <a
 href="/morse-code-audio-quiz" className="font-semibold text-sky-900 underline hover:no-underline">
 audio quiz
 </a>
 . End the week by printing review with the{" "}
 <a
 href="/morse-code-printable-chart" className="font-semibold text-sky-900 underline hover:no-underline">
 worksheet builder
 </a>{" "}
 or by using{" "}
 <a
 href="/morse-code-sentence-practice" className="font-semibold text-sky-900 underline hover:no-underline">
 sentence practice
 </a>{" "}
 to copy longer phrases.
 </p>
 </div>

 <div className="rounded-xl bg-[#f7f4ee] p-5">
 <h3 className="text-xl font-extrabold text-sky-950">
 Weekly rhythm
 </h3>
 <ul className="mt-4 space-y-3 text-base leading-relaxed text-slate-700">
 <li>
 <strong className="text-sky-950">Review:</strong> 2 minutes
 of weak letters, numbers, or words.
 </li>
 <li>
 <strong className="text-sky-950">Recall:</strong> 5 minutes
 with practice drills or the word trainer.
 </li>
 <li>
 <strong className="text-sky-950">Listen:</strong> 3 minutes
 of audio practice with Farnsworth spacing.
 </li>
 <li>
 <strong className="text-sky-950">Prove it:</strong> one quiz,
 worksheet, or sentence set at the end of the block.
 </li>
 </ul>
 </div>
 </div>
 </SectionCard>

 <SectionCard
 eyebrow="Daily structure" title="A practical 10-minute Morse routine" description="The plan works best when each session has a clear job. Keep the blocks short enough that you can repeat them most days without turning practice into a chore." aside={
 <DarkNote label="Session shape" value="2 + 3 + 3 + 2">
 Review, recall, listen, then prove it with one small test or
 printable review task.
 </DarkNote>
 }
 >
 <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
 {[
 {
 time:"2 min",
 title:"Alphabet or weak-symbol review",
 text:"Scan the alphabet chart, then drill only the letters, numbers, or punctuation marks that still slow you down.",
 href:"/morse-code-alphabet",
 },
 {
 time:"3 min",
 title:"Quick recall drills",
 text:"Use focused practice for immediate feedback. Keep misses visible so the next block has a real target.",
 href:"/practice",
 },
 {
 time:"3 min",
 title:"Word or audio practice",
 text:"Move from symbols into words, or listen with Farnsworth spacing so the gaps are forgiving while the character rhythm stays clean.",
 href:"/morse-code-audio-practice",
 },
 {
 time:"2 min",
 title:"Quiz, sentence, or worksheet proof",
 text:"End with one scored quiz, sentence set, or printed review sheet so progress turns into something concrete.",
 href:"/morse-code-audio-quiz",
 },
 ].map((item) => (
 <a
 key={item.title}
 href={item.href}
 className="cursor-pointer rounded-xl bg-[#f7f4ee] p-5 text-slate-700 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-300">
 <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
 {item.time}
 </p>
 <h3 className="mt-2 text-xl font-extrabold text-sky-950">
 {item.title}
 </h3>
 <p className="mt-3 text-base leading-relaxed">{item.text}</p>
 </a>
 ))}
 </div>
 </SectionCard>

 <SectionCard
 eyebrow="Tool map" title="When to use each MorseWords tool" description="A practice plan is easier to follow when every tool has a job. Use this map to pick the next page instead of repeating the same drill until it gets stale.">
 <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
 {toolMap.map((tool) => (
 <a
 key={tool.href}
 href={tool.href}
 className="cursor-pointer rounded-xl bg-[#f7f4ee] p-5 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-300">
 <h3 className="text-xl font-extrabold text-sky-950">
 {tool.title}
 </h3>
 <p className="mt-2 text-base leading-relaxed text-slate-700">
 {tool.text}
 </p>
 </a>
 ))}
 </div>
 </SectionCard>

 <SectionCard
 eyebrow="Use cases" title="How beginners, radio learners, and teachers can adapt the plan" description="The same routine can support a self-study learner, a classroom, a homeschool lesson, a radio club, or a puzzle workflow. The key is changing the final proof task.">
 <div className="grid gap-6 lg:grid-cols-3">
 <div className="rounded-xl bg-[#f7f4ee] p-5">
 <h3 className="text-xl font-extrabold text-sky-950">
 Beginners and students
 </h3>
 <p className="mt-3 text-base leading-relaxed text-slate-700">
 Keep the first week small. Work from the alphabet into short
 words, then use the word trainer to repeat missed words before
 moving into sentences.
 </p>
 </div>
 <div className="rounded-xl bg-[#f7f4ee] p-5">
 <h3 className="text-xl font-extrabold text-sky-950">
 Radio learners
 </h3>
 <p className="mt-3 text-base leading-relaxed text-slate-700">
 Add audio early. Use Farnsworth spacing for copy practice, then
 test Q-codes, signal reports, and short radio phrases with the
 audio quiz and sentence practice pages.
 </p>
 </div>
 <div className="rounded-xl bg-[#f7f4ee] p-5">
 <h3 className="text-xl font-extrabold text-sky-950">
 Teachers and homeschoolers
 </h3>
 <p className="mt-3 text-base leading-relaxed text-slate-700">
 Use quick drills as warm-ups, audio or visual practice as
 stations, and printable charts or word searches for homework,
 substitute plans, review sheets, and low-prep classroom games.
 </p>
 </div>
 </div>

 <div className="mt-6 rounded-xl bg-[#f7f4ee] p-5">
 <h3 className="text-xl font-extrabold text-sky-950">
 Handling weak symbols and weak words
 </h3>
 <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
 Do not hide mistakes. Move weak letters back into{" "}
 <a
 href="/practice" className="font-semibold text-sky-900 underline hover:no-underline">
 quick practice
 </a>
 , move weak words into the{" "}
 <a
 href="/morse-code-word-trainer" className="font-semibold text-sky-900 underline hover:no-underline">
 word trainer
 </a>
 , and print stubborn lists with the{" "}
 <a
 href="/morse-code-printable-chart" className="font-semibold text-sky-900 underline hover:no-underline">
 worksheet builder
 </a>
 . If listening feels too fast, keep character speed steady and
 lower the Farnsworth spacing speed so only the gaps slow down.
 </p>
 </div>
 </SectionCard>

 <FaqSectionGeneric
 title="Practice plan FAQ" items={faqItems}
 />

 <JsonLdScript jsonLd={[jsonLd, faqJsonLd]} />
 </main>
 </div>
 );
}
