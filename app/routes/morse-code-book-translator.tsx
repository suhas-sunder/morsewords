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
  "Convert long text, TXT, MD, EPUB, or text-native PDF into Morse audiobook-style MP3/WAV files or WebM video locally, with cleanup and optional split ZIP parts.";

const bookFaqItems = [
  {
    q: "Can I make a Morse code audiobook?",
    a: "Yes. You can turn readable long-form text into audiobook-style Morse listening files, then choose one MP3 or WAV file by default or split parts for easier practice sessions.",
  },
  {
    q: "Can I convert a whole book to Morse code audio?",
    a: "Yes, when the source is readable text and your browser can handle the length. For very long books, chapters or timed parts are usually easier to render, download, resume, and review.",
  },
  {
    q: "Can I convert a chapter instead of a full book?",
    a: "Yes. A single chapter is often the best unit for Morse listening practice because it keeps the runtime manageable and makes cleanup easier to check before export.",
  },
  {
    q: "What file formats work best?",
    a: "Pasted text, TXT, MD, and EPUB are usually the cleanest formats for long Morse audio. Text-native PDF can work too, but page layout often adds headers, footers, broken lines, or extraction artifacts.",
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
    q: "Is my source uploaded to MorseWords servers?",
    a: "No. MorseWords processes your source text and uploaded files locally in your browser. The book translator does not upload your source to MorseWords servers.",
  },
  {
    q: "Is the source stored in a database or browser storage?",
    a: "No database is used for this route. The book translator keeps source text in the current browser session while you work, and generated MP3, WAV, WebM, and ZIP files are not stored in browser storage.",
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
    q: "What happens if the source is too large?",
    a: "Very long sources can take time because extraction, cleanup, Morse timing, audio rendering, and video recording all run in the browser. If a full book feels slow, convert one chapter or a shorter section at a time.",
  },
  {
    q: "Why does the tool split long Morse audio into parts?",
    a: "Splitting keeps long practice files easier to download, sort, resume, and listen to. It is optional, and the default is one direct MP3 or WAV file.",
  },
  {
    q: "Can I save the audio as one file?",
    a: "Yes. No split is the default, so the normal download is one direct MP3 or WAV file when your browser can render it comfortably.",
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
    q: "Can I show the translated text in the video?",
    a: "Yes. Video settings can show visual Morse only, plain text, Morse text, or both depending on the practice or demonstration style you want.",
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
      "Morse audiobook-style practice files",
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

const longFormUseItems = [
  {
    title: "What this tool does",
    text: "Convert long-form source text into Morse code audio or video. It is built for chapters, public-domain books, notes, lesson material, and passages that are too long for a normal translator.",
  },
  {
    title: "Who it helps",
    text: "Morse learners, teachers, and practice-file makers can turn readable source text into listening drills, long copy sessions, or Morse audiobook-style playback.",
  },
  {
    title: "Book-to-audio workflow",
    text: "Paste text or upload TXT, MD, EPUB, or text-native PDF, review the extracted source, estimate runtime, then export compact MP3, uncompressed WAV, or browser-native WebM video.",
  },
  {
    title: "Long-form practice files",
    text: "Use a chapter, public-domain reading passage, or personal notes to make Morse code listening practice files that can be repeated in short sessions.",
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
    title: "Pasted source text",
    text: "Paste a chapter, notes, a training passage, or an excerpt directly when you already have clean text and want a fast long text to Morse code workflow.",
  },
  {
    title: "TXT and Markdown",
    text: "Plain text and simple Markdown are the most predictable sources for long text to Morse audio because headings, paragraphs, and punctuation are easy to review.",
  },
  {
    title: "EPUB books",
    text: "Unprotected EPUB files can work well for chapters and public-domain books because the file includes a reading order. Protected or DRM ebooks are not supported.",
  },
  {
    title: "Text-native PDF",
    text: "PDF import is best effort. It works when text is selectable, but page numbers, columns, headers, footers, hyphenation, and reading order can still need cleanup.",
  },
  {
    title: "Scanned PDF",
    text: "Image-only scans do not provide selectable text. This page does not run OCR, so use a text source when you want reliable Morse conversion.",
  },
  {
    title: "DRM and protected ebooks",
    text: "The page reads ordinary browser-accessible files. It does not bypass DRM, unlock protected ebooks, fetch remote URLs, or process books from cloud accounts.",
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
    title: "MP3 for long listening",
    text: "MP3 is usually the right format for books, chapters, and Morse audiobook-style practice because it keeps file size manageable while preserving timing.",
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
    title: "Lower bitrates can work",
    text: "Morse is a simple tone, not full music. Lower MP3 bitrates are often usable for practice, especially when you are trying to keep long files compact.",
  },
  {
    title: "Duration drives size",
    text: "Speed, Farnsworth spacing, word gaps, tail padding, and split settings affect runtime. Longer runtime usually means larger MP3, WAV, or ZIP downloads.",
    href: ROUTES.timing,
    badge: "Timing",
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

const splitGuideItems = [
  {
    title: "No split",
    text: "No split is the default. Use it when you want one direct MP3 or WAV file and the estimated runtime is comfortable for your browser and listening plan.",
  },
  {
    title: "Split by duration",
    text: "Duration splitting makes parts around the target length you choose, which is useful for daily listening, classroom drills, or shorter repeatable practice sessions.",
  },
  {
    title: "Split by source sections",
    text: "When uploaded source sections are available, the tool can use those hints. EPUB spine order is helpful, but extracted book chapters are not always perfectly preserved.",
  },
  {
    title: "Why chapters can be hard",
    text: "Books do not all mark chapters the same way. PDF layout, front matter, and repeated headings can blur the boundary between a chapter title and ordinary text.",
  },
  {
    title: "Why parts help",
    text: "Parts make long Morse listening files easier to resume, sort, repeat, and move between devices without committing to one very large export.",
  },
  {
    title: "When ZIP appears",
    text: "A ZIP bundle is used when multiple media parts or requested sidecar files need to travel together. A single audio file stays a direct download when possible.",
  },
];

const cleanupGuideItems = [
  {
    title: "Edit extracted source",
    text: "Use edit mode after extraction to remove front matter, repair broken lines, rename chapter headings, or keep only the passage you actually want to hear.",
  },
  {
    title: "Custom cleanup rules",
    text: "Replacement rules can remove repeated source phrases or change text before conversion, which is helpful when a PDF repeats the same header or footer on every page.",
  },
  {
    title: "Project Gutenberg boilerplate",
    text: "Public-domain texts often include license, title, and ending sections. Strip or trim any boilerplate you do not want repeated in your Morse practice file.",
  },
  {
    title: "Normalize punctuation",
    text: "Long texts often contain smart quotes, dashes, ellipses, footnote markers, or symbols that do not belong in practice audio.",
  },
  {
    title: "Unsupported characters",
    text: "If characters cannot be represented in the current Morse output, review them before export. Replace important words rather than leaving confusing gaps.",
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
    title: "Browser-native WebM",
    text: "Video mode exports WebM because that is the browser-native recording format available without uploading the job to a server renderer.",
  },
  {
    title: "Visual Morse styles",
    text: "Choose lightbulb, dot, full-frame flash, or animated Morse text depending on whether the video is for practice, demonstration, or visual reference.",
  },
  {
    title: "Text display modes",
    text: "Optional plain text and Morse text overlays can help viewers follow a long passage, compare source to code, or focus on signal-only practice.",
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
  {
    title: "Browser support varies",
    text: "Long video exports depend on MediaRecorder, canvas capture, device performance, and browser codec support. Audio is usually the simpler long-form export.",
  },
];

const privacyRightsItems = [
  {
    title: "Local browser processing",
    text: "MorseWords processes your source text locally in your browser. Your text and uploaded files are not uploaded to MorseWords servers or stored in a database. If source saving is enabled for supported tools, saved source is stored only in this browser on this device and can be cleared from site settings.",
  },
  {
    title: "Book route session scope",
    text: "For this book translator route, source text stays in the current browser session while the page is open. It is not saved to localStorage or sessionStorage by this route.",
  },
  {
    title: "Generated media is not stored",
    text: "Generated MP3, WAV, WebM, and ZIP files are created for download. They are not stored in browser storage, and uploaded source files are not sent to MorseWords servers.",
  },
  {
    title: "Use text you can use",
    text: "You are responsible for the source content you upload or paste, including copyright, license, school, workplace, or publication rules.",
  },
  {
    title: "Public-domain sources",
    text: "Project Gutenberg and other public-domain works are a good fit when the text is available for your intended use. Check the source terms before sharing exports.",
  },
  {
    title: "No rights advice",
    text: "MorseWords helps with local conversion, not legal clearance. When in doubt, use your own writing, licensed material, or public-domain passages.",
  },
];

const workflowGuideItems = [
  {
    title: "Project Gutenberg chapter to MP3",
    text: "Paste or upload a public-domain chapter, remove the Gutenberg header or footer if it appears in the excerpt, choose MP3, estimate the runtime, and download one listening file.",
  },
  {
    title: "Practice audiobook",
    text: "Convert a public-domain story or a few chapters into shorter Morse audio parts so you can repeat one section until the rhythm feels familiar.",
  },
  {
    title: "Class notes to listening practice",
    text: "Paste your own notes, simplify punctuation, and export compact audio for spaced review while walking, commuting, or doing short listening sessions.",
  },
  {
    title: "Long passage to video",
    text: "Switch to video mode when you need a visual Morse demonstration. Use text display options when viewers should see the source, the Morse, or both.",
  },
  {
    title: "Daily spaced parts",
    text: "Split a long text by target duration to create a sequence of practice parts, then repeat one part per day before moving to the next.",
  },
];

const limitationsGuideItems = [
  {
    title: "No OCR",
    text: "Scanned PDF pages and image-only books are not converted because this route does not perform optical character recognition.",
  },
  {
    title: "No DRM extraction",
    text: "Protected ebooks are outside the tool's scope. Use readable text, unprotected EPUB, TXT, MD, or text-native PDF sources.",
  },
  {
    title: "PDF extraction can be imperfect",
    text: "PDFs preserve page layout more than reading order. Columns, page numbers, hyphenation, headers, and footers may need manual cleanup.",
  },
  {
    title: "Very long output takes time",
    text: "Book-length audio and especially video can take noticeable browser time. Chapters, excerpts, and split parts are easier to render and check.",
  },
  {
    title: "MP4 is not guaranteed",
    text: "Video export is WebM-first because it uses browser recording APIs. Browser and codec support determine whether a WebM export can be created.",
  },
  {
    title: "Full-frame flash needs care",
    text: "Full-frame flash can be uncomfortable or unsafe for some viewers, including people with photosensitive epilepsy or light sensitivity.",
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
      "book to Morse code, book to Morse audio, Morse code audiobook, long text to Morse audio, Project Gutenberg to Morse code, EPUB to Morse audio, PDF to Morse audio, TXT file to Morse code audio, Morse code MP3 WAV WebM download",
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
        eyebrow="Long-form guide"
        title="Turn books, chapters, and long text into Morse practice files"
        description="Use this page when a normal translator is too small for the job. It is meant for readable source text, longer listening practice, and local audio or video export."
        layout="stacked"
      >
        <SimpleGrid items={longFormUseItems} variant="plain" />
      </SectionCard>

      <SectionCard
        eyebrow="Workflow"
        title="How book downloads work"
        description="The page extracts readable text locally, estimates Morse timing, and renders a direct audio file by default. Optional splitting creates timed parts when that fits your workflow."
        layout="stacked"
      >
        <SimpleGrid items={howItWorksItems} variant="plain" />
      </SectionCard>

      <SectionCard
        eyebrow="Source types"
        title="Supported source types for long text"
        description="Book-length Morse works best when the source already contains real text. The cleaner the source, the cleaner the Morse audio, transcript, and video preview."
        layout="stacked"
      >
        <SimpleGrid items={sourceGuideItems} variant="plain" />
      </SectionCard>

      <SectionCard
        eyebrow="Audio download"
        title="Choose MP3 or WAV for long Morse audio"
        description="Use direct MP3 or WAV export for normal long text to Morse audio. Morse audio is simpler than music, so compact MP3 settings can still be useful for long practice files."
        layout="stacked"
      >
        <SimpleGrid
          items={audioGuideItems}
          variant="plain"
          linkedItemStyle="inline"
        />
      </SectionCard>

      <SectionCard
        eyebrow="Splitting"
        title="Make long Morse output easier to listen to"
        description="Splitting is optional. Use it when a full book, chapter collection, or long training text is easier to handle as several named parts."
        layout="stacked"
      >
        <SimpleGrid items={splitGuideItems} variant="plain" />
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
        eyebrow="Video output"
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
        title="Private local processing and source responsibility"
        description="MorseWords gives you local tools for conversion. You choose the source and remain responsible for whether that source is appropriate to process, download, and share."
        layout="stacked"
      >
        <SimpleGrid items={privacyRightsItems} variant="plain" />
      </SectionCard>

      <SectionCard
        eyebrow="Workflows"
        title="Practical long-form Morse workflows"
        description="A good book-to-Morse workflow starts small: choose a clean chapter or excerpt, review the source, then export a file length you will actually practice with."
        layout="stacked"
      >
        <SimpleGrid items={workflowGuideItems} variant="plain" />
      </SectionCard>

      <SectionCard
        eyebrow="Limitations"
        title="Limits to plan around"
        description="Long-form browser export is useful, but it still depends on readable source text, local device performance, and browser media support."
        layout="stacked"
      >
        <SimpleGrid items={limitationsGuideItems} variant="plain" />
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
