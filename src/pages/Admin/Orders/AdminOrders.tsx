import { useMemo, useState } from "react";
import type {
  OrderPageSize,
  OrderStatusFilter,
} from "../../../features/admin/orders/types";
import { useAdminOrdersQuery } from "../../../features/admin/orders/queries/useAdminOrdersQuery";
import { useAdminLocale } from "../../../hooks/useAdminLocale";
import OrderFilters from "./components/OrderFilters";
import OrderPagination from "./components/OrderPagination";
import OrderTable from "./components/OrderTable";

export default function AdminOrders() {
  const { textAlign } = useAdminLocale();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<OrderPageSize>(10);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all");

  const filters = useMemo(
    () => ({
      page,
      limit,
      status: statusFilter === "all" ? undefined : statusFilter,
    }),
    [page, limit, statusFilter],
  );

  const { data, isLoading, isFetching, isError, error } = useAdminOrdersQuery(filters);

  const handleStatusChange = (value: OrderStatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleLimitChange = (value: OrderPageSize) => {
    setLimit(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setPage(1);
  };

  const pagination = data?.pagination ?? {
    page: 1,
    limit,
    total: 0,
    totalPages: 1,
  };

  return (
    <div className={`space-y-6 ${textAlign}`}>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">سفارشات</h1>
        <p className="mt-1 text-sm text-gray-600">مدیریت سفارش‌های مشتریان</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <OrderFilters
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          onReset={handleResetFilters}
        />
      </div>

      <OrderTable
        orders={data?.orders ?? []}
        isLoading={isLoading || isFetching}
        isError={isError}
        errorMessage={error?.message}
      />

      {!isLoading && !isError && (
        <OrderPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
        />
      )}
    </div>
  );
}
