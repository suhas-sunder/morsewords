import type { Route } from "./+types/changelog";

import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import { UtilityContentPanel, UtilityPageHeader, UtilityPageShell } from "~/client/components/shared/UtilityPageLayout";
import { canonicalUrl, seoMeta } from "~/client/seo";

const CANONICAL_PATH = "/changelog";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

const entries = [
  {
    date: "July 11, 2026",
    title: "Audio and book export reliability",
    changes: [
      "Completed long-form audio and video export handling with safer multipart downloads.",
      "Refined book, audiobook, and printable-book behavior for chapter-based use.",
    ],
  },
  {
    date: "July 10, 2026",
    title: "Reference and practice improvements",
    changes: [
      "Expanded timing, reference, practice, and skills-test guidance.",
      "Improved audio/video export feedback and browser-support messaging.",
    ],
  },
] as const;

export function links() { return [{ rel: "canonical", href: CANONICAL_URL }]; }

export function meta(_: Route.MetaArgs) {
  return seoMeta({
    title: "MorseWords Changelog | Meaningful Product Updates",
    description: "Read verified, user-facing MorseWords updates for tools, exports, books, practice, references, and accessibility.",
    path: CANONICAL_PATH,
  });
}

export default function ChangelogRoute() {
  const jsonLd = [{ "@context": "https://schema.org", "@type": "WebPage", name: "MorseWords Changelog", url: CANONICAL_URL }, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") }, { "@type": "ListItem", position: 2, name: "Changelog", item: CANONICAL_URL }] }];
  return <><UtilityPageShell><UtilityPageHeader eyebrow="Product updates" title="MorseWords changelog"><p className="mt-4 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">This page records meaningful user-facing changes. It is not a complete commit history.</p></UtilityPageHeader><UtilityContentPanel>{entries.map((entry) => <section key={entry.date} className="space-y-3"><p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{entry.date}</p><h2 className="text-2xl font-extrabold text-sky-950">{entry.title}</h2><ul className="list-disc space-y-2 pl-5">{entry.changes.map((change) => <li key={change}>{change}</li>)}</ul></section>)}</UtilityContentPanel></UtilityPageShell><BreadcrumbTrail current="Changelog" placement="pageBottom" /><JsonLdScript jsonLd={jsonLd} /></>;
}
