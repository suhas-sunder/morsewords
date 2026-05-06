import * as React from "react";
import type { Route } from "./+types/morse-code-word-trainer";

import {
 CheckCircleIcon,
 CloseIcon,
 CopyIcon,
 ListIcon,
 LoopIcon,
 PlayIcon,
 RefreshIcon,
 ShuffleIcon,
 SoundIcon,
 VisibilityIcon,
 VisibilityOffIcon,
} from "~/client/assets/svg/Icons";
import ShareResultsButton from "~/client/components/practice/ShareResultsButton";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
 ActionLinks,
 DarkNote,
 PageHero,
 SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import ToolHowItWorks from "~/client/components/shared/ToolHowItWorks";
import { toolControlButtonClass } from "~/client/components/shared/ToolWorkspace";
import { textToMorse } from "~/client/components/shared/morseUtils";
import { playMorsePattern } from "~/client/components/shared/playMorsePattern";
import styles from "~/client/components/shared/pageStyles";
import { WORD_LISTS } from "~/client/data/morseLearning";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH ="/morse-code-word-trainer";
const CUSTOM_WORDS_STORAGE_KEY ="mw_word_trainer_custom_words";
const BEST_STREAK_STORAGE_KEY ="mw_word_trainer_best_streak";

type WordListName = keyof typeof WORD_LISTS |"custom";
type TrainerMode ="morse_to_text"|"text_to_morse";
type DeckSource ="list"|"weak";
type FeedbackState ="idle"|"correct"|"incorrect";

type ParsedTrainerWords = {
 words: string[];
 cleanedEntries: number;
 skippedEntries: number;
};

const faqItems = [
 {
 q:"What is the Morse code word trainer for?",
 a:"The word trainer moves beyond single letters. It helps you practice whole words, hear the audio, type the answer, mark weak words, and turn misses into focused review material.",
 },
 {
 q:"Can I use my own word list?",
 a:"Yes. Choose Custom and paste words separated by commas or new lines. MorseWords keeps the custom list locally in your browser.",
 },
 {
 q:"Should I answer with text or Morse?",
 a:"Use Morse to text when you want copy practice. Use text to Morse when you want encoding recall and cleaner written output.",
 },
 {
 q:"How do weak words work?",
 a:"Missed words and words you mark manually are saved in a weak-word list. You can copy them, play them, clear them, or turn them into their own review round.",
 },
 {
 q:"Does the word trainer support Farnsworth timing?",
 a:"Yes. Character speed controls the shape of each letter, while Farnsworth spacing slows the gaps only so learners can copy without changing the character rhythm.",
 },
];

