import SectionEyebrow from "~/client/components/shared/SectionEyebrow";

type SummaryItem = {
 title: string;
 text: string;
};

type DetailItem = {
 kicker: string;
 title: string;
 text: string;
 bullets?: string[];
};

type ChipLink = {
 label: string;
 href: string;
};

export default function ToolHowItWorks({
 eyebrow,
 title,
 description,
 referenceLabel,
 referenceValue,
 referenceText,
 chips,
 summary,
 details,
}: {
 eyebrow: string;
 title: string;
 description: string;
 referenceLabel: string;
 referenceValue: string;
 referenceText: string;
 chips: ChipLink[];
 summary: SummaryItem[];
 details: DetailItem[];
}) {
 return (
<section className="mw-static-surface-soft mw-how-section relative left-1/2 mt-10 w-screen max-w-[100vw] -translate-x-1/2 bg-[#fffaf2]/40 py-8 sm:py-10">
 <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
 <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
 <div>
 <SectionEyebrow>{eyebrow}</SectionEyebrow>

 <h2 className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
 {title}
 </h2>

 <p className="mw-text-muted mt-4 max-w-[78ch] text-base leading-relaxed text-slate-700 sm:text-lg">
 {description}
 </p>
 </div>

 <div className="mw-panel-dark rounded-xl bg-slate-950 px-4 py-4 text-white">
 <p className="mw-output-muted font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
 {referenceLabel}
 </p>
 <p className="mw-output-text mt-2 font-mono text-lg font-bold tracking-[0.18em] text-sky-100">
 {referenceValue}
 </p>
 <p className="mw-output-soft mt-2 text-sm leading-relaxed text-slate-200">
 {referenceText}
 </p>
 </div>
 </div>

 <nav className="mt-6 flex flex-wrap gap-2" aria-label={`${eyebrow} notes`}>
 {chips.map((chip) => (
 <a
 key={chip.href + chip.label}
 href={chip.href}
            className="mw-button-outline mw-button-secondary mw-light-interactive-link inline-flex min-h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-[#fffdf8] px-4 py-2 text-center text-sm font-bold leading-none text-sky-950 transition-[background-color,border-color,color] duration-100 ease-out hover:bg-[#fffaf2] hover:text-sky-950 focus:outline-none">
 {chip.label}
 </a>
 ))}
 </nav>

 <dl className="mt-7 grid gap-4 md:grid-cols-3">
 {summary.map((item) => (
 <div key={item.title} className="mw-static-panel rounded-xl bg-[#fffdf8]/75 p-4">
 <dt className="mw-heading text-base font-extrabold text-sky-950">
 {item.title}
 </dt>
 <dd className="mw-text-muted mt-2 text-base leading-relaxed text-slate-700">
 {item.text}
 </dd>
 </div>
 ))}
 </dl>

 <div className="mw-text-muted mt-8 text-slate-700">
 {details.map((detail, index) => (
 <section
 id={chips[index]?.href.replace("#","")}
 key={detail.title}
 className="py-7 first:pt-0 last:pb-0">
 <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
 <header>
 <p className="mw-muted-label font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
 {detail.kicker}
 </p>
 <h3 className="mw-heading mt-2 text-2xl font-extrabold leading-tight text-sky-950">
 {detail.title}
 </h3>
 </header>

 <div>
 <p className="max-w-[82ch] text-base leading-relaxed sm:text-lg">
 {detail.text}
 </p>
 {detail.bullets?.length ? (
 <ul className="mt-4 grid gap-2 pl-5 text-base leading-relaxed sm:text-lg lg:grid-cols-2">
 {detail.bullets.map((bullet) => (
 <li key={bullet} className="list-disc">{bullet}</li>
 ))}
 </ul>
 ) : null}
 </div>
 </div>
 </section>
 ))}
 </div>
 </div>
 </section>
 );
}
