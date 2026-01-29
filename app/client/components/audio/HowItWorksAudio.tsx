import * as React from "react";

export default function HowItWorksAudio() {
  return (
    <section className="mt-8 bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1.5 text-sm font-extrabold text-sky-900 border border-sky-200">
            Audio spec
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b2447] tracking-tight">
          How this Morse code audio translator works
        </h2>

        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
          This page is audio-first. You type text to generate an{" "}
          <strong>International Morse</strong> pattern, and the tool turns that
          pattern into sound using standard timing rules. The preview Morse is
          here to keep the output predictable and copyable, but the main product
          is the audio you can play, loop, and export.
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
            className="px-3 py-1.5 rounded-full text-sm sm:text-base font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer transition"
          >
            {label}
          </a>
        ))}
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-base font-extrabold text-[#0b2447]">
            Symbols are units
          </p>
          <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
            Morse is built from a single time unit. A{" "}
            <strong>dit</strong> is 1 unit and a <strong>dah</strong> is 3 units.
          </p>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-base font-extrabold text-[#0b2447]">
            Speed sets dit length
          </p>
          <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
            Your <strong>character speed</strong> controls the dit duration. All
            other timings scale from that base.
          </p>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-base font-extrabold text-[#0b2447]">
            Export is offline-rendered
          </p>
          <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
            WAV export renders in an <strong>offline</strong> audio context so
            spacing stays consistent even if your device is busy.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <div id="units" className="rounded-2xl border border-gray-200 p-6 sm:p-7">
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b2447]">
            Timing units
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Morse timing is defined in units. The tool converts your message
            into dots and dashes, then schedules sound and silence using the
            unit rules below.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
              <p className="text-base sm:text-lg font-extrabold text-[#0b2447]">
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

            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
              <p className="text-base sm:text-lg font-extrabold text-[#0b2447]">
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
            <p className="text-base font-extrabold text-gray-800">Example</p>
            <pre className="mt-3 whitespace-pre-wrap rounded-2xl border border-gray-200 bg-gray-50 p-4 text-base sm:text-lg font-mono overflow-x-auto">
              {`S O S
...   ---   ...
(dit dit dit)   (dah dah dah)   (dit dit dit)`}
            </pre>
            <p className="mt-3 text-base sm:text-lg text-gray-600">
              The spaces in the Morse preview are the same boundaries the audio
              scheduler uses for letter and word gaps.
            </p>
          </div>
        </div>

        <div id="wpm" className="rounded-2xl border border-gray-200 p-6 sm:p-7">
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b2447]">
            Speed and WPM
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Speed is usually described as words per minute (WPM) using the word{" "}
            <strong>PARIS</strong> as a timing reference. A common shortcut is:
          </p>

          <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-gray-200 bg-gray-50 p-4 text-base sm:text-lg font-mono overflow-x-auto">
            {`dit(ms) = 1200 / WPM
dah(ms) = 3 * dit(ms)`}
          </pre>

          <p className="mt-4 text-base sm:text-lg">
            Example: at 20 WPM, a dit is 60 ms and a dah is 180 ms. The tool
            uses your chosen character speed to compute the unit duration, then
            schedules every symbol and gap from that.
          </p>

          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-base font-extrabold text-gray-800">
              Why audio can click
            </p>
            <p className="mt-2 text-base sm:text-lg">
              Sudden starts and stops can produce clicks, especially with
              square and sawtooth waveforms. Use <strong>attack</strong> and{" "}
              <strong>release</strong> to soften edges without changing the
              timing grid.
            </p>
          </div>
        </div>

        <div
          id="farnsworth"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b2447]">
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
            <p className="text-base font-extrabold text-gray-800">Tip</p>
            <p className="mt-2 text-base sm:text-lg text-gray-700">
              If characters feel readable but words blur together, increase word
              spacing slightly before slowing down character speed.
            </p>
          </div>
        </div>

        <div id="sound" className="rounded-2xl border border-gray-200 p-6 sm:p-7">
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b2447]">
            Sound settings
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            The audio generator can produce classic CW tones and more stylized
            sounds. Waveform and envelope settings change the feel of the signal
            without changing the timing rules.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
              <p className="text-base sm:text-lg font-extrabold text-[#0b2447]">
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

            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
              <p className="text-base sm:text-lg font-extrabold text-[#0b2447]">
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

          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-base font-extrabold text-gray-800">
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
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b2447]">
            Audio export
          </h3>

          <p className="mt-4 text-base sm:text-lg">
            Export creates a standard PCM WAV. The tool renders the full signal
            in an <strong>OfflineAudioContext</strong>, then writes a WAV header
            and samples into a Blob for download.
          </p>

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
            <p className="text-base font-extrabold text-gray-800">Export note</p>
            <p className="mt-2 text-base sm:text-lg text-gray-700">
              If you hear the last symbol cut off, increase tail padding or
              release time. If you hear a click, increase attack slightly.
            </p>
          </div>
        </div>

        <div
          id="troubleshooting"
          className="rounded-2xl border border-gray-200 p-6 sm:p-7"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b2447]">
            Troubleshooting
          </h3>

          <ul className="mt-4 list-disc pl-6 space-y-3 text-base sm:text-lg">
            <li>
              <strong>Audio is silent:</strong> unmute your device, raise volume,
              and try a different waveform. If you use Bluetooth, reconnect and
              retry.
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
          </ul>
        </div>
      </div>
    </section>
  );
}
