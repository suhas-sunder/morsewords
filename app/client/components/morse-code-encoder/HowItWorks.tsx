import { Link } from "react-router";

export default function HowItWorks() {
 return (
 <section className="mw-how-section mt-8 overflow-hidden rounded-2xl bg-[#fffdf8] p-5 sm:p-8">
 <div className="flex flex-col gap-3">
 <div className="flex items-center gap-3">
 <span className="h-px w-8 bg-sky-800"/>
 <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">Encoder spec</span>
 </div>

 <h2 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
 How this Morse code encoder works
 </h2>

 <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
 This page is a focused <strong>Morse code encoder</strong>. It
 converts plain text into <strong>International Morse</strong> (dots
 and dashes) as you type. It is built to be predictable: it normalizes
 input, applies a fixed character map, and keeps unsupported characters
 visible instead of guessing.
 </p>
 </div>

 {/* Optional: quick jump links for long content */}
 <div className="mt-6 flex flex-wrap gap-2">
 {[
 ["Text → Morse output","#encode"],
 ["Output format","#output-format"],
 ["Supported","#supported"],
 ["Troubleshooting","#troubleshooting"],
 ].map(([label, href]) => (
 <a
 key={href}
 href={href}
 className="cursor-pointer rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-sky-950">
 {label}
 </a>
 ))}
 </div>

 <div className="mt-7 grid gap-4 sm:grid-cols-3">
 <div className="rounded-xl bg-[#f7f4ee] p-5">
 <p className="text-base font-extrabold text-sky-950">
 Predictable output
 </p>
 <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
 The encoder re-emits Morse with consistent separators so copy/paste
 behaves the same across tools.
 </p>
 </div>

 <div className="rounded-xl bg-[#f7f4ee] p-5">
 <p className="text-base font-extrabold text-sky-950">
 Word breaks are strict
 </p>
 <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
 Any run of whitespace in your text input is treated as a{""}
 <strong>word break</strong>. The Morse output uses a single,
 consistent word separator.
 </p>
 </div>

 <div className="rounded-xl bg-[#f7f4ee] p-5">
 <p className="text-base font-extrabold text-sky-950">
 Unsupported stays visible
 </p>
 <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
 Characters that are not in the supported set are{""}
 <strong>skipped</strong> in output and surfaced in the UI so you can
 fix the source text.
 </p>
 </div>
 </div>

 <div
 id="related-tool" className="mt-6 rounded-xl bg-[#fffdf8] p-6 sm:p-7">
 <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
 Need to decode Morse back to text?
 </h3>
 <p className="mt-3 text-base sm:text-lg text-slate-700">
 This page encodes text into Morse. If you have dots and dashes and
 want readable text, use the decoder tool.
 </p>

 <Link
 to="/morse-code-decoder" className="inline-flex mt-4 items-center rounded-full bg-[#f7f4ee] px-4 py-2 text-base sm:text-lg font-extrabold text-sky-950 hover:bg-sky-50 cursor-pointer transition">
 Switch to decoder
 </Link>
 </div>

 <div className="mt-6 space-y-6 text-slate-700 leading-relaxed">
 <div
 id="encode" className="rounded-xl bg-[#fffdf8] p-6 sm:p-7">
 <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
 Text → Morse (encode)
 </h3>

 <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
 <li>
 Input text is normalized (trimmed, collapsed whitespace) and
 uppercased, then each supported character is mapped using a fixed
 International Morse table.
 </li>
 <li>
 Letters are encoded one-by-one. The output is then re-joined using
 a consistent letter separator.
 </li>
 <li>
 Any run of whitespace becomes a word break so the output is stable
 when you paste it into other decoders.
 </li>
 <li>
 Unsupported characters are not approximated. They are skipped in
 output and shown under the input so you can correct them.
 </li>
 </ul>

 <div className="mt-5">
 <p className="text-base font-extrabold text-sky-950">Example</p>
 <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-[#f7f4ee] p-4 text-base sm:text-lg font-mono overflow-x-auto">
 {`HELLO WORLD
.... . .-.. .-.. --- .-- --- .-. .-.. -..`}
 </pre>
 <p className="mt-3 text-base sm:text-lg text-slate-600">
 The gaps are part of Morse formatting. If you copy this elsewhere,
 keep the separators so it decodes correctly.
 </p>
 </div>
 </div>

 <div
 id="output-format" className="rounded-xl bg-[#fffdf8] p-6 sm:p-7">
 <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
 Output format (spacing and separators)
 </h3>

 <p className="mt-4 text-base sm:text-lg">
 This encoder emits spacing that is easy to decode reliably:
 </p>

 <div className="mt-5 grid gap-4 sm:grid-cols-2">
 <div className="rounded-xl bg-[#f7f4ee] p-5">
 <p className="text-base sm:text-lg font-extrabold text-sky-950">
 Standard output spacing
 </p>
 <ul className="mt-3 list-disc pl-6 space-y-2 text-base sm:text-lg">
 <li>
 <strong>3 spaces</strong> between letters
 </li>
 <li>
 <strong>7 spaces</strong> between words
 </li>
 <li>New lines are treated as word breaks in your input</li>
 </ul>
 </div>

 <div className="rounded-xl bg-[#f7f4ee] p-5">
 <p className="text-base sm:text-lg font-extrabold text-sky-950">
 Copy &amp; share tips
 </p>
 <ul className="mt-3 list-disc pl-6 space-y-2 text-base sm:text-lg">
 <li>Keep spacing intact when pasting into other tools</li>
 <li>Use a monospace field/editor if you can</li>
 <li>
 If you prefer slashes for word breaks, decode with{""}
 <code>/</code> support (this site does)
 </li>
 </ul>
 </div>
 </div>

 <div className="mt-5 rounded-xl bg-[#fffdf8] p-5">
 <p className="text-base font-extrabold text-sky-950">
 Decoder compatibility note
 </p>
 <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
 Your output will decode correctly on this site’s{""}
 <Link
 to="/morse-code-decoder" className="font-extrabold text-sky-950 hover:text-sky-800 underline cursor-pointer">
 decoder
 </Link>{""}
 because it recognizes <strong>1–6 spaces</strong> as letter breaks
 and <strong>7+ spaces</strong> as word breaks. Some third-party
 decoders only expect single spaces, so if something decodes wrong
 elsewhere, paste it into this site’s decoder to verify.
 </p>
 </div>
 </div>

 <div
 id="supported" className="rounded-xl bg-[#fffdf8] p-6 sm:p-7">
 <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
 Supported characters and assumptions
 </h3>

 <p className="mt-4 text-base sm:text-lg">
 This encoder supports A–Z, 0–9, and a core set of common
 punctuation. It intentionally does not guess at extended alphabets
 or locale-specific variants.
 </p>

 <p className="mt-4 text-base sm:text-lg">
 Supported punctuation includes:{""}
 <code className="rounded-md bg-[#f7f4ee] px-2 py-1">
 . , ? / ' ! - @ : ; = + &quot; ( ) &amp; _
 </code>
 .
 </p>

 <div className="mt-5 rounded-xl bg-[#fffdf8] p-5">
 <p className="text-base font-extrabold text-sky-950">
 Related tools
 </p>
 <ul className="mt-3 list-disc pl-6 space-y-3 text-base sm:text-lg">
 <li>
 <Link
 to="/audio" className="text-sky-950 underline hover:no-underline cursor-pointer font-semibold">
 Audio
 </Link>{""}
 for playback and timing controls.
 </li>
 <li>
 <Link
 to="/dictionary" className="text-sky-950 underline hover:no-underline cursor-pointer font-semibold">
 Dictionary
 </Link>{""}
 to look up characters and punctuation.
 </li>
 <li>
 <Link
 to="/practice" className="text-sky-950 underline hover:no-underline cursor-pointer font-semibold">
 Practice
 </Link>{""}
 and{""}
 <Link
 to="/typing" className="text-sky-950 underline hover:no-underline cursor-pointer font-semibold">
 Typing
 </Link>{""}
 for drills and repetition.
 </li>
 <li>
 <Link
 to="/how-to-use" className="text-sky-950 underline hover:no-underline cursor-pointer font-semibold">
 How to use
 </Link>{""}
 for suite-level notes.
 </li>
 </ul>
 </div>
 </div>

 <div
 id="troubleshooting" className="rounded-xl bg-[#fffdf8] p-6 sm:p-7">
 <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
 Troubleshooting
 </h3>

 <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
 <li>
 <strong>Characters are missing in the Morse output:</strong> check
 the unsupported list under the input. Replace unsupported symbols
 with plain letters or supported punctuation.
 </li>
 <li>
 <strong>Spacing looks “too wide”:</strong> that’s intentional for
 reliable decoding. The output uses 3 spaces between letters and 7
 between words.
 </li>
 <li>
 <strong>Another site decodes it incorrectly:</strong> some tools
 assume single-space separation. Verify using this site’s{""}
 <Link
 to="/morse-code-decoder" className="font-extrabold text-sky-950 hover:text-sky-800 underline cursor-pointer">
 decoder
 </Link>{""}
 which matches this encoder’s formatting.
 </li>
 <li>
 <strong>You pasted fancy punctuation:</strong> text from PDFs
 often includes smart quotes and long dashes. Replace them with
 plain equivalents or remove them.
 </li>
 <li>
 <strong>Audio is silent:</strong> confirm Sound is on, raise
 volume, and make sure your device is not muted. If you are using
 Bluetooth, reconnect and try again.
 </li>
 </ul>
 </div>

 <div className="mt-8 rounded-2xl bg-[#fffdf8] p-6 sm:p-7">
 <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
 Quick answers (Morse encoding)
 </h3>

 <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg text-slate-700">
 <li>
 <strong>What a Morse code encoder does:</strong> It converts plain
 text into International Morse code using dots and dashes.
 </li>
 <li>
 <strong>How this encoder formats output:</strong> It emits
 consistent separators so you can copy and paste reliably.
 </li>
 <li>
 <strong>Spacing rules:</strong> <strong>3 spaces</strong> between
 letters and <strong>7 spaces</strong> between words.
 </li>
 <li>
 <strong>Unsupported characters:</strong> Characters that are not
 in the supported set are skipped and shown so you can fix the
 input.
 </li>
 </ul>
 </div>

 <div className="mt-6 rounded-2xl bg-[#fffdf8] p-6 sm:p-7">
 <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
 Encoder rules
 </h3>

 <div className="mt-4 overflow-x-auto">
 <table className="w-full -collapse text-base sm:text-lg">
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
 <tr>
 <td className="py-2 pr-4">Text normalization</td>
 <td className="py-2">
 Input is normalized and uppercased before mapping
 </td>
 </tr>
 <tr>
 <td className="py-2 pr-4">Word breaks (input)</td>
 <td className="py-2">
 Any run of whitespace becomes a word break in output
 </td>
 </tr>
 <tr>
 <td className="py-2 pr-4">Letter separator (output)</td>
 <td className="py-2">3 spaces</td>
 </tr>
 <tr>
 <td className="py-2 pr-4">Word separator (output)</td>
 <td className="py-2">7 spaces</td>
 </tr>
 <tr>
 <td className="py-2 pr-4">Unsupported characters</td>
 <td className="py-2">
 Skipped and listed so you can correct the input
 </td>
 </tr>
 </tbody>
 </table>
 </div>

 <div className="mt-5 rounded-xl bg-[#fffdf8] p-5">
 <p className="text-base font-extrabold text-sky-950">Tip</p>
 <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
 If you want to generate sound from your output, switch to{""}
 <Link
 to="/audio" className="font-extrabold text-sky-950 hover:text-sky-800 underline cursor-pointer">
 Audio
 </Link>{""}
 for playback controls and timing.
 </p>
 </div>
 </div>
 </div>
 </section>
 );
}



