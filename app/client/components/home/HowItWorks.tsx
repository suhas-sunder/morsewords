export default function HowItWorks() {
  return (
    <section className="mt-8 bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1.5 text-sm font-extrabold text-sky-900 border border-sky-200">
            Translator spec
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight">
          How this Morse code translator works
        </h2>

        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
          MorseWords is a two-way{" "}
          <strong>Morse code translator and decoder</strong>. It converts plain
          text to <strong>International Morse</strong> (encode), and it converts
          Morse back to readable text (decode). It is built to be predictable:
          it normalizes inputs, applies a fixed character map, and keeps
          mistakes visible instead of guessing.
        </p>
      </div>

      {/* Optional: quick jump links for long content */}
      <div className="mt-6 flex flex-wrap gap-2">
        {[
          ["Text → Morse", "#encode"],
          ["Morse → Text", "#decode"],
          ["Formatting", "#formatting"],
          ["Supported", "#supported"],
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
          <p className="text-base font-extrabold text-sky-900">
            Spacing legend
          </p>
          <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
            Output uses <strong>3 spaces</strong> between letters and{" "}
            <strong>7 spaces</strong> between words.
          </p>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-base font-extrabold text-sky-900">
            Decoder boundaries
          </p>
          <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
            When decoding, <strong>1–6 spaces</strong> separates letters.{" "}
            <strong>7+ spaces</strong>, <strong>/</strong>, and new lines
            separate words.
          </p>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-base font-extrabold text-sky-900">
            Errors stay visible
          </p>
          <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
            Unknown Morse chunks decode to <strong>?</strong>. Unsupported text
            characters are skipped and surfaced in the UI.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <div
          id="encode"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
            Text → Morse (encode)
          </h3>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              Input text is normalized and uppercased, then each supported
              character is looked up in a fixed International Morse map.
            </li>
            <li>
              Any run of whitespace in the text input is treated as a word
              break. The Morse output is re-emitted with consistent separators.
            </li>
            <li>
              Output formatting is strict: <strong>3 spaces</strong> between
              letters, <strong>7 spaces</strong> between words.
            </li>
            <li>
              Unsupported characters are not invented or approximated. They are
              skipped in the Morse output and listed under the input so you can
              fix the source.
            </li>
          </ul>

          <div className="mt-5">
            <p className="text-base font-extrabold text-gray-800">Example</p>
            <pre className="mt-3 whitespace-pre-wrap rounded-2xl border border-gray-200 bg-gray-50 p-4 text-base sm:text-lg font-mono overflow-x-auto">
              {`HELLO WORLD
....   .   .-..   .-..   ---       .--   ---   .-.   .-..   -..`}
            </pre>
            <p className="mt-3 text-base sm:text-lg text-gray-600">
              The spacing is part of the output. If you copy this Morse
              elsewhere, keep the gaps.
            </p>
          </div>
        </div>

        <div
          id="decode"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
            Morse → Text (decode)
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Decoding is boundary-driven. The tool does not infer letter breaks
            from timing. It reads chunks of dots and dashes, then uses
            separators to decide where each letter and word ends.
          </p>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              Valid Morse characters are dot and dash, plus whitespace and{" "}
              <strong>/</strong> for separation.
            </li>
            <li>
              The decoder normalizes common lookalikes: <strong>· • ∙</strong>{" "}
              become dot, and <strong>– — −</strong> become dash.
            </li>
            <li>
              Separators: <strong>1–6 spaces</strong> means letter gap.{" "}
              <strong>7+ spaces</strong>, <strong>/</strong>, or a new line
              means word gap.
            </li>
            <li>
              If a Morse chunk is not recognized, the output shows{" "}
              <strong>?</strong> so the mistake stays visible and you can
              correct it.
            </li>
          </ul>

          <div className="mt-5">
            <p className="text-base font-extrabold text-gray-800">Examples</p>
            <pre className="mt-3 whitespace-pre-wrap rounded-2xl border border-gray-200 bg-gray-50 p-4 text-base sm:text-lg font-mono overflow-x-auto">
              {`...   ---   ...
SOS

... / --- / ...
S O S`}
            </pre>
            <p className="mt-3 text-base sm:text-lg text-gray-600">
              Tip: if everything runs together, add separators. The safest
              format is 3 spaces between letters and 7 spaces between words.
            </p>
          </div>
        </div>

        <div
          id="formatting"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
            Input formatting guide
          </h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
              <p className="text-base sm:text-lg font-extrabold text-sky-900">
                For best decoding
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-2 text-base sm:text-lg">
                <li>3 spaces between letters</li>
                <li>7 spaces between words</li>
                <li>/ can replace a word gap</li>
                <li>New lines count as word gaps</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
              <p className="text-base sm:text-lg font-extrabold text-sky-900">
                Common paste problems
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-2 text-base sm:text-lg">
                <li>Fancy dashes from PDFs</li>
                <li>Dots rendered as bullets</li>
                <li>Mixed separators</li>
                <li>Extra punctuation mixed into Morse</li>
              </ul>
            </div>
          </div>

          <p className="mt-5 text-base sm:text-lg">
            If you need to preserve exact spacing inside a single word, this
            tool will not do that. It favors predictable normalization and
            consistent separators so copied output behaves the same across
            tools.
          </p>
        </div>

        <div
          id="supported"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
            Supported characters and assumptions
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            This translator supports A–Z, 0–9, and a core set of common
            punctuation. It intentionally does not guess at extended alphabets
            or locale-specific variants.
          </p>

          <p className="mt-4 text-base sm:text-lg">
            Supported punctuation includes:{" "}
            <code className="rounded-md bg-gray-50 px-2 py-1 border border-gray-200">
              . , ? / ' ! - @ : ; = + &quot; ( ) &amp; _
            </code>
            .
          </p>

          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-base font-extrabold text-gray-800">
              Related tools
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-3 text-base sm:text-lg">
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
                  href="/dictionary"
                  className="text-sky-900 underline hover:no-underline cursor-pointer"
                >
                  Dictionary
                </a>{" "}
                to look up characters and punctuation.
              </li>
              <li>
                <a
                  href="/practice"
                  className="text-sky-900 underline hover:no-underline cursor-pointer"
                >
                  Practice
                </a>{" "}
                and{" "}
                <a
                  href="/typing"
                  className="text-sky-900 underline hover:no-underline cursor-pointer"
                >
                  Typing
                </a>{" "}
                for drills and repetition.
              </li>
              <li>
                <a
                  href="/how-to-use"
                  className="text-sky-900 underline hover:no-underline cursor-pointer"
                >
                  How to use
                </a>{" "}
                for suite-level notes.
              </li>
            </ul>
          </div>
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
              <strong>Decoded text looks wrong:</strong> check boundaries. Add 3
              spaces between letters and 7 spaces between words, or use /
              between words.
            </li>
            <li>
              <strong>You see ? characters:</strong> at least one Morse chunk
              was not recognized. Look for missing dots, extra dashes, or
              accidental characters mixed into the Morse.
            </li>
            <li>
              <strong>Encoding skipped characters:</strong> the unsupported list
              under the input shows exactly what was ignored. Replace those
              characters with supported punctuation or plain letters.
            </li>
            <li>
              <strong>Pasted Morse has weird symbols:</strong> PDFs often
              replace hyphen with a long dash, and dot with a bullet. This tool
              normalizes the most common variants, but anything else will be
              flagged as invalid.
            </li>
            <li>
              <strong>Audio is silent:</strong> confirm Sound is on, raise
              volume, and make sure your device is not muted. If you are using
              Bluetooth, reconnect and try again.
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
        <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
          Quick answers
        </h3>

        <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg text-gray-700">
          <li>
            <strong>What this tool does:</strong> Converts plain text to
            International Morse code and decodes Morse back to readable text.
          </li>
          <li>
            <strong>Best output format:</strong> 3 spaces between letters, 7
            spaces between words. You can also use <code>/</code> to separate
            words.
          </li>
          <li>
            <strong>How decoding works:</strong> The decoder reads dots and
            dashes and uses separators to decide where letters and words end. It
            does not guess timing.
          </li>
          <li>
            <strong>Errors and unknowns:</strong> Unknown Morse chunks decode to{" "}
            <code>?</code>. Unsupported text characters are skipped and shown so
            you can fix the input.
          </li>
        </ul>
      </div>
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
        <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
          Morse formatting rules
        </h3>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-base sm:text-lg">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 text-left font-extrabold text-sky-900">
                  Rule
                </th>
                <th className="py-2 text-left font-extrabold text-sky-900">
                  Behavior
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">Letter separator (encode)</td>
                <td className="py-2">3 spaces</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">Word separator (encode)</td>
                <td className="py-2">7 spaces</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">Letter separator (decode)</td>
                <td className="py-2">1–6 spaces</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">Word separator (decode)</td>
                <td className="py-2">
                  7+ spaces, <code>/</code>, or new line
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Unknown Morse chunk</td>
                <td className="py-2">
                  Decodes to <code>?</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
