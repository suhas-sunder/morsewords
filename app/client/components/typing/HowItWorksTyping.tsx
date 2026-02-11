import * as React from "react";

export default function HowItWorksTyping() {
  return (
    <section className="mt-8 bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1.5 text-sm font-extrabold text-sky-900 border border-sky-200">
            Typing tool spec
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight">
          How MorseWords Typing Practice works
        </h2>

        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
          MorseWords Typing Practice is built for people who already know Morse
          and want a simple way to type continuously with real-time decoding and
          timed sessions. It is intentionally minimal. No prompts. No quizzes.
          No grading loop that interrupts your flow. You choose a session
          length, start typing, and get a clean results summary you can repeat
          and share.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {[
          ["Input rules", "#typing-input"],
          ["Boundaries", "#typing-boundaries"],
          ["Timed sessions", "#typing-timer"],
          ["Stats", "#typing-stats"],
          ["Common pitfalls", "#typing-pitfalls"],
          ["Sharing", "#typing-sharing"],
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
          <p className="text-base font-extrabold text-sky-900">
            Freeform production
          </p>
          <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
            You produce Morse like you would in real use. The tool is a typing
            scratchpad with a timer, not a prompt-driven drill.
          </p>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-base font-extrabold text-sky-900">
            Boundary-driven decode
          </p>
          <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
            Decoding happens when you commit a boundary. This keeps output
            predictable and avoids guessing.
          </p>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-base font-extrabold text-sky-900">
            Endurance sessions
          </p>
          <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
            Pick a duration and type continuously. When time is up, input locks
            and you get a results card with shareable stats.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <div
          id="typing-input"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
            Input rules
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Typing Practice is optimized for fast, low-friction input. You can
            type using standard dot and dash characters, or use the optional
            keyboard mapping for touch typing. The goal is to keep your hands
            moving and your attention on rhythm instead of UI controls.
          </p>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              Type{" "}
              <code className="rounded-md bg-gray-50 px-2 py-1 border border-gray-200">
                .
              </code>{" "}
              for dit and{" "}
              <code className="rounded-md bg-gray-50 px-2 py-1 border border-gray-200">
                -
              </code>{" "}
              for dah.
            </li>
            <li>
              Optional mapping:{" "}
              <code className="rounded-md bg-gray-50 px-2 py-1 border border-gray-200">
                F
              </code>{" "}
              enters a dit and{" "}
              <code className="rounded-md bg-gray-50 px-2 py-1 border border-gray-200">
                J
              </code>{" "}
              enters a dah.
            </li>
            <li>
              Backspace removes the last character from your raw input. You can
              correct freely without losing your session.
            </li>
            <li>
              The input box is intentionally large so your raw stream remains
              visible during long runs, including on mobile.
            </li>
          </ul>

          <div className="mt-5">
            <p className="text-base font-extrabold text-gray-800">Example</p>
            <pre className="mt-3 whitespace-pre-wrap rounded-2xl border border-gray-200 bg-gray-50 p-4 text-base sm:text-lg font-mono overflow-x-auto">
              {`. . . .  (space)  .  (space)  .-..  (space)  .-..  (space)  ---  (/)  .--  (space)  ---  (space)  .-.  (space)  .-..  (space)  -..`}
            </pre>
            <p className="mt-3 text-base sm:text-lg text-gray-600">
              In practice you will type the dots and dashes directly and use
              Space and / as boundaries. The decoded output updates as letters
              are committed.
            </p>
          </div>
        </div>

        <div
          id="typing-boundaries"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
            Boundaries
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            This tool is boundary-driven, not timing-driven. It does not infer
            letter breaks from how long you pause. Instead, you explicitly tell
            the decoder when a letter or word is complete. That makes the output
            predictable, even when you are typing quickly or inconsistently.
          </p>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              <strong>Space</strong> commits the current dot-dash chunk as a
              letter.
            </li>
            <li>
              <strong>/</strong> commits a word break (and also commits any
              pending letter first).
            </li>
            <li>
              If a chunk is not recognized, it decodes to <strong>?</strong> so
              the mistake stays visible instead of being silently corrected.
            </li>
          </ul>

          <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-5">
            <p className="text-base sm:text-lg font-extrabold text-sky-900">
              Why this matters for fluent users
            </p>
            <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
              During a sustained typing run, you want consistency and feedback,
              not interpretation. Boundary rules keep the tool honest. If your
              output looks wrong, the fix is simple: adjust the chunk you typed
              or commit boundaries more cleanly.
            </p>
          </div>
        </div>

        <div
          id="typing-timer"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
            Timed sessions
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Typing Practice is structured around short and long endurance
            windows. Choose a preset duration and begin typing. The countdown
            starts automatically on your first valid input. That removes the
            “start button” ritual and makes the tool feel like a real
            scratchpad.
          </p>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              Use short sessions (10s, 30s, 1m) for crisp, high-intensity runs.
            </li>
            <li>
              Use medium sessions (2m, 5m) to practice staying accurate while
              speed naturally changes.
            </li>
            <li>
              Use long sessions (30m) for endurance and consistency over time.
            </li>
            <li>
              <strong>Pause</strong> freezes the clock without clearing your
              text. <strong>Reset</strong> clears the session and returns to
              idle.
            </li>
          </ul>

          <p className="mt-4 text-base sm:text-lg">
            When time runs out, input is locked and a session-complete screen
            appears. You can restart immediately for another run with the same
            duration or share your results.
          </p>
        </div>

        <div
          id="typing-stats"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
            What the stats mean
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Stats are designed to be useful without turning this into a quiz.
            They measure what you actually committed, not what you might have
            intended. That makes them ideal for tracking personal consistency
            across repeated runs.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
              <p className="text-base sm:text-lg font-extrabold text-sky-900">
                Letters and words
              </p>
              <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
                Letters count only increases when you commit a letter boundary.
                Words increase when you commit a word break. This prevents
                inflated numbers from partial or uncommitted chunks.
              </p>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
              <p className="text-base sm:text-lg font-extrabold text-sky-900">
                Letters per minute
              </p>
              <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
                Letters/min is a simple rate computed from committed letters and
                elapsed session time. It is a practical speed indicator for
                repeatable timed runs.
              </p>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
              <p className="text-base sm:text-lg font-extrabold text-sky-900">
                Invalid
              </p>
              <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
                Invalid counts unrecognized dot-dash chunks. Seeing a few is
                normal in high-speed sessions. Repeated invalids usually mean a
                boundary mistake or an extra character slipped into the stream.
              </p>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
              <p className="text-base sm:text-lg font-extrabold text-sky-900">
                Minimal interference
              </p>
              <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
                The tool keeps stats visible but avoids constant “correct or
                wrong” interruption. You stay in flow, then review at the end.
              </p>
            </div>
          </div>
        </div>

        <div
          id="typing-pitfalls"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
            Common pitfalls (and quick fixes)
          </h3>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              <strong>Everything decodes as ?</strong>: you may be missing
              boundaries. Use Space to commit each letter.
            </li>
            <li>
              <strong>Output looks shifted</strong>: a single extra dot or dash
              can change multiple letters. Backspace the raw stream to the last
              known-good boundary and continue.
            </li>
            <li>
              <strong>Words never increment</strong>: commit word breaks with{" "}
              <strong>/</strong> (or use the on-screen Word control if you
              prefer).
            </li>
            <li>
              <strong>Mobile typing feels awkward</strong>: switch to the F/J
              mapping or use the on-screen Dit and Dah buttons for a more
              thumb-friendly rhythm.
            </li>
          </ul>

          <p className="mt-4 text-base sm:text-lg text-gray-600">
            This tool does not try to interpret timing like an audio decoder. If
            your boundaries are clean, your output will be clean.
          </p>
        </div>

        <div
          id="typing-sharing"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
            Sharing your results
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            When a session completes, you can generate a shareable results card
            with your stats. It is formatted as an image so it looks consistent
            across devices and is easy to post or save. If sharing is not
            available on your device, you can download the PNG instead.
          </p>

          <p className="mt-4 text-base sm:text-lg">
            The share card includes duration, letters, words, letters per
            minute, invalid count, and the session mode. It is meant to be
            lightweight proof of a completed run, not a scoreboard.
          </p>
        </div>
      </div>
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
        <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
          Quick reference
        </h3>

        <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg text-gray-700">
          <li>
            <strong>What this tool is for:</strong> Continuous Morse typing with
            real-time decoding and timed sessions.
          </li>
          <li>
            <strong>How decoding works:</strong> Boundary-driven. Space commits
            a letter, <code>/</code> commits a word.
          </li>
          <li>
            <strong>Sessions:</strong> Pick a duration; input locks when time is
            up and stats are shown.
          </li>
          <li>
            <strong>Stats:</strong> Letters, words, letters/min, and invalid
            chunks are counted from committed input.
          </li>
          <li>
            <strong>Best use case:</strong> Endurance and fluency practice
            without prompts or grading interruptions.
          </li>
        </ul>
      </div>
    </section>
  );
}
