import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import { ActionLinks, PageHero, SectionCard, WAVE_PAGE_MAIN_CLASS } from "~/client/components/shared/MorseLearningLayout";
import { PrintableChartLibrary, PRINTABLE_CHART_CATEGORIES } from "~/client/components/shared/PrintableCharts";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const TITLE = "Printable Morse Code Charts | PDF, PNG & Reference Sheets | MorseWords";
const DESCRIPTION = "Download 39 printable Morse code charts for alphabet, numbers, punctuation, timing, learning, radio, and language references. Choose PDF, PNG, JPG, or WebP.";
const CANONICAL_URL = canonicalUrl(ROUTES.printableChart);
const faqItems = [
  { q: "Which format should I choose for printing?", a: "Choose PDF for a chart fitted to one A4 page. In your print dialog, use Fit to printable area when printing on Letter paper or another size. PNG keeps the original image; JPG and WebP are useful when adding a chart to a document or presentation." },
  { q: "Can I edit the words or add an answer key?", a: "These are ready-made reference charts. Use the separate printable worksheet builder for custom words and sentences, classroom fields, difficulty presets, and optional answer keys." },
  { q: "Are the language charts all official International Morse alphabets?", a: "No. The collection includes established script adaptations, traditional extensions, and localized or transliteration conventions. Read each chart's note and use the language guide to distinguish these from the basic International Morse A–Z alphabet." },
  { q: "Does a printed chart teach Morse timing?", a: "A chart helps you check patterns, but listening builds recognition of their rhythm. A dot lasts one unit, a dash three, a letter gap three, and a word gap seven. Pair a timing chart with audio practice rather than learning only the shapes." },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta() {
  return seoMeta({ title: TITLE, description: DESCRIPTION, path: ROUTES.printableChart });
}

export default function PrintableMorseCharts() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "CollectionPage", name: "Printable Morse Code Charts", url: CANONICAL_URL, description: DESCRIPTION, isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      { "@type": "ListItem", position: 2, name: "Printable Morse Code Charts", item: CANONICAL_URL },
    ] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  ];
  return (
    <>
      <main className={WAVE_PAGE_MAIN_CLASS}>
        <JsonLdScript jsonLd={jsonLd} />
        <PageHero eyebrow="Ready-made reference sheets" title="Printable Morse Code Charts"
          description="Choose from 39 charts for quick lookup, learning, timing, radio, and language study. Keep a reference beside your practice notes or share one with a class.">
          <p className="max-w-[68ch] text-base leading-relaxed text-slate-700">Download a one-page A4 PDF or an image in PNG, JPG, or WebP format. Your browser prepares each download from the full-size chart.</p>
          <nav aria-label="Chart categories" className="mt-5">
            <ActionLinks links={[
              ...PRINTABLE_CHART_CATEGORIES.map(({ id, label }) => ({ href: `#${id}`, label })),
              { href: ROUTES.printableWorksheets, label: "Build worksheets" },
            ]} />
          </nav>
        </PageHero>
        <PrintableChartLibrary />
        <SectionCard eyebrow="From lookup to recall" title="Choose a chart for your next practice session" layout="stacked">
          <div className="grid gap-8 text-base leading-relaxed text-slate-700 lg:grid-cols-2">
            <div className="max-w-[58ch] space-y-4">
              <h3 className="text-2xl font-extrabold text-sky-950">Start with the reference you need</h3>
              <p>Use the alphabet chart to check a letter, the numbers and punctuation sheets to write a complete message, or the timing references to compare signal lengths and gaps. The learning charts organize patterns in different ways; pick one that helps you notice a small group of letters.</p>
              <p>Print at a readable size and keep the chart nearby while checking answers. For recall practice, cover it first, try a short word, then uncover it to review mistakes. Listening to the same word helps connect the printed pattern with its rhythm.</p>
            </div>
            <div className="max-w-[58ch] space-y-4">
              <h3 className="text-2xl font-extrabold text-sky-950">Keep references and exercises separate</h3>
              <p>The radio sheets explain operating shorthand and reference signals; a Q-signal or abbreviation is not an extra alphabet letter. Language charts also need context: a localized label does not necessarily mean a different Morse mapping.</p>
              <p>For exercises with your own words, student details, and answer keys, use the worksheet builder. For longer messages or processed book sections, use Printable Morse Pages. These charts stay ready-made so you can download a reference without configuring a generator.</p>
            </div>
          </div>
          <div className="mt-6">
            <ActionLinks links={[
              { href: ROUTES.printableWorksheets, label: "Create custom worksheets", primary: true },
              { href: ROUTES.printablePages, label: "Print text or book pages" },
              { href: ROUTES.chart, label: "Use the interactive chart" },
              { href: ROUTES.audio, label: "Hear Morse audio" },
            ]} />
          </div>
        </SectionCard>
        <FaqSectionGeneric title="Printable chart questions" items={faqItems} />
      </main>
      <BreadcrumbTrail current="Printable Morse Code Charts" />
    </>
  );
}
