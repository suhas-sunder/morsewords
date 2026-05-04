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
 <section className="mt-8 overflow-hidden rounded-2xl bg-[#fffaf2]">
 <div className="px-5 py-6 sm:px-8 sm:py-7">
 <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
 <div className="max-w-3xl">
 <div className="flex items-center gap-3">
 <span className="h-px w-8 bg-sky-800"/>
 <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
 {eyebrow}
 </span>
 </div>

 <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
 {title}
 </h2>

 <p className="mt-4 max-w-[72ch] text-base leading-relaxed text-slate-700 sm:text-lg">
 {description}
 </p>
 </div>

 <div className="rounded-xl bg-[#171717] px-4 py-3 text-white lg:w-64">
 <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
 {referenceLabel}
 </p>
 <p className="mt-2 font-mono text-lg font-bold tracking-[0.18em] text-sky-100">
 {referenceValue}
 </p>
 <p className="mt-2 text-sm leading-relaxed text-slate-200">
 {referenceText}
 </p>
 </div>
 </div>

 <nav className="mt-5 flex flex-wrap gap-2" aria-label={`${eyebrow} notes`}>
 {chips.map((chip) => (
 <a
 key={chip.href + chip.label}
 href={chip.href}
              className="inline-flex min-h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-slate-950 px-4 py-2 text-center text-sm font-semibold leading-none text-sky-100 transition hover:bg-slate-800 hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2">
 {chip.label}
 </a>
 ))}
 </nav>
 </div>

 <div className="px-5 pb-6 sm:px-8 sm:pb-7">
 <dl className="grid gap-5 pb-6 md:grid-cols-3">
 {summary.map((item) => (
 <div key={item.title} className="rounded-xl bg-[#f7f4ee] p-4">
 <dt className="text-base font-extrabold text-sky-950">
 {item.title}
 </dt>
 <dd className="mt-3 max-w-[34ch] text-base leading-relaxed text-slate-700">
 {item.text}
 </dd>
 </div>
 ))}
 </dl>

 <div className="text-slate-700">
 {details.map((detail, index) => (
 <section
 id={chips[index]?.href.replace("#","")}
 key={detail.title}
 className="py-7">
 <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
 <header>
 <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
 {detail.kicker}
 </p>
 <h3 className="mt-2 text-2xl font-extrabold text-sky-950">
 {detail.title}
 </h3>
 </header>

 <div className="max-w-[72ch]">
 <p className="text-base leading-relaxed sm:text-lg">
 {detail.text}
 </p>
 {detail.bullets?.length ? (
 <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed sm:text-lg">
 {detail.bullets.map((bullet) => (
 <li key={bullet}>{bullet}</li>
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
