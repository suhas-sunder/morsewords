import type { ReactNode } from "react";

import {
  ActionLinks,
  SectionCard,
  SimpleGrid,
} from "~/client/components/shared/MorseLearningLayout";

type SupportTile = {
  title: string;
  text: string;
  href?: string;
  badge?: string;
};

type WorkedExample = {
  title: string;
  morse: string;
  children: ReactNode;
};

type Mistake = {
  title: string;
  children: ReactNode;
};

type ReferenceSupportSectionsProps = {
  guide: {
    eyebrow: string;
    title: string;
    description: string;
    items: SupportTile[];
  };
  examples: {
    title: string;
    description: string;
    items: WorkedExample[];
  };
  mistakes: {
    title: string;
    description: string;
    items: Mistake[];
  };
  comparison: {
    title: string;
    description: string;
    items: SupportTile[];
  };
  nextStep: {
    title: string;
    description: string;
    links: Array<{ href: string; label: string; primary?: boolean }>;
  };
};

export default function ReferenceSupportSections({
  guide,
  examples,
  mistakes,
  comparison,
  nextStep,
}: ReferenceSupportSectionsProps) {
  return (
    <>
      <SectionCard
        eyebrow={guide.eyebrow}
        title={guide.title}
        description={guide.description}
      >
        <SimpleGrid items={guide.items} />
      </SectionCard>

      <SectionCard
        eyebrow="Worked examples"
        title={examples.title}
        description={examples.description}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {examples.items.map((example) => (
            <article
              key={example.title}
              className="mw-static-panel rounded-xl bg-[#fffdf8] p-5"
            >
              <h3 className="text-lg font-extrabold leading-snug text-sky-950">
                {example.title}
              </h3>
              <p className="mt-3 whitespace-pre-wrap font-mono text-base font-bold tracking-[0.14em] text-slate-950">
                {example.morse}
              </p>
              <div className="mt-3 text-base leading-relaxed text-slate-700">
                {example.children}
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Use it well"
        title={mistakes.title}
        description={mistakes.description}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {mistakes.items.map((mistake) => (
            <article
              key={mistake.title}
              className="mw-static-panel rounded-xl bg-[#fffdf8] p-5"
            >
              <h3 className="text-lg font-extrabold leading-snug text-sky-950">
                {mistake.title}
              </h3>
              <div className="mt-3 text-base leading-relaxed text-slate-700">
                {mistake.children}
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Choose a reference"
        title={comparison.title}
        description={comparison.description}
      >
        <SimpleGrid items={comparison.items} />
      </SectionCard>

      <SectionCard
        eyebrow="Next step"
        title={nextStep.title}
        description={nextStep.description}
      >
        <ActionLinks links={nextStep.links} />
      </SectionCard>
    </>
  );
}
