import { Form, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/contact";

import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import { UtilityContentPanel, UtilityPageHeader, UtilityPageShell } from "~/client/components/shared/UtilityPageLayout";
import { MORSEWORDS_SUPPORT_EMAIL, MORSEWORDS_SUPPORT_EMAIL_HREF } from "~/client/data/siteTrust";
import { canonicalUrl, seoMeta } from "~/client/seo";
import { CONTACT_CATEGORIES } from "~/contact.shared";

const CANONICAL_PATH = "/contact";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export async function action({ request }: Route.ActionArgs) {
  const { submitContactForm } = await import("~/server/contact.server");
  return submitContactForm(request);
}

export function links() { return [{ rel: "canonical", href: CANONICAL_URL }]; }
export function meta(_: Route.MetaArgs) { return seoMeta({ title: "Contact MorseWords | Support and Corrections", description: "Contact MorseWords for general questions, business, feature requests, bugs, accessibility, source, copyright, and privacy concerns.", path: CANONICAL_PATH }); }

export default function ContactRoute() {
  const result = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";
  const jsonLd = [{ "@context": "https://schema.org", "@type": "ContactPage", name: "Contact MorseWords", url: CANONICAL_URL, email: MORSEWORDS_SUPPORT_EMAIL, isPartOf: { "@type": "WebSite", name: "MorseWords", url: canonicalUrl("/") } }, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") }, { "@type": "ListItem", position: 2, name: "Contact", item: CANONICAL_URL }] }];
  return <><UtilityPageShell><UtilityPageHeader eyebrow="Contact" title="Contact MorseWords"><p className="mt-4 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">Send a question, correction, source concern, or bug report. Contact messages go to the MorseWords support inbox for review.</p></UtilityPageHeader><UtilityContentPanel><section className="space-y-3"><h2 className="text-2xl font-extrabold text-sky-950">Send a message</h2><p>For privacy, do not include sensitive personal information or attachments. You can also email <a href={MORSEWORDS_SUPPORT_EMAIL_HREF} className="font-semibold text-sky-900 underline-offset-4 hover:underline">{MORSEWORDS_SUPPORT_EMAIL}</a>.</p><Form method="post" className="grid gap-4" replace><div className="hidden" aria-hidden="true"><label htmlFor="contact-website">Website</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" /></div><label className="grid gap-1 font-semibold text-slate-800" htmlFor="contact-name">Name<input id="contact-name" name="name" required minLength={2} maxLength={100} autoComplete="name" className="rounded-lg bg-white px-3 py-2 font-normal text-slate-900" /></label><label className="grid gap-1 font-semibold text-slate-800" htmlFor="contact-email">Email<input id="contact-email" name="email" type="email" required maxLength={254} autoComplete="email" className="rounded-lg bg-white px-3 py-2 font-normal text-slate-900" /></label><label className="grid gap-1 font-semibold text-slate-800" htmlFor="contact-category">Category<select id="contact-category" name="category" required defaultValue="general" className="rounded-lg bg-white px-3 py-2 font-normal text-slate-900">{CONTACT_CATEGORIES.map((category) => <option key={category} value={category}>{({ general: "General questions", business: "Business", feature: "Feature requests", bug: "Bug reports", source: "Source, content, or copyright concerns" } as const)[category]}</option>)}</select></label><label className="grid gap-1 font-semibold text-slate-800" htmlFor="contact-subject">Subject<input id="contact-subject" name="subject" required minLength={3} maxLength={160} className="rounded-lg bg-white px-3 py-2 font-normal text-slate-900" /></label><label className="grid gap-1 font-semibold text-slate-800" htmlFor="contact-message">Message<textarea id="contact-message" name="message" required minLength={10} maxLength={4000} rows={7} className="rounded-lg bg-white px-3 py-2 font-normal text-slate-900" /></label><button type="submit" disabled={submitting} className="mw-button-outline w-fit rounded-lg bg-slate-950 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Sending…" : "Send message"}</button>{result ? <p role="status" aria-live="polite" className={result.ok ? "text-slate-700" : "text-slate-700"}>{result.ok ? "Thanks — your message was sent." : result.message}</p> : null}</Form></section><section className="space-y-3"><h2 className="text-2xl font-extrabold text-sky-950">What helps us review a report</h2><p>For a correction, include the page URL and the source or claim to check. For a bug, include the page URL, browser or device, expected result, and what happened.</p></section></UtilityContentPanel></UtilityPageShell><BreadcrumbTrail current="Contact" placement="pageBottom" /><JsonLdScript jsonLd={jsonLd} /></>;
}
