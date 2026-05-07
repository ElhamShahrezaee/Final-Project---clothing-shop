import { ORDER_STATUS_OPTIONS } from "../../../../features/admin/orders/utils/orderLabels";
import type { OrderStatusFilter } from "../../../../features/admin/orders/types";
import { useAdminLocale } from "../../../../hooks/useAdminLocale";

type OrderFiltersProps = {
  statusFilter: OrderStatusFilter;
  onStatusChange: (value: OrderStatusFilter) => void;
  onReset: () => void;
};

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

export default function OrderFilters({
  statusFilter,
  onStatusChange,
  onReset,
}: OrderFiltersProps) {
  const { textAlign } = useAdminLocale();

  return (
    <div className={`flex flex-wrap items-end gap-3 ${textAlign}`}>
      <div className="min-w-[200px] flex-1 sm:max-w-xs">
        <label className="mb-1 block text-xs font-medium text-gray-600">وضعیت سفارش</label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as OrderStatusFilter)}
          className={inputClass}
        >
          <option value="all">همه</option>
          {ORDER_STATUS_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
      >
        پاک کردن فیلتر
      </button>
    </div>
  );
}
