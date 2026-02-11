export default function HowItWorks() {
  const phrase = "the quick brown fox jumps over the lazy dog";
  const phraseUpper = "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG";

  // 3 spaces between letters, 7 spaces between words
  // This Morse is International Morse for A–Z.
  const morseCopyFriendly = `-   ....   .       --.-   ..-   ..   -.-.   -.-       -...   .-.   ---   .--   -.       ..-.   ---   -..-       .---   ..-   --   .--.   ...       ---   ...-   .   .-.       - ....   .       .-..   .-   --..   -.--       -..   ---   --.`;

  // Human-friendly with visible word separators
  const morseWithSlashes = `- .... . / --.- ..- .. -.-. -.- / -... .-. --- .-- -. / ..-. --- -..- / .--- ..- -- .--. ... / --- ...- . .-. / - .... . / .-.. .- --.. -.-- / -.. --- --.`;

  return (
    <section className="mt-8 bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1.5 text-sm font-extrabold text-sky-900 border border-sky-200">
            Phrase page
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight">
          The Quick Brown Fox in Morse code
        </h2>

        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
          This page focuses on the classic pangram{" "}
          <strong>“the quick brown fox jumps over the lazy dog”</strong>. It is
          commonly used for typing tests and puzzles because it contains every
          letter A–Z. Here you can copy the Morse, and use the decoder to verify
          spacing and separators.
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
            className="px-3 py-1.5 rounded-full text-sm sm:text-base font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer transition"
          >
            {label}
          </a>
        ))}
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-base font-extrabold text-sky-900">Copy-friendly</p>
          <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
            Uses <strong>3 spaces</strong> between letters and{" "}
            <strong>7 spaces</strong> between words.
          </p>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-base font-extrabold text-sky-900">
            Human-friendly
          </p>
          <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
            A visible separator like <strong>/</strong> is common in puzzles and
            social posts.
          </p>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-base font-extrabold text-sky-900">Decode safety</p>
          <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
            If you paste Morse into a decoder, use consistent separators so word
            breaks do not collapse.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <div
          id="phrase"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
            The phrase
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm font-extrabold text-gray-800">Lowercase</p>
              <pre className="mt-2 whitespace-pre-wrap text-base sm:text-lg font-mono">
                {phrase}
              </pre>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm font-extrabold text-gray-800">Uppercase</p>
              <pre className="mt-2 whitespace-pre-wrap text-base sm:text-lg font-mono">
                {phraseUpper}
              </pre>
            </div>
          </div>

          <p className="mt-4 text-base sm:text-lg text-gray-700">
            If you are using this in a puzzle, you can keep it as a single line,
            or split it across lines. Just keep word boundaries consistent in
            the Morse output.
          </p>
        </div>

        <div
          id="morse-copy"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
            Morse code (copy-friendly spacing)
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            This version is designed for tools and copy/paste:{" "}
            <strong>3 spaces</strong> between letters and{" "}
            <strong>7 spaces</strong> between words.
          </p>

          <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-gray-200 bg-gray-50 p-4 text-base sm:text-lg font-mono overflow-x-auto">
            {morseCopyFriendly}
          </pre>

          <p className="mt-3 text-base sm:text-lg text-gray-600">
            Tip: some apps collapse multiple spaces. If your platform does that,
            use the “with /” version below.
          </p>
        </div>

        <div
          id="morse-slash"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
            Morse code (with / between words)
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            This version is easier for humans to read and share. It avoids the
            “how many spaces is that?” problem.
          </p>

          <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-gray-200 bg-gray-50 p-4 text-base sm:text-lg font-mono overflow-x-auto">
            {morseWithSlashes}
          </pre>
        </div>

        <div
          id="decode-check"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
            Decode check
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            If you paste either Morse string into a decoder, you should get:
          </p>

          <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-gray-200 bg-gray-50 p-4 text-base sm:text-lg font-mono overflow-x-auto">
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
        </div>

        <div
          id="spacing-rules"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
            Spacing rules
          </h3>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-base sm:text-lg">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 text-left font-extrabold text-sky-900">
                    Item
                  </th>
                  <th className="py-2 text-left font-extrabold text-sky-900">
                    Meaning
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4">Letter gap (output)</td>
                  <td className="py-2">3 spaces</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4">Word gap (output)</td>
                  <td className="py-2">7 spaces</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4">Word divider (alternative)</td>
                  <td className="py-2">
                    <code>/</code> between words
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Common paste issue</td>
                  <td className="py-2">
                    Multiple spaces can collapse into one on some platforms
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-base sm:text-lg text-gray-700">
            If you need a format that survives “space-collapsing” platforms,
            prefer the version that uses <code>/</code>.
          </p>
        </div>

        <div
          id="tips"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
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
        </div>

        <div
          id="related-tools"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
            Related tools
          </h3>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              <a
                href="/morse-code-encoder"
                className="text-sky-900 underline hover:no-underline cursor-pointer"
              >
                Morse code encoder
              </a>{" "}
              to generate Morse from your own text.
            </li>
            <li>
              <a
                href="/morse-code-decoder"
                className="text-sky-900 underline hover:no-underline cursor-pointer"
              >
                Morse code decoder
              </a>{" "}
              to decode dots and dashes back to text.
            </li>
            <li>
              <a
                href="/audio"
                className="text-sky-900 underline hover:no-underline cursor-pointer"
              >
                Audio
              </a>{" "}
              for focused playback and timing controls.
            </li>
            <li>
              <a
                href="/practice"
                className="text-sky-900 underline hover:no-underline cursor-pointer"
              >
                Practice
              </a>{" "}
              for drills and repetition.
            </li>
            <li>
              <a
                href="/dictionary"
                className="text-sky-900 underline hover:no-underline cursor-pointer"
              >
                Dictionary
              </a>{" "}
              to look up letters and punctuation.
            </li>
          </ul>
        </div>

        <div
          id="troubleshooting"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
            Troubleshooting
          </h3>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              <strong>Decoded text looks wrong:</strong> check boundaries first.
              If word gaps collapsed, the decoder will join tokens that should
              be separate.
            </li>
            <li>
              <strong>You see ? characters:</strong> at least one Morse chunk
              was not recognized. Look for missing dots, extra dashes, or stray
              characters mixed into the Morse string.
            </li>
            <li>
              <strong>Pasted Morse has weird symbols:</strong> dots are
              sometimes pasted as <code>•</code> and dashes as <code>—</code>.
              If your tool does not normalize them, replace with <code>.</code>{" "}
              and <code>-</code>.
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
        <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
          Quick reference
        </h3>

        <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg text-gray-700">
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
