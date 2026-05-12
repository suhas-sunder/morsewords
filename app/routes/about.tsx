import type { Route } from "./+types/about";

import FaqSectionGeneric, {
  type FaqItem,
} from "~/client/components/shared/FaqSectionGeneric";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  PageHero,
  SectionCard,
  SimpleGrid,
} from "~/client/components/shared/MorseLearningLayout";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/about";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);
const CREATOR_URL = "https://www.suhassunder.com";
const CREATOR_LINKEDIN = "https://www.linkedin.com/in/s-sunder";

const aboutFaqItems: FaqItem[] = [
  {
    q: "What is MorseWords?",
    a: "MorseWords is a browser-based Morse code toolkit for translating, hearing, practicing, typing, printing, and looking up International Morse code.",
  },
  {
    q: "Who is MorseWords for?",
    a: "It is built for beginners, teachers, casual users, puzzle makers, and learners who want practical Morse tools without a dense radio-operator interface.",
  },
  {
    q: "Is MorseWords an official Morse code standards body?",
    a: "No. MorseWords uses standard International Morse references and practical learning guidance, but it is not an official standards organization or certification provider.",
  },
  {
    q: "Does MorseWords store my Morse messages?",
    a: "Core tool input is handled in the browser. MorseWords should not send raw messages, puzzle words, worksheet text, or learner answers to analytics.",
  },
  {
    q: "Where should a beginner start?",
    a: "Start with the translator or alphabet chart, then hear the result with audio practice and move into short practice sessions when the patterns begin to feel familiar.",
  },
];

export function links() {
  return [
    {
      rel: "canonical",
      href: CANONICAL_URL,
    },
  ];
}

export function meta(_: Route.MetaArgs) {
  return seoMeta({
    title: "About MorseWords | Friendly Morse Code Tools and Practice",
    description:
      "Learn what MorseWords is, who it helps, and how its translator, audio, practice, and reference tools support beginner-friendly Morse learning.",
    path: CANONICAL_PATH,
    keywords:
      "about MorseWords, Morse code tools, Morse code translator, Morse code decoder, Morse code audio, Morse code practice",
  });
}

