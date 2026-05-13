import type { Route } from "./+types/morse-code-test";

import {
  CheckCircleIcon,
  HeadphonesIcon,
  KeyboardIcon,
  LightBulbIcon,
  ListIcon,
  PlayIcon,
  SoundIcon,
} from "~/client/assets/svg/Icons";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
  SimpleGrid,
} from "~/client/components/shared/MorseLearningLayout";
import StrobeWarning from "~/client/components/shared/StrobeWarning";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-test";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

const testChooserItems = [
  {
    title: "Listening test",
    href: "/morse-code-audio-quiz",
    badge: "Receive",
    icon: <HeadphonesIcon size={20} title="Listening test" />,
    text:
      "Tests whether you can hear Morse and identify characters, words, or short prompts without seeing the answer first.",
    bestFor: "Best for receive practice.",
  },
  {
    title: "Audio practice",
    href: "/morse-code-audio-practice",
    badge: "Build",
    icon: <SoundIcon size={20} title="Audio practice" />,
    text:
      "Use this before or between tests when you need repetition, answer reveals, and timing control instead of a fixed score.",
    bestFor: "Best for building sound recognition.",
  },
  {
    title: "Typing test",
    href: "/typing",
    badge: "Copy",
    icon: <KeyboardIcon size={20} title="Typing test" />,
    text:
      "Checks typed copying flow, spacing, and accuracy. It uses typing language without treating keyboard entry as on-air sending.",
    bestFor: "Best for typing and copy rhythm.",
  },
  {
    title: "Visual test",
    href: "/morse-code-visual-quiz",
    badge: "Flash",
    icon: <LightBulbIcon size={20} title="Visual test" />,
    text:
      "Tests recognition from flashes and visual signals, separate from listening skill.",
    bestFor: "Best for sight-based dot-dash recognition.",
    warning: true,
  },
  {
    title: "General practice",
    href: "/practice",
    badge: "Warm up",
    icon: <CheckCircleIcon size={20} title="General practice" />,
    text:
      "Helps you warm up, choose pools, and review letters, numbers, signals, words, and sentences before a test run.",
    bestFor: "Best for mixed recall practice.",
  },
  {
    title: "Word trainer",
    href: "/morse-code-word-trainer",
    badge: "Weak spots",
    icon: <ListIcon size={20} title="Word trainer" />,
    text:
      "Helps with weak words and repeated recognition misses, especially when the same prompts keep slowing you down.",
    bestFor: "Best for word-level review.",
  },
  {
    title: "Practice plan",
    href: "/morse-code-practice-plan",
    badge: "Next step",
    icon: <PlayIcon size={20} title="Practice plan" />,
    text:
      "Helps you decide what to work on next after a test, including short routines for listening, typing, and review.",
    bestFor: "Best when you need a routine.",
  },
];

const decisionItems = [
  {
    title: "If you are new",
    text: "Start with general practice or audio practice before taking a scored quiz.",
    href: "/practice",
    badge: "Start",
  },
  {
    title: "If you want receive practice",
    text: "Use the audio quiz when you want a test-like check of listening recall.",
    href: "/morse-code-audio-quiz",
    badge: "Listen",
  },
  {
    title: "If you want typing or copying flow",
    text: "Use typing practice to see whether spacing and entry stay clean under time.",
    href: "/typing",
    badge: "Copy",
  },
  {
    title: "If you want visual or flash practice",
    text: "Use the visual quiz for sight-based recognition, then return to visual practice for misses.",
    href: "/morse-code-visual-quiz",
    badge: "Visual",
  },
  {
    title: "If the same words keep failing",
    text: "Use the word trainer so weak words repeat intentionally instead of disappearing into a mixed drill.",
    href: "/morse-code-word-trainer",
    badge: "Words",
  },
  {
    title: "If you are not sure what to do next",
    text: "Use the practice plan to turn your last result into a short next session.",
    href: "/morse-code-practice-plan",
    badge: "Plan",
  },
];

const howItWorksItems = [
  {
    title: "Choose the test type",
    text: "Pick listening, typing, visual, general practice, word review, or a plan based on what you need to assess today.",
  },
  {
    title: "Run the tool",
    text: "Use the existing MorseWords page for that mode so results come from the actual practice or quiz flow.",
  },
  {
    title: "Review the result",
    text: "Look at accuracy, missed prompts, repeated weak spots, spacing, and speed where the tool exposes it.",
  },
  {
    title: "Choose the next step",
    text: "Repeat practice, drop the difficulty, review weak words, or build a practice plan instead of retesting blindly.",
  },
];

