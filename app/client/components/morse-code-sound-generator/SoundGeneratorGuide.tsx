import * as React from "react";
import { ActionLinks } from "~/client/components/shared/MorseLearningLayout";
import SectionEyebrow from "~/client/components/shared/SectionEyebrow";
import { ROUTES } from "~/client/data/routes";

const soundExamples = [
  {
    title: "Signal check",
    input: "SOS",
    body: "A short pattern is useful when you only want to test tone, waveform, click edges, and volume before practicing longer code.",
  },
  {
    title: "Call-style tone",
    input: "CQ",
    body: "Repeated call patterns make it easier to hear whether the beep is too harsh, too soft, or too cramped.",
  },
  {
    title: "Mixed practice",
    input: "TEST 123",
    body: "Letters and numbers reveal whether speed and spacing are clear enough for a real practice signal.",
  },
];

const toneControls = [
  {
    name: "Pitch",
    body: "Controls tone frequency. Many learners find 600 to 700 Hz comfortable, but the best value is the one you can hear clearly without strain.",
  },
  {
    name: "Volume",
    body: "Set the sound loud enough to copy without pushing it into fatigue. Lower volume first if a sharp preset feels tiring.",
  },
  {
    name: "WPM and Farnsworth",
    body: "Control readability. WPM changes symbol speed; Farnsworth spacing adds extra room between letters and words for copying practice.",
  },
  {
    name: "Attack and release",
    body: "Soften the start and end of each dot or dash. Use these when the signal clicks or feels too abrupt.",
  },
];

const standardToneItems = [
  {
    name: "CW radio",
    body: "The recommended default for Morse listening. It keeps the signal clean, familiar, and easy to copy.",
  },
  {
    name: "Sine",
    body: "A smooth pure tone with soft edges. It is a good alternate starting point when CW radio feels too bright.",
  },
  {
    name: "Square",
    body: "A sharper electronic beep. Use it for high contrast, but switch back if it feels harsh during longer practice.",
  },
  {
    name: "Triangle and sawtooth",
    body: "Triangle is mellower; sawtooth is buzzier. Both are useful for comparing tone color without changing the Morse message.",
  },
  {
    name: "Telegraph sounder",
    body: "A click-style synthesized sounder for historical flavor. It is useful for experiments, not the clearest default for beginners.",
  },
];

const creativeToneItems = [
  {
    name: "Soft bell and warm tone",
    body: "Gentler synthesized tones for relaxed listening tests when a plain beep feels too dry.",
  },
  {
    name: "Low beacon and submarine ping",
    body: "Lower or swept synthesized signals for experiments where tone identity matters more than classic CW realism.",
  },
  {
    name: "Digital blip and soft click",
    body: "Shorter, more percussive options for signal design, games, or short practice clips.",
  },
  {
    name: "Bird chirp",
    body: "An up-swept synthesized chirp. It is not sampled bird audio, and it is optional for creative sound tests.",
  },
];

