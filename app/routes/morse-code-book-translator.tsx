import type { Route } from "./+types/morse-code-book-translator";

import BookTranslatorTool from "~/client/components/morse-code-book-translator/BookTranslatorTool";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
  SimpleGrid,
  WAVE_PAGE_MAIN_CLASS,
} from "~/client/components/shared/MorseLearningLayout";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = ROUTES.bookTranslator;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);
const TITLE = "Book to Morse Code Translator";
const META_TITLE =
  "Book to Morse Code Translator | Long Text to Morse Audio";
const DESCRIPTION =
  "Convert long text, TXT, MD, EPUB, or text-native PDF to Morse code audio, estimate runtime, and download MP3/WAV or optional split ZIP locally.";

const bookFaqItems = [
  {
    q: "Can I convert a whole book to Morse code audio?",
    a: "Yes, when the source is readable text and your browser can handle the length. The tool estimates runtime first, then downloads one audio file by default or split parts when you turn splitting on.",
  },
  {
    q: "What file formats work best?",
    a: "TXT, MD, and EPUB are usually the cleanest formats for long Morse audio. They keep paragraphs and chapters simpler than PDF, which often has page headers, line breaks, and extraction artifacts.",
  },
  {
    q: "Can I upload EPUB files?",
    a: "Yes. Unprotected EPUB files are read locally from their declared reading order. DRM-protected ebooks are not supported.",
  },
  {
    q: "Can I upload PDFs?",
    a: "Yes, if the PDF contains selectable text. Text-native PDFs can be extracted, reviewed, cleaned, and edited before conversion.",
  },
  {
    q: "Why do scanned PDFs not work?",
    a: "A PDF made from page images is a picture of text, not readable text. This page does not include OCR, so it cannot turn those images into Morse source text.",
  },
  {
    q: "Is my uploaded book stored?",
    a: "No. Source text, extracted text, cleaned text, Morse transcripts, audio, and video are processed locally in your browser. They are not uploaded to MorseWords servers, stored in a database, or saved to browser storage by this route.",
  },
  {
    q: "Can I edit extracted text before download?",
    a: "Yes. After extraction, you can review and edit the source text so chapter headings, broken lines, or unwanted notes do not become part of the Morse output.",
  },
  {
    q: "Can I remove or replace repeated words or phrases before conversion?",
    a: "Yes. Cleanup rules can remove repeated source phrases, normalize punctuation, and simplify text before the Morse conversion step.",
  },
  {
    q: "Why does the tool split long Morse audio into parts?",
    a: "Splitting keeps long practice files easier to download, sort, resume, and listen to. It is optional, and the default is one direct MP3 or WAV file.",
  },
  {
    q: "Should I download MP3 or WAV?",
    a: "Use MP3 for long listening files because it is smaller. Use WAV when you need uncompressed audio for editing or a short lossless export.",
  },
  {
    q: "Can I create a Morse video from a book or long text?",
    a: "Yes. Video mode can create WebM output from long-form text, with optional splitting when the source is too long for one comfortable file.",
  },
  {
    q: "What does the full-frame flash warning mean?",
    a: "Full-frame flash video changes the whole frame during Morse marks. That can be uncomfortable or unsafe for some viewers, so use lightbulb or dot mode when you want a smaller flash area.",
  },
  {
    q: "Can I use Project Gutenberg books?",
    a: "Project Gutenberg and other public-domain sources are a good fit when the text is available for your intended use. The cleanup tools can help remove repeated header or footer text.",
  },
  {
    q: "Can I use copyrighted books?",
    a: "Only use books or text you have the right to process and use. You are responsible for the source content and any copyright or usage restrictions that apply to it.",
  },
  {
    q: "What Morse speed should I choose?",
    a: "For listening practice, start with a character speed you can recognize clearly, then use Farnsworth spacing if words feel rushed. Long books are often easier at modest speeds.",
  },
  {
    q: "Why does my PDF extraction look messy?",
    a: "PDFs store page layout, not always clean reading order. Multi-column pages, headers, footers, hyphenation, and page numbers can appear in extracted text, so review before downloading.",
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
      "Long text to Morse code audio",
      "TXT and Markdown source import",
      "Unprotected EPUB source import",
      "Text-native PDF source import",
      "Local MP3 and WAV download",
      "Optional split ZIP bundle",
      "Long-form Morse video preview and WebM export",
      "Browser-local source processing",
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
    mainEntity: bookFaqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  },
];

