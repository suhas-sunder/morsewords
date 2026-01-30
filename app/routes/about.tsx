import * as React from "react";
import type { Route } from "./+types/about";

import styles from "~/client/components/home/styles";
import JsonLdScript from "~/client/components/home/JsonLdScript";

const SITE_URL = "https://morsewords.com";
const CANONICAL_PATH = "/about";
const CANONICAL_URL = SITE_URL + CANONICAL_PATH;

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About MorseWords | Practical Morse Code Tools (Not a Course)" },
    {
      name: "description",
      content:
        "MorseWords is a collection of fast, practical Morse code tools: translate text, hear audio, practice patterns, type Morse, and look up symbols. Built for utility, not lessons.",
    },
    {
      name: "keywords",
      content:
        "about morsewords, morse code tools, morse translator, morse practice, morse dictionary",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: "About MorseWords" },
    {
      property: "og:description",
      content:
        "A set of practical Morse code tools, not a course. Translate, listen, practice, type, and look up Morse instantly.",
    },
    { property: "og:url", content: CANONICAL_URL },

    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "About MorseWords" },
    {
      name: "twitter:description",
      content:
        "Practical Morse code tools for translating, listening, practicing, and typing. No course, no fluff.",
    },
  ];
}

function SectionCard(props: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={props.id} style={styles.section}>
      <div style={{ ...styles.card, ...styles.cardPad }}>
        <h2 style={styles.sectionTitle}>{props.title}</h2>
        <div
          style={{ color: "#111317", lineHeight: 1.65, fontSize: "1.02rem" }}
        >
          {props.children}
        </div>
      </div>
    </section>
  );
}

