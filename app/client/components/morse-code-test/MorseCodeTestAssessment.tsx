import * as React from "react";

import {
  CheckCircleIcon,
  LoopIcon,
  RefreshIcon,
} from "~/client/assets/svg/Icons";
import { ToolButton, ToolPanel } from "~/client/components/shared/ToolWorkspace";
import {
  buildMorseCodeTestDeck,
  getMorseCodeTestExpectedAnswer,
  INITIAL_MORSE_CODE_TEST_SEED,
  isMorseCodeTestAnswerCorrect,
  MORSE_CODE_TEST_LENGTH,
  type MorseCodeTestQuestion,
} from "./morseCodeTestEngine";

type AssessmentState = "active" | "complete";
type Feedback = "correct" | "incorrect" | null;

function createTestSeed() {
  return Date.now() + Math.floor(Math.random() * 1_000_000);
}

function questionLabel(question: MorseCodeTestQuestion) {
  return question.direction === "morse_to_character"
    ? "Read this Morse pattern"
    : "Write this character in Morse";
}

function answerLabel(question: MorseCodeTestQuestion) {
  return question.direction === "morse_to_character"
    ? "Character or symbol"
    : "Morse pattern";
}

function categoryLabel(question: MorseCodeTestQuestion) {
  return question.category === "letter"
    ? "Letter"
    : question.category === "number"
      ? "Number"
      : "Common punctuation";
}

