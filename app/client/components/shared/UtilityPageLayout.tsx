import type { ReactNode } from "react";

import BreadcrumbTrail from "./BreadcrumbTrail";
import {
  HERO_EYEBROW_LINE_CLASS,
  HERO_EYEBROW_ROW_CLASS,
  HERO_EYEBROW_TEXT_CLASS,
  HERO_TITLE_CLASS,
} from "./heroStyles";

const utilityPageShellClassName =
  "mw-non-home-page mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-4 pb-10 pt-2 text-slate-800 sm:px-6 sm:pb-12 sm:pt-4 lg:px-8";

const utilityContentPanelClassName =
  "flex max-w-5xl flex-col gap-8 rounded-2xl bg-[#fffdf8]/75 p-5 leading-relaxed sm:p-8";

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

type LegalBreadcrumb = {
  current: string;
  parent: {
    href: string;
    label: string;
  };
};

export function UtilityPageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={joinClassNames(utilityPageShellClassName, className)}>
      {children}
    </div>
  );
}

export function UtilityPageHeader({
  eyebrow,
  title,
  updated,
  updatedAs = "h2",
  children,
  breadcrumb,
  className = "w-full px-1 py-3 sm:px-2",
  eyebrowClassName,
  updatedClassName = "mt-3 text-lg font-bold text-slate-700",
}: {
  eyebrow: string;
  title: string;
  updated?: string;
  updatedAs?: "h2" | "h3";
  children?: ReactNode;
  breadcrumb?: LegalBreadcrumb;
  className?: string;
  eyebrowClassName?: string;
  updatedClassName?: string;
}) {
  const UpdatedHeading = updatedAs;

  return (
    <header className={className}>
      {breadcrumb ? (
        <BreadcrumbTrail
          current={breadcrumb.current}
          parent={breadcrumb.parent}
          placement="legalHeader"
          variant="legal"
        />
      ) : null}

      <div className={joinClassNames(HERO_EYEBROW_ROW_CLASS, eyebrowClassName)}>
        <span className={HERO_EYEBROW_LINE_CLASS} />
        <span className={HERO_EYEBROW_TEXT_CLASS}>{eyebrow}</span>
      </div>
      <h1 className={HERO_TITLE_CLASS}>{title}</h1>
      {updated ? (
        <UpdatedHeading className={updatedClassName}>{updated}</UpdatedHeading>
      ) : null}

      {children}
    </header>
  );
}

export function UtilityContentPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={joinClassNames(utilityContentPanelClassName, className)}>
      {children}
    </main>
  );
}
