type BreadcrumbTrailProps = {
  current: string;
};

export default function BreadcrumbTrail({ current }: BreadcrumbTrailProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto mt-10 w-full max-w-[1120px] px-4 pb-12 pt-2 text-sm text-slate-600 sm:mt-12 sm:px-6 sm:pb-14 lg:px-8"
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <a href="/" className="cursor-pointer underline hover:no-underline">
            Home
          </a>
        </li>
        <li>/</li>
        <li className="font-semibold text-sky-950">{current}</li>
      </ol>
    </nav>
  );
}
