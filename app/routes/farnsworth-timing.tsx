import type { Route } from "./+types/farnsworth-timing";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
  SimpleGrid,
} from "~/client/components/shared/MorseLearningLayout";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/farnsworth-timing";

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Farnsworth Timing for Morse Code Practice | MorseWords",
    description:
      "Learn how Farnsworth timing separates character speed from effective speed so Morse learners can hear fast character shapes with easier spacing.",
    path: CANONICAL_PATH,
    keywords:
      "Farnsworth timing, morse code Farnsworth, character speed, effective speed, morse code audio practice",
  });
}

export default function FarnsworthTiming() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    name: "Farnsworth Timing for Morse Code",
    url: canonicalUrl(CANONICAL_PATH),
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };

  return (
    <div style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Listening practice"
          title="Farnsworth timing for Morse code"
          description="Farnsworth timing sends each character at a confident speed, then stretches the spaces between characters and words. Learners hear realistic character shapes without being buried by the full message speed."
          aside={
            <DarkNote label="Example setup" value="18 WPM / 12 WPM">
              Character speed can stay crisp at 18 WPM while the overall copy
              speed feels closer to 12 WPM because the gaps are longer.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/audio", label: "Open audio generator", primary: true },
              { href: "/morse-code-audio-practice", label: "Audio practice" },
              { href: "/morse-code-timing", label: "Timing basics" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Why it helps"
          title="Fast characters, slower copy"
          description="Farnsworth timing is useful because it teaches the sound of a whole character instead of encouraging you to count individual dots and dashes."
        >
          <SimpleGrid
            items={[
              {
                title: "Character speed",
                text: "Controls how fast each letter or number is sent internally. This is the rhythm your ear learns.",
                badge: "Shape",
              },
              {
                title: "Effective speed",
                text: "Controls how fast the full message feels after extra gaps are added between characters and words.",
                badge: "Copy",
              },
              {
                title: "Good for beginners",
                text: "The patterns sound natural, but the extra space gives your brain time to recognize and type the answer.",
                badge: "Learn",
              },
              {
                title: "Good for review",
                text: "You can keep character speed high while lowering effective speed for difficult words or weak symbols.",
                badge: "Review",
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          eyebrow="How to set it"
          title="Using Farnsworth inside MorseWords"
          description="Use the audio tools when you want tone, speed, pitch, and spacing control. Use practice pages when you want answer checking."
        >
          <div className="max-w-[74ch] space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
            <p>
              Start with a character speed that sounds crisp, then lower the
              effective speed until you can copy without panic. As you improve,
              raise the effective speed first. Keep the character speed stable
              so the sounds stay familiar.
            </p>
            <p>
              If you are practicing by ear, avoid slowing characters so far that
              each dit and dah becomes a separate counting task. The point is to
              learn the sound of S, O, Q, 5, and the rest as whole patterns.
            </p>
          </div>
        </SectionCard>

        <FaqSectionGeneric
          title="Farnsworth FAQ"
          items={[
            {
              q: "Is Farnsworth timing different from normal Morse timing?",
              a: "Yes. The characters are sent at one speed, while the spaces between characters and words are lengthened to reduce the effective message speed.",
            },
            {
              q: "What setting should I start with?",
              a: "A common learner setup is a character speed around 15-18 WPM with a slower effective speed. Adjust until you can recognize the sound patterns without rushing.",
            },
            {
              q: "Does Farnsworth change the Morse code itself?",
              a: "No. The dots, dashes, and character patterns are the same. Only the spacing between characters and words changes.",
            },
          ]}
        />

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}

