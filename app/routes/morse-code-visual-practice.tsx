import * as React from "react";
import type { Route } from "./+types/morse-code-visual-practice";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import StrobeWarning, {
  FlashEffectsDisabledNotice,
} from "~/client/components/shared/StrobeWarning";
import ToolHowItWorks from "~/client/components/shared/ToolHowItWorks";
import { toolControlButtonClass } from "~/client/components/shared/ToolWorkspace";
import { useDisplaySettings } from "~/client/settings/displaySettings";
import { morseVisualEvents } from "~/client/components/shared/playMorsePattern";
import styles from "~/client/components/shared/pageStyles";
import { textToMorse } from "~/client/components/shared/morseUtils";
import {
  LightBulbIcon,
  VisibilityIcon,
  VisibilityOffIcon,
} from "~/client/assets/svg/Icons";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";

const CANONICAL_PATH = "/morse-code-visual-practice";
const STROBE_WARNING_ID = "visual-practice-strobe-warning";
const FLASH_DISABLED_NOTICE_ID = "visual-practice-flash-disabled";

const faqItems = [
  {
    q: "What does visual Morse practice train?",
    a: "Visual practice trains dot-dash recognition by sight. It shows Morse as timed flashes so you can practice pattern recall without relying on sound.",
  },
  {
    q: "Is visual practice enough to learn Morse?",
    a: "No. Visual practice helps with pattern recognition, but learners should also practice by sound because Morse is usually copied by rhythm.",
  },
  {
    q: "Should I also practice Morse by sound?",
    a: "Yes. Move to audio practice once visual patterns are familiar so you build listening recall and not only visual memory.",
  },
  {
    q: "How is visual practice different from visual quiz?",
    a: "Visual practice is open-ended and lets you reveal the answer. Visual quiz hides prompts in a scored test.",
  },
  {
    q: "Is visual practice safe for light-sensitive users?",
    a: "Strobe warning: flashing light may be uncomfortable or unsafe for people with photosensitive epilepsy or light sensitivity. Turn off Flash or use audio-only practice if you are sensitive to strobing.",
  },
];

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Visual Practice | Dot-Dash Recognition Drills | MorseWords",
    description:
      "Practice visual Morse code recognition with dot-dash prompts, beginner tips, and links to typing, audio, and quiz tools.",
    path: CANONICAL_PATH,
    keywords:
      "visual morse code practice, flashing morse code, morse code light practice, morse code visual trainer",
  });
}

function useVisualPlayback(pattern: string, wpm: number, farnsworthWpm: number) {
  const [active, setActive] = React.useState(false);
  const timers = React.useRef<number[]>([]);

  React.useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const stop = React.useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setActive(false);
  }, []);

  const play = React.useCallback(() => {
    stop();
    let cursor = 0;
    for (const event of morseVisualEvents(pattern, wpm, farnsworthWpm)) {
      timers.current.push(window.setTimeout(() => setActive(event.on), cursor));
      cursor += event.ms;
    }
    timers.current.push(window.setTimeout(() => setActive(false), cursor + 80));
  }, [farnsworthWpm, pattern, stop, wpm]);

  return { active, play, stop };
}

