import type { Route } from "./+types/morse-code-video-generator";

import MorseVideoGeneratorTool from "~/client/components/morse-code-video-generator/MorseVideoGeneratorTool";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  PageHero,
  SectionCard,
  SimpleGrid,
  WAVE_PAGE_MAIN_CLASS,
} from "~/client/components/shared/MorseLearningLayout";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = ROUTES.videoGenerator;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);
const TITLE = "Morse Code Video Generator";
const DESCRIPTION =
  "Type text or Morse code, preview a short MorseWords video style, and download a browser-generated WebM clip.";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: TITLE,
    url: CANONICAL_URL,
    description: DESCRIPTION,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: TITLE,
        item: CANONICAL_URL,
      },
    ],
  },
];

const workflowItems = [
  {
    title: "Write the signal",
    text: "Type a short message or paste typed Morse dots, dashes, spaces, and slashes.",
  },
  {
    title: "Choose a visual",
    text: "Use the lightbulb, dot, full-frame flash, or animated Morse text style for the video frame.",
  },
  {
    title: "Set timing",
    text: "Character speed and Farnsworth spacing control the rhythm of the visual signal and optional audio track.",
  },
  {
    title: "Download WebM",
    text: "The browser records the canvas locally when WebM recording support is available.",
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: `${TITLE} | MorseWords`,
    description: DESCRIPTION,
    path: CANONICAL_PATH,
    keywords:
      "morse code video generator, text to morse code video, morse code webm, morse video",
  });

export default function MorseCodeVideoGeneratorRoute() {
  return (
    <main className={WAVE_PAGE_MAIN_CLASS}>
      <JsonLdScript jsonLd={jsonLd} />
      <PageHero
        eyebrow="Video clip"
        title={TITLE}
        description="Create a short Morse code video from text or typed Morse, preview the visual style, and download a local WebM clip when your browser supports recording."
      >
        <ActionLinks
          links={[
            {
              href: ROUTES.bookTranslator,
              label: "Long-form book export",
              primary: true,
            },
            { href: ROUTES.mp3Generator, label: "Create MP3 audio" },
            { href: ROUTES.audio, label: "Open audio tool" },
          ]}
        />
      </PageHero>

      <MorseVideoGeneratorTool />

      <SectionCard
        eyebrow="Short-form workflow"
        title="How Morse video export works"
        description="This page is for short clips. Use the book translator when you need long-form source handling or split exports."
        layout="stacked"
      >
        <SimpleGrid items={workflowItems} variant="plain" />
      </SectionCard>

      <BreadcrumbTrail current={TITLE} placement="contentFooter" />
    </main>
  );
}