export function links() {
 return [{ rel:"canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
 return seoMeta({
 title:"Morse Code Word Trainer | Custom Word Lists and Audio Review",
 description:"Practice Morse words with built-in or custom lists, audio playback, Farnsworth spacing, weak-word review, shareable results, and worksheet-ready review sets.",
 path: CANONICAL_PATH,
 keywords:"morse code word trainer, morse code words practice, custom morse word list, morse code word practice, morse word audio practice",
 });
}

function createSeededRandom(seed: number) {
 let state = seed >>> 0;
 return () => {
 state += 0x6d2b79f5;
 let t = state;
 t = Math.imul(t ^ (t >>> 15), t | 1);
 t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
 return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
 };
}

function shuffleWords(words: string[], seed: number) {
 const rng = createSeededRandom(seed);
 const copy = [...words];
 for (let index = copy.length - 1; index > 0; index -= 1) {
 const swapIndex = Math.floor(rng() * (index + 1));
 [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
 }
 return copy;
}

function normalizeTrainerWord(raw: string) {
 return raw
 .normalize("NFKC")
 .toUpperCase()
 .replace(/[^A-Z0-9]/g,"")
 .trim();
}

function parseTrainerWords(input: string): ParsedTrainerWords {
 const tokens = input.split(/[\n,]+/);
 const seen = new Set<string>();
 const words: string[] = [];
 let cleanedEntries = 0;
 let skippedEntries = 0;

 for (const token of tokens) {
 const trimmed = token.trim();
 if (!trimmed) continue;

 const normalized = normalizeTrainerWord(trimmed);
 if (!normalized) {
 skippedEntries += 1;
 continue;
 }

 if (normalized !== trimmed.toUpperCase()) cleanedEntries += 1;
 if (seen.has(normalized)) continue;
 seen.add(normalized);
 words.push(normalized);
 }

 return {
 words: words.slice(0, 60),
 cleanedEntries,
 skippedEntries,
 };
}

function normalizeTextAnswer(value: string) {
 return value.trim().replace(/\s+/g,"").toUpperCase();
}

function normalizeMorseAnswer(value: string) {
 return value
 .replace(/[\u00b7\u2022]/g,".")
 .replace(/[\u2013\u2014\u2212]/g,"-")
 .replace(/\s*\/\s*/g,"/")
 .replace(/\s+/g,"")
 .trim();
}

function readStoredString(key: string, fallback: string) {
 if (typeof window ==="undefined") return fallback;
 try {
 return window.localStorage.getItem(key) || fallback;
 } catch {
 return fallback;
 }
}

function readStoredInt(key: string, fallback: number) {
 if (typeof window ==="undefined") return fallback;
 try {
 const raw = window.localStorage.getItem(key);
 const parsed = raw ? Number(raw) : fallback;
 return Number.isFinite(parsed) ? parsed : fallback;
 } catch {
 return fallback;
 }
}

function listLabel(name: WordListName) {
 if (name ==="custom") return"Custom";
 if (name ==="beginner") return"Beginner";
 if (name ==="classroom") return"Classroom";
 return"Radio";
}

function getBuiltInWords(name: Exclude<WordListName,"custom">) {
 return WORD_LISTS[name]
 .map((word) => normalizeTrainerWord(word))
 .filter(Boolean);
}

export default function MorseCodeWordTrainer() {
 const [listName, setListName] = React.useState<WordListName>("beginner");
 const [customWords, setCustomWords] = React.useState(() =>
 readStoredString(CUSTOM_WORDS_STORAGE_KEY, "signal\nteacher\npractice\ncopy"),
 );
 const [mode, setMode] = React.useState<TrainerMode>("morse_to_text");
 const [deckSource, setDeckSource] = React.useState<DeckSource>("list");
 const [deckSeed, setDeckSeed] = React.useState(12053);
 const [promptIndex, setPromptIndex] = React.useState(0);
 const [answer, setAnswer] = React.useState("");
 const [feedback, setFeedback] = React.useState<FeedbackState>("idle");
 const [showAnswer, setShowAnswer] = React.useState(false);
 const [weakWords, setWeakWords] = React.useState<string[]>([]);
 const [attempts, setAttempts] = React.useState(0);
 const [correct, setCorrect] = React.useState(0);
 const [completed, setCompleted] = React.useState(0);
 const [streak, setStreak] = React.useState(0);
 const [bestStreak, setBestStreak] = React.useState(() =>
 readStoredInt(BEST_STREAK_STORAGE_KEY, 0),
 );
 const [runStartedAt, setRunStartedAt] = React.useState<number | null>(null);
 const [wpm, setWpm] = React.useState(18);
 const [farnsworthWpm, setFarnsworthWpm] = React.useState(12);
 const [copyStatus, setCopyStatus] = React.useState("");

 const parsedCustomWords = React.useMemo(
 () => parseTrainerWords(customWords),
 [customWords],
 );
 const sourceWords = React.useMemo(
 () =>
 listName ==="custom"? parsedCustomWords.words
 : getBuiltInWords(listName),
 [listName, parsedCustomWords.words],
 );
 const deckWords =
 deckSource ==="weak"&& weakWords.length > 0 ? weakWords : sourceWords;
 const deck = React.useMemo(
 () => shuffleWords(deckWords, deckSeed),
 [deckSeed, deckWords],
 );
 const roundComplete = deck.length > 0 && promptIndex >= deck.length;
 const activeWord = roundComplete ?"": deck[promptIndex] ??"";
 const activeMorse = textToMorse(activeWord);
 const expectedAnswer =
 mode ==="morse_to_text"? activeWord : normalizeMorseAnswer(activeMorse);
 const normalizedAnswer =
 mode ==="morse_to_text"? normalizeTextAnswer(answer)
 : normalizeMorseAnswer(answer);
 const answerIsCorrect =
 !!activeWord &&
 normalizedAnswer ===
 (mode ==="morse_to_text"? normalizeTextAnswer(expectedAnswer)
 : normalizeMorseAnswer(expectedAnswer));
 const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
 const progressValue = Math.min(promptIndex + (feedback ==="correct"? 1 : 0), deck.length);
 const progressPercent = deck.length
 ? Math.round((progressValue / deck.length) * 100)
 : 0;

 React.useEffect(() => {
 try {
 window.localStorage.setItem(CUSTOM_WORDS_STORAGE_KEY, customWords);
 } catch {
 // Ignore storage failures.
 }
 }, [customWords]);

 React.useEffect(() => {
 try {
 window.localStorage.setItem(BEST_STREAK_STORAGE_KEY, String(bestStreak));
 } catch {
 // Ignore storage failures.
 }
 }, [bestStreak]);

 React.useEffect(() => {
 if (deckSource ==="weak"&& weakWords.length === 0) {
 setDeckSource("list");
 setPromptIndex(0);
 resetPromptOnly();
 }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [deckSource, weakWords.length]);

 function resetPromptOnly() {
 setAnswer("");
 setFeedback("idle");
 setShowAnswer(false);
 setCopyStatus("");
 }

 function resetRoundPosition() {
 setPromptIndex(0);
 setCompleted(0);
 resetPromptOnly();
 }

 function chooseList(name: WordListName) {
 setListName(name);
 setDeckSource("list");
 setDeckSeed(Date.now());
 resetRoundPosition();
 }

 function chooseMode(nextMode: TrainerMode) {
 setMode(nextMode);
 resetRoundPosition();
 }

 function updateCustomWords(value: string) {
 setCustomWords(value);
 setDeckSource("list");
 setDeckSeed(Date.now());
 resetRoundPosition();
 }

 function shuffleDeck() {
 setDeckSeed(Date.now());
 resetRoundPosition();
 }

 function resetSession() {
 setDeckSource("list");
 setDeckSeed(Date.now());
 setAttempts(0);
 setCorrect(0);
 setCompleted(0);
 setStreak(0);
 setRunStartedAt(null);
 setPromptIndex(0);
 resetPromptOnly();
 }

 function practiceWeakWords() {
 if (!weakWords.length) return;
 setDeckSource("weak");
 setDeckSeed(Date.now());
 resetRoundPosition();
 }

 function addWeakWord(word: string) {
 if (!word) return;
 setWeakWords((current) =>
 current.includes(word) ? current : [...current, word],
 );
 }

 function playWord(word = activeWord) {
 const code = textToMorse(word);
 if (!code) return;
 playMorsePattern(code, { wpm, farnsworthWpm });
 }

 function checkAnswer() {
 if (!activeWord || feedback ==="correct") return;
 if (runStartedAt === null) setRunStartedAt(Date.now());

 setAttempts((value) => value + 1);

 if (answerIsCorrect) {
 setFeedback("correct");
 setShowAnswer(true);
 setCorrect((value) => value + 1);
 setCompleted((value) => Math.min(value + 1, deck.length));
 setStreak((value) => {
 const next = value + 1;
 setBestStreak((best) => (next > best ? next : best));
 return next;
 });
 } else {
 setFeedback("incorrect");
 setStreak(0);
 addWeakWord(activeWord);
 }
 }

 function tryAgain() {
 setAnswer("");
 setFeedback("idle");
 setShowAnswer(false);
 }

 function nextWord() {
 if (!activeWord && !roundComplete) return;
 setPromptIndex((value) => Math.min(value + 1, deck.length));
 resetPromptOnly();
 }

 function markWeakAndContinue() {
 if (!activeWord) return;
 addWeakWord(activeWord);
 setStreak(0);
 nextWord();
 }

 async function copyWeakWords() {
 if (!weakWords.length) return;
 try {
 await navigator.clipboard?.writeText(weakWords.join("\n"));
 setCopyStatus("Weak words copied.");
 } catch {
 setCopyStatus("Clipboard copy failed. Select the text and copy it manually.");
 }
 }

 function clearWeakWords() {
 setWeakWords([]);
 setCopyStatus("");
 }

 const jsonLd = {"@context":"https://schema.org","@type":"WebApplication",
 name:"Morse Code Word Trainer",
 url: canonicalUrl(CANONICAL_PATH),
 applicationCategory:"EducationalApplication",
 isPartOf: {"@type":"WebSite", name:"MorseWords", url: SITE_URL },
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
 eyebrow="Word practice" title="Morse code word trainer" description="Practice Morse at the word level with a shuffled deck, audio playback, typed answers, weak-word review, and shareable results. Use a built-in list or paste your own words for classroom, radio, puzzle, or worksheet practice." aside={
 <DarkNote
 label={deckSource ==="weak"?"Weak round":"Current list"}
 value={deckSource ==="weak"?"REVIEW": listLabel(listName).toUpperCase()}
 >
 Word-level practice turns isolated character recall into useful
 chunks. Misses become a review deck instead of dead ends.
 </DarkNote>
 }
 >
 <ActionLinks
 links={[
 { href:"/morse-code-words", label:"Word chart", primary: true },
 { href:"/morse-code-audio-practice", label:"Audio practice"},
 { href:"/morse-code-printable-chart", label:"Make worksheet"},
 ]}
 />
 </PageHero>

 <section className="mw-static-surface-soft mt-8 rounded-xl bg-[#fffaf2]/45 p-5 sm:p-7">
 <div className="pb-4">
 <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
 <div>
 <div className="flex items-center gap-3">
 <span className="h-px w-8 bg-sky-800"/>
 <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
 Training deck
 </span>
 </div>
 <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950">
 Setup, copy, review
 </h2>
 </div>

 <div className="flex flex-wrap gap-2">
 <ToolButton onClick={shuffleDeck} disabled={!deck.length}>
 <ShuffleIcon size={18} title="Shuffle deck"/>
 Shuffle deck
 </ToolButton>
 <ToolButton onClick={resetSession} tone="secondary">
 <RefreshIcon size={18} title="Reset session"/>
 Reset session
 </ToolButton>
 <ToolButton
 onClick={practiceWeakWords}
 disabled={!weakWords.length}
 tone="secondary">
 <LoopIcon size={18} title="Practice weak words"/>
 Practice weak words
 </ToolButton>
 </div>
 </div>
 </div>

 <div className="grid gap-6 pb-2 pt-4 xl:grid-cols-[310px_minmax(0,1fr)_330px]">
 <aside className="space-y-5">
 <div className="mw-static-panel rounded-xl bg-[#fffdf8]/85 p-5">
 <div className="flex items-center gap-2 text-sky-950">
 <ListIcon size={20} title="Word list"/>
 <h3 className="text-xl font-extrabold">Word list</h3>
 </div>

 <div className="mt-4 grid gap-2">
 {(["beginner","classroom","radio","custom"] as const) .map(
 (name) => (
 <ChoiceButton
 key={name}
 active={listName === name}
 onClick={() => chooseList(name)}
 >
 {listLabel(name)}
 </ChoiceButton>
 ),
 )}
 </div>

 {listName ==="custom"? (
 <label className="mt-5 block">
 <span className="text-sm font-extrabold text-sky-950">
 Custom words
 </span>
 <textarea
 value={customWords}
 onChange={(event) => updateCustomWords(event.target.value)}
className="mt-2 min-h-36 w-full rounded-xl bg-[#fffdf8] p-4 font-mono text-sm transition focus:outline-none focus:ring-0 focus-visible:outline-none" placeholder="SIGNAL, RADIO, PRACTICE"/>
 <span className="mt-2 block text-sm leading-relaxed text-slate-600">
 Split words with commas or new lines. Unsupported
 characters are removed before the deck is built.
 </span>
 </label>
 ) : null}

 <NoticeList parsed={parsedCustomWords} listName={listName} />
 </div>

 <div className="mw-static-panel rounded-xl bg-[#fffdf8]/85 p-5">
 <h3 className="text-xl font-extrabold text-sky-950">
 Answer mode
 </h3>
 <div className="mt-4 grid gap-2">
 <ChoiceButton
 active={mode ==="morse_to_text"}
 onClick={() => chooseMode("morse_to_text")}
 >
 Morse to text
 </ChoiceButton>
 <ChoiceButton
 active={mode ==="text_to_morse"}
 onClick={() => chooseMode("text_to_morse")}
 >
 Text to Morse
 </ChoiceButton>
 </div>
 <p className="mt-4 text-sm leading-relaxed text-slate-600">
 Switch modes to train both recognition and encoding recall
 from the same deck.
 </p>
 </div>
 </aside>

 <div className="min-w-0">
 <div className="mw-static-panel rounded-xl bg-[#fffdf8]/85">
 <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
 <div>
 <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
 {deckSource ==="weak"?"Weak-word deck":"Active deck"}
 </p>
 <h2 className="mt-1 text-2xl font-extrabold text-sky-950">
 {roundComplete
 ?"Round complete": mode ==="morse_to_text"?"Copy the Morse word":"Encode the word into Morse"}
 </h2>
 </div>
 <div className="text-right">
 <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
 Progress
 </p>
 <p className="mt-1 text-xl font-black text-sky-950">
 {progressValue} / {deck.length}
 </p>
 </div>
 </div>

 <div className="px-5 py-6">
 <div className="mw-static-surface-soft h-2 overflow-hidden rounded-full bg-[#fffaf2]">
 <div
 className="h-full rounded-full bg-sky-400 transition-all" style={{ width: `${progressPercent}%` }}
 />
 </div>

 <div className="mw-static-panel mt-6 rounded-xl bg-[#fffdf8] p-5">
 <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
 Prompt
 </p>
 <p className="mt-3 min-h-20 break-words font-mono text-4xl font-black tracking-[0.18em] text-slate-950 sm:text-5xl">
 {roundComplete
 ?"DONE": activeWord
 ? mode ==="morse_to_text"? activeMorse
 : activeWord
 :"ADD WORDS"}
 </p>
 <p className="mt-3 text-base leading-relaxed text-slate-600">
 {roundComplete
 ?"Start a new round, shuffle the same list, or switch into weak-word review.": mode ==="morse_to_text"?"Type the plain word that matches the Morse prompt.":"Type the Morse pattern using dots, dashes, and spaces."}
 </p>
 </div>

 <div className="mt-4 flex flex-wrap gap-2">
 <ToolButton onClick={() => playWord()} disabled={!activeWord}>
 <PlayIcon size={18} title="Play word"/>
 Play word
 </ToolButton>
 <ToolButton
 onClick={() => setShowAnswer((value) => !value)}
 disabled={!activeWord}
 tone="secondary">
 {showAnswer ? (
 <VisibilityOffIcon size={18} title="Hide answer"/>
 ) : (
 <VisibilityIcon size={18} title="Reveal answer"/>
 )}
 {showAnswer ?"Hide answer":"Reveal answer"}
 </ToolButton>
 <ToolButton
 onClick={markWeakAndContinue}
 disabled={!activeWord}
 tone="secondary">
 <LoopIcon size={18} title="Mark weak"/>
 Mark weak
 </ToolButton>
 </div>

 <label className="mt-5 block">
 <span className="text-sm font-extrabold text-sky-950">
 Your answer
 </span>
 <input
 value={answer}
 onChange={(event) => {
 setAnswer(event.target.value);
 if (feedback ==="incorrect") setFeedback("idle");
 }}
 onKeyDown={(event) => {
 if (event.key ==="Enter") {
 if (feedback ==="correct") nextWord();
 else if (answer.trim()) checkAnswer();
 }
 }}
 disabled={!activeWord || roundComplete}
 placeholder={
 mode ==="morse_to_text"?"Type the word":"-- --- .-. ..."}
className="mt-2 min-h-12 w-full rounded-xl bg-[#fffdf8] px-4 font-mono text-lg transition focus:outline-none focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-[#fffaf2] disabled:text-slate-400"/>
 </label>

 <div className="mt-4 flex flex-wrap gap-2">
 {feedback ==="correct"? (
 <ToolButton onClick={nextWord}>
 <LoopIcon size={18} title="Next word"/>
 Next word
 </ToolButton>
 ) : (
 <ToolButton
 onClick={checkAnswer}
 disabled={!activeWord || !answer.trim()}
 >
 <CheckCircleIcon size={18} title="Check answer"/>
 Check answer
 </ToolButton>
 )}
 <ToolButton
 onClick={tryAgain}
 disabled={!activeWord || (!answer && feedback ==="idle")}
 tone="secondary">
 <RefreshIcon size={18} title="Try again"/>
 Try again
 </ToolButton>
 <ToolButton
 onClick={nextWord}
 disabled={!activeWord && !roundComplete}
 tone="secondary">
 <LoopIcon size={18} title="Next word"/>
 Skip / next
 </ToolButton>
 </div>

 <FeedbackCard
 state={feedback}
 word={activeWord}
 morse={activeMorse}
 showAnswer={showAnswer}
 mode={mode}
 />
 </div>
 </div>

 {roundComplete ? (
 <div className="mw-static-panel mt-4 rounded-xl bg-[#fffdf8]/85 p-5">
 <h3 className="text-xl font-extrabold text-sky-950">
 Round complete.
 </h3>
 <p className="mt-2 text-base leading-relaxed text-slate-700">
 Shuffle the deck for another pass, or move your weak words
 into a focused review round.
 </p>
 <div className="mt-4 flex flex-wrap gap-2">
 <ToolButton onClick={shuffleDeck}>
 <ShuffleIcon size={18} title="New shuffled round"/>
 New round
 </ToolButton>
 <ToolButton
 onClick={practiceWeakWords}
 disabled={!weakWords.length}
 tone="secondary">
 <LoopIcon size={18} title="Practice weak words"/>
 Weak-word round
 </ToolButton>
 </div>
 </div>
 ) : null}
 </div>

 <aside className="space-y-5">
 <div className="mw-static-panel rounded-xl bg-[#fffdf8]/85 p-5">
 <div className="flex items-center justify-between gap-3">
 <h3 className="text-xl font-extrabold text-sky-950">
 Session
 </h3>
 <ShareResultsButton
 title="Morse Code Word Trainer" subtitle="Word practice results" stats={{
 attempts,
 correct,
 progress: completed,
 streak,
 bestStreak,
 totalQuestions: Math.max(deck.length, 1),
 }}
 runStartedAt={runStartedAt}
 />
 </div>
 <div className="mt-4 grid grid-cols-2 gap-3">
 <StatCard label="Attempts" value={attempts} />
 <StatCard label="Correct" value={correct} />
 <StatCard label="Accuracy" value={`${accuracy}%`} />
 <StatCard label="Streak" value={streak} />
 </div>
 <p className="mt-4 text-sm leading-relaxed text-slate-600">
 Best streak: <strong>{bestStreak}</strong>. Results sharing
 uses only scores and counts, not your custom word text.
 </p>
 </div>

 <div className="mw-static-panel rounded-xl bg-[#fffdf8]/85 p-5">
 <div className="flex items-center gap-2 text-sky-950">
 <SoundIcon size={18} title="Audio settings"/>
 <h3 className="text-xl font-extrabold">Audio settings</h3>
 </div>
 <div className="mt-4 grid gap-5">
 <SliderRow
 label="Character speed" value={wpm}
 min={5}
 max={35}
 step={1}
 unit="WPM" onChange={setWpm}
 />
 <SliderRow
 label="Farnsworth spacing" value={farnsworthWpm}
 min={5}
 max={35}
 step={1}
 unit="WPM" onChange={setFarnsworthWpm}
 help="Slows spacing only."/>
 </div>
 </div>

 <div className="mw-static-panel rounded-xl bg-[#fffdf8]/85 p-5">
 <div className="flex items-center justify-between gap-3">
 <h3 className="text-xl font-extrabold text-sky-950">
 Weak words
 </h3>
 <span className="mw-static-tile rounded-full bg-[#fffaf2] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
 {weakWords.length}
 </span>
 </div>

 {weakWords.length ? (
 <>
 <div className="mt-4 flex flex-wrap gap-2">
 {weakWords.map((word) => (
 <button
 key={word}
 type="button" onClick={() => playWord(word)}
 className="mw-button-outline inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#fffdf8] px-3 py-2 font-mono text-sm font-bold text-slate-900 transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none">
 <PlayIcon size={14} title={`Play ${word}`} />
 {word}
 </button>
 ))}
 </div>
 <div className="mt-4 grid gap-2">
 <ToolButton onClick={practiceWeakWords}>
 <ShuffleIcon size={18} title="Practice weak words"/>
 Practice weak words
 </ToolButton>
 <ToolButton onClick={copyWeakWords} tone="secondary">
 <CopyIcon size={18} title="Copy weak words"/>
 Copy weak words
 </ToolButton>
 <ToolButton onClick={clearWeakWords} tone="secondary">
 <CloseIcon size={18} title="Clear weak words"/>
 Clear weak words
 </ToolButton>
 </div>
 {copyStatus ? (
 <p className="mw-static-panel mt-3 rounded-xl bg-[#fffdf8] px-3 py-2 text-sm font-semibold text-slate-700">
 {copyStatus}
 </p>
 ) : null}
 </>
 ) : (
 <p className="mt-3 text-base leading-relaxed text-slate-700">
 Missed answers and marked prompts collect here. Use weak
 words for the next round, or paste them into a worksheet.
 </p>
 )}

 <div className="mt-5 pt-4">
 <p className="text-sm font-extrabold text-sky-950">
 Use the copied list in:
 </p>
 <div className="mt-3 flex flex-wrap gap-2">
 <MiniLink href="/morse-code-word-search-builder">
 Word search
 </MiniLink>
 <MiniLink href="/morse-code-printable-chart">
 Worksheet
 </MiniLink>
 <MiniLink href="/morse-code-audio-practice">
 Audio practice
 </MiniLink>
 </div>
 </div>
 </div>
 </aside>
 </div>
 </section>

 <ToolHowItWorks
 eyebrow="Word trainer spec" title="How this Morse code word trainer works" description="The word trainer turns a list into a shuffled practice deck. Each prompt can be copied by sight, played as audio, answered in either direction, and sent into weak-word review when it needs more repetition." referenceLabel="Current pattern" referenceValue={activeMorse ||"... --- ..."}
 referenceText="Whole-word practice builds useful chunks after alphabet drills." chips={[
 { label:"Lists", href:"#word-trainer-lists"},
 { label:"Modes", href:"#word-trainer-modes"},
 { label:"Audio", href:"#word-trainer-audio"},
 { label:"Review", href:"#word-trainer-review"},
 ]}
 summary={[
 {
 title:"Deck based",
 text:"Each round uses a shuffled deck so you do not memorize the order.",
 },
 {
 title:"Two answer modes",
 text:"Copy Morse to text or encode the word back into Morse.",
 },
 {
 title:"Weak-word loop",
 text:"Misses become a focused review list you can copy or replay.",
 },
 ]}
 details={[
 {
 kicker:"Word source",
 title:"Lists",
 text:"Choose beginner, classroom, radio, or custom words. Custom lists accept new lines and commas, dedupe repeated entries, and stay local to your browser.",
 },
 {
 kicker:"Recall direction",
 title:"Modes",
 text:"Morse to text is best for reading and copying. Text to Morse is better when you want to write clean code from memory and catch spacing mistakes.",
 },
 {
 kicker:"Listening support",
 title:"Audio",
 text:"Every prompt can be played as Morse audio. Character speed controls the signal shape, while Farnsworth spacing slows only the gaps for learners.",
 },
 {
 kicker:"Next action",
 title:"Review",
 text:"Weak words can be copied into the printable worksheet builder, audio practice, or the Morse word search builder. That makes each missed prompt useful after the session ends.",
 },
 ]}
 />

 <SectionCard
 eyebrow="Practice path" title="Use word practice after alphabet drills" description="Alphabet recall tells you whether you know each symbol. Word practice tells you whether you can recognize useful chunks quickly enough to read real messages.">
 <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
 <div className="space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
 <p>
 Start with{" "}
 <a
 href="/practice" className="font-semibold text-sky-900 underline hover:no-underline">
 quick Morse drills
 </a>{" "}
 when individual letters still feel slow. Move here once common
 symbols are familiar enough to combine into short words.
 </p>
 <p>
 Use Morse-to-text mode for copy practice, then switch to
 text-to-Morse when you want to prove the spacing yourself. If a
 word keeps breaking your rhythm, add it to weak review and use
 the same list in{" "}
 <a
 href="/morse-code-audio-practice" className="font-semibold text-sky-900 underline hover:no-underline">
 audio practice
 </a>
 ,{" "}
 <a
 href="/morse-code-sentence-practice" className="font-semibold text-sky-900 underline hover:no-underline">
 sentence practice
 </a>
 , or a printable sheet.
 </p>
 <p>
 Teachers can paste weekly vocabulary, radio clubs can paste
 Q-codes and callsign words, and puzzle makers can turn a review
 list into a{" "}
 <a
 href="/morse-code-word-search-builder" className="font-semibold text-sky-900 underline hover:no-underline">
 Morse word search
 </a>{" "}
 where clues are Morse and answers are hidden in a letter grid.
 </p>
 </div>

 <div className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
 <h3 className="text-xl font-extrabold text-sky-950">
 Strong next steps
 </h3>
 <ActionLinks
 links={[
 {
 href:"/morse-code-practice-plan",
 label:"Practice plan",
 primary: true,
 },
 { href:"/morse-code-printable-chart", label:"Worksheet builder"},
 { href:"/morse-code-audio-practice", label:"Audio practice"},
 ]}
 />
 </div>
 </div>
 </SectionCard>

 <FaqSectionGeneric title="Word trainer FAQ" items={faqItems} />

 <JsonLdScript jsonLd={[jsonLd, faqJsonLd]} />
 </main>
 </div>
 );
}

function NoticeList({
 parsed,
 listName,
}: {
 parsed: ParsedTrainerWords;
 listName: WordListName;
}) {
 if (listName !=="custom") return null;

 const notices: string[] = [];
 if (parsed.cleanedEntries > 0) {
 notices.push(
 `Unsupported characters were removed from ${parsed.cleanedEntries} entries.`,
 );
 }
 if (parsed.skippedEntries > 0) {
 notices.push(`${parsed.skippedEntries} entries could not be used.`);
 }
 if (!parsed.words.length) {
 notices.push("Add at least one valid A-Z or 0-9 word to start a round.");
 }

 if (!notices.length) return null;

 return (
 <div className="mt-4 space-y-2">
 {notices.map((notice) => (
 <p
 key={notice}
 className="rounded-lg bg-[#fffdf8] px-3 py-2 text-sm font-semibold text-slate-700">
 {notice}
 </p>
 ))}
 </div>
 );
}

function FeedbackCard({
 state,
 word,
 morse,
 showAnswer,
 mode,
}: {
 state: FeedbackState;
 word: string;
 morse: string;
 showAnswer: boolean;
 mode: TrainerMode;
}) {
 if (!word) return null;
 if (state ==="idle"&& !showAnswer) return null;

 const isCorrect = state ==="correct";
 const isIncorrect = state ==="incorrect";

 return (
 <div
 className={"mt-5 rounded-xl p-4 "+
 (isCorrect
 ?"mw-static-tile bg-[#f7f4ee]": isIncorrect
 ?"bg-[#fffdf8]":"bg-[#fffdf8]")
 }
 >
 <div className="flex items-start gap-3">
 {isCorrect ? (
 <CheckCircleIcon
 size={22}
 title="Correct" className="mt-0.5 text-sky-800"/>
 ) : showAnswer ? (
 <VisibilityIcon
 size={22}
 title="Answer revealed" className="mt-0.5 text-sky-800"/>
 ) : (
 <RefreshIcon
 size={22}
 title="Try again" className="mt-0.5 text-slate-700"/>
 )}
 <div>
 <p className="text-base font-extrabold text-sky-950">
 {isCorrect
 ?"Correct.": isIncorrect
 ? `Not quite. Expected: ${word} / ${morse}.`
 :"Answer revealed."}
 </p>
 <p className="mt-2 text-sm leading-relaxed text-slate-700">
 {mode ==="morse_to_text"?"Plain word":"Morse answer"}
 :{" "}
 <code className="font-mono font-bold tracking-[0.12em]">
 {mode ==="morse_to_text"? word : morse}
 </code>
 </p>
 <p className="mt-1 text-sm leading-relaxed text-slate-700">
 {mode ==="morse_to_text"?"Morse":"Plain word"}:{" "}
 <code className="font-mono font-bold tracking-[0.12em]">
 {mode ==="morse_to_text"? morse : word}
 </code>
 </p>
 </div>
 </div>
 </div>
 );
}

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
 return (
 <div className="mw-static-panel rounded-xl bg-[#fffdf8] p-3">
 <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
 {label}
 </p>
 <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
 </div>
 );
}

function ChoiceButton({
 active,
 onClick,
 children,
}: {
 active: boolean;
 onClick: () => void;
 children: React.ReactNode;
}) {
 return (
 <button
 type="button" onClick={onClick}
 className={toolControlButtonClass({ active })}
 >
 {children}
 </button>
 );
}

function ToolButton({
 onClick,
 children,
 disabled,
 tone ="primary",
}: {
 onClick: () => void;
 children: React.ReactNode;
 disabled?: boolean;
 tone?:"primary"|"secondary";
}) {
 return (
 <button
 type="button" onClick={onClick}
 disabled={disabled}
 className={toolControlButtonClass({
 active: tone ==="primary",
 tone: tone ==="primary"?"dark":"light",
 disabled,
 })}
 >
 {children}
 </button>
 );
}

function MiniLink({
 href,
 children,
}: {
 href: string;
 children: React.ReactNode;
}) {
 return (
 <a
 href={href}
 className={`${toolControlButtonClass({
 tone: "dark",
 size: "sm",
 rounded: "full",
 })} whitespace-nowrap text-center leading-none active:scale-95`}>
 {children}
 </a>
 );
}

function SliderRow({
 label,
 value,
 min,
 max,
 step,
 unit,
 onChange,
 help,
}: {
 label: string;
 value: number;
 min: number;
 max: number;
 step: number;
 unit: string;
 onChange: (value: number) => void;
 help?: string;
}) {
 const id = React.useId();

 return (
 <div>
 <div className="flex items-baseline justify-between gap-3">
 <label htmlFor={id} className="text-sm font-extrabold text-sky-950">
 {label}
 </label>
 <span className="text-sm text-slate-600">
 {value} {unit}
 </span>
 </div>
 {help ? <p className="mt-1 text-xs text-slate-500">{help}</p> : null}
 <input
 id={id}
 type="range" min={min}
 max={max}
 step={step}
 value={value}
 onChange={(event) => onChange(Number(event.target.value))}
 style={{ accentColor:"#38bdf8"}}
className="mt-2 w-full cursor-pointer rounded-full focus:outline-none focus:ring-0 focus-visible:outline-none"/>
 </div>
 );
}