export default function MorseCodeVisualPractice() {
  const { disableFlashEffects } = useDisplaySettings();
  const [message, setMessage] = React.useState("sos");
  const [wpm, setWpm] = React.useState(14);
  const [farnsworthWpm, setFarnsworthWpm] = React.useState(10);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [hasFlashed, setHasFlashed] = React.useState(false);
  const morse = React.useMemo(() => textToMorse(message), [message]);
  const { active, play, stop } = useVisualPlayback(morse, wpm, farnsworthWpm);

  React.useEffect(() => {
    if (!disableFlashEffects) return;
    stop();
    setHasFlashed(false);
  }, [disableFlashEffects, stop]);

  function flashMessage() {
    if (disableFlashEffects) return;
    setHasFlashed(true);
    play();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Visual Morse Code Practice",
    url: canonicalUrl(CANONICAL_PATH),
    applicationCategory: "EducationalApplication",
    description:
      "An open-ended visual Morse practice tool for flashing dot-dash prompts, reveal-based review, and timing adjustment.",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Visual Practice",
        item: canonicalUrl(CANONICAL_PATH),
      },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Visual practice"
          title="Morse Code Visual Practice"
          description="Practice recognizing dot-dash patterns by sight with short flash prompts, reveal-based review, and timing controls."
          aside={
            <DarkNote label="Flash mode" value={active ? "ON" : "READY"}>
              Use short messages at first. Visual Morse is easiest when the
              spacing is clean and the message is not too long.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/morse-code-visual-quiz", label: "Take visual quiz", primary: true },
              { href: "/morse-code-audio-practice", label: "Audio practice" },
              { href: "/morse-code-sos", label: "SOS signal" },
            ]}
          />
        </PageHero>

        <section className="mw-static-surface-soft mt-8 rounded-xl bg-[#fffaf2]/45 p-5 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-center">
            <div className="mw-static-panel flex flex-col items-center justify-center rounded-xl bg-[#fffdf8]/85 p-8">
              {disableFlashEffects ? (
                <FlashEffectsDisabledNotice
                  id={FLASH_DISABLED_NOTICE_ID}
                  className="mb-5 w-full"
                />
              ) : hasFlashed ? (
                <StrobeWarning id={STROBE_WARNING_ID} className="mb-5 w-full" />
              ) : null}
              <div
                role="img"
                className={
                  "h-44 w-44 rounded-full transition-all duration-75 " +
                  (active ? "bg-sky-200" : "bg-[#fffaf2]")
                }
                aria-label={active ? "Morse light on" : "Morse light off"}
              />
              <button
                type="button"
                onClick={flashMessage}
                disabled={disableFlashEffects}
                aria-describedby={
                  disableFlashEffects
                    ? FLASH_DISABLED_NOTICE_ID
                    : hasFlashed
                      ? STROBE_WARNING_ID
                      : undefined
                }
                className={`${toolControlButtonClass({
                  tone: "dark",
                  size: "lg",
                  full: true,
                  disabled: disableFlashEffects,
                })} mt-6`}
              >
                <LightBulbIcon size={20} title="Flash message" />
                Flash message
              </button>
            </div>

            <div>
              <label className="block">
                <span className="text-sm font-extrabold text-sky-950">Message</span>
                <input
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                    setShowAnswer(false);
                  }}
 className="mt-2 min-h-12 w-full rounded-xl bg-[#fffdf8] px-4 font-mono text-lg transition focus:outline-none focus:ring-0 focus-visible:outline-none"
                />
              </label>
              <div className="mt-5 grid gap-5">
                <SliderRow
                  label="Character speed"
                  value={wpm}
                  min={6}
                  max={30}
                  step={1}
                  unit="WPM"
                  onChange={setWpm}
                />
                <SliderRow
                  label="Farnsworth spacing"
                  value={farnsworthWpm}
                  min={5}
                  max={30}
                  step={1}
                  unit="WPM"
                  onChange={setFarnsworthWpm}
                  help="Slows spacing only."
                />
              </div>
              <button
                type="button"
                onClick={() => setShowAnswer((value) => !value)}
                className={`${toolControlButtonClass()} mt-5`}
              >
                {showAnswer ? (
                  <VisibilityOffIcon size={18} title="Hide answer" />
                ) : (
                  <VisibilityIcon size={18} title="Reveal answer" />
                )}
                {showAnswer ? "Hide answer" : "Reveal answer"}
              </button>
              {showAnswer ? (
                <p className="mt-4 font-mono text-lg font-bold tracking-[0.16em] text-slate-950">
                  {message.toUpperCase()} / {morse}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <ToolHowItWorks
          eyebrow="Visual practice spec"
          title="How this visual Morse practice tool works"
          description="Visual practice turns the Morse message into timed flashes. Character speed controls the flash lengths, and Farnsworth spacing stretches only the gaps so you have more time to recognize the next character."
          referenceLabel="Flash signal"
          referenceValue={active ? "ON" : "... --- ..."}
          referenceText="Use short messages first. Clean spacing matters as much as the flashes."
          chips={[
            { label: "Message", href: "#visual-practice-message" },
            { label: "Speed", href: "#visual-practice-speed" },
            { label: "Farnsworth", href: "#visual-practice-farnsworth" },
            { label: "Quiz next", href: "#visual-practice-quiz" },
          ]}
          summary={[
            {
              title: "Light-based copy",
              text: "The page uses the same dots, dashes, and gaps, but renders them as flashes.",
            },
            {
              title: "Stacked controls",
              text: "Speed and Farnsworth settings are kept vertical so each slider is easy to read.",
            },
            {
              title: "Answer reveal",
              text: "Reveal the message only after watching the full flash sequence.",
            },
          ]}
          details={[
            {
              kicker: "Prompt setup",
              title: "Message",
              text: "Type a short word, Q-code, or phrase. The tool converts it to Morse and flashes the signal with standard dot, dash, letter-gap, and word-gap timing.",
            },
            {
              kicker: "Flash length",
              title: "Speed",
              text: "Character speed controls how long each dit and dah stays on. Higher WPM means shorter flashes and a faster signal.",
            },
            {
              kicker: "Learner gaps",
              title: "Farnsworth",
              text: "Farnsworth spacing gives you more time between characters and words without changing the shape of each flashed character.",
              bullets: [
                "Use lower Farnsworth spacing for early practice.",
                "Raise it as visual recall improves.",
                "Keep messages short to avoid memory overload.",
              ],
            },
            {
              kicker: "Test mode",
              title: "Quiz next",
              text: "The visual quiz uses the same speed and Farnsworth controls, but hides the prompt and tracks score, attempts, accuracy, and streaks.",
            },
          ]}
        />

        <ReferenceSupportSections
          guide={{
            eyebrow: "Visual practice guide",
            title: "Use this page for sight-based Morse recall",
            description:
              "Visual practice turns Morse into flashes so you can rehearse dot-dash patterns without audio. It is useful for light-signal familiarity and visual memory work.",
            items: [
              {
                title: "Who it is for",
                text: "Learners who want to recognize Morse by sight before moving into a scored visual quiz or typing answers.",
              },
              {
                title: "What it trains",
                text: "Flash rhythm, visual pattern recognition, Farnsworth spacing, and answer reveal discipline.",
              },
              {
                title: "How to use it",
                text: "Enter a short message, flash it, watch the full sequence, then reveal only after trying to recall the pattern.",
              },
            ],
          }}
          examples={{
            title: "Visual practice scenarios",
            description:
              "Keep visual prompts short enough that the pattern is readable and not just a memory overload.",
            items: [
              {
                title: "A-Z recognition",
                morse: ".- / -... / -.-.",
                children:
                  "Practice short letter groups after reviewing the alphabet chart so visual recall is tied to known patterns.",
              },
              {
                title: "Short signal",
                morse: "... --- ...",
                children:
                  "SOS is compact and easy to recognize, so it works well for testing flash timing before longer prompts.",
              },
              {
                title: "Typed answer flow",
                morse: "FLASH -> TYPE",
                children:
                  "After watching the pattern, move into typing practice if the next weakness is entering the answer cleanly.",
              },
            ],
          }}
          mistakes={{
            title: "Common visual practice mistakes",
            description:
              "Visual practice works best as one part of a larger routine, not as the only Morse skill.",
            items: [
              {
                title: "Using long messages too soon",
                children:
                  "Long flash sequences are hard to hold in memory. Start with short words and signals.",
              },
              {
                title: "Relying only on sight",
                children:
                  "Visual recognition does not automatically become listening skill. Add audio practice once patterns are familiar.",
              },
              {
                title: "Ignoring light sensitivity",
                children:
                  "If flashing is uncomfortable, stop visual practice and use audio or text-based drills instead.",
              },
            ],
          }}
          comparison={{
            eyebrow: "Choose a practice mode",
            title: "Visual practice vs visual quiz and typing",
            description:
              "Use visual practice for open-ended pattern work. Use other modes when you need scoring or keyboard recall.",
            items: [
              {
                title: "Visual quiz",
                text: "Use visual quiz for scored flash recognition after practice feels steady.",
                href: "/morse-code-visual-quiz",
              },
              {
                title: "Typing practice",
                text: "Use typing practice when visual recall is fine but typed input needs accuracy.",
                href: "/typing",
              },
              {
                title: "Audio practice",
                text: "Use audio practice to build listening recall after visual recognition improves.",
                href: "/morse-code-audio-practice",
              },
            ],
          }}
          nextStep={{
            title: "Move from visual recognition into recall testing",
            description:
              "Once short flashes are readable, test visual recall or connect the same patterns to typing and audio practice.",
            links: [
              { href: "/morse-code-visual-quiz", label: "Visual quiz", primary: true },
              { href: "/typing", label: "Typing practice" },
              { href: "/morse-code-alphabet", label: "Alphabet chart" },
              { href: "/learn-morse-code", label: "Learning path" },
            ],
          }}
        />

        <SectionCard eyebrow="Visual flow" title="Practice flashes, then test recall">
          <ActionLinks
            links={[
              { href: "/morse-code-visual-quiz", label: "Visual quiz", primary: true },
              { href: "/morse-code-timing", label: "Timing guide" },
              { href: "/morse-code-printable-chart", label: "Print review" },
            ]}
          />
        </SectionCard>

        <FaqSectionGeneric title="Visual practice FAQ" items={faqItems} />

        <JsonLdScript jsonLd={[jsonLd, breadcrumbJsonLd, faqJsonLd]} />
      </main>
      <BreadcrumbTrail current="Morse Code Visual Practice" />
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  help,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  help?: string;
}) {
  const id = React.useId();

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-extrabold text-sky-950">
          {label}
        </label>
        <span className="text-sm text-slate-600">
          {value} {unit}
        </span>
      </div>
      {help ? <p className="mt-1 text-xs text-slate-500">{help}</p> : null}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ accentColor: "#38bdf8" }}
 className="mt-2 w-full cursor-pointer rounded-full focus:outline-none focus:ring-0 focus-visible:outline-none"
      />
    </div>
  );
}
