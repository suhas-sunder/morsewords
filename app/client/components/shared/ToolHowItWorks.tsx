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
 <section className="mw-how-section mt-10 bg-[#fffaf2]/40 px-5 py-8 sm:px-8 sm:py-10">
 <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
 <div>
 <div className="flex items-center gap-3">
 <span className="h-px w-8 bg-sky-800"/>
 <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
 {eyebrow}
 </span>
 </div>

 <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
 {title}
 </h2>

 <p className="mt-4 max-w-[78ch] text-base leading-relaxed text-slate-700 sm:text-lg">
 {description}
 </p>
 </div>

 <div className="rounded-xl bg-slate-950 px-4 py-4 text-white">
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

 <nav className="mt-6 flex flex-wrap gap-2" aria-label={`${eyebrow} notes`}>
 {chips.map((chip) => (
 <a
 key={chip.href + chip.label}
 href={chip.href}
              className="inline-flex min-h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-[#fffdf8] px-4 py-2 text-center text-sm font-bold leading-none text-sky-950 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.1)] transition hover:bg-white hover:text-sky-700 hover:outline-[rgba(11,36,71,0.22)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2">
 {chip.label}
 </a>
 ))}
 </nav>

 <dl className="mt-7 grid gap-4 md:grid-cols-3">
 {summary.map((item) => (
 <div key={item.title} className="rounded-xl bg-[#fffdf8]/75 p-4 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.08)]">
 <dt className="text-base font-extrabold text-sky-950">
 {item.title}
 </dt>
 <dd className="mt-2 text-base leading-relaxed text-slate-700">
 {item.text}
 </dd>
 </div>
 ))}
 </dl>

 <div className="mt-8 text-slate-700">
 {details.map((detail, index) => (
 <section
 id={chips[index]?.href.replace("#","")}
 key={detail.title}
 className="py-7 first:pt-0 last:pb-0">
 <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
 <header>
 <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
 {detail.kicker}
 </p>
 <h3 className="mt-2 text-2xl font-extrabold leading-tight text-sky-950">
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
 </section>
 );
}
