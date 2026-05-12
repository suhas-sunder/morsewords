import type { ReactNode } from "react";
import { Link } from "react-router";
import SectionEyebrow from "~/client/components/shared/SectionEyebrow";

const summaryPoints = [
  {
    title: "10-question runs",
    body:
      "Each session stays short so you can repeat it without turning practice into a long course.",
  },
  {
    title: "Instant checks",
    body:
      "Submit an answer, get feedback, then move to the next prompt or repeat the run.",
  },
  {
    title: "Focused pools",
    body:
      "Narrow the drill to letters, numbers, signals, words, or sentences when a weakness appears.",
  },
] as const;

const practiceScenarios = [
  {
    title: "Beginner recall",
    body:
      "Use letters or numbers when the alphabet chart is still fresh and you need fast repetition.",
  },
  {
    title: "Mixed review",
    body:
      "Use Mixed mode after lookup practice so you switch between reading and writing Morse.",
  },
  {
    title: "Short daily session",
    body:
      "Treat one run as a quick check-in. Repeated misses tell you which focused drill to use next.",
  },
] as const;

const commonMistakes = [
  {
    title: "Practicing too broadly",
    body:
      "If the same letters or words keep failing, switch to a narrower pool before running Mixed again.",
  },
  {
    title: "Ignoring spacing",
    body:
      "Morse-to-text prompts still depend on clear letter and word boundaries.",
  },
  {
    title: "Testing before training",
    body:
      "Use quizzes after recall feels steady. Practice should build the habit first.",
  },
] as const;

function InlineLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="font-semibold text-sky-900 underline-offset-4 hover:underline"
    >
      {children}
    </Link>
  );
}

export default function HowItWorksPractice() {
  return (
    <section
      className="relative left-1/2 mt-14 w-screen max-w-[100vw] -translate-x-1/2 bg-[#fffaf2]/35 px-4 py-12 sm:px-6 lg:px-8"
      aria-labelledby="practice-how-title"
    >
      <div className="mx-auto max-w-[1160px]">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <div>
            <SectionEyebrow>Practice spec</SectionEyebrow>

            <h2
              id="practice-how-title"
              className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
            >
              How Morse Code Practice works
            </h2>

            <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              This page gives you one Morse prompt at a time, checks your
              answer, and keeps the run short enough to repeat. Use it when you
              want recall practice rather than another lookup.
            </p>
          </div>

          <aside className="rounded-xl bg-slate-950 px-4 py-3 text-white">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
              Sample prompt
            </p>
            <p className="mt-2 font-mono text-lg font-bold tracking-[0.18em] text-sky-100">
              .-
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">
              Read or send it, then check your answer.
            </p>
          </aside>
        </div>

        <dl className="mt-9 grid gap-6 md:grid-cols-3">
          {summaryPoints.map((item) => (
            <div key={item.title}>
              <dt className="text-base font-extrabold text-sky-950">
                {item.title}
              </dt>
              <dd className="mt-2 max-w-[35ch] text-base leading-relaxed text-slate-700">
                {item.body}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 space-y-10 text-slate-700">
          <section id="practice-flow">
            <div className="grid gap-6 lg:grid-cols-[235px_minmax(0,1fr)]">
              <header>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Run flow
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-sky-950">
                  See it, answer it, check it
                </h3>
              </header>

              <div className="max-w-none">
                <ul className="grid list-disc gap-x-8 gap-y-2 pl-6 text-base leading-relaxed sm:text-lg lg:grid-cols-3">
                  <li>
                    Pick a direction: Text to Morse, Morse to Text, or Mixed.
                  </li>
                  <li>
                    Choose a pool when you want letters, numbers, words, or
                    sentences.
                  </li>
                  <li>
                    Check the answer, then skip, clear, restart, or continue.
                  </li>
                </ul>

                <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-slate-600 sm:text-lg">
                  Settings are saved in your browser. Fresh prompts are
                  generated after the page is ready or when you change the
                  drill.
                </p>
              </div>
            </div>
          </section>

          <section id="practice-modes">
            <div className="grid gap-6 lg:grid-cols-[235px_minmax(0,1fr)]">
              <header>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Drill modes
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-sky-950">
                  Practice the direction you need
                </h3>
              </header>

              <div className="max-w-none">
                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <p className="text-base font-extrabold text-sky-950">
                      Text to Morse
                    </p>
                    <p className="mt-2 max-w-[32ch] text-base leading-relaxed">
                      Recall the dot-dash pattern for the prompt you see.
                    </p>
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-sky-950">
                      Morse to Text
                    </p>
                    <p className="mt-2 max-w-[32ch] text-base leading-relaxed">
                      Read a visible Morse pattern and type the plain answer.
                    </p>
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-sky-950">
                      Mixed
                    </p>
                    <p className="mt-2 max-w-[32ch] text-base leading-relaxed">
                      Switch directions so the answer is not automatic.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="practice-scenarios">
            <div className="grid gap-6 lg:grid-cols-[235px_minmax(0,1fr)]">
              <header>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Scenarios
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-sky-950">
                  Three useful ways to use it
                </h3>
              </header>

              <div className="grid gap-6 md:grid-cols-3">
                {practiceScenarios.map((item) => (
                  <article key={item.title}>
                    <h4 className="text-base font-extrabold text-sky-950">
                      {item.title}
                    </h4>
                    <p className="mt-2 max-w-[34ch] text-base leading-relaxed">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="practice-mistakes">
            <div className="grid gap-6 lg:grid-cols-[235px_minmax(0,1fr)]">
              <header>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Fix misses
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-sky-950">
                  Common mistakes and fixes
                </h3>
              </header>

              <ul className="grid list-disc gap-x-8 gap-y-3 pl-6 text-base leading-relaxed sm:text-lg lg:grid-cols-3">
                {commonMistakes.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}:</strong> {item.body}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="practice-next">
            <div className="grid gap-6 lg:grid-cols-[235px_minmax(0,1fr)]">
              <header>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Next step
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-sky-950">
                  Move from broad practice to focused review
                </h3>
              </header>

              <div className="max-w-none">
                <p className="max-w-[58ch] text-base leading-relaxed sm:text-lg">
                  Use broad practice to find the weak spot. Then move repeated
                  misses into{" "}
                  <InlineLink to="/typing">typing practice</InlineLink>,{" "}
                  <InlineLink to="/morse-code-word-trainer">
                    word training
                  </InlineLink>,{" "}
                  <InlineLink to="/morse-code-audio-practice">
                    audio practice
                  </InlineLink>, or{" "}
                  <InlineLink to="/morse-code-visual-practice">
                    visual practice
                  </InlineLink>.
                </p>

                <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-slate-600 sm:text-lg">
                  If you want a routine instead of a single run, use the{" "}
                  <InlineLink to="/morse-code-practice-plan">
                    Morse practice plan
                  </InlineLink>{" "}
                  and come back here for short check-ins.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
