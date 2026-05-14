import type { Route } from "./+types/morse-code-mp3-generator";

import MorseMp3GeneratorTool from "~/client/components/morse-code-mp3-generator/MorseMp3GeneratorTool";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  PageHero,
  SectionCard,
  SimpleGrid,
} from "~/client/components/shared/MorseLearningLayout";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-mp3-generator";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

const howItWorksItems = [
  {
    title: "Type text",
    text: "Start with a short message or switch to Morse input if you already have dots, dashes, spaces, and slashes.",
  },
  {
    title: "Convert to Morse",
    text: "The tool uses the same Morse conversion rules as the rest of MorseWords, then shows the generated dot-dash pattern.",
  },
  {
    title: "Generate tone audio",
    text: "Preview the tone with the selected speed, spacing, pitch, sound type, and volume before downloading.",
  },
  {
    title: "Encode the MP3",
    text: "MP3 encoding starts in your browser only when you click Download MP3.",
  },
];

const mp3VsWavItems = [
  {
    title: "MP3",
    text: "MP3 files are smaller and convenient for sharing practice clips, classroom examples, and quick audio references.",
  },
  {
    title: "WAV",
    text: "WAV is uncompressed, so it can be better when you plan to edit the audio or need a lossless export.",
    href: "/audio",
    badge: "Audio",
  },
];

const settingItems = [
  {
    title: "Speed",
    text: "WPM changes how quickly each Morse character plays.",
  },
  {
    title: "Spacing",
    text: "Farnsworth spacing can leave more room between characters while keeping the character rhythm intact.",
  },
  {
    title: "Pitch and sound type",
    text: "Pitch changes the tone frequency. Sound type changes the waveform or sounder style.",
  },
  {
    title: "Volume",
    text: "Volume changes preview loudness and the amplitude of exported audio.",
  },
  {
    title: "Envelope",
    text: "Attack and release can soften the start and end of each tone so clicks are less sharp.",
  },
  {
    title: "Export quality",
    text: "MP3 bitrate, sample rate, and tail padding change the downloaded file, not the Morse message.",
  },
];

const useItems = [
  {
    title: "Practice audio",
    text: "Make short drills for letters, words, calls, or phrases you want to hear repeatedly.",
  },
  {
    title: "Classroom files",
    text: "Create simple audio prompts for worksheets, slides, or listening checks.",
  },
  {
    title: "Simple sharing",
    text: "Send a compact MP3 when a WAV file is larger than you need.",
  },
  {
    title: "Project audio",
    text: "Use exported clips in your own project when the message and usage rights are yours to manage.",
  },
];

const troubleshootingItems = [
  {
    title: "Download blocked",
    text: "If the browser blocks the file, allow downloads for the page or try the WAV export.",
  },
  {
    title: "Too fast or slow",
    text: "Adjust WPM first, then adjust spacing if the characters sound right but the gaps feel rushed.",
  },
  {
    title: "File is too long",
    text: "Long messages take more time to render and encode. Split long text into shorter files.",
  },
  {
    title: "Unsupported characters",
    text: "Unsupported text characters are ignored so the generated Morse stays readable.",
    href: "/morse-code-chart",
    badge: "Chart",
  },
  {
    title: "Mobile limitations",
    text: "Older mobile browsers can be slower at MP3 encoding. Short messages are the safest export path.",
  },
  {
    title: "Wrong input direction",
    text: "This page creates audio from text or typed Morse. It does not decode uploaded audio files.",
    href: "/morse-code-audio-decoder",
    badge: "Decoder",
  },
];

const comparisonItems = [
  {
    title: "MP3 generator",
    text: "Use this page when you want to create a downloadable MP3 from text or typed Morse.",
  },
  {
    title: "Audio decoder",
    text: "Use the audio decoder when you have an uploaded MP3, WAV, or recording and want readable text.",
    href: "/morse-code-audio-decoder",
    badge: "Decode",
  },
  {
    title: "Morse encoder",
    text: "Use the encoder when you only need dots and dashes without an audio file.",
    href: "/morse-code-encoder",
    badge: "Encode",
  },
  {
    title: "Morse decoder",
    text: "Use the decoder when you need to convert typed Morse back to readable text.",
    href: "/morse-code-decoder",
    badge: "Read",
  },
];

