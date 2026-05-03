import * as React from "react";

export default function HowItWorksAudio() {
  return (
    <section className="mw-how-section mt-8 overflow-hidden rounded-2xl bg-[#fffdf8] p-5 sm:p-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-sky-800" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">Audio spec</span>
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
          How this Morse code audio translator works
        </h2>

        <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
          This page is audio-first. You type text to generate an{" "}
          <strong>International Morse</strong> pattern, and the tool turns that
          pattern into sound using standard timing rules. The preview Morse is
          here to keep the output predictable and copyable, but the main product
          is the audio you can play, loop, and export.
        </p>

        <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
          If you only need a clean file for an editor or a practice track, you
          can treat this as a small audio workstation: enter a message, pick a
          speed, choose a tone, listen, then export. The controls are designed
          so changes are audible immediately, and the exported WAV matches the
          timing you preview.
        </p>
      </div>

      {/* Optional: quick jump links for long content */}
      <div className="mt-6 flex flex-wrap gap-2">
        {[
          ["Timing units", "#units"],
          ["Speed and WPM", "#wpm"],
          ["Farnsworth spacing", "#farnsworth"],
          ["Sound settings", "#sound"],
          ["Audio export", "#export"],
          ["Troubleshooting", "#troubleshooting"],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="cursor-pointer rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-sky-950"
          >
            {label}
          </a>
        ))}
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-[#f7f4ee] p-5">
          <p className="text-base font-extrabold text-sky-950">
            Symbols are units
          </p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            Morse is built from a single time unit. A <strong>dit</strong> is 1
            unit and a <strong>dah</strong> is 3 units.
          </p>
        </div>

        <div className="rounded-xl bg-[#f7f4ee] p-5">
          <p className="text-base font-extrabold text-sky-950">
            Speed sets dit length
          </p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            Your <strong>character speed</strong> controls the dit duration. All
            other timings scale from that base.
          </p>
        </div>

        <div className="rounded-xl bg-[#f7f4ee] p-5">
          <p className="text-base font-extrabold text-sky-950">
            Export is offline-rendered
          </p>
          <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
            WAV export renders in an <strong>offline</strong> audio context so
            spacing stays consistent even if your device is busy.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6 text-slate-700 leading-relaxed">
        <div
          id="units"
          className="rounded-xl bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Timing units
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Morse timing is defined in units. The tool converts your message
            into dots and dashes, then schedules sound and silence using the
            unit rules below.
          </p>

          <p className="mt-4 text-base sm:text-lg">
            Practical takeaway: if your output sounds "too fast" or "too slow,"
            you almost always want to change the unit duration (character speed)
            rather than trying to compensate with pitch or volume. Pitch and
            waveform change the character of the tone, not the timing grid.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[#f7f4ee] p-5">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Symbol lengths
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-2 text-base sm:text-lg">
                <li>
                  <strong>dit</strong> = 1 unit (tone)
                </li>
                <li>
                  <strong>dah</strong> = 3 units (tone)
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-[#f7f4ee] p-5">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Gap lengths
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-2 text-base sm:text-lg">
                <li>Inside a letter (between symbols) = 1 unit (silence)</li>
                <li>Between letters = 3 units (silence)</li>
                <li>Between words = 7 units (silence)</li>
              </ul>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-base font-extrabold text-sky-950">Example</p>
            <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-[#f7f4ee] p-4 text-base sm:text-lg font-mono overflow-x-auto">
              {`S O S
...   ---   ...
(dit dit dit)   (dah dah dah)   (dit dit dit)`}
            </pre>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              The spaces in the Morse preview are the same boundaries the audio
              scheduler uses for letter and word gaps.
            </p>
          </div>
        </div>

        <div id="wpm" className="rounded-xl bg-[#fffdf8] p-6 sm:p-7">
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Speed and WPM
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Speed is usually described as words per minute (WPM) using the word{" "}
            <strong>PARIS</strong> as a timing reference. A common shortcut is:
          </p>

          <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-[#f7f4ee] p-4 text-base sm:text-lg font-mono overflow-x-auto">
            {`dit(ms) = 1200 / WPM
dah(ms) = 3 * dit(ms)`}
          </pre>

          <p className="mt-4 text-base sm:text-lg">
            Example: at 20 WPM, a dit is 60 ms and a dah is 180 ms. The tool
            uses your chosen character speed to compute the unit duration, then
            schedules every symbol and gap from that.
          </p>

          <div className="mt-5 rounded-xl bg-[#fffdf8] p-5">
            <p className="text-base font-extrabold text-sky-950">
              Fast setup checklist
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2 text-base sm:text-lg">
              <li>
                Set <strong>character speed</strong> to the target you want the
                symbols to be formed at.
              </li>
              <li>
                If the message feels hard to follow, leave character speed alone
                and increase <strong>Farnsworth</strong> first.
              </li>
              <li>
                Pick a waveform that suits the use: <strong>sine</strong> for a
                clean practice tone, <strong>square</strong> for a sharper
                on-air style beep, or <strong>sounder</strong> for a percussive
                click.
              </li>
              <li>
                If you plan to export and edit, add a little{" "}
                <strong>tail padding</strong> so the final release is not cut
                short.
              </li>
            </ul>
          </div>

          <div className="mt-5 rounded-xl bg-[#fffdf8] p-5">
            <p className="text-base font-extrabold text-sky-950">
              Picking a speed for your goal
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2 text-base sm:text-lg">
              <li>
                <strong>Practice or listening:</strong> pick a character speed
                you can recognize reliably, then increase Farnsworth spacing if
                you want more time between letters.
              </li>
              <li>
                <strong>Audio cues or alerts:</strong> slower speeds can read
                clearly in noisy environments, but keep symbols crisp by using a
                short attack and release.
              </li>
              <li>
                <strong>Export for editing:</strong> use the final speed you
                want in the WAV. If you plan to time-stretch in an editor, keep
                the waveform simple (sine/triangle) to avoid artifacts.
              </li>
            </ul>
          </div>

          <div className="mt-5 rounded-xl bg-[#fffdf8] p-5">
            <p className="text-base font-extrabold text-sky-950">
              Why audio can click
            </p>
            <p className="mt-2 text-base sm:text-lg">
              Sudden starts and stops can produce clicks, especially with square
              and sawtooth waveforms. Use <strong>attack</strong> and{" "}
              <strong>release</strong> to soften edges without changing the
              timing grid.
            </p>
          </div>
        </div>

        <div
          id="farnsworth"
          className="rounded-xl bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Farnsworth spacing
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Farnsworth is a training technique. You keep the dits and dahs fast,
            but stretch the gaps between letters and words. That gives your ear
            crisp symbols with extra thinking time.
          </p>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              <strong>Character speed</strong> controls the sound timing of dits
              and dahs.
            </li>
            <li>
              <strong>Farnsworth spacing</strong> scales the 3-unit letter gap
              and 7-unit word gap only.
            </li>
            <li>
              The 1-unit gap inside a letter typically stays tied to character
              speed, so symbols remain well-formed.
            </li>
          </ul>

          <div className="mt-5">
            <p className="text-base font-extrabold text-sky-950">Tip</p>
            <p className="mt-2 text-base sm:text-lg text-slate-700">
              If characters feel readable but words blur together, increase word
              spacing slightly before slowing down character speed.
            </p>
            <p className="mt-3 text-base sm:text-lg text-slate-700">
              For utility use, think of Farnsworth as a readability dial. Keep
              character speed set to how you want the symbols to sound, then use
              Farnsworth to control how much silence appears between letters and
              words. This keeps the audio recognizable while making long
              messages less fatiguing to follow.
            </p>
          </div>

          <div className="mt-5 rounded-xl bg-[#fffdf8] p-5">
            <p className="text-base font-extrabold text-sky-950">
              When to leave Farnsworth at 1.0
            </p>
            <p className="mt-2 text-base sm:text-lg">
              If you are creating a tight rhythmic track (for example, a short
              intro sting or a sound effect), keep Farnsworth spacing at the
              default so spacing remains standard. Increase Farnsworth when the
              goal is readability rather than density.
            </p>
          </div>
        </div>

        <div
          id="sound"
          className="rounded-xl bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Sound settings
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            The audio generator can produce classic CW tones and more stylized
            sounds. Waveform and envelope settings change the feel of the signal
            without changing the timing rules.
          </p>

          <p className="mt-4 text-base sm:text-lg">
            For the cleanest results, start simple: a sine tone, moderate pitch,
            and a small attack and release. Then change one control at a time.
            If the tone is harsh, switch waveform before lowering volume. If it
            clicks, increase attack or release before changing speed.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[#f7f4ee] p-5">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Waveforms
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-2 text-base sm:text-lg">
                <li>
                  <strong>Sine</strong>: smooth, minimal harmonics
                </li>
                <li>
                  <strong>Triangle</strong>: softer than square
                </li>
                <li>
                  <strong>Square</strong>: bright and sharp
                </li>
                <li>
                  <strong>Sawtooth</strong>: buzzy and dense
                </li>
                <li>
                  <strong>Sounder</strong>: percussive telegraph click
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-[#f7f4ee] p-5">
              <p className="text-base sm:text-lg font-extrabold text-sky-950">
                Envelope
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-2 text-base sm:text-lg">
                <li>
                  <strong>Attack</strong> fades in each symbol
                </li>
                <li>
                  <strong>Release</strong> fades out each symbol
                </li>
                <li>
                  Longer attack and release reduce clicks, but can soften
                  extremely fast code.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-[#fffdf8] p-5">
            <p className="text-base font-extrabold text-sky-950">
              Pitch, volume, and sidetone feel
            </p>
            <p className="mt-2 text-base sm:text-lg">
              Pitch controls frequency in Hz. Many people find 500 to 700 Hz
              comfortable for practice. Volume is gain applied after the
              envelope, so you can keep clean edges while controlling loudness.
            </p>
          </div>
        </div>

        <div
          id="export"
          className="rounded-xl bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Audio export
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Export creates a standard PCM WAV. The tool renders the full signal
            in an <strong>OfflineAudioContext</strong>, then writes a WAV header
            and samples into a Blob for download.
          </p>

          <div className="mt-5 rounded-xl bg-[#fffdf8] p-5">
            <p className="text-base font-extrabold text-sky-950">
              What the WAV contains
            </p>
            <p className="mt-2 text-base sm:text-lg">
              The export is uncompressed audio. That means the file is larger
              than MP3, but it preserves exact symbol timing and avoids encoder
              smearing on short dits. If you need MP3 later, convert from the
              WAV in your editor after you are happy with speed and spacing.
            </p>
          </div>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              Offline render keeps timing stable and avoids glitches that can
              happen during real-time playback.
            </li>
            <li>
              You can add <strong>tail padding</strong> so the last release has
              room to finish in editors.
            </li>
            <li>
              If you export at a higher sample rate, the file size increases but
              the waveform can be smoother in some pipelines.
            </li>
          </ul>

          <div className="mt-5">
            <p className="text-base font-extrabold text-sky-950">
              Export note
            </p>
            <p className="mt-2 text-base sm:text-lg text-slate-700">
              If you hear the last symbol cut off, increase tail padding or
              release time. If you hear a click, increase attack slightly.
            </p>
          </div>
        </div>

        <div
          id="troubleshooting"
          className="rounded-xl bg-[#fffdf8] p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            Troubleshooting
          </h3>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              <strong>Audio is silent:</strong> unmute your device, raise
              volume, and try a different waveform. If you use Bluetooth,
              reconnect and retry.
            </li>
            <li>
              <strong>Clicks on symbols:</strong> increase attack and release,
              or switch from square or sawtooth to sine or triangle.
            </li>
            <li>
              <strong>Timing feels slow between letters:</strong> reduce
              Farnsworth spacing first, then reduce character speed if needed.
            </li>
            <li>
              <strong>Export sounds clipped in an editor:</strong> add tail
              padding or increase release.
            </li>
            <li>
              <strong>Export is large:</strong> reduce sample rate or shorten
              long messages. WAV is uncompressed by design.
            </li>
            <li>
              <strong>Export differs from live playback:</strong> offline export
              is deterministic. If your live playback stutters, close other tabs
              or lower the message length, then rely on the exported WAV for
              consistent results.
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 rounded-xl bg-[#fffdf8] p-5 sm:p-7">
        <h3 className="text-xl sm:text-2xl font-extrabold text-sky-950">
          Quick reference
        </h3>

        <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg text-slate-700">
          <li>
            <strong>What this tool does:</strong> Converts Morse patterns into
            playable audio using standard timing units.
          </li>
          <li>
            <strong>Timing units:</strong> dit = 1 unit, dah = 3 units; letter
            gap = 3 units; word gap = 7 units.
          </li>
          <li>
            <strong>Speed:</strong> Character speed (WPM) sets the unit length;
            Farnsworth stretches gaps only.
          </li>
          <li>
            <strong>Sound shaping:</strong> Waveform and attack/release change
            tone quality, not timing.
          </li>
          <li>
            <strong>Export:</strong> WAV export is offline-rendered so spacing
            and symbol timing are preserved.
          </li>
        </ul>
      </div>
    </section>
  );
}



