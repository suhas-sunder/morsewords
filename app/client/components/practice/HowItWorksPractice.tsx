import * as React from "react";
import { Link } from "react-router";

export default function HowItWorksPractice() {
  return (
    <section className="mw-how-section mt-8 overflow-hidden rounded-2xl bg-[#fffdf8] p-5 sm:p-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-sky-800" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">Practice spec</span>
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
          How Morse Code Practice works
        </h2>

        <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
          This page is a utility-first drill. It is built for fast repetition
          and clear checks, not for teaching Morse from scratch. You get one
          prompt at a time, submit an answer, and move forward through a fixed
          run. The intent is simple: build recall speed and reduce hesitation.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {[
          ["Run flow", "#run-flow"],
          ["Modes", "#modes"],
          ["Pools", "#pools"],
          ["Sentence rules", "#sentences"],
          ["Morse input tips", "#morse-input"],
          ["Scoring", "#scoring"],
          ["Skip + streaks", "#skip"],
          ["Share", "#share"],
          ["Troubleshooting", "#troubleshooting"],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
                className="inline-flex min-h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-slate-950 px-4 py-2 text-center text-sm font-semibold leading-none text-sky-100 transition hover:bg-slate-800 hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
          >
            {label}
          </a>
        ))}
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-[#f7f4ee] p-5">
          <p className="text-base font-extrabold text-sky-950">
            10-question runs
          </p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            Every session is a fixed run of <strong>10 prompts</strong>. The
            goal is to keep momentum high and make progress measurable.
          </p>
        </div>

        <div className="rounded-xl bg-[#f7f4ee] p-5">
          <p className="text-base font-extrabold text-sky-950">
            Instant checks
          </p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            You get immediate feedback after each submission. The tool checks
            meaning, not cosmetic formatting.
          </p>
        </div>

        <div className="rounded-xl bg-[#f7f4ee] p-5">
          <p className="text-base font-extrabold text-sky-950">
            Utility over tutorials
          </p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            No long lessons. This is a practice surface designed to help you
            drill mappings quickly.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6 text-slate-700 leading-relaxed">
        <div
          id="run-flow"
          className="rounded-xl bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Run flow: what happens in a session
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            A run is the basic unit of practice. It is always ten questions. You
            pick your settings, then you repeat a simple loop: see prompt,
            answer, check, advance. The UI is intentionally focused so you can
            stay in the rhythm of recall.
          </p>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              Choose a <strong>mode</strong> (Text → Morse, Morse → Text, or
              Mixed).
            </li>
            <li>
              Choose a <strong>pool</strong> (letters, numbers, signals, short
              words, and short sentences).
            </li>
            <li>
              Work through ten prompts. Progress is shown as{" "}
              <strong>Questions X/10</strong>.
            </li>
            <li>
              When the run ends, restart to generate a fresh set of prompts.
            </li>
          </ul>

          <p className="mt-4 text-base sm:text-lg">
            Settings are stored locally in your browser so the page can remember
            your last mode and pool. If stored values are missing or invalid,
            the tool safely falls back to defaults so the drill always runs.
          </p>
        </div>

        <div
          id="modes"
          className="rounded-xl bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Modes: practice the direction you actually need
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Practice supports both directions because they exercise different
            skills. Encoding tests whether you can recall the pattern for a
            symbol. Decoding tests whether you can recognize a pattern quickly
            and name it. Mixed mode forces the switch so you do not get
            comfortable in one direction.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[#f7f4ee] p-5">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Text → Morse
              </p>
              <p className="mt-2 text-base sm:text-lg">
                You see text (like A, 7, or SOS) and you type the Morse. Useful
                for sending practice and building recall speed.
              </p>
            </div>

            <div className="rounded-xl bg-[#f7f4ee] p-5">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Morse → Text
              </p>
              <p className="mt-2 text-base sm:text-lg">
                You see dots and dashes and you identify the symbol. Useful for
                reading, decoding, and recognition speed.
              </p>
            </div>
          </div>

          <p className="mt-5 text-base sm:text-lg">
            Mixed mode alternates between these prompt types. It is a good
            choice when you want real switching, or when you are trying to stop
            relying on one-direction shortcuts.
          </p>
        </div>

        <div
          id="pools"
          className="rounded-xl bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Pools: narrow focus or broad coverage
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Pools control what prompts are drawn from. Use a narrow pool when
            you are fixing a weak area, then widen it when you want more
            variety. Short words are intentionally brief so a prompt stays a
            quick recall test rather than a long transcription task.
          </p>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              <strong>Letters</strong> help you lock in A–Z quickly.
            </li>
            <li>
              <strong>Numbers</strong> tighten up 0–9 and reduce mix-ups.
            </li>
            <li>
              <strong>Signals</strong> (common short patterns) help with
              real-world recognition.
            </li>
            <li>
              <strong>Short words</strong> add context without turning the drill
              into a long read.
            </li>
            <li>
              <strong>Short sentences</strong> add word boundaries so you
              practice spacing and flow, not just single-token recall.
            </li>
          </ul>

          <p className="mt-4 text-base sm:text-lg">
            Prompt selection is randomized from your chosen pool. The randomness
            is defensive: even if stored settings are stale, prompt selection
            will not produce invalid prompt kinds.
          </p>

          <div className="mt-5 rounded-xl bg-[#fffdf8] p-5">
            <p className="text-base font-extrabold text-sky-950">
              Want more than drills?
            </p>
            <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
              Use{" "}
              <Link
                to="/dictionary"
                className="font-extrabold text-sky-950 hover:text-sky-800 underline cursor-pointer"
              >
                Dictionary
              </Link>{" "}
              to study mappings, or{" "}
              <Link
                to="/typing"
                className="font-extrabold text-sky-950 hover:text-sky-800 underline cursor-pointer"
              >
                Typing
              </Link>{" "}
              to practice continuous entry.
            </p>
          </div>
        </div>

        <div
          id="sentences"
          className="rounded-xl bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Sentence rules: spacing matters, but the checker stays practical
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Sentence prompts introduce a failure mode that single symbols do
            not: you can be right about dots and dashes but still be wrong about
            boundaries. The practice goal here is to make word breaks obvious
            and consistent while keeping the experience fast.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[#f7f4ee] p-5">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Text → Morse sentences
              </p>
              <p className="mt-2 text-base sm:text-lg">
                You convert multiple characters in a row. A correct answer is
                not just the right symbols, it is also the right grouping so
                letters and words do not collapse.
              </p>
            </div>

            <div className="rounded-xl bg-[#f7f4ee] p-5">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Morse → Text sentences
              </p>
              <p className="mt-2 text-base sm:text-lg">
                You read a sequence and produce text. Clear spacing prevents the
                classic everything-turns-into-one-stream issue.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-[#f7f4ee] p-5">
            <p className="text-base font-extrabold text-sky-950">
              Boundary rule of thumb
            </p>
            <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
              If your answer expects Morse, separate letters with spaces and
              separate words with <code>/</code> or a clear longer gap. The
              checker is tolerant of reasonable spacing differences, but it
              still needs true word boundaries to be visible.
            </p>
          </div>
        </div>

        <div
          id="morse-input"
          className="rounded-xl bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Morse input tips: type the way you naturally type
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            When the answer expects Morse, the checker accepts common variants.
            Dots may come in as bullets from copy-paste, and dashes may come in
            as longer hyphens from PDFs or fonts. The tool normalizes those
            variants before it checks correctness.
          </p>

          <div className="mt-5">
            <p className="text-base font-extrabold text-sky-950">Examples</p>
            <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-[#f7f4ee] p-4 text-base sm:text-lg font-mono overflow-x-auto">
              {`.-
. -
• −`}
            </pre>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              These all represent the same Morse character after normalization.
              Spaces inside a single character (like <code>. -</code>) are
              interpreted as the intended <code>.-</code> rather than separate
              letters.
            </p>
          </div>

          <p className="mt-4 text-base sm:text-lg">
            For words and sentences, keep spacing deliberate so boundaries stay
            readable. If you need a dedicated separator normalizer, use{" "}
            <Link
              to="/morse-code-word-separator"
              className="font-extrabold text-sky-950 hover:text-sky-800 underline cursor-pointer"
            >
              Word separator
            </Link>{" "}
            first.
          </p>

          <p className="mt-4 text-base sm:text-lg">
            The Check action mirrors the button’s disabled state. If your answer
            is empty (or only whitespace), pressing Enter will not submit a
            check.
          </p>
        </div>

        <div
          id="scoring"
          className="rounded-xl bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Scoring: attempts, accuracy, and what progress means here
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Attempts increase each time you submit an answer. Correct increases
            only when your submission matches the prompt. Accuracy is correct
            divided by attempts. Streak measures consecutive correct answers in
            the current run, and Best streak records the highest streak you hit
            during the run.
          </p>

          <p className="mt-4 text-base sm:text-lg">
            Progress is how many questions you have completed in the run. A
            solved question counts as solved immediately, even if you have not
            advanced to the next prompt yet.
          </p>

          <div className="mt-5 rounded-xl bg-[#fffdf8] p-5">
            <p className="text-base font-extrabold text-sky-950">
              Measure improvement the right way
            </p>
            <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
              If your accuracy is stuck, narrow the pool (letters only, then
              numbers), and use Mixed mode only after each direction is
              comfortable.
            </p>
          </div>
        </div>

        <div
          id="skip"
          className="rounded-xl bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Skip and streaks: deliberate rules to keep practice honest
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Skip is treated as an unsolved advance. It moves you forward, breaks
            the streak, and does not add a correct answer. This matches real
            practice: if you did not recall the symbol, you should not carry a
            perfect streak through it.
          </p>

          <p className="mt-4 text-base sm:text-lg">
            Skip is disabled after a prompt has already been solved. Rapid
            clicking is handled defensively so you cannot over-increment beyond
            the 10-question run limit.
          </p>
        </div>

        <div
          id="share"
          className="rounded-xl bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Share: copy a clean progress snapshot
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Sharing copies a compact summary of your run to your clipboard. It
            includes progress (questions completed), correct count, attempts,
            accuracy, and streaks. It is designed for quick pasting into chats,
            notes, or study logs.
          </p>

          <p className="mt-4 text-base sm:text-lg">
            Because the share summary reflects a solved current prompt even
            before you advance, it stays aligned with what you actually
            accomplished in the run.
          </p>
        </div>

        <div
          id="troubleshooting"
          className="rounded-xl bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Troubleshooting: common practice mistakes
          </h3>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              <strong>Morse answer keeps failing:</strong> check for extra
              symbols from copy-paste. The tool normalizes common dots and
              dashes, but other characters still matter.
            </li>
            <li>
              <strong>Everything looks right but is marked wrong:</strong>{" "}
              confirm you are answering in the correct direction for the current
              prompt.
            </li>
            <li>
              <strong>Sentence answers keep failing:</strong> boundaries are the
              usual cause. Use clear word breaks (<code>/</code> or a clear
              longer gap).
            </li>
            <li>
              <strong>Progress jumped:</strong> rapid clicks are clamped to the
              run limit. Restart begins at 1/10 with fresh prompts.
            </li>
          </ul>

          <p className="mt-4 text-base sm:text-lg">
            If you want conversion utilities, use{" "}
            <Link
              to="/morse-code-encoder"
              className="font-extrabold text-sky-950 hover:text-sky-800 underline cursor-pointer"
            >
              Encoder
            </Link>{" "}
            and{" "}
            <Link
              to="/morse-code-decoder"
              className="font-extrabold text-sky-950 hover:text-sky-800 underline cursor-pointer"
            >
              Decoder
            </Link>
            . If you want repetition and quick checks, Practice is the faster
            tool.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-[#fffdf8] p-5 sm:p-7">
        <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
          Quick reference
        </h3>

        <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg text-slate-700">
          <li>
            <strong>What this tool is for:</strong> fast drills with one prompt
            at a time and instant checks.
          </li>
          <li>
            <strong>Run size:</strong> fixed set of 10 prompts per session.
          </li>
          <li>
            <strong>Modes:</strong> Text → Morse, Morse → Text, or Mixed.
          </li>
          <li>
            <strong>Pools:</strong> letters, numbers, signals, short words, and
            short sentences.
          </li>
          <li>
            <strong>Scoring:</strong> attempts, correct count, accuracy, and
            streaks update per run.
          </li>
          <li>
            <strong>Spacing matters:</strong> clear letter and word boundaries
            reduce false negatives on sentence prompts.
          </li>
        </ul>
      </div>
    </section>
  );
}



