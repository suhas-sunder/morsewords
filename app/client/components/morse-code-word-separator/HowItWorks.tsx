import { Link } from "react-router";

export default function HowItWorks() {
 return (
 <section className="mw-how-section mt-8 overflow-hidden rounded-2xl bg-[#fffdf8] p-5 sm:p-8">
 <div className="flex flex-col gap-3">
 <div className="flex items-center gap-3">
 <span className="h-px w-8 bg-sky-800"/>
 <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">Word separator spec</span>
 </div>

 <h2 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
 Word separators in Morse code
 </h2>

 <p className="mt-1 text-base leading-relaxed text-slate-700 sm:text-lg">
 Morse code is not a “symbol language” in the way people often copy it
 online. In real Morse, meaning comes from <strong>timing</strong>:
 dots and dashes (short and long signals), plus the length of the
 pauses between them. When Morse is written as plain text, those pauses
 get approximated with spaces and sometimes visible separators like{" "}
 <strong>/</strong> or <strong>|</strong>. This page is focused on one
 specific problem: making word breaks consistent so Morse is easier to
 share, easier to paste into tools, and less likely to decode
 incorrectly.
 </p>
 </div>

 {/* Optional: quick jump links for long content */}
 <div className="mt-6 flex flex-wrap gap-2">
 {[
 ["Why separators matter","#why"],
 ["Common formats","#formats"],
 ["Normalize pasted Morse","#normalize"],
 ["English → Morse","#english-to-morse"],
 ["Troubleshooting","#troubleshooting"],
 ].map(([label, href]) => (
 <a
 key={href}
 href={href}
              className="inline-flex min-h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-slate-950 px-4 py-2 text-center text-sm font-semibold leading-none text-sky-100 transition hover:bg-slate-800 hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2">
 {label}
 </a>
 ))}
 </div>

 <div id="why" className="mt-6 grid gap-4 sm:grid-cols-3">
 <div className="rounded-xl bg-[#f7f4ee] p-5">
 <p className="text-base font-extrabold text-sky-950">Letter gap</p>
 <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
 In pasted text, letters are usually separated by a short gap like{" "}
 <strong>one space</strong>. Some sources use 2–3 spaces, which is
 still typically intended to mean “next letter.”
 </p>
 </div>

 <div className="rounded-xl bg-[#f7f4ee] p-5">
 <p className="text-base font-extrabold text-sky-950">Word gap</p>
 <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
 A word break is a longer pause. In text form, a common convention is{" "}
 <strong>7 spaces</strong>. Another very common convention is{" "}
 <strong>/</strong>, especially in puzzles and copied strings.
 </p>
 </div>

 <div className="rounded-xl bg-[#f7f4ee] p-5">
 <p className="text-base font-extrabold text-sky-950">
 Why normalize?
 </p>
 <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
 Decoders rely on separators to know where letters and words end. If
 separators are inconsistent, decoders either fail or produce
 confusing output. Normalizing makes results predictable.
 </p>
 </div>
 </div>

 <div
 id="formats" className="mt-8 rounded-xl bg-[#fffdf8] p-6 sm:p-7">
 <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
 Common word separator formats and when to use them
 </h3>

 <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
 There is no single “only correct” way to display word breaks in pasted
 Morse text, but some formats are more interoperable with tools and
 some are easier for humans to read.
 </p>

 <div className="mt-5 grid gap-4 md:grid-cols-2">
 <div className="rounded-xl bg-[#fffdf8] p-5">
 <p className="font-extrabold text-sky-950">
 7 spaces (tool-friendly)
 </p>
 <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
 Many decoders treat a long gap as a clear word boundary. If you
 are preparing Morse for consistent decoding,{" "}
 <strong>7 spaces</strong> is usually the safest output.
 </p>
 <p className="mt-3 text-sm text-slate-700 leading-relaxed font-mono bg-[#f7f4ee] rounded-xl p-3 whitespace-pre-wrap">
 .... . .-.. .-.. --- .-- --- .-. .-.. -..
 </p>
 </div>

 <div className="rounded-xl bg-[#fffdf8] p-5">
 <p className="font-extrabold text-sky-950">
 Slash / (human-friendly)
 </p>
 <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
 A slash is common in puzzles and social posts because it is easy
 to see. It avoids the “how many spaces is that?” problem. If your
 audience is humans first, <strong>/</strong> is often ideal.
 </p>
 <p className="mt-3 text-sm text-slate-700 leading-relaxed font-mono bg-[#f7f4ee] rounded-xl p-3 whitespace-pre-wrap">
 .... . .-.. .-.. --- / .-- --- .-. .-.. -..
 </p>
 </div>

 <div className="rounded-xl bg-[#fffdf8] p-5">
 <p className="font-extrabold text-sky-950">
 Pipe | (visible divider)
 </p>
 <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
 Some people prefer <strong>|</strong> because it looks like a
 clean boundary and rarely appears in Morse itself. It is not
 universal, but it is easy to normalize into another format.
 </p>
 <p className="mt-3 text-sm text-slate-700 leading-relaxed font-mono bg-[#f7f4ee] rounded-xl p-3 whitespace-pre-wrap">
 .... . .-.. .-.. --- | .-- --- .-. .-.. -..
 </p>
 </div>

 <div className="rounded-xl bg-[#fffdf8] p-5">
 <p className="font-extrabold text-sky-950">
 New lines (input only)
 </p>
 <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
 Line breaks appear when Morse is copied from PDFs, worksheets,
 email, or chat. They are useful to <strong>accept</strong> and
 normalize, but they are not a stable way to represent word breaks
 because platforms rewrap text.
 </p>
 <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
 This is why this page treats new lines as valid input, but it
 avoids generating them as a “word separator” when converting from
 English.
 </p>
 </div>
 </div>
 </div>

 <div
 id="normalize" className="mt-6 rounded-xl bg-[#fffdf8] p-6 sm:p-7">
 <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
 Normalize pasted Morse (the main job)
 </h3>

 <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
 If you already have Morse, this tool rewrites separators into one
 consistent format. It does not try to “fix” incorrect Morse sequences.
 It only makes the
 <strong>boundaries</strong> reliable.
 </p>

 <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg text-slate-700">
 <li>
 Accepts dots and dashes plus common lookalikes (bullets and long
 dashes).
 </li>
 <li>
 Treats <code>/</code>, <code>|</code>, and new lines as word
 boundaries.
 </li>
 <li>
 Collapses messy whitespace so word gaps do not accidentally turn
 into letter gaps.
 </li>
 <li>
 Re-emits output using your selected convention (7 spaces or a
 visible divider).
 </li>
 </ul>

 <div className="mt-5">
 <p className="text-base font-extrabold text-sky-950">
 Example: normalize to slash
 </p>
 <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-[#f7f4ee] p-4 text-base sm:text-lg font-mono overflow-x-auto">
 {`Raw input (messy):
.... . .-.. .-.. --- .-- --- .-. .-.. -..
or
.... . .-.. .-.. --- | .-- --- .-. .-.. -..
or
.... . .-.. .-.. ---
.-- --- .-. .-.. -..

Normalized output:
.... . .-.. .-.. --- / .-- --- .-. .-.. -..`}
 </pre>
 </div>

 <div className="mt-5 rounded-xl bg-[#f7f4ee] p-5 text-slate-700">
 <p className="text-base font-extrabold text-sky-950">
 If your Morse has no spacing at all
 </p>
 <p className="mt-2 text-base sm:text-lg leading-relaxed">
 If everything is run together (no spaces, no slashes, no line
 breaks), a tool cannot reliably know where letters end without
 timing data. In that case, normalize what you can, then verify using
 the{" "}
 <Link
 to="/morse-code-decoder" className="font-extrabold text-sky-950 hover:text-sky-800 underline cursor-pointer">
 decoder
 </Link>{" "}
 and adjust separators manually.
 </p>
 </div>
 </div>

 <div
 id="english-to-morse" className="mt-6 rounded-xl bg-[#fffdf8] p-6 sm:p-7">
 <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
 English → Morse with the word separator you want
 </h3>

 <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
 If you have English text and you need Morse formatted with a specific
 word separator (like <code>/</code> for puzzles), this page can
 generate output that matches that convention.
 </p>

 <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg text-slate-700">
 <li>
 Any whitespace in the English input is treated as a word break.
 </li>
 <li>
 The output uses a consistent letter separator (spaces) and your
 chosen word separator (7 spaces, <code>/</code>, or <code>|</code>).
 </li>
 <li>
 Unsupported characters are skipped rather than guessed. If something
 is missing, simplify punctuation and retry.
 </li>
 </ul>

 <div className="mt-5">
 <p className="text-base font-extrabold text-sky-950">
 Example: puzzle-style output with /
 </p>
 <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-[#f7f4ee] p-4 text-base sm:text-lg font-mono overflow-x-auto">
 {`MEET AT NOON
-- . . - / .- - / -. --- --- -.`}
 </pre>
 </div>

 <div className="mt-5 rounded-xl bg-[#fffdf8] p-5">
 <p className="text-base font-extrabold text-sky-950">
 Related tools
 </p>
 <ul className="mt-3 list-disc pl-6 space-y-3 text-base sm:text-lg text-slate-700">
 <li>
 <Link
 to="/morse-code-encoder" className="text-sky-950 underline hover:no-underline cursor-pointer font-semibold">
 Encoder
 </Link>{" "}
 for full text → Morse conversion.
 </li>
 <li>
 <Link
 to="/morse-code-decoder" className="text-sky-950 underline hover:no-underline cursor-pointer font-semibold">
 Decoder
 </Link>{" "}
 to verify your output decodes correctly.
 </li>
 <li>
 <Link
 to="/dictionary" className="text-sky-950 underline hover:no-underline cursor-pointer font-semibold">
 Dictionary
 </Link>{" "}
 for character lookups (letters, numbers, punctuation).
 </li>
 </ul>
 </div>
 </div>

 <div
 id="troubleshooting" className="mt-6 rounded-xl bg-[#fffdf8] p-6 sm:p-7">
 <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
 Troubleshooting
 </h3>

 <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg text-slate-700">
 <li>
 <strong>Decoded output looks wrong:</strong> boundaries are usually
 the issue. Normalize to 7 spaces or <code>/</code>, then decode
 again.
 </li>
 <li>
 <strong>Word gaps collapsed:</strong> some apps compress multiple
 spaces into one. Use <code>/</code> or <code>|</code> if your output
 will travel through chat apps or social platforms.
 </li>
 <li>
 <strong>Copying from PDFs:</strong> line wraps and fancy punctuation
 are common. Normalize first, then verify in the decoder.
 </li>
 <li>
 <strong>Mixed conventions:</strong> pick one word separator and
 stick to it end-to-end (input, sharing, decoding).
 </li>
 </ul>
 </div>

 <div className="mt-8 rounded-xl bg-[#fffdf8] p-5 sm:p-7">
 <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
 Quick answers (word separators)
 </h3>

 <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg text-slate-700">
 <li>
 <strong>Word separator options:</strong> 7+ spaces, <code>/</code>,{" "}
 <code>|</code>, or new lines (input).
 </li>
 <li>
 <strong>Most tool-friendly output:</strong> 7 spaces between words.
 </li>
 <li>
 <strong>Most human-friendly format:</strong> <code>/</code> (or{" "}
 <code>|</code>) so word breaks are visible.
 </li>
 <li>
 <strong>Why decoders fail:</strong> if word gaps collapse into
 letter gaps, tokens merge and output becomes wrong.
 </li>
 </ul>
 </div>

 <div className="mt-6 rounded-xl bg-[#fffdf8] p-5 sm:p-7">
 <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
 Morse word separator rules
 </h3>

 <div className="mt-4 overflow-x-auto">
 <table className="w-full -collapse text-base sm:text-lg">
 <thead>
 <tr>
 <th className="py-2 text-left font-extrabold text-sky-950">
 Item
 </th>
 <th className="py-2 text-left font-extrabold text-sky-950">
 Meaning
 </th>
 </tr>
 </thead>
 <tbody className="text-slate-700">
 <tr>
 <td className="py-2 pr-4">Letter gap (typical pasted Morse)</td>
 <td className="py-2">1 space (sometimes 2–3 spaces)</td>
 </tr>
 <tr>
 <td className="py-2 pr-4">Word gap (tool-friendly)</td>
 <td className="py-2">7 spaces</td>
 </tr>
 <tr>
 <td className="py-2 pr-4">Word divider (human-friendly)</td>
 <td className="py-2">
 <code>/</code> or <code>|</code>
 </td>
 </tr>
 <tr>
 <td className="py-2 pr-4">New lines</td>
 <td className="py-2">
 Accept as input; normalize to stable output
 </td>
 </tr>
 <tr>
 <td className="py-2 pr-4">Best practice</td>
 <td className="py-2">
 Pick one convention and use it consistently
 </td>
 </tr>
 </tbody>
 </table>
 </div>

 <div className="mt-5 rounded-xl bg-[#fffdf8] p-5">
 <p className="text-base font-extrabold text-sky-950">
 Want full translation instead?
 </p>
 <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
 Use the{" "}
 <Link
 to="/morse-code-encoder" className="font-extrabold text-sky-950 hover:text-sky-800 underline cursor-pointer">
 encoder
 </Link>{" "}
 for text → Morse and the{" "}
 <Link
 to="/morse-code-decoder" className="font-extrabold text-sky-950 hover:text-sky-800 underline cursor-pointer">
 decoder
 </Link>{" "}
 for Morse → text.
 </p>
 </div>
 </div>
 </section>
 );
}



