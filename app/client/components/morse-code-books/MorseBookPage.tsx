import * as React from "react";

import { DEFAULT_BOOK_EXPORT_SETTINGS } from "~/client/components/morse-code-book-translator/bookExportPresets";
import type {
  BookExportSettings,
  BookOutputType,
  BookSplitMode,
} from "~/client/components/morse-code-book-translator/bookExportTypes";
import { DEFAULT_MORSE_VIDEO_SETTINGS } from "~/client/components/shared/video/morseVideoTypes";
import type {
  MorseVideoSettings,
  MorseVideoVisualStyle,
} from "~/client/components/shared/video/morseVideoTypes";
import {
  ToolButton,
  ToolHero,
  ToolOutputPanel,
  ToolPanel,
  toolControlButtonClass,
} from "~/client/components/shared/ToolWorkspace";
import { textToMorse } from "~/client/components/shared/morseUtils";
import {
  getMorseBookSection,
  isMorseBookPublishReady,
} from "~/client/data/morseBooks";
import type {
  MorseBookManifest,
  MorseBookSectionJson,
  MorseBookSectionSummary,
} from "~/client/data/morseBookTypes";

import { createBookTranslatorSourceFromSections } from "./bookTranslatorSource";

const DISPLAY_TEXT_PREVIEW_LIMIT = 3600;
const MORSE_SOURCE_PREVIEW_LIMIT = 1200;
const MORSE_OUTPUT_PREVIEW_LIMIT = 2600;

const splitModeLabels: Record<BookSplitMode, string> = {
  none: "No split",
  duration: "By duration",
  "source-sections": "By source sections",
};

const visualStyleLabels: Record<MorseVideoVisualStyle, string> = {
  lightbulb: "Lightbulb signal",
  dot: "Dot signal",
  "full-frame": "Full-frame flash",
  "morse-text": "Animated Morse signal",
};

type MorseBookPageProps = {
  book: MorseBookManifest;
  initialSection: MorseBookSectionJson;
  previewMode: "unpublished" | null;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function clippedText(text: string, limit: number) {
  if (text.length <= limit) return { text, truncated: false };
  return { text: `${text.slice(0, limit).trimEnd()}\n...`, truncated: true };
}

function sectionDisplayName(section: MorseBookSectionSummary) {
  return section.title ? `${section.label}: ${section.title}` : section.label;
}

function BookCover({ book }: { book: MorseBookManifest }) {
  if (book.cover.src) {
    return (
      <img
        src={book.cover.src}
        alt={book.cover.alt}
        className="aspect-[3/4] w-full max-w-52 rounded-xl object-cover"
      />
    );
  }

  return (
    <div
      aria-label={book.cover.alt}
      data-mw-morse-book-cover-placeholder="true"
      className="mw-static-tile flex aspect-[3/4] w-full max-w-52 flex-col justify-between rounded-xl p-5"
    >
      <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        MorseWords book
      </span>
      <div>
        <p className="mw-heading text-xl font-extrabold leading-tight text-sky-950">
          {book.title}
        </p>
        <p className="mt-3 text-sm font-semibold text-slate-600">
          {book.author.join(", ")}
        </p>
      </div>
    </div>
  );
}

function LayerCheckbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-sky-500"
      />
      <span>{label}</span>
    </label>
  );
}

