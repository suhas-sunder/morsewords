import * as React from "react";

const workedExamples = [
  {
    title: "Message audio",
    input: "HELLO WORLD",
    body: "Use this for a full phrase you want to hear as Morse. The page converts the text into dot-dash timing, then plays the whole message as audio.",
  },
  {
    title: "Practice call",
    input: "CQ CQ",
    body: "Use a short repeated call when you want to test speed and spacing before exporting a longer practice clip.",
  },
  {
    title: "Short alert",
    input: "SOS",
    body: "SOS is compact and recognizable, so it is useful for checking tone, volume, and export timing before saving a file.",
  },
];

const settingRows = [
  {
    name: "Character speed",
    body: "Sets the basic dit length. Raise it when the symbols should form faster, and lower it when the dits and dahs are too hard to separate.",
  },
  {
    name: "Farnsworth spacing",
    body: "Adds extra silence between letters and words while keeping the characters crisp. This is useful for listening practice.",
  },
  {
    name: "Pitch, waveform, and volume",
    body: "Change how the audio feels to your ear. These controls affect tone quality, not the Morse message itself.",
  },
  {
    name: "Attack, release, and tail padding",
    body: "Soften clicks and keep the final symbol from being clipped when the WAV is opened in another editor.",
  },
];

export default function HowItWorksAudio() {
  return (
    <section className="mw-static-surface-soft mw-how-section mt-10 bg-[#fffaf2]/40 px-5 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-sky-800" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
            Audio spec
          </span>
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
          How this Morse code audio generator works
        </h2>

        <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
          This page is for turning a message into playable Morse audio. Type
          text, paste Morse, listen to the signal, tune the timing and tone, and
          export a WAV file when you need a reusable practice or sharing clip.
        </p>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-3">
        <section className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
          <h3 className="text-base font-extrabold text-sky-950">
            Who this page is for
          </h3>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            Use it when you want to hear a complete Morse message or save a WAV
            file for practice, lessons, demos, videos, or sharing.
          </p>
        </section>

        <section className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
          <h3 className="text-base font-extrabold text-sky-950">
            What it accepts
          </h3>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            The tool accepts plain text or pasted Morse. Spaces in pasted Morse
            control the letter and word gaps used for playback.
          </p>
        </section>

        <section className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
          <h3 className="text-base font-extrabold text-sky-950">
            What it exports
          </h3>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            WAV export is rendered locally in the browser so the saved file
            preserves the same speed, spacing, and tone you preview.
          </p>
        </section>
      </div>

      <div className="mt-10 space-y-10 text-slate-700">
        <section>
          <h3 className="text-xl font-extrabold text-sky-950 sm:text-2xl">
            How to generate Morse audio
          </h3>
          <ol className="mt-4 list-decimal space-y-3 pl-6 text-base leading-relaxed sm:text-lg">
            <li>Choose text input or Morse input.</li>
            <li>Enter the message and verify the generated Morse preview.</li>
            <li>Set speed, Farnsworth spacing, pitch, waveform, and volume.</li>
            <li>Play the audio, then export WAV when the timing sounds right.</li>
          </ol>
        </section>

        <section>
          <h3 className="text-xl font-extrabold text-sky-950 sm:text-2xl">
            Worked audio examples
          </h3>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {workedExamples.map((item) => (
              <article
                key={item.title}
                className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5"
              >
                <h4 className="font-extrabold text-sky-950">{item.title}</h4>
                <pre className="mw-static-code mt-3 whitespace-pre-wrap rounded-lg bg-[#fffdf8] p-3 font-mono text-sm text-slate-900">{item.input}</pre>
                <p className="mt-3 text-base leading-relaxed text-slate-700">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-base leading-relaxed text-slate-700 sm:text-lg">
            For more context on the short emergency pattern, see{" "}
            <a
              href="/morse-code-sos"
              className="font-semibold text-sky-900 underline-offset-4 hover:underline"
            >
              SOS in Morse code
            </a>
            .
          </p>
        </section>

        <section>
          <h3 className="text-xl font-extrabold text-sky-950 sm:text-2xl">
            Audio settings explained
          </h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {settingRows.map((row) => (
              <div key={row.name} className="mw-static-tile rounded-xl bg-[#f7f4ee] p-5">
                <h4 className="font-extrabold text-sky-950">{row.name}</h4>
                <p className="mt-2 text-base leading-relaxed text-slate-700">
                  {row.body}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-base leading-relaxed text-slate-700 sm:text-lg">
            For deeper timing rules, use the{" "}
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

        <section>
          <h3 className="text-xl font-extrabold text-sky-950 sm:text-2xl">
            Common audio mistakes and fixes
          </h3>
          <ul className="mt-4 list-disc space-y-3 pl-6 text-base leading-relaxed sm:text-lg">
            <li>
              <strong>Audio sounds cramped:</strong> increase Farnsworth spacing
              before lowering character speed.
            </li>
            <li>
              <strong>Pitch feels uncomfortable:</strong> change pitch in small
              steps; this does not change the Morse message.
            </li>
            <li>
              <strong>Symbols click:</strong> add a little attack and release,
              or use a smoother waveform.
            </li>
            <li>
              <strong>Export clips the ending:</strong> increase tail padding so
              the final release has room to finish.
            </li>
          </ul>
        </section>

        <section className="mw-static-panel rounded-xl bg-[#fffdf8] p-5">
          <h3 className="text-xl font-extrabold text-sky-950 sm:text-2xl">
            Audio generator vs sound generator
          </h3>
          <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
            Use this page when you want to hear or save a Morse message as WAV
            audio. Use the{" "}
            <a
              href="/morse-code-sound-generator"
              className="font-semibold text-sky-900 underline-offset-4 hover:underline"
            >
              Morse code sound generator
            </a>{" "}
            when you mainly want to shape the beep, waveform, tone, or MP3/WAV
            practice signal.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-extrabold text-sky-950 sm:text-2xl">
            Best next step after creating audio
          </h3>
          <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
            If the file is for listening drills, move into{" "}
            <a
              href="/morse-code-audio-practice"
              className="font-semibold text-sky-900 underline-offset-4 hover:underline"
            >
              Morse audio practice
            </a>{" "}
            or test recognition with the{" "}
            <a
              href="/morse-code-audio-quiz"
              className="font-semibold text-sky-900 underline-offset-4 hover:underline"
            >
              Morse audio quiz
            </a>
            .
          </p>
        </section>
      </div>
    </section>
  );
}
