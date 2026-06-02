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
import { ROUTES } from "~/client/data/routes";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = ROUTES.mp3Generator;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

const howItWorksItems = [
  {
    title: "Type text",
    text: "Start with a short message, or switch to Morse input if you already have dots, dashes, spaces, and slashes.",
  },
  {
    title: "Convert to Morse",
    text: "The tool uses the same Morse conversion rules as the rest of MorseWords, then shows the generated dot-dash pattern.",
  },
  {
    title: "Generate tone audio",
    text: "Preview the tone with the selected speed, spacing, pitch, tone preset, and volume before downloading.",
  },
  {
    title: "Encode the MP3",
    text: "MP3 encoding starts in your browser only when you click Download MP3, so short messages can become direct audio files quickly.",
  },
];

const mp3VsWavItems = [
  {
    title: "MP3 for compact files",
    text: "MP3 is the practical choice for downloadable Morse audio that you want to share, save, or replay as a short listening clip.",
  },
  {
    title: "WAV for editing",
    text: "WAV is uncompressed, so it is useful when an editor, classroom tool, or audio workflow expects a plain waveform file.",
    href: ROUTES.audio,
    badge: "Audio",
  },
  {
    title: "Direct files beat bundles",
    text: "For one short message, a direct MP3 or WAV is clearer than a ZIP because there is only one file to download, name, and replay.",
  },
  {
    title: "Long text needs parts",
    text: "For chapters, articles, or book-length text, split the audio into manageable parts on the book translator instead of forcing one huge file.",
    href: ROUTES.bookTranslator,
    badge: "Books",
  },
];

const settingItems = [
  {
    title: "Character speed",
    text: "WPM changes how quickly each Morse character plays. Faster speed usually shortens the file; slower speed usually makes it longer.",
  },
  {
    title: "Farnsworth spacing",
    text: "Farnsworth spacing leaves more room between characters while keeping the character rhythm intact, which can make practice audio easier to copy.",
    href: ROUTES.farnsworth,
    badge: "Spacing",
  },
  {
    title: "Pitch and tone preset",
    text: "Pitch changes the tone frequency. Tone preset changes the waveform or sounder style, so choose the sound that is easiest to hear.",
    href: ROUTES.soundGenerator,
    badge: "Tone",
  },
  {
    title: "Volume",
    text: "Volume changes preview loudness and the amplitude of exported audio. Leave headroom if you plan to edit the file later.",
  },
  {
    title: "Envelope",
    text: "Attack and release can soften the start and end of each tone so clicks are less sharp.",
  },
  {
    title: "Export quality",
    text: "MP3 bitrate, sample rate, and tail padding change the downloaded file, not the Morse message or timing rules.",
    href: ROUTES.timing,
    badge: "Timing",
  },
];

const bitrateItems = [
  {
    title: "32 kbps",
    text: "A simple Morse tone does not need a music-style bitrate. 32 kbps is often enough for small practice files and quick examples.",
  },
  {
    title: "48 kbps",
    text: "48 kbps is a comfortable middle choice when you want a little more room for tone shape without making the file much larger.",
  },
  {
    title: "128 kbps",
    text: "128 kbps is usually larger than necessary for a single Morse tone, but it is available when you prefer a familiar default.",
  },
  {
    title: "ZIP is not compression magic",
    text: "ZIP does not meaningfully compress an MP3 because MP3 is already compressed. ZIP is mainly useful for bundling multiple files.",
  },
  {
    title: "Runtime drives size",
    text: "Longer messages, slower WPM, extra Farnsworth spacing, and more tail padding all increase the amount of audio that must be saved.",
  },
  {
    title: "One file vs many",
    text: "Use this page for one direct MP3 or WAV. Use the book translator when long text should be split into parts with supporting files.",
    href: ROUTES.bookTranslator,
    badge: "Split",
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
    text: "Long messages take more time to render and encode. Use the book translator when a chapter or article should become longer listening audio.",
    href: ROUTES.bookTranslator,
    badge: "Long text",
  },
  {
    title: "Keep expectations practical",
    text: "This page creates clean Morse tone audio. It does not clean noisy recordings, transcribe speech, or make long audio shorter than its actual playback time.",
  },
  {
    title: "Mobile limitations",
    text: "Older mobile browsers can be slower at MP3 encoding. Short messages are the safest export path.",
  },
  {
    title: "Local browser work",
    text: "Preview, WAV rendering, and MP3 encoding happen in your browser. This tool does not upload your typed message to make the file.",
  },
  {
    title: "Wrong input direction",
    text: "This page creates audio from text or typed Morse. It does not decode uploaded audio files.",
    href: ROUTES.audioDecoder,
    badge: "Decoder",
  },
];

const comparisonItems = [
  {
    title: "MP3 generator",
    text: "Use this page when you want to create a downloadable MP3 from text or typed Morse.",
  },
  {
    title: "Audio translator",
    text: "Use the audio hub when you want general playback, practice controls, and broader Morse audio options before exporting.",
    href: ROUTES.audio,
    badge: "Audio",
  },
  {
    title: "Sound generator",
    text: "Use the sound generator when you mainly want to test tone, pitch, waveform, and listening comfort.",
    href: ROUTES.soundGenerator,
    badge: "Tone",
  },
  {
    title: "Audio decoder",
    text: "Use the audio decoder when you have an uploaded MP3, WAV, or recording and want readable text.",
    href: ROUTES.audioDecoder,
    badge: "Decode",
  },
  {
    title: "Video generator",
    text: "Use the video generator when the Morse message needs synchronized audio and on-screen dots and dashes.",
    href: ROUTES.videoGenerator,
    badge: "Video",
  },
  {
    title: "Timing guides",
    text: "Use the timing pages when you want to understand WPM, character timing, word gaps, and Farnsworth spacing before choosing export settings.",
    href: ROUTES.timing,
    badge: "Speed",
  },
];

