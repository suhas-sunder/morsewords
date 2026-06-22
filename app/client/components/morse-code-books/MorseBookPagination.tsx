import { toolControlButtonClass } from "~/client/components/shared/ToolWorkspace";

type MorseBookPaginationProps = {
  ariaLabel: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageCount: number;
  testId: string;
};

type PaginationItem = number | "ellipsis-start" | "ellipsis-end";

function paginationItems(currentPage: number, pageCount: number) {
  const visiblePages = new Set([
    1,
    pageCount,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);
  const pages = [...visiblePages]
    .filter((page) => page >= 1 && page <= pageCount)
    .sort((left, right) => left - right);
  const items: PaginationItem[] = [];

  pages.forEach((page, index) => {
    const previousPage = pages[index - 1];
    if (previousPage && page - previousPage > 1) {
      items.push(index === 1 ? "ellipsis-start" : "ellipsis-end");
    }
    items.push(page);
  });

  return items;
}

export default function MorseBookPagination({
  ariaLabel,
  currentPage,
  onPageChange,
  pageCount,
  testId,
}: MorseBookPaginationProps) {
  const items = paginationItems(currentPage, pageCount);

  return (
    <nav
      className="mt-5 flex flex-wrap items-center justify-center gap-2"
      aria-label={ariaLabel}
      data-testid={testId}
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={toolControlButtonClass({
          rounded: "lg",
          size: "sm",
          disabled: currentPage === 1,
        })}
      >
        Previous
      </button>
      {items.map((item) => {
        if (typeof item !== "number") {
          return (
            <span
              key={item}
              aria-hidden="true"
              className="min-w-6 text-center text-sm font-semibold text-slate-500"
            >
              ...
            </span>
          );
        }

        const isCurrent = item === currentPage;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={isCurrent ? "page" : undefined}
            aria-label={`Page ${item}`}
            className={toolControlButtonClass({
              active: isCurrent,
              rounded: "lg",
              size: "sm",
            })}
          >
            {item}
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
        disabled={currentPage === pageCount}
        className={toolControlButtonClass({
          rounded: "lg",
          size: "sm",
          disabled: currentPage === pageCount,
        })}
      >
        Next
      </button>
    </nav>
  );
}
