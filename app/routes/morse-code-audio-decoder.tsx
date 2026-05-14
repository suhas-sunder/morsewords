import * as React from "react";
import type { Route } from "./+types/morse-code-audio-decoder";

import MorseAudioDecoderTool from "~/client/components/morse-code-audio-decoder/MorseAudioDecoderTool";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  PageHero,
  SectionCard,
  SimpleGrid,
  StaticPanel,
} from "~/client/components/shared/MorseLearningLayout";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-audio-decoder";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Audio Decoder | Decode Morse from Audio Files | MorseWords",
    description:
      "Upload a browser-supported audio file to decode clean single-tone Morse into raw dots and dashes plus readable text, with timing notes and troubleshooting guidance.",
    path: CANONICAL_PATH,
    keywords:
      "morse code audio decoder, audio to morse code, morse code audio to text, morse code sound to text, mp3 morse code decoder, wav morse code decoder",
  });
}

const howItWorksItems = [
  {
    title: "Upload audio",
    text: "Choose a browser-supported audio file. WAV is usually the safest choice, while MP3, M4A, AAC, and OGG depend on browser decoding support.",
  },
  {
    title: "Find tone regions",
    text: "The decoder converts the file to mono, measures a short amplitude envelope, then separates beep regions from silence.",
  },
  {
    title: "Estimate timing",
    text: "Tone lengths are compared with the detected timing unit so short beeps become dots, longer beeps become dashes, and gaps become letters or words.",
  },
  {
    title: "Decode text",
    text: "The raw Morse output is passed through the same MorseWords decoder used for pasted dots and dashes, so unknown groups remain visible.",
  },
];

const betterResultsItems = [
  {
    title: "Use one clean tone",
    text: "Record a steady single beep tone instead of music, speech, static, mixed tones, or a noisy radio channel.",
  },
  {
    title: "Keep volume steady",
    text: "Avoid clipped audio and large volume swings. A consistent tone makes threshold detection more reliable.",
  },
  {
    title: "Preserve clear spacing",
    text: "Dot, dash, letter, and word gaps must be audible. If words run together, use the word gap setting or clean the Morse manually afterward.",
  },
  {
    title: "Try WAV first",
    text: "If a compressed file fails or decodes poorly, export or record a WAV file and try again in the same browser.",
  },
];

const outputItems = [
  {
    title: "Raw Morse",
    text: "The detected dot and dash stream, with spaces between letters and slashes between detected word gaps.",
  },
  {
    title: "Decoded text",
    text: "Readable text from the raw Morse. Smart spacing can recover obvious joined words, while exact Morse gaps remain available in settings.",
  },
  {
    title: "Timing summary",
    text: "Estimated dot length, speed, tone count, gap count, and confidence so you can tell whether the result is stable.",
  },
  {
    title: "Low confidence",
    text: "A low-confidence result is still shown, but it should be checked against the raw Morse and original audio.",
  },
];

const troubleshootingItems = [
  {
    title: "No tones detected",
    text: "Raise the recording volume, increase sensitivity, or try a cleaner single-tone WAV file.",
  },
  {
    title: "Wrong characters",
    text: "Check whether dots and dashes are clipped, stretched, or mixed with background noise. Manual expected speed can help steady recordings.",
  },
  {
    title: "Words run together",
    text: "Lower word gap strictness or open the raw output in the word separator when the audio has short word spaces.",
  },
  {
    title: "Format issue",
    text: "Browser audio support varies. If MP3, M4A, AAC, or OGG fails, retry with WAV.",
  },
];

export default function MorseCodeAudioDecoderRoute() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${CANONICAL_URL}#webapp`,
      name: "Morse Code Audio Decoder",
      applicationCategory: "UtilityApplication",
      operatingSystem: "All",
      url: CANONICAL_URL,
      description:
        "Browser-based audio-to-Morse decoder for uploading clean single-tone Morse recordings and returning raw Morse plus readable text.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Upload browser-supported audio files",
        "Decode clean single-tone Morse beeps",
        "Return raw Morse and readable text",
        "Show timing and confidence information",
        "Copy or download decoded results",
      ],
      isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${CANONICAL_URL}#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
        {
          "@type": "ListItem",
          position: 2,
          name: "Morse Code Audio Decoder",
          item: CANONICAL_URL,
        },
      ],
    },
  ];

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Audio to Morse"
          title="Morse Code Audio Decoder"
          description="Upload a clean Morse audio file and decode the beeps into raw dots and dashes plus readable text. The tool works best with steady single-tone recordings and keeps uncertain results visible."
        />

        <MorseAudioDecoderTool />

        <SectionCard
          eyebrow="Audio decoder"
          title="How the audio decoder works"
          description="The tool runs locally in your browser. It does not upload your audio file to MorseWords."
          layout="stacked"
        >
          <SimpleGrid items={howItWorksItems} />
        </SectionCard>

        <SectionCard
          eyebrow="Better results"
          title="How to make audio easier to decode"
          description="Audio decoding is most reliable when the file contains clear Morse beeps with simple spacing."
          layout="stacked"
        >
          <SimpleGrid items={betterResultsItems} variant="cards" />
        </SectionCard>

        <SectionCard
          eyebrow="Output guide"
          title="What the outputs mean"
          description="Use the raw Morse, decoded text, and timing summary together instead of trusting one field blindly."
          layout="stacked"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {outputItems.map((item) => (
              <StaticPanel as="article" key={item.title}>
                <h3 className="mw-heading text-lg font-extrabold leading-snug text-sky-950">
                  {item.title}
                </h3>
                <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                  {item.text}
                </p>
              </StaticPanel>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Troubleshooting"
          title="When audio decoding does not look right"
          description="The decoder is practical for clean Morse audio, but it is not a professional radio signal processor."
          layout="stacked"
        >
          <SimpleGrid items={troubleshootingItems} />
        </SectionCard>

        <SectionCard
          eyebrow="Related tools"
          title="Use the result with other MorseWords tools"
          description="After decoding audio, clean the raw Morse, replay it, or convert text back into a reply."
        >
          <ActionLinks
            links={[
              { href: "/audio", label: "Generate Morse audio", primary: true },
              { href: "/morse-code-reader", label: "Read pasted Morse" },
              { href: "/morse-code-decoder", label: "Morse code decoder" },
              { href: "/morse-code-encoder", label: "Morse code encoder" },
              { href: "/morse-code-word-separator", label: "Word separator" },
              { href: "/copy-and-paste-morse-code", label: "Copy-paste guide" },
              {
                href: "/how-to-separate-words-in-morse-code",
                label: "Spacing guide",
              },
            ]}
          />
        </SectionCard>

        <JsonLdScript jsonLd={jsonLd} />
      </main>
      <BreadcrumbTrail current="Morse Code Audio Decoder" />
    </div>
  );
}
