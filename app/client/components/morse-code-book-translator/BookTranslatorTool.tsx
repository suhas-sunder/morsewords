import * as React from "react";

import {
  ChecklistIcon,
  SparklesIcon,
  TrashIcon,
  UploadIcon,
  WarningBadgeIcon,
} from "~/client/assets/svg/Icons";
import {
  ToolOutputPanel,
  ToolPanel,
  ToolTextarea,
  toolControlButtonClass,
} from "~/client/components/shared/ToolWorkspace";
import {
  DEFAULT_CLEANUP_OPTIONS,
  type CleanupOptions,
  type ParsedBookSource,
  type PreflightSummary,
  sourceTypeLabel,
  BookSourceError,
  detectFileSourceType,
} from "./bookSourceTypes";
import { parseEpubSource } from "./sourceParsers/epubSourceParser";
import { parsePdfSource } from "./sourceParsers/pdfSourceParser";
import {
  parsePastedSource,
  parseTextFileSource,
} from "./sourceParsers/textSourceParser";
import { buildPreflightSummary } from "./textNormalization";

type ParseStatus = "idle" | "parsing" | "ready" | "error";

function formatNumber(value: number | undefined) {
  return typeof value === "number" ? value.toLocaleString() : "0";
}

function cleanupLabel(key: keyof CleanupOptions) {
  switch (key) {
    case "normalizeSmartPunctuation":
      return "Normalize smart quotes, dashes, and ellipsis";
    case "stripZeroWidthAndSoftHyphen":
      return "Strip zero-width characters and soft hyphens";
    case "stripGutenbergHeaderFooter":
      return "Strip Project Gutenberg header/footer";
    case "simplifyPunctuation":
      return "Simplify punctuation for practice";
  }
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-base font-extrabold text-sky-950">
        {value}
      </dd>
    </div>
  );
}

