import * as React from "react";
import { Link } from "react-router";

import { DownloadIcon } from "~/client/assets/svg/Icons";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  Eyebrow,
  PageHero,
  WAVE_PAGE_MAIN_CLASS,
} from "~/client/components/shared/MorseLearningLayout";
import {
  ToolButton,
  ToolPanel,
  toolControlButtonClass,
} from "~/client/components/shared/ToolWorkspace";
import { textToMorse } from "~/client/components/shared/morseUtils";
import {
  formatMorseBookAuthors,
  getMorseBookAuthorDisplay,
} from "~/client/data/morseBookDisplay";
import {
  getMorseBookSuitability,
  morseBookSuitabilityLabel,
} from "~/client/data/morseBookSuitability";
import type {
  MorseBookManifest,
  MorseBookSectionJson,
} from "~/client/data/morseBookTypes";
import {
  morseAudiobookPath,
  morseBookPath,
  morseBookPrintPath,
} from "~/client/data/morseBooks";
import { ROUTES, absoluteUrl } from "~/client/data/routes";

type PrintableLayout = "study-sheet" | "morse-only" | "side-by-side";
type OutputMode = "pairs" | "both" | "morse" | "text";
type SectionScope = "default" | "full" | "selected";

type PrintableLine = {
  id: string;
  text: string;
  morse: string;
  sectionTitle?: string;
};

type PrintablePage = {
  lines: PrintableLine[];
  pageNumber: number;
};

type PrintableBookSource = {
  book: MorseBookManifest;
  sections: MorseBookSectionJson[];
};

type PrintableMorsePagesProps =
  | {
      kind: "custom";
      canonicalPath: string;
      schema: unknown[];
    }
  | {
      kind: "book";
      bookSource: PrintableBookSource;
      canonicalPath: string;
      schema: unknown[];
    };

const CUSTOM_SAMPLE =
  "SOS HELP\nLearn Morse code one line at a time.\nPrint this page for a short practice session.";
const SITE_LABEL = "MorseWords.com";
const CUSTOM_QR_URL = absoluteUrl(ROUTES.printablePages);
const LINES_PER_PAGE = 9;
const MAX_PRINT_LINE_LENGTH = 96;
const QR_SIZE = 148;

let qrCodeModulePromise: Promise<typeof import("qrcode")> | null = null;

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function authorText(book: MorseBookManifest) {
  return formatMorseBookAuthors(book.author);
}

function sectionDisplayName(section: MorseBookSectionJson) {
  return section.title ? `${section.label}: ${section.title}` : section.label;
}

function normalizePrintableLines(text: string) {
  return text
    .replace(/\r\n|\r/g, "\n")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => splitLongLine(line, MAX_PRINT_LINE_LENGTH));
}

function splitLongLine(line: string, maxLength: number) {
  if (line.length <= maxLength) return [line];
  const words = line.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxLength) {
      current = next;
      return;
    }
    if (current) chunks.push(current);
    current = word.length > maxLength ? word.slice(0, maxLength) : word;
  });

  if (current) chunks.push(current);
  return chunks;
}

function printableLinesFromText(text: string, prefix: string) {
  return normalizePrintableLines(text).map((line, index) => ({
    id: `${prefix}-${index}`,
    text: line,
    morse: textToMorse(line, { wordSeparator: "slash" }),
  }));
}

function printableLinesFromSections(sections: MorseBookSectionJson[]) {
  return sections.flatMap((section) =>
    normalizePrintableLines(section.morseSourceText || section.displayText).map(
      (line, index) => ({
        id: `${section.sectionId}-${index}`,
        text: line,
        morse: textToMorse(line, { wordSeparator: "slash" }),
        sectionTitle: sectionDisplayName(section),
      }),
    ),
  );
}

function chunkLines(lines: PrintableLine[]) {
  const pages: PrintablePage[] = [];
  for (let index = 0; index < lines.length; index += LINES_PER_PAGE) {
    pages.push({
      lines: lines.slice(index, index + LINES_PER_PAGE),
      pageNumber: pages.length + 1,
    });
  }
  return pages.length > 0 ? pages : [{ lines: [], pageNumber: 1 }];
}

