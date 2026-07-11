import * as React from "react";
import {
  OptionalSquareAd,
} from "~/client/components/ads/AdSenseAds";
import SectionEyebrow from "~/client/components/shared/SectionEyebrow";
import { ROUTES } from "~/client/data/routes";

const workedExamples = [
  {
    title: "Message audio",
    input: "HELLO WORLD",
    body: "Use this for a complete phrase you want to hear. Preview the timing, then export the same signal when it sounds right.",
  },
  {
    title: "Practice call",
    input: "CQ CQ",
    body: "Use a short repeated call to check speed and spacing before saving a longer listening clip.",
  },
  {
    title: "Short alert",
    input: "SOS",
    body: "SOS is compact and recognizable, so it is useful for testing tone, volume, and either MP3 or WAV export.",
  },
];

const settingRows = [
  {
    name: "Character speed",
    body: "Sets the dit length. Raise it when symbols should form faster, and lower it when the characters are hard to separate.",
  },
  {
    name: "Farnsworth spacing",
    body: "Adds silence between letters and words while keeping each character crisp for listening practice.",
  },
  {
    name: "Pitch, waveform, and volume",
    body: "Change how the signal feels to your ear. These controls affect tone quality, not the Morse message.",
  },
  {
    name: "Attack, release, and tail padding",
    body: "Soften clicks and leave enough room so the final symbol is not clipped in either exported format.",
  },
];

const audioToolRows = [
  {
    title: "Morse code sound generator",
    href: ROUTES.soundGenerator,
    body: "Use it when you mainly want to shape the beep, tone preset, waveform, MP3, or WAV sound for a short practice signal.",
  },
  {
    title: "Morse code MP3 generator",
    href: ROUTES.mp3Generator,
    body: "Use it when a compact MP3 or editable WAV download is the main job, including bitrate and file-size choices.",
  },
  {
    title: "Morse code audio decoder",
    href: ROUTES.audioDecoder,
    body: "Use it when you have a local audio file and need Morse audio to text. Clear tones and simple backgrounds decode best.",
  },
  {
    title: "Book to Morse code translator",
    href: ROUTES.bookTranslator,
    body: "Use it for long text, TXT, EPUB, PDF, chapters, or book-length audio and video workflows.",
  },
  {
    title: "Morse code video generator",
    href: ROUTES.videoGenerator,
    body: "Use it for short visual Morse clips with optional audio when you need video output instead of only sound.",
  },
  {
    title: "Morse audio practice",
    href: ROUTES.audioPractice,
    body: "Use practice and the audio quiz when the goal is listening recall, not just exporting a finished sound file.",
    extraHref: ROUTES.audioQuiz,
    extraLabel: "audio quiz",
  },
  {
    title: "Morse code timing",
    href: ROUTES.timing,
    body: "Use the timing and Farnsworth guides when WPM, character speed, or learner spacing feels confusing.",
    extraHref: ROUTES.farnsworth,
    extraLabel: "Farnsworth timing",
  },
];

