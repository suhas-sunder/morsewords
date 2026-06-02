import * as React from "react";
import type { Route } from "./+types/morse-code-audio-decoder";

import MorseAudioDecoderTool from "~/client/components/morse-code-audio-decoder/MorseAudioDecoderTool";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  PageHero,
  SectionCard,
  SimpleGrid,
  StaticPanel,
} from "~/client/components/shared/MorseLearningLayout";
import { ROUTES } from "~/client/data/routes";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = ROUTES.audioDecoder;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

const faqItems = [
  {
    q: "Can this decode Morse code from an audio file?",
    a: "Yes, when the file contains clear Morse-like tone beeps. Upload a local audio file, run Decode audio, and review the raw Morse plus decoded text.",
  },
  {
    q: "What audio files work best?",
    a: "Short, clean recordings with one steady tone, consistent volume, and clear silence between dots, dashes, letters, and words work best.",
  },
  {
    q: "Can I upload MP3 files?",
    a: "Yes, if your browser can decode the MP3. MP3 can work for clean signals, but compression, noise, and clipped edges can make Morse detection less reliable.",
  },
  {
    q: "Is WAV better for Morse decoding?",
    a: "Usually. WAV keeps the tone and silence edges cleaner, so it is the safest format to try when an MP3, M4A, AAC, OGG, or other compressed file decodes poorly.",
  },
  {
    q: "Why did the decoder miss letters or spaces?",
    a: "The timing gaps may be too short, the tone may be clipped, the recording may be noisy, or the speed estimate may not match the audio. Check the raw Morse before trusting the text.",
  },
  {
    q: "Can it decode speech or music?",
    a: "No. This decoder is for Morse-like beep tones. It does not transcribe spoken dots and dashes, music, mixed sound effects, or general audio into Morse.",
  },
  {
    q: "Can it decode noisy recordings?",
    a: "Sometimes, but noisy recordings are less reliable. Use sensitivity and smoothing for small issues, but a cleaner single-tone recording is usually the real fix.",
  },
  {
    q: "Can I create a clean test file first?",
    a: "Yes. Use the sound generator for a quick clean tone test, or use the MP3 generator when you want a downloadable MP3 or WAV file to upload here.",
  },
  {
    q: "Can I convert text into Morse audio instead?",
    a: "Use the audio hub, sound generator, or MP3 generator for text-to-Morse audio. This page goes the opposite direction: audio file to raw Morse and text.",
  },
  {
    q: "Is my audio uploaded to a server?",
    a: "No. The page decodes the selected file in your browser with the Web Audio API. The tool does not upload your audio file to MorseWords.",
  },
  {
    q: "What should I change if the decoder output looks wrong?",
    a: "Try WAV, trim extra silence, use one steady tone, lower background noise, then adjust sensitivity, gap style, word gap strictness, or character speed in advanced settings.",
  },
  {
    q: "What is the difference between decoding audio and practicing by ear?",
    a: "Audio decoding analyzes a file and returns a best-effort text result. Audio practice and quiz pages train you to recognize Morse by listening without relying on automatic decoding.",
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Audio Decoder | Audio to Morse Text | MorseWords",
    description:
      "Upload WAV, MP3, or browser-supported audio to decode clean Morse tones into dots, dashes, and text. Learn limits, timing, and troubleshooting.",
    path: CANONICAL_PATH,
    keywords:
      "morse code audio decoder, decode morse code audio, audio to morse code, morse audio to text, morse code sound decoder, mp3 to morse code, wav to morse code, morse mp3 to text, morse wav to text, convert morse audio to text, decode morse from sound",
  });
}

const decoderFitItems = [
  {
    title: "Use it for Morse-like tone audio",
    text: "Upload a local file that already contains keyed Morse beeps. The page returns raw dots and dashes plus decoded text when the signal is clean enough.",
  },
  {
    title: "Do not use it for speech or music",
    text: "The decoder is not a speech recognizer or music transcriber. Spoken dots and dashes, songs, radio chatter, or mixed effects are outside the target use.",
  },
  {
    title: "Expect a best-effort result",
    text: "Automatic audio decoding can miss letters, word gaps, or noisy tones. Treat the decoded text as a starting point and compare it with the raw Morse.",
  },
  {
    title: "Keep files short and local",
    text: "Oversized or very long files are rejected before analysis. The selected audio is decoded in your browser instead of being uploaded to MorseWords.",
  },
];

const howItWorksItems = [
  {
    title: "Upload audio",
    text: "Choose a browser-supported file such as WAV, MP3, M4A, AAC, or OGG. Browser decoding support varies, so WAV is the safest fallback.",
  },
  {
    title: "Find tone regions",
    text: "The decoder converts the audio to mono, measures short amplitude windows, and separates Morse-like tone regions from silence.",
  },
  {
    title: "Estimate timing",
    text: "Tone lengths and silence gaps are compared with a timing unit so short beeps become dots, longer beeps become dashes, and gaps become letters or words.",
  },
  {
    title: "Decode text",
    text: "The raw Morse output is passed through the same MorseWords decoder used for pasted dots and dashes, so unknown groups remain visible.",
  },
];

