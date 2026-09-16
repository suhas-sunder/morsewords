import { ActionLinkButton } from "./ActionControls";
import { SectionCard } from "./MorseLearningLayout";
import { getPrintableChartsForPage, type PrintableChart } from "~/client/data/printableCharts";

function PrintableChartFigure({ chart, compact }: { chart: PrintableChart; compact: boolean }) {
  const Heading = compact ? "h4" : "h3";
  return (
    <figure data-printable-chart={chart.id} className="min-w-0">
      <a
        href={chart.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open full-size ${chart.title} PNG (new tab)`}
        className="block aspect-[3/4] cursor-pointer rounded-xl bg-[#fffdf8] p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-900"
      >
        <img src={chart.url} alt={chart.alt} width={chart.width} height={chart.height}
          loading="lazy" decoding="async" className="h-full w-full object-contain" />
      </a>
      <figcaption className="mt-4">
        <Heading className={`mw-heading font-extrabold text-sky-950 ${compact ? "text-xl" : "text-2xl"}`}>{chart.title}</Heading>
        <p className="mw-text-muted mt-2 max-w-[58ch] text-base leading-relaxed text-slate-700">{chart.description}</p>
        {chart.note ? <p className="mw-text-muted mt-3 max-w-[58ch] text-sm leading-relaxed text-slate-600">{chart.note}</p> : null}
        <div className="mt-4">
          <ActionLinkButton href={chart.url} target="_blank" rel="noopener noreferrer" size="sm" aria-label={`Open / download ${chart.title} PNG (new tab)`}>
            Open / download PNG
          </ActionLinkButton>
        </div>
        <a href={chart.referencePath} className="mt-3 inline-block font-semibold text-sky-900 underline-offset-4 hover:underline">{chart.referenceLabel}</a>
      </figcaption>
    </figure>
  );
}

export default function PrintableCharts({ path }: { path: string }) {
  const charts = getPrintableChartsForPage(path);
  if (!charts.length) return null;
  const isGallery = path === "/morse-code-printable-chart";
  const isLanguageHub = path === "/morse-code-by-language";
  const grouped = isGallery || isLanguageHub;
  const coreGroups = ["Quick reference", "Learning and memory", "Timing and spacing", "Radio and CW"];
  const groups = isGallery ? coreGroups : isLanguageHub ? [...new Set(charts.map((chart) => chart.category))] : ["Charts"];

  return (
    <div id="printable-charts" className="scroll-mt-6 print:hidden">
      <SectionCard
        eyebrow="Print and keep"
        title={isGallery ? "Ready-made printable Morse code charts" : isLanguageHub ? "Printable Morse charts by language" : "Printable charts for offline reference"}
        description={isLanguageHub
          ? "Browse 22 printable references, including established adaptations, traditional extensions, and localized or transliteration conventions. These are not all separate ITU alphabets."
          : isGallery
            ? "Choose from 17 ready-made charts for quick lookup, learning, timing, and radio study. For your own messages and exercises, use the worksheet builder above."
            : "Keep a reference beside your practice notes. Open a full-size PNG, then use your browser’s save or print option. Return to the interactive reference to hear and check patterns."}
        layout="stacked"
      >
        {grouped ? <p className="mb-6 max-w-[68ch] text-base leading-relaxed text-slate-700">Open any PNG in a new tab, then use your browser’s save image or print option. The full-size file is the same chart shown in the preview.</p> : null}
        <p className="mb-6 flex flex-wrap gap-x-6 gap-y-3">
          {!isGallery ? <a className="font-semibold text-sky-900 underline-offset-4 hover:underline" href="/morse-code-printable-chart#printable-charts">All printable charts and worksheets</a> : null}
          {!isLanguageHub ? <a className="font-semibold text-sky-900 underline-offset-4 hover:underline" href="/morse-code-by-language#printable-charts">Printable charts by language</a> : <a className="font-semibold text-sky-900 underline-offset-4 hover:underline" href="/international-morse-code-reference">International Morse reference</a>}
          {path === "/morse-code-amateur-radio-cw" ? <><a className="font-semibold text-sky-900 underline-offset-4 hover:underline" href="/morse-code-q-codes">Q-signals reference</a><a className="font-semibold text-sky-900 underline-offset-4 hover:underline" href="/morse-code-prosigns">Prosigns reference</a></> : null}
        </p>
        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group}>
              {grouped ? <h3 className="mb-5 text-2xl font-extrabold text-sky-950">{group}</h3> : null}
              <div className={grouped ? "grid items-start gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" : "grid max-w-[800px] items-start gap-x-8 gap-y-10 sm:grid-cols-2"}>
                {charts.filter((chart) => !grouped || chart.category === group).map((chart) => <PrintableChartFigure key={chart.id} chart={chart} compact={grouped} />)}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
