import * as React from "react";
import { Link } from "react-router";

import { PlayIcon, PrintIcon, QrCodeIcon } from "~/client/assets/svg/Icons";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  Eyebrow,
  PageHero,
  StaticPanel,
  WAVE_PAGE_MAIN_CLASS,
} from "~/client/components/shared/MorseLearningLayout";
import { ToolButton } from "~/client/components/shared/ToolWorkspace";
import { playMorsePattern } from "~/client/components/shared/playMorsePattern";
import {
  INTERNATIONAL_MORSE_A_TO_Z,
  MORSE_LANGUAGE_PAGES,
  type InternationalMorseLetter,
  type MorseLanguageCharacter,
  type MorseLanguagePage,
} from "~/client/data/morseLanguages";
import { ROUTES, absoluteUrl } from "~/client/data/routes";
import { SITE_URL, canonicalUrl } from "~/client/seo";

const QR_SIZE = 148;
const DEFAULT_AUDIO_SETTINGS = {
  wpm: 16,
  farnsworthWpm: 12,
  frequency: 560,
};
let qrCodeModulePromise: Promise<typeof import("qrcode")> | null = null;

function useQrCode(url: string) {
  const [qrCodeUrl, setQrCodeUrl] = React.useState("");
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    setQrCodeUrl("");
    setFailed(false);

    if (!qrCodeModulePromise) qrCodeModulePromise = import("qrcode");

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
        .mw-language-print-actions,
        .mw-language-print-hide {
          display: none !important;
        }
        .mw-page-content,
        .mw-language-main {
          display: block !important;
          max-width: none !important;
          padding: 0 !important;
          margin: 0 !important;
          overflow: visible !important;
        }
        .mw-language-print-sheet {
          background: #ffffff !important;
          box-shadow: none !important;
          border: 0 !important;
          margin: 0 !important;
          max-width: none !important;
          padding: 0 !important;
        }
      }
    `}</style>
  );
}

export function MorseCodeByLanguageHub() {
  const canonicalPath = ROUTES.morseCodeByLanguage;
  const canonical = canonicalUrl(canonicalPath);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Morse Code by Language",
      url: canonical,
      description:
        "A MorseWords hub for language-specific Morse code adaptations and transliteration practice pages, including Wabun code, Cyrillic Morse, Greek Morse, and Latin-alphabet language guides.",
      isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: MORSE_LANGUAGE_PAGES.map((page, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${page.languageName} Morse code`,
          url: canonicalUrl(page.path),
        })),
      },
    },
    breadcrumbJsonLd("Morse Code by Language", canonicalPath),
  ];

  return (
    <main className={`${WAVE_PAGE_MAIN_CLASS} mw-language-main`}>
      <JsonLdScript jsonLd={jsonLd} />
      <PageHero
        eyebrow="Morse code by language"
        title="Morse Code by Language"
        description="Explore how Morse mappings work beyond the basic A-Z chart. Some scripts have established Morse adaptations, while other use cases rely on transliteration before sending International Morse."
      >
        <ActionLinks
          links={[
            { href: ROUTES.home, label: "Open translator", primary: true },
            { href: ROUTES.audio, label: "Hear Morse audio" },
            { href: ROUTES.internationalReference, label: "International reference" },
          ]}
        />
      </PageHero>

      <section className="mt-8 sm:mt-10" aria-labelledby="language-list">
        <div className="max-w-[68ch]">
          <Eyebrow>Supported first set</Eyebrow>
          <h2
            id="language-list"
            className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
          >
            Start with accurate language-focused Morse pages
          </h2>
          <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
            Each page is written in English, shows the target script or
            romanization where useful, and keeps the system label honest:
            native-script adaptation, International Morse with language notes,
            or transliteration practice.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {MORSE_LANGUAGE_PAGES.map((page) => (
            <Link
              key={page.slug}
              to={page.path}
              className="mw-button-outline mw-related-tool-link mw-surface-card block cursor-pointer rounded-xl bg-[#fffdf8]/86 p-5 no-underline hover:bg-[#fffaf2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            >
              <span className="mw-muted-label font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                {page.script} / {page.morseSystemName}
              </span>
              <span className="mw-heading mt-3 block text-2xl font-extrabold text-sky-950">
                {page.languageName}
              </span>
              <span className="mt-1 block text-lg font-bold text-slate-700">
                {page.nativeName}
              </span>
              <span className="mw-muted-label mt-3 block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                {page.standardClassification}
              </span>
              <span className="mw-text-muted mt-3 block text-sm leading-relaxed text-slate-700">
                {page.shortDescription}
              </span>
              <span className="mw-link mt-4 inline-block text-sm font-semibold text-sky-900">
                Open {page.languageName} page -&gt;
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,0.62fr)_minmax(260px,0.38fr)]">
        <StaticPanel as="section">
          <Eyebrow>Adaptation vs transliteration</Eyebrow>
          <h2 className="mw-heading mt-3 text-2xl font-extrabold text-sky-950">
            Not every language has a separate official alphabet
          </h2>
          <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
            Morse can be used with different writing systems in more than one
            way. Japanese Wabun code maps kana to Morse patterns. Russian and
            Greek pages here show native-script Morse tables. German, French,
            Spanish, Italian, and Portuguese primarily use International Morse
            for Latin letters, with careful notes for diacritics and extensions.
            Korean is presented as romanization practice instead of an invented
            Hangul Morse system.
          </p>
        </StaticPanel>
        <StaticPanel as="section">
          <Eyebrow>Next steps</Eyebrow>
          <h2 className="mw-heading mt-3 text-2xl font-extrabold text-sky-950">
            Hear, practice, and print
          </h2>
          <div className="mt-4 grid gap-2">
            {[
              { href: ROUTES.audio, label: "Use Morse audio" },
              { href: ROUTES.practice, label: "Practice recognition" },
              { href: ROUTES.printablePages, label: "Build custom printables" },
            ].map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="mw-button-outline mw-light-interactive-link block cursor-pointer rounded-lg bg-[#fffdf8] px-3 py-2 text-sm font-bold text-sky-950 no-underline hover:bg-[#fffaf2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </StaticPanel>
      </section>

      <BreadcrumbTrail current="Morse Code by Language" placement="contentFooter" />
    </main>
  );
}

export function MorseLanguageDetailPage({
  language,
}: {
  language: MorseLanguagePage;
}) {
  const canonical = canonicalUrl(language.path);
  const { failed: qrFailed, qrCodeUrl } = useQrCode(canonical);
  const [audioSettings, setAudioSettings] = React.useState(DEFAULT_AUDIO_SETTINGS);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${language.languageName} Morse Code`,
      url: canonical,
      description: language.description,
      isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
      about: [
        language.morseSystemName,
        language.script,
        "Morse code",
      ],
    },
    breadcrumbJsonLd(`${language.languageName} Morse Code`, language.path),
  ];

  function printSheet() {
    if (typeof window !== "undefined") window.print();
  }

  function playPattern(pattern: string) {
    playMorsePattern(pattern, audioSettings);
  }

  return (
    <main
      className={`${WAVE_PAGE_MAIN_CLASS} mw-language-main`}
      data-testid="morse-language-page"
      data-language-slug={language.slug}
    >
      <PrintStyles />
      <JsonLdScript jsonLd={jsonLd} />
      <PageHero
        eyebrow={`${language.script} Morse`}
        title={`${language.languageName} Morse Code`}
        description={language.description}
      >
        <ActionLinks
          links={[
            { href: ROUTES.morseCodeByLanguage, label: "All language pages", primary: true },
            { href: ROUTES.audio, label: "Hear Morse audio" },
            { href: ROUTES.practice, label: "Practice Morse" },
          ]}
        />
      </PageHero>

      <section className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,0.66fr)_minmax(260px,0.34fr)]">
        <StaticPanel as="section">
          <Eyebrow>System note</Eyebrow>
          <h2 className="mw-heading mt-3 text-2xl font-extrabold text-sky-950">
            {language.morseSystemName}
          </h2>
          <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
            {language.methodologyNote}
          </p>
          <p className="mw-muted-label mt-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            {language.standardClassification}
          </p>
          <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
            {language.coverageNote}
          </p>
        </StaticPanel>
        <StaticPanel as="aside">
          <Eyebrow>Examples</Eyebrow>
          <div className="mt-4 grid gap-3">
            {language.examples.map((example) => (
              <div key={example.label}>
                <p className="mw-heading text-lg font-extrabold text-sky-950">
                  {example.label}
                </p>
                <p className="mw-text-soft text-sm text-slate-600">
                  {example.text}
                </p>
                <p className="mt-1 font-mono text-sm font-bold tracking-[0.12em] text-slate-950">
                  {example.morse}
                </p>
              </div>
            ))}
          </div>
        </StaticPanel>
      </section>

      <section className="mt-10" aria-labelledby="language-card-heading">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.62fr)_minmax(280px,0.38fr)] lg:items-end">
          <div className="max-w-[68ch]">
            <Eyebrow>Interactive cards</Eyebrow>
            <h2
              id="language-card-heading"
              className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
            >
              Hear each pattern
            </h2>
            <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
              Each card shows the target character, a reading or Latin
              reference, and the Morse pattern. The English A-Z reference stays
              beside the language table so you can compare rhythm without
              confusing a language adaptation with transliteration.
            </p>
          </div>
          <LanguageAudioSettings
            settings={audioSettings}
            onChange={setAudioSettings}
          />
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
          <div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2"
            data-testid="language-character-grid"
          >
            {language.characters.map((item) => (
              <LanguageCharacterCard
                key={item.id}
                item={item}
                language={language}
                onPlay={playPattern}
              />
            ))}
          </div>
          <InternationalMorseReference onPlay={playPattern} />
        </div>
      </section>

      <section
        className="mt-10"
        aria-labelledby="language-print-heading"
        data-testid="language-print-section"
      >
        <div className="mw-language-print-actions mb-5 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-[68ch]">
            <Eyebrow>Printable sheet</Eyebrow>
            <h2
              id="language-print-heading"
              className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
            >
              Side-by-side study sheet
            </h2>
            <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
              Print a light, classroom-friendly sheet with the target script,
              readings, Morse patterns, MorseWords URL, and a QR code back to
              this exact page.
            </p>
          </div>
          <ToolButton onClick={printSheet} tone="dark" data-testid="language-print-button">
            <PrintIcon aria-hidden="true" />
            Print sheet
          </ToolButton>
        </div>

        <PrintableLanguageSheet
          language={language}
          qrCodeUrl={qrCodeUrl}
          qrFailed={qrFailed}
        />
      </section>

      <section
        className="mw-language-print-hide mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.58fr)_minmax(260px,0.42fr)]"
        aria-labelledby="language-guide-heading"
        data-testid="language-seo-section"
      >
        <div>
          <Eyebrow>Guide</Eyebrow>
          <h2
            id="language-guide-heading"
            className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
          >
            How to use this {language.languageName} Morse page
          </h2>
          <div className="mw-text-muted mt-4 grid gap-4 text-base leading-relaxed text-slate-700">
            <p>
              Start with the character cards, then listen to a few related
              patterns in a row. The Morse pattern is shown with dots and dashes;
              spaces separate characters in examples, and a slash is used as a
              word break on MorseWords tools.
            </p>
            <p>
              The play buttons use the same browser audio approach as other
              MorseWords reference pages. They are meant for rhythm checking and
              practice, not for claiming a new official language standard.
            </p>
            <p>{language.methodologyNote}</p>
          </div>
        </div>
        <StaticPanel as="aside">
          <Eyebrow>Useful links</Eyebrow>
          <div className="mt-4 grid gap-2">
            {[
              { href: ROUTES.morseCodeByLanguage, label: "Morse code by language hub" },
              { href: ROUTES.home, label: "Morse code translator" },
              { href: ROUTES.audio, label: "Morse code audio generator" },
              { href: ROUTES.printablePages, label: "Printable Morse pages" },
              { href: ROUTES.sources, label: "MorseWords sources" },
            ].map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="mw-button-outline mw-light-interactive-link block cursor-pointer rounded-lg bg-[#fffdf8] px-3 py-2 text-sm font-bold text-sky-950 no-underline hover:bg-[#fffaf2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </StaticPanel>
      </section>

      <BreadcrumbTrail
        current={`${language.languageName} Morse Code`}
        placement="contentFooter"
      />
    </main>
  );
}

function LanguageCharacterCard({
  item,
  language,
  onPlay,
}: {
  item: MorseLanguageCharacter;
  language: MorseLanguagePage;
  onPlay: (pattern: string) => void;
}) {
  const comparison = englishComparisonFor(item);

  return (
    <article
      className="mw-static-panel rounded-xl bg-[#fffdf8] p-5"
      data-testid="language-character-card"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mw-muted-label font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
            {item.reference}
          </p>
          <h3 className="mw-heading mt-2 text-5xl font-black leading-none text-sky-950">
            {item.target}
          </h3>
          {item.reading ? (
            <p className="mt-2 text-sm font-bold text-slate-700">
              Reading: {item.reading}
            </p>
          ) : null}
        </div>
        <ToolButton
          aria-label={`Play ${item.label} Morse pattern ${item.morse}`}
          onClick={() => onPlay(item.morse)}
          data-testid="language-card-play"
        >
          <PlayIcon aria-hidden="true" />
          Play
        </ToolButton>
      </div>
      <p className="mt-4 font-mono text-lg font-bold tracking-[0.16em] text-slate-950">
        {item.morse}
      </p>
      <p className="mw-text-soft mt-2 text-sm leading-relaxed text-slate-600">
        {language.morseSystemName}: {item.label}
        {item.notes ? ` - ${item.notes}` : ""}
      </p>
      {comparison ? (
        <p className="mt-3 rounded-lg bg-[#f2eee6] px-3 py-2 text-xs font-semibold leading-relaxed text-slate-700">
          English comparison: {comparison.letter} is{" "}
          <span className="font-mono tracking-[0.12em] text-slate-950">
            {comparison.morse}
          </span>
        </p>
      ) : null}
    </article>
  );
}

function LanguageAudioSettings({
  settings,
  onChange,
}: {
  settings: typeof DEFAULT_AUDIO_SETTINGS;
  onChange: React.Dispatch<React.SetStateAction<typeof DEFAULT_AUDIO_SETTINGS>>;
}) {
  return (
    <StaticPanel as="section">
      <Eyebrow>Playback settings</Eyebrow>
      <div className="mt-3 grid gap-3" data-testid="language-audio-settings">
        <CompactRange
          id="language-audio-wpm"
          label="Character speed"
          value={settings.wpm}
          min={5}
          max={35}
          unit="WPM"
          onChange={(wpm) =>
            onChange((current) => ({
              ...current,
              wpm,
              farnsworthWpm: Math.min(current.farnsworthWpm, wpm),
            }))
          }
        />
        <CompactRange
          id="language-audio-fwpm"
          label="Farnsworth spacing"
          value={settings.farnsworthWpm}
          min={5}
          max={settings.wpm}
          unit="WPM"
          onChange={(farnsworthWpm) =>
            onChange((current) => ({ ...current, farnsworthWpm }))
          }
        />
        <CompactRange
          id="language-audio-tone"
          label="Tone"
          value={settings.frequency}
          min={220}
          max={1000}
          step={10}
          unit="Hz"
          onChange={(frequency) =>
            onChange((current) => ({ ...current, frequency }))
          }
        />
      </div>
    </StaticPanel>
  );
}

function CompactRange({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="flex items-center justify-between gap-3 text-sm font-bold text-slate-700">
        <span>{label}</span>
        <span className="font-mono text-xs text-slate-500">
          {value} {unit}
        </span>
      </span>
      <input
        id={id}
        className="mt-2 w-full cursor-pointer accent-sky-400"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </label>
  );
}

function InternationalMorseReference({
  onPlay,
}: {
  onPlay: (pattern: string) => void;
}) {
  return (
    <StaticPanel as="aside">
      <Eyebrow>English A-Z</Eyebrow>
      <h3 className="mw-heading mt-3 text-2xl font-extrabold text-sky-950">
        International Morse comparison
      </h3>
      <p className="mw-text-soft mt-2 text-sm leading-relaxed text-slate-600">
        Use this complete English alphabet reference to play, read, and compare
        A-Z patterns beside the language-specific table.
      </p>
      <div
        className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-2"
        data-testid="english-a-z-reference"
      >
        {INTERNATIONAL_MORSE_A_TO_Z.map((item) => (
          <button
            key={item.letter}
            type="button"
            onClick={() => onPlay(item.morse)}
            className="cursor-pointer rounded-lg bg-[#fffdf8] px-3 py-2 text-left text-sm font-bold text-slate-900 hover:bg-[#fffaf2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            aria-label={`Play English letter ${item.letter} Morse pattern ${item.morse}`}
          >
            <span className="inline-block min-w-5 text-sky-950">
              {item.letter}
            </span>
            <span className="font-mono tracking-[0.12em] text-slate-950">
              {item.morse}
            </span>
          </button>
        ))}
      </div>
    </StaticPanel>
  );
}

function PrintableLanguageSheet({
  language,
  qrCodeUrl,
  qrFailed,
}: {
  language: MorseLanguagePage;
  qrCodeUrl: string;
  qrFailed: boolean;
}) {
  const targetUrl = absoluteUrl(language.path);
  return (
    <article
      className="mw-language-print-sheet mx-auto max-w-[8.5in] rounded-xl bg-white p-5 text-slate-950 shadow-sm sm:p-8"
      data-testid="language-printable-sheet"
    >
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            MorseWords language sheet
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
            {language.languageName} Morse Code
          </h2>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            {language.nativeName} / {language.morseSystemName}
          </p>
        </div>
        <div className="w-32 shrink-0 text-right" data-testid="language-print-qr">
          {qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt={`QR code for ${targetUrl}`}
              className="ml-auto h-24 w-24 bg-white"
            />
          ) : (
            <div className="ml-auto grid h-24 w-24 place-items-center border border-slate-300 bg-white p-2 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
              <QrCodeIcon aria-hidden="true" />
              {qrFailed ? "QR unavailable" : "QR code"}
            </div>
          )}
          <p className="mt-2 break-words text-[10px] leading-snug text-slate-600">
            {targetUrl}
          </p>
        </div>
      </header>

      <div className="mt-5 overflow-x-auto">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.42fr)]">
          <PrintableLanguageTable language={language} />
          <PrintableEnglishTable />
        </div>
      </div>

      <footer className="mt-6 flex flex-wrap items-end justify-between gap-3 border-t border-slate-200 pt-3 text-[11px] leading-relaxed text-slate-600">
        <p>
          <strong>MorseWords.com</strong> / {targetUrl}
        </p>
        <p className="max-w-[42ch] text-right">
          {language.coverageNote}
        </p>
      </footer>
    </article>
  );
}

function PrintableLanguageTable({ language }: { language: MorseLanguagePage }) {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <caption className="pb-2 text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {language.languageName} alphabet
      </caption>
      <thead>
        <tr className="border-b border-slate-300">
          <th className="py-2 pr-3 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
            Reference
          </th>
          <th className="py-2 pr-3 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
            Character
          </th>
          <th className="py-2 pr-3 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
            Reading
          </th>
          <th className="py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
            Morse
          </th>
        </tr>
      </thead>
      <tbody>
        {language.characters.map((item) => (
          <tr key={item.id} className="border-b border-slate-200">
            <td className="py-2 pr-3 font-semibold text-slate-800">
              {item.reference}
            </td>
            <td className="py-2 pr-3 text-2xl font-black text-slate-950">
              {item.target}
            </td>
            <td className="py-2 pr-3 font-semibold text-slate-700">
              {item.reading ?? "Reference only"}
            </td>
            <td className="py-2 font-mono font-bold tracking-[0.12em] text-slate-950">
              {item.morse}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PrintableEnglishTable() {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <caption className="pb-2 text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        English A-Z comparison
      </caption>
      <thead>
        <tr className="border-b border-slate-300">
          <th className="py-2 pr-3 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
            Letter
          </th>
          <th className="py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
            Morse
          </th>
        </tr>
      </thead>
      <tbody>
        {INTERNATIONAL_MORSE_A_TO_Z.map((item) => (
          <tr key={item.letter} className="border-b border-slate-200">
            <td className="py-2 pr-3 font-black text-slate-950">
              {item.letter}
            </td>
            <td className="py-2 font-mono font-bold tracking-[0.12em] text-slate-950">
              {item.morse}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function englishComparisonFor(item: MorseLanguageCharacter) {
  const source = `${item.reading ?? ""} ${item.reference}`;
  const match = source.match(/[A-Za-z]/);
  if (!match) return null;
  const letter = match[0].toUpperCase();
  return (
    INTERNATIONAL_MORSE_A_TO_Z.find((entry) => entry.letter === letter) ?? null
  );
}

function breadcrumbJsonLd(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code by Language",
        item: canonicalUrl(ROUTES.morseCodeByLanguage),
      },
      ...(path === ROUTES.morseCodeByLanguage
        ? []
        : [{ "@type": "ListItem", position: 3, name, item: canonicalUrl(path) }]),
    ],
  };
}