const betterResultsItems = [
  {
    title: "Try WAV before compressed audio",
    text: "WAV preserves tone edges and quiet gaps better than many compressed files. MP3 may work, but compression can blur short Morse marks.",
  },
  {
    title: "Use one steady pitch",
    text: "A consistent tone frequency is easier to separate from silence. Sweeps, mixed pitches, and drifting audio can make detection unstable.",
  },
  {
    title: "Keep volume steady",
    text: "Avoid clipped audio, very quiet audio, and large volume swings. A stable level makes the threshold easier to choose.",
  },
  {
    title: "Preserve timing gaps",
    text: "Dot, dash, letter, and word gaps must be audible. If words run together, adjust gap settings or clean the raw Morse manually afterward.",
  },
  {
    title: "Trim dead air carefully",
    text: "Long silence before or after the Morse usually gets ignored, but cleaner clips are easier to review and less likely to hit duration limits.",
  },
  {
    title: "Avoid background noise",
    text: "Static, speech, music, and room noise can look like extra dots and dashes. Generate a clean test signal first when you need a controlled sample.",
  },
];

const outputItems = [
  {
    title: "Raw Morse",
    text: "The detected dot and dash stream, with spaces between letters and slashes between detected word gaps.",
  },
  {
    title: "Decoded text",
    text: "Readable text from the raw Morse. Smart spacing can recover some obvious joined words, while exact Morse gaps remain available in settings.",
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
    text: "Raise the recording volume, increase sensitivity, trim unrelated noise, or try a cleaner single-tone WAV file.",
  },
  {
    title: "Wrong characters",
    text: "Check whether dots and dashes are clipped, stretched, or mixed with background noise. A manual character speed can help steady recordings.",
  },
  {
    title: "Missing spaces",
    text: "Lower word gap strictness, try Farnsworth gap style, or review the raw Morse when the original audio has short word spaces.",
  },
  {
    title: "File too large or too long",
    text: "Use a shorter clip before decoding. Long-form text-to-audio work belongs on the book translator, not the audio decoder.",
  },
  {
    title: "Speech, music, or mixed audio",
    text: "This page looks for Morse-like beeps. It will not reliably decode spoken words, songs, background music, or crowded mixed audio.",
  },
  {
    title: "Format issue",
    text: "Browser audio support varies. If MP3, M4A, AAC, OGG, or another compressed file fails, retry with WAV.",
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
        "Browser-based audio-to-Morse decoder for uploading clean Morse tone recordings and returning raw Morse plus readable text.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Upload WAV, MP3, and other browser-supported audio files",
        "Decode clean single-tone Morse beeps into raw Morse",
        "Convert Morse audio to readable text when timing is clear",
        "Show timing and confidence information",
        "Advanced sensitivity, gap, and speed settings",
        "Copy or download decoded results",
        "Local browser-based audio analysis",
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
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${CANONICAL_URL}#faq`,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Audio to Morse"
          title="Morse Code Audio Decoder"
          description="Upload a local WAV, MP3, or browser-supported audio file and decode clean Morse-like tones into raw dots and dashes plus readable text. The tool works best with steady single-tone recordings and keeps uncertain results visible."
        />

        <MorseAudioDecoderTool />

        <SectionCard
          eyebrow="Decoder scope"
          title="What this audio-to-Morse decoder can do"
          description="Use it for local files that already contain Morse tone audio. It is honest about uncertainty when the recording is noisy, compressed, or poorly spaced."
          layout="stacked"
        >
          <SimpleGrid items={decoderFitItems} />
        </SectionCard>

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
          title="Best recordings for Morse audio to text"
          description="Audio decoding is most reliable when the file contains clear beeps, stable timing, and simple silence gaps."
          layout="stacked"
        >
          <SimpleGrid items={betterResultsItems} />
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
          description="The decoder is practical for clean Morse audio, but it is not a professional radio signal processor or a general audio transcription tool."
          layout="stacked"
        >
          <SimpleGrid items={troubleshootingItems} />
        </SectionCard>

        <SectionCard
          eyebrow="Related tools"
          title="Related Morse audio tools"
          description="Move to the right canonical tool when you need to generate clean test audio, create long-form output, or practice listening by ear."
        >
          <ActionLinks
            links={[
              { href: ROUTES.audio, label: "Audio hub", primary: true },
              { href: ROUTES.soundGenerator, label: "Sound generator" },
              { href: ROUTES.mp3Generator, label: "MP3/WAV generator" },
              { href: ROUTES.bookTranslator, label: "Book translator" },
              { href: ROUTES.videoGenerator, label: "Video generator" },
              { href: ROUTES.audioPractice, label: "Audio practice" },
              { href: ROUTES.audioQuiz, label: "Audio quiz" },
              { href: ROUTES.timing, label: "Timing guide" },
              { href: ROUTES.farnsworth, label: "Farnsworth guide" },
            ]}
          />
        </SectionCard>

        <div id="faq">
          <FaqSectionGeneric
            title="Morse code audio decoder FAQ"
            items={faqItems}
          />
        </div>

        <JsonLdScript jsonLd={jsonLd} />
      </main>
      <BreadcrumbTrail current="Morse Code Audio Decoder" />
    </div>
  );
}
