import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type {
  AdminOrder,
  OrderPageSize,
  OrderStatusFilter,
} from "../../../features/admin/orders/types";
import { useUpdateAdminOrderStatusMutation } from "../../../features/admin/orders/mutations/useUpdateAdminOrderStatusMutation";
import { useAdminOrdersQuery } from "../../../features/admin/orders/queries/useAdminOrdersQuery";
import { useAdminLocale } from "../../../hooks/useAdminLocale";
import AdminListPage from "../components/AdminListPage";
import OrderFilters from "./components/OrderFilters";
import OrderPagination from "./components/OrderPagination";
import OrderStatusModal from "./components/OrderStatusModal";
import OrderTable from "./components/OrderTable";

export default function AdminOrders() {
  const { t } = useTranslation();
  const { textAlign } = useAdminLocale();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<OrderPageSize>(10);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all");
  const [orderForStatus, setOrderForStatus] = useState<AdminOrder | null>(null);
  const [statusSaveError, setStatusSaveError] = useState<string | null>(null);

  const updateStatusMutation = useUpdateAdminOrderStatusMutation();

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

  const handleChangeStatusClick = (order: AdminOrder) => {
    setStatusSaveError(null);
    setOrderForStatus(order);
  };

  const handleStatusCancel = () => {
    if (updateStatusMutation.isPending) return;
    setOrderForStatus(null);
    setStatusSaveError(null);
  };

  const handleStatusSave = async (status: AdminOrder["status"]) => {
    if (!orderForStatus) return;

    setStatusSaveError(null);

    try {
      await updateStatusMutation.mutateAsync({
        orderId: orderForStatus.id,
        status,
      });
      setOrderForStatus(null);
    } catch (err) {
      setStatusSaveError(
        err instanceof Error ? err.message : t("admin.apiErrors.updateOrderStatus"),
      );
    }
  };

  const pagination = data?.pagination ?? {
    page: 1,
    limit,
    total: 0,
    totalPages: 1,
  };

  return (
    <>
      <AdminListPage
        title={t("admin.orders.title")}
        description={t("admin.orders.description")}
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
            onChangeStatus={handleChangeStatusClick}
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

      {orderForStatus ? (
        <OrderStatusModal
          order={orderForStatus}
          isSaving={updateStatusMutation.isPending}
          errorMessage={statusSaveError}
          onSave={handleStatusSave}
          onCancel={handleStatusCancel}
        />
      ) : null}
    </>
  );
}