export default function About() {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About MorseWords",
    url: CANONICAL_URL,
    inLanguage: "en",
    description:
      "MorseWords is a friendly Morse code toolkit for translating messages, hearing real Morse audio, practicing recognition, and using reference pages while learning.",
    isPartOf: {
      "@type": "WebSite",
      name: "MorseWords",
      url: SITE_URL + "/",
    },
    about: {
      "@type": "WebApplication",
      name: "MorseWords",
      applicationCategory: "EducationalApplication",
      operatingSystem: "All",
      url: SITE_URL + "/",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Text to Morse code translation",
        "Morse code decoding",
        "Morse code audio playback",
        "Morse code practice drills",
        "Morse code typing practice",
        "Morse code reference lookup",
        "Printable Morse code learning resources",
      ],
    },
    author: {
      "@type": "Person",
      name: "Suhas Sunder",
      jobTitle: "Software Developer",
      url: CREATOR_URL,
      sameAs: [CREATOR_URL, CREATOR_LINKEDIN],
      knowsAbout: [
        "React",
        "TypeScript",
        "Remix",
        "Node.js",
        "User interface development",
        "Web utilities",
      ],
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
        name: "About",
        item: CANONICAL_URL,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: aboutFaqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <JsonLdScript jsonLd={[pageJsonLd, breadcrumbJsonLd, faqJsonLd]} />
      <main style={styles.wrap}>
        <PageHero
          eyebrow="About MorseWords"
          title="About MorseWords"
          description="MorseWords is the friendly way to learn and use Morse code: translate a message, hear the rhythm, understand the spacing, and build confidence through short practice sessions."
        >
          <ActionLinks
            links={[
              { href: "/", label: "Open translator", primary: true },
              { href: "/audio", label: "Hear Morse audio" },
              { href: "/practice", label: "Practice patterns" },
              { href: "/sources", label: "Review sources" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Purpose"
          title="A friendly way to learn and use Morse code"
          description="MorseWords is broader than a single translator, but every page still starts from a practical job a user is trying to finish."
        >
          <SimpleGrid
            items={[
              {
                title: "Translate it",
                text: "Use the translator, encoder, and decoder when you need clean dots and dashes or readable text from pasted Morse.",
                href: "/",
              },
              {
                title: "Hear it",
                text: "Use audio tools when the pattern needs to become sound, not just a visual string on the page.",
                href: "/audio",
              },
              {
                title: "Practice it",
                text: "Use short drills, typing, audio practice, and visual practice to build recognition over time.",
                href: "/practice",
              },
              {
                title: "Check it",
                text: "Use the alphabet, dictionary, and reference pages when you need to verify a symbol, spacing rule, or signal.",
                href: "/dictionary",
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          eyebrow="Audience"
          title="Built for beginners, teachers, and quick lookups"
          description="The site is intended for people who want a direct browser workflow, not a dense radio manual before they can hear or use a pattern."
        >
          <SimpleGrid
            items={[
              {
                title: "Beginners",
                text: "Start with the alphabet, convert short messages, hear the rhythm, and move into practice when the patterns start to stick.",
                href: "/learn-morse-code",
              },
              {
                title: "Teachers",
                text: "Use printable charts, word searches, and practice pages for handouts, warm-ups, and low-prep classroom activities.",
                href: "/morse-code-printable-chart",
              },
              {
                title: "Casual users",
                text: "Decode a pasted message, check SOS, copy a phrase, or generate audio without creating an account.",
                href: "/morse-code-decoder",
              },
              {
                title: "Practice-focused learners",
                text: "Move from visual lookup into audio and typing drills so Morse becomes recognizable instead of only readable.",
                href: "/morse-code-practice-plan",
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          eyebrow="Learning"
          title="Why hearing and practice matter"
          description="A chart can tell you what a letter is, but practice teaches you to recognize the rhythm without pausing on every dot and dash."
        >
          <div className="space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
            <p>
              MorseWords keeps visual tools, audio tools, and practice tools close
              together because Morse code is easier to use when those steps are
              connected. A learner can translate a short word, listen to it,
              compare the spacing, and then test the same pattern in a drill.
            </p>
            <p>
              The site favors short sessions over heavy lesson screens. That
              makes it easier to review weak spots, repeat a small set of
              patterns, and return later without rebuilding a complicated setup.
            </p>
            <ActionLinks
              links={[
                { href: "/morse-code-alphabet", label: "Review alphabet" },
                { href: "/morse-code-audio-practice", label: "Try audio practice" },
                { href: "/typing", label: "Try typing practice" },
              ]}
            />
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Boundaries"
          title="What MorseWords does not claim to be"
          description="Trust comes from being clear about the site's limits as well as its purpose."
        >
          <SimpleGrid
            items={[
              {
                title: "Not an official authority",
                text: "MorseWords uses standard references, but it is not an official standards body or regulator.",
              },
              {
                title: "Not certification prep",
                text: "The tools can support learning and practice, but they do not promise exam readiness or professional qualification.",
              },
              {
                title: "Not emergency guidance",
                text: "Signal pages such as SOS are educational references, not safety-critical communication instructions.",
              },
              {
                title: "Not a social platform",
                text: "There are no accounts, feeds, messages, or community profiles required to use the core tools.",
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          eyebrow="Privacy"
          title="User input stays practical and local where possible"
          description="MorseWords tools are designed for browser-based use without turning learner input into a product."
        >
          <div className="space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
            <p>
              Tool input such as Morse messages, puzzle words, worksheet text,
              and learner answers should not be sent to analytics. Some settings
              may be kept in browser storage so the tool can remember a local
              preference, but the core workflow does not require an account.
            </p>
            <p>
              For policy details, use the dedicated privacy and cookie pages.
              This about page only summarizes the product direction at a high
              level.
            </p>
            <ActionLinks
              links={[
                { href: "/misc/privacy-policy", label: "Privacy policy" },
                { href: "/misc/cookies-policy", label: "Cookies policy" },
              ]}
            />
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Start here"
          title="Best next steps"
          description="Choose the page based on the task you are trying to finish now."
        >
          <ActionLinks
            links={[
              { href: "/", label: "Translate text", primary: true },
              { href: "/audio", label: "Hear a message" },
              { href: "/learn-morse-code", label: "Learn the path" },
              { href: "/morse-code-alphabet", label: "Review A-Z" },
              { href: "/dictionary", label: "Look up symbols" },
              { href: "/sources", label: "Check sources" },
            ]}
          />
        </SectionCard>

        <SectionCard
          eyebrow="Maintainer"
          title="Built and maintained by Suhas Sunder"
          description="MorseWords is maintained as a focused web utility with a real person behind the product direction."
        >
          <div className="space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
            <p>
              Suhas Sunder is a software developer who builds production web
              applications and focused browser utilities with React, TypeScript,
              Remix, Node.js, and responsive interface work.
            </p>
            <p>
              MorseWords exists because many Morse code sites are either very
              sparse converters or dense training resources. This site is meant
              to sit between those extremes: practical enough for repeated use,
              but approachable enough for a beginner's first session.
            </p>
            <ActionLinks
              links={[
                { href: CREATOR_URL, label: "Developer portfolio" },
                { href: CREATOR_LINKEDIN, label: "LinkedIn" },
              ]}
            />
          </div>
        </SectionCard>

        <FaqSectionGeneric
          title="About MorseWords FAQ"
          description="Short answers about what the site is, what it is not, and how to use it safely."
          items={aboutFaqItems}
        />

        <BreadcrumbTrail current="About" placement="contentFooter" />
      </main>
    </div>
  );
}