const howItWorksItems = [
  {
    title: "Load source text",
    text: "Paste directly, upload TXT or MD, or extract readable text from unprotected EPUB and text-native PDF files in your browser.",
  },
  {
    title: "Clean before converting",
    text: "Preview smart punctuation normalization, zero-width cleanup, Gutenberg stripping, and practice-friendly punctuation simplification.",
  },
  {
    title: "Estimate runtime",
    text: "Estimate Morse listening time before download. When you turn on splitting, long sources can use safe section, paragraph, sentence, or word boundaries.",
  },
  {
    title: "Download the audio",
    text: "Download one MP3 or WAV by default. Turn on splitting for a sorted ZIP bundle, or add sidecar files when you need transcripts, settings, or a manifest.",
  },
];

const sourceGuideItems = [
  {
    title: "TXT and Markdown",
    text: "Plain text and simple Markdown are the most predictable sources for long text to Morse audio because headings, paragraphs, and punctuation are easy to review.",
  },
  {
    title: "EPUB books",
    text: "Unprotected EPUB files can work well for chapters and public-domain books because the file includes a reading order. DRM ebooks are not supported.",
  },
  {
    title: "Text-native PDF",
    text: "PDF import is best effort. It works when text is selectable, but page numbers, columns, headers, footers, and hyphenation can still need cleanup.",
  },
  {
    title: "Scanned PDF",
    text: "Image-only scans do not provide selectable text. This page does not run OCR, so use a text source when you want reliable Morse conversion.",
  },
  {
    title: "Public-domain sources",
    text: "Project Gutenberg texts are a practical fit when the work is public domain for your use. Cleanup can remove repeated boilerplate before export.",
  },
  {
    title: "Review before export",
    text: "Always skim the extracted source before downloading. Morse audio faithfully follows the cleaned text, including any extraction mistakes left in place.",
  },
];

const audioGuideItems = [
  {
    title: "One file by default",
    text: "The default download is one MP3 or WAV, not a ZIP. Splitting is opt-in for sources that are too long for one convenient listening file.",
  },
  {
    title: "Split when useful",
    text: "Optional splitting can create sorted parts at the interval you choose, with sidecars such as transcripts or settings only when you ask for them.",
  },
  {
    title: "MP3 for long listening",
    text: "MP3 is usually the right format for books and chapters because it keeps file size manageable while preserving practice timing.",
    href: ROUTES.mp3Generator,
    badge: "MP3",
  },
  {
    title: "WAV for editing",
    text: "WAV is uncompressed and can become large quickly, but it is useful when you plan to edit the audio outside the browser.",
    href: ROUTES.audio,
    badge: "WAV",
  },
  {
    title: "Speed and spacing",
    text: "Character WPM controls how quickly letters sound. Farnsworth spacing keeps characters crisp while widening gaps for learners.",
    href: ROUTES.farnsworth,
    badge: "Timing",
  },
  {
    title: "Tone comfort",
    text: "Tone preset, pitch, and volume affect listening comfort. They do not change the Morse message, only how the signal sounds.",
    href: ROUTES.soundGenerator,
    badge: "Sound",
  },
];

const cleanupGuideItems = [
  {
    title: "Normalize punctuation",
    text: "Long texts often contain smart quotes, dashes, ellipses, footnote markers, or symbols that do not belong in practice audio.",
  },
  {
    title: "Remove repeated text",
    text: "Headers, footers, boilerplate, and repeated phrases can be removed before conversion so they do not appear every few pages.",
  },
  {
    title: "Edit source text",
    text: "Use edit mode for chapter titles, line breaks, or extraction problems. The cleaned source is what becomes Morse audio or video.",
  },
  {
    title: "Check word breaks",
    text: "Spaces and separators matter once text becomes Morse. Use the spacing guide if copied Morse needs cleanup.",
    href: ROUTES.wordSeparator,
    badge: "Spacing",
  },
];

const videoGuideItems = [
  {
    title: "Long-form video",
    text: "Video mode uses the same cleaned source and timing settings to create Morse video output for longer passages.",
  },
  {
    title: "Short-form clips",
    text: "Use the standalone video generator when you only need a short text to Morse code video or a quick pasted-Morse visual.",
    href: ROUTES.videoGenerator,
    badge: "Video",
  },
  {
    title: "Full-frame flash",
    text: "Full-frame flash can be uncomfortable or unsafe for some viewers. Keep that warning visible and choose a smaller visual mode when sharing broadly.",
  },
  {
    title: "WebM expectations",
    text: "Browser video recording is WebM-first. MP4 is not guaranteed because this page does not run a heavy server renderer or ffmpeg/WASM encoder.",
  },
];