const testTypeItems = [
  {
    title: "Listening",
    text: "Measures whether the sound pattern is recognizable by ear. This is the best test for receive practice.",
    href: "/morse-code-audio-quiz",
    badge: "Audio",
  },
  {
    title: "Typing and copying",
    text: "Measures whether you can enter copied Morse cleanly, keep separators readable, and avoid rushing the keyboard flow.",
    href: "/typing",
    badge: "Typing",
  },
  {
    title: "Visual",
    text: "Measures sight-based recognition from flashes and visual signals. It does not prove listening recall by itself.",
    href: "/morse-code-visual-quiz",
    badge: "Flash",
  },
  {
    title: "General practice",
    text: "Measures mixed recall across chosen pools and gives a quick warm-up before a more specific assessment.",
    href: "/practice",
    badge: "Drill",
  },
  {
    title: "Word and weak-area review",
    text: "Measures whether repeated words are improving instead of only testing the full alphabet again.",
    href: "/morse-code-word-trainer",
    badge: "Words",
  },
];

const pathItems = [
  {
    title: "Beginner path",
    text:
      "Use the alphabet and numbers references, warm up in general practice, then try audio practice before a quiz.",
    href: "/morse-code-alphabet",
    badge: "Beginner",
  },
  {
    title: "Improving accuracy path",
    text:
      "Keep the set small. Repeat missed characters in practice and move weak words into the word trainer.",
    href: "/morse-code-word-trainer",
    badge: "Accuracy",
  },
  {
    title: "Speed-focused path",
    text:
      "Use typing and audio tools to watch pace and accuracy where supported. Raise speed only after misses stay low.",
    href: "/typing",
    badge: "Speed",
  },
  {
    title: "Weak-spot review path",
    text:
      "Look for repeated errors first, then use a plan so the next session targets the exact problem.",
    href: "/morse-code-practice-plan",
    badge: "Review",
  },
];

const resultItems = [
  {
    title: "Accuracy",
    text:
      "A high score matters only when the prompt type matches the skill you meant to test.",
  },
  {
    title: "Missed characters and words",
    text:
      "List repeats. If B, D, G, Q, or a few words keep failing, build a smaller review set.",
  },
  {
    title: "Speed or WPM when available",
    text:
      "Use WPM and timing values as context, not as a final skill label. Accuracy still comes first.",
  },
  {
    title: "Consistency",
    text:
      "A single test result should not be treated as your final skill level. Run short sessions over time.",
  },
  {
    title: "Spacing mistakes",
    text:
      "Separate sound recognition from spacing, typing, and rushing so the next drill fixes the real issue.",
  },
];

const mistakeItems = [
  {
    title: "Starting too fast",
    text:
      "Speed can hide recognition problems. Slow down or add Farnsworth spacing until answers are clean.",
  },
  {
    title: "Memorizing only dots and dashes",
    text:
      "Visual memory helps early, but listening tests depend on sound and rhythm.",
  },
  {
    title: "Ignoring spacing",
    text:
      "Letter gaps and word gaps can turn a correct pattern into confusing output.",
  },
  {
    title: "Testing only one mode",
    text:
      "Listening, typing, and visual recognition are related but not identical skills.",
  },
  {
    title: "Treating one bad run as failure",
    text:
      "One rough run usually means the next practice target is clearer, not that the whole skill is broken.",
  },
];

const faqItems = [
  {
    q: "What is the best Morse code test for beginners?",
    a:
      "Most beginners should start with general practice or audio practice, then take the audio quiz only after the prompt set feels familiar.",
  },
  {
    q: "Does this page run one official Morse code test?",
    a:
      "No. This page is an assessment hub that routes you to existing MorseWords tools. It is not an official licensing exam or certification test.",
  },
  {
    q: "Which test checks Morse listening skill?",
    a:
      "Use the Morse code audio quiz for a scored listening check, or audio practice when you need repetition before another test run.",
  },
  {
    q: "Which test checks typing or copying speed?",
    a:
      "Use the typing page for keyboard-based copying flow and accuracy. It can help you watch speed-related output, but it is not presented as an on-air sending exam.",
  },
  {
    q: "Should I use the visual quiz for audio Morse skill?",
    a:
      "No. The visual quiz checks flash and sight recognition. Use audio practice or the audio quiz when you want to assess receive skill by ear.",
  },
  {
    q: "How should I use a bad Morse test result?",
    a:
      "Look for the cause before retesting. Misses may come from sound recognition, spacing, typing flow, weak words, or rushing.",
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Test | Listening, Typing, Visual, and Speed Practice | MorseWords",
    description:
      "Choose a Morse listening test, typing test, visual quiz, practice plan, and review path while tracking accuracy, weak spots, and speed where supported.",
    path: CANONICAL_PATH,
    keywords:
      "morse code test, morse code practice test, morse listening test, morse typing test, morse code speed practice",
  });
}

