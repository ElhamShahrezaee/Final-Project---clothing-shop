import { useAppLocale } from "../../../hooks/useAppLocale";

type StoreProductPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
};

export default function StoreProductPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: StoreProductPaginationProps) {
  const { isFa } = useAppLocale();
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const rangeLabel = isFa
    ? `نمایش ${new Intl.NumberFormat("fa-IR").format(from)} تا ${new Intl.NumberFormat("fa-IR").format(to)} از ${new Intl.NumberFormat("fa-IR").format(total)} محصول`
    : `Showing ${from}–${to} of ${total} products`;

  const prevLabel = isFa ? "قبلی" : "Previous";
  const nextLabel = isFa ? "بعدی" : "Next";

  if (totalPages <= 1) {
    return total > 0 ? (
      <p className="text-center text-sm text-gray-600">{rangeLabel}</p>
    ) : null;
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <p className="text-sm text-gray-600">{rangeLabel}</p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-full border border-gray-900 px-4 py-2 text-sm transition hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
        >
          {prevLabel}
        </button>
        <span className="min-w-[4rem] text-center text-sm text-gray-800">
          {isFa
            ? `${new Intl.NumberFormat("fa-IR").format(page)} / ${new Intl.NumberFormat("fa-IR").format(totalPages)}`
            : `${page} / ${totalPages}`}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-full border border-gray-900 px-4 py-2 text-sm transition hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
