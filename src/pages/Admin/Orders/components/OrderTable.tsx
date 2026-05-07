import type { AdminOrder } from "../../../../features/admin/orders/types";
import {
  getOrderTotal,
  ORDER_STATUS_LABELS,
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

function formatItemsSummary(order: AdminOrder): string {
  if (order.orderItems.length === 0) return "—";
  const first = order.orderItems[0];
  const rest = order.orderItems.length - 1;
  const line = `${first.quantity}× ${first.name}`;
  return rest > 0 ? `${line} و ${rest} مورد دیگر` : line;
}

export default function OrderTable({
  orders,
  isLoading,
  isError,
  errorMessage,
}: OrderTableProps) {
  const { isFa, textAlign } = useAdminLocale();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
        {errorMessage ?? "خطا در بارگذاری سفارشات"}
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500">
        سفارشی یافت نشد.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className={`w-full min-w-[880px] ${textAlign}`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className={thClass}>مشتری</th>
            <th className={thClass}>تلفن</th>
            <th className={thClass}>آدرس</th>
            <th className={thClass}>محصولات</th>
            <th className={thClass}>مبلغ</th>
            <th className={thClass}>وضعیت</th>
            <th className={thClass}>پرداخت</th>
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
                    {ORDER_STATUS_LABELS[order.status]}
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
                    {order.isPaid ? "پرداخت شده" : "پرداخت نشده"}
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
