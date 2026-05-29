import { useTranslation } from "react-i18next";

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

type UserOrdersPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

export default function UserOrdersPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: UserOrdersPaginationProps) {
  const { t } = useTranslation();
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4">
      <p className="text-sm text-gray-600">
        {t("account.orders.pagination.summary", { from, to, total })}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="orders-page-size" className="text-sm text-gray-600">
            {t("account.orders.pagination.perPage")}
          </label>
          <select
            id="orders-page-size"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
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
            {t("account.orders.pagination.prev")}
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
            {t("account.orders.pagination.next")}
          </button>
        </div>
      </div>
    </div>
  );
}