function defaultSectionIds(book: MorseBookManifest) {
  const defaults = book.sections
    .filter((section) => section.includeByDefault)
    .map((section) => section.id);
  return defaults.length > 0
    ? defaults
    : book.sections.slice(0, 1).map((section) => section.id);
}

function useQrCode(url: string) {
  const [qrCodeUrl, setQrCodeUrl] = React.useState("");
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    setQrCodeUrl("");
    setFailed(false);

    if (!qrCodeModulePromise) {
      qrCodeModulePromise = import("qrcode");
    }

    qrCodeModulePromise
      .then((module) =>
        module.toDataURL(url, {
          errorCorrectionLevel: "M",
          margin: 1,
          scale: 4,
          width: QR_SIZE,
          color: { dark: "#111317", light: "#ffffff" },
        }),
      )
      .then((dataUrl) => {
        if (alive) setQrCodeUrl(dataUrl);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });

    return () => {
      alive = false;
    };
  }, [url]);

  return { failed, qrCodeUrl };
}

function PrintStyles() {
  return (
    <style>{`
      @media print {
        @page { margin: 0.5in; size: letter; }
        html, body { background: #ffffff !important; }
        .mw-nav-shell,
        [data-nosnippet],
        .mw-print-actions,
        .mw-print-hide {
          display: none !important;
        }
        .mw-page-content,
        .mw-print-main {
          display: block !important;
          max-width: none !important;
          padding: 0 !important;
          margin: 0 !important;
          overflow: visible !important;
        }
        .mw-print-preview-shell {
          background: #ffffff !important;
          padding: 0 !important;
          border-radius: 0 !important;
        }
        .mw-print-page {
          break-after: page;
          page-break-after: always;
          box-shadow: none !important;
          border: 0 !important;
          margin: 0 !important;
          min-height: auto !important;
        }
        .mw-print-page:last-child {
          break-after: auto;
          page-break-after: auto;
        }
      }
    `}</style>
  );
}

