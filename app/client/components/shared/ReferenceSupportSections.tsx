import type { ReactNode } from "react";

import { SeoSectionRailAd } from "~/client/components/ads/AdSenseAds";
import {
  ActionLinks,
  SectionCard,
  SimpleGrid,
  StaticPanel,
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
    eyebrow?: string;
    title: string;
    description: string;
    items: SupportTile[];
  };
  nextStep: {
    title: string;
    description: string;
    links: Array<{ href: string; label: string; primary?: boolean }>;
  };
  linkedItemStyle?: "card" | "inline";
};

export default function ReferenceSupportSections({
  guide,
  examples,
  mistakes,
  comparison,
  nextStep,
  linkedItemStyle = "card",
}: ReferenceSupportSectionsProps) {
  return (
    <>
      <SectionCard
        eyebrow={guide.eyebrow}
        title={guide.title}
        description={guide.description}
      >
        <SimpleGrid items={guide.items} linkedItemStyle={linkedItemStyle} />
      </SectionCard>

      <SectionCard
        eyebrow="Worked examples"
        title={examples.title}
        description={examples.description}
        layout="stacked"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {examples.items.map((example) => (
            <StaticPanel
              as="article"
              key={example.title}
            >
              <h3 className="mw-heading text-lg font-extrabold leading-snug text-sky-950">
                {example.title}
              </h3>
              <p className="mw-input-text mt-3 whitespace-pre-wrap font-mono text-base font-bold tracking-[0.14em] text-slate-950">
                {example.morse}
              </p>
              <div className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                {example.children}
              </div>
            </StaticPanel>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Use it well"
        title={mistakes.title}
        description={mistakes.description}
        layout="stacked"
      >
        <div className="mw-seo-section-with-rail">
          <div className="grid gap-4 md:grid-cols-3">
            {mistakes.items.map((mistake) => (
              <StaticPanel
                as="article"
                key={mistake.title}
              >
                <h3 className="mw-heading text-lg font-extrabold leading-snug text-sky-950">
                  {mistake.title}
                </h3>
                <div className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                  {mistake.children}
                </div>
              </StaticPanel>
            ))}
          </div>
          <SeoSectionRailAd />
        </div>
      </SectionCard>

      <SectionCard
        eyebrow={comparison.eyebrow ?? "Choose a reference"}
        title={comparison.title}
        description={comparison.description}
      >
        <SimpleGrid items={comparison.items} linkedItemStyle={linkedItemStyle} />
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
