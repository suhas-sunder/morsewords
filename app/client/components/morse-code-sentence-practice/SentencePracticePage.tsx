import * as React from "react";

import {
 ActionButton,
 copyTextToClipboard,
} from "~/client/components/shared/ActionControls";
import Button from "~/client/components/shared/Button";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import ShareResultsButton from "~/client/components/practice/ShareResultsButton";
import {
 HERO_EYEBROW_LINE_CLASS,
 HERO_EYEBROW_ROW_CLASS,
 HERO_EYEBROW_TEXT_CLASS,
 HERO_HEADER_CLASS,
 HERO_LEAD_CLASS,
 HERO_SECTION_CLASS,
 HERO_TITLE_CLASS,
} from "~/client/components/shared/heroStyles";
import { toolControlButtonClass } from "~/client/components/shared/ToolWorkspace";
import type {
 Prompt,
 PromptKind,
} from "~/client/components/practice/PromptCard";
import { checkAnswer } from "~/client/components/practice/practiceEngine";
import {
 normalizeTextForEncoding,
 textToMorse,
} from "~/client/components/shared/practiceMorseUtils";
import SentencePracticeFaq from "~/client/components/morse-code-sentence-practice/SentencePracticeFaq";
import {
 commonPracticeSets,
 difficultyLabels,
 sentenceDrills,
 spacingExamples,
 type Difficulty,
 type SentenceDrill,
} from "~/client/components/morse-code-sentence-practice/SentencePracticeData";

type DrillMode ="text_to_morse"|"morse_to_text"|"mixed";
type SetFilter ="all"|"beginner"|"radio"|"reports"|"spacing";

const TOTAL_QUESTIONS = 8;
const LS_MODE ="mw_sentence_practice_mode";
const LS_DIFFICULTY ="mw_sentence_practice_difficulty";
const LS_SET ="mw_sentence_practice_set";
const LS_BEST_STREAK ="mw_sentence_practice_best_streak";
const DEFAULT_MODE: DrillMode ="morse_to_text";
const DEFAULT_DIFFICULTY: Difficulty |"all" ="all";
const DEFAULT_SET_FILTER: SetFilter ="all";

const difficultyOrder: Difficulty[] = ["easy","medium","hard"];

const setLabels: Record<SetFilter, string> = {
 all:"All sentences",
 beginner:"Beginner",
 radio:"Radio contact",
 reports:"Signal reports",
 spacing:"Spacing control",
};

const setMembership: Record<Exclude<SetFilter,"all">, string[]> = {
 beginner: commonPracticeSets[0]?.items ?? [],
 radio: commonPracticeSets[1]?.items ?? [],
 reports: commonPracticeSets[2]?.items ?? [],
 spacing: commonPracticeSets[3]?.items ?? [],
};

function readStr(key: string, fallback: string) {
 if (typeof window ==="undefined") return fallback;
 try {
 return window.localStorage.getItem(key) || fallback;
 } catch {
 return fallback;
 }
}

function writeStr(key: string, value: string) {
 if (typeof window ==="undefined") return;
 try {
 window.localStorage.setItem(key, value);
 } catch {
 // ignore storage failures
 }
}

function readInt(key: string, fallback: number) {
 const parsed = parseInt(readStr(key, String(fallback)), 10);
 return Number.isFinite(parsed) ? parsed : fallback;
}

function readStoredMode(): DrillMode {
 const savedMode = readStr(LS_MODE,"morse_to_text");
 return savedMode ==="text_to_morse"||
 savedMode ==="morse_to_text"||
 savedMode ==="mixed"? savedMode
 :"morse_to_text";
}

function readStoredDifficulty(): Difficulty |"all" {
 const savedDifficulty = readStr(LS_DIFFICULTY,"all");
 return savedDifficulty ==="easy"||
 savedDifficulty ==="medium"||
 savedDifficulty ==="hard"||
 savedDifficulty ==="all"? savedDifficulty
 :"all";
}

function readStoredSetFilter(): SetFilter {
 const savedSet = readStr(LS_SET,"all");
 return savedSet ==="all"||
 savedSet ==="beginner"||
 savedSet ==="radio"||
 savedSet ==="reports"||
 savedSet ==="spacing"? savedSet
 :"all";
}

function pickKind(mode: DrillMode): PromptKind {
 if (mode ==="mixed")
 return Math.random() < 0.5 ?"text_to_morse":"morse_to_text";
 return mode;
}

function wordCount(text: string) {
 return text.trim().split(/\s+/).filter(Boolean).length;
}

function morseWithWordSlashes(text: string) {
 return textToMorse(text).replace(/ {7}/g,"/").replace(/ {3}/g,"");
}