export default function HowItWorksAudio() {
  return (
    <section className="relative left-1/2 mt-14 w-screen max-w-[100vw] -translate-x-1/2 bg-[#fffaf2]/35 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1160px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <div>
            <SectionEyebrow>Audio spec</SectionEyebrow>

            <h2 className="mt-4 max-w-[18ch] text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
              How this Morse code audio generator works
            </h2>

            <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              This is the MorseWords audio hub. Type text or paste Morse,
              listen to the signal, tune the timing and tone, then export an MP3
              or WAV file or move to the right decoder, book, video, or
              listening-practice tool.
            </p>
          </div>

          <p className="max-w-[30ch] text-base leading-relaxed text-slate-700">
            Playback, MP3 encoding, and WAV export happen locally in your browser;
            your message is not uploaded.
          </p>
        </div>

        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <section>
            <h3 className="text-base font-extrabold text-sky-950">
              Who this page is for
            </h3>
            <p className="mt-2 max-w-[34ch] text-base leading-relaxed text-slate-700">
              Use it when you want to hear a complete Morse message or save a
              MP3 or WAV file for practice, lessons, demos, timing checks, videos, or
              sharing.
            </p>
          </section>

          <section>
            <h3 className="text-base font-extrabold text-sky-950">
              What it accepts
            </h3>
            <p className="mt-2 max-w-[34ch] text-base leading-relaxed text-slate-700">
              The tool accepts plain text or pasted Morse. Spaces in pasted
              Morse control the letter and word gaps used for playback.
            </p>
          </section>

          <section>
            <h3 className="text-base font-extrabold text-sky-950">
              What it exports
            </h3>
            <p className="mt-2 max-w-[34ch] text-base leading-relaxed text-slate-700">
              MP3 and WAV export are rendered locally, so the saved file preserves
              the same speed, Farnsworth spacing, pitch, volume, and tone you
              preview. MP3 is smaller; WAV is uncompressed.
            </p>
          </section>
        </div>

        <div className="mt-14 space-y-14 text-slate-700">
          <section className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Build audio
              </span>
              <h3 className="mt-3 text-2xl font-extrabold text-sky-950">
                How to generate Morse audio
              </h3>
            </div>
            <div className="mw-support-ad-grid-tight">
              <ol className="max-w-[58ch] list-decimal space-y-3 pl-6 text-base leading-relaxed sm:text-lg">
                <li>Choose text input or Morse input.</li>
                <li>Enter the message and verify the generated Morse preview.</li>
                <li>Set speed, Farnsworth spacing, pitch, waveform, and volume.</li>
                <li>Choose MP3 or WAV, then download when the timing sounds right.</li>
              </ol>

              <OptionalSquareAd className="mw-signal-audio-seo" />
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Examples
              </span>
              <h3 className="mt-3 text-2xl font-extrabold text-sky-950">
                Worked audio examples
              </h3>
            </div>
            <div>
              <div className="grid gap-5 md:grid-cols-3">
                {workedExamples.map((item) => (
                  <article key={item.title}>
                    <h4 className="font-extrabold text-sky-950">
                      {item.title}
                    </h4>
                    <pre className="mw-static-code mt-3 whitespace-pre-wrap rounded-lg bg-[#fffdf8] p-3 font-mono text-sm text-slate-900">
                      {item.input}
                    </pre>
                    <p className="mt-3 max-w-[32ch] text-base leading-relaxed text-slate-700">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
              <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-slate-700 sm:text-lg">
                For more context on the short emergency pattern, see{" "}
                <a
                  href={ROUTES.sos}
                  className="font-semibold text-sky-900 underline-offset-4 hover:underline"
                >
                  SOS in Morse code
                </a>
                .
              </p>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Audio paths
              </span>
              <h3 className="mt-3 text-2xl font-extrabold text-sky-950">
                When to use each Morse audio tool
              </h3>
            </div>
            <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
              {audioToolRows.map((item) => (
                <section key={item.title}>
                  <h4 className="font-extrabold text-sky-950">
                    <a
                      href={item.href}
                      className="font-semibold text-sky-900 underline-offset-4 hover:underline"
                    >
                      {item.title}
                    </a>
                  </h4>
                  <p className="mt-2 max-w-[36ch] text-base leading-relaxed text-slate-700">
                    {item.body}
                    {item.extraHref && item.extraLabel ? (
                      <>
                        {" "}
                        Also see{" "}
                        <a
                          href={item.extraHref}
                          className="font-semibold text-sky-900 underline-offset-4 hover:underline"
                        >
                          {item.extraLabel}
                        </a>
                        .
                      </>
                    ) : null}
                  </p>
                </section>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Settings
              </span>
              <h3 className="mt-3 text-2xl font-extrabold text-sky-950">
                Audio settings explained
              </h3>
            </div>
            <div>
              <div className="grid gap-6 md:grid-cols-2">
                {settingRows.map((row) => (
                  <div key={row.name}>
                    <h4 className="font-extrabold text-sky-950">{row.name}</h4>
                    <p className="mt-2 max-w-[36ch] text-base leading-relaxed text-slate-700">
                      {row.body}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-slate-700 sm:text-lg">
                For deeper timing rules, use the{" "}
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
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Fix mistakes
              </span>
              <h3 className="mt-3 text-2xl font-extrabold text-sky-950">
                Common audio mistakes and fixes
              </h3>
            </div>
            <div>
              <ul className="grid max-w-[58rem] list-disc gap-x-10 gap-y-4 pl-6 text-base leading-relaxed sm:text-lg md:grid-cols-2">
                <li>
                  <strong>Audio sounds cramped:</strong> increase Farnsworth
                  spacing before lowering character speed.
                </li>
                <li>
                  <strong>Pitch feels uncomfortable:</strong> change pitch in
                  small steps; this does not change the message.
                </li>
                <li>
                  <strong>Symbols click:</strong> add a little attack and release,
                  or use a smoother waveform.
                </li>
                <li>
                  <strong>Export clips the ending:</strong> increase tail padding
                  so the final release has room to finish.
                </li>
              </ul>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Compare
              </span>
              <h3 className="mt-3 text-2xl font-extrabold text-sky-950">
                MP3 vs WAV for Morse audio
              </h3>
            </div>
            <p className="max-w-[58ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              Use WAV when you want clean timing, short dits, and editable
              audio. WAV files are larger because they are not compressed. Use
              MP3 for smaller shareable files; both formats are available above.
              The{" "}
              <a
                href={ROUTES.mp3Generator}
                className="font-semibold text-sky-900 underline-offset-4 hover:underline"
              >
                Morse code MP3 generator
              </a>{" "}
              has bitrate guidance for compact downloads. For longer source text,
              use the{" "}
              <a
                href={ROUTES.bookTranslator}
                className="font-semibold text-sky-900 underline-offset-4 hover:underline"
              >
                book to Morse code translator
              </a>{" "}
              for chapter-length audio or video exports, and the{" "}
              <a
                href={ROUTES.videoGenerator}
                className="font-semibold text-sky-900 underline-offset-4 hover:underline"
              >
                Morse code video generator
              </a>
              .
            </p>
          </section>

          <section className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Limits
              </span>
              <h3 className="mt-3 text-2xl font-extrabold text-sky-950">
                Practical audio expectations
              </h3>
            </div>
            <ul className="grid max-w-[58rem] list-disc gap-x-10 gap-y-4 pl-6 text-base leading-relaxed sm:text-lg md:grid-cols-2">
              <li>
                This page creates Morse audio from typed text or pasted dots
                and dashes; use the decoder page for audio-to-text.
              </li>
              <li>
                Long documents belong in the book translator, which is designed
                for larger source files and longer exports.
              </li>
              <li>
                Pitch and tone controls change listening comfort, not the Morse
                characters or the decoded text.
              </li>
              <li>
                Playback, MP3 encoding, and WAV export run locally in the browser;
                no remote URL import or server upload is required here.
              </li>
              <li>
                No split requests one file only. Split by duration plans ordered
                files at safe Morse boundaries; your browser may ask permission
                for multiple download requests.
              </li>
            </ul>
          </section>

          <section className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Next step
              </span>
              <h3 className="mt-3 text-2xl font-extrabold text-sky-950">
                Best next step after creating audio
              </h3>
            </div>
            <p className="max-w-[58ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              If the file is for listening drills, move into{" "}
              <a
                href={ROUTES.audioPractice}
                className="font-semibold text-sky-900 underline-offset-4 hover:underline"
              >
                Morse audio practice
              </a>{" "}
              or test recognition with the{" "}
              <a
                href={ROUTES.audioQuiz}
                className="font-semibold text-sky-900 underline-offset-4 hover:underline"
              >
                Morse audio quiz
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
