type BreadcrumbTrailProps = {
  current: string;
  placement?:
    | "standalone"
    | "pageBottom"
    | "contentFooter"
    | "contentFooterTight"
    | "legalHeader";
  parent?: {
    href: string;
    label: string;
  };
  variant?: "default" | "legal";
};

const placementClassNames = {
  standalone:
    "mx-auto mt-10 w-full max-w-[1120px] px-4 pb-12 pt-2 text-sm text-slate-600 sm:mt-12 sm:px-6 sm:pb-14 lg:px-8",
  pageBottom:
    "mx-auto w-full max-w-[1120px] px-4 pb-12 text-sm text-slate-600 sm:px-6 lg:px-8",
  contentFooter: "mb-12 mt-10 text-sm text-slate-600",
  contentFooterTight: "mb-12 text-sm text-slate-600",
  legalHeader: "mb-12 text-sm font-semibold text-slate-600",
} as const;

const breadcrumbLinkClassName =
  "cursor-pointer underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500";

const legalBreadcrumbLinkClassName =
  "cursor-pointer hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500";

function BreadcrumbSeparator({ variant }: { variant: "default" | "legal" }) {
  if (variant === "legal") {
    return (
      <li aria-hidden="true" className="opacity-70">
        {">"}
      </li>
    );
  }

  return <li aria-hidden="true">/</li>;
}

export default function BreadcrumbTrail({
  current,
  parent,
  placement = "standalone",
  variant = "default",
}: BreadcrumbTrailProps) {
  const linkClassName =
    variant === "legal" ? legalBreadcrumbLinkClassName : breadcrumbLinkClassName;
  const currentClassName =
    variant === "legal" ? "opacity-90" : "font-semibold text-sky-950";

  return (
    <nav
      aria-label="Breadcrumb"
      className={placementClassNames[placement]}
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <a href="/" className={linkClassName}>
            Home
          </a>
        </li>
        <BreadcrumbSeparator variant={variant} />
        {parent ? (
          <>
            <li>
              <a
                href={parent.href}
                className={linkClassName}
              >
                {parent.label}
              </a>
            </li>
            <BreadcrumbSeparator variant={variant} />
          </>
        ) : null}
        <li aria-current="page" className={currentClassName}>
          {current}
        </li>
      </ol>
    </nav>
  );
}
