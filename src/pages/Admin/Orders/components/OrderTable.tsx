import { useTranslation } from "react-i18next";
import type { AdminOrder } from "../../../../features/admin/orders/types";
import {
  getOrderStatusLabel,
  getOrderTotal,
} from "../../../../features/admin/orders/utils/orderLabels";
import { formatPrice } from "../../../../features/admin/products/utils/formatPrice";
import { useAdminLocale } from "../../../../hooks/useAdminLocale";
import Spinner from "../../../../components/common/Spinner/Spinner";
import AdminCardField from "../../components/AdminCardField";

type OrderTableProps = {
  orders: AdminOrder[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onChangeStatus: (order: AdminOrder) => void;
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

const actionBtnClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-100 lg:w-auto";

function OrderStatusBadge({
  status,
  t,
}: {
  status: AdminOrder["status"];
  t: (key: string) => string;
}) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600",
      ].join(" ")}
    >
      {getOrderStatusLabel(status, t)}
    </span>
  );
}

function OrderPaymentBadge({ isPaid, t }: { isPaid: boolean; t: (key: string) => string }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
      ].join(" ")}
    >
      {isPaid ? t("admin.orders.paid") : t("admin.orders.unpaid")}
    </span>
  );
}

export default function OrderTable({
  orders,
  isLoading,
  isError,
  errorMessage,
  onChangeStatus,
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
    <div className={textAlign}>
      <ul className="space-y-3 p-3 lg:hidden">
        {orders.map((order) => {
          const total = getOrderTotal(order.totalPrice, order.orderItems);
          return (
            <li
              key={order.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-gray-400" dir="ltr">
                    #{order.id.slice(-6)}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} t={t} />
              </div>

              <div className="mt-3 space-y-2">
                <AdminCardField label={t("admin.orders.table.phone")} valueDir="ltr">
                  {order.shippingAddress.phone}
                </AdminCardField>
                <AdminCardField label={t("admin.orders.table.address")}>
                  <span className="block max-w-[14rem] whitespace-normal">
                    {order.shippingAddress.address}
                  </span>
                </AdminCardField>
                <AdminCardField label={t("admin.orders.table.products")}>
                  <span className="block max-w-[14rem] whitespace-normal text-end">
                    {formatItemsSummary(order)}
                  </span>
                </AdminCardField>
                <AdminCardField label={t("admin.orders.table.amount")}>
                  {formatPrice(total, isFa)}
                </AdminCardField>
                <AdminCardField label={t("admin.orders.table.payment")}>
                  <OrderPaymentBadge isPaid={order.isPaid} t={t} />
                </AdminCardField>
              </div>

              {order.orderItems.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                          —
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="mt-4 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => onChangeStatus(order)}
                  className={actionBtnClass}
                >
                  {t("admin.orders.changeStatus")}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <table className={`hidden w-full lg:table ${textAlign}`}>
        <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50">
          <tr>
            <th className={thClass}>{t("admin.orders.table.customer")}</th>
            <th className={thClass}>{t("admin.orders.table.phone")}</th>
            <th className={thClass}>{t("admin.orders.table.address")}</th>
            <th className={thClass}>{t("admin.orders.table.products")}</th>
            <th className={thClass}>{t("admin.orders.table.amount")}</th>
            <th className={thClass}>{t("admin.orders.table.status")}</th>
            <th className={thClass}>{t("admin.orders.table.payment")}</th>
            <th className={thClass}>{t("admin.common.actions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => {
            const total = getOrderTotal(order.totalPrice, order.orderItems);
            return (
              <tr
                key={order.id}
                className="cursor-pointer hover:bg-gray-50/80"
                onClick={() => onChangeStatus(order)}
              >
                <td className={tdClass}>
                  <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-gray-400">
                    #{order.id.slice(-6)}
                  </p>
                </td>
                <td className={tdClass} dir="ltr">
                  {order.shippingAddress.phone}
                </td>
                <td
                  className={`${tdClass} max-w-[200px] truncate`}
                  title={order.shippingAddress.address}
                >
                  {order.shippingAddress.address}
                </td>
                <td className={tdClass}>{formatItemsSummary(order)}</td>
                <td className={tdClass}>{formatPrice(total, isFa)}</td>
                <td className={tdClass}>
                  <OrderStatusBadge status={order.status} t={t} />
                </td>
                <td className={tdClass}>
                  <OrderPaymentBadge isPaid={order.isPaid} t={t} />
                </td>
                <td className={tdClass}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeStatus(order);
                    }}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-800 transition hover:bg-gray-100"
                  >
                    {t("admin.orders.changeStatus")}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
