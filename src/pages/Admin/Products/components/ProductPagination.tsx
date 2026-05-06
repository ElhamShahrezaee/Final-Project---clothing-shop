type ProductPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
};

export default function ProductPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: ProductPaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4">
      <p className="text-sm text-gray-600">
        نمایش {from} تا {to} از {total} محصول
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100"
        >
          قبلی
        </button>
        <span className="min-w-[4rem] text-center text-sm text-gray-700">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100"
        >
          بعدی
        </button>
      </div>
    </div>
  );
}
