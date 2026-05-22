import { useTranslation } from "react-i18next";
import type { AdminPageSize } from "../../../../features/admin/products/types";

const PAGE_SIZE_OPTIONS: AdminPageSize[] = [10, 20, 50, 100];

type ProductPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: AdminPageSize;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: AdminPageSize) => void;
};

export default function ProductPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: ProductPaginationProps) {
  const { t } = useTranslation();
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-gray-600">
        {t("admin.products.pagination.summary", { from, to, total })}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="product-page-size" className="text-sm text-gray-600">
            {t("admin.common.perPage")}
          </label>
          <select
            id="product-page-size"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value) as AdminPageSize)}
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
            {t("admin.common.prev")}
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
            {t("admin.common.next")}
          </button>
        </div>
      </div>
    </div>
  );
}