function MessageList({
  title,
  items,
  tone = "info",
}: {
  title: string;
  items: string[];
  tone?: "info" | "warning" | "error";
}) {
  if (items.length === 0) return null;

  const toneClass =
    tone === "error"
      ? "text-sky-950"
      : tone === "warning"
        ? "text-sky-950"
        : "text-slate-700";

  return (
    <section className="rounded-xl bg-[#fffdf8] p-4">
      <h3 className="flex items-center gap-2 text-sm font-extrabold text-sky-950">
        <WarningBadgeIcon size={16} title={undefined} aria-hidden="true" />
        {title}
      </h3>
      <ul className={`mt-2 space-y-1 text-sm leading-relaxed ${toneClass}`}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function EmptyPreview({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-[#f7f4ee] p-4 text-sm leading-relaxed text-slate-600">
      {children}
    </div>
  );
}

async function parseFileSource(file: File) {
  const sourceType = detectFileSourceType(file);
  if (sourceType === "txt" || sourceType === "md") return parseTextFileSource(file);
  if (sourceType === "epub") return parseEpubSource(file);
  return parsePdfSource(file);
}

export default function BookTranslatorTool() {
  const [sourceText, setSourceText] = React.useState("");
  const [parsedSource, setParsedSource] = React.useState<ParsedBookSource>(
    () => parsePastedSource(""),
  );
  const [cleanupOptions, setCleanupOptions] =
    React.useState<CleanupOptions>(DEFAULT_CLEANUP_OPTIONS);
  const [status, setStatus] = React.useState<ParseStatus>("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const parseVersionRef = React.useRef(0);
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
      parseVersionRef.current += 1;
    };
  }, []);

  const preflight = React.useMemo<PreflightSummary>(() => {
    return buildPreflightSummary(parsedSource, cleanupOptions);
  }, [cleanupOptions, parsedSource]);

  const hasSource = sourceText.trim().length > 0;
  const isUploaded = parsedSource.sourceType !== "pasted";
  const allWarnings = [
    ...preflight.extractionWarnings,
    ...preflight.cleanupWarnings,
  ];

  const updatePastedText = React.useCallback((value: string) => {
    parseVersionRef.current += 1;
    setSourceText(value);
    setParsedSource(parsePastedSource(value));
    setStatus(value.trim() ? "ready" : "idle");
    setErrorMessage("");
  }, []);

  const parseSelectedFile = React.useCallback(async (file: File) => {
    const version = parseVersionRef.current + 1;
    parseVersionRef.current = version;
    setStatus("parsing");
    setErrorMessage("");
    setDragActive(false);

    try {
      const parsed = await parseFileSource(file);
      if (!mountedRef.current || parseVersionRef.current !== version) return;
      setParsedSource(parsed);
      setSourceText(parsed.rawText);
      setStatus("ready");
    } catch (error) {
      if (!mountedRef.current || parseVersionRef.current !== version) return;
      const message =
        error instanceof BookSourceError || error instanceof Error
          ? error.message
          : "This source could not be parsed.";
      setStatus("error");
      setErrorMessage(message);
    }
  }, []);

  const clearSource = React.useCallback(() => {
    parseVersionRef.current += 1;
    setSourceText("");
    setParsedSource(parsePastedSource(""));
    setStatus("idle");
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const removeUploadedFile = React.useCallback(() => {
    if (!isUploaded) return;
    clearSource();
  }, [clearSource, isUploaded]);

  const handleFileInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) void parseSelectedFile(file);
    },
    [parseSelectedFile],
  );

  const handleDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];
      if (file) void parseSelectedFile(file);
      setDragActive(false);
    },
    [parseSelectedFile],
  );

  const toggleCleanup = React.useCallback((key: keyof CleanupOptions) => {
    setCleanupOptions((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }, []);

  const uploadHelpText =
    "TXT, MD, unprotected EPUB, and text-native PDF are processed locally in this browser.";

  return (
    <section className="mt-6 space-y-6" aria-label="Book source preflight tool">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ToolPanel
          label="Source text"
          badge={isUploaded ? sourceTypeLabel(parsedSource.sourceType) : "Paste"}
          footer={
            <span className="text-sm text-slate-600">
              Raw book text stays in component state only and is not saved to
              localStorage.
            </span>
          }
        >
          <label htmlFor="book-source-text" className="sr-only">
            Paste long-form source text
          </label>
          <ToolTextarea
            id="book-source-text"
            value={sourceText}
            onChange={(event) => updatePastedText(event.target.value)}
            placeholder="Paste a chapter, public-domain excerpt, notes, or any long-form text here..."
            className="min-h-[18rem]"
            spellCheck={false}
          />
        </ToolPanel>

        <div className="space-y-4">
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={[
              "rounded-xl bg-[#fffdf8] p-5",
              dragActive ? "outline outline-2 outline-offset-2 outline-sky-500" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <input
              ref={fileInputRef}
              id="book-source-file"
              type="file"
              accept=".txt,.md,.markdown,.epub,.pdf,text/plain,text/markdown,application/epub+zip,application/pdf"
              onChange={handleFileInputChange}
              className="sr-only"
              aria-describedby="book-source-file-help"
            />
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sky-100">
                <UploadIcon size={20} title={undefined} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="text-base font-extrabold text-sky-950">
                  Upload a source file
                </h2>
                <p
                  id="book-source-file-help"
                  className="mt-1 text-sm leading-relaxed text-slate-600"
                >
                  {uploadHelpText}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={toolControlButtonClass({ tone: "dark", size: "sm" })}
              >
                <UploadIcon size={16} title={undefined} aria-hidden="true" />
                Choose file
              </button>
              <button
                type="button"
                onClick={clearSource}
                disabled={!hasSource && status !== "error"}
                className={toolControlButtonClass({
                  size: "sm",
                  disabled: !hasSource && status !== "error",
                })}
              >
                <TrashIcon size={16} title={undefined} aria-hidden="true" />
                Clear source
              </button>
              {isUploaded ? (
                <button
                  type="button"
                  onClick={removeUploadedFile}
                  className={toolControlButtonClass({ size: "sm" })}
                >
                  Remove uploaded file
                </button>
              ) : null}
            </div>
            {parsedSource.filename ? (
              <p className="mt-3 break-words text-sm font-semibold text-slate-700">
                Current file: {parsedSource.filename}
              </p>
            ) : null}
          </div>

          <div className="rounded-xl bg-[#fffdf8] p-5">
            <h2 className="flex items-center gap-2 text-base font-extrabold text-sky-950">
              <SparklesIcon size={18} title={undefined} aria-hidden="true" />
              Source cleanup
            </h2>
            <div className="mt-4 space-y-3">
              {(Object.keys(cleanupOptions) as Array<keyof CleanupOptions>).map(
                (key) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-start gap-3 text-sm font-semibold text-slate-800"
                  >
                    <input
                      type="checkbox"
                      checked={cleanupOptions[key]}
                      onChange={() => toggleCleanup(key)}
                      className="mt-1 h-4 w-4 accent-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                    />
                    <span>{cleanupLabel(key)}</span>
                  </label>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {status === "parsing" ? (
        <div
          role="status"
          className="rounded-xl bg-[#fffdf8] p-4 text-sm font-semibold text-slate-700"
        >
          Parsing source locally in your browser...
        </div>
      ) : null}
      {status === "error" ? (
        <MessageList title="Extraction error" items={[errorMessage]} tone="error" />
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.65fr)]">
        <section className="rounded-xl bg-[#fffdf8] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-sky-950">
              <ChecklistIcon size={20} title={undefined} aria-hidden="true" />
              Preflight summary
            </h2>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              {status === "ready" ? "Ready" : status === "parsing" ? "Parsing" : "Preview"}
            </span>
          </div>

          {hasSource ? (
            <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Metric label="Source type" value={sourceTypeLabel(preflight.sourceType)} />
              <Metric label="Words" value={formatNumber(preflight.wordCount)} />
              <Metric
                label="Characters"
                value={formatNumber(preflight.characterCount)}
              />
              <Metric
                label="Unsupported"
                value={formatNumber(preflight.unsupportedCount)}
              />
              {preflight.pageCount ? (
                <Metric label="PDF pages" value={formatNumber(preflight.pageCount)} />
              ) : null}
              {preflight.sectionCount ? (
                <Metric
                  label="EPUB sections"
                  value={formatNumber(preflight.sectionCount)}
                />
              ) : null}
              {preflight.title ? <Metric label="Title" value={preflight.title} /> : null}
              {preflight.author ? <Metric label="Author" value={preflight.author} /> : null}
            </dl>
          ) : (
            <EmptyPreview>
              Paste text or upload TXT, MD, EPUB, or text-native PDF to see word
              counts, unsupported characters, and a Morse preview before any later
              export work.
            </EmptyPreview>
          )}

          {preflight.unsupportedCharacters.length > 0 ? (
            <div className="mt-5 rounded-xl bg-[#f7f4ee] p-4">
              <h3 className="text-sm font-extrabold text-sky-950">
                Top unsupported characters
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {preflight.unsupportedCharacters.map((item) => (
                  <span
                    key={item.character}
                    className="rounded-lg bg-[#fffdf8] px-3 py-1 font-mono text-sm font-bold text-slate-800"
                  >
                    {item.character === " " ? "space" : item.character} x
                    {item.count}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <div className="space-y-4">
          <MessageList title="Warnings" items={allWarnings} tone="warning" />
          <section className="rounded-xl bg-[#fffdf8] p-5">
            <h2 className="text-base font-extrabold text-sky-950">
              Format support
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              TXT and MD are the cleanest sources. EPUB is extracted from the
              declared reading spine. PDF is best effort and only works when the
              file contains selectable text.
            </p>
          </section>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ToolPanel label="Cleaned text preview" badge="Excerpt">
          {preflight.cleanedPreview ? (
            <pre className="max-h-80 min-h-[12rem] overflow-auto whitespace-pre-wrap p-4 font-mono text-sm leading-relaxed text-slate-900">
              {preflight.cleanedPreview}
            </pre>
          ) : (
            <div className="p-4">
              <EmptyPreview>Cleaned text will appear here after input.</EmptyPreview>
            </div>
          )}
        </ToolPanel>

        <ToolOutputPanel label="Morse preview" badge="Excerpt">
          {preflight.morsePreview ? (
            <pre className="max-h-80 min-h-[12rem] overflow-auto whitespace-pre-wrap p-4 font-mono text-sm leading-relaxed text-sky-100">
              {preflight.morsePreview}
            </pre>
          ) : (
            <div className="p-4">
              <p className="rounded-xl bg-slate-900 p-4 text-sm leading-relaxed text-slate-300">
                Morse preview appears here after cleaned source text is available.
              </p>
            </div>
          )}
        </ToolOutputPanel>
      </div>
    </section>
  );
}
