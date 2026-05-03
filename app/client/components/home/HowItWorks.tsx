export default function HowItWorks() {
  const jumpLinks = [
    ["Text → Morse", "#encode"],
    ["Morse → Text", "#decode"],
    ["Formatting", "#formatting"],
    ["Supported", "#supported"],
    ["Troubleshooting", "#troubleshooting"],
  ] as const;

  return (
    <section className="mt-8 overflow-hidden rounded-2xl bg-[#fffdf8]">
      <div className="bg-[#fffaf2] px-5 py-6 sm:px-8 sm:py-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-sky-800" />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
                Translator spec
              </span>
            </div>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
              How this Morse code translator works
            </h2>

            <p className="mt-4 max-w-[72ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              MorseWords is a two-way{" "}
              <strong>Morse code translator and decoder</strong>. It converts
              plain text to <strong>International Morse</strong> and converts
              Morse back to readable text. It normalizes input, applies a fixed
              character map, and keeps mistakes visible instead of guessing.
            </p>
          </div>

          <div className="rounded-xl bg-[#171717] px-4 py-3 text-white lg:w-64">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
              Reference signal
            </p>
            <p className="mt-2 font-mono text-lg font-bold tracking-[0.18em] text-sky-100">
              ... --- ...
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">
              Spacing is part of the message, not decoration.
            </p>
          </div>
        </div>

        <nav
          className="mt-5 flex flex-wrap gap-2"
          aria-label="Translator notes"
        >
          {jumpLinks.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="cursor-pointer rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-sky-950"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <div className="bg-[#fffdf8] px-5 py-6 sm:px-8 sm:py-7">
        <dl className="grid gap-5 pb-6 md:grid-cols-3">
          <div>
            <dt className="text-base font-extrabold text-sky-950">
              Spacing legend
            </dt>
            <dd className="mt-3 max-w-[34ch] text-base leading-relaxed text-slate-700">
              Output uses <strong>3 spaces</strong> between letters and{" "}
              <strong>7 spaces</strong> between words.
            </dd>
          </div>

          <div>
            <dt className="text-base font-extrabold text-sky-950">
              Decoder boundaries
            </dt>
            <dd className="mt-3 max-w-[34ch] text-base leading-relaxed text-slate-700">
              When decoding, <strong>1-6 spaces</strong> separates letters.{" "}
              <strong>7+ spaces</strong>, <strong>/</strong>, and new lines
              separate words.
            </dd>
          </div>

          <div>
            <dt className="text-base font-extrabold text-sky-950">
              Errors stay visible
            </dt>
            <dd className="mt-3 max-w-[34ch] text-base leading-relaxed text-slate-700">
              Unknown Morse chunks decode to <strong>?</strong>. Unsupported
              text characters are skipped and surfaced in the UI.
            </dd>
          </div>
        </dl>

        <div className="text-slate-700">
          <section id="encode" className="py-7">
            <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
              <header>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Plain text input
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-sky-950">
                  Text → Morse
                </h3>
              </header>

              <div className="max-w-[72ch]">
                <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed sm:text-lg">
                  <li>
                    Input text is normalized and uppercased, then each supported
                    character is looked up in a fixed International Morse map.
                  </li>
                  <li>
                    Any run of whitespace in the text input is treated as a word
                    break.
                  </li>
                  <li>
                    Output formatting is strict: <strong>3 spaces</strong>{" "}
                    between letters, <strong>7 spaces</strong> between words.
                  </li>
                  <li>
                    Unsupported characters are skipped and listed under the
                    input so you can fix the source.
                  </li>
                </ul>

                <div className="mt-5">
                  <p className="text-base font-extrabold text-sky-950">
                    Example
                  </p>
                  <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl bg-[#171717] p-4 font-mono text-base leading-relaxed text-sky-50">
                    {`HELLO WORLD
....   .   .-..   .-..   ---       .--   ---   .-.   .-..   -..`}
                  </pre>
                  <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-slate-600">
                    The spacing is part of the output. If you copy this Morse
                    elsewhere, keep the gaps.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="decode" className="py-7">
            <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
              <header>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Boundary based
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-sky-950">
                  Morse → Text
                </h3>
              </header>

              <div className="max-w-[72ch]">
                <p className="text-base leading-relaxed sm:text-lg">
                  Decoding is boundary-driven. The tool reads chunks of dots and
                  dashes, then uses separators to decide where each letter and
                  word ends.
                </p>

                <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed sm:text-lg">
                  <li>
                    Valid Morse characters are dot and dash, plus whitespace and{" "}
                    <strong>/</strong> for separation.
                  </li>
                  <li>
                    Common lookalikes such as <strong>· • ∙</strong> become
                    dots, and <strong>– — −</strong> become dashes.
                  </li>
                  <li>
                    <strong>1-6 spaces</strong> means letter gap.{" "}
                    <strong>7+ spaces</strong>, <strong>/</strong>, or a new
                    line means word gap.
                  </li>
                  <li>
                    Unknown Morse chunks output <strong>?</strong> so mistakes
                    remain visible.
                  </li>
                </ul>

                <div className="mt-5">
                  <p className="text-base font-extrabold text-sky-950">
                    Examples
                  </p>
                  <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl bg-[#f7f4ee] p-4 font-mono text-base leading-relaxed text-slate-900">
                    {`...   ---   ...
SOS

... / --- / ...
S O S`}
                  </pre>
                  <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-slate-600">
                    If everything runs together, add separators. The safest
                    format is 3 spaces between letters and 7 spaces between
                    words.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="formatting" className="py-7">
            <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
              <header>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Input rules
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-sky-950">
                  Formatting guide
                </h3>
              </header>

              <div className="max-w-[72ch]">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-base font-extrabold text-sky-950">
                      For best decoding
                    </p>
                    <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-relaxed">
                      <li>3 spaces between letters</li>
                      <li>7 spaces between words</li>
                      <li>/ can replace a word gap</li>
                      <li>New lines count as word gaps</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-base font-extrabold text-sky-950">
                      Common paste problems
                    </p>
                    <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-relaxed">
                      <li>Fancy dashes from PDFs</li>
                      <li>Dots rendered as bullets</li>
                      <li>Mixed separators</li>
                      <li>Extra punctuation mixed into Morse</li>
                    </ul>
                  </div>
                </div>

                <p className="mt-5 max-w-[68ch] text-base leading-relaxed text-slate-600 sm:text-lg">
                  If you need to preserve exact spacing inside a single word,
                  this tool will not do that. It favors predictable
                  normalization and consistent separators.
                </p>
              </div>
            </div>
          </section>

          <section id="supported" className="py-7">
            <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
              <header>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Character map
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-sky-950">
                  Supported characters
                </h3>
              </header>

              <div className="max-w-[72ch]">
                <p className="text-base leading-relaxed sm:text-lg">
                  This translator supports A-Z, 0-9, and a core set of common
                  punctuation. It intentionally does not guess at extended
                  alphabets or locale-specific variants.
                </p>

                <div className="mt-4">
                  <p className="text-base font-extrabold text-sky-950">
                    Supported punctuation
                  </p>

                  <div
                    className="mt-3 flex flex-wrap gap-2"
                    aria-label="Supported punctuation"
                  >
                    {[
                      [".", "Period"],
                      [",", "Comma"],
                      ["?", "Question mark"],
                      ["/", "Slash"],
                      ["'", "Apostrophe"],
                      ["!", "Exclamation mark"],
                      ["-", "Hyphen"],
                      ["@", "At sign"],
                      [":", "Colon"],
                      [";", "Semicolon"],
                      ["=", "Equals sign"],
                      ["+", "Plus sign"],
                      ['"', "Quotation mark"],
                      ["(", "Opening parenthesis"],
                      [")", "Closing parenthesis"],
                      ["&", "Ampersand"],
                      ["_", "Underscore"],
                    ].map(([symbol, label]) => (
                      <span
                        key={symbol}
                        title={label}
                        className="inline-flex min-w-9 items-center justify-center rounded-md bg-[#f7f4ee] px-2.5 py-1.5 font-mono text-sm font-bold text-slate-900"
                      >
                        {symbol}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-base font-extrabold text-sky-950">
                    Related tools
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-relaxed">
                    <li>
                      <a
                        href="/audio"
                        className="cursor-pointer font-semibold text-sky-900 underline transition hover:text-sky-700 hover:no-underline"
                      >
                        Audio
                      </a>{" "}
                      for focused playback and timing controls.
                    </li>
                    <li>
                      <a
                        href="/dictionary"
                        className="cursor-pointer font-semibold text-sky-900 underline transition hover:text-sky-700 hover:no-underline"
                      >
                        Dictionary
                      </a>{" "}
                      to look up characters and punctuation.
                    </li>
                    <li>
                      <a
                        href="/practice"
                        className="cursor-pointer font-semibold text-sky-900 underline transition hover:text-sky-700 hover:no-underline"
                      >
                        Practice
                      </a>{" "}
                      and{" "}
                      <a
                        href="/typing"
                        className="cursor-pointer font-semibold text-sky-900 underline transition hover:text-sky-700 hover:no-underline"
                      >
                        Typing
                      </a>{" "}
                      for drills and repetition.
                    </li>
                    <li>
                      <a
                        href="/how-to-use"
                        className="cursor-pointer font-semibold text-sky-900 underline transition hover:text-sky-700 hover:no-underline"
                      >
                        How to use
                      </a>{" "}
                      for suite-level notes.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section id="troubleshooting" className="py-7">
            <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
              <header>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Fix mistakes
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-sky-950">
                  Troubleshooting
                </h3>
              </header>

              <ul className="max-w-[72ch] list-disc space-y-2 pl-6 text-base leading-relaxed sm:text-lg">
                <li>
                  <strong>Decoded text looks wrong:</strong> check boundaries.
                  Add 3 spaces between letters and 7 spaces between words.
                </li>
                <li>
                  <strong>You see ? characters:</strong> at least one Morse
                  chunk was not recognized.
                </li>
                <li>
                  <strong>Encoding skipped characters:</strong> replace those
                  characters with supported punctuation or plain letters.
                </li>
                <li>
                  <strong>Pasted Morse has weird symbols:</strong> PDFs often
                  replace hyphens with long dashes and dots with bullets.
                </li>
                <li>
                  <strong>Audio is silent:</strong> confirm Sound is on, raise
                  volume, and make sure your device is not muted.
                </li>
              </ul>
            </div>
          </section>
        </div>

        <div className="grid gap-6 bg-[#fffaf2] px-0 pt-7 lg:grid-cols-[1fr_1.05fr]">
          <section>
            <h3 className="text-2xl font-extrabold text-sky-950">
              Quick answers
            </h3>

            <ul className="mt-4 max-w-[68ch] list-disc space-y-2 pl-6 text-base leading-relaxed text-slate-700 sm:text-lg">
              <li>
                <strong>What this tool does:</strong> Converts plain text to
                International Morse code and decodes Morse back to readable
                text.
              </li>
              <li>
                <strong>Best output format:</strong> 3 spaces between letters, 7
                spaces between words. You can also use <code>/</code>.
              </li>
              <li>
                <strong>How decoding works:</strong> The decoder uses dots,
                dashes, and separators to decide where letters and words end.
              </li>
              <li>
                <strong>Errors and unknowns:</strong> Unknown Morse chunks
                decode to <code>?</code>.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-extrabold text-sky-950">
              Morse formatting rules
            </h3>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-base sm:text-lg">
                <thead>
                  <tr>
                    <th className="py-2 pr-4 text-left font-extrabold text-sky-950">
                      Rule
                    </th>
                    <th className="py-2 text-left font-extrabold text-sky-950">
                      Behavior
                    </th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr>
                    <td className="py-2 pr-4">Letter separator encode</td>
                    <td className="py-2">3 spaces</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Word separator encode</td>
                    <td className="py-2">7 spaces</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Letter separator decode</td>
                    <td className="py-2">1-6 spaces</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Word separator decode</td>
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
          </section>
        </div>
      </div>
    </section>
  );
}