export default function MorseBookPage({
  book,
  initialSection,
  previewMode,
}: MorseBookPageProps) {
  const [selectedSectionId, setSelectedSectionId] = React.useState(
    initialSection.sectionId,
  );
  const [selectedSection, setSelectedSection] =
    React.useState<MorseBookSectionJson>(initialSection);
  const [sectionStatus, setSectionStatus] = React.useState<"idle" | "loading">(
    "idle",
  );
  const [copyState, setCopyState] = React.useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const [outputType, setOutputType] = React.useState<BookOutputType>("audio");
  const [exportSettings, setExportSettings] = React.useState<BookExportSettings>(
    DEFAULT_BOOK_EXPORT_SETTINGS,
  );
  const [videoSettings, setVideoSettings] = React.useState<MorseVideoSettings>(
    DEFAULT_MORSE_VIDEO_SETTINGS,
  );

  React.useEffect(() => {
    let cancelled = false;

    if (selectedSectionId === initialSection.sectionId) {
      setSelectedSection(initialSection);
      setSectionStatus("idle");
      return () => {
        cancelled = true;
      };
    }

    setSectionStatus("loading");
    getMorseBookSection(book, selectedSectionId)
      .then((section) => {
        if (cancelled) return;
        if (section) setSelectedSection(section);
      })
      .finally(() => {
        if (!cancelled) setSectionStatus("idle");
      });

    return () => {
      cancelled = true;
    };
  }, [book, initialSection, selectedSectionId]);

  const publishReady = isMorseBookPublishReady(book);
  const displayPreview = clippedText(
    selectedSection.displayText,
    DISPLAY_TEXT_PREVIEW_LIMIT,
  );
  const morseSourcePreview = clippedText(
    selectedSection.morseSourceText,
    MORSE_SOURCE_PREVIEW_LIMIT,
  );
  const morseResult = textToMorse(morseSourcePreview.text, {
    returnResult: true,
    unsupportedText: "omit",
  });
  const morseOutputPreview = clippedText(
    morseResult.value,
    MORSE_OUTPUT_PREVIEW_LIMIT,
  );
  const translatorSource = createBookTranslatorSourceFromSections(book, [
    selectedSection,
  ]);
  const downloadIsZip = exportSettings.splitMode !== "none";
  const downloadLabel = downloadIsZip
    ? "Download ZIP bundle"
    : outputType === "video"
      ? "Download WebM"
      : `Download ${exportSettings.outputFormat.toUpperCase()}`;

  const updateVideoSettings = (patch: Partial<MorseVideoSettings>) => {
    setVideoSettings((current) => {
      const next = { ...current, ...patch };
      if (!next.showVisualSignal && !next.showMorseSymbols && !next.showPlainText) {
        return current;
      }
      return {
        ...next,
        showMorseOverlay: next.showMorseSymbols,
        textDisplayMode:
          next.showMorseSymbols && next.showPlainText
            ? "both"
            : next.showMorseSymbols
              ? "morse"
              : next.showPlainText
                ? "text"
                : "none",
      };
    });
  };

  const handleCopy = async () => {
    setCopyState("idle");
    try {
      await navigator.clipboard.writeText(selectedSection.displayText);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  return (
    <main
      className="mx-auto w-full max-w-[1120px] px-4 pb-14 pt-2 sm:px-6 sm:pt-4 lg:px-8"
      data-mw-morse-book-page="true"
      data-mw-morse-book-publish-ready={publishReady ? "true" : "false"}
      data-mw-morse-book-preview-mode={previewMode ?? "public"}
    >
      <ToolHero
        eyebrow="Morse book foundation"
        title={book.title}
        lead={
          <>
            A reusable page shell for future Morse book and Morse audiobook
            pages, powered by generated section JSON and browser-local
            conversion settings.
          </>
        }
      />

      <section className="mt-6 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
        <BookCover book={book} />
        <div className="space-y-5">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              {book.source.provider}
              {book.source.gutenbergId ? ` ID ${book.source.gutenbergId}` : ""}
            </p>
            <h2 className="mw-heading mt-2 text-2xl font-extrabold text-sky-950">
              {book.author.join(", ")}
            </h2>
            {book.description ? (
              <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-slate-700">
                {book.description}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 text-sm text-slate-700 sm:grid-cols-3">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Sections
              </p>
              <p className="mt-1 font-semibold">{formatNumber(book.stats.sectionCount)}</p>
            </div>
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Words
              </p>
              <p className="mt-1 font-semibold">{formatNumber(book.stats.wordCount)}</p>
            </div>
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Status
              </p>
              <p className="mt-1 font-semibold">
                {publishReady ? "Publish-ready" : "Not public yet"}
              </p>
            </div>
          </div>

          {!publishReady ? (
            <p className="max-w-[68ch] text-sm leading-relaxed text-slate-600">
              Rights review is not complete for this generated artifact. This
              preview route is noindex in development/test mode and is not added
              to public navigation or the sitemap.
            </p>
          ) : null}
        </div>
      </section>

      <section className="mt-10 grid gap-7 lg:grid-cols-[300px_minmax(0,1fr)]">
        <ToolPanel label="Choose section" badge="Generated JSON">
          <div className="max-h-[34rem] overflow-y-auto px-3 pb-3">
            <div className="mb-3 rounded-lg bg-[#fffaf2]/70 p-3 text-sm leading-relaxed text-slate-700">
              Default Morse scope includes {formatNumber(book.stats.includedSectionCount)}{" "}
              generated sections. Full-book export can be assembled from these
              section files later without importing the whole library at startup.
            </div>
            <div className="space-y-2" role="list" aria-label="Book sections">
              {book.sections.map((section) => (
                <div key={section.id} role="listitem">
                  <button
                    type="button"
                    onClick={() => setSelectedSectionId(section.id)}
                    className={toolControlButtonClass({
                      active: selectedSectionId === section.id,
                      full: true,
                      size: "sm",
                      hover: "soft",
                    })}
                    data-mw-morse-book-section-id={section.id}
                  >
                    <span className="flex min-w-0 flex-1 flex-col items-start text-left">
                      <span className="truncate">{sectionDisplayName(section)}</span>
                      <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] opacity-75">
                        {section.kind} - {formatNumber(section.wordCount)} words
                        {section.includeByDefault ? " - included" : " - optional"}
                      </span>
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </ToolPanel>

        <div className="grid gap-7">
          <ToolPanel
            label="Cleaned source preview"
            badge={sectionStatus === "loading" ? "Loading" : selectedSection.label}
            footer={
              <>
                <ToolButton onClick={handleCopy} className="min-h-10 px-3 py-1.5 text-sm">
                  Copy selected text
                </ToolButton>
                <span className="text-sm text-slate-600">
                  {copyState === "copied"
                    ? "Copied."
                    : copyState === "failed"
                      ? "Copy unavailable in this browser."
                      : "Source and rights notes stay separate from Morse text."}
                </span>
              </>
            }
          >
            <div className="px-4 pb-4">
              <div className="mb-3 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
                <span>{formatNumber(selectedSection.wordCount)} words</span>
                <span>{formatNumber(selectedSection.characterCount)} characters</span>
                <span>
                  {selectedSection.includeByDefault ? "Included by default" : "Optional"}
                </span>
              </div>
              <pre
                className="max-h-[24rem] overflow-auto whitespace-pre-wrap rounded-xl bg-white/90 p-4 font-mono text-sm leading-relaxed text-slate-950"
                data-mw-morse-book-source-preview="true"
              >
                {displayPreview.text}
              </pre>
              {displayPreview.truncated ? (
                <p className="mt-3 text-sm text-slate-600">
                  Preview is capped for page performance. The selected section
                  JSON remains available for future full-scope generation.
                </p>
              ) : null}
            </div>
          </ToolPanel>

          <ToolOutputPanel label="Morse preview" badge="Capped">
            <div className="px-4 pb-4">
              <pre
                className="mw-output-soft max-h-[18rem] overflow-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-sky-100"
                data-mw-morse-book-morse-preview="true"
              >
                {morseOutputPreview.text || "Select a section with translatable text."}
              </pre>
              <p className="mw-output-muted mt-3 text-sm text-slate-300">
                Morse preview uses the selected section source and is capped to
                avoid rendering a whole book into the DOM.
                {morseSourcePreview.truncated || morseOutputPreview.truncated
                  ? " Longer text will be handled by lazy section data and export helpers."
                  : ""}
              </p>
            </div>
          </ToolOutputPanel>
        </div>
      </section>

      <section
        className="mt-10 grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
        data-mw-morse-book-output-foundation="true"
      >
        <ToolPanel label="Output settings" badge="Foundation">
          <div className="space-y-5 px-4 pb-4">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Output type
              </p>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Output type">
                {(["audio", "video"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={toolControlButtonClass({
                      active: outputType === value,
                      size: "sm",
                    })}
                    onClick={() => setOutputType(value)}
                  >
                    {value === "audio" ? "Audio" : "Video"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Speed WPM
                <input
                  type="number"
                  min={1}
                  max={80}
                  value={exportSettings.charWpm}
                  onChange={(event) =>
                    setExportSettings((current) => ({
                      ...current,
                      charWpm: Number(event.target.value),
                    }))
                  }
                  className="mt-1 w-full rounded-lg bg-white px-3 py-2 text-slate-950"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Farnsworth WPM
                <input
                  type="number"
                  min={1}
                  max={80}
                  value={exportSettings.farnsworthWpm}
                  onChange={(event) =>
                    setExportSettings((current) => ({
                      ...current,
                      farnsworthWpm: Number(event.target.value),
                    }))
                  }
                  className="mt-1 w-full rounded-lg bg-white px-3 py-2 text-slate-950"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Pitch Hz
                <input
                  type="number"
                  min={120}
                  max={1200}
                  value={exportSettings.pitch}
                  onChange={(event) =>
                    setExportSettings((current) => ({
                      ...current,
                      pitch: Number(event.target.value),
                    }))
                  }
                  className="mt-1 w-full rounded-lg bg-white px-3 py-2 text-slate-950"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Volume
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  value={exportSettings.volume}
                  onChange={(event) =>
                    setExportSettings((current) => ({
                      ...current,
                      volume: Number(event.target.value),
                    }))
                  }
                  className="mt-1 w-full rounded-lg bg-white px-3 py-2 text-slate-950"
                />
              </label>
            </div>

            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Audio format
              </p>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Audio format">
                {(["mp3", "wav"] as const).map((format) => (
                  <button
                    key={format}
                    type="button"
                    className={toolControlButtonClass({
                      active: exportSettings.outputFormat === format,
                      size: "sm",
                    })}
                    onClick={() =>
                      setExportSettings((current) => ({
                        ...current,
                        outputFormat: format,
                      }))
                    }
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Split mode
              </p>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Split mode">
                {(["none", "duration", "source-sections"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={toolControlButtonClass({
                      active: exportSettings.splitMode === mode,
                      size: "sm",
                    })}
                    onClick={() =>
                      setExportSettings((current) => ({
                        ...current,
                        splitMode: mode,
                        splitAudio: mode !== "none",
                        preferSourceSections: mode === "source-sections",
                      }))
                    }
                  >
                    {splitModeLabels[mode]}
                  </button>
                ))}
              </div>
              {exportSettings.splitMode === "duration" ? (
                <label className="mt-3 block text-sm font-semibold text-slate-700">
                  Target part length
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={exportSettings.targetPartMinutes}
                    onChange={(event) =>
                      setExportSettings((current) => ({
                        ...current,
                        targetPartMinutes: Number(event.target.value),
                      }))
                    }
                    className="mt-1 w-32 rounded-lg bg-white px-3 py-2 text-slate-950"
                  />
                  <span className="ml-2 text-sm font-normal text-slate-600">
                    minutes
                  </span>
                </label>
              ) : null}
              {exportSettings.splitMode === "source-sections" ? (
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Source-section splitting will use generated section order and
                  section JSON paths when future export wiring is enabled.
                </p>
              ) : null}
              {downloadIsZip ? (
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  ZIP is shown only because the current settings request multiple
                  output files.
                </p>
              ) : null}
            </div>

            <button
              type="button"
              disabled
              data-mw-morse-book-download-label={downloadLabel}
              className={toolControlButtonClass({
                disabled: true,
                full: true,
                tone: "light",
              })}
            >
              {downloadLabel}
            </button>
            <p className="text-sm leading-relaxed text-slate-600">
              Download generation stays gated until a book is publish-ready.
              The selected section is already adapted into the same source shape
              used by the long-form translator.
            </p>
          </div>
        </ToolPanel>

        <ToolPanel label="Video layers" badge="Defaults on">
          <div className="space-y-5 px-4 pb-4">
            <p className="text-sm leading-relaxed text-slate-700">
              Visual style controls the signal animation. Text shown in video
              controls overlays only, so Morse symbols and plain text can remain
              readable together.
            </p>
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Visual style
              </p>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Visual style">
                {Object.entries(visualStyleLabels).map(([style, label]) => (
                  <button
                    key={style}
                    type="button"
                    className={toolControlButtonClass({
                      active: videoSettings.visualStyle === style,
                      size: "sm",
                    })}
                    onClick={() =>
                      updateVideoSettings({
                        visualStyle: style as MorseVideoVisualStyle,
                      })
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
              {videoSettings.visualStyle === "full-frame" ? (
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Strobe warning: full-frame flash can be uncomfortable or
                  unsafe for people with photosensitive epilepsy or light
                  sensitivity.
                </p>
              ) : null}
            </div>
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Text shown in video
              </p>
              <div
                className="mt-3 grid gap-3 sm:grid-cols-2"
                data-mw-morse-book-video-layer-defaults={`${videoSettings.showVisualSignal}:${videoSettings.showMorseSymbols}:${videoSettings.showPlainText}`}
              >
                <LayerCheckbox
                  checked={videoSettings.showVisualSignal}
                  label="Visual signal"
                  onChange={(checked) =>
                    updateVideoSettings({ showVisualSignal: checked })
                  }
                />
                <LayerCheckbox
                  checked={videoSettings.showMorseSymbols}
                  label="Morse symbols"
                  onChange={(checked) =>
                    updateVideoSettings({ showMorseSymbols: checked })
                  }
                />
                <LayerCheckbox
                  checked={videoSettings.showPlainText}
                  label="Plain text"
                  onChange={(checked) =>
                    updateVideoSettings({ showPlainText: checked })
                  }
                />
                <LayerCheckbox
                  checked={videoSettings.showBranding}
                  label="Minimal branding"
                  onChange={(checked) => updateVideoSettings({ showBranding: checked })}
                />
                <LayerCheckbox
                  checked={videoSettings.includeAudioTrack}
                  label="Audio track"
                  onChange={(checked) =>
                    updateVideoSettings({ includeAudioTrack: checked })
                  }
                />
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              Current video summary:{" "}
              {videoSettings.showVisualSignal ? "visual signal on" : "visual signal off"},{" "}
              {videoSettings.showMorseSymbols ? "Morse symbols on" : "Morse symbols off"},{" "}
              {videoSettings.showPlainText ? "plain text on" : "plain text off"}.
            </p>
          </div>
        </ToolPanel>
      </section>

      <section className="mt-10 mw-static-surface rounded-xl p-5">
        <h2 className="mw-heading text-2xl font-extrabold text-sky-950">
          Source and rights notes
        </h2>
        <div className="mt-3 grid gap-4 text-sm leading-relaxed text-slate-700 lg:grid-cols-2">
          <p>
            Source material is generated from curated local artifacts, not user
            uploads. Project Gutenberg boilerplate is kept out of the Morse
            source text and rights/source notes are shown separately here.
          </p>
          <p>
            {book.source.rightsNotes ||
              "No additional rights notes are recorded for this generated book."}
          </p>
        </div>
      </section>

      <div
        hidden
        data-mw-morse-book-translator-source-label={translatorSource.sourceLabel}
        data-mw-morse-book-translator-source-sections={translatorSource.sectionIds.join(
          ",",
        )}
        data-mw-morse-book-translator-source-length={String(
          translatorSource.sourceText.length,
        )}
      />
    </main>
  );
}
