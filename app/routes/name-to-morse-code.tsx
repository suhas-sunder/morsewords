import type { Route } from "./+types/name-to-morse-code";

import NameToMorseTool from "~/client/components/content/NameToMorseTool";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
} from "~/client/components/content/MorseContentSections";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  SectionCard,
  SimpleGrid,
} from "~/client/components/shared/MorseLearningLayout";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import { ToolHero } from "~/client/components/shared/ToolWorkspace";
import styles from "~/client/components/shared/pageStyles";
import { morseForText } from "~/client/data/morseContent";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/name-to-morse-code";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

const faqItems = [
  {
    q: "How do I convert a name to Morse code?",
    a: "Type the name into the tool, review the normalized spelling, then copy or play the Morse output.",
  },
  {
    q: "Does Morse code translate the meaning of a name?",
    a: "No. Morse code converts the spelling of the name one character at a time.",
  },
  {
    q: "Can I convert a full name?",
    a: "Yes. First names, last names, and full names can be converted when the characters are supported.",
  },
  {
    q: "Do hyphens and apostrophes work in names?",
    a: "Yes. MorseWords supports hyphen and apostrophe patterns, so names such as Anne-Marie or O'Neil can be encoded.",
  },
  {
    q: "Should I use this for jewelry, tattoos, or engraving?",
    a: "You can, but check the spelling and word gaps carefully before using Morse permanently.",
  },
  {
    q: "Can I hear a name in Morse code?",
    a: "Yes. Use the Hear in audio link after converting the name.",
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Name to Morse Code | Convert Any Name and Hear It | MorseWords",
    description:
      "Convert a first name or full name to Morse code, including supported spaces, hyphens, and apostrophes. Copy the name, copy Morse, and hear it as audio.",
    path: CANONICAL_PATH,
    keywords:
      "name to morse code, name in morse code, convert name to morse code, morse code name audio",
  });
}

export default function NameToMorseCodeRoute() {
  const jsonLd = [
    buildBreadcrumbJsonLd({
      siteUrl: SITE_URL,
      canonicalUrl: CANONICAL_URL,
      name: "Name to Morse Code",
    }),
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Name to Morse Code",
      applicationCategory: "UtilityApplication",
      operatingSystem: "All",
      url: CANONICAL_URL,
      description:
        "Name-to-Morse utility for converting names into International Morse code with copy and audio links.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
    },
    buildFaqJsonLd(faqItems),
  ];

  return (
    <div className="mw-non-home-page mw-wave-content-page" style={styles.page}>
      <main style={styles.wrap}>
        <ToolHero
          eyebrow="Name utility"
          title="Name to Morse Code"
          lead="Convert a first name, full name, nickname, or short signature into Morse code. The tool keeps the spelling visible, shows unsupported characters, and sends the exact name into translator or audio pages."
        />

        <div className="mt-4">
          <ActionLinks
            links={[
              { href: "#mw_name_input", label: "Convert a name", primary: true },
              { href: "/?text=AVERY", label: "Open translator" },
              { href: "/audio?text=AVERY", label: "Hear an example" },
            ]}
          />
        </div>

        <NameToMorseTool />

        <SectionCard
          eyebrow="Direct guidance"
          title="What a name converter does"
          description="Morse converts spelling, not meaning. That makes it useful for checking how a name looks and sounds in dots and dashes before you copy it into another format."
        >
          <SimpleGrid
            items={[
              {
                title: "Names are spelled out",
                text: "A name is encoded character by character using the same Morse map as the main translator.",
              },
              {
                title: "Spaces stay meaningful",
                text: "A first and last name uses a word gap, so the boundary should remain visible in copied Morse.",
              },
              {
                title: "Hyphens and apostrophes",
                text: "Supported punctuation is encoded directly. Unsupported symbols are shown so you can remove or replace them.",
              },
              {
                title: "Permanent uses need checking",
                text: "For jewelry, tattoos, engraving, or gifts, verify the spelling and gaps in both the translator and audio tool.",
              },
            ]}
          />
        </SectionCard>

        <ReferenceSupportSections
          guide={{
            eyebrow: "Name workflow",
            title: "How to use a name in Morse code",
            description:
              "Use the converter first, then check the output in context before copying it into a final design or message.",
            items: [
              {
                title: "Type the exact name",
                text: "Include spaces, hyphens, and apostrophes only when they are part of the spelling you want to preserve.",
              },
              {
                title: "Review unsupported characters",
                text: "Replace unsupported decorative symbols before using the output.",
              },
              {
                title: "Listen before final use",
                text: "Audio makes it easier to catch missing gaps or a mistyped letter.",
              },
            ],
          }}
          examples={{
            title: "Name examples",
            description:
              "These examples are included in the tool so you can compare short names quickly.",
            items: [
              {
                title: "Avery",
                morse: morseForText("Avery"),
                children: <p>A clear five-letter example with one V pattern.</p>,
              },
              {
                title: "Diego",
                morse: morseForText("Diego"),
                children: <p>A useful example with a mix of short and longer letters.</p>,
              },
              {
                title: "Katie",
                morse: morseForText("Katie"),
                children: <p>A name with repeated short patterns that is easy to check by ear.</p>,
              },
            ],
          }}
          mistakes={{
            title: "Common name conversion mistakes",
            description:
              "Most name mistakes come from decorative spelling, lost gaps, or using Morse without checking the result.",
            items: [
              {
                title: "Changing the spelling",
                children: <p>Encode the exact spelling you want to show or hear.</p>,
              },
              {
                title: "Losing full-name gaps",
                children: <p>Keep a visible word gap between first and last names.</p>,
              },
              {
                title: "Skipping final verification",
                children: <p>Check permanent designs in the decoder or audio tool first.</p>,
              },
            ],
          }}
          comparison={{
            title: "Name converter vs general tools",
            description:
              "Use the name tool for a focused workflow, or move into broader tools when you need a full message.",
            items: [
              {
                title: "Name converter",
                text: "Use this page for names, examples, copy buttons, and audio links.",
                href: "/name-to-morse-code",
                badge: "Names",
              },
              {
                title: "Main translator",
                text: "Use the translator for general text and two-way conversion.",
                href: "/",
                badge: "Tool",
              },
              {
                title: "Audio",
                text: "Use audio when the name needs to be heard or checked by rhythm.",
                href: "/audio",
                badge: "Listen",
              },
            ],
          }}
          nextStep={{
            title: "Best next step after converting a name",
            description:
              "Copy the name, copy the Morse, then hear it once before using it in a final design.",
            links: [
              { href: "/?text=AVERY", label: "Open translator", primary: true },
              { href: "/audio?text=AVERY", label: "Hear a name" },
              { href: "/morse-code-encoder", label: "Encode a full message" },
              { href: "/copy-and-paste-morse-code", label: "Copy-paste guide" },
            ],
          }}
        />

        <FaqSectionGeneric
          title="Name to Morse Code FAQ"
          items={faqItems}
          variant="home"
        />
        <JsonLdScript jsonLd={jsonLd} />
      </main>
      <BreadcrumbTrail current="Name to Morse Code" />
    </div>
  );
}