const faqItems = [
  {
    q: "Does this page download a real MP3 file?",
    a: "Yes. The page renders Morse audio in the browser, encodes it as MP3 when you click Download MP3, and downloads a .mp3 file.",
  },
  {
    q: "Can I still download WAV audio?",
    a: "Yes. WAV export is available as a secondary option and uses the same generated Morse audio settings.",
  },
  {
    q: "Why does MP3 export take a moment?",
    a: "The MP3 encoder runs in your browser after the audio is rendered. Longer messages take more time than short practice clips.",
  },
  {
    q: "Can this page decode an MP3 file?",
    a: "No. This page creates MP3 audio from text or typed Morse. Use the Morse code audio decoder for uploaded sound files.",
  },
  {
    q: "Which settings change the exported MP3?",
    a: "Speed, spacing, pitch, sound type, volume, attack, release, sample rate, tail padding, and MP3 bitrate affect the generated audio or file output.",
  },
  {
    q: "What filename does the tool use by default?",
    a: "The default MP3 filename is morse-code.mp3, and you can change the base file name before downloading.",
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code MP3 Generator | Download Morse Audio | MorseWords",
    description:
      "Type text, generate Morse audio, and download an MP3 in your browser with speed, spacing, sound type, tone, volume, and WAV options.",
    path: CANONICAL_PATH,
    keywords:
      "morse code mp3 generator, text to morse code mp3, morse to mp3, morse code to mp3, morse audio mp3",
  });
}

export default function MorseCodeMp3GeneratorRoute() {
  const webApplicationJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Morse Code MP3 Generator",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: CANONICAL_URL,
    description:
      "A browser-based Morse audio generator that converts text or typed Morse into downloadable MP3 audio.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
        name: "Morse Code MP3 Generator",
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
          eyebrow="MP3 audio"
          title="Morse Code MP3 Generator"
          description="Type text, preview Morse audio, then download an MP3 generated in your browser."
        />

        <MorseMp3GeneratorTool />

        <SectionCard
          eyebrow="How it works"
          title="How the MP3 generator works"
          description="The tool keeps the main flow simple: write the message, check the Morse, preview the sound, and export."
        >
          <SimpleGrid items={howItWorksItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Format"
          title="MP3 vs WAV"
          description="Choose the file type based on whether you need a compact shareable file or an uncompressed audio file."
        >
          <SimpleGrid items={mp3VsWavItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Settings"
          title="Settings that change the audio"
          description="Only the controls shown in the tool affect the generated audio."
        >
          <SimpleGrid items={settingItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Use cases"
          title="When to use MP3"
          description="MP3 works best when you need a compact Morse audio file that is easy to download and share."
        >
          <SimpleGrid items={useItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Fixes"
          title="Troubleshooting"
          description="Most export issues come from long messages, blocked downloads, or using the wrong input direction."
        >
          <SimpleGrid items={troubleshootingItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Direction"
          title="MP3 generator vs audio decoder"
          description="Use the generator for text-to-audio. Use the decoder when the audio file already exists."
        >
          <SimpleGrid items={comparisonItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Next tools"
          title="More Morse audio and reference tools"
          description="Use the broader audio tool, text tools, and reference pages when your task is not MP3 export."
        >
          <ActionLinks
            links={[
              { href: "/audio", label: "Broader audio tool", primary: true },
              { href: "/morse-code-encoder", label: "Text to Morse encoder" },
              { href: "/morse-code-decoder", label: "Morse decoder" },
              {
                href: "/morse-code-audio-decoder",
                label: "Audio file decoder",
              },
              { href: "/morse-code-chart", label: "Morse code chart" },
              { href: "/morse-code-alphabet", label: "Morse alphabet" },
              {
                href: "/copy-and-paste-morse-code",
                label: "Copy-paste Morse guide",
              },
            ]}
          />
        </SectionCard>

        <div id="faq">
          <FaqSectionGeneric
            title="Morse code MP3 generator FAQ"
            description="Use these answers when you need a downloadable Morse audio file."
            items={faqItems}
            variant="home"
          />
        </div>

        <JsonLdScript
          jsonLd={[webApplicationJsonLd, breadcrumbJsonLd, faqJsonLd]}
        />
      </main>
      <BreadcrumbTrail
        current="Morse Code MP3 Generator"
        placement="pageBottom"
      />
    </div>
  );
}