export default function SoundGeneratorGuide() {
  return (
    <>
      <section className="mw-static-surface-soft mw-how-section mt-10 bg-[#fffaf2]/40 px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-3">
          <SectionEyebrow>Sound spec</SectionEyebrow>

          <h2 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
            How this Morse code sound generator works
          </h2>

          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            This page is for shaping the sound of Morse code. Enter a short
            message or pasted Morse, then tune the beep, tone, waveform, speed,
            and spacing until the signal is clear enough for practice or signal
            testing.
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <section className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
            <h3 className="text-base font-extrabold text-sky-950">
              Who this page is for
            </h3>
            <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
              Use it when tone quality matters: practice beeps, CW-style
              sidetone, waveform tests, signal design, or a quick check before
              moving to downloadable audio.
            </p>
          </section>

          <section className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
            <h3 className="text-base font-extrabold text-sky-950">
              What kind of sound it creates
            </h3>
            <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
              It creates timed on-off Morse tones. The Morse pattern controls
              when sound happens; pitch, volume, preset, attack, and release
              control how that sound feels.
            </p>
          </section>

          <section className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
            <h3 className="text-base font-extrabold text-sky-950">
              What you can download
            </h3>
            <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
              This page includes quick MP3 and WAV export for the current
              signal. Use the dedicated MP3 generator when download settings
              are the main job.
            </p>
          </section>
        </div>
      </section>

      <section className="mw-static-surface-soft mw-how-section mt-8 bg-[#fffaf2]/40 px-5 py-8 sm:px-8 sm:py-10">
        <h2 className="text-2xl font-extrabold text-sky-950 sm:text-3xl">
          How to create a Morse practice tone
        </h2>
        <ol className="mt-4 list-decimal space-y-3 pl-6 text-base leading-relaxed text-slate-700 sm:text-lg">
          <li>Enter a short text message or switch to Morse input.</li>
          <li>Shape the tone with pitch, waveform, speed, and spacing.</li>
          <li>Play the sound, loop it for drills, or download MP3 or WAV.</li>
        </ol>
      </section>

      <section className="mw-static-surface-soft mw-how-section mt-8 bg-[#fffaf2]/40 px-5 py-8 sm:px-8 sm:py-10">
        <h2 className="text-2xl font-extrabold text-sky-950 sm:text-3xl">
          Worked sound examples
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {soundExamples.map((item) => (
            <article
              key={item.title}
              className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5"
            >
              <h3 className="font-extrabold text-sky-950">{item.title}</h3>
              <pre className="mw-static-code mt-3 whitespace-pre-wrap rounded-lg bg-[#fffdf8] p-3 font-mono text-sm text-slate-900">{item.input}</pre>
              <p className="mt-3 text-base leading-relaxed text-slate-700">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mw-static-surface-soft mw-how-section mt-8 bg-[#fffaf2]/40 px-5 py-8 sm:px-8 sm:py-10">
        <h2 className="text-2xl font-extrabold text-sky-950 sm:text-3xl">
          CW, beep, and waveform presets
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
          The Morse pattern stays the same while you adjust how the beep sounds.
          Start with CW radio for normal practice, then compare waveforms only
          after the timing feels readable.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {standardToneItems.map((row) => (
            <div key={row.name} className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
              <h3 className="font-extrabold text-sky-950">{row.name}</h3>
              <p className="mt-2 text-base leading-relaxed text-slate-700">
                {row.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mw-static-surface-soft mw-how-section mt-8 bg-[#fffaf2]/40 px-5 py-8 sm:px-8 sm:py-10">
        <h2 className="text-2xl font-extrabold text-sky-950 sm:text-3xl">
          Creative synthesized sound presets
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
          Creative presets are optional. They can make short Morse clips more
          distinctive, but they are synthesized tones rather than sampled audio,
          and they are not better than CW radio for learning basic rhythm.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {creativeToneItems.map((row) => (
            <div key={row.name} className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
              <h3 className="font-extrabold text-sky-950">{row.name}</h3>
              <p className="mt-2 text-base leading-relaxed text-slate-700">
                {row.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mw-static-surface-soft mw-how-section mt-8 bg-[#fffaf2]/40 px-5 py-8 sm:px-8 sm:py-10">
        <h2 className="text-2xl font-extrabold text-sky-950 sm:text-3xl">
          Pitch, volume, and timing settings
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
          Adjust one control at a time. If the Morse is hard to copy, fix timing
          before changing the tone color.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {toneControls.map((row) => (
            <div key={row.name} className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
              <h3 className="font-extrabold text-sky-950">{row.name}</h3>
              <p className="mt-2 text-base leading-relaxed text-slate-700">
                {row.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-base leading-relaxed text-slate-700 sm:text-lg">
          Timing details are covered in the{" "}
          <a
            href={ROUTES.timing}
            className="font-semibold text-sky-900 underline-offset-4 hover:underline"
          >
            Morse code timing guide
          </a>{" "}
          and the{" "}
          <a
            href={ROUTES.farnsworth}
            className="font-semibold text-sky-900 underline-offset-4 hover:underline"
          >
            Farnsworth timing guide
          </a>
          .
        </p>
      </section>

      <section className="mw-static-surface-soft mw-how-section mt-8 bg-[#fffaf2]/40 px-5 py-8 sm:px-8 sm:py-10">
        <h2 className="text-2xl font-extrabold text-sky-950 sm:text-3xl">
          Sound generator vs audio, MP3, video, and decoder tools
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
          Use this page when you want to shape the beep or tone signal itself.
          Use the{" "}
          <a
            href={ROUTES.audio}
            className="font-semibold text-sky-900 underline-offset-4 hover:underline"
          >
            Morse code audio generator
          </a>{" "}
          for the central audio hub, the{" "}
          <a
            href={ROUTES.mp3Generator}
            className="font-semibold text-sky-900 underline-offset-4 hover:underline"
          >
            Morse code MP3 generator
          </a>{" "}
          when downloadable MP3 or WAV files are the main task, the{" "}
          <a
            href={ROUTES.bookTranslator}
            className="font-semibold text-sky-900 underline-offset-4 hover:underline"
          >
            book to Morse code translator
          </a>{" "}
          for long text, the{" "}
          <a
            href={ROUTES.videoGenerator}
            className="font-semibold text-sky-900 underline-offset-4 hover:underline"
          >
            Morse code video generator
          </a>{" "}
          for visual clips, and the{" "}
          <a
            href={ROUTES.audioDecoder}
            className="font-semibold text-sky-900 underline-offset-4 hover:underline"
          >
            Morse code audio decoder
          </a>{" "}
          when sound needs to become text.
        </p>
      </section>

      <section className="mw-static-surface-soft mw-how-section mt-8 bg-[#fffaf2]/40 px-5 py-8 sm:px-8 sm:py-10">
        <h2 className="text-2xl font-extrabold text-sky-950 sm:text-3xl">
          Common sound setup mistakes
        </h2>
        <ul className="mt-4 list-disc space-y-3 pl-6 text-base leading-relaxed text-slate-700 sm:text-lg">
          <li>
            <strong>Using pitch to fix timing:</strong> pitch only changes tone
            height. Use WPM and Farnsworth spacing for readability.
          </li>
          <li>
            <strong>Starting with a harsh waveform:</strong> use sine or CW
            radio first, then try square or sawtooth only if you need a sharper
            effect.
          </li>
          <li>
            <strong>Clicks at symbol edges:</strong> add a little attack and
            release instead of lowering volume.
          </li>
          <li>
            <strong>Practice signal feels crowded:</strong> keep character
            speed steady and increase Farnsworth spacing.
          </li>
          <li>
            <strong>Expecting real sampled effects:</strong> creative presets
            are synthesized. They do not add sampled bells, birds, radios, or
            copyrighted audio assets.
          </li>
        </ul>
      </section>

      <section className="mw-static-surface-soft mw-how-section mt-8 bg-[#fffaf2]/40 px-5 py-8 sm:px-8 sm:py-10">
        <h2 className="text-2xl font-extrabold text-sky-950 sm:text-3xl">
          Best next step after testing a signal
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
          When the tone is comfortable, use it for{" "}
          <a
            href={ROUTES.audioPractice}
            className="font-semibold text-sky-900 underline-offset-4 hover:underline"
          >
            audio practice
          </a>{" "}
          or test recognition with the{" "}
          <a
            href={ROUTES.audioQuiz}
            className="font-semibold text-sky-900 underline-offset-4 hover:underline"
          >
            audio quiz
          </a>.
        </p>
      </section>

      <section className="mw-static-surface-soft mw-how-section mt-8 bg-[#fffaf2]/40 px-5 py-8 sm:px-8 sm:py-10">
        <h2 className="text-2xl font-extrabold text-sky-950 sm:text-3xl">
          Related Morse audio tools
        </h2>
        <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
          Use these canonical paths when the task moves from tone shaping to
          audio export, long-form conversion, video, decoding, practice, or
          timing.
        </p>
        <ActionLinks
          className="mt-5"
          links={[
            { href: ROUTES.audio, label: "Audio hub", primary: true },
            { href: ROUTES.mp3Generator, label: "MP3/WAV generator" },
            { href: ROUTES.bookTranslator, label: "Book translator" },
            { href: ROUTES.videoGenerator, label: "Video generator" },
            { href: ROUTES.audioDecoder, label: "Audio decoder" },
            { href: ROUTES.audioPractice, label: "Audio practice" },
            { href: ROUTES.audioQuiz, label: "Audio quiz" },
            { href: ROUTES.timing, label: "Timing guide" },
            { href: ROUTES.farnsworth, label: "Farnsworth guide" },
          ]}
        />
      </section>
    </>
  );
}
