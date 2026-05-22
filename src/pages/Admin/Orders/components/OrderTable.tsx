import { useTranslation } from "react-i18next";
import type { AdminOrder } from "../../../../features/admin/orders/types";
import {
  getOrderStatusLabel,
  getOrderTotal,
} from "../../../../features/admin/orders/utils/orderLabels";
import { formatPrice } from "../../../../features/admin/products/utils/formatPrice";
import { useAdminLocale } from "../../../../hooks/useAdminLocale";
import Spinner from "../../../../components/common/Spinner/Spinner";

type OrderTableProps = {
  orders: AdminOrder[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
};

const thClass = "px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600";
const tdClass = "px-3 py-3 text-sm text-gray-800";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipping: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-600",
};

export default function OrderTable({
  orders,
  isLoading,
  isError,
  errorMessage,
}: OrderTableProps) {
  const { t } = useTranslation();
  const { isFa, textAlign } = useAdminLocale();

  const formatItemsSummary = (order: AdminOrder): string => {
    if (order.orderItems.length === 0) return "—";
    const first = order.orderItems[0];
    const rest = order.orderItems.length - 1;
    const line = t("admin.orders.itemsLine", { qty: first.quantity, name: first.name });
    return rest > 0 ? t("admin.orders.itemsMore", { line, count: rest }) : line;
  };

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[12rem] items-center justify-center p-6">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="m-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
        {errorMessage ?? t("admin.orders.loadError")}
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="m-4 rounded-lg border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500">
        {t("admin.orders.empty")}
      </p>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-auto">
      <table className={`w-full min-w-[880px] ${textAlign}`}>
        <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50">
          <tr>
            <th className={thClass}>{t("admin.orders.table.customer")}</th>
            <th className={thClass}>{t("admin.orders.table.phone")}</th>
            <th className={thClass}>{t("admin.orders.table.address")}</th>
            <th className={thClass}>{t("admin.orders.table.products")}</th>
            <th className={thClass}>{t("admin.orders.table.amount")}</th>
            <th className={thClass}>{t("admin.orders.table.status")}</th>
            <th className={thClass}>{t("admin.orders.table.payment")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => {
            const total = getOrderTotal(order.totalPrice, order.orderItems);
            return (
              <tr key={order.id} className="hover:bg-gray-50/80">
                <td className={tdClass}>
                  <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-gray-400">
                    #{order.id.slice(-6)}
                  </p>
                </td>
                <td className={tdClass} dir="ltr">
                  {order.shippingAddress.phone}
                </td>
                <td className={`${tdClass} max-w-[200px] truncate`} title={order.shippingAddress.address}>
                  {order.shippingAddress.address}
                </td>
                <td className={tdClass}>{formatItemsSummary(order)}</td>
                <td className={tdClass}>{formatPrice(total, isFa)}</td>
                <td className={tdClass}>
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                      STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600",
                    ].join(" ")}
                  >
                    {getOrderStatusLabel(order.status, t)}
                  </span>
                </td>
                <td className={tdClass}>
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                      order.isPaid
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800",
                    ].join(" ")}
                  >
                    {order.isPaid ? t("admin.orders.paid") : t("admin.orders.unpaid")}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
