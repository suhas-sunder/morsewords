export default function HowItWorks() {
  return (
    <section className="mt-8 bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 shadow-sm">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b2447] tracking-tight">
        Word separators in Morse code
      </h2>

      <p className="mt-3 text-base sm:text-lg text-gray-700 leading-relaxed">
        Morse code is not a “symbol language” in the way people often copy it online.
        In real Morse, meaning comes from <strong>timing</strong>: dots and dashes
        (short and long signals), plus the length of the pauses between them. When Morse
        is written as plain text, those pauses get approximated with spaces and sometimes
        visible separators like <strong>/</strong> or <strong>|</strong>. This page is
        focused on one specific problem: keeping word breaks consistent so that Morse is
        easier to share, easier to paste into tools, and less likely to decode incorrectly.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="font-extrabold text-neutral-900">Letter gap</p>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            In pasted text, letters are typically separated by a short gap such as{" "}
            <strong>one space</strong>. Some sources use 2–3 spaces, which is still usually
            intended to mean “next letter.”
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="font-extrabold text-neutral-900">Word gap</p>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            A word break is a longer pause. In text form, a common convention is{" "}
            <strong>7 spaces</strong>. Another very common convention is{" "}
            <strong>/</strong>, especially in puzzles and copied strings.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="font-extrabold text-neutral-900">Why normalize?</p>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            Decoders rely on separators to know where letters and words end. If separators
            are inconsistent, decoders either fail or produce confusing output. Normalizing
            makes results predictable.
          </p>
        </div>
      </div>

      <h3 className="mt-8 text-xl sm:text-2xl font-extrabold text-neutral-900">
        Two common situations: Morse formatting vs English formatting
      </h3>

      <p className="mt-3 text-gray-700 leading-relaxed">
        People land on this page for two different reasons:
      </p>

      <ul className="mt-3 space-y-2 text-gray-700 leading-relaxed list-disc pl-6">
        <li>
          <strong>You already have Morse</strong> (dots and dashes) from a website, a puzzle,
          a worksheet, or a friend, and you want to rewrite the word separators into a format
          that tools will handle consistently.
        </li>
        <li>
          <strong>You have English text</strong> and you want to generate Morse in a specific
          word-separated format, usually because the audience expects <strong>/</strong> or
          <strong> 7 spaces</strong>.
        </li>
      </ul>

      <p className="mt-3 text-gray-700 leading-relaxed">
        That is why this page supports both <strong>Normalize Morse</strong> and{" "}
        <strong>English → Morse</strong>. The goal is not to become a full translator page.
        The goal is to be extremely reliable about one thing: word breaks.
      </p>

      <h3 className="mt-8 text-xl sm:text-2xl font-extrabold text-neutral-900">
        Common word separator formats and when to use them
      </h3>

      <p className="mt-3 text-gray-700 leading-relaxed">
        There is no single “only correct” way to display word breaks in pasted Morse text,
        but there are formats that are more interoperable with tools and formats that are
        more human-readable.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="font-extrabold text-neutral-900">7 spaces (tool-friendly)</p>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            Many decoders and encoders use 7 spaces as a clear word boundary because it is
            unambiguous in plain text. If you are preparing Morse for another tool or for
            consistent decoding, 7 spaces is usually the safest output.
          </p>
          <p className="mt-3 text-sm text-gray-700 leading-relaxed font-mono bg-gray-50 border border-gray-200 rounded-xl p-3 whitespace-pre-wrap">
            .... . .-.. .-.. ---       .-- --- .-. .-.. -..
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="font-extrabold text-neutral-900">Slash / (human-friendly)</p>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            A slash is very common in puzzles and social posts because it is easy to see.
            It avoids the “how many spaces is that?” problem. If your audience is humans
            first and tools second, <strong>/</strong> is often ideal.
          </p>
          <p className="mt-3 text-sm text-gray-700 leading-relaxed font-mono bg-gray-50 border border-gray-200 rounded-xl p-3 whitespace-pre-wrap">
            .... . .-.. .-.. --- / .-- --- .-. .-.. -..
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="font-extrabold text-neutral-900">Pipe | (visible divider)</p>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            Some people prefer <strong>|</strong> as a word divider because it looks like a
            clean boundary and rarely appears in Morse itself. It is not universal, but it
            is easy to normalize into something else.
          </p>
          <p className="mt-3 text-sm text-gray-700 leading-relaxed font-mono bg-gray-50 border border-gray-200 rounded-xl p-3 whitespace-pre-wrap">
            .... . .-.. .-.. --- | .-- --- .-. .-.. -..
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="font-extrabold text-neutral-900">New lines (input only)</p>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            Line breaks appear when Morse is copied from PDFs, worksheets, email, or chat.
            They are useful to <strong>accept</strong> and normalize, but they are not a
            standard way to represent word breaks. Many tools and platforms rewrap text and
            change line breaks unexpectedly.
          </p>
          <p className="mt-3 text-sm text-gray-700 leading-relaxed">
            This is why this page treats new lines as a valid Morse input format and can
            output new lines when you are normalizing pasted Morse, but it avoids generating
            new lines from English as a “word separator.” For English → Morse, you typically
            want output that survives copy/paste across sites.
          </p>
        </div>
      </div>

      <h3 className="mt-8 text-xl sm:text-2xl font-extrabold text-neutral-900">
        Why decoding fails when separators are messy
      </h3>

      <p className="mt-3 text-gray-700 leading-relaxed">
        A decoder has a simple job: split the input into letter tokens, then map each token
        to a character. The hard part is not the mapping. The hard part is knowing where one
        letter ends and the next begins. If letters and words are not separated consistently,
        a decoder may join tokens that should be separate or split tokens that should be
        together.
      </p>

      <p className="mt-3 text-gray-700 leading-relaxed">
        Common problems include:
      </p>

      <ul className="mt-3 space-y-2 text-gray-700 leading-relaxed list-disc pl-6">
        <li>
          <strong>Mixed conventions</strong>: the same string uses both <strong>/</strong> and
          variable spaces, making word boundaries inconsistent.
        </li>
        <li>
          <strong>Collapsed spacing</strong>: some apps compress multiple spaces into one,
          turning word gaps into letter gaps.
        </li>
        <li>
          <strong>Line wrapping</strong>: copying from a webpage introduces new lines that were
          not intended as word breaks.
        </li>
      </ul>

      <p className="mt-3 text-gray-700 leading-relaxed">
        Normalizing separators does not magically “fix” incorrect Morse, but it removes one of
        the biggest sources of confusion: word boundary formatting.
      </p>

      <h3 className="mt-8 text-xl sm:text-2xl font-extrabold text-neutral-900">
        Practical tips for puzzles, worksheets, and sharing
      </h3>

      <ul className="mt-3 space-y-2 text-gray-700 leading-relaxed list-disc pl-6">
        <li>
          If you are making a puzzle for humans, consider using <strong>/</strong> or{" "}
          <strong>|</strong> so word breaks are obvious without counting spaces.
        </li>
        <li>
          If you are preparing Morse for a decoder or for consistent machine parsing, choose{" "}
          <strong>7 spaces</strong> as output.
        </li>
        <li>
          If your input came from a PDF or worksheet, normalize it first. PDFs often insert
          random line breaks that are not meaningful.
        </li>
        <li>
          If a decoder output looks wrong, check spacing before you assume the Morse is wrong.
          Word and letter boundaries are the most common issue.
        </li>
      </ul>

      <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sky-900">
        <p className="font-extrabold">What this page does (and does not do)</p>
        <p className="mt-2 text-sm leading-relaxed">
          This page is intentionally narrow. It focuses on word separators and spacing
          conventions. It does not try to “guess” letters or fix incorrect Morse sequences.
          If you want full conversion between English and Morse, use the dedicated encoder
          and decoder pages.
        </p>
      </div>
    </section>
  );
}
