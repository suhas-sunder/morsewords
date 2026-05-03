import { Link } from "react-router";

export default function HowItWorks() {
  return (
    <section className="mw-how-section mt-8 overflow-hidden rounded-2xl bg-[#fffdf8] p-5 sm:p-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-sky-800" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">Decoder spec</span>
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
          How this Morse code decoder works
        </h2>

        <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
          This page is a focused <strong>Morse code decoder</strong>. It converts{" "}
          <strong>International Morse</strong> (dots and dashes) back into readable
          text, emphasizing spacing and separators. It is built to be predictable:
          it normalizes inputs, applies a fixed character map, and keeps mistakes
          visible instead of guessing.
        </p>
      </div>

      {/* Optional: quick jump links for long content */}
      <div className="mt-6 flex flex-wrap gap-2">
        {[
          ["Paste Morse", "#decode"],
          ["Accepted formats", "#accepted-formats"],
          ["Word separators", "#formatting"],
          ["Supported", "#supported"],
          ["Troubleshooting", "#troubleshooting"],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="cursor-pointer rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-sky-950"
          >
            {label}
          </a>
        ))}
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-[#f7f4ee] p-5">
          <p className="text-base font-extrabold text-sky-950">Input spacing</p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            Separate <strong>letters</strong> with <strong>spaces</strong>. Separate{" "}
            <strong>words</strong> with <strong>7+ spaces</strong>, <strong>/</strong>,
            or a <strong>new line</strong>.
          </p>
        </div>

        <div className="rounded-xl bg-[#f7f4ee] p-5">
          <p className="text-base font-extrabold text-sky-950">Decoder boundaries</p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            When decoding, <strong>1–6 spaces</strong> separates letters.{" "}
            <strong>7+ spaces</strong>, <strong>/</strong>, and new lines separate
            words.
          </p>
        </div>

        <div className="rounded-xl bg-[#f7f4ee] p-5">
          <p className="text-base font-extrabold text-sky-950">Errors stay visible</p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            Unknown Morse chunks decode to <strong>?</strong>. Unsupported text
            characters are skipped and surfaced in the UI.
          </p>
        </div>
      </div>

      <div
        id="accepted-formats"
        className="mt-6 rounded-xl bg-[#fffdf8] p-6 sm:p-7"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
          Accepted input formats
        </h3>

        <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
          Paste Morse using dots and dashes. This decoder accepts common lookalikes
          and normalizes them before decoding so you can paste from anywhere.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-[#fffdf8] p-5">
            <p className="text-base font-extrabold text-sky-950">Symbols</p>
            <ul className="mt-3 list-disc pl-6 space-y-2 text-base sm:text-lg text-slate-700">
              <li>
                Dots: <code>.</code>{" "}
                <span className="text-slate-500">(also · • ∙)</span>
              </li>
              <li>
                Dashes: <code>-</code>{" "}
                <span className="text-slate-500">(also – — −)</span>
              </li>
              <li>
                Separators: spaces, new lines, and <code>/</code>
              </li>
            </ul>
          </div>

          <div className="rounded-xl bg-[#fffdf8] p-5">
            <p className="text-base font-extrabold text-sky-950">Common paste patterns</p>
            <ul className="mt-3 list-disc pl-6 space-y-2 text-base sm:text-lg text-slate-700">
              <li>
                <code>.... ..</code>{" "}
                <span className="text-slate-500">(letters separated by a space)</span>
              </li>
              <li>
                <code>. . . . -</code>{" "}
                <span className="text-slate-500">(extra spaces are okay)</span>
              </li>
              <li>
                <code>... --- ...</code>{" "}
                <span className="text-slate-500">(classic SOS)</span>
              </li>
              <li>
                <code>.... . .-.. .-.. --- / .-- --- .-. .-.. -..</code>{" "}
                <span className="text-slate-500">(slash between words)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-[#fffdf8] p-5">
          <p className="text-base font-extrabold text-sky-950">Note</p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            This decoder is <strong>separator-based</strong>. It does not infer timing.
            If your Morse has no spacing at all, use the{" "}
            <Link
              to="/morse-code-word-separator"
              className="font-extrabold text-sky-950 hover:text-sky-800 underline cursor-pointer"
            >
              word separator tool
            </Link>{" "}
            to split it first.
          </p>
        </div>
      </div>

      <div
        id="examples"
        className="mt-6 rounded-2xl bg-[#fffdf8] p-6 sm:p-7"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
          Examples you can copy
        </h3>

        <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
          These are short, copy-ready inputs that show spacing, word breaks, and what
          happens when something is invalid.
        </p>

        <div className="mt-5 grid gap-4">
          <div className="rounded-2xl p-5">
            <p className="text-base font-extrabold text-sky-950">Decode a single letter</p>
            <p className="mt-2 text-base sm:text-lg text-slate-700">
              <strong>Input:</strong>{" "}
              <code>...</code>{" "}
              <span className="text-slate-500">(S)</span>
            </p>
          </div>

          <div className="rounded-2xl p-5">
            <p className="text-base font-extrabold text-sky-950">Decode a word (spaces between letters)</p>
            <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
              <strong>Input:</strong>{" "}
              <code>.... . .-.. .-.. ---</code>{" "}
              <span className="text-slate-500">(HELLO)</span>
            </p>
          </div>

          <div className="rounded-2xl p-5">
            <p className="text-base font-extrabold text-sky-950">Decode two words (slash separator)</p>
            <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
              <strong>Input:</strong>{" "}
              <code>.... . .-.. .-.. --- / .-- --- .-. .-.. -..</code>{" "}
              <span className="text-slate-500">(HELLO WORLD)</span>
            </p>
          </div>

          <div className="rounded-2xl p-5">
            <p className="text-base font-extrabold text-sky-950">Decode punctuation</p>
            <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
              <strong>Input:</strong>{" "}
              <code>... --- ... -.-.--</code>{" "}
              <span className="text-slate-500">(SOS!)</span>
            </p>
          </div>

          <div className="rounded-2xl p-5">
            <p className="text-base font-extrabold text-sky-950">What an error looks like</p>
            <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
              <strong>Input:</strong>{" "}
              <code>.... .. --..-- ..-.-</code>{" "}
              <span className="text-slate-500">(the last chunk becomes ?)</span>
            </p>
          </div>
        </div>
      </div>

      <div
        id="related-tool"
        className="mt-6 rounded-xl bg-[#fffdf8] p-6 sm:p-7"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
          Need to encode text to Morse?
        </h3>
        <p className="mt-3 text-base sm:text-lg text-slate-700">
          This page is for decoding dots and dashes into text. If you want to convert
          text into Morse code, use the encoder tool instead.
        </p>

        <Link
          to="/morse-code-encoder"
          className="inline-flex mt-4 items-center rounded-full bg-[#f7f4ee] px-4 py-2 text-base sm:text-lg font-extrabold text-sky-950 hover:bg-sky-50 cursor-pointer transition"
        >
          Switch to encoder
        </Link>
      </div>

      {/* AI-friendly: Quick answers + canonical decoding rules */}
      <div className="mt-8 rounded-2xl bg-[#fffdf8] p-6 sm:p-7">
        <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
          Quick answers (Morse decoding)
        </h3>

        <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg text-slate-700">
          <li>
            <strong>What a Morse code decoder does:</strong> It converts
            International Morse code (dots and dashes) into readable text.
          </li>
          <li>
            <strong>What to paste:</strong> Use dots and dashes, then separate
            letters with spaces. Separate words with <strong>7+ spaces</strong>,{" "}
            <code>/</code>, or a new line.
          </li>
          <li>
            <strong>How this decoder decides boundaries:</strong> It is
            separator-based (spacing and <code>/</code>). It does not infer
            timing.
          </li>
          <li>
            <strong>Unknown chunks:</strong> If a dot-dash chunk is not
            recognized, it decodes to <code>?</code> so mistakes stay visible.
          </li>
          <li>
            <strong>Common paste fixes:</strong> Bullet dots (•) are treated as
            dots, and long dashes (—) are treated as dashes.
          </li>
        </ul>
      </div>

      <div className="mt-6 rounded-2xl bg-[#fffdf8] p-6 sm:p-7">
        <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
          Decoder rules
        </h3>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-base sm:text-lg">
            <thead>
                  <tr>
                <th className="py-2 text-left font-extrabold text-sky-950">
                  Rule
                </th>
                <th className="py-2 text-left font-extrabold text-sky-950">
                  Meaning
                </th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-4">Valid symbols</td>
                <td className="py-2">
                  Dot, dash, whitespace, new lines, and <code>/</code>
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-4">Letter separator</td>
                <td className="py-2">1–6 spaces</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-4">Word separator</td>
                <td className="py-2">
                  7+ spaces, <code>/</code>, or a new line
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-4">Unknown Morse chunk</td>
                <td className="py-2">
                  Outputs <code>?</code>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Normalized lookalikes</td>
                <td className="py-2">
                  <code>· • ∙</code> → dot, <code>– — −</code> → dash
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-5 rounded-xl bg-[#fffdf8] p-5">
          <p className="text-base font-extrabold text-sky-950">Tip for copy/paste</p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            If you plan to paste your decoded result elsewhere, keep it as normal
            text. If you want to generate Morse again, use the{" "}
            <Link
              to="/morse-code-encoder"
              className="font-extrabold text-sky-950 hover:text-sky-800 underline cursor-pointer"
            >
              encoder
            </Link>{" "}
            so spacing and separators are consistent.
          </p>
        </div>
      </div>
    </section>
  );
}



