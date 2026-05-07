import * as React from "react";

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
    body: "Controls tone frequency. Many learners find 600 to 700 Hz comfortable, but the best value is the one you can hear clearly without fatigue.",
  },
  {
    name: "Waveform",
    body: "Changes the character of the beep. Sine is smooth, square is sharper, triangle is softer, and sounder gives a click-like telegraph feel.",
  },
  {
    name: "Attack and release",
    body: "Soften the start and end of each dot or dash. Use these when the signal clicks or feels too abrupt.",
  },
  {
    name: "WPM and Farnsworth",
    body: "Control readability. WPM changes symbol speed; Farnsworth spacing gives extra silence between letters and words.",
  },
];

export default function SoundGeneratorGuide() {
  return (
    <>
      <section className="mw-static-surface-soft mw-how-section mt-10 bg-[#fffaf2]/40 px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-sky-800" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
              Sound spec
            </span>
          </div>

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
              Use it when tone quality matters: practice beeps, radio-style
              sidetone, puzzle sounds, quick signal tests, or downloadable MP3
              and WAV clips.
            </p>
          </section>

          <section className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
            <h3 className="text-base font-extrabold text-sky-950">
              What kind of sound it creates
            </h3>
            <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
              It creates timed on-off Morse tones. The Morse pattern controls
              when sound happens; pitch and waveform control how that sound
              feels.
            </p>
          </section>

          <section className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
            <h3 className="text-base font-extrabold text-sky-950">
              What you can download
            </h3>
            <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
              Download WAV for clean editing or MP3 for smaller practice clips.
              Both formats are generated in your browser.
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
          Tone settings explained
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
          The Morse pattern stays the same while you adjust how the beep sounds.
          Change one setting at a time so you can hear what helped.
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
            href="/morse-code-timing"
            className="font-semibold text-sky-900 underline-offset-4 hover:underline"
          >
            Morse code timing guide
          </a>{" "}
          and the{" "}
          <a
            href="/farnsworth-timing"
            className="font-semibold text-sky-900 underline-offset-4 hover:underline"
          >
            Farnsworth timing guide
          </a>
          .
        </p>
      </section>

      <section className="mw-static-surface-soft mw-how-section mt-8 bg-[#fffaf2]/40 px-5 py-8 sm:px-8 sm:py-10">
        <h2 className="text-2xl font-extrabold text-sky-950 sm:text-3xl">
          Sound generator vs audio generator
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
          Use this page when you want to shape the beep or tone signal itself.
          Use the{" "}
          <a
            href="/audio"
            className="font-semibold text-sky-900 underline-offset-4 hover:underline"
          >
            Morse code audio generator
          </a>{" "}
          when your main goal is to turn a full message into playable or saved
          WAV audio.
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
        </ul>
      </section>

      <section className="mw-static-surface-soft mw-how-section mt-8 bg-[#fffaf2]/40 px-5 py-8 sm:px-8 sm:py-10">
        <h2 className="text-2xl font-extrabold text-sky-950 sm:text-3xl">
          Best next step after testing a signal
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
          When the tone is comfortable, use it for{" "}
          <a
            href="/morse-code-audio-practice"
            className="font-semibold text-sky-900 underline-offset-4 hover:underline"
          >
            audio practice
          </a>{" "}
          or test recognition with the{" "}
          <a
            href="/morse-code-audio-quiz"
            className="font-semibold text-sky-900 underline-offset-4 hover:underline"
          >
            audio quiz
          </a>
          . If you want broader recall work, move to the{" "}
          <a
            href="/practice"
            className="font-semibold text-sky-900 underline-offset-4 hover:underline"
          >
            Morse practice drill
          </a>
          .
        </p>
      </section>
    </>
  );
}
