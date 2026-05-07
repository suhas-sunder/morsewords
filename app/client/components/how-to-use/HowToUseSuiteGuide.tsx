import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
  SimpleGrid,
} from "~/client/components/shared/MorseLearningLayout";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";

export default function HowToUseSuiteGuide() {
  return (
    <>
      <PageHero
        eyebrow="Toolkit guide"
        title="How to Use MorseWords"
        description="Choose the right MorseWords page for the job: translate, decode, hear, practice, type, print, or look up Morse code without guessing which tool comes next."
        aside={
          <DarkNote label="Fast start" value="JOB -> TOOL">
            Start with what you have: plain text, dots and dashes, a sound
            practice goal, or a printable classroom task.
          </DarkNote>
        }
      >
        <ActionLinks
          links={[
            { href: "/", label: "Translate text", primary: true },
            { href: "/morse-code-decoder", label: "Decode Morse" },
            { href: "/audio", label: "Hear Morse" },
            { href: "/practice", label: "Practice" },
          ]}
        />
      </PageHero>

      <SectionCard
        eyebrow="Choose by task"
        title="Open the page that matches your input"
        description="MorseWords works best when you start from the problem in front of you. These are the common routes through the toolkit."
      >
        <SimpleGrid
          items={[
            {
              title: "I have normal text",
              text: "Use the main translator or encoder to turn words into dots and dashes, then copy or play the result.",
              href: "/morse-code-encoder",
              badge: "Encode",
            },
            {
              title: "I have dots and dashes",
              text: "Use the decoder when the Morse has clear spacing. Use the word separator first if the gaps are confusing.",
              href: "/morse-code-decoder",
              badge: "Decode",
            },
            {
              title: "I want to hear it",
              text: "Use the audio page for full messages and the sound generator when tone, beep shape, or practice sound is the focus.",
              href: "/audio",
              badge: "Audio",
            },
            {
              title: "I want to learn",
              text: "Use the learning guide for the path, then move into a practice plan, drills, typing, and audio practice.",
              href: "/learn-morse-code",
              badge: "Learn",
            },
            {
              title: "I need a lookup",
              text: "Use the dictionary for quick entries, the alphabet page for A-Z learning, and the international reference for the broader supported set.",
              href: "/dictionary",
              badge: "Lookup",
            },
            {
              title: "I need printables",
              text: "Use the printable chart for reference sheets and the word search builder for classroom or practice handouts.",
              href: "/morse-code-printable-chart",
              badge: "Print",
            },
          ]}
        />
      </SectionCard>

      <ReferenceSupportSections
        guide={{
          eyebrow: "Workflow guide",
          title: "What this page helps you do",
          description:
            "Use this page as a product-use guide. It explains which MorseWords page to open first, what each page is best for, and when to switch.",
          items: [
            {
              title: "Translate and copy",
              text: "Use the translator or encoder when your starting point is normal text and your goal is a clean Morse output.",
              href: "/",
              badge: "Text",
            },
            {
              title: "Decode and fix spacing",
              text: "Use the decoder for readable Morse input. Use the word separator when missing gaps are the reason decoding fails.",
              href: "/morse-code-word-separator",
              badge: "Spaces",
            },
            {
              title: "Listen and practice",
              text: "Use audio tools when you need to hear Morse, then move into practice or quiz pages for feedback.",
              href: "/morse-code-audio-practice",
              badge: "Listen",
            },
          ],
        }}
        examples={{
          title: "Three common MorseWords workflows",
          description:
            "These examples show when to move between tools instead of forcing one page to solve every problem.",
          items: [
            {
              title: "Text to audio",
              morse: "HELLO -> .... . .-.. .-.. ---",
              children: (
                <p>
                  Convert the message with the{" "}
                  <a
                    href="/"
                    className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                  >
                    main translator
                  </a>
                  , then open{" "}
                  <a
                    href="/audio"
                    className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                  >
                    audio
                  </a>{" "}
                  to hear or save the signal.
                </p>
              ),
            },
            {
              title: "Messy Morse to text",
              morse: "...---...",
              children: (
                <p>
                  If the dots and dashes have no spaces, start with the{" "}
                  <a
                    href="/morse-code-word-separator"
                    className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                  >
                    word separator
                  </a>{" "}
                  before decoding.
                </p>
              ),
            },
            {
              title: "Learning session",
              morse: "E T A N",
              children: (
                <p>
                  Review a small set on the{" "}
                  <a
                    href="/morse-code-alphabet"
                    className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                  >
                    alphabet page
                  </a>
                  , drill it in{" "}
                  <a
                    href="/practice"
                    className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                  >
                    practice
                  </a>
                  , then add audio when the patterns feel familiar.
                </p>
              ),
            },
          ],
        }}
        mistakes={{
          title: "Common workflow mistakes",
          description:
            "Most tool-choice mistakes come from starting with the wrong page for the input you actually have.",
          items: [
            {
              title: "Using the decoder for unspaced Morse",
              children: (
                <p>
                  Decoders need boundaries. If spaces are missing, clean the
                  gaps first instead of expecting one dot-dash stream to decode
                  reliably.
                </p>
              ),
            },
            {
              title: "Practicing before checking the pattern",
              children: (
                <p>
                  If you keep missing the same symbol, confirm it in the{" "}
                  <a
                    href="/dictionary"
                    className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                  >
                    dictionary
                  </a>{" "}
                  before repeating the drill.
                </p>
              ),
            },
            {
              title: "Treating audio pitch as speed",
              children: (
                <p>
                  Pitch changes tone. WPM and timing settings change how fast
                  the Morse is sent.
                </p>
              ),
            },
          ],
        }}
        comparison={{
          eyebrow: "Choose a guide",
          title: "How-to-use vs learning and practice pages",
          description:
            "Use this page to choose a MorseWords tool. Use the learning and practice pages when the goal is skill building.",
          items: [
            {
              title: "How to Use MorseWords",
              text: "Use this page when you know your task but are not sure which tool page should come first.",
            },
            {
              title: "Learn Morse Code",
              text: "Use the learning guide when you want the beginner path from letters into real practice.",
              href: "/learn-morse-code",
              badge: "Learn",
            },
            {
              title: "Practice Plan",
              text: "Use the practice plan when you want a daily routine rather than a tool-choice guide.",
              href: "/morse-code-practice-plan",
              badge: "Routine",
            },
            {
              title: "Timing Guides",
              text: "Use the timing pages when WPM, spacing, or Farnsworth settings are the confusing part.",
              href: "/morse-code-timing",
              badge: "Timing",
            },
          ],
        }}
        nextStep={{
          title: "Best next step",
          description:
            "Pick the page that matches your current input and keep the workflow narrow.",
          links: [
            { href: "/", label: "Main translator", primary: true },
            { href: "/morse-code-decoder", label: "Decode dots and dashes" },
            { href: "/audio", label: "Hear Morse" },
            { href: "/morse-code-printable-chart", label: "Print resources" },
          ],
        }}
      />
    </>
  );
}
