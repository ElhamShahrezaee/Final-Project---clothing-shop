import type { OrderPageSize } from "../../../../features/admin/orders/types";

const PAGE_SIZE_OPTIONS: OrderPageSize[] = [10, 20, 50, 100];

type OrderPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: OrderPageSize;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: OrderPageSize) => void;
};

export default function OrderPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: OrderPaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-gray-600">
        نمایش {from} تا {to} از {total} سفارش
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="text-sm text-gray-600">
            تعداد در صفحه
          </label>
          <select
            id="page-size"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value) as OrderPageSize)}
            className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

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
    </div>
  );
}