export default function PrintableMorsePages(props: PrintableMorsePagesProps) {
  const isBook = props.kind === "book";
  const bookSource = isBook ? props.bookSource : null;
  const book = bookSource?.book ?? null;
  const allSections = bookSource?.sections ?? [];
  const suitabilityProfile = book ? getMorseBookSuitability(book.slug) : null;
  const [customText, setCustomText] = React.useState(CUSTOM_SAMPLE);
  const [layout, setLayout] = React.useState<PrintableLayout>("study-sheet");
  const [outputMode, setOutputMode] = React.useState<OutputMode>("pairs");
  const [scope, setScope] = React.useState<SectionScope>("default");
  const [selectedSectionIds, setSelectedSectionIds] = React.useState<string[]>(
    () => (book ? defaultSectionIds(book) : []),
  );
  const qrTargetUrl = isBook && book ? absoluteUrl(morseBookPrintPath(book.slug)) : CUSTOM_QR_URL;
  const { failed: qrFailed, qrCodeUrl } = useQrCode(qrTargetUrl);

  React.useEffect(() => {
    if (!book) return;
    setSelectedSectionIds(defaultSectionIds(book));
  }, [book]);

  const selectedSections = React.useMemo(() => {
    if (!book) return [];
    if (scope === "full") return allSections;
    if (scope === "default") {
      const defaults = new Set(defaultSectionIds(book));
      return allSections.filter((section) => defaults.has(section.sectionId));
    }
    const selected = new Set(selectedSectionIds);
    return allSections.filter((section) => selected.has(section.sectionId));
  }, [allSections, book, scope, selectedSectionIds]);

  const printableLines = React.useMemo(
    () =>
      isBook
        ? printableLinesFromSections(selectedSections)
        : printableLinesFromText(customText, "custom"),
    [customText, isBook, selectedSections],
  );
  const printablePages = React.useMemo(
    () => chunkLines(printableLines),
    [printableLines],
  );
  const selectedWordCount = React.useMemo(
    () =>
      selectedSections.reduce((total, section) => total + section.wordCount, 0),
    [selectedSections],
  );
  const heading = isBook && book ? `${book.title} printable Morse pages` : "Printable Morse pages";
  const description =
    isBook && book
      ? `Print ${book.title} by ${authorText(book)} as Morse study sheets, Morse-only pages, or side-by-side text and Morse.`
      : "Paste custom text, choose a practical print layout, include a site URL and QR code, then use your browser print dialog to print or save as PDF.";

  function toggleSelectedSection(sectionId: string) {
    setScope("selected");
    setSelectedSectionIds((current) =>
      current.includes(sectionId)
        ? current.filter((id) => id !== sectionId)
        : [...current, sectionId],
    );
  }

  function printPage() {
    if (typeof window !== "undefined") window.print();
  }

  return (
    <main
      className={`${WAVE_PAGE_MAIN_CLASS} mw-print-main`}
      data-testid="printable-morse-pages"
      data-mw-print-source={isBook ? "approved-book-json" : "custom-text"}
      data-mw-print-book-slug={book?.slug ?? ""}
      data-mw-print-section-count={isBook ? String(allSections.length) : ""}
    >
      <PrintStyles />
      <JsonLdScript jsonLd={props.schema} />
      <PageHero
        eyebrow={isBook ? "Printable book pages" : "Printable Morse pages"}
        title={heading}
        description={description}
      >
        <ActionLinks
          links={[
            isBook && book
              ? {
                  href: morseBookPath(book.slug),
                  label: "Read book page",
                  primary: true,
                }
              : {
                  href: ROUTES.printableChart,
                  label: "Print alphabet chart",
                  primary: true,
                },
            isBook && book
              ? { href: morseAudiobookPath(book.slug), label: "Open audiobook" }
              : { href: ROUTES.morseBooks, label: "Browse approved books" },
          ]}
        />
      </PageHero>

      {suitabilityProfile ? (
        <section
          className="mt-5 rounded-xl bg-[#fffdf8]/76 p-4 text-sm text-slate-700"
          data-testid="printable-book-content-suitability"
        >
          <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            {morseBookSuitabilityLabel(suitabilityProfile)}
          </p>
          <p className="mt-2 max-w-[68ch] leading-relaxed">
            {suitabilityProfile.contentNote}
          </p>
        </section>
      ) : null}

      <section
        className="mw-print-actions mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(280px,0.48fr)]"
        aria-label="Printable Morse page builder"
      >
        <div className="grid gap-5">
          {isBook && book ? (
            <ToolPanel
              label="Book source"
              badge={`${formatNumber(allSections.length)} sections`}
            >
              <div className="grid gap-4 p-4">
                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    ["default", "Default chapters"],
                    ["full", "Full book"],
                    ["selected", "Selected sections"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setScope(value as SectionScope)}
                      className={toolControlButtonClass({
                        active: scope === value,
                        full: true,
                        size: "sm",
                      })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div
                  className="max-h-72 overflow-y-auto rounded-lg bg-[#fffaf2]/70 p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800"
                  tabIndex={0}
                  role="region"
                  aria-label="Printable book section choices"
                >
                  {allSections.map((section) => {
                    const checked =
                      scope === "full" ||
                      (scope === "default" &&
                        defaultSectionIds(book).includes(section.sectionId)) ||
                      (scope === "selected" &&
                        selectedSectionIds.includes(section.sectionId));
                    return (
                      <label
                        key={section.sectionId}
                        className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm text-slate-800 hover:bg-white/70"
                      >
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 accent-sky-500"
                          checked={checked}
                          disabled={scope === "full" || scope === "default"}
                          onChange={() => toggleSelectedSection(section.sectionId)}
                        />
                        <span className="min-w-0">
                          <span className="block font-bold text-sky-950">
                            {sectionDisplayName(section)}
                          </span>
                          <span className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                            {section.kind} / {formatNumber(section.wordCount)} words
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </ToolPanel>
          ) : (
            <ToolPanel label="Custom text" badge="Browser only">
              <textarea
                value={customText}
                onChange={(event) => setCustomText(event.currentTarget.value)}
                className="min-h-48 w-full resize-y border-0 bg-transparent p-4 font-mono text-sm leading-relaxed text-slate-950 outline-none focus:ring-0 focus-visible:outline-none"
                aria-label="Paste custom text for printable Morse pages"
                data-testid="printable-custom-text"
              />
            </ToolPanel>
          )}

          <ToolPanel label="Printable layout" badge="Print setup">
            <div className="grid gap-4 p-4">
              <fieldset>
                <legend className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Page layout
                </legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {[
                    ["study-sheet", "Study sheet"],
                    ["morse-only", "Morse-only"],
                    ["side-by-side", "Side-by-side"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setLayout(value as PrintableLayout)}
                      className={toolControlButtonClass({
                        active: layout === value,
                        full: true,
                        size: "sm",
                      })}
                      data-testid={`printable-layout-${value}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Show on page
                </legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {[
                    ["pairs", "Line-by-line pairs"],
                    ["both", "Original and Morse"],
                    ["morse", "Morse code only"],
                    ["text", "Original text only"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setOutputMode(value as OutputMode)}
                      className={toolControlButtonClass({
                        active: outputMode === value,
                        full: true,
                        size: "sm",
                      })}
                      data-testid={`printable-output-${value}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </ToolPanel>
        </div>

        <aside className="mw-static-surface rounded-xl bg-[#fffdf8]/82 p-5">
          <Eyebrow>Ready to print</Eyebrow>
          <h2 className="mw-heading mt-3 text-2xl font-extrabold text-sky-950">
            Browser print or PDF
          </h2>
          <p className="mw-text-muted mt-2 text-sm leading-relaxed text-slate-700">
            The print stylesheet hides navigation and controls, keeps the page
            white, and adds a footer with {SITE_LABEL} plus a QR code.
          </p>
          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Printable lines
              </dt>
              <dd className="font-bold text-sky-950">
                {formatNumber(printableLines.length)}
              </dd>
            </div>
            {isBook ? (
              <div>
                <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Selected words
                </dt>
                <dd className="font-bold text-sky-950">
                  {formatNumber(selectedWordCount)}
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                QR target
              </dt>
              <dd className="break-words text-slate-700">{qrTargetUrl}</dd>
            </div>
          </dl>
          <div className="mt-5 flex flex-wrap gap-2">
            <ToolButton onClick={printPage} tone="dark" data-testid="printable-print-button">
              <DownloadIcon aria-hidden="true" />
              Print or save PDF
            </ToolButton>
          </div>
        </aside>
      </section>

      <section
        className="mw-print-preview-shell mt-8 rounded-xl bg-[#fffdf8]/76 p-3 sm:p-5"
        aria-label="Printable output preview"
        data-testid="printable-preview"
      >
        <div className="mw-print-actions mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <Eyebrow>Print preview</Eyebrow>
            <h2 className="mw-heading mt-3 text-3xl font-extrabold text-sky-950">
              Print-ready output
            </h2>
          </div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            {formatNumber(printablePages.length)} page
            {printablePages.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="grid gap-5">
          {printablePages.map((page) => (
            <PrintablePagePreview
              key={page.pageNumber}
              book={book}
              layout={layout}
              outputMode={outputMode}
              page={page}
              pageCount={printablePages.length}
              qrCodeUrl={qrCodeUrl}
              qrFailed={qrFailed}
              qrTargetUrl={qrTargetUrl}
            />
          ))}
        </div>
      </section>

      <section className="mw-print-hide mt-9 sm:mt-11" aria-labelledby="print-help">
        <div className="max-w-[68ch]">
          <Eyebrow>Print notes</Eyebrow>
          <h2
            id="print-help"
            className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
          >
            Made for paper, not heavy ink
          </h2>
          <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
            The printed version uses plain white pages, readable text, clear
            Morse spacing, and small source notes. Use your browser print dialog
            to choose paper size, margins, or Save as PDF.
          </p>
        </div>
      </section>

      <BreadcrumbTrail
        current={isBook && book ? `${book.title} Print` : "Printable Morse Pages"}
        placement="contentFooter"
      />
    </main>
  );
}

function PrintablePagePreview({
  book,
  layout,
  outputMode,
  page,
  pageCount,
  qrCodeUrl,
  qrFailed,
  qrTargetUrl,
}: {
  book: MorseBookManifest | null;
  layout: PrintableLayout;
  outputMode: OutputMode;
  page: PrintablePage;
  pageCount: number;
  qrCodeUrl: string;
  qrFailed: boolean;
  qrTargetUrl: string;
}) {
  const title = book ? book.title : "Custom Morse practice";
  const authorDisplay = book ? getMorseBookAuthorDisplay(book.author) : null;
  const author = authorDisplay?.text ?? "MorseWords printable page";
  const sourceUrl = book?.source.sourceUrl ?? "";
  return (
    <article
      className="mw-print-page mx-auto w-full max-w-[8.5in] rounded-xl bg-white p-5 text-slate-950 shadow-sm sm:p-8"
      data-testid="printable-page"
    >
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="min-w-0">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            MorseWords printable
          </p>
          <h2 className="mt-2 break-words text-2xl font-extrabold text-slate-950">
            {title}
          </h2>
          <p className="mt-1 break-words text-sm font-semibold text-slate-700">
            {author}
          </p>
          {authorDisplay?.contextText ? (
            <p className="mt-1 break-words text-xs font-semibold text-slate-600">
              {authorDisplay.contextText}
            </p>
          ) : null}
        </div>
        <QrBlock
          qrCodeUrl={qrCodeUrl}
          qrFailed={qrFailed}
          qrTargetUrl={qrTargetUrl}
        />
      </header>

      <div className="mt-5 grid gap-4">
        {page.lines.length > 0 ? (
          page.lines.map((line) => (
            <PrintableLineRow
              key={line.id}
              layout={layout}
              line={line}
              outputMode={outputMode}
            />
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600">
            Add text or select a book section to generate printable Morse.
          </p>
        )}
      </div>

      <footer className="mt-6 flex flex-wrap items-end justify-between gap-3 border-t border-slate-200 pt-3 text-[11px] leading-relaxed text-slate-600">
        <div className="min-w-0">
          <p className="font-bold">{SITE_LABEL}</p>
          {sourceUrl ? (
            <p className="break-words">
              Source:{" "}
              <Link to={sourceUrl} className="font-semibold text-slate-700">
                {sourceUrl}
              </Link>
            </p>
          ) : null}
        </div>
        <p className="font-mono font-bold uppercase tracking-[0.12em]">
          Page {page.pageNumber} of {pageCount}
        </p>
      </footer>
    </article>
  );
}

function QrBlock({
  qrCodeUrl,
  qrFailed,
  qrTargetUrl,
}: {
  qrCodeUrl: string;
  qrFailed: boolean;
  qrTargetUrl: string;
}) {
  return (
    <div className="w-32 shrink-0 text-right" data-testid="printable-qr">
      {qrCodeUrl ? (
        <img
          src={qrCodeUrl}
          alt={`QR code for ${qrTargetUrl}`}
          className="ml-auto h-24 w-24 bg-white"
        />
      ) : (
        <div className="ml-auto grid h-24 w-24 place-items-center border border-slate-300 bg-white p-2 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
          {qrFailed ? "QR unavailable" : "QR code"}
        </div>
      )}
      <p className="mt-2 break-words text-[10px] leading-snug text-slate-600">
        {qrTargetUrl}
      </p>
    </div>
  );
}

function PrintableLineRow({
  layout,
  line,
  outputMode,
}: {
  layout: PrintableLayout;
  line: PrintableLine;
  outputMode: OutputMode;
}) {
  const showText = outputMode === "pairs" || outputMode === "both" || outputMode === "text";
  const showMorse =
    outputMode === "pairs" || outputMode === "both" || outputMode === "morse";

  if (layout === "side-by-side" && showText && showMorse) {
    return (
      <section className="grid gap-3 border-b border-slate-200 pb-3 sm:grid-cols-2">
        <LineLabel label={line.sectionTitle} />
        <p className="text-sm leading-relaxed text-slate-900">{line.text}</p>
        <p className="font-mono text-sm leading-relaxed tracking-[0.04em] text-slate-950">
          {line.morse}
        </p>
      </section>
    );
  }

  return (
    <section className="border-b border-slate-200 pb-3">
      <LineLabel label={line.sectionTitle} />
      {showText ? (
        <p className="text-sm leading-relaxed text-slate-900">{line.text}</p>
      ) : null}
      {showMorse ? (
        <p
          className={[
            "font-mono leading-relaxed text-slate-950",
            layout === "morse-only" || outputMode === "morse"
              ? "text-base tracking-[0.08em]"
              : "mt-1 text-sm tracking-[0.05em]",
          ].join(" ")}
        >
          {line.morse}
        </p>
      ) : null}
    </section>
  );
}

function LineLabel({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
      {label}
    </p>
  );
}