export default function MorseCodeTestAssessment() {
  const submittedRef = React.useRef(false);
  const [seed, setSeed] = React.useState(INITIAL_MORSE_CODE_TEST_SEED);
  const [state, setState] = React.useState<AssessmentState>("active");
  const [index, setIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState("");
  const [feedback, setFeedback] = React.useState<Feedback>(null);
  const [correct, setCorrect] = React.useState(0);
  const deck = React.useMemo(() => buildMorseCodeTestDeck(seed), [seed]);
  const question = deck[index] ?? deck[0];
  const expectedAnswer = question ? getMorseCodeTestExpectedAnswer(question) : "";
  const percentage = Math.round((correct / MORSE_CODE_TEST_LENGTH) * 100);

  function startFreshTest() {
    submittedRef.current = false;
    setSeed(createTestSeed());
    setIndex(0);
    setAnswer("");
    setFeedback(null);
    setCorrect(0);
    setState("active");
  }

  function checkAnswer() {
    if (!question || !answer.trim() || feedback || submittedRef.current) return;
    submittedRef.current = true;
    const isCorrect = isMorseCodeTestAnswerCorrect(question, answer);
    setFeedback(isCorrect ? "correct" : "incorrect");
    if (isCorrect) setCorrect((value) => value + 1);
  }

  function nextQuestion() {
    if (!feedback || submittedRef.current === false) return;
    submittedRef.current = false;
    setAnswer("");
    setFeedback(null);
    if (index + 1 >= MORSE_CODE_TEST_LENGTH) {
      setState("complete");
      return;
    }
    setIndex((value) => value + 1);
  }

  if (state === "complete") {
    return (
      <section
        id="morse-code-assessment"
        data-testid="morse-code-assessment"
        className="mw-static-surface-soft mt-8 scroll-mt-28 rounded-xl bg-[#fffaf2]/45 p-5 sm:p-7"
        aria-labelledby="morse-code-test-results-heading"
      >
        <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          Assessment complete
        </p>
        <h2 id="morse-code-test-results-heading" className="mt-3 text-2xl font-extrabold text-sky-950 sm:text-3xl">
          Your Morse Code Skills Test result
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3" aria-label="Test score summary">
          <div className="mw-static-panel rounded-xl bg-[#fffdf8]/85 p-4">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Correct</p>
            <p className="mt-1 text-3xl font-extrabold text-sky-950">{correct}/{MORSE_CODE_TEST_LENGTH}</p>
          </div>
          <div className="mw-static-panel rounded-xl bg-[#fffdf8]/85 p-4">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Score</p>
            <p className="mt-1 text-3xl font-extrabold text-sky-950">{percentage}%</p>
          </div>
          <div className="mw-static-panel rounded-xl bg-[#fffdf8]/85 p-4">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Questions</p>
            <p className="mt-1 text-3xl font-extrabold text-sky-950">{MORSE_CODE_TEST_LENGTH}</p>
          </div>
        </div>
        <p className="mt-5 max-w-[68ch] text-base leading-relaxed text-slate-700">
          Use missed patterns as a review list, then choose a specialist test below when you want to focus on listening, visual recognition, or typing.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ToolButton type="button" tone="dark" onClick={startFreshTest} aria-label="Start a new Morse Code Skills Test">
            <RefreshIcon size={18} title={undefined} aria-hidden="true" />
            Start a new test
          </ToolButton>
        </div>
      </section>
    );
  }

  return (
    <section
      id="morse-code-assessment"
      data-testid="morse-code-assessment"
      data-morse-code-test-direction={question.direction}
      className="mw-static-surface-soft mt-8 scroll-mt-28 rounded-xl bg-[#fffaf2]/45 p-5 sm:p-7"
      aria-labelledby="morse-code-assessment-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">Skills assessment</p>
          <h2 id="morse-code-assessment-heading" className="mt-2 text-2xl font-extrabold text-sky-950 sm:text-3xl">Morse Code Skills Test</h2>
        </div>
        <p className="text-sm text-slate-700" aria-label={`Question ${index + 1} of ${MORSE_CODE_TEST_LENGTH}`}>
          Question <strong className="text-sky-950">{index + 1}/{MORSE_CODE_TEST_LENGTH}</strong>
        </p>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(260px,0.18fr)]">
        <ToolPanel label={questionLabel(question)} badge={categoryLabel(question)}>
          <div className="px-4 pb-5 pt-2">
            <p data-testid="morse-code-test-prompt" className="break-all font-mono text-3xl font-bold tracking-[0.18em] text-slate-950 sm:text-4xl">
              {question.direction === "morse_to_character" ? question.morse : question.character}
            </p>
          </div>
        </ToolPanel>
        <div className="mw-panel-dark rounded-xl bg-slate-950 p-4 text-slate-200">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300">Direction</p>
          <p className="mt-2 text-base font-semibold text-sky-100">
            {question.direction === "morse_to_character" ? "Morse to character" : "Character to Morse"}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-200">Submit once to see whether the answer is right and review the correct pattern.</p>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="morse-code-test-answer" className="block text-sm font-extrabold text-sky-950">
          {answerLabel(question)}
        </label>
        <input
          id="morse-code-test-answer"
          value={answer}
          onChange={(event) => {
            if (!feedback) setAnswer(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            if (feedback) nextQuestion();
            else checkAnswer();
          }}
          readOnly={Boolean(feedback)}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          className="mt-2 min-h-12 w-full rounded-xl bg-[#fffdf8] px-4 font-mono text-lg text-slate-950 outline-none focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 read-only:cursor-default"
          placeholder={question.direction === "morse_to_character" ? "Type one character or symbol" : "Type dots and dashes"}
        />
      </div>

      {feedback ? (
        <div role="status" aria-live="polite" className="mt-4 rounded-xl bg-[#fffdf8]/85 p-4 text-slate-700">
          <p className="font-semibold text-sky-950">
            {feedback === "correct" ? "Correct." : `Not quite. Correct answer: ${expectedAnswer}`}
          </p>
          <p className="mt-2 text-sm leading-relaxed">Press Enter or choose the next question when you are ready.</p>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        {feedback ? (
          <ToolButton type="button" tone="dark" onClick={nextQuestion} aria-label="Next test question">
            {index + 1 === MORSE_CODE_TEST_LENGTH ? "Finish test" : "Next question"}
          </ToolButton>
        ) : (
          <ToolButton type="button" tone="dark" onClick={checkAnswer} disabled={!answer.trim()} aria-label="Check test answer">
            <CheckCircleIcon size={18} title={undefined} aria-hidden="true" />
            Check answer
          </ToolButton>
        )}
        <ToolButton type="button" onClick={startFreshTest} aria-label="Restart Morse Code Skills Test">
          <LoopIcon size={18} title={undefined} aria-hidden="true" />
          Restart test
        </ToolButton>
      </div>
      <p className="mt-3 text-sm text-slate-600">Press Enter to check an answer, then Enter again to continue.</p>
    </section>
  );
}
