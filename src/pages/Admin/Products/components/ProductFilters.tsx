import { useTranslation } from "react-i18next";
import { useAdminLocale } from "../../../../hooks/useAdminLocale";

export type ActiveFilter = "all" | "active" | "inactive";

type ProductFiltersProps = {
  search: string;
  category: string;
  activeFilter: ActiveFilter;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onActiveFilterChange: (value: ActiveFilter) => void;
  onReset: () => void;
};

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

export default function ProductFilters({
  search,
  category,
  activeFilter,
  onSearchChange,
  onCategoryChange,
  onActiveFilterChange,
  onReset,
}: ProductFiltersProps) {
  const { t } = useTranslation();
  const { textAlign } = useAdminLocale();

  return (
    <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-4 ${textAlign}`}>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          {t("admin.products.filters.search")}
        </label>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("admin.products.filters.searchPlaceholder")}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          {t("admin.products.filters.category")}
        </label>
        <input
          type="text"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          placeholder={t("admin.products.filters.categoryPlaceholder")}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          {t("admin.products.filters.status")}
        </label>
        <select
          value={activeFilter}
          onChange={(e) => onActiveFilterChange(e.target.value as ActiveFilter)}
          className={inputClass}
        >
          <option value="all">{t("admin.common.all")}</option>
          <option value="active">{t("admin.common.active")}</option>
          <option value="inactive">{t("admin.common.inactive")}</option>
        </select>
      </div>

      <div className="flex items-end">
        <button
          type="button"
          onClick={onReset}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
        >
          {t("admin.common.clearFilters")}
        </button>
      </div>
    </div>
  );
}