function canonicalizeSentenceMorse(input: string) {
 const raw = (input ??"")
    .replace(/[•·∙]/g,".")
    .replace(/[–—−]/g,"-")
 .replace(/\t/g,"")
 // Treat pasted line breaks as spacing, not automatic word breaks.
 // Long revealed answers can wrap when copied, and those inserted/newline
 // breaks should not make an otherwise correct Morse sentence fail.
 .replace(/\r\n|\r|\n/g,"");

 const invalid = new Set<string>();
 let cleaned ="";

 for (const ch of raw) {
 if (ch ==="."|| ch ==="-"|| ch ==="/"|| /\s/.test(ch)) {
 cleaned += ch;
 continue;
 }
 invalid.add(ch);
 }

 cleaned = cleaned.trim();
 if (!cleaned) return { value:"", invalidChars: [...invalid] };

 const hasExplicitWordBreaks = /\/|\s{7,}/.test(cleaned);
 const wordChunks = hasExplicitWordBreaks
 ? cleaned.split(/(?:\/|\s{7,})+/)
 : [cleaned];

 const words = wordChunks
 .map((word) => word.trim().split(/\s+/).filter(Boolean).join(""))
 .filter(Boolean);

 return { value: words.join("/"), invalidChars: [...invalid] };
}

function checkSentenceMorseAnswer(prompt: Prompt, answer: string) {
 if (prompt.kind !=="text_to_morse") return checkAnswer(prompt, answer);

 const expected = canonicalizeSentenceMorse(morseWithWordSlashes(prompt.plain));
 const got = canonicalizeSentenceMorse(answer);
 const ok =
 expected.value.length > 0 &&
 got.invalidChars.length === 0 &&
 expected.value === got.value;

 return {
 ok,
 msg: ok ?"Correct":"Not quite. Try again.",
 expected: morseWithWordSlashes(prompt.plain),
 got: answer,
 normalizedExpected: expected.value,
 normalizedGot: got.value,
 };
}

function countMorseSentenceWords(input: string) {
 const normalized = canonicalizeSentenceMorse(input).value;
 if (!normalized) return 0;
 return normalized.split("/").filter(Boolean).length;
}

function difficultyClass(difficulty: Difficulty) {
 if (difficulty ==="easy")
 return"mw-static-tile bg-[#f7f4ee] text-slate-700";
 if (difficulty ==="medium") return"mw-static-tile bg-[#f7f4ee] text-sky-950";
 return"bg-[#fffdf8] text-slate-800";
}

function buildPool(difficulty: Difficulty |"all", setFilter: SetFilter) {
 return sentenceDrills.filter((drill) => {
 const matchesDifficulty =
 difficulty ==="all"|| drill.difficulty === difficulty;
 const matchesSet =
 setFilter ==="all"|| setMembership[setFilter]?.includes(drill.text);
 return matchesDifficulty && matchesSet;
 });
}

function randomDrill(pool: SentenceDrill[]) {
 const source = pool.length > 0 ? pool : sentenceDrills;
 return source[Math.floor(Math.random() * source.length)] ?? sentenceDrills[0];
}

function makePrompt(mode: DrillMode, pool: SentenceDrill[]): Prompt {
 const drill = randomDrill(pool);
 return {
 kind: pickKind(mode),
 plain: drill.text,
 morse: textToMorse(drill.text),
      label: `${difficultyLabels[drill.difficulty]} sentence · ${wordCount(drill.text)} words · ${drill.focus}`,
 };
}

function makeInitialPrompt(mode: DrillMode, pool: SentenceDrill[]): Prompt {
 const source = pool.length > 0 ? pool : sentenceDrills;
 const drill = source[0] ?? sentenceDrills[0];
 const kind: PromptKind = mode ==="mixed"?"morse_to_text":mode;
 return {
 kind,
 plain: drill.text,
 morse: textToMorse(drill.text),
      label: `${difficultyLabels[drill.difficulty]} sentence Â· ${wordCount(drill.text)} words Â· ${drill.focus}`,
 };
}

function renderMorseSpacing(morse: string) {
 return morse.split("") .map((ch, index) => {
 if (ch !=="") return <span key={index}>{ch}</span>;

 return (
 <span
 key={index}
 style={{
 display:"inline-block",
 width:"0.6em",
 backgroundColor:"#dbeaf6",
 opacity: 0.35,
 borderRadius:"6px",
 marginRight:"3px",
 }}
 >
 &nbsp;
 </span>
 );
 });
}

function ToggleButton({
 active,
 children,
 onClick,
}: {
 active: boolean;
 children: React.ReactNode;
 onClick: () => void;
}) {
 return (
 <button
 type="button" onClick={onClick}
 className={`${toolControlButtonClass({
 active,
 size: "sm",
 rounded: "full",
 })} active:scale-95`}
 >
 {children}
 </button>
 );
}

function CopyButton({ text, label }: { text: string; label: string }) {
 const [copied, setCopied] = React.useState(false);

 return (
 <ActionButton
 tone="dark"
 size="sm"
 className="text-center leading-none active:scale-95"
 onClick={async () => {
 const didCopy = await copyTextToClipboard(text);
 setCopied(didCopy);
 if (didCopy) {
 window.setTimeout(() => setCopied(false), 1200);
 }
 }}
 aria-label={label}
 >
 {copied ?"Copied":"Copy"}
 </ActionButton>
 );
}

function MorseLine({ text }: { text: string }) {
 return (
 <code className="mw-static-code block min-w-0 rounded-xl bg-[#f7f4ee] p-3 text-sm sm:text-base font-mono text-neutral-900 whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed">
 {morseWithWordSlashes(text)}
 </code>
 );
}

