import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Spinner from "../../../components/common/Spinner/Spinner";
import { formatPrice } from "../../../features/admin/products/utils/formatPrice";
import { useUserOrderQuery } from "../../../features/orders/queries/useUserOrderQuery";
import { formatOrderDate } from "../../../features/orders/utils/formatOrderDate";
import {
  getOrderStatusLabel,
  getPaymentMethodLabel,
} from "../../../features/orders/utils/orderLabels";
import { useAppLocale } from "../../../hooks/useAppLocale";
import OrderStatusBadge from "./components/OrderStatusBadge";

const sectionClass = "rounded-xl border border-gray-200 bg-white p-6 shadow-sm";

export default function UserOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { t } = useTranslation();
  const { isFa, dir, textAlign } = useAppLocale();
  const { data: order, isPending, isError, refetch } = useUserOrderQuery(orderId);

  return (
    <div dir={dir} className={`mx-auto max-w-3xl px-4 py-10 ${textAlign}`}>
      <Link
        to="/account/orders"
        className="text-sm text-gray-600 transition hover:text-gray-900"
      >
        ← {t("account.orders.backToList")}
      </Link>

      {isPending && (
        <div className="mt-10 flex justify-center">
          <Spinner />
        </div>
      )}

      {isError && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-800">{t("account.orders.detailLoadError")}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg border border-red-300 px-4 py-2 text-sm text-red-800 hover:bg-red-100"
          >
            {t("account.orders.retry")}
          </button>
        </div>
      )}

      {!isPending && !isError && order && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {t("account.orders.detailTitle")}
              </h1>
              <p className="mt-1 font-mono text-sm text-gray-600">{order.id}</p>
              <p className="mt-1 text-sm text-gray-500">
                {formatOrderDate(order.createdAt, isFa)}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <section className={sectionClass}>
            <h2 className="text-sm font-semibold text-gray-900">
              {t("account.orders.sections.summary")}
            </h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-gray-500">{t("account.orders.fields.status")}</dt>
                <dd className="mt-0.5 font-medium text-gray-900">
                  {getOrderStatusLabel(order.status, t)}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">{t("account.orders.fields.payment")}</dt>
                <dd className="mt-0.5 font-medium text-gray-900">
                  {getPaymentMethodLabel(order.paymentMethod, t)}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">{t("account.orders.fields.paid")}</dt>
                <dd className="mt-0.5 font-medium text-gray-900">
                  {order.isPaid
                    ? t("account.orders.paidYes")
                    : t("account.orders.paidNo")}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">{t("account.orders.fields.total")}</dt>
                <dd className="mt-0.5 text-lg font-semibold text-gray-900">
                  {formatPrice(order.totalPrice, isFa)}{" "}
                  <span className="text-sm font-normal text-gray-500">
                    {t("account.orders.currency")}
                  </span>
                </dd>
              </div>
            </dl>
          </section>

          <section className={sectionClass}>
            <h2 className="text-sm font-semibold text-gray-900">
              {t("account.orders.sections.shipping")}
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">{t("account.orders.fields.name")}</dt>
                <dd className="font-medium text-gray-900">{order.shippingAddress.name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">{t("account.orders.fields.phone")}</dt>
                <dd className="font-medium text-gray-900" dir="ltr">
                  {order.shippingAddress.phone}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">{t("account.orders.fields.address")}</dt>
                <dd className="font-medium text-gray-900">{order.shippingAddress.address}</dd>
              </div>
            </dl>
          </section>

          <section className={sectionClass}>
            <h2 className="text-sm font-semibold text-gray-900">
              {t("account.orders.sections.items")}
            </h2>
            <ul className="mt-4 divide-y divide-gray-100">
              {order.orderItems.map((item) => (
                <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt=""
                      className="h-20 w-20 shrink-0 rounded-lg border border-gray-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-400">
                      {t("account.orders.noImage")}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {t("account.orders.quantityLine", {
                        qty: item.quantity,
                        price: formatPrice(item.price, isFa),
                      })}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity, isFa)}{" "}
                      <span className="font-normal text-gray-500">
                        {t("account.orders.currency")}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
