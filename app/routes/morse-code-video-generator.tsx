import type { Route } from "./+types/morse-code-video-generator";

import MorseVideoGeneratorTool from "~/client/components/morse-code-video-generator/MorseVideoGeneratorTool";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
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
  "Turn text or pasted Morse code into a short Morse video, preview lightbulb, dot, flash, or animated text styles, and download local WebM.";

const videoFaqItems = [
  {
    q: "What is a Morse code video generator?",
    a: "It is a browser tool that turns text or typed Morse into a visual Morse signal, then records the result as a downloadable video when your browser supports recording.",
  },
  {
    q: "Can I turn text into a Morse code video?",
    a: "Yes. Use Text to Morse video, type a short message, preview the generated dots and dashes, choose the visual style, and download WebM.",
  },
  {
    q: "Can I paste Morse code directly?",
    a: "Yes. Switch to Morse code to video and paste dots, dashes, spaces, or slash-separated word gaps. Invalid symbols are reported before export.",
  },
  {
    q: "What video format does it download?",
    a: "The standalone generator downloads a direct .webm file for normal short messages. It does not create a ZIP for the short-form route.",
  },
  {
    q: "Why does it download WebM instead of MP4?",
    a: "WebM is the format browsers most commonly support for canvas recording. MP4 usually needs platform-specific encoders, a server renderer, or heavy conversion tools that this page does not use.",
  },
  {
    q: "Can I include Morse audio in the video?",
    a: "Yes. Keep the audio track setting on to include synchronized Morse tone audio, or turn it off for a silent visual-only clip.",
  },
  {
    q: "What visual styles are available?",
    a: "The route includes lightbulb, dot, full-frame flash, and animated Morse text styles. Lightbulb is the default for a compact visual signal.",
  },
  {
    q: "What is the safest visual mode?",
    a: "Lightbulb or dot mode is the safest choice for broad sharing because only a small part of the frame changes during Morse marks.",
  },
  {
    q: "What does full-frame flash mean?",
    a: "Full-frame flash changes the brightness of the whole video frame during Morse marks instead of flashing only a small bulb or dot.",
  },
  {
    q: "Can flashing video be uncomfortable or unsafe?",
    a: "Yes. Full-frame flashing can be uncomfortable or unsafe for some viewers, especially people with photosensitive epilepsy or light sensitivity. Use a smaller visual mode when in doubt.",
  },
  {
    q: "Can I make a long book-length Morse video here?",
    a: "No. This route is for short clips. Use the book translator when you need long-form source handling, chapter-length text, or split exports.",
  },
  {
    q: "Is my input uploaded or stored?",
    a: "No. Input, Morse conversion, preview, and WebM recording happen locally in the browser, and raw input is not saved to localStorage by this route.",
  },
  {
    q: "Why is video export unavailable in some browsers?",
    a: "The browser must support MediaRecorder and canvas captureStream for WebM recording. If either API is missing, the page shows a fallback message instead of a broken download.",
  },
  {
    q: "Can I use the video commercially?",
    a: "You are responsible for the message, music-free audio, branding choices, and usage rights for your project. MorseWords does not grant rights to source text or third-party content.",
  },
];

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
    featureList: [
      "Text to Morse code video",
      "Pasted Morse code to video",
      "Lightbulb, dot, full-frame flash, and animated Morse text visuals",
      "Optional synchronized Morse audio track",
      "Browser-local WebM download",
      "Short-form video length guard",
    ],
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
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: videoFaqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
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

const formatItems = [
  {
    title: "Text to Morse video",
    text: "Type a phrase, call sign, classroom prompt, or short message. The tool converts it with the same Morse utilities used across MorseWords.",
  },
  {
    title: "Morse code to video",
    text: "Paste dots, dashes, spaces, and slashes when you already have the Morse pattern and only need the visual clip.",
  },
  {
    title: "WebM download",
    text: "WebM is the browser-friendly default for canvas recording and is downloaded directly for normal short clips.",
  },
  {
    title: "MP4 limits",
    text: "MP4 is not guaranteed in-browser and this page does not use a heavy server renderer or conversion dependency.",
  },
];

const visualItems = [
  {
    title: "Lightbulb",
    text: "A compact bulb signal beside the Morse text. It is the default because it keeps the flashing area small.",
  },
  {
    title: "Dot",
    text: "A minimal dot indicator for clean demonstrations, slides, and practice prompts.",
  },
  {
    title: "Full-frame flash",
    text: "The whole frame changes brightness on marks. Use it deliberately and keep the strobe warning in mind.",
  },
  {
    title: "Animated Morse text",
    text: "Recent dots and dashes become the visual focus, which helps when teaching symbol timing.",
  },
];

