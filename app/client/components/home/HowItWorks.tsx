import { Link } from "react-router";

const summaryPoints = [
  {
    title: "Spacing legend",
    body: "Output uses 3 spaces between letters and 7 spaces between words.",
  },
  {
    title: "Decoder boundaries",
    body: "When decoding, 1-6 spaces separate letters. 7+ spaces, /, and new lines separate words.",
  },
  {
    title: "Errors stay visible",
    body: "Unknown Morse chunks decode to ?. Unsupported text characters are skipped and surfaced in the UI.",
  },
] as const;

const supportedPunctuation = [
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
] as const;

export default function HowItWorks() {
  return (
    <section
      className="mw-bg-page-soft bg-[#fffaf2]/35 px-4 pb-8 pt-9 sm:px-6 sm:pb-10 sm:pt-12 lg:px-8"
      aria-labelledby="how-it-works-title"
    >
      <div className="mx-auto max-w-[1160px]">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="mw-eyebrow-line h-px w-8 bg-sky-800" />
              <span className="mw-eyebrow-text font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
                Translator spec
              </span>
            </div>

            <h2
              id="how-it-works-title"
              className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
            >
              How this Morse code translator works
            </h2>

            <p className="mw-text-muted mt-4 max-w-[58ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              MorseWords is a two-way{" "}
              <strong>Morse code translator and decoder</strong>. It converts
              plain text to <strong>International Morse</strong> and converts
              Morse back to readable text. It normalizes input, applies a fixed
              character map, and keeps mistakes visible instead of guessing.
            </p>
          </div>

          <aside className="mw-panel-dark rounded-xl bg-slate-950 px-4 py-3 text-white">
            <p className="mw-output-muted font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
              Reference signal
            </p>
            <p className="mw-output-text mt-2 font-mono text-lg font-bold tracking-[0.18em] text-sky-100">
              ... --- ...
            </p>
            <p className="mw-output-soft mt-2 text-sm leading-relaxed text-slate-200">
              Spacing is part of the message, not decoration.
            </p>
          </aside>
        </div>

        <dl className="mt-9 grid gap-6 md:grid-cols-3">
          {summaryPoints.map((item) => (
            <div key={item.title}>
              <dt className="mw-heading text-base font-extrabold text-sky-950">
                {item.title}
              </dt>
              <dd className="mw-text-muted mt-2 max-w-[35ch] text-base leading-relaxed text-slate-700">
                {item.body}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mw-text-muted mt-10 space-y-10 text-slate-700">
          <section id="encode">
            <div className="grid gap-6 lg:grid-cols-[235px_minmax(0,1fr)]">
              <header>
                <p className="mw-muted-label font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Plain text input
                </p>
                <h3 className="mw-heading mt-2 text-2xl font-extrabold text-sky-950">
                  Text to Morse
                </h3>
              </header>

              <div className="max-w-none">
                <ul className="grid list-disc gap-x-8 gap-y-2 pl-6 text-base leading-relaxed sm:text-lg lg:grid-cols-3">
                  <li>
                    Input text is normalized and uppercased, then each supported
                    character is looked up in a fixed International Morse map.
                  </li>
                  <li>
                    Any run of whitespace in the text input is treated as a word
                    break.
                  </li>
                  <li>
                    Unsupported characters are skipped and listed under the
                    input so you can fix the source.
                  </li>
                </ul>

                <div className="mt-6">
                  <p className="mw-heading text-base font-extrabold text-sky-950">
                    Example
                  </p>
                  <pre className="mw-panel-dark mw-output-bright mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-4 font-mono text-base leading-relaxed text-sky-50">
                    {`HELLO WORLD
....   .   .-..   .-..   ---       .--   ---   .-.   .-..   -..`}
                  </pre>
                  <p className="mw-text-soft mt-3 max-w-[58ch] text-base leading-relaxed text-slate-600">
                    The spacing is part of the output. If you copy this Morse
                    elsewhere, keep the gaps.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="decode">
            <div className="grid gap-6 lg:grid-cols-[235px_minmax(0,1fr)]">
              <header>
                <p className="mw-muted-label font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Boundary based
                </p>
                <h3 className="mw-heading mt-2 text-2xl font-extrabold text-sky-950">
                  Morse to Text
                </h3>
              </header>

              <div className="max-w-none">
                <p className="mw-text-muted max-w-[58ch] text-base leading-relaxed sm:text-lg">
                  Decoding is boundary-driven. The tool reads chunks of dots and
                  dashes, then uses separators to decide where each letter and
                  word ends.
                </p>

                <ul className="mt-4 grid list-disc gap-x-8 gap-y-2 pl-6 text-base leading-relaxed sm:text-lg lg:grid-cols-3">
                  <li>
                    Valid Morse characters are dot and dash, plus whitespace and{" "}
                    <strong>/</strong> for separation.
                  </li>
                  <li>
                    Common lookalikes such as bullets become dots, and long
                    dashes become regular dashes.
                  </li>
                  <li>
                    Unknown Morse chunks output <strong>?</strong> so mistakes
                    remain visible.
                  </li>
                </ul>

                <div className="mt-6">
                  <p className="mw-heading text-base font-extrabold text-sky-950">
                    Examples
                  </p>
                  <pre className="mw-static-code mw-code-surface mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl bg-[#fffaf2] p-4 font-mono text-base leading-relaxed text-slate-900">
                    {`...   ---   ...
SOS

... / --- / ...
S O S`}
                  </pre>
                  <p className="mw-text-soft mt-3 max-w-[58ch] text-base leading-relaxed text-slate-600">
                    If everything runs together, add separators. The safest
                    format is 3 spaces between letters and 7 spaces between
                    words.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section
            id="formatting"
            className="mw-support-band relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-white/45 py-8"
          >
            <div className="mx-auto grid max-w-[1160px] gap-8 px-4 sm:px-6 lg:grid-cols-[235px_minmax(0,1fr)] lg:gap-12 lg:px-8">
              <header>
                <p className="mw-muted-label font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Input rules
                </p>
                <h3 className="mw-heading mt-2 text-2xl font-extrabold text-sky-950">
                  Formatting guide
                </h3>
              </header>

              <div className="max-w-none">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="mw-heading text-base font-extrabold text-sky-950">
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
                    <p className="mw-heading text-base font-extrabold text-sky-950">
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

                <p className="mw-text-soft mt-6 max-w-[58ch] text-base leading-relaxed text-slate-600 sm:text-lg">
                  If you need to preserve exact spacing inside a single word,
                  this tool favors predictable normalization and consistent
                  separators instead.
                </p>
              </div>
            </div>
          </section>

          <section id="supported">
            <div className="grid gap-6 lg:grid-cols-[235px_minmax(0,1fr)]">
              <header>
                <p className="mw-muted-label font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Character map
                </p>
                <h3 className="mw-heading mt-2 text-2xl font-extrabold text-sky-950">
                  Supported characters
                </h3>
              </header>

              <div className="max-w-none">
                <div>
                  <p className="mw-text-muted max-w-[58ch] text-base leading-relaxed sm:text-lg">
                    This translator supports A-Z, 0-9, and a core set of common
                    punctuation. It intentionally does not guess at extended
                    alphabets or locale-specific variants.
                  </p>

                  <div className="mt-5">
                    <p className="mw-heading text-base font-extrabold text-sky-950">
                      Supported punctuation
                    </p>

                    <div
                      className="mt-3 flex flex-wrap gap-2"
                      aria-label="Supported punctuation"
                    >
                      {supportedPunctuation.map(([symbol, label]) => (
                        <span
                          key={symbol}
                          title={label}
                          className="mw-static-tile mw-input-text inline-flex min-h-9 min-w-9 items-center justify-center rounded-md bg-[#fffaf2] px-2.5 py-1.5 font-mono text-sm font-bold text-slate-900"
                        >
                          {symbol}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <section id="troubleshooting">
            <div className="grid gap-6 lg:grid-cols-[235px_minmax(0,1fr)]">
              <header>
                <p className="mw-muted-label font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Fix mistakes
                </p>
                <h3 className="mw-heading mt-2 text-2xl font-extrabold text-sky-950">
                  Troubleshooting
                </h3>
              </header>

              <ul className="grid max-w-none list-disc gap-x-8 gap-y-2 pl-6 text-base leading-relaxed sm:text-lg lg:grid-cols-2">
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
                  <strong>Pasted Morse has odd symbols:</strong> PDFs often
                  replace hyphens with long dashes and dots with bullets.
                </li>
                <li>
                  <strong>Audio is silent:</strong> confirm Sound is on, raise
                  volume, and make sure your device is not muted.
                </li>
              </ul>
            </div>
          </section>

          <section id="learning-flow">
            <div className="grid gap-6 lg:grid-cols-[235px_minmax(0,1fr)]">
              <header>
                <p className="mw-muted-label font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Learning flow
                </p>
                <h3 className="mw-heading mt-2 text-2xl font-extrabold text-sky-950">
                  After translation, hear and practice it
                </h3>
              </header>

              <div className="max-w-none">
                <p className="mw-text-muted max-w-[58ch] text-base leading-relaxed sm:text-lg">
                  A translation is useful immediately, but it becomes easier to
                  remember when you turn the pattern into sound and repeat it in
                  a short focused session.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-4">
                  {[
                    {
                      title: "Translate it",
                      body: "Start with a short word, phrase, or pasted Morse message.",
                    },
                    {
                      title: "Hear it",
                      body: "Play the signal so the rhythm is not only a visual string.",
                    },
                    {
                      title: "Practice it",
                      body: "Use a quick drill when you want recall instead of lookup.",
                    },
                    {
                      title: "Review weak spots",
                      body: "Move repeated misses into word, typing, audio, or visual practice.",
                    },
                  ].map((item) => (
                    <article
                      key={item.title}
                      className="mw-static-tile rounded-xl bg-[#fffaf2] p-5"
                    >
                      <h4 className="mw-heading text-base font-extrabold text-sky-950">
                        {item.title}
                      </h4>
                      <p className="mw-text-muted mt-2 text-base leading-relaxed text-slate-700">
                        {item.body}
                      </p>
                    </article>
                  ))}
                </div>

                <p className="mw-text-soft mt-5 max-w-[58ch] text-base leading-relaxed text-slate-600 sm:text-lg">
                  For the next step, open{" "}
                  <Link
                    to="/audio"
                    className="mw-link font-semibold text-sky-900 underline-offset-4 hover:underline"
                  >
                    Morse code audio
                  </Link>
                  , try a{" "}
                  <Link
                    to="/practice"
                    className="mw-link font-semibold text-sky-900 underline-offset-4 hover:underline"
                  >
                    short practice drill
                  </Link>
                  , or use the{" "}
                  <Link
                    to="/morse-code-word-trainer"
                    className="mw-link font-semibold text-sky-900 underline-offset-4 hover:underline"
                  >
                    word trainer
                  </Link>{" "}
                  when the same words keep needing lookup.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mw-support-band relative left-1/2 mt-10 w-screen max-w-[100vw] -translate-x-1/2 bg-white/45 py-8">
          <div className="mx-auto grid max-w-[1160px] gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16 lg:px-8">
          <section>
            <h3 className="mw-heading text-2xl font-extrabold text-sky-950">
              Quick answers
            </h3>

            <ul className="mw-text-muted mt-4 max-w-none list-disc space-y-2 pl-6 text-base leading-relaxed text-slate-700 sm:text-lg">
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
            <h3 className="mw-heading text-2xl font-extrabold text-sky-950">
              Morse formatting rules
            </h3>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-base sm:text-lg">
                <thead>
                  <tr>
                    <th className="mw-heading py-2 pr-4 text-left font-extrabold text-sky-950">
                      Rule
                    </th>
                    <th className="mw-heading py-2 text-left font-extrabold text-sky-950">
                      Behavior
                    </th>
                  </tr>
                </thead>
                <tbody className="mw-text-muted text-slate-700">
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
      </div>
    </section>
  );
}
