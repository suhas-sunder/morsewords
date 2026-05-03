import * as React from "react";

const searchIntentBlocks = [
  {
    title: "Morse code sound generator",
    body: "Turn text into timed Morse beeps, then adjust speed, spacing, pitch, waveform, and volume before playing or downloading the result.",
  },
  {
    title: "Morse code audio generator",
    body: "Create a reusable audio file for practice, lessons, videos, puzzles, or testing. Export as WAV for editing or MP3 for smaller files.",
  },
  {
    title: "Morse code beep generator",
    body: "Use square wave for a sharper electronic beep, sine for a clean practice tone, or telegraph sounder for a click-like mechanical style.",
  },
  {
    title: "Morse code tone generator",
    body: "Fine tune the frequency in Hz, soften the attack and release, and choose a waveform that matches the sound you need.",
  },
];

const workflowSteps = [
  {
    title: "1. Enter text or Morse",
    body: "Type a message in plain English or switch to Morse input and paste dots, dashes, spaces, and slash-separated word gaps.",
  },
  {
    title: "2. Shape the sound",
    body: "Set WPM, Farnsworth spacing, pitch, volume, waveform, attack, and release until the Morse sounds right for your use case.",
  },
  {
    title: "3. Play, loop, or export",
    body: "Preview the beeps in the browser, repeat the sound for listening practice, then download WAV or MP3 audio.",
  },
];

const exportRows = [
  {
    format: "MP3",
    bestFor: "Small shareable audio files, web pages, videos, slides, and quick practice clips.",
    note: "Encoded in the browser when you click Download MP3.",
  },
  {
    format: "WAV",
    bestFor: "Lossless editing, timing-sensitive practice audio, DAWs, video editors, and later conversion.",
    note: "Rendered locally from the same timing engine used for playback.",
  },
];

const toneRows = [
  ["CW radio", "Clean default for realistic Morse listening practice."],
  ["Sine", "Smooth tone that is easy to listen to for longer sessions."],
  ["Square", "Sharp electronic beep for games, demos, and puzzles."],
  ["Triangle", "Softer tone when square wave feels too harsh."],
  ["Sawtooth", "Buzzer-like tone for stylized effects."],
  ["Telegraph sounder", "Percussive click style for a more mechanical feel."],
];

export default function SoundGeneratorGuide() {
  return (
    <>
    <section className="mw-how-section mt-8 overflow-hidden rounded-2xl bg-[#fffdf8] p-5 sm:p-8">
        <div className="inline-flex items-center rounded-full bg-[#f7f4ee] px-3 py-1.5 text-sm font-extrabold text-sky-950">
          Sound generator guide
        </div>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
          Generate Morse code sound, beeps, tones, WAV, or MP3 audio
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
          This page is built for the sound-generation workflow: make the Morse audio, tune how it sounds, and download the file. It is not just the regular translator page with a play button. The controls focus on tone shape, speed, export format, and practical audio use.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {searchIntentBlocks.map((item) => (
            <article key={item.title} className="rounded-xl bg-[#f7f4ee] p-5">
              <h3 className="font-extrabold text-sky-950">{item.title}</h3>
              <p className="mt-2 text-slate-700 leading-relaxed">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

    <section className="mw-how-section mt-8 overflow-hidden rounded-2xl bg-[#fffdf8] p-5 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-950">
          How to make Morse code audio
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {workflowSteps.map((item) => (
            <article key={item.title} className="rounded-xl bg-[#f7f4ee] p-5">
              <h3 className="font-extrabold text-sky-950">{item.title}</h3>
              <p className="mt-2 text-slate-700 leading-relaxed">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

    <section className="mw-how-section mt-8 overflow-hidden rounded-2xl bg-[#fffdf8] p-5 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-950">
          MP3 vs WAV export for Morse code
        </h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          People often search for a Morse code MP3 generator because they want a file they can reuse. This tool supports MP3 for convenience and WAV for clean editing. Use MP3 when file size matters. Use WAV when you want the most reliable source file for editing, archiving, or later conversion.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {exportRows.map((row) => (
            <article key={row.format} className="rounded-xl bg-[#f7f4ee] p-5">
              <h3 className="text-xl font-extrabold text-sky-950">{row.format}</h3>
              <p className="mt-2 text-slate-700 leading-relaxed">{row.bestFor}</p>
              <p className="mt-3 text-sm font-semibold text-neutral-900">{row.note}</p>
            </article>
          ))}
        </div>
      </section>

    <section className="mw-how-section mt-8 overflow-hidden rounded-2xl bg-[#fffdf8] p-5 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-950">
          Pick the right Morse beep or tone
        </h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          The same Morse message can feel clean, harsh, soft, mechanical, or buzzy depending on waveform and pitch. Start around 600 to 700 Hz, then adjust from there.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {toneRows.map(([name, use]) => (
            <article key={name} className="rounded-xl bg-[#f7f4ee] p-5">
              <h3 className="font-extrabold text-sky-950">{name}</h3>
              <p className="mt-2 text-slate-700 leading-relaxed">{use}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}