const timingItems = [
  {
    title: "Optional audio track",
    text: "Turn audio on when the video should include synchronized tone playback. Turn it off for a silent visual-only clip.",
    href: ROUTES.soundGenerator,
    badge: "Sound",
  },
  {
    title: "Character WPM",
    text: "Character speed controls the length of dots, dashes, and the rhythm inside each Morse character.",
    href: ROUTES.timing,
    badge: "WPM",
  },
  {
    title: "Farnsworth spacing",
    text: "Farnsworth spacing widens gaps while keeping character shapes crisp, which can help learner videos.",
    href: ROUTES.farnsworth,
    badge: "Spacing",
  },
  {
    title: "Branding toggle",
    text: "Minimal MorseWords branding can be left on for attribution or turned off when the clip needs a cleaner frame.",
  },
];

const useCaseItems = [
  {
    title: "Teaching clips",
    text: "Make short examples that show how a word, callsign, or phrase looks and sounds in Morse.",
  },
  {
    title: "Practice prompts",
    text: "Create visual drills for letters, words, or short sentences that learners can replay.",
  },
  {
    title: "Presentations",
    text: "Use WebM clips in slides or demonstrations when you need visual Morse without live browser controls.",
  },
  {
    title: "Creative messages",
    text: "Turn a short greeting, reveal, or coded phrase into a compact lightbulb or animated text video.",
  },
];

const safetyItems = [
  {
    title: "Short-form guard",
    text: "The route limits very long input. Use the book translator for chapter-length or book-length Morse video exports.",
    href: ROUTES.bookTranslator,
    badge: "Long form",
  },
  {
    title: "Full-frame warning",
    text: "Full-frame flash can be uncomfortable or unsafe for some viewers, so it is not the default and the warning stays near the setting.",
  },
  {
    title: "Local processing",
    text: "The page converts and records in the browser. It does not upload your message or save raw input to localStorage.",
  },
  {
    title: "Browser support",
    text: "If MediaRecorder or canvas captureStream is unavailable, the page disables download and explains the browser limitation.",
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: `${TITLE} | Text to Morse Code Video | MorseWords`,
    description: DESCRIPTION,
    path: CANONICAL_PATH,
    keywords:
      "Morse code video generator, text to Morse code video, Morse code flashing video, Morse lightbulb video, Morse code WebM download, Morse video with audio",
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
            { href: ROUTES.timing, label: "Morse timing guide" },
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

      <SectionCard
        eyebrow="Video format"
        title="Turn text or pasted Morse into WebM"
        description="The generator records a browser canvas, so WebM is the practical direct download format for short Morse videos."
        layout="stacked"
      >
        <SimpleGrid items={formatItems} variant="plain" />
      </SectionCard>

      <SectionCard
        eyebrow="Visual styles"
        title="Choose how the Morse signal appears"
        description="Pick the visual treatment that matches the use case. Smaller flash areas are better for broad sharing; full-frame flash needs extra care."
        layout="stacked"
      >
        <SimpleGrid items={visualItems} variant="plain" />
      </SectionCard>

      <SectionCard
        eyebrow="Timing and audio"
        title="Set the rhythm before download"
        description="Video timing follows the same Morse timing ideas as the audio tools: character speed, spacing, pitch, volume, and optional synchronized audio."
        layout="stacked"
      >
        <SimpleGrid
          items={timingItems}
          variant="plain"
          linkedItemStyle="inline"
        />
      </SectionCard>

      <SectionCard
        eyebrow="Use cases"
        title="Where short Morse videos fit"
        description="Use the standalone generator when you need a focused clip, not a book-length export or a full editing suite."
        layout="stacked"
      >
        <SimpleGrid items={useCaseItems} variant="plain" />
      </SectionCard>

      <SectionCard
        eyebrow="Safety and privacy"
        title="Keep the clip short, local, and viewer-friendly"
        description="The route is designed for short messages, local browser export, and clear warnings around full-frame flashing."
        layout="stacked"
      >
        <SimpleGrid
          items={safetyItems}
          variant="plain"
          linkedItemStyle="inline"
        />
      </SectionCard>

      <div id="faq">
        <FaqSectionGeneric
          title="Morse code video generator FAQ"
          description="Answers for text to Morse video, pasted Morse, WebM downloads, audio tracks, visual styles, flashing safety, and browser support."
          items={videoFaqItems}
        />
      </div>

      <BreadcrumbTrail current={TITLE} placement="contentFooter" />
    </main>
  );
}
