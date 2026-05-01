import { Link } from "react-router";

export default function HowItWorks() {
  const phrase = "the quick brown fox jumps over the lazy dog";
  const phraseUpper = "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG";

  // 3 spaces between letters, 7 spaces between words
  // This Morse is International Morse for A–Z.
  const morseCopyFriendly = `-   ....   .       --.-   ..-   ..   -.-.   -.-       -...   .-.   ---   .--   -.       ..-.   ---   -..-       .---   ..-   --   .--.   ...       ---   ...-   .   .-.       - ....   .       .-..   .-   --..   -.--       -..   ---   --.`;

  // Human-friendly with visible word separators
  const morseWithSlashes = `- .... . / --.- ..- .. -.-. -.- / -... .-. --- .-- -. / ..-. --- -..- / .--- ..- -- .--. ... / --- ...- . .-. / - .... . / .-.. .- --.. -.-- / -.. --- --.`;

  return (
    <section className="mw-how-section mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-[#fffdf8] p-5 shadow-sm sm:p-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-sky-800" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">Phrase page</span>
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
          The Quick Brown Fox in Morse code
        </h2>

        <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
          This page focuses on the classic pangram{" "}
          <strong>“the quick brown fox jumps over the lazy dog”</strong>. It is
          commonly used for typing tests and puzzles because it contains every
          letter A–Z. Here you can copy the Morse in two formats and verify it
          using the decoder.
        </p>
      </div>

      {/* Quick jump links */}
      <div className="mt-6 flex flex-wrap gap-2">
        {[
          ["Phrase", "#phrase"],
          ["Morse (copy-friendly)", "#morse-copy"],
          ["Morse (with /)", "#morse-slash"],
          ["Decode check", "#decode-check"],
          ["Spacing rules", "#spacing-rules"],
          ["Puzzles & tips", "#tips"],
          ["Related tools", "#related-tools"],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-950"
          >
            {label}
          </a>
        ))}
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-[#f7f4ee] p-5">
          <p className="text-base font-extrabold text-sky-950">Copy-friendly</p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            Uses <strong>3 spaces</strong> between letters and{" "}
            <strong>7 spaces</strong> between words.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-[#f7f4ee] p-5">
          <p className="text-base font-extrabold text-sky-950">
            Human-friendly
          </p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            A visible separator like <strong>/</strong> is common in puzzles and
            social posts.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-[#f7f4ee] p-5">
          <p className="text-base font-extrabold text-sky-950">Decode safety</p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            If your platform collapses multiple spaces, use the{" "}
            <strong>/</strong> version to keep word boundaries intact.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6 text-slate-700 leading-relaxed">
        <div
          id="phrase"
          className="rounded-xl border border-slate-200 bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            The phrase
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-[#f7f4ee] p-5">
              <p className="text-sm font-extrabold text-sky-950">Lowercase</p>
              <pre className="mt-2 whitespace-pre-wrap text-base sm:text-lg font-mono">
                {phrase}
              </pre>
            </div>

            <div className="rounded-xl border border-slate-200 bg-[#f7f4ee] p-5">
              <p className="text-sm font-extrabold text-sky-950">Uppercase</p>
              <pre className="mt-2 whitespace-pre-wrap text-base sm:text-lg font-mono">
                {phraseUpper}
              </pre>
            </div>
          </div>

          <p className="mt-4 text-base sm:text-lg text-slate-700">
            If you use this in a puzzle, you can keep it as one line or split it
            across lines. Just keep word boundaries consistent in the Morse.
          </p>
        </div>

        <div
          id="morse-copy"
          className="rounded-xl border border-slate-200 bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Morse code (copy-friendly spacing)
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            This version is designed for tools and copy/paste:{" "}
            <strong>3 spaces</strong> between letters and{" "}
            <strong>7 spaces</strong> between words.
          </p>

          <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-200 bg-[#f7f4ee] p-4 text-base sm:text-lg font-mono overflow-x-auto">
            {morseCopyFriendly}
          </pre>

          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Tip: some apps collapse multiple spaces. If your platform does that,
            use the “with /” version below.
          </p>
        </div>

        <div
          id="morse-slash"
          className="rounded-xl border border-slate-200 bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Morse code (with / between words)
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            This version is easier for humans to read and share. It avoids the
            “how many spaces is that?” problem.
          </p>

          <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-200 bg-[#f7f4ee] p-4 text-base sm:text-lg font-mono overflow-x-auto">
            {morseWithSlashes}
          </pre>
        </div>

        <div
          id="decode-check"
          className="rounded-xl border border-slate-200 bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Decode check
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            If you paste either Morse string into a decoder, you should get:
          </p>

          <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-200 bg-[#f7f4ee] p-4 text-base sm:text-lg font-mono overflow-x-auto">
            {phraseUpper}
          </pre>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              If the output looks wrong, check word boundaries first. Collapsed
              spacing is the most common cause.
            </li>
            <li>
              If you see <strong>?</strong> characters, at least one dot-dash
              chunk was not recognized (often caused by a missing separator or a
              pasted symbol that is not a real dot/dash).
            </li>
          </ul>

          <div className="mt-5 rounded-xl border border-slate-200 bg-[#fffdf8] p-5">
            <p className="text-base font-extrabold text-sky-950">
              Verify instantly
            </p>
            <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
              Paste into the{" "}
              <Link
                to="/morse-code-decoder"
                className="font-extrabold text-sky-950 hover:text-sky-800 underline cursor-pointer"
              >
                decoder
              </Link>{" "}
              to confirm spacing and token boundaries.
            </p>
          </div>
        </div>

        <div
          id="spacing-rules"
          className="rounded-xl border border-slate-200 bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Spacing rules
          </h3>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-base sm:text-lg">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2 text-left font-extrabold text-sky-950">
                    Item
                  </th>
                  <th className="py-2 text-left font-extrabold text-sky-950">
                    Meaning
                  </th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4">Letter gap (output)</td>
                  <td className="py-2">3 spaces</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4">Word gap (output)</td>
                  <td className="py-2">7 spaces</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4">Word divider (alternative)</td>
                  <td className="py-2">
                    <code>/</code> between words
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Common paste issue</td>
                  <td className="py-2">
                    Some platforms collapse multiple spaces into one
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-base sm:text-lg text-slate-700">
            If you need a format that survives space-collapsing platforms,
            prefer the version that uses <code>/</code>.
          </p>
        </div>

        <div
          id="tips"
          className="rounded-xl border border-slate-200 bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Puzzles and practice tips
          </h3>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              For human-first puzzles, use <code>/</code> so word breaks are
              obvious.
            </li>
            <li>
              For tool-first workflows, use 7 spaces so decoders treat word gaps
              unambiguously.
            </li>
            <li>
              If your Morse came from a PDF, watch for bullet dots (
              <code>•</code>) and long dashes (<code>—</code>). Many tools
              normalize common variants, but not all.
            </li>
          </ul>

          <div className="mt-5 rounded-xl border border-slate-200 bg-[#fffdf8] p-5">
            <p className="text-base font-extrabold text-sky-950">
              Practice this phrase
            </p>
            <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
              Use{" "}
              <Link
                to="/practice"
                className="font-extrabold text-sky-950 hover:text-sky-800 underline cursor-pointer"
              >
                Practice
              </Link>{" "}
              for 10-question drills or{" "}
              <Link
                to="/audio"
                className="font-extrabold text-sky-950 hover:text-sky-800 underline cursor-pointer"
              >
                Audio
              </Link>{" "}
              to hear timing at different speeds.
            </p>
          </div>
        </div>

        <div
          id="related-tools"
          className="rounded-xl border border-slate-200 bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Related tools
          </h3>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              <Link
                to="/morse-code-encoder"
                className="text-sky-950 underline hover:no-underline cursor-pointer font-semibold"
              >
                Morse code encoder
              </Link>{" "}
              to generate Morse from your own text.
            </li>
            <li>
              <Link
                to="/morse-code-decoder"
                className="text-sky-950 underline hover:no-underline cursor-pointer font-semibold"
              >
                Morse code decoder
              </Link>{" "}
              to decode dots and dashes back to text.
            </li>
            <li>
              <Link
                to="/audio"
                className="text-sky-950 underline hover:no-underline cursor-pointer font-semibold"
              >
                Audio
              </Link>{" "}
              for playback and timing controls.
            </li>
            <li>
              <Link
                to="/practice"
                className="text-sky-950 underline hover:no-underline cursor-pointer font-semibold"
              >
                Practice
              </Link>{" "}
              for drills and repetition.
            </li>
            <li>
              <Link
                to="/dictionary"
                className="text-sky-950 underline hover:no-underline cursor-pointer font-semibold"
              >
                Dictionary
              </Link>{" "}
              to look up letters and punctuation.
            </li>
          </ul>
        </div>

        <div
          id="troubleshooting"
          className="rounded-xl border border-slate-200 bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Troubleshooting
          </h3>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              <strong>Decoded text looks wrong:</strong> check boundaries first.
              If word gaps collapsed, the decoder may join tokens that should be
              separate.
            </li>
            <li>
              <strong>You see ? characters:</strong> at least one Morse chunk
              was not recognized. Look for missing dots, extra dashes, or stray
              characters mixed into the Morse string.
            </li>
            <li>
              <strong>Pasted Morse has weird symbols:</strong> dots are
              sometimes pasted as <code>•</code> and dashes as <code>—</code>.
              Replace with <code>.</code> and <code>-</code> if your tool does
              not normalize them.
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-[#fffdf8] p-5 sm:p-7">
        <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
          Quick reference
        </h3>

        <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg text-slate-700">
          <li>
            <strong>Phrase:</strong> “the quick brown fox jumps over the lazy
            dog”
          </li>
          <li>
            <strong>Why this phrase:</strong> It contains every letter A–Z at
            least once.
          </li>
          <li>
            <strong>Tool-friendly Morse:</strong> 3 spaces between letters, 7
            spaces between words.
          </li>
          <li>
            <strong>Human-friendly Morse:</strong> Use <code>/</code> between
            words.
          </li>
          <li>
            <strong>Decode result:</strong> THE QUICK BROWN FOX JUMPS OVER THE
            LAZY DOG
          </li>
        </ul>
      </div>
    </section>
  );
}



