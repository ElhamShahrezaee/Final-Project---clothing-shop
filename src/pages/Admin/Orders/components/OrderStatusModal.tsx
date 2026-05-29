import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../../../components/common/Spinner/Spinner";
import { formatPrice } from "../../../../features/admin/products/utils/formatPrice";
import type { AdminOrder, OrderStatus } from "../../../../features/admin/orders/types";
import {
  getOrderStatusLabel,
  getOrderStatusOptions,
  getOrderTotal,
} from "../../../../features/admin/orders/utils/orderLabels";
import { useAdminLocale } from "../../../../hooks/useAdminLocale";

type OrderStatusModalProps = {
  order: AdminOrder;
  isSaving: boolean;
  errorMessage?: string | null;
  onSave: (status: OrderStatus) => void;
  onCancel: () => void;
};

function getPaymentMethodLabel(method: string, t: (key: string) => string): string {
  const key = `account.orders.paymentMethod.${method}`;
  const translated = t(key);
  return translated !== key ? translated : method;
}

export default function OrderStatusModal({
  order,
  isSaving,
  errorMessage,
  onSave,
  onCancel,
}: OrderStatusModalProps) {
  const { t } = useTranslation();
  const { isFa, dir, textAlign } = useAdminLocale();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const statusOptions = getOrderStatusOptions(t);
  const total = getOrderTotal(order.totalPrice, order.orderItems);

  useEffect(() => {
    setStatus(order.status);
  }, [order]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        dir={dir}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-status-modal-title"
        className={`max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl ${textAlign}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="order-status-modal-title" className="text-lg font-semibold text-gray-900">
          {t("admin.orders.statusModal.title")}
        </h2>
        <p className="mt-1 font-mono text-xs text-gray-500" dir="ltr">
          {t("admin.orders.statusModal.orderId")}: {order.id}
        </p>

        <section className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-900">
            {t("admin.orders.statusModal.sections.customer")}
          </h3>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray-500">{t("admin.orders.table.customer")}</dt>
              <dd className="font-medium text-gray-900">{order.shippingAddress.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{t("admin.orders.table.phone")}</dt>
              <dd className="font-medium text-gray-900" dir="ltr">
                {order.shippingAddress.phone}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-gray-500">{t("admin.orders.table.address")}</dt>
              <dd className="font-medium text-gray-900">{order.shippingAddress.address}</dd>
            </div>
          </dl>
        </section>

        <section className="mt-4 rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900">
            {t("admin.orders.statusModal.sections.summary")}
          </h3>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray-500">{t("admin.orders.table.amount")}</dt>
              <dd className="font-semibold text-gray-900">{formatPrice(total, isFa)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{t("admin.orders.statusModal.paymentMethod")}</dt>
              <dd className="font-medium text-gray-900">
                {getPaymentMethodLabel(order.paymentMethod, t)}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">{t("admin.orders.table.payment")}</dt>
              <dd className="font-medium text-gray-900">
                {order.isPaid ? t("admin.orders.paid") : t("admin.orders.unpaid")}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">{t("admin.orders.table.status")}</dt>
              <dd className="font-medium text-gray-900">
                {getOrderStatusLabel(order.status, t)}
              </dd>
            </div>
          </dl>
        </section>

        <section className="mt-4 rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900">
            {t("admin.orders.statusModal.sections.items")}
          </h3>
          <ul className="mt-3 divide-y divide-gray-100">
            {order.orderItems.map((item) => (
              <li key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-lg border border-gray-200 object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-400">
                    {t("admin.common.noImage")}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="mt-0.5 text-sm text-gray-600">
                    {t("admin.orders.statusModal.itemLine", {
                      qty: item.quantity,
                      price: formatPrice(item.price, isFa),
                      total: formatPrice(item.price * item.quantity, isFa),
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-5">
          <label
            htmlFor="order-status-select"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {t("admin.orders.statusModal.newStatus")}
          </label>
          <select
            id="order-status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            disabled={isSaving}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:cursor-not-allowed disabled:bg-gray-50"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {errorMessage ? (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t("admin.common.cancel")}
          </button>
          <button
            type="button"
            onClick={() => onSave(status)}
            disabled={isSaving}
            className="inline-flex min-w-[5.5rem] items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Spinner size="sm" className="border-white/40 border-t-white" />
                <span>{t("admin.common.saving")}</span>
              </>
            ) : (
              t("admin.common.save")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
