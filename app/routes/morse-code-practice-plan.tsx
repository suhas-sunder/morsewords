import type { Route } from "./+types/morse-code-practice-plan";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
 ActionLinks,
 DarkNote,
 PageHero,
 SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH ="/morse-code-practice-plan";

const faqItems = [
 {
 q:"How often should I practice Morse code?",
 a:"Short daily sessions work better than occasional long sessions. Start with 10 minutes most days, then add a second short block only when accuracy stays steady.",
 },
 {
 q:"Should I practice letters, words, or audio first?",
 a:"Begin with letters and a few short words, then add audio once the basic patterns are familiar. Audio should enter early, but it is easier when you already recognize the simplest shapes.",
 },
 {
 q:"What should I do if I keep missing the same characters?",
 a:"Pull those characters into a smaller drill instead of repeating the full set. Review the pattern, run focused practice, then test it again in words or audio.",
 },
 {
 q:"Is speed more important than accuracy?",
 a:"No. Accuracy comes first. Increase speed only after you can copy a short set cleanly, because rushing usually hides spacing and recognition problems.",
 },
 {
 q:"Which tool should I use for a short practice session?",
 a:"Use quick practice when you want immediate recall drills, word trainer when weak words are the problem, and audio practice when listening recognition needs work.",
 },
];

