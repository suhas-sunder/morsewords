/* eslint-disable react/no-unescaped-entities */

import { Link } from "react-router";
import type { Route } from "./+types/misc.socials";
import SocialLinks from "~/client/components/navigation/SocialLinks";

export const meta: Route.MetaFunction = () => {
  const canonical = "https://www.morsewords.com/links";

  const title = "Links Hub | MorseWords – Socials & Related Sites";
  const description =
    "Official MorseWords links hub. Find related utility sites, tools, and social channels.";

  const ogImage = "https://www.morsewords.com/og/morsewords-links.jpg";

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
      content:
        "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1",
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
          group relative flex h-full flex-col justify-between rounded-2xl
          border border-white/10 bg-neutral-900 p-5
          transition cursor-pointer
          hover:border-sky-200/60 hover:bg-neutral-950
          focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-200
          focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900
        "
      >
        {/* sky-blue accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-2xl opacity-0 transition group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(125,211,252,0.9), transparent)",
          }}
        />

        <div className="relative">
          <h3 className="text-lg font-extrabold text-white sm:text-xl">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-2 text-base leading-relaxed text-gray-300">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-sky-200">
          <span>Visit site</span>
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </div>
      </Link>
    </li>
  );
}

export default function Socials() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pt-6">
      <header className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 px-6 py-10 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[48rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at center, rgba(125,211,252,0.35), transparent 65%)",
          }}
        />

        <div className="relative">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            MorseWords – Links
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-gray-300">
            Fast, modern, practical tools for translating, listening to, and
            practicing Morse code. This page links to my other utility sites and
            related projects.
          </p>
        </div>
      </header>

      <main className="flex flex-col gap-12">
        <section>
          <h2 className="mb-6 text-2xl font-extrabold text-neutral-900">
            My Utility Sites
          </h2>

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}
