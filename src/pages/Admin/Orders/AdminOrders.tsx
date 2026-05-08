import { useMemo, useState } from "react";
import type {
  OrderPageSize,
  OrderStatusFilter,
} from "../../../features/admin/orders/types";
import { useAdminOrdersQuery } from "../../../features/admin/orders/queries/useAdminOrdersQuery";
import { useAdminLocale } from "../../../hooks/useAdminLocale";
import AdminListPage from "../components/AdminListPage";
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
    <AdminListPage
      title="سفارشات"
      description="مدیریت سفارش‌های مشتریان"
      textAlign={textAlign}
      filters={
        <OrderFilters
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          onReset={handleResetFilters}
        />
      }
      table={
        <OrderTable
          orders={data?.orders ?? []}
          isLoading={isLoading || isFetching}
          isError={isError}
          errorMessage={error?.message}
        />
      }
      pagination={
        !isLoading && !isError ? (
          <OrderPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
          />
        ) : undefined
      }
    />
  );
}
