type BreadcrumbTrailProps = {
  current: string;
  placement?:
    | "standalone"
    | "pageBottom"
    | "contentFooter"
    | "contentFooterTight";
  parent?: {
    href: string;
    label: string;
  };
};

const placementClassNames = {
  standalone:
    "mx-auto mt-10 w-full max-w-[1120px] px-4 pb-12 pt-2 text-sm text-slate-600 sm:mt-12 sm:px-6 sm:pb-14 lg:px-8",
  pageBottom:
    "mx-auto w-full max-w-[1120px] px-4 pb-12 text-sm text-slate-600 sm:px-6 lg:px-8",
  contentFooter: "mb-12 mt-10 text-sm text-slate-600",
  contentFooterTight: "mb-12 text-sm text-slate-600",
} as const;

const breadcrumbLinkClassName =
  "cursor-pointer underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500";

function BreadcrumbSeparator() {
  return <li aria-hidden="true">/</li>;
}

export default function BreadcrumbTrail({
  current,
  parent,
  placement = "standalone",
}: BreadcrumbTrailProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={placementClassNames[placement]}
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <a href="/" className={breadcrumbLinkClassName}>
            Home
          </a>
        </li>
        <BreadcrumbSeparator />
        {parent ? (
          <>
            <li>
              <a
                href={parent.href}
                className={breadcrumbLinkClassName}
              >
                {parent.label}
              </a>
            </li>
            <BreadcrumbSeparator />
          </>
        ) : null}
        <li aria-current="page" className="font-semibold text-sky-950">
          {current}
        </li>
      </ol>
    </nav>
  );
}