export default function About() {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About MorseWords",
    url: CANONICAL_URL,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL + "/" },
    about: {
      "@type": "SoftwareApplication",
      name: "MorseWords",
      applicationCategory: "UtilityApplication",
      operatingSystem: "All",
      url: SITE_URL + "/",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    author: {
      "@type": "Person",
      name: "Suhas Sunder",
      jobTitle: "Software Developer",
      url: "https://www.suhassunder.com",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: CANONICAL_URL,
      },
    ],
  };

  const jsonLd = [pageJsonLd, breadcrumbJsonLd];

  return (
    <div style={styles.page}>
      <JsonLdScript data={jsonLd} />
      <div style={styles.wrap}>
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a
                href="/"
                className="underline hover:no-underline cursor-pointer"
              >
                Home
              </a>
            </li>
            <li>/</li>
            <li className="font-semibold text-gray-900">About</li>
          </ol>
        </nav>

        <header
          style={{ ...styles.header, borderBottom: "none", paddingBottom: 6 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <h1 style={styles.h1}>About MorseWords</h1>
            <p style={styles.lead}>
              Practical Morse code utilities built for fast conversion, clean
              playback, and focused practice.
            </p>
          </div>
          <a
            href="/how-to-use"
            className="rounded-xl px-4 py-2 font-semibold cursor-pointer transition-colors"
            style={{
              border: "1px solid #0b2447",
              background: "#0b2447",
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            How to use
          </a>
        </header>

        <div
          className="mt-4 flex flex-wrap gap-2"
          style={{ alignItems: "center" }}
        >
          {[
            ["#what-this-is", "What this is"],
            ["#what-this-is-not", "What this is not"],
            ["#tools-not-courses", "Tools, not courses"],
            ["#author", "Author"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-full border px-3 py-2 text-sm font-semibold cursor-pointer transition-colors hover:bg-white"
              style={{ borderColor: "#e6e8ef", background: "#f7f8fb" }}
            >
              {label}
            </a>
          ))}
        </div>

        <SectionCard id="what-this-is" title="What this is">
          <p>
            MorseWords is a small suite of browser-based tools for working with
            International Morse code. It’s designed for people who want an
            immediate, reliable workflow: translate text to Morse, decode Morse
            back to text, listen to a generated Morse string at a chosen speed,
            run quick drills, and look up patterns without hunting through PDFs
            or scattered charts.
          </p>
          <p>
            The emphasis is utility and clarity. The interfaces are
            intentionally direct, with fast copy controls and predictable
            formatting rules so you can move between tools without re-learning
            how each one behaves.
          </p>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li>
              <strong>Translate:</strong> convert text to Morse or decode Morse
              to text.
            </li>
            <li>
              <strong>Audio:</strong> generate playback at configurable WPM and
              tone.
            </li>
            <li>
              <strong>Practice:</strong> drills with instant feedback and
              minimal friction.
            </li>
            <li>
              <strong>Typing:</strong> type dots and dashes and see decoded
              output.
            </li>
            <li>
              <strong>Dictionary:</strong> filterable lookup tables with copy
              controls.
            </li>
          </ul>
        </SectionCard>

        <SectionCard id="what-this-is-not" title="What this is not">
          <p>
            MorseWords is not trying to be everything for everyone. The goal is
            to keep the scope narrow so the tools stay fast, dependable, and
            easy to verify.
          </p>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li>
              <strong>Not a course:</strong> there’s no curriculum, tracking, or
              “lesson plan” flow.
            </li>
            <li>
              <strong>Not a community platform:</strong> no accounts, feeds, or
              social features.
            </li>
            <li>
              <strong>Not a certification prep site:</strong> no test programs
              or completion claims.
            </li>
            <li>
              <strong>Not a history encyclopedia:</strong> no long-form articles
              or storytelling.
            </li>
          </ul>
          <p style={{ marginTop: 10 }}>
            If you want structured learning, there are plenty of excellent
            training resources elsewhere. MorseWords is for the moments in
            between: when you need a conversion, a clean audio string, or a
            quick reference, right now.
          </p>
        </SectionCard>

        <SectionCard id="tools-not-courses" title="Tools, not courses">
          <p>
            “Tools, not courses” is the operating rule behind the site. It
            shapes what gets added and what stays out. Each page is built around
            a single job with minimal setup and clear outputs. That means:
          </p>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li>
              <strong>Low cognitive overhead:</strong> settings are limited to
              what materially changes the result.
            </li>
            <li>
              <strong>Copy-first outputs:</strong> if you’re here, you likely
              want to paste the result somewhere else.
            </li>
            <li>
              <strong>Consistent conventions:</strong> spacing and decoding
              expectations are stable across tools.
            </li>
            <li>
              <strong>No upsell funnel:</strong> the value is the tool working
              quickly and correctly.
            </li>
          </ul>
          <p style={{ marginTop: 10 }}>
            If you’re new to the tool set, use the usage guide for the exact
            input rules and workflow across pages.
          </p>
          <p style={{ marginTop: 12 }}>
            <a
              href="/how-to-use"
              className="underline hover:no-underline cursor-pointer font-semibold"
            >
              Open the “How to use” guide
            </a>
          </p>
        </SectionCard>

        <SectionCard id="author" title="Author">
          <p>
            MorseWords is built and maintained by <strong>Suhas Sunder</strong>{" "}
            (Software Developer). I build production web applications and small,
            focused utilities that prioritize speed, correctness, and clean UX.
          </p>
          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            <div
              style={{
                ...styles.card,
                padding: 14,
                borderRadius: 14,
                background: "#fbfcff",
              }}
            >
              <div style={{ fontWeight: 800 }}>
                Suhas Sunder - Software Developer
              </div>
              <div style={{ color: "#5a616c", marginTop: 4 }}>
                Full-stack web development: React, TypeScript, Remix, Node.js,
                Express, PostgreSQL, Prisma.
              </div>
              <div style={{ color: "#5a616c", marginTop: 4 }}>
                Master’s in Electrical and Computer Engineering (Dec 2025),
                focused on applied software engineering.
              </div>
            </div>

            <div style={{ ...styles.card, padding: 14, borderRadius: 14 }}>
              <div style={{ fontWeight: 800 }}>Portfolio</div>
              <div style={{ marginTop: 6 }}>
                <a
                  href="https://www.suhassunder.com"
                  className="underline hover:no-underline cursor-pointer font-semibold"
                >
                  www.suhassunder.com
                </a>
              </div>
              <div style={{ color: "#5a616c", marginTop: 6 }}>
                You can review skills and projects there. The intent here is
                simple: make it obvious there’s a real person behind the site,
                and that the scope is intentionally maintained.
              </div>
            </div>
          </div>

          <p style={{ marginTop: 12 }}>
            If something looks off, inconsistent, or unclear, that’s a signal to
            tighten the tool, not expand the story around it. The trust moat is
            boring on purpose: predictable behavior, transparent intent, and
            pages that do what they claim.
          </p>
        </SectionCard>

        <footer
          style={{
            padding: "12px 0 28px",
            color: "#5a616c",
            fontSize: ".95rem",
          }}
        >
          <div style={{ borderTop: "1px solid #e6e8ef", paddingTop: 14 }}>
            <span style={{ fontWeight: 700, color: "#111317" }}>
              MorseWords
            </span>{" "}
            <span>- focused Morse tools, built to stay focused.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
