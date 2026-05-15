/* eslint-disable react/no-unescaped-entities */

import { Link } from "react-router";
import type { Route } from "./+types/misc.socials";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import { canonicalUrl, SITE_URL } from "~/client/seo";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";

export const meta: Route.MetaFunction = () => {
  const canonical = canonicalUrl("/misc/socials");

  const title = "MorseWords Links | Related Utility Sites";
  const description =
    "Find MorseWords-related support links and related utility projects from the site maintainer.";

  const ogImage = `${SITE_URL}/og/morsewords-links.jpg`;

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonical },

    { property: "og:site_name", content: "MorseWords" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonical },
    { property: "og:image", content: ogImage },
    { property: "og:image:alt", content: "MorseWords links hub" },
    { property: "og:locale", content: "en_US" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },

    {
      name: "robots",
      content: "noindex,follow",
    },
  ];
};

function ExternalCard(props: { to: string; title: string; subtitle?: string }) {
  const { to, title, subtitle } = props;
  const isExternal = to.startsWith("http") || to.startsWith("mailto:");

  return (
    <li className="h-full">
      <Link
        to={to}
        target={isExternal && !to.startsWith("mailto:") ? "_blank" : undefined}
        rel={
          isExternal && !to.startsWith("mailto:")
            ? "noopener noreferrer"
            : undefined
        }
        className="
          group relative flex h-full flex-col justify-between rounded-xl
          bg-[#fffdf8] p-5 shadow-[0_7px_18px_rgba(11,36,71,0.07)]
          transition cursor-pointer
          hover:bg-[#f7f4ee]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300
          focus-visible:ring-offset-2 focus-visible:ring-offset-white
        "
      >
        <div className="relative">
          <h3 className="text-lg font-extrabold text-sky-950 sm:text-xl">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-2 text-base leading-relaxed text-slate-600">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-sky-800">
          <span>Visit site</span>
          <span className="transition-colors">
            -&gt;
          </span>
        </div>
      </Link>
    </li>
  );
}

export default function Socials() {
  const canonical = canonicalUrl("/misc/socials");
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Socials",
        item: canonical,
      },
    ],
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-10 pt-2 sm:pb-12 sm:pt-4">
      <header className="mb-10 px-1 py-3 sm:px-2">
        <p className="m-0 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900 before:h-px before:w-8 before:bg-sky-800 before:content-['']">
          MorseWords links
        </p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-sky-950 sm:text-5xl">
          MorseWords Links
        </h1>
        <p className="mt-3 max-w-none text-base leading-relaxed text-slate-700 sm:text-lg">
          Fast, modern, practical tools for translating, listening to, and
          practicing Morse code. This page links to related utility sites and
          projects from the same maintainer.
        </p>
      </header>

      <main className="flex flex-col gap-12">
        <section className="mw-static-panel rounded-2xl bg-[#fffdf8]/75 p-5 sm:p-8">
          <h2 className="mb-6 text-2xl font-extrabold text-sky-950">
            Related Utility Sites
          </h2>

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ExternalCard
              to="https://www.suhassunder.com"
              title="Suhas Sunder"
              subtitle="Developer portfolio for the MorseWords maintainer."
            />
            <ExternalCard
              to="https://www.linkedin.com/in/s-sunder/"
              title="LinkedIn"
              subtitle="Maintainer profile and professional updates."
            />
            <ExternalCard
              to="https://www.financequizzes.com"
              title="FinanceQuizzes.com"
              subtitle="Short, focused finance quizzes designed to test real-world money concepts quickly."
            />
            <ExternalCard
              to="https://www.ilovesvg.com"
              title="iLoveSVG.com"
              subtitle="Tools for viewing, converting, optimizing, and working with SVG files."
            />
            <ExternalCard
              to="https://www.ilovetimers.com"
              title="iLoveTimers.com"
              subtitle="A collection of practical timers for work, study, cooking, and focus sessions."
            />
            <ExternalCard
              to="https://www.rentconverter.com"
              title="RentConverter.com"
              subtitle="Convert rent, salary, and pay periods to understand true monthly and yearly costs."
            />
            <ExternalCard
              to="https://www.allsavingscalculators.com"
              title="AllSavingsCalculators.com"
              subtitle="Savings and interest calculators to model growth, goals, and timelines."
            />
            <ExternalCard
              to="https://www.allfitnesscalculators.com"
              title="AllFitnessCalculators.com"
              subtitle="Fitness-related calculators for workouts, calories, and health metrics."
            />
            <ExternalCard
              to="https://www.allgpacalculators.com"
              title="AllGPACalculators.com"
              subtitle="Accurate GPA calculators for different grading systems and scenarios."
            />
            <ExternalCard
              to="https://www.ilovesteps.com"
              title="iLoveSteps.com"
              subtitle="Walking and step-based calculators for daily movement and fitness tracking."
            />
            <ExternalCard
              to="https://www.ilovewordsearch.com"
              title="iLoveWordSearch.com"
              subtitle="Word search generators and tools for puzzles, games, and classrooms."
            />
            <ExternalCard
              to="https://www.codetranslators.com"
              title="CodeTranslators.com"
              subtitle="Translate and convert code snippets between programming languages."
            />
            <ExternalCard
              to="https://www.ilovecountdowns.com"
              title="iLoveCountdowns.com"
              subtitle="Simple countdown timers for events, launches, and deadlines."
            />
            <ExternalCard
              to="https://www.paycheckconverter.com"
              title="PaycheckConverter.com"
              subtitle="Convert paychecks into hourly, weekly, monthly, and yearly amounts."
            />
            <ExternalCard
              to="https://www.subscriptioncostcalculator.com"
              title="SubscriptionCostCalculator.com"
              subtitle="Understand the true long-term cost of recurring subscriptions."
            />
            <ExternalCard
              to="https://www.pricechangecalculator.com"
              title="PriceChangeCalculator.com"
              subtitle="Calculate price increases, decreases, and percentage changes accurately."
            />
            <ExternalCard
              to="https://www.sizeofpaper.com"
              title="SizeOfPaper.com"
              subtitle="Paper size references and conversion tools for print and design."
            />
            <ExternalCard
              to="https://www.discountvsmarkup.com"
              title="DiscountVsMarkup.com"
              subtitle="Clarify the difference between discounts and markups in pricing."
            />
            <ExternalCard
              to="https://www.salarymath.com"
              title="SalaryMath.com"
              subtitle="Break down salaries into hourly, daily, and yearly equivalents."
            />
            <ExternalCard
              to="https://www.vehiclepaintcodes.com"
              title="VehiclePaintCodes.com"
              subtitle="Lookup and reference vehicle paint codes by make and model."
            />
            <ExternalCard
              to="https://www.screwsizes.com"
              title="ScrewSizes.com"
              subtitle="Screw size charts, references, and measurement tools."
            />
            <ExternalCard
              to="https://www.pipedimensions.com"
              title="PipeDimensions.com"
              subtitle="Pipe dimension charts and sizing references for engineering use."
            />
            <ExternalCard
              to="https://www.bandsize.com"
              title="BandSize.com"
              subtitle="Watch band sizing tools and fit references."
            />
          </ul>
        </section>
      </main>
      <BreadcrumbTrail current="Socials" />
      <JsonLdScript jsonLd={breadcrumbJsonLd} />
    </div>
  );
}
