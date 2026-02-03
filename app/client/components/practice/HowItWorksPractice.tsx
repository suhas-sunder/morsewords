import * as React from "react";

export default function HowItWorksPractice() {
  return (
    <section className="mt-8 bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1.5 text-sm font-extrabold text-sky-900 border border-sky-200">
            Practice spec
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold capitalize text-[#0b2447] tracking-tight">
          How Morse Code Practice works
        </h2>

        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
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
            className="px-3 py-1.5 rounded-full text-sm sm:text-base font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer transition"
          >
            {label}
          </a>
        ))}
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-base font-extrabold text-[#0b2447]">
            10-question runs
          </p>
          <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
            Every session is a fixed run of <strong>10 prompts</strong>. The
            goal is to keep momentum high and make progress measurable.
          </p>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-base font-extrabold text-[#0b2447]">
            Instant checks
          </p>
          <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
            You get immediate feedback after each submission. The tool checks
            meaning, not cosmetic formatting.
          </p>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-base font-extrabold text-[#0b2447]">
            Utility over tutorials
          </p>
          <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
            There are no long lessons. This is a practice surface designed to
            help you drill mappings quickly.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <div
          id="run-flow"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b2447]">
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
              When the run ends, you can restart to generate a fresh set of
              prompts.
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
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b2447]">
            Modes: practice the direction you actually need
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Practice mode supports both directions because they exercise
            different skills. Encoding tests whether you can recall the pattern
            for a symbol. Decoding tests whether you can recognize a pattern
            quickly and name it. Mixed mode forces the switch so you do not get
            comfortable in one direction.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
              <p className="text-base sm:text-lg font-extrabold text-[#0b2447]">
                Text → Morse
              </p>
              <p className="mt-2 text-base sm:text-lg">
                You see text (like A, 7, or SOS) and you type the Morse. This is
                useful for sending practice and building muscle memory.
              </p>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
              <p className="text-base sm:text-lg font-extrabold text-[#0b2447]">
                Morse → Text
              </p>
              <p className="mt-2 text-base sm:text-lg">
                You see dots and dashes and you identify the symbol. This is
                useful for reading, decoding, and recognition speed.
              </p>
            </div>
          </div>

          <p className="mt-5 text-base sm:text-lg">
            Mixed mode alternates between these prompt types. It is a good
            choice when you want “real-world” switching, or when you are trying
            to stop relying on one-direction shortcuts.
          </p>
        </div>

        <div
          id="pools"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b2447]">
            Pools: narrow focus or broad coverage
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Pools control what the prompts are drawn from. Use a narrow pool
            when you are fixing a weak area, then widen it when you want more
            variety. Short words are kept intentionally brief so a prompt still
            feels like a quick recall test rather than a transcription task.
          </p>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              <strong>Letters</strong> help you lock in A–Z quickly.
            </li>
            <li>
              <strong>Numbers</strong> are great for tightening up 0–9 and
              reducing mix-ups.
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

          <p className="mt-4 text-base sm:text-lg">
            Sentences are intentionally short. This is still a drill surface, so
            the goal is quick conversion and recognition, not long-form
            transcription.
          </p>
        </div>

        <div
          id="sentences"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b2447]">
            Sentence rules: spacing matters, but the checker stays practical
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Sentence prompts introduce a new failure mode that single symbols do
            not: you can be “right” about dots and dashes but still be wrong
            about boundaries. The practice goal here is to make word breaks
            obvious and consistent while keeping the experience fast.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
              <p className="text-base sm:text-lg font-extrabold text-[#0b2447]">
                Text → Morse sentences
              </p>
              <p className="mt-2 text-base sm:text-lg">
                You convert multiple characters in a row. A correct answer is
                not just “the right symbols”, it is also the right grouping so
                letters and words do not collapse into a single blob.
              </p>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
              <p className="text-base sm:text-lg font-extrabold text-[#0b2447]">
                Morse → Text sentences
              </p>
              <p className="mt-2 text-base sm:text-lg">
                You read a sequence and produce text. This is where spacing is
                most valuable because it prevents the classic “everything turns
                into one long stream” issue.
              </p>
            </div>
          </div>

          <p className="mt-5 text-base sm:text-lg">
            Practical expectation: you should include clear word boundaries when
            working with sentence prompts. If you paste Morse from somewhere
            else, spacing can vary by source. The tool normalizes common dot and
            dash variants, and it is designed to be tolerant of reasonable
            spacing differences while still enforcing true word breaks where
            they matter.
          </p>
        </div>

        <div
          id="morse-input"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b2447]">
            Morse input tips: type the way you naturally type
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            When the answer expects Morse, the checker accepts common variants.
            Dots may come in as bullets from copy-paste, and dashes may come in
            as longer hyphens from PDFs or fonts. The tool normalizes those
            variants before it checks correctness.
          </p>

          <div className="mt-5">
            <p className="text-base font-extrabold text-gray-800">Examples</p>
            <pre className="mt-3 whitespace-pre-wrap rounded-2xl border border-gray-200 bg-gray-50 p-4 text-base sm:text-lg font-mono overflow-x-auto">
              {`.-
. -
• −`}
            </pre>
            <p className="mt-3 text-base sm:text-lg text-gray-600">
              These all represent the same Morse character after normalization.
              Spaces inside a single character (like <code>. -</code>) are
              interpreted as the intended <code>.-</code> rather than separate
              letters.
            </p>
          </div>

          <p className="mt-4 text-base sm:text-lg">
            For multi-character prompts (words and sentences), you should keep
            your spacing deliberate so boundaries stay readable. The UI is built
            to make gaps visible, because in Morse practice, spacing is part of
            correctness, not decoration.
          </p>

          <p className="mt-4 text-base sm:text-lg">
            The “Check” action mirrors the button’s disabled state. If your
            answer is empty (or only whitespace), pressing Enter will not submit
            a check. This keeps keyboard flow consistent and prevents accidental
            empty attempts.
          </p>
        </div>

        <div
          id="scoring"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b2447]">
            Scoring: attempts, accuracy, and what “progress” means here
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            The stats are designed to match drill intent. Attempts increase each
            time you submit an answer. Correct increases only when your
            submission matches the prompt. Accuracy is simply correct divided by
            attempts. Streak measures consecutive correct answers in the current
            run, and Best streak records the highest streak you hit during the
            run.
          </p>

          <p className="mt-4 text-base sm:text-lg">
            Progress in this tool means how many questions you have completed in
            the run. A solved question counts as solved immediately, even if you
            have not advanced to the next prompt yet. This is reflected in the
            share summary so your results do not undercount by one.
          </p>
        </div>

        <div
          id="skip"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b2447]">
            Skip and streaks: deliberate rules to keep practice honest
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Skip is treated as an unsolved advance. It moves you forward, breaks
            the streak, and does not add a correct answer. This matches real
            practice behavior: if you did not recall the symbol, you should not
            carry a perfect streak through it.
          </p>

          <p className="mt-4 text-base sm:text-lg">
            To prevent nonsensical usage, skip is disabled after a prompt has
            already been solved. This avoids ambiguous state like “skipping
            after success” and keeps progress accounting clean. Rapid clicking
            is handled defensively so you cannot over-increment beyond the
            10-question run limit.
          </p>
        </div>

        <div
          id="share"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b2447]">
            Share: copy a clean progress snapshot
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            When you share results, the tool copies a compact summary of your
            run to your clipboard. It includes your progress (questions
            completed), correct count, attempts, accuracy, and streaks. Sharing
            is designed for quick pasting into chats, notes, or study logs
            without extra formatting.
          </p>

          <p className="mt-4 text-base sm:text-lg">
            Because the share summary reflects a solved current prompt even
            before you advance, it stays aligned with what you actually
            accomplished in the run.
          </p>
        </div>

        <div
          id="troubleshooting"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b2447]">
            Troubleshooting: common practice mistakes
          </h3>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              <strong>Morse answer keeps failing:</strong> check for mixed
              punctuation from copy-paste. The tool normalizes common dots and
              dashes, but extra symbols still matter.
            </li>
            <li>
              <strong>Everything looks right but is marked wrong:</strong>{" "}
              confirm you are answering in the correct direction for the current
              prompt.
            </li>
            <li>
              <strong>Sentence answers keep failing:</strong> look at spacing.
              If you collapse word gaps (or add extra separators), you can turn
              a correct set of symbols into the wrong message.
            </li>
            <li>
              <strong>My progress jumped:</strong> rapid clicks are clamped to
              the run limit. If you restart, the run begins at 1/10 with fresh
              prompts.
            </li>
          </ul>

          <p className="mt-4 text-base sm:text-lg">
            If you want a conversion utility for longer text, use the
            translator. If you want quick checks and repetition, this practice
            page is the faster tool.
          </p>
        </div>
      </div>
    </section>
  );
}