const faqItems = [
  {
    q: "Can I download Morse code as an MP3 file?",
    a: "Yes. The page renders Morse audio in the browser, encodes it as MP3 when you click Download MP3, and downloads a .mp3 file.",
  },
  {
    q: "Can I download WAV instead of MP3?",
    a: "Yes. WAV export is available as a secondary option and uses the same generated Morse audio settings.",
  },
  {
    q: "Which format should I choose, MP3 or WAV?",
    a: "Choose MP3 for compact sharing and everyday listening. Choose WAV when you want uncompressed audio for editing or compatibility with tools that expect a waveform file.",
  },
  {
    q: "What MP3 bitrate should I use for Morse code?",
    a: "For a simple Morse tone, 32 or 48 kbps is often enough. 128 kbps is usually larger than necessary, though it can be useful when you prefer a familiar high setting.",
  },
  {
    q: "Why is a long Morse MP3 file still large?",
    a: "File size still follows runtime. Slower speed, extra Farnsworth spacing, long messages, and tail padding all create more audio to store.",
  },
  {
    q: "Does ZIP make MP3 files smaller?",
    a: "Not meaningfully. MP3 is already compressed, so ZIP is mainly useful for bundling multiple files rather than shrinking one Morse MP3.",
  },
  {
    q: "Can I convert a whole book into Morse MP3 files?",
    a: "Use this page for short direct files. For a whole book or chapter-length text, use the book translator so the audio can be split into manageable parts.",
  },
  {
    q: "Can I change the pitch or tone?",
    a: "Yes. The pitch, tone preset, volume, attack, and release controls change how the generated Morse tone sounds.",
  },
  {
    q: "Can I change the speed and Farnsworth spacing?",
    a: "Yes. WPM changes character speed, and Farnsworth spacing can add extra room between characters for easier listening practice.",
  },
  {
    q: "Is my text uploaded to a server?",
    a: "No. This tool renders and exports the audio in your browser. It does not upload your typed message to generate the MP3 or WAV file.",
  },
  {
    q: "Can I convert an MP3 back into Morse text?",
    a: "No. This page creates MP3 audio from text or typed Morse. Use the Morse code audio decoder for uploaded sound files.",
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code MP3 Generator | Download MP3 or WAV Audio | MorseWords",
    description:
      "Create downloadable Morse audio from text or typed Morse. Export compact MP3 or uncompressed WAV with WPM, Farnsworth, tone, volume, and bitrate controls.",
    path: CANONICAL_PATH,
    keywords:
      "morse code mp3 generator, text to morse code mp3, morse to mp3, morse code to mp3, morse code translator audio mp3, morse code audio download, morse code wav mp3 download",
  });
}

export default function MorseCodeMp3GeneratorRoute() {
  const webApplicationJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Morse Code MP3 Generator",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    "@id": `${CANONICAL_URL}#webapp`,
    url: CANONICAL_URL,
    description:
      "A browser-based Morse audio generator that converts text or typed Morse into downloadable MP3 or WAV audio.",
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
    "@id": `${CANONICAL_URL}#faq`,
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
          description="Create downloadable Morse audio from text or typed Morse, preview the tone, then save a compact MP3 or uncompressed WAV without uploading your message."
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
          title="MP3 vs WAV for downloadable Morse audio"
          description="Choose the file type based on whether you need a compact shareable clip, an editable waveform, or longer audio split into parts."
        >
          <SimpleGrid items={mp3VsWavItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Settings"
          title="Settings that change the audio"
          description="Only the controls shown in the tool affect the generated audio, timing, and downloaded file."
        >
          <SimpleGrid items={settingItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="File size"
          title="MP3 bitrate and ZIP expectations"
          description="Morse audio is simple, but file size still depends on bitrate, speed, spacing, and runtime."
        >
          <SimpleGrid items={bitrateItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Expectations"
          title="Practical download notes"
          description="Most export questions come from long messages, blocked downloads, browser limits, or using the wrong input direction."
        >
          <SimpleGrid items={troubleshootingItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Direction"
          title="Which Morse audio tool to use"
          description="Use the MP3 generator for text-to-audio downloads. Use these related tools when your job is playback, tone testing, long text, video, decoding, or timing."
        >
          <SimpleGrid items={comparisonItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Next tools"
          title="Related Morse audio tools"
          description="These canonical tools cover the nearby audio tasks without using redirect aliases."
        >
          <ActionLinks
            links={[
              { href: ROUTES.audio, label: "Audio translator", primary: true },
              { href: ROUTES.soundGenerator, label: "Sound generator" },
              { href: ROUTES.bookTranslator, label: "Book translator" },
              { href: ROUTES.videoGenerator, label: "Video generator" },
              { href: ROUTES.audioDecoder, label: "Audio decoder" },
              { href: ROUTES.timing, label: "Timing guide" },
              { href: ROUTES.farnsworth, label: "Farnsworth guide" },
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
