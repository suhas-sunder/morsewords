import * as React from "react";
import { Link } from "react-router";
import SectionEyebrow from "~/client/components/shared/SectionEyebrow";

export default function HowItWorksTyping() {
  return (
    <section className="mw-static-surface-soft mw-how-section mt-10 bg-[#fffaf2]/40 px-5 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-3">
        <SectionEyebrow>Typing tool spec</SectionEyebrow>

        <h2 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
          How MorseWords Typing Practice works
        </h2>

        <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
          MorseWords Typing Practice is built for people who already know Morse and want
          a simple way to type continuously with real-time decoding and timed sessions.
          It is intentionally minimal: no prompts, no quizzes, no grading loop that
          interrupts your flow. Pick a session length, start typing, and get a clean
          results summary you can repeat and share.
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
                className="mw-button-outline inline-flex min-h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-slate-950 px-4 py-2 text-center text-sm font-semibold leading-none text-sky-100 transition hover:bg-slate-800 hover:text-white active:scale-95 focus:outline-none"
          >
            {label}
          </a>
        ))}
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <div className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
          <p className="text-base font-extrabold text-sky-950">Freeform production</p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            You produce Morse like you would in real use. This is a typing scratchpad
            with a timer, not a prompt-driven drill.
          </p>
        </div>

        <div className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
          <p className="text-base font-extrabold text-sky-950">Boundary-driven decode</p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            Decoding happens when you commit a boundary. That keeps output predictable
            and avoids guessing.
          </p>
        </div>

        <div className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
          <p className="text-base font-extrabold text-sky-950">Endurance sessions</p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            Pick a duration and type continuously. When time is up, input locks and you
            get a results card with shareable stats.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6 text-slate-700 leading-relaxed">
        <div
          id="typing-input"
          className="py-6 sm:py-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Input rules
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Typing Practice is optimized for fast, low-friction input. You can type
            standard dot and dash characters, or use the optional keyboard mapping for
            touch typing. The goal is to keep your hands moving and your attention on
            rhythm instead of UI controls.
          </p>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              Type{" "}
              <code className="mw-static-code rounded-md bg-[#f7f4ee] px-2 py-1">
                .
              </code>{" "}
              for dit and{" "}
              <code className="mw-static-code rounded-md bg-[#f7f4ee] px-2 py-1">
                -
              </code>{" "}
              for dah.
            </li>
            <li>
              Optional mapping:{" "}
              <code className="mw-static-code rounded-md bg-[#f7f4ee] px-2 py-1">
                F
              </code>{" "}
              enters a dit and{" "}
              <code className="mw-static-code rounded-md bg-[#f7f4ee] px-2 py-1">
                J
              </code>{" "}
              enters a dah.
            </li>
            <li>
              Backspace removes the last character from your raw input so you can correct
              freely without losing the session.
            </li>
            <li>
              The input box is intentionally large so your raw stream stays visible
              during longer runs.
            </li>
          </ul>

          <div className="mt-5">
            <p className="text-base font-extrabold text-sky-950">Example</p>
            <pre className="mw-static-code mt-3 whitespace-pre-wrap rounded-xl bg-[#f7f4ee] p-4 text-base sm:text-lg font-mono overflow-x-auto">
              {`. . . . (space) . (space) .-.. (space) .-.. (space) --- (/) .-- (space) --- (space) .-. (space) .-.. (space) -..`}
            </pre>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              In practice you type dots and dashes, then use Space and{" "}
              <code>/</code> as boundaries. The decoded output updates as letters are
              committed.
            </p>
          </div>

          <div className="mw-static-panel mt-5 rounded-xl bg-[#fffdf8] p-5">
            <p className="text-base font-extrabold text-sky-950">Need to convert text?</p>
            <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
              This page is for continuous typing sessions. If you want a utility that
              converts full text into Morse, use{" "}
              <Link
                to="/morse-code-encoder"
                className="font-extrabold text-sky-950 hover:text-sky-800 underline cursor-pointer"
              >
                Encoder
              </Link>
              .
            </p>
          </div>
        </div>

        <div
          id="typing-boundaries"
          className="py-6 sm:py-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Boundaries
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            This tool is boundary-driven, not timing-driven. It does not infer letter
            breaks from how long you pause. Instead, you explicitly tell the decoder when
            a letter or word is complete. That makes output predictable even when you are
            typing quickly.
          </p>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              <strong>Space</strong> commits the current dot-dash chunk as a letter.
            </li>
            <li>
              <strong>/</strong> commits a word break (and also commits any pending letter
              first).
            </li>
            <li>
              If a chunk is not recognized, it decodes to <strong>?</strong> so the
              mistake stays visible instead of being silently corrected.
            </li>
          </ul>

          <div className="mw-static-tile mt-5 rounded-xl bg-[#f7f4ee] p-5">
            <p className="text-base sm:text-lg font-extrabold text-sky-950">
              Why this matters for fluent users
            </p>
            <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
              During a sustained run you want consistency and feedback, not interpretation.
              Boundary rules keep the tool honest. If output looks wrong, the fix is
              simple: correct the chunk, then commit boundaries more cleanly.
            </p>
          </div>
        </div>

        <div
          id="typing-timer"
          className="py-6 sm:py-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Timed sessions
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Choose a preset duration and begin typing. The countdown starts automatically
            on your first valid input, so you do not have to do a start-button ritual.
          </p>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>Short sessions (10s, 30s, 1m) for crisp, high-intensity runs.</li>
            <li>Medium sessions (2m, 5m) to stay accurate as speed changes.</li>
            <li>Long sessions (30m) for endurance and consistency over time.</li>
            <li>
              <strong>Pause</strong> freezes the clock without clearing text.{" "}
              <strong>Reset</strong> clears the session and returns to idle.
            </li>
          </ul>

          <p className="mt-4 text-base sm:text-lg">
            When time runs out, input is locked and a session-complete screen appears.
            Restart immediately for another run or share your results.
          </p>
        </div>

        <div
          id="typing-stats"
          className="py-6 sm:py-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            What the stats mean
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Stats are meant to be useful without turning this into a quiz. They measure
            what you actually committed, not what you intended. That makes them good for
            tracking consistency across repeated runs.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Letters and words
              </p>
              <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
                Letters increase only when you commit a letter boundary. Words increase
                only when you commit a word break. This prevents inflated counts from
                partial chunks.
              </p>
            </div>

            <div className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Letters per minute
              </p>
              <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
                Letters/min is computed from committed letters and elapsed session time.
                It is a repeatable speed indicator for timed runs.
              </p>
            </div>

            <div className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Invalid
              </p>
              <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
                Invalid counts unrecognized dot-dash chunks. A few are normal in
                high-speed sessions. Repeated invalids usually mean a boundary issue or
                an extra character slipped into the stream.
              </p>
            </div>

            <div className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Minimal interference
              </p>
              <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
                Stats stay visible but you are not interrupted by constant grading. You
                stay in flow, then review at the end.
              </p>
            </div>
          </div>

          <div className="mw-static-panel mt-5 rounded-xl bg-[#fffdf8] p-5">
            <p className="text-base font-extrabold text-sky-950">
              Want boundary cleanup?
            </p>
            <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
              If you are preparing Morse for sharing or decoding elsewhere, normalize the
              separators first with{" "}
              <Link
                to="/morse-code-word-separator"
                className="font-extrabold text-sky-950 hover:text-sky-800 underline cursor-pointer"
              >
                Word separator
              </Link>
              .
            </p>
          </div>
        </div>

        <div
          id="typing-pitfalls"
          className="py-6 sm:py-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Common pitfalls (and quick fixes)
          </h3>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              <strong>Everything decodes as ?:</strong> you are missing boundaries. Use
              Space to commit each letter.
            </li>
            <li>
              <strong>Output looks shifted:</strong> one extra dot or dash can change
              multiple letters. Backspace to the last known-good boundary and continue.
            </li>
            <li>
              <strong>Words never increment:</strong> commit word breaks with{" "}
              <code>/</code>.
            </li>
            <li>
              <strong>Mobile typing feels awkward:</strong> try the F/J mapping or use the
              on-screen controls for a thumb-friendly rhythm.
            </li>
          </ul>

          <p className="mt-4 text-base sm:text-lg text-slate-600">
            This tool does not interpret timing like an audio decoder. If boundaries are
            clean, output is clean.
          </p>
        </div>

        <div
          id="typing-sharing"
          className="py-6 sm:py-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Sharing your results
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            When a session completes, you can generate a shareable results card with your
            stats. It is formatted as an image so it looks consistent across devices and
            is easy to post or save. If sharing is not available on your device, you can
            download the PNG instead.
          </p>

          <p className="mt-4 text-base sm:text-lg">
            The card includes duration, letters, words, letters/min, invalid count, and
            session mode. It is meant to be lightweight proof of a completed run, not a
            scoreboard.
          </p>
        </div>
      </div>

      <div className="mt-8 pt-6 sm:pt-7">
        <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
          Quick reference
        </h3>

        <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg text-slate-700">
          <li>
            <strong>What this tool is for:</strong> continuous Morse typing with real-time
            decoding and timed sessions.
          </li>
          <li>
            <strong>How decoding works:</strong> boundary-driven. Space commits a letter,
            <code>/</code> commits a word.
          </li>
          <li>
            <strong>Sessions:</strong> pick a duration. Input locks when time is up and
            stats are shown.
          </li>
          <li>
            <strong>Stats:</strong> letters, words, letters/min, and invalid chunks are
            counted from committed input.
          </li>
          <li>
            <strong>Best use case:</strong> endurance and fluency practice without prompts
            or grading interruptions.
          </li>
        </ul>
      </div>
    </section>
  );
}



