const featureColumns = [
  {
    title: "Translate both directions",
    body: "Type words to encode them into International Morse, or paste Morse to decode it back into readable text.",
  },
  {
    title: "Hear the rhythm",
    body: "Play the active message with adjustable speed, pitch, volume, repeat, and flash settings.",
  },
  {
    title: "Keep spacing visible",
    body: "The translator preserves the Morse gaps that make letters and words readable.",
  },
] as const;

const workflow = [
  {
    step: "01",
    title: "Choose a direction",
    body: "Use Text to Morse for encoding or Morse to Text for decoding. The input and output labels change with the active mode.",
  },
  {
    step: "02",
    title: "Review the result",
    body: "Unsupported text characters are surfaced near the input. Unknown Morse chunks decode to a question mark so mistakes do not disappear silently.",
  },
  {
    step: "03",
    title: "Copy, share, or listen",
    body: "Copy the output, create a share image, or play the signal using the built-in audio controls.",
  },
] as const;

const toolLinks = [
  {
    href: "/audio",
    title: "Audio",
    body: "Focused playback and timing controls for listening practice.",
  },
  {
    href: "/practice",
    title: "Practice",
    body: "Short decoding drills for building recognition through repetition.",
  },
  {
    href: "/typing",
    title: "Typing",
    body: "Keyboard practice for pairing Morse reading with fast text entry.",
  },
  {
    href: "/dictionary",
    title: "Dictionary",
    body: "Lookup tables for letters, numbers, and supported punctuation.",
  },
  {
    href: "/how-to-use",
    title: "How to use",
    body: "Suite-level notes for using the MorseWords tools together.",
  },
] as const;

const punctuation = [
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
    <>
      <section
        className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
        aria-labelledby="home-toolkit-title"
      >
        <div className="mx-auto max-w-[1120px]">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-sky-800" />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
                Morse toolkit
              </span>
              <span className="h-px w-8 bg-sky-800" />
            </div>

            <h2
              id="home-toolkit-title"
              className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
            >
              A focused workspace for Morse code
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
              The translator stays at the center. The sections below explain
              the rules, point to the right supporting tools, and keep the page
              easy to scan.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {featureColumns.map((item) => (
              <article key={item.title} className="max-w-[34ch] md:max-w-none">
                <span className="block h-1 w-10 rounded-full bg-sky-500" />
                <h3 className="mt-4 text-xl font-extrabold text-sky-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-slate-700">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="bg-[#fffaf2]/80 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        aria-labelledby="home-process-title"
      >
        <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
              How it works
            </p>
            <h2
              id="home-process-title"
              className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
            >
              Simple controls, precise output
            </h2>
            <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              MorseWords normalizes input, applies a fixed International Morse
              map, and uses clear separators so the result is predictable when
              you copy or play it.
            </p>

            <pre className="mt-6 overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-sm leading-relaxed text-sky-100 sm:text-base">
              {`HELLO WORLD
....   .   .-..   .-..   ---       .--   ---   .-.   .-..   -..`}
            </pre>
          </div>

          <ol className="grid gap-6">
            {workflow.map((item) => (
              <li key={item.step} className="grid gap-4 sm:grid-cols-[4rem_1fr]">
                <span className="font-mono text-2xl font-black text-sky-700">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-xl font-extrabold text-sky-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[62ch] text-base leading-relaxed text-slate-700">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        aria-labelledby="home-formatting-title"
      >
        <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
              Formatting
            </p>
            <h2
              id="home-formatting-title"
              className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
            >
              Spacing is part of the message
            </h2>
            <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              The safest format is three spaces between letters and seven
              spaces between words. A slash or a new line can also mark a word
              break when decoding pasted Morse.
            </p>

            <div className="mt-7 overflow-x-auto">
              <table className="w-full text-left text-base">
                <thead className="text-sky-950">
                  <tr>
                    <th className="pb-3 pr-6 font-extrabold">Rule</th>
                    <th className="pb-3 font-extrabold">Behavior</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr>
                    <td className="py-2 pr-6">Letter gap when encoding</td>
                    <td className="py-2 font-mono">3 spaces</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-6">Word gap when encoding</td>
                    <td className="py-2 font-mono">7 spaces</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-6">Letter gap when decoding</td>
                    <td className="py-2 font-mono">1-6 spaces</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-6">Word gap when decoding</td>
                    <td className="py-2">
                      <span className="font-mono">7+</span> spaces,{" "}
                      <code>/</code>, or a new line
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-6">Unknown Morse chunk</td>
                    <td className="py-2">
                      Decodes to <code>?</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl bg-[#fffaf2] p-5 sm:p-6">
            <h3 className="text-xl font-extrabold text-sky-950">
              Supported characters
            </h3>
            <p className="mt-3 text-base leading-relaxed text-slate-700">
              The translator supports A-Z, 0-9, and common punctuation. It does
              not guess at extended alphabets or locale-specific variants.
            </p>

            <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.12em] text-slate-600">
              Common punctuation
            </p>
            <div className="mt-3 flex flex-wrap gap-2" aria-label="Supported punctuation">
              {punctuation.map(([symbol, label]) => (
                <span
                  key={symbol}
                  title={label}
                  className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-md bg-white px-2.5 py-1.5 font-mono text-sm font-bold text-sky-950"
                >
                  {symbol}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-white/55 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        aria-labelledby="home-tools-title"
      >
        <div className="mx-auto max-w-[1120px]">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
                Next steps
              </p>
              <h2
                id="home-tools-title"
                className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
              >
                Use the right tool for the next task
              </h2>
              <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-slate-700 sm:text-lg">
                Move from translation into listening, drills, lookup, or guided
                usage without digging through a wall of cards.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {toolLinks.map((tool) => (
                <a
                  key={tool.href}
                  href={tool.href}
                  className="group cursor-pointer rounded-xl px-1 py-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
                >
                  <span className="text-lg font-extrabold text-sky-950 transition group-hover:text-sky-700">
                    {tool.title}
                  </span>
                  <span className="mt-2 block text-base leading-relaxed text-slate-700">
                    {tool.body}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        aria-labelledby="home-troubleshooting-title"
      >
        <div className="mx-auto grid max-w-[1120px] gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
              Troubleshooting
            </p>
            <h2
              id="home-troubleshooting-title"
              className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
            >
              Common fixes
            </h2>
          </div>

          <ul className="grid gap-5 text-base leading-relaxed text-slate-700 sm:text-lg">
            <li>
              <strong className="text-sky-950">Decoded text looks wrong:</strong>{" "}
              add clear boundaries between letters and words.
            </li>
            <li>
              <strong className="text-sky-950">Question marks appear:</strong>{" "}
              at least one Morse chunk was not recognized.
            </li>
            <li>
              <strong className="text-sky-950">Encoding skipped symbols:</strong>{" "}
              replace unsupported characters with supported punctuation or plain
              letters.
            </li>
            <li>
              <strong className="text-sky-950">Pasted Morse has odd symbols:</strong>{" "}
              PDFs and documents can turn dots into bullets or hyphens into long
              dashes; the decoder normalizes common lookalikes.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
