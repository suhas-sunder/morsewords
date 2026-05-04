export default function HowToUseSuiteGuide() {
  return (
    <div className="space-y-8">
      <section className="mw-tool-section mt-4 py-6 sm:py-7">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-sky-800" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
            Toolkit guide
          </span>
        </div>

        <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight text-sky-950 sm:text-5xl">
          How to use MorseWords
        </h1>

        <p className="mt-3 max-w-none text-base leading-relaxed text-slate-700 sm:text-lg">
          This page is a practical guide to the MorseWords toolkit. It is not a
          history lesson and it is not trying to teach you Morse from zero. It
          is here so you can move quickly between tools, format input the way
          the apps expect, and avoid the few small mistakes that make Morse look
          “broken.” If you just want a fast conversion, start with the
          Translator and copy the output.
        </p>
      </section>

      <nav className="flex flex-wrap gap-2" aria-label="How to use sections">
        {[
          ["Translator", "#translator"],
          ["Audio", "#audio"],
          ["Practice", "#practice"],
          ["Typing", "#typing"],
          ["Dictionary", "#dictionary"],
          ["Spacing", "#spacing"],
          ["Workflows", "#workflows"],
          ["Copy + share", "#copy"],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-[#fffdf8] px-4 py-2 text-sm font-semibold text-slate-900 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.1)] transition hover:bg-white hover:text-sky-950 hover:outline-[rgba(11,36,71,0.22)] focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-[#fffdf8]/80 p-5 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.08)]">
          <p className="text-base font-extrabold text-sky-950">
            Copy-first design
          </p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            Every tool is built around clean output you can copy and reuse.
          </p>
        </div>

        <div className="rounded-xl bg-[#fffdf8]/80 p-5 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.08)]">
          <p className="text-base font-extrabold text-sky-950">
            Spacing matters
          </p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            For decoding, use <strong>3 spaces</strong> between letters and{" "}
            <strong>7 spaces</strong> between words.
          </p>
        </div>

        <div className="rounded-xl bg-[#fffdf8]/80 p-5 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.08)]">
          <p className="text-base font-extrabold text-sky-950">
            Suite, not one page
          </p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            Translate, listen, drill, type, and look up patterns without leaving
            the site.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6 text-slate-700 leading-relaxed">
        {/* Translator */}
        <section
          id="translator"
          className="rounded-xl bg-[#fffaf2]/45 p-6 sm:p-7"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
              1) Translator
            </h2>
            <p className="text-base sm:text-lg">
              Open{" "}
              <a
                href="/"
                className="text-sky-950 underline hover:no-underline cursor-pointer"
              >
                Morse Code Translator
              </a>
              . It is the fastest way to convert in either direction.
            </p>
          </div>

          <ol className="mt-4 list-decimal pl-6 space-y-3 text-base sm:text-lg">
            <li>
              Type normal text in the left box to get Morse output instantly.
              Paste Morse in the right box to decode it back to text.
            </li>
            <li>
              When decoding, use <strong>3 spaces</strong> between letters and{" "}
              <strong>7 spaces</strong> between words for the cleanest results.
              If your source uses a slash between words, that works too.
            </li>
            <li>
              Copy results using the copy buttons. If you are moving output into
              another app, keep the spacing, because spacing is part of the
              meaning when decoding.
            </li>
          </ol>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[#fffdf8]/85 p-5 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.08)]">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Best for
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-2 text-base sm:text-lg">
                <li>Quick conversions</li>
                <li>Cleaning up pasted Morse</li>
                <li>Copying a consistent output format</li>
              </ul>
            </div>

            <div className="rounded-xl bg-[#fffdf8]/85 p-5 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.08)]">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Common gotcha
              </p>
              <p className="mt-3 text-base sm:text-lg">
                If everything decodes as one long string of nonsense, your Morse
                probably has no letter boundaries. Add gaps (3 spaces) between
                letters.
              </p>
            </div>
          </div>
        </section>

        {/* Audio */}
        <section
          id="audio"
          className="rounded-xl bg-[#fffaf2]/45 p-6 sm:p-7"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
            2) Audio translator
          </h2>

          <p className="mt-3 text-base sm:text-lg">
            Open{" "}
            <a
              href="/audio"
              className="text-sky-950 underline hover:no-underline cursor-pointer"
            >
              Morse Code Audio Translator
            </a>
            . This tool is for listening: you control speed (WPM) and tone, then
            play the current Morse string.
          </p>

          <ol className="mt-4 list-decimal pl-6 space-y-3 text-base sm:text-lg">
            <li>
              Set your preferred <strong>WPM</strong> and tone. If you are not
              sure, pick a comfortable WPM first, then adjust up or down.
            </li>
            <li>
              Translate text to Morse or paste Morse directly, depending on what
              you are working with.
            </li>
            <li>
              Press <strong>Play Audio</strong> to hear the current Morse
              string. Use <strong>Stop</strong> to end playback immediately.
            </li>
          </ol>

          <div className="mt-5 rounded-xl bg-[#fffdf8]/85 p-5 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.08)]">
            <p className="text-base font-extrabold text-sky-950">Tip</p>
            <p className="mt-2 text-base sm:text-lg text-slate-700">
              If a long message is hard to follow, shorten it first in the
              Translator. Audio practice works best in small, repeatable chunks.
            </p>
          </div>
        </section>

        {/* Practice */}
        <section
          id="practice"
          className="rounded-xl bg-[#fffaf2]/45 p-6 sm:p-7"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
            3) Practice
          </h2>

          <p className="mt-3 text-base sm:text-lg">
            Open{" "}
            <a
              href="/practice"
              className="text-sky-950 underline hover:no-underline cursor-pointer"
            >
              Morse Code Practice
            </a>
            . Practice is structured drills: you get prompts and you answer. It
            is designed to keep you moving, not to overwhelm you with options.
          </p>

          <ol className="mt-4 list-decimal pl-6 space-y-3 text-base sm:text-lg">
            <li>
              Choose <strong>visual prompts</strong>,{" "}
              <strong>audio prompts</strong>, or both.
            </li>
            <li>
              Pick a character set (letters only, numbers, mixed, or a tighter
              subset) that matches what you are trying to improve.
            </li>
            <li>
              Type your answer for each prompt. A correct answer advances to the
              next prompt automatically.
            </li>
          </ol>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[#fffdf8]/85 p-5 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.08)]">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                When to use it
              </p>
              <p className="mt-3 text-base sm:text-lg">
                When you want repetition with feedback. Practice is the quickest
                way to find the handful of characters you keep mixing up.
              </p>
            </div>

            <div className="rounded-xl bg-[#fffdf8]/85 p-5 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.08)]">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                When to switch tools
              </p>
              <p className="mt-3 text-base sm:text-lg">
                If you fail the same prompt repeatedly, jump to the Dictionary
                to confirm the pattern, then come back.
              </p>
            </div>
          </div>
        </section>

        {/* Typing */}
        <section
          id="typing"
          className="rounded-xl bg-[#fffaf2]/45 p-6 sm:p-7"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
            4) Typing tool
          </h2>

          <p className="mt-3 text-base sm:text-lg">
            Open{" "}
            <a
              href="/typing"
              className="text-sky-950 underline hover:no-underline cursor-pointer"
            >
              Morse Code Typing Tool
            </a>
            . This is for hands-on input: you type dots and dashes directly, add
            spacing, and let the tool decode as you go.
          </p>

          <ol className="mt-4 list-decimal pl-6 space-y-3 text-base sm:text-lg">
            <li>
              Enter dots and dashes for each character. Then add spacing to
              separate letters and words.
            </li>
            <li>
              Use the spacing rules from this page: 3 spaces between letters, 7
              spaces between words. If you prefer, use / between words.
            </li>
            <li>
              When you are done, copy the decoded output. If the decoded output
              contains <strong>?</strong>, at least one chunk did not match a
              known pattern.
            </li>
          </ol>

          <div className="mt-5 rounded-xl bg-[#fffdf8]/85 p-5 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.08)]">
            <p className="text-base font-extrabold text-sky-950">
              Good use case
            </p>
            <p className="mt-2 text-base sm:text-lg text-slate-700">
              You have a short Morse snippet from a puzzle or a screenshot and
              want to manually enter it without relying on a copyable source.
            </p>
          </div>
        </section>

        {/* Dictionary */}
        <section
          id="dictionary"
          className="rounded-xl bg-[#fffaf2]/45 p-6 sm:p-7"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
            5) Dictionary
          </h2>

          <p className="mt-3 text-base sm:text-lg">
            Open{" "}
            <a
              href="/dictionary"
              className="text-sky-950 underline hover:no-underline cursor-pointer"
            >
              Morse Code Dictionary
            </a>
            . It is a lookup table for letters, numbers, and punctuation. Use it
            when you want to confirm one character without running a full
            translation.
          </p>

          <ol className="mt-4 list-decimal pl-6 space-y-3 text-base sm:text-lg">
            <li>Scan the table for the character you need.</li>
            <li>Copy the pattern or compare it to what you received.</li>
            <li>
              If you are unsure about spacing, treat the character pattern as
              the atomic unit, then add gaps between units.
            </li>
          </ol>

          <div className="mt-5 rounded-xl bg-[#fffdf8]/85 p-5 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.08)]">
            <p className="text-base font-extrabold text-sky-950">
              Shortcut mindset
            </p>
            <p className="mt-2 text-base sm:text-lg text-slate-700">
              Dictionary for one character, Translator for full messages.
              Switching quickly is the whole point of the suite.
            </p>
          </div>
        </section>

        {/* Spacing */}
        <section
          id="spacing"
          className="rounded-xl bg-[#fffaf2]/45 p-6 sm:p-7"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
            Spacing rules you actually need
          </h2>

          <p className="mt-4 text-base leading-relaxed text-slate-700 sm:text-lg">
            Morse can be written a few different ways, but MorseWords is strict
            about boundaries so decoding is predictable. If you control the
            format, use the site’s spacing convention everywhere:
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[#fffdf8]/85 p-5 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.08)]">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Recommended format
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-2 text-base sm:text-lg text-slate-700">
                <li>3 spaces between letters</li>
                <li>7 spaces between words</li>
                <li>/ can act as a visible word separator</li>
                <li>New lines count as word breaks</li>
              </ul>
            </div>

            <div className="rounded-xl bg-[#fffdf8]/85 p-5 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.08)]">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Why this works
              </p>
              <p className="mt-3 text-base sm:text-lg text-slate-700">
                When decoding, the tool reads dot-dash chunks and uses
                separators to decide where letters and words end. If separators
                are missing, the decoder cannot safely guess.
              </p>
            </div>
          </div>

          <p className="mt-5 text-base leading-relaxed text-slate-700 sm:text-lg">
            If you are copying Morse from a source that only uses single spaces,
            decoding may still work, but you will see more errors when the input
            is messy. The easiest fix is to normalize spacing in the Translator
            first, then move to Audio or Practice.
          </p>
        </section>

        {/* Workflows */}
        <section
          id="workflows"
          className="rounded-xl bg-[#fffaf2]/45 p-6 sm:p-7"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
            Fast workflows
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[#fffdf8]/85 p-5 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.08)]">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Convert → Listen
              </p>
              <p className="mt-2 text-base sm:text-lg text-slate-700">
                Use the Translator to generate clean Morse, then open Audio to
                play it at a specific WPM and tone. This is the easiest way to
                sanity-check that your spacing is good.
              </p>
            </div>

            <div className="rounded-xl bg-[#fffdf8]/85 p-5 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.08)]">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Hear → Confirm
              </p>
              <p className="mt-2 text-base sm:text-lg text-slate-700">
                When a Practice audio prompt feels ambiguous, check the
                Dictionary for the pattern, then go back to Practice and keep
                the set small until it sticks.
              </p>
            </div>

            <div className="rounded-xl bg-[#fffdf8]/85 p-5 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.08)]">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Manual entry → Decode
              </p>
              <p className="mt-2 text-base sm:text-lg text-slate-700">
                Use Typing when you cannot copy the Morse (for example, it is in
                an image). Enter dots and dashes, add spacing, and copy the
                decoded result.
              </p>
            </div>

            <div className="rounded-xl bg-[#fffdf8]/85 p-5 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.08)]">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Debug a bad paste
              </p>
              <p className="mt-2 text-base sm:text-lg text-slate-700">
                If pasted Morse includes bullets or long dashes, run it through
                the Translator’s decode box first. Clean output there is the
                foundation for everything else.
              </p>
            </div>
          </div>
        </section>

        {/* Copy + share */}
        <section
          id="copy"
          className="rounded-xl bg-[#fffaf2]/45 p-6 sm:p-7"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
            Copying, pasting, and sharing without breaking the spacing
          </h2>

          <p className="mt-4 text-base leading-relaxed text-slate-700 sm:text-lg">
            Most Morse issues are not “wrong dots and dashes.” They are spacing
            issues introduced by where you paste the text. Some apps collapse
            multiple spaces into one, and some fonts make dots and dashes look
            different (bullets for dots, long dashes for hyphens). If you are
            sending Morse to someone else, prefer formats that preserve
            whitespace, or use <strong>/</strong> as a visible word separator.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[#fffdf8]/85 p-5 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.08)]">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Safer places to paste
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-2 text-base sm:text-lg text-slate-700">
                <li>Code blocks and monospace editors</li>
                <li>Plain-text notes apps</li>
                <li>Messaging apps that keep multiple spaces</li>
              </ul>
            </div>

            <div className="rounded-xl bg-[#fffdf8]/85 p-5 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.08)]">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Places that often mangle it
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-2 text-base sm:text-lg text-slate-700">
                <li>Rich-text docs that auto-collapse spaces</li>
                <li>Auto-formatted email clients</li>
                <li>PDF copy-and-paste</li>
              </ul>
            </div>
          </div>

          <p className="mt-5 text-base leading-relaxed text-slate-700 sm:text-lg">
            If a paste source keeps changing your characters, run it through the
            Translator’s decode box first. The decoder normalizes common dot and
            dash lookalikes, and it will show <strong>?</strong> for anything it
            cannot interpret so you can clean it up before you practice or play
            audio.
          </p>
        </section>

        {/* FAQ */}
        <div className="pt-2">
          <p className="text-sm text-slate-500">
            Looking for the tools themselves? Jump to{" "}
            <a
              href="/"
              className="text-sky-950 underline hover:no-underline cursor-pointer"
            >
              Translator
            </a>
            ,{" "}
            <a
              href="/audio"
              className="text-sky-950 underline hover:no-underline cursor-pointer"
            >
              Audio
            </a>
            ,{" "}
            <a
              href="/practice"
              className="text-sky-950 underline hover:no-underline cursor-pointer"
            >
              Practice
            </a>
            ,{" "}
            <a
              href="/typing"
              className="text-sky-950 underline hover:no-underline cursor-pointer"
            >
              Typing
            </a>
            , or{" "}
            <a
              href="/dictionary"
              className="text-sky-950 underline hover:no-underline cursor-pointer"
            >
              Dictionary
            </a>
            .
          </p>
        </div>
      </div>
      <div className="mt-8 rounded-xl bg-[#fffaf2]/45 p-5 sm:p-7">
        <h2 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
          Quick reference
        </h2>

        <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg text-slate-700">
          <li>
            <strong>Fastest tool:</strong> Use the Translator for quick
            encode/decode.
          </li>
          <li>
            <strong>Audio practice:</strong> Use Audio to hear the current Morse
            string at a chosen WPM.
          </li>
          <li>
            <strong>Drills:</strong> Use Practice for repetition with feedback.
          </li>
          <li>
            <strong>Manual input:</strong> Use Typing when you cannot copy Morse
            from the source.
          </li>
          <li>
            <strong>Lookup:</strong> Use Dictionary to confirm a single
            character.
          </li>
          <li>
            <strong>Spacing rule:</strong> 3 spaces between letters, 7 spaces
            between words (or use <code>/</code>).
          </li>
        </ul>
      </div>
    </div>
  );
}



