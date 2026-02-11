import { Link } from "react-router";

export default function HowItWorks() {
  return (
    <section className="mt-8 bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1.5 text-sm font-extrabold text-sky-900 border border-sky-200">
            Decoder spec
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight">
          How this Morse code decoder works
        </h2>

        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
          This page is a focused <strong>Morse code decoder</strong>. It
          converts <strong>International Morse</strong> (dots and dashes) back
          into readable text, emphasizing spacing and separators. It is built to
          be predictable: it normalizes inputs, applies a fixed character map,
          and keeps mistakes visible instead of guessing.
        </p>
      </div>

      {/* Optional: quick jump links for long content */}
      <div className="mt-6 flex flex-wrap gap-2">
        {[
          ["Paste Morse", "#decode"],
          ["Word separators", "#formatting"],
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

      <div
        id="related-tool"
        className="mt-6 rounded-2xl border border-gray-200 p-6 sm:p-7"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
          Need to encode text to Morse?
        </h3>
        <p className="mt-3 text-base sm:text-lg text-gray-700">
          This page is for decoding dots and dashes into text. If you want to
          convert text into Morse code, use the encoder tool instead.
        </p>

        <Link
          to="/morse-code-encoder"
          className="inline-flex mt-4 items-center rounded-full bg-sky-50 px-4 py-2 text-base sm:text-lg font-extrabold text-sky-900 border border-sky-200 hover:bg-sky-100 cursor-pointer transition"
        >
          Switch to encoder
        </Link>
      </div>

      {/* AI-friendly: Quick answers + canonical decoding rules */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
        <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
          Quick answers (Morse decoding)
        </h3>

        <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg text-gray-700">
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

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
        <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900">
          Decoder rules
        </h3>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-base sm:text-lg">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 text-left font-extrabold text-sky-900">
                  Rule
                </th>
                <th className="py-2 text-left font-extrabold text-sky-900">
                  Meaning
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">Valid symbols</td>
                <td className="py-2">
                  Dot, dash, whitespace, and <code>/</code>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">Letter separator</td>
                <td className="py-2">1–6 spaces</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">Word separator</td>
                <td className="py-2">
                  7+ spaces, <code>/</code>, or a new line
                </td>
              </tr>
              <tr className="border-b border-gray-100">
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
      </div>
    </section>
  );
}