export default function MorseCodeTestRoute() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Morse Code Test",
    url: CANONICAL_URL,
    description:
      "A MorseWords assessment hub for choosing listening, typing, visual, practice, word trainer, and practice-plan flows.",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: testChooserItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: canonicalUrl(item.href),
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Test",
        item: CANONICAL_URL,
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
          eyebrow="Assessment hub"
          title="Morse Code Test"
          description="Choose the right Morse test for listening, typing, visual recognition, speed-focused practice, and weak-spot review without duplicating the existing practice tools."
          aside={
            <DarkNote label="What this page does" value="Choose + test">
              This is a test-routing hub, not an official licensing exam. Use it
              to pick the right assessment, then review what the result actually
              measured.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              {
                href: "/morse-code-audio-quiz",
                label: "Start listening test",
                primary: true,
                icon: <HeadphonesIcon size={18} title={undefined} aria-hidden="true" />,
              },
              {
                href: "/typing",
                label: "Start typing test",
                icon: <KeyboardIcon size={18} title={undefined} aria-hidden="true" />,
              },
              {
                href: "/morse-code-visual-quiz",
                label: "Start visual test",
                icon: <LightBulbIcon size={18} title={undefined} aria-hidden="true" />,
              },
              {
                href: "/practice",
                label: "Start general practice",
                icon: <CheckCircleIcon size={18} title={undefined} aria-hidden="true" />,
              },
              {
                href: "/morse-code-practice-plan",
                label: "Build a practice plan",
                icon: <ListIcon size={18} title={undefined} aria-hidden="true" />,
              },
            ]}
          />
        </PageHero>

        <section
          data-testid="morse-test-chooser"
          className="mt-8"
          aria-labelledby="morse-test-chooser-heading"
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(260px,0.28fr)] lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="mw-eyebrow-line h-px w-8 bg-sky-800" />
                <span className="mw-eyebrow-text font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
                  Choose a test
                </span>
              </div>
              <h2
                id="morse-test-chooser-heading"
                className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
              >
                Choose the right Morse code test
              </h2>
              <p className="mw-text-muted mt-3 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
                Start with the skill you want to measure. A listening miss, a
                typing miss, and a spacing miss point to different next drills.
              </p>
            </div>
            <DarkNote label="Result rule" value="Measure one thing">
              Pick one mode per run so you can tell whether mistakes came from
              sound recognition, visual recall, spacing, typing, or rushing.
            </DarkNote>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {testChooserItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="mw-button-outline mw-light-interactive-link mw-surface-card group flex min-h-[190px] cursor-pointer flex-col rounded-xl p-4 text-slate-700 no-underline sm:p-5"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span className="mw-link text-sky-900">{item.icon}</span>
                    <span className="mw-heading text-lg font-extrabold leading-snug text-sky-950">
                      {item.title}
                    </span>
                  </span>
                  <span className="mw-related-badge mw-muted-label shrink-0 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                    {item.badge}
                  </span>
                </span>
                <span className="mw-text-muted mt-3 block text-base leading-relaxed text-slate-700">
                  {item.text}
                </span>
                <span className="mw-text-soft mt-3 block text-sm font-semibold text-slate-600">
                  {item.bestFor}
                </span>
                {"warning" in item && item.warning ? (
                  <span className="mw-text-soft mt-3 block text-sm leading-relaxed text-slate-600">
                    Visual quiz uses flashing light. Use audio-only practice if
                    flashing is uncomfortable or unsafe for you.
                  </span>
                ) : null}
              </a>
            ))}
          </div>
        </section>

        <SectionCard
          eyebrow="Decision guide"
          title="Which Morse test should I choose?"
          description="A useful test starts with a clear question. Choose the path that matches the skill you want to check right now."
        >
          <SimpleGrid items={decisionItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Assessment loop"
          title="How the Morse code test hub works"
          description="This page does not duplicate the practice tools. It helps you choose one, read the result, and move to the next useful session."
          layout="stacked"
        >
          <div className="grid gap-x-12 gap-y-9 md:grid-cols-2 xl:grid-cols-4">
            {howItWorksItems.map((item, index) => (
              <article className="min-w-0 py-1" key={item.title}>
                <p className="mw-muted-label font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Step {index + 1}
                </p>
                <h3 className="mw-heading mt-2 text-xl font-extrabold text-sky-950">
                  {item.title}
                </h3>
                <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Test types"
          title="Test types explained"
          description="Each page measures a different part of Morse skill. Use the distinction to avoid retesting the wrong thing."
        >
          <SimpleGrid items={testTypeItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Recommendations"
          title="Beginner and intermediate paths"
          description="Move from reference to practice to a focused test, then back into review. Short repeatable loops are more useful than one long assessment."
        >
          <SimpleGrid items={pathItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Results"
          title="How to read your results"
          description="A single test result is a snapshot, not a final skill level. Use it to find the next drill."
          aside={
            <DarkNote label="Watch for" value="Pattern of misses">
              Notice whether errors come from sound recognition, spacing,
              typing, weak words, or rushing before choosing another test.
            </DarkNote>
          }
        >
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
            {resultItems.map((item) => (
              <article className="min-w-0 py-1" key={item.title}>
                <h3 className="mw-heading text-xl font-extrabold text-sky-950">
                  {item.title}
                </h3>
                <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Speed"
          title="Morse WPM and speed notes"
          description="Speed is useful only when you know what the page actually measures."
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
              <p className="mw-text-muted">
                Morse speed is often measured in words per minute. Timing
                references commonly use a standard word such as PARIS so
                different runs can be compared more consistently.
              </p>
              <p className="mw-text-muted">
                MorseWords does not claim this page is a formal WPM speed test.
                Use the typing and audio tools to track speed and accuracy
                where those pages support timing, then compare similar runs
                rather than treating one score as final.
              </p>
              <p className="mw-text-muted">
                If speed rises while accuracy drops, the result is telling you
                to practice recognition, spacing, or weak words before raising
                WPM again.
              </p>
            </div>
            <aside className="min-w-0 lg:pl-4">
              <h3 className="mw-heading text-xl font-extrabold text-sky-950">
                Speed practice links
              </h3>
              <ActionLinks
                className="mt-4"
                layout="grid"
                links={[
                  { href: "/typing", label: "Typing flow", primary: true },
                  { href: "/morse-code-audio-practice", label: "Audio timing" },
                  { href: "/audio", label: "Audio generator" },
                  { href: "/morse-code-word-separator", label: "Spacing guide" },
                ]}
              />
            </aside>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Use it well"
          title="Common Morse test mistakes"
          description="Most bad results become useful once you know what caused them."
          layout="stacked"
        >
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 xl:grid-cols-5">
            {mistakeItems.map((item) => (
              <article className="min-w-0 py-1" key={item.title}>
                <h3 className="mw-heading text-lg font-extrabold leading-snug text-sky-950">
                  {item.title}
                </h3>
                <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Reference before testing"
          title="Quick references for cleaner test runs"
          description="Use these only when you need a short reference check before starting a real assessment."
        >
          <SimpleGrid
            linkedItemStyle="inline"
            items={[
              {
                title: "Morse code alphabet",
                text: "Review A-Z patterns before a beginner practice run.",
                href: "/morse-code-alphabet",
                badge: "A-Z",
              },
              {
                title: "Morse code numbers",
                text: "Check 0-9 patterns before number prompts or mixed drills.",
                href: "/morse-code-numbers",
                badge: "0-9",
              },
              {
                title: "Visual practice",
                text: "Use open-ended flash practice before taking the scored visual quiz.",
                href: "/morse-code-visual-practice",
                badge: "Flash",
              },
              {
                title: "Word separator",
                text: "Fix letter gaps, word gaps, and slash separators before reading a test result.",
                href: "/morse-code-word-separator",
                badge: "Spacing",
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          eyebrow="Safety note"
          title="Visual tests use flashing light"
          description="The visual quiz includes flash-based prompts, so treat it as a separate mode from audio testing."
        >
          <StrobeWarning />
        </SectionCard>

        <div id="faq">
          <FaqSectionGeneric
            title="Morse code test FAQ"
            description="Use these answers to pick a test without overreading one result."
            items={faqItems}
          />
        </div>

        <JsonLdScript jsonLd={[collectionJsonLd, breadcrumbJsonLd, faqJsonLd]} />
      </main>
      <BreadcrumbTrail current="Morse Code Test" placement="pageBottom" />
    </div>
  );
}
