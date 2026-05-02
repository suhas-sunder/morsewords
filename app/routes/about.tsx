import * as React from "react";
import type { Route } from "./+types/about";

import styles from "~/client/components/shared/pageStyles";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/about";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);
const CREATOR_URL = "https://www.suhassunder.com";
const CREATOR_LINKEDIN = "https://www.linkedin.com/in/s-sunder";

export function links() {
  return [
    {
      rel: "canonical",
      href: CANONICAL_URL,
    },
  ];
}

export function meta(_: Route.MetaArgs) {
  return seoMeta({
    title: "About MorseWords | Practical Morse Code Tools",
    description:
      "Learn how MorseWords supports clean Morse translation, audio generation, practice drills, and printable worksheets for learners, teachers, radio clubs, and puzzle makers.",
    path: CANONICAL_PATH,
    keywords:
      "about morsewords, morse code tools, morse code translator, morse code decoder, morse code audio, morse code practice",
  });
}

function SectionCard(props: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={props.id} style={styles.section}>
      <div style={{ ...styles.card, ...styles.cardPad }}>
        <h2 className="font-bold text-sky-950" style={styles.sectionTitle}>
          {props.title}
        </h2>
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
    description:
      "MorseWords is a practical Morse code toolkit for translating, decoding, listening, typing, practicing, and looking up International Morse code.",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL + "/" },
    about: {
      "@type": "SoftwareApplication",
      name: "MorseWords",
      applicationCategory: "UtilityApplication",
      operatingSystem: "All",
      url: SITE_URL + "/",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Text to Morse code translation",
        "Morse code decoding",
        "Morse code audio playback",
        "Morse code typing practice",
        "Morse code drills",
        "Morse code symbol lookup",
      ],
    },
    author: {
      "@type": "Person",
      name: "Suhas Sunder",
      jobTitle: "Software Developer",
      url: CREATOR_URL,
      sameAs: [CREATOR_URL, CREATOR_LINKEDIN],
      knowsAbout: [
        "Full-stack web development",
        "React",
        "TypeScript",
        "Remix",
        "Node.js",
        "User interface development",
        "Web utilities",
      ],
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
      <JsonLdScript jsonLd={jsonLd} />
      <div style={styles.wrap}>
        <header
          style={{ ...styles.header, borderBottom: "none", paddingBottom: 6 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <h1 className="font-bold text-sky-950" style={styles.h1}>
              About MorseWords
            </h1>
            <p style={styles.lead}>
              MorseWords is a practical Morse code toolkit for converting text,
              decoding Morse, playing audio, practicing patterns, and looking up
              symbols without extra setup.
            </p>
          </div>
          <a
            href="/how-to-use"
            className="rounded-xl px-4 py-2 font-semibold cursor-pointer transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500"
            style={{
              border: "1px solid #020617",
              background: "#020617",
              color: "#e0f2fe",
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
            ["#what-morsewords-does", "What MorseWords does"],
            ["#tool-design", "Tool design"],
            ["#what-this-is-not", "What this is not"],
            ["#author", "Author"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-full border px-3 py-2 text-sm font-semibold cursor-pointer transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              style={{ borderColor: "#e6e8ef", background: "#f7f8fb" }}
            >
              {label}
            </a>
          ))}
        </div>

        <SectionCard id="what-morsewords-does" title="What MorseWords does">
          <p>
            MorseWords is built for people who need a direct way to work with
            Morse code. The site focuses on common jobs: converting plain text
            into Morse, decoding Morse back into readable text, listening to
            generated Morse audio, practicing recognition, typing dots and
            dashes, and checking symbols in a reference table.
          </p>

          <p style={{ marginTop: 10 }}>
            The goal is not to make Morse code feel complicated. The goal is to
            make the result easy to generate, check, copy, hear, and reuse. Each
            tool is designed around a specific task so you can get the output
            without digging through scattered charts, PDF tables, or overloaded
            training pages.
          </p>

          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li>
              <strong>Translator:</strong> convert letters, numbers, and
              supported punctuation into Morse code.
            </li>
            <li>
              <strong>Decoder:</strong> turn dots, dashes, letter gaps, and word
              gaps back into readable text.
            </li>
            <li>
              <strong>Audio:</strong> listen to Morse playback with practical
              speed and tone controls.
            </li>
            <li>
              <strong>Typing:</strong> type Morse patterns and see the decoded
              result as you work.
            </li>
            <li>
              <strong>Practice:</strong> run focused drills for recognition and
              recall.
            </li>
            <li>
              <strong>Dictionary:</strong> look up Morse symbols quickly and
              copy what you need.
            </li>
          </ul>
        </SectionCard>

        <SectionCard id="tool-design" title="How the tools are designed">
          <p>
            MorseWords is meant to behave like a utility, not a maze. The pages
            are intentionally simple, with clear inputs, readable outputs, and
            copy-friendly formatting. Settings are included when they materially
            change the result, such as playback speed or tone, but the tools
            avoid unnecessary controls that slow down basic use.
          </p>

          <p style={{ marginTop: 10 }}>
            The site uses International Morse code conventions and keeps spacing
            rules predictable across the toolkit. That matters because Morse
            code is not only about dots and dashes. Letter gaps, word gaps,
            slash separators, and unsupported characters can all affect whether
            a decoded result is understandable.
          </p>

          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li>
              <strong>Fast first:</strong> pages are built to load quickly and
              avoid unnecessary friction.
            </li>
            <li>
              <strong>Clear output:</strong> results are formatted so they are
              easy to read, copy, paste, or listen to.
            </li>
            <li>
              <strong>Predictable rules:</strong> translation and decoding
              behavior should be consistent from tool to tool.
            </li>
            <li>
              <strong>No account required:</strong> the core tools are available
              without sign-up or a user profile.
            </li>
          </ul>

          <p style={{ marginTop: 12 }}>
            <a
              href="/how-to-use"
              className="underline hover:no-underline cursor-pointer font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              Open the MorseWords usage guide
            </a>
          </p>
        </SectionCard>

        <SectionCard id="what-this-is-not" title="What this is not">
          <p>
            MorseWords is not trying to replace every Morse code learning
            resource. It is a focused tool site. That means it is useful for
            quick conversion, playback, practice, and lookup, but it does not
            claim to be a full training program or certification path.
          </p>

          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            <li>
              <strong>Not a full course:</strong> there is no long curriculum,
              progress path, or formal lesson system.
            </li>
            <li>
              <strong>Not certification prep:</strong> the tools do not promise
              exam readiness or official qualification.
            </li>
            <li>
              <strong>Not emergency guidance:</strong> the site is for learning,
              reference, and utility use, not safety-critical communication.
            </li>
            <li>
              <strong>Not a community platform:</strong> there are no accounts,
              feeds, messages, or social features.
            </li>
          </ul>

          <p style={{ marginTop: 10 }}>
            That narrow scope is intentional. MorseWords should stay useful by
            doing a small set of Morse code tasks clearly and reliably.
          </p>
        </SectionCard>

        <SectionCard id="author" title="Built and maintained by">
          <p>
            MorseWords is built and maintained by <strong>Suhas Sunder</strong>,
            a software developer based in the Toronto area. I build production
            web applications and focused web utilities with an emphasis on
            practical workflows, fast interfaces, and clear user experience.
          </p>

          <p style={{ marginTop: 10 }}>
            My background includes full-stack web development with React,
            TypeScript, Remix, Node.js, Express, PostgreSQL, Prisma, and
            responsive UI development. I also have a Master’s degree in
            Electrical and Computer Engineering from Ontario Tech University.
          </p>

          <p style={{ marginTop: 10 }}>
            MorseWords exists because Morse code tools often fall into two
            extremes: overly basic converters with weak surrounding utilities,
            or dense training resources that are more than someone needs for a
            quick task. This site is meant to sit in the middle: useful enough
            for repeated use, but simple enough that the main action is always
            obvious.
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
                Express, PostgreSQL, Prisma, and responsive interface work.
              </div>
              <div style={{ color: "#5a616c", marginTop: 4 }}>
                Master’s in Electrical and Computer Engineering, Ontario Tech
                University.
              </div>
            </div>

            <div style={{ ...styles.card, padding: 14, borderRadius: 14 }}>
              <div style={{ fontWeight: 800 }}>More about the developer</div>
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <a
                  href={CREATOR_URL}
                  className="underline hover:no-underline cursor-pointer font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  Portfolio
                </a>
                <a
                  href={CREATOR_LINKEDIN}
                  className="underline hover:no-underline cursor-pointer font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  LinkedIn
                </a>
              </div>
              <div style={{ color: "#5a616c", marginTop: 8 }}>
                The point is simple: MorseWords is not an anonymous throwaway
                converter. It is a maintained utility site with a real person
                behind it and a narrow product direction.
              </div>
            </div>
          </div>
        </SectionCard>

        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a
                href="/"
                className="underline hover:no-underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                Home
              </a>
            </li>
            <li>/</li>
            <li className="font-semibold text-gray-900">About</li>
          </ol>
        </nav>
      </div>
    </div>
  );
}
