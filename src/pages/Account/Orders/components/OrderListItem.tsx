import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../../../features/admin/products/utils/formatPrice";
import type { UserOrder } from "../../../../features/orders/orderTypes";
import { formatOrderDate } from "../../../../features/orders/utils/formatOrderDate";
import { useAppLocale } from "../../../../hooks/useAppLocale";
import OrderStatusBadge from "./OrderStatusBadge";

type OrderListItemProps = {
  order: UserOrder;
};

export default function OrderListItem({ order }: OrderListItemProps) {
  const { t } = useTranslation();
  const { isFa } = useAppLocale();

  return (
    <Link
      to={`/account/orders/${order.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow-md"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-500">
            {t("account.orders.orderId")}:{" "}
            <span className="font-mono text-gray-700">{order.id.slice(-8)}</span>
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {formatOrderDate(order.createdAt, isFa)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <OrderStatusBadge status={order.status} />
          <p className="text-base font-semibold text-gray-900">
            {formatPrice(order.totalPrice, isFa)}{" "}
            <span className="text-xs font-normal text-gray-500">
              {t("account.orders.currency")}
            </span>
          </p>
        </div>
      </div>

      {order.orderItems.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center px-1 text-center text-[10px] text-gray-400">
                  {t("account.orders.noImage")}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}