const responsibilityItems = [
  {
    title: "Local processing",
    text: "MorseWords processes your source text locally in your browser. Your text and uploaded files are not uploaded to MorseWords servers or stored in a database. This route keeps source text in the page session only; site settings can clear source saved by other tools.",
  },
  {
    title: "Use text you can use",
    text: "You are responsible for the source content you upload or paste, including copyright, license, school, workplace, or publication rules.",
  },
  {
    title: "No OCR or DRM bypass",
    text: "The page does not read scanned images, bypass DRM, fetch remote URLs, or promise perfect PDF extraction.",
  },
  {
    title: "Practical examples",
    text: "Try a public-domain chapter, a classroom reading passage, your own notes, or a short article you have permission to convert.",
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: `${META_TITLE} | MorseWords`,
    description: DESCRIPTION,
    path: CANONICAL_PATH,
    keywords:
      "book to Morse code, long text to Morse audio, text file to Morse code audio, EPUB to Morse audio, PDF to Morse audio, Morse code MP3 WAV download",
  });

export default function MorseCodeBookTranslatorRoute() {
  return (
    <main className={WAVE_PAGE_MAIN_CLASS}>
      <JsonLdScript jsonLd={jsonLd} />
      <PageHero
        eyebrow="Book download"
        title={TITLE}
        description="Prepare long-form source text for Morse code conversion, estimate listening time, and download a local MP3 or WAV file. Split into timed parts only when you choose it."
        aside={
          <DarkNote label="Supported sources" value="TXT MD EPUB PDF">
            TXT and EPUB are best for long downloads. PDF must contain selectable
            text; scanned PDFs are not OCR'd here.
          </DarkNote>
        }
      >
        <ActionLinks
          links={[
            { href: ROUTES.audio, label: "Open audio tool", primary: true },
            { href: ROUTES.mp3Generator, label: "Create MP3 audio" },
            { href: ROUTES.videoGenerator, label: "Short video generator" },
          ]}
        />
      </PageHero>

      <BookTranslatorTool />

      <SectionCard
        eyebrow="Long-form workflow"
        title="How book downloads work"
        description="The page extracts readable text locally, estimates Morse timing, and renders a direct audio file by default. Optional splitting creates timed parts when that fits your workflow."
        layout="stacked"
      >
        <SimpleGrid items={howItWorksItems} variant="plain" />
      </SectionCard>

      <SectionCard
        eyebrow="Book to Morse guide"
        title="Choose a source that will convert cleanly"
        description="Book-length Morse works best when the source already contains real text. The cleaner the source, the cleaner the Morse audio, transcript, and video preview."
        layout="stacked"
      >
        <SimpleGrid items={sourceGuideItems} variant="plain" />
      </SectionCard>

      <SectionCard
        eyebrow="Audio download"
        title="One audio file by default, split parts by choice"
        description="Use direct MP3 or WAV export for normal long text to Morse audio. Turn on splitting only when the source is long enough that smaller listening parts are more useful."
        layout="stacked"
      >
        <SimpleGrid
          items={audioGuideItems}
          variant="plain"
          linkedItemStyle="inline"
        />
      </SectionCard>

      <SectionCard
        eyebrow="Cleanup"
        title="Clean and edit before Morse conversion"
        description="Cleanup is where long-form export becomes usable. Review the extracted source, remove repeated text, and simplify punctuation before rendering audio or video."
        layout="stacked"
      >
        <SimpleGrid
          items={cleanupGuideItems}
          variant="plain"
          linkedItemStyle="inline"
        />
      </SectionCard>

      <SectionCard
        eyebrow="Long video"
        title="Book text can also become Morse video"
        description="Video mode is useful for demonstrations and visual practice, but long exports should stay deliberate because video files take more browser work than audio."
        layout="stacked"
      >
        <SimpleGrid
          items={videoGuideItems}
          variant="plain"
          linkedItemStyle="inline"
        />
      </SectionCard>

      <SectionCard
        eyebrow="Privacy and rights"
        title="Use source text responsibly"
        description="MorseWords gives you local tools for conversion. You choose the source and remain responsible for whether that source is appropriate to process, download, and share."
        layout="stacked"
      >
        <SimpleGrid items={responsibilityItems} variant="plain" />
      </SectionCard>

      <div id="faq">
        <FaqSectionGeneric
          title="Book to Morse code FAQ"
          description="Answers for long text, EPUB, PDF, MP3, WAV, video, cleanup, privacy, and source responsibility."
          items={bookFaqItems}
        />
      </div>

      <BreadcrumbTrail
        current="Book to Morse Code Translator"
        placement="contentFooter"
      />
    </main>
  );
}
