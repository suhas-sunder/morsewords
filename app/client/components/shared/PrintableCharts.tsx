import { useId, useState } from "react";
import { ActionButton } from "./ActionControls";
import type { PrintableChartFormat } from "./printableChartExport.client";
import { SectionCard } from "./MorseLearningLayout";
import { PRINTABLE_CHARTS, getPrintableChartsForPage, type PrintableChart } from "~/client/data/printableCharts";

function PrintableChartFigure({ chart, compact, heading = "h3" }: { chart: PrintableChart; compact: boolean; heading?: "h3" | "h4" }) {
  const Heading = heading;
  const formatId = useId();
  const [format, setFormat] = useState<PrintableChartFormat>("pdf");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  async function download() {
    if (busy) return;
    setBusy(true);
    setStatus("");
    try {
      const { downloadPrintableChart } = await import("./printableChartExport.client");
      await downloadPrintableChart(chart, format);
      setStatus("Download started.");
    } catch {
      setStatus("The download could not be prepared. Try again, or open the original PNG below.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <figure data-printable-chart={chart.id} className="row-span-3 grid min-w-0 grid-rows-subgrid gap-y-4">
      <a
        href={chart.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open full-size ${chart.title} PNG (new tab)`}
        className="block h-[280px] cursor-pointer rounded-xl bg-[#fffdf8] p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-900 sm:h-[300px]"
      >
        <img src={chart.url} alt={chart.alt} width={chart.width} height={chart.height}
          loading="lazy" decoding="async" className="h-full w-full object-contain" />
      </a>
      <figcaption className="row-span-2 grid grid-rows-subgrid gap-y-4">
        <div>
        <Heading className={`mw-heading font-extrabold text-sky-950 ${compact ? "text-xl" : "text-2xl"}`}>{chart.title}</Heading>
        <p className="mw-text-muted mt-2 max-w-[58ch] text-base leading-relaxed text-slate-700">{chart.description}</p>
        {chart.note ? <p className="mw-text-muted mt-3 max-w-[58ch] text-sm leading-relaxed text-slate-600">{chart.note}</p> : null}
        </div>
        <div>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor={formatId} className="mb-1 block text-sm font-semibold text-slate-700">Download format</label>
            <select id={formatId} value={format} disabled={busy}
              onChange={(event) => { setFormat(event.target.value as PrintableChartFormat); setStatus(""); }}
              className="min-h-10 max-w-full cursor-pointer rounded-lg border-0 bg-[#fffdf8] px-3 py-2 text-sm text-slate-950 disabled:cursor-default disabled:text-slate-500">
              <option value="pdf">PDF</option>
              <option value="png">PNG (original)</option>
              <option value="jpg">JPG / JPEG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
          <ActionButton size="sm" onClick={download} disabled={busy} aria-busy={busy} aria-describedby={`${formatId}-status`}>
            {busy ? "Preparing…" : `Download ${format.toUpperCase()}`}
          </ActionButton>
        </div>
        <p id={`${formatId}-status`} role="status" className="mt-2 max-w-[58ch] text-sm leading-relaxed text-slate-600">{status}</p>
        <a href={chart.url} target="_blank" rel="noopener noreferrer" className="mt-2 block font-semibold text-sky-900 underline-offset-4 hover:underline">Open full-size PNG</a>
        <a href={chart.referencePath} className="mt-3 inline-block font-semibold text-sky-900 underline-offset-4 hover:underline">{chart.referenceLabel}</a>
        </div>
      </figcaption>
    </figure>
  );
}

export const PRINTABLE_CHART_CATEGORIES = [
  { id: "quick-reference", label: "Quick reference", category: "Quick reference" },
  { id: "learning-memory", label: "Learning & memory", category: "Learning and memory" },
  { id: "timing-spacing", label: "Timing & spacing", category: "Timing and spacing" },
  { id: "radio-cw", label: "Radio & CW", category: "Radio and CW" },
  { id: "languages", label: "Languages", category: null },
] as const;

function ChartGrid({ charts, grouped = true, nested = false }: { charts: readonly PrintableChart[]; grouped?: boolean; nested?: boolean }) {
  return (
    <div className={grouped ? "grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" : "grid max-w-[800px] gap-x-8 gap-y-10 sm:grid-cols-2"}>
      {charts.map(chart => <PrintableChartFigure key={chart.id} chart={chart} compact={grouped} heading={nested ? "h4" : "h3"} />)}
    </div>
  );
}

export function PrintableChartLibrary() {
  const languageCharts = PRINTABLE_CHARTS.filter(chart => chart.language);
  return (
    <div id="printable-charts" className="mt-8 space-y-12 print:hidden sm:mt-10">
      {PRINTABLE_CHART_CATEGORIES.map(({ id, label, category }) => (
        <section key={id} id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-6">
          <h2 id={`${id}-heading`} className="mb-6 text-3xl font-extrabold text-sky-950 sm:text-4xl">{category ? label : "Morse code by language"}</h2>
          {category ? <ChartGrid charts={PRINTABLE_CHARTS.filter(chart => chart.category === category)} /> : (
            <>
              <p className="mb-8 max-w-[68ch] text-base leading-relaxed text-slate-700">These 22 references cover established adaptations, traditional extensions, and localized or transliteration conventions. They are not all separate ITU alphabets. Explore the <a href="/morse-code-by-language" className="font-semibold text-sky-900 underline-offset-4 hover:underline">language guide</a> for context and interactive Japanese, Russian, and Greek sheets.</p>
              <div className="space-y-10">
                {[...new Set(languageCharts.map(chart => chart.category))].map(group => (
                  <section key={group}>
                    <h3 className="mb-5 text-2xl font-extrabold text-sky-950">{group}</h3>
                    <ChartGrid charts={languageCharts.filter(chart => chart.category === group)} nested />
                  </section>
                ))}
              </div>
            </>
          )}
        </section>
      ))}
    </div>
  );
}

export default function PrintableCharts({ path }: { path: string }) {
  const charts = getPrintableChartsForPage(path);
  if (!charts.length) return null;
  const isLanguageHub = path === "/morse-code-by-language";
  const grouped = isLanguageHub;
  const groups = isLanguageHub ? [...new Set(charts.map((chart) => chart.category))] : ["Charts"];

  return (
    <div id="printable-charts" className="scroll-mt-6 print:hidden">
      <SectionCard
        eyebrow="Print and keep"
        title={isLanguageHub ? "Printable Morse charts by language" : "Printable charts for offline reference"}
        description={isLanguageHub
          ? "Browse 22 printable references, including established adaptations, traditional extensions, and localized or transliteration conventions. These are not all separate ITU alphabets."
          : "Keep a reference beside your practice notes. Download a PDF for printing or an image for a study document. Return to the interactive reference to hear and check patterns."}
        layout="stacked"
      >
        <p className="mb-6 max-w-[68ch] text-base leading-relaxed text-slate-700">Choose PDF, the original PNG, JPG/JPEG, or WebP. Your browser prepares the download from the full-size chart. PDFs fit the complete chart on one A4 page; image downloads keep the original pixel dimensions.</p>
        <p className="mb-6 flex flex-wrap gap-x-6 gap-y-3">
          <a className="font-semibold text-sky-900 underline-offset-4 hover:underline" href="/morse-code-printable-chart">Browse all 39 printable charts</a>
          {!isLanguageHub ? <a className="font-semibold text-sky-900 underline-offset-4 hover:underline" href="/morse-code-by-language#printable-charts">Printable charts by language</a> : <a className="font-semibold text-sky-900 underline-offset-4 hover:underline" href="/international-morse-code-reference">International Morse reference</a>}
          {path === "/morse-code-amateur-radio-cw" ? <><a className="font-semibold text-sky-900 underline-offset-4 hover:underline" href="/morse-code-q-codes">Q-signals reference</a><a className="font-semibold text-sky-900 underline-offset-4 hover:underline" href="/morse-code-prosigns">Prosigns reference</a></> : null}
        </p>
        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group}>
              {grouped ? <h3 className="mb-5 text-2xl font-extrabold text-sky-950">{group}</h3> : null}
              <ChartGrid charts={charts.filter(chart => !grouped || chart.category === group)} grouped={grouped} nested={grouped} />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
