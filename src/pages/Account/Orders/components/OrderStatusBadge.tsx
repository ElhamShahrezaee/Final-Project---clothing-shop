import { useTranslation } from "react-i18next";
import { getOrderStatusLabel } from "../../../../features/orders/utils/orderLabels";
import type { OrderStatus } from "../../../../features/orders/orderTypes";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  confirmed: "bg-blue-50 text-blue-800 ring-blue-200",
  shipping: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  delivered: "bg-green-50 text-green-800 ring-green-200",
  cancelled: "bg-gray-100 text-gray-700 ring-gray-200",
};

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { t } = useTranslation();
  const style = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {getOrderStatusLabel(status, t)}
    </span>
  );
}