export default function SentencePracticePage({ jsonLd }: { jsonLd: any }) {
 const initialPool = React.useMemo(
 () => buildPool(DEFAULT_DIFFICULTY, DEFAULT_SET_FILTER),
 [],
 );
 const didResetForInitialSettings = React.useRef(false);
 const [hydrated, setHydrated] = React.useState(false);
 const [mode, setMode] = React.useState<DrillMode>(DEFAULT_MODE);
 const [difficulty, setDifficulty] =
 React.useState<Difficulty |"all">(DEFAULT_DIFFICULTY);
 const [setFilter, setSetFilter] =
 React.useState<SetFilter>(DEFAULT_SET_FILTER);

 const pool = React.useMemo(
 () => buildPool(difficulty, setFilter),
 [difficulty, setFilter],
 );

 const [prompt, setPrompt] = React.useState<Prompt>(() =>
 makeInitialPrompt(DEFAULT_MODE, initialPool),
 );
 const [answer, setAnswer] = React.useState("");
 const [attempts, setAttempts] = React.useState(0);
 const [correct, setCorrect] = React.useState(0);
 const [streak, setStreak] = React.useState(0);
 const [bestStreak, setBestStreak] = React.useState(0);
 const [completed, setCompleted] = React.useState(0);
 const [skipped, setSkipped] = React.useState(0);
 const [solvedThisQuestion, setSolvedThisQuestion] = React.useState(false);
 const [runStartedAt, setRunStartedAt] = React.useState<number | null>(null);
 const [feedback, setFeedback] = React.useState<null | {
 ok: boolean;
 msg: string;
 }>(null);
 const [showHint, setShowHint] = React.useState(false);
 const [showAnswer, setShowAnswer] = React.useState(false);
 const advanceLockedRef = React.useRef(false);

 React.useEffect(() => {
 const storedMode = readStoredMode();
 const storedDifficulty = readStoredDifficulty();
 const storedSetFilter = readStoredSetFilter();
 const storedPool = buildPool(storedDifficulty, storedSetFilter);
 setMode(storedMode);
 setDifficulty(storedDifficulty);
 setSetFilter(storedSetFilter);
 setBestStreak(readInt(LS_BEST_STREAK, 0));
 setPrompt(makePrompt(storedMode, storedPool));
 setHydrated(true);
 }, []);

 React.useEffect(() => {
 if (!hydrated) return;
 writeStr(LS_MODE, mode);
 writeStr(LS_DIFFICULTY, difficulty);
 writeStr(LS_SET, setFilter);
 writeStr(LS_BEST_STREAK, String(bestStreak));
 }, [mode, difficulty, setFilter, bestStreak, hydrated]);

 const resetRun = React.useCallback(() => {
 advanceLockedRef.current = false;
 const nextPrompt = makePrompt(mode, pool);
 setPrompt(nextPrompt);
 setAnswer("");
 setAttempts(0);
 setCorrect(0);
 setStreak(0);
 setCompleted(0);
 setSkipped(0);
 setSolvedThisQuestion(false);
 setRunStartedAt(null);
 setFeedback(null);
 setShowAnswer(false);
 }, [mode, pool]);

 React.useEffect(() => {
 if (!hydrated) return;
 if (!didResetForInitialSettings.current) {
 didResetForInitialSettings.current = true;
 return;
 }
 resetRun();
 }, [mode, difficulty, setFilter, hydrated, resetRun]);

 React.useEffect(() => {
 advanceLockedRef.current = false;
 }, [completed, prompt]);

 const gameOver = completed >= TOTAL_QUESTIONS;
 const questionsShown = gameOver
 ? TOTAL_QUESTIONS
 : Math.min(TOTAL_QUESTIONS, completed + 1);
 const progress = Math.min(
 TOTAL_QUESTIONS,
 completed + (solvedThisQuestion ? 1 : 0),
 );
 const scoredActions = attempts + skipped;
 const accuracy =
 scoredActions > 0
 ? Math.min(100, Math.round((correct / scoredActions) * 100))
 : 0;

 const advanceQuestion = React.useCallback(
 (wasSolved: boolean) => {
 if (gameOver || completed >= TOTAL_QUESTIONS || advanceLockedRef.current)
 return;
 advanceLockedRef.current = true;

 if (runStartedAt === null) setRunStartedAt(Date.now());

 const nextCompleted = Math.min(TOTAL_QUESTIONS, completed + 1);

 if (!wasSolved) {
 setSkipped((value) => Math.min(TOTAL_QUESTIONS, value + 1));
 setStreak(0);
 }

 setCompleted(nextCompleted);
 setAnswer("");
 setSolvedThisQuestion(false);
 setFeedback(null);
 setShowAnswer(false);

 if (nextCompleted < TOTAL_QUESTIONS) {
 setPrompt(makePrompt(mode, pool));
 }
 },
 [completed, gameOver, mode, pool, runStartedAt],
 );

 const nextQuestion = React.useCallback(() => {
 if (!solvedThisQuestion) return;
 advanceQuestion(true);
 }, [advanceQuestion, solvedThisQuestion]);

 const skipQuestion = React.useCallback(() => {
 if (solvedThisQuestion) return;
 advanceQuestion(false);
 }, [advanceQuestion, solvedThisQuestion]);

 const doCheck = React.useCallback(() => {
 if (gameOver || solvedThisQuestion || !answer.trim()) return;
 if (runStartedAt === null) setRunStartedAt(Date.now());

 setAttempts((value) => value + 1);
 const result = checkSentenceMorseAnswer(prompt, answer);

 if (result.ok) {
 const nextStreak = streak + 1;
 setSolvedThisQuestion(true);
 setCorrect((value) => value + 1);
 setStreak(nextStreak);
 setBestStreak((best) => (nextStreak > best ? nextStreak : best));
 setFeedback({
 ok: true,
 msg:"Correct. Move to the next full sentence.",
 });
 return;
 }

 setStreak(0);
 setFeedback({
 ok: false,
 msg:
 prompt.kind ==="text_to_morse"?"Not quite. Check each word gap and try again.":"Not quite. Check the full sentence, not just the first word.",
 });
 }, [answer, gameOver, prompt, runStartedAt, solvedThisQuestion, streak]);

 const expectedAnswer =
 prompt.kind ==="text_to_morse"? morseWithWordSlashes(prompt.plain)
 : prompt.plain;
 const normalizedPreview =
 prompt.kind ==="text_to_morse"? canonicalizeSentenceMorse(answer).value
 : normalizeTextForEncoding(answer);
 const targetWordCount = wordCount(prompt.plain);
 const answerWordCount =
 prompt.kind ==="morse_to_text"? wordCount(answer)
 : countMorseSentenceWords(answer);
 const placeholder =
 prompt.kind ==="text_to_morse"?"Type the full Morse sentence here. Use spaces between letters and / between words if helpful.":"Type the full decoded sentence here, not just the first word.";

 const statusBadge = feedback ? (
 <div
 className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
 feedback.ok
 ?"mw-static-tile bg-[#f7f4ee] text-sky-950":"bg-[#fffdf8] text-slate-800"}`}
 role="status" aria-live="polite">
              <span aria-hidden="true">{feedback.ok ?"✓":"!"}</span>
 <span>{feedback.msg}</span>
 </div>
 ) : null;

 return (
 <div>
 <JsonLdScript jsonLd={jsonLd} />

      <section className={HERO_SECTION_CLASS}>
 <div className={HERO_HEADER_CLASS}>
 <div className={HERO_EYEBROW_ROW_CLASS}>
 <span className={HERO_EYEBROW_LINE_CLASS}/>
 <span className={HERO_EYEBROW_TEXT_CLASS}>
 Sentence practice
 </span>
 </div>
 <h1 className={HERO_TITLE_CLASS}>
 Morse Code Sentence Practice
 </h1>
 <p className={HERO_LEAD_CLASS}>
 Build context and phrase flow with complete Morse code sentences,
 instant answer checks, difficulty filters, and spacing hints for
 full-message practice.
 </p>
 </div>

 <div className="pb-4 pt-4 sm:pb-5 sm:pt-4">
 <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
 <div className="flex w-full flex-wrap gap-2 sm:w-auto">
 <button
 type="button" onClick={() => setMode("text_to_morse")}
 className={`${toolControlButtonClass({
 active: mode ==="text_to_morse",
 size: "md",
 })} w-1/3 sm:w-auto`}
 >
                    Text → Morse
 </button>
 <button
 type="button" onClick={() => setMode("morse_to_text")}
 className={`${toolControlButtonClass({
 active: mode ==="morse_to_text",
 size: "md",
 })} w-1/3 sm:w-auto`}
 >
                    Morse → Text
 </button>
 <button
 type="button" onClick={() => setMode("mixed")}
 className={`${toolControlButtonClass({
 active: mode ==="mixed",
 size: "md",
 })} w-1/3 sm:w-auto`}
 >
 Mixed
 </button>
 </div>

 <div className="lg:ml-auto text-sm text-slate-700 flex flex-wrap items-center gap-3 justify-start lg:justify-end">
 <span>
 Questions:{""}
 <span className="font-semibold text-sky-950">
 {questionsShown}/{TOTAL_QUESTIONS}
 </span>
 </span>
 <span>
 Attempts:{""}
 <span className="font-semibold text-sky-950">{attempts}</span>
 </span>
 <span>
 Correct:{""}
 <span className="font-semibold text-sky-950">{correct}</span>
 </span>
 <span>
 Skipped:{""}
 <span className="font-semibold text-sky-950">{skipped}</span>
 </span>
 <span>
 Accuracy:{""}
 <span className="font-semibold text-sky-950">{accuracy}%</span>
 </span>
 <span>
 Streak:{""}
 <span className="font-semibold text-sky-950">{streak}</span>
 </span>
 <span>
 Best:{""}
 <span className="font-semibold text-sky-950">{bestStreak}</span>
 </span>
 <ShareResultsButton
 title="Morse Code Sentence Practice" subtitle="Sentence drill results" stats={{
 attempts,
 correct,
 progress,
 streak,
 bestStreak,
 totalQuestions: TOTAL_QUESTIONS,
 }}
 runStartedAt={runStartedAt}
 />
 </div>
 </div>

 <div className="mw-static-surface-soft mt-4 rounded-xl bg-[#fffaf2]/45 p-4 sm:p-5">
 {gameOver ? (
 <div className="mw-static-panel rounded-2xl bg-[#fffdf8] p-5 sm:p-6">
 <div className="flex flex-col items-center text-center">
 <div className="mw-static-tile inline-flex items-center rounded-full bg-[#f7f4ee] px-3 py-1 text-sm font-semibold text-neutral-900">
 Sentence session complete
 </div>
 <h2 className="mt-3 text-xl sm:text-2xl font-extrabold text-sky-950">
 Your sentence practice results
 </h2>
 <p className="mt-1 text-sm sm:text-base text-slate-700">
 This session checks full sentences, so accuracy counts skipped
 sentences as missed questions.
 </p>
 </div>

 <div className="mt-5 grid gap-3 sm:grid-cols-3">
 <div className="mw-static-tile rounded-2xl bg-[#f7f4ee] p-4">
 <div className="text-sm font-semibold text-slate-600">
 Questions
 </div>
 <div className="mt-1 text-3xl font-extrabold text-neutral-900">
 {TOTAL_QUESTIONS}/{TOTAL_QUESTIONS}
 </div>
 </div>
 <div className="mw-static-tile rounded-2xl bg-[#f7f4ee] p-4">
 <div className="text-sm font-semibold text-slate-600">
 Attempts
 </div>
 <div className="mt-1 text-3xl font-extrabold text-neutral-900">
 {attempts}
 </div>
 </div>
 <div className="mw-static-tile rounded-2xl bg-[#f7f4ee] p-4">
 <div className="text-sm font-semibold text-slate-600">
 Correct
 </div>
 <div className="mt-1 text-3xl font-extrabold text-neutral-900">
 {correct}
 </div>
 </div>
 <div className="mw-static-tile rounded-2xl bg-[#f7f4ee] p-4">
 <div className="text-sm font-semibold text-slate-600">
 Skipped
 </div>
 <div className="mt-1 text-3xl font-extrabold text-neutral-900">
 {skipped}
 </div>
 </div>
 <div className="mw-static-tile rounded-2xl bg-[#f7f4ee] p-4">
 <div className="text-sm font-semibold text-slate-600">
 Accuracy
 </div>
 <div className="mt-1 text-3xl font-extrabold text-neutral-900">
 {accuracy}%
 </div>
 </div>
 <div className="mw-static-tile rounded-2xl bg-[#f7f4ee] p-4">
 <div className="text-sm font-semibold text-slate-600">
 Best streak
 </div>
 <div className="mt-1 text-3xl font-extrabold text-neutral-900">
 {bestStreak}
 </div>
 </div>
 <div className="mw-static-tile rounded-2xl bg-[#f7f4ee] p-4">
 <div className="text-sm font-semibold text-slate-600">
 Mode
 </div>
 <div className="mt-1 text-lg font-extrabold text-neutral-900">
                    {mode ==="text_to_morse"?"Text → Morse": mode ==="morse_to_text"?"Morse → Text":"Mixed"}
 </div>
 </div>
 </div>

 <div className="mt-5 flex flex-wrap justify-center gap-3">
 <Button type="button" variant="primary" onClick={resetRun}>
 Restart sentence drill
 </Button>
 <ShareResultsButton
 title="Morse Code Sentence Practice" subtitle="Sentence drill results" stats={{
 attempts,
 correct,
 progress,
 streak,
 bestStreak,
 totalQuestions: TOTAL_QUESTIONS,
 skipped,
 }}
 runStartedAt={runStartedAt}
 />
 </div>
 </div>
 ) : (
 <>
 <div className="mw-static-surface-soft rounded-2xl bg-[#fffaf2]/70 p-4 sm:p-5">
 <div className="flex items-center gap-2 justify-between flex-wrap">
 <div className="inline-flex items-center gap-2 flex-wrap">
 <span className="mw-static-tile inline-flex items-center rounded-full bg-[#f7f4ee] px-3 py-1 text-sm font-semibold text-neutral-900">
                  {prompt.kind ==="text_to_morse"?"Text → Morse":"Morse → Text"}
 </span>
 <span className="text-sm text-slate-600">
 {prompt.label}
 </span>
 </div>
 <span className="text-sm font-semibold text-slate-700">
 Question {questionsShown}/{TOTAL_QUESTIONS}
 </span>
 </div>

 <div className="mw-static-panel mt-4 min-h-[120px] rounded-xl bg-[#fffdf8]/85 p-4 font-mono text-2xl leading-relaxed tracking-wide text-slate-950 break-words whitespace-pre-wrap sm:text-3xl">
 {prompt.kind ==="morse_to_text"? renderMorseSpacing(prompt.morse)
 : prompt.plain}
 </div>

 {showHint ? (
 <div className="mt-3 grid gap-3 sm:grid-cols-3">
 <div className="mw-static-surface-soft rounded-xl bg-white p-3">
 <p className="text-xs font-extrabold uppercase tracking-wide text-sky-950">
 Sentence length
 </p>
 <p className="mt-1 text-sm text-slate-700">
 Target: {targetWordCount} words
 </p>
 </div>
 <div className="mw-static-surface-soft rounded-xl bg-white p-3">
 <p className="text-xs font-extrabold uppercase tracking-wide text-sky-950">
 Spacing rule
 </p>
 <p className="mt-1 text-sm text-slate-700">
 Letters get small gaps. Words get larger gaps or
 slashes.
 </p>
 </div>
 <div className="mw-static-surface-soft rounded-xl bg-white p-3">
 <p className="text-xs font-extrabold uppercase tracking-wide text-sky-950">
 Best habit
 </p>
 <p className="mt-1 text-sm text-slate-700">
 Finish the full sentence before checking.
 </p>
 </div>
 </div>
 ) : null}
 </div>

 <div className="mt-5">
 <label
 htmlFor="sentence-answer" className="text-base font-extrabold text-sky-950">
 Your full-sentence answer
 </label>
 <textarea
 id="sentence-answer" value={answer}
 onChange={(event) => setAnswer(event.currentTarget.value)}
 onKeyDown={(event) => {
 if (
 (event.metaKey || event.ctrlKey) &&
 event.key ==="Enter") {
 if (solvedThisQuestion) nextQuestion();
 else doCheck();
 }
 }}
 disabled={gameOver || solvedThisQuestion}
 rows={prompt.kind ==="text_to_morse"? 5 : 4}
 placeholder={placeholder}
 autoComplete="off" spellCheck={false}
 inputMode="text" aria-label="Sentence practice answer" className="mt-2 w-full rounded-xl bg-white p-4 font-mono text-base text-slate-950 outline-none transition focus:ring-0 focus-visible:outline-none disabled:bg-[#f7f4ee] disabled:text-slate-500 sm:text-lg"/>

 <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
 <span>
 Typed words:{""}
 <span className="font-semibold text-sky-950">
 {answerWordCount}
 </span>
 </span>
 <span>
 Target words:{""}
 <span className="font-semibold text-sky-950">
 {targetWordCount}
 </span>
 </span>
 <span>
 Tip:{""}
 <span className="font-semibold text-sky-950">
                  Ctrl/⌘ + Enter checks
 </span>
 </span>
 </div>

 {prompt.kind ==="text_to_morse"&& answer.trim() ? (
 <div className="mw-static-tile mt-3 rounded-xl bg-[#f7f4ee] p-3">
 <p className="text-sm font-bold text-sky-950">
 Normalized Morse preview
 </p>
 <code className="mt-1 block whitespace-pre-wrap break-words font-mono text-sm text-neutral-900">
 {normalizedPreview ||"No valid Morse yet"}
 </code>
 </div>
 ) : null}

 {statusBadge}

 <div className="mt-4 flex flex-wrap gap-3">
 {!solvedThisQuestion ? (
 <Button
 type="button" variant="primary" onClick={doCheck}
 disabled={!answer.trim()}
 >
 Check sentence
 </Button>
 ) : (
 <Button
 type="button" variant="primary" onClick={nextQuestion}
 >
 Next sentence
 </Button>
 )}
 <Button
 type="button" variant="secondary" onClick={() => {
 setAnswer("");
 setFeedback(null);
 }}
 disabled={!answer.trim() || solvedThisQuestion}
 >
 Clear
 </Button>
 <Button
 type="button" variant="ghost" onClick={() => setShowHint((value) => !value)}
 >
 {showHint ?"Hide hints":"Show hints"}
 </Button>
 <Button
 type="button" variant="ghost" onClick={() => setShowAnswer((value) => !value)}
 >
 {showAnswer ?"Hide answer":"Reveal answer"}
 </Button>
 <Button
 type="button" variant="ghost" onClick={skipQuestion}
 disabled={solvedThisQuestion}
 >
 Skip sentence
 </Button>
 </div>

 {showAnswer ? (
 <div className="mw-static-panel mt-4 rounded-2xl bg-[#fffdf8] p-4">
 <p className="text-sm font-extrabold text-sky-950">
 Expected answer
 </p>
 <code className="mt-2 block whitespace-pre-wrap break-words font-mono text-base text-neutral-900">
 {expectedAnswer}
 </code>
 <p className="mt-2 text-sm text-slate-700">
 Use reveal after trying the full sentence. It is useful
 for spacing review, but it will not count as a correct
 attempt.
 </p>
 </div>
 ) : null}
 </div>

 <div className="mt-6 pt-5">
 <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
 <div>
 <p className="text-base font-extrabold text-neutral-900">
 Sentence drill options
 </p>
 <p className="mt-1 text-sm text-slate-600">
 Filter the quiz to short beginner sentences, radio contact
 phrases, signal reports, or spacing-control drills.
 </p>
 </div>
 <div className="flex flex-wrap gap-2 lg:justify-end">
 <ToggleButton
 active={difficulty ==="all"}
 onClick={() => setDifficulty("all")}
 >
 All levels
 </ToggleButton>
 {difficultyOrder.map((item) => (
 <ToggleButton
 key={item}
 active={difficulty === item}
 onClick={() => setDifficulty(item)}
 >
 {difficultyLabels[item]}
 </ToggleButton>
 ))}
 </div>
 </div>

 <div className="mt-4 flex flex-wrap gap-2">
 {(Object.keys(setLabels) as SetFilter[]) .map((item) => (
 <ToggleButton
 key={item}
 active={setFilter === item}
 onClick={() => setSetFilter(item)}
 >
 {setLabels[item]}
 </ToggleButton>
 ))}
 </div>
 </div>
 </>
 )}
 </div>
 </div>
 </section>

 <ReferenceSupportSections
 guide={{
 eyebrow: "Sentence guide",
 title: "Use this page for phrase and context practice",
 description:
 "Sentence practice is the bridge between word drills and real messages. It keeps the task focused on full prompts, word gaps, and meaning across a complete phrase.",
 items: [
 {
 title: "Who it is for",
 text: "Learners who can copy short words and now need sentence rhythm, phrase memory, and cleaner word boundaries.",
 },
 {
 title: "What it trains",
 text: "Full-message copying, text-to-Morse sentence recall, Morse-to-text decoding, and spacing decisions across multiple words.",
 },
 {
 title: "How to use it",
 text: "Choose a direction, filter the sentence set, answer the full prompt, then reveal only after trying the complete sentence.",
 },
 ],
 }}
 examples={{
 title: "Sentence practice scenarios",
 description:
 "Use complete prompts when single-word practice no longer exposes the spacing problems.",
 items: [
 {
 title: "Short sentence",
 morse: "THIS / IS / A / SHORT / TEST",
 children:
 "Start with short sentences when you are learning to hold several word gaps in memory without losing the overall meaning.",
 },
 {
 title: "Spacing in context",
 morse: "SEND / HELP",
 children:
 "Slash-separated words make it clear where one word ends. This is useful before decoding pasted Morse with uncertain spacing.",
 },
 {
 title: "Move beyond words",
 morse: "PLEASE / SEND / AGAIN",
 children:
 "Use sentence prompts after word trainer rounds so repeated words become useful message fragments.",
 },
 ],
 }}
 mistakes={{
 title: "Common sentence practice mistakes",
 description:
 "Most sentence errors come from treating a phrase as disconnected characters instead of a message with word boundaries.",
 items: [
 {
 title: "Practicing sentences too early",
 children:
 "If every word is slow, return to the word trainer. Sentences work best after common words are already recognizable.",
 },
 {
 title: "Ignoring word gaps",
 children:
 "Sentence copy depends on word spacing. Mark word breaks clearly with slashes while reviewing.",
 },
 {
 title: "Revealing too soon",
 children:
 "Reveal is useful for spacing review, but try the full sentence first so you train context and memory.",
 },
 ],
 }}
 comparison={{
 eyebrow: "Choose a practice mode",
 title: "Sentence practice vs word trainer and general practice",
 description:
 "Use sentence practice for phrase flow. Use nearby tools when the problem is smaller or more specific.",
 items: [
 {
 title: "Word trainer",
 text: "Use word trainer for custom words, weak words, and repeated vocabulary before complete phrases.",
 href: "/morse-code-word-trainer",
 },
 {
 title: "General practice",
 text: "Use general practice for shorter mixed prompts across letters, numbers, words, and signals.",
 href: "/practice",
 },
 {
 title: "Decoder and spacing",
 text: "Use the decoder or word separator when pasted Morse has unclear spaces or slashes.",
 href: "/morse-code-word-separator",
 },
 ],
 }}
 nextStep={{
 title: "Move from sentences into real-message practice",
 description:
 "Once sentence spacing feels readable, train the same flow by ear or troubleshoot copied Morse with the conversion tools.",
 links: [
 { href: "/morse-code-word-trainer", label: "Word trainer", primary: true },
 { href: "/morse-code-audio-practice", label: "Audio practice" },
 { href: "/typing", label: "Typing practice" },
 { href: "/morse-code-decoder", label: "Decoder" },
 { href: "/learn-morse-code", label: "Learning path" },
 ],
 }}
 />

 <section className="mw-static-panel mt-8 rounded-2xl bg-[#fffdf8] p-5 sm:p-6">
 <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
 <div>
 <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-950">
 Sentence drill library
 </h2>
 <p className="mt-2 text-slate-700 leading-relaxed">
 Use this library after the interactive drill when you want
 specific Morse code sentences to copy, send, or repeat by
 difficulty.
 </p>
 </div>
 </div>

 <div className="mt-5 grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
 {sentenceDrills.map((drill) => (
 <article
 key={drill.text}
 className="min-w-0 overflow-hidden rounded-2xl bg-[#f7f4ee] p-4">
 <div className="flex min-w-0 items-start justify-between gap-3">
 <h3 className="min-w-0 break-words [overflow-wrap:anywhere] font-mono text-base font-extrabold text-neutral-900">
 {drill.text}
 </h3>
 <span
 className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-extrabold ${difficultyClass(drill.difficulty)}`}
 >
 {difficultyLabels[drill.difficulty]}
 </span>
 </div>
 <p className="mt-2 text-sm font-semibold text-sky-950">
 {drill.focus}
 </p>
 <p className="mt-1 text-sm text-slate-700 leading-relaxed">
 {drill.note}
 </p>
 <div className="mt-3">
 <MorseLine text={drill.text} />
 </div>
 <div className="mt-3 flex flex-wrap gap-2">
 <CopyButton text={drill.text} label={`Copy ${drill.text}`} />
 <CopyButton
 text={morseWithWordSlashes(drill.text)}
 label={`Copy Morse for ${drill.text}`}
 />
 </div>
 </article>
 ))}
 </div>
 </section>

 <section className="mw-static-panel mt-8 rounded-2xl bg-[#fffdf8] p-5 sm:p-6">
 <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-950">
 How spacing works in sentence Morse
 </h2>
 <p className="mt-3 text-slate-700 leading-relaxed">
 Sentence practice is mostly a spacing problem. You are not just
 remembering dots and dashes. You are also learning where one character
 ends, where the next word begins, and how to keep the sentence
 readable at a steady rhythm.
 </p>

 <div className="mt-5 grid min-w-0 gap-4 md:grid-cols-3">
 {spacingExamples.map((example) => (
 <div
 key={example.label}
 className="min-w-0 overflow-hidden rounded-2xl bg-[#f7f4ee] p-4">
 <h3 className="font-extrabold text-sky-950">{example.label}</h3>
 <p className="mt-2 min-w-0 break-words [overflow-wrap:anywhere] font-mono text-xl font-bold text-neutral-900">
 {example.plain}
 </p>
 <MorseLine text={example.plain} />
 <p className="mt-3 text-sm text-slate-700 leading-relaxed">
 {example.explanation}
 </p>
 </div>
 ))}
 </div>

 <div className="mw-static-tile mt-5 rounded-2xl bg-[#f7f4ee] p-4">
 <h3 className="font-extrabold text-sky-950">
 Practical sentence spacing format
 </h3>
 <p className="mt-2 text-slate-700 leading-relaxed">
 On this page, letters are grouped with spaces and word gaps are
 shown with a slash for readability. For example, SEND HELP is shown
 as Morse groups for SEND, then a slash, then Morse groups for HELP.
 That makes sentence Morse easier to review than one long unbroken
 string.
 </p>
 </div>
 </section>

 <section className="mw-static-panel mt-8 rounded-2xl bg-[#fffdf8] p-5 sm:p-6">
 <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-950">
 Common Morse code sentence practice sets
 </h2>
 <p className="mt-3 text-slate-700 leading-relaxed">
 These sets are useful when you want a repeatable routine instead of
 random prompts. Start with the beginner set, then move into radio
 contact phrases and signal reports once full-sentence spacing feels
 natural.
 </p>

 <div className="mt-5 grid min-w-0 gap-4 md:grid-cols-2">
 {commonPracticeSets.map((set) => (
 <article
 key={set.title}
 className="min-w-0 overflow-hidden rounded-2xl bg-[#f7f4ee] p-4">
 <h3 className="text-lg font-extrabold text-sky-950">
 {set.title}
 </h3>
 <p className="mt-2 text-sm text-slate-700 leading-relaxed">
 {set.description}
 </p>
 <ul className="mt-3 space-y-2">
 {set.items.map((item) => (
 <li
 key={item}
 className="rounded-xl bg-white p-3">
 <p className="min-w-0 break-words [overflow-wrap:anywhere] font-mono text-sm font-bold text-neutral-900">
 {item}
 </p>
 <p className="mt-1 min-w-0 break-words [overflow-wrap:anywhere] font-mono text-xs text-slate-600">
 {morseWithWordSlashes(item)}
 </p>
 </li>
 ))}
 </ul>
 </article>
 ))}
 </div>
 </section>

 <section className="mw-static-panel mt-8 rounded-2xl bg-[#fffdf8] p-5 sm:p-6">
 <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-950">
 Why practice complete Morse code sentences?
 </h2>
 <div className="mt-4 grid gap-4 md:grid-cols-3">
 <div className="mw-static-tile rounded-2xl bg-[#f7f4ee] p-5">
 <h3 className="font-extrabold text-sky-950">You train rhythm</h3>
 <p className="mt-2 text-slate-700 leading-relaxed">
 Letters alone do not teach sentence rhythm. Full phrases force you
 to hold a steady pace across multiple words.
 </p>
 </div>
 <div className="mw-static-tile rounded-2xl bg-[#f7f4ee] p-5">
 <h3 className="font-extrabold text-sky-950">You learn word gaps</h3>
 <p className="mt-2 text-slate-700 leading-relaxed">
 Most sentence-copy mistakes come from weak spacing. Practicing
 phrases makes the gaps obvious.
 </p>
 </div>
 <div className="mw-static-tile rounded-2xl bg-[#f7f4ee] p-5">
 <h3 className="font-extrabold text-sky-950">You copy meaning</h3>
 <p className="mt-2 text-slate-700 leading-relaxed">
 Sentences train you to decode useful meaning instead of treating
 every character as a disconnected symbol.
 </p>
 </div>
 </div>
 </section>

 <SentencePracticeFaq />
 </div>
 );
}