export function links() {
 return [{ rel:"canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
 return seoMeta({
 title:"Morse Code Practice Plan | Daily Drills and Learning Routine | MorseWords",
 description:"Follow a Morse code practice plan with short drills, learning sequences, mistake fixes, and links to audio, typing, and quiz tools.",
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
 <div className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
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
 const breadcrumbJsonLd = {"@context":"https://schema.org","@type":"BreadcrumbList",
 itemListElement: [
 {"@type":"ListItem", position:1, name:"Home", item: SITE_URL + "/"},
 {"@type":"ListItem", position:2, name:"Morse Code Practice Plan", item: canonicalUrl(CANONICAL_PATH)},
 ],
 };
 const howToJsonLd = {"@context":"https://schema.org","@type":"HowTo",
 name:"Morse Code Practice Plan",
 url: canonicalUrl(CANONICAL_PATH),
 description:"A short Morse code practice routine that combines review, recall drills, listening practice, and a small proof task.",
 isPartOf: {"@type":"WebSite", name:"MorseWords", url: SITE_URL },
 step: [
 {"@type":"HowToStep", name:"Review weak symbols", text:"Start with a short review of letters, numbers, or words that slowed you down in the previous session."},
 {"@type":"HowToStep", name:"Run focused recall", text:"Use quick practice or the word trainer for a few minutes of immediate feedback."},
 {"@type":"HowToStep", name:"Add listening practice", text:"Use audio practice with comfortable timing so Morse becomes a sound pattern, not only a visual pattern."},
 {"@type":"HowToStep", name:"Finish with proof", text:"End with one quiz, sentence prompt, worksheet, or printed review task."},
 ],
 };
 const faqJsonLd = {"@context":"https://schema.org","@type":"FAQPage",
 mainEntity: faqItems.map((item) => ({"@type":"Question",
 name: item.q,
 acceptedAnswer: {"@type":"Answer", text: item.a },
 })),
 };

 return (
 <div className="mw-non-home-page" style={styles.page}>
 <main style={styles.wrap}>
 <PageHero
 eyebrow="Practice routine" title="Morse code practice plan" description="Use this page when you want to know what to practice today, how long to practice, and how to move from alphabet recall into listening, typing, and quiz work." aside={
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

 <div className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
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
 className="mw-button-outline mw-related-tool-link cursor-pointer rounded-xl bg-[#f7f4ee] p-5 text-slate-700 hover:bg-[#fffaf2] hover:text-sky-950 focus:outline-none">
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

 <ReferenceSupportSections
 guide={{
 eyebrow:"Practice guide",
 title:"What this practice plan helps you do",
 description:"The plan gives each short session a job so practice does not become random repetition. Use it after the learning guide when you are ready for a routine.",
 items:[
 { title:"Choose today\'s focus", text:"Pick one target for the session: weak letters, short words, listening copy, typing recall, or a small quiz.", href:"/practice", badge:"DRILL" },
 { title:"Keep the session short", text:"Use 10-minute blocks so review stays repeatable. Add more time only when accuracy and attention are still good." },
 { title:"Move across modes", text:"Rotate from visual recall into audio practice and typing so Morse becomes readable, hearable, and writable.", href:"/typing", badge:"TYPE" },
 { title:"End with proof", text:"Close the session with one quiz, sentence prompt, or printable worksheet so weak spots are visible for tomorrow.", href:"/morse-code-audio-quiz", badge:"QUIZ" },
 ],
 }}
 examples={{
 title:"Three practical practice scenarios",
 description:"Use these scenarios as templates rather than rules. The goal is to make the next session obvious.",
 items:[
 { title:"10-minute beginner session", morse:"E T A N", children:<>Spend 3 minutes reviewing the simplest letters, 4 minutes in <a href="/practice" className="font-semibold text-sky-900 underline hover:no-underline">quick practice</a>, and 3 minutes hearing or typing only those characters.</> },
 { title:"Weak-letter review", morse:"B D G Q", children:<>When the same letters keep failing, remove everything else for one focused block, then test them again in the <a href="/morse-code-word-trainer" className="font-semibold text-sky-900 underline hover:no-underline">word trainer</a>.</> },
 { title:"Listening progression", morse:"CQ CQ TEST", children:<>After visual recall feels stable, use <a href="/morse-code-audio-practice" className="font-semibold text-sky-900 underline hover:no-underline">audio practice</a> with comfortable spacing, then tighten timing only after accuracy stays clean.</> },
 ],
 }}
 mistakes={{
 title:"Common practice mistakes and fixes",
 description:"Most practice stalls come from doing too much at once. Keep the set small enough that mistakes can be diagnosed.",
 items:[
 { title:"Practicing the full alphabet every time", children:<>Full review is useful occasionally, but daily sessions should isolate weak symbols so improvement is measurable.</> },
 { title:"Chasing speed too early", children:<>Raise WPM only after you can copy a short set accurately. Use the <a href="/morse-code-timing" className="font-semibold text-sky-900 underline hover:no-underline">timing guide</a> when spacing starts causing misses.</> },
 { title:"Avoiding audio practice", children:<>Visual charts help with early memory, but real recognition depends on sound. Add short listening blocks before the symbols feel perfect.</> },
 ],
 }}
 comparison={{
 eyebrow:"Choose a guide",
 title:"Practice plan vs learning guide vs timing pages",
 description:"Use this page for the routine itself. Use nearby guides when you need a broader path or a specific timing explanation.",
 items:[
 { title:"Learn Morse Code", text:"Use the learning guide when you need the bigger beginner sequence before choosing a daily routine.", href:"/learn-morse-code", badge:"LEARN" },
 { title:"Practice Plan", text:"Use this page when you already know the next skill area and need a repeatable session structure." },
 { title:"Morse Code Timing", text:"Use the timing guide when dot length, dash length, WPM, or spacing is causing confusion.", href:"/morse-code-timing", badge:"TIMING" },
 { title:"Farnsworth Timing", text:"Use Farnsworth timing when you want clear character rhythm with wider gaps for learning.", href:"/farnsworth-timing", badge:"SPACING" },
 ],
 }}
 nextStep={{
 title:"Choose your next practice page",
 description:"Start with a short recall drill, then add typing or audio once the day\'s target is clear.",
 links:[
 { href:"/practice", label:"Start quick practice", primary:true },
 { href:"/morse-code-word-trainer", label:"Train words" },
 { href:"/morse-code-audio-practice", label:"Practice audio" },
 { href:"/morse-code-visual-practice", label:"Practice visual" },
 ],
 }}
 />

 <SectionCard
 eyebrow="Tool map" title="When to use each MorseWords tool" description="A practice plan is easier to follow when every tool has a job. Use this map to pick the next page instead of repeating the same drill until it gets stale.">
 <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
 {toolMap.map((tool) => (
 <a
 key={tool.href}
 href={tool.href}
 className="mw-button-outline mw-related-tool-link cursor-pointer rounded-xl bg-[#f7f4ee] p-5 text-slate-700 hover:bg-[#fffaf2] hover:text-sky-950 focus:outline-none">
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
 <div className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
 <h3 className="text-xl font-extrabold text-sky-950">
 Beginners and students
 </h3>
 <p className="mt-3 text-base leading-relaxed text-slate-700">
 Keep the first week small. Work from the alphabet into short
 words, then use the word trainer to repeat missed words before
 moving into sentences.
 </p>
 </div>
 <div className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
 <h3 className="text-xl font-extrabold text-sky-950">
 Radio learners
 </h3>
 <p className="mt-3 text-base leading-relaxed text-slate-700">
 Add audio early. Use Farnsworth spacing for copy practice, then
 test Q-codes, signal reports, and short radio phrases with the
 audio quiz and sentence practice pages.
 </p>
 </div>
 <div className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
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

 <div className="mw-static-tile mt-6 rounded-xl bg-[#f7f4ee] p-5">
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

 <JsonLdScript jsonLd={[breadcrumbJsonLd, howToJsonLd, faqJsonLd]} />
 </main>
 </div>
 );
}
