import * as React from "react";

import {
  CopyIcon,
  PauseIcon,
  PlayIcon,
  SaveIcon,
  StopIcon,
} from "~/client/assets/svg/Icons";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import styles from "~/client/components/shared/pageStyles";
import useAudio from "~/client/components/shared/useAudio";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-sos";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);
const SOS_MORSE = "... --- ...";
const SOS_CONTINUOUS = "...---...";

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta() {
  return seoMeta({
    title: "SOS in Morse Code - Sound, Meaning & Distress Signal",
    description:
      "See SOS in Morse code, play the distress signal, copy the dots and dashes, and learn why SOS does not officially stand for Save Our Souls.",
    path: CANONICAL_PATH,
    keywords:
      "sos in morse code, sos morse code, what is sos in morse code, sos distress signal, save our souls morse code, morse code sos sound",
  });
}

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

function SignalBlock() {
  const player = useAudio();
  const [copied, setCopied] = React.useState(false);
  const [flash, setFlash] = React.useState(false);
  const [wpm, setWpm] = React.useState(15);

  const play = async () => {
    await player.play({
      code: SOS_MORSE,
      wpm,
      farnsworthWpm: wpm,
      hz: 600,
      volume: 0.75,
      soundEnabled: true,
      preset: "cw_radio",
      repeat: false,
      flash,
    });
  };

  const saveAudio = async () => {
    const blob = await player.renderWav({
      code: SOS_MORSE,
      wpm,
      farnsworthWpm: wpm,
      hz: 600,
      volume: 0.75,
      soundEnabled: true,
      preset: "cw_radio",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sos-morse-code.wav";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="m-0 text-sm font-extrabold uppercase tracking-wide text-sky-800">
            Interactive SOS translator
          </p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
            SOS in Morse Code
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
            SOS is written as three dots, three dashes, and three dots:
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { label: "S", marks: ["dot", "dot", "dot"] },
              { label: "O", marks: ["dash", "dash", "dash"] },
              { label: "S", marks: ["dot", "dot", "dot"] },
            ].map((group, index) => (
              <div
                key={`${group.label}-${index}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center"
              >
                <div className="text-4xl font-black text-sky-800">
                  {group.label}
                </div>
                <div className="mt-4 flex min-h-8 items-center justify-center gap-2">
                  {group.marks.map((mark, markIndex) => (
                    <span
                      key={`${mark}-${markIndex}`}
                      className={
                        mark === "dot"
                          ? "h-5 w-5 rounded bg-neutral-900"
                          : "h-5 w-14 rounded bg-neutral-900"
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl bg-sky-50 p-4">
            <div className="text-sm font-bold text-slate-600">
              Copy-ready Morse
            </div>
            <code className="mt-1 block break-words text-2xl font-black text-slate-950">
              {SOS_MORSE}
            </code>
            <div className="mt-2 text-sm text-slate-600">
              Continuous distress prosign form:{" "}
              <code className="font-black">{SOS_CONTINUOUS}</code>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => {
                if (player.state === "playing") player.pause();
                else if (player.state === "paused") player.resume();
                else play();
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 font-extrabold text-sky-200 transition hover:bg-neutral-800 hover:text-white"
            >
              {player.state === "playing" ? (
                <PauseIcon size={22} title="Pause SOS" />
              ) : (
                <PlayIcon size={22} title="Play SOS" />
              )}
              {player.state === "playing"
                ? "Pause SOS"
                : player.state === "paused"
                  ? "Resume SOS"
                  : "Play SOS"}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={player.stop}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 font-bold text-slate-800 transition hover:bg-slate-100"
              >
                <StopIcon size={18} title="Stop SOS" />
                Stop
              </button>
              <button
                type="button"
                onClick={saveAudio}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 font-bold text-slate-800 transition hover:bg-slate-100"
              >
                <SaveIcon size={18} title="Save SOS audio" />
                Save
              </button>
            </div>

            <button
              type="button"
              onClick={async () => {
                await copyText(SOS_MORSE);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1000);
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 font-bold text-slate-800 transition hover:bg-slate-100"
            >
              <CopyIcon size={18} title="Copy SOS Morse" />
              {copied ? "Copied" : "Copy SOS"}
            </button>

            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Speed: {wpm} WPM
              <input
                type="range"
                min={8}
                max={30}
                value={wpm}
                onChange={(event) => setWpm(Number(event.target.value))}
                className="cursor-pointer"
                style={{ accentColor: "#38bdf8" }}
              />
            </label>

            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                checked={flash}
                onChange={(event) => setFlash(event.target.checked)}
              />
              Flash screen while playing
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="m-0 text-2xl font-black text-sky-800">{title}</h2>
      <div className="mt-3 leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}

export default function MorseCodeSos() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "SOS in Morse Code",
    url: CANONICAL_URL,
    description:
      "Interactive guide to SOS in Morse code with audio playback, copy-ready dots and dashes, and plain-English history of the distress signal.",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
    about: [
      { "@type": "Thing", name: "SOS distress signal" },
      { "@type": "Thing", name: "International Morse code" },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is SOS in Morse code?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SOS in Morse code is three dots, three dashes, and three dots: ... --- ... . As a distress prosign it may be sent as a continuous sequence without normal letter gaps.",
        },
      },
      {
        "@type": "Question",
        name: "Does SOS stand for Save Our Souls?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Save Our Souls and Save Our Ship are common memory phrases, but SOS was chosen as a simple, recognizable Morse distress signal rather than as an acronym.",
        },
      },
    ],
  };

  return (
    <div style={styles.page}>
      <main style={styles.wrap}>
        <div className="grid gap-5 py-4">
          <SignalBlock />

          <InfoCard title="What does SOS sound like?">
            <p>
              SOS sounds like three short signals, three long signals, and three
              short signals. Written as ordinary Morse letters it appears as{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5 font-bold">
                ... --- ...
              </code>
              . In formal distress use, operators often think of it as one
              continuous prosign pattern rather than three separate letters.
            </p>
          </InfoCard>

          <InfoCard title="Does SOS mean Save Our Souls?">
            <p>
              No. "Save Our Souls" and "Save Our Ship" are popular memory
              phrases, but SOS is not officially an acronym. The signal became
              famous because the pattern is short, symmetrical, and easy to
              recognize under stress.
            </p>
          </InfoCard>

          <InfoCard title="Why was SOS chosen?">
            <p>
              The practical reason is speed and clarity. Three dots, three
              dashes, and three dots can be sent by radio, light, tapping, or
              sound, and the shape is hard to confuse with ordinary text. The
              signal was introduced in early twentieth-century radio rules and
              became the internationally recognized Morse distress signal.
            </p>
          </InfoCard>

          <InfoCard title="How to send SOS">
            <ul className="m-0 grid gap-2 pl-5">
              <li>By sound: three short beeps, three long beeps, three short beeps.</li>
              <li>By light: three short flashes, three long flashes, three short flashes.</li>
              <li>By writing: use SOS or the Morse pattern ... --- ... .</li>
              <li>By tapping: three quick taps, three longer taps, three quick taps.</li>
            </ul>
          </InfoCard>

          <InfoCard title="SOS FAQ">
            <div className="grid gap-4">
              <article>
                <h3 className="m-0 text-lg font-black text-slate-950">
                  Is SOS the same as sending the letters S, O, S?
                </h3>
                <p className="mt-1">
                  For everyday learning, yes, the pattern matches S O S. For
                  distress signaling, it is commonly described as one continuous
                  signal with no normal letter spacing.
                </p>
              </article>
              <article>
                <h3 className="m-0 text-lg font-black text-slate-950">
                  Can I use SOS with a flashlight?
                </h3>
                <p className="mt-1">
                  Yes. The same short-short-short, long-long-long,
                  short-short-short rhythm can be sent with light, sound, or
                  tapping.
                </p>
              </article>
            </div>
          </InfoCard>
        </div>

        <JsonLdScript jsonLd={jsonLd} />
        <JsonLdScript jsonLd={faqJsonLd} />
      </main>
    </div>
  );
}
