import * as React from "react";

export type FaqItem = { q: string; a: string };
type FaqVariant = "default" | "home";

const FAQ_SECTION_CLASS: Record<FaqVariant, string> = {
  default: "mt-10 sm:mt-12",
  home: "mt-8 sm:mt-10",
};

const FAQ_SUMMARY_CLASS: Record<FaqVariant, string> = {
  default:
    "mw-faq-trigger flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-xl bg-[#fffaf2] px-4 py-4 text-left text-lg font-extrabold leading-snug text-sky-950 transition hover:bg-slate-950 hover:text-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 group-open:bg-slate-950 group-open:text-sky-100 sm:px-5 sm:text-xl",
  home:
    "mw-button-outline flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-xl bg-[#fffaf2] px-4 py-4 text-left text-lg font-extrabold leading-snug text-sky-950 transition hover:text-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 sm:px-5 sm:text-xl",
};

const FAQ_ARROW_CLASS: Record<FaqVariant, string> = {
  default:
    "inline-flex h-6 w-6 shrink-0 items-center justify-center font-mono text-lg text-sky-700 transition group-open:rotate-90 group-open:text-sky-100",
  home:
    "inline-flex h-6 w-6 shrink-0 items-center justify-center font-mono text-lg text-sky-700 transition group-open:rotate-90 group-hover:text-sky-900",
};

function FaqSectionHeader({
  headingId,
  title,
  description,
}: {
  headingId: string;
  title: string;
  description?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-sky-800" />
        <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
          FAQ
        </span>
        <span className="h-px w-8 bg-sky-800" />
      </div>
      <h2
        id={headingId}
        className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function FaqQuestionItem({
  item,
  variant,
}: {
  item: FaqItem;
  variant: FaqVariant;
}) {
  return (
    <details className="group rounded-xl">
      <summary className={FAQ_SUMMARY_CLASS[variant]}>
        <span>{item.q}</span>
        <span className={FAQ_ARROW_CLASS[variant]}>&gt;</span>
      </summary>
      {variant === "home" ? (
        <p className="pb-5 pr-8 text-base leading-relaxed text-slate-700 sm:text-lg">
          {item.a}
        </p>
      ) : (
        <div className="mw-faq-answer mw-static-surface-soft mt-2 rounded-xl px-5 py-4">
          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            {item.a}
          </p>
        </div>
      )}
    </details>
  );
}

function FaqList({
  items,
  variant,
}: {
  items: FaqItem[];
  variant: FaqVariant;
}) {
  return (
    <div className="mt-7 space-y-3">
      {items.map((item) => (
        <FaqQuestionItem
          key={item.q}
          item={item}
          variant={variant}
        />
      ))}
    </div>
  );
}

export default function FaqSectionGeneric({
  title,
  items,
  variant,
  description,
}: {
  title: string;
  items: FaqItem[];
  variant?: FaqVariant;
  description?: React.ReactNode;
}) {
  const headingId = React.useId();
  const renderedVariant = variant ?? "default";
  const defaultHomeDescription =
    "Quick answers for spacing, supported characters, and decoding pasted Morse.";
  const renderedDescription =
    renderedVariant === "home"
      ? description ?? defaultHomeDescription
      : description;

  return (
    <section
      className={FAQ_SECTION_CLASS[renderedVariant]}
      aria-labelledby={headingId}
    >
      <FaqSectionHeader
        headingId={headingId}
        title={title}
        description={renderedDescription}
      />
      <FaqList
        items={items}
        variant={renderedVariant}
      />
    </section>
  );
}
