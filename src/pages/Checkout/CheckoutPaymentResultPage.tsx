import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { cartKeys } from "../../features/cart/queries/cartKeys";
import { parseOrderSuccessSearch } from "../../lib/checkout/orderSuccessParams";
import { useAppLocale } from "../../hooks/useAppLocale";

type CheckoutPaymentResultPageProps = {
  status: "success" | "failure";
};

function getOrderStatusLabel(status: string, t: (key: string) => string): string {
  const key = `admin.orders.status.${status}`;
  const translated = t(key);
  return translated === key ? status : translated;
}

export default function CheckoutPaymentResultPage({ status }: CheckoutPaymentResultPageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const qc = useQueryClient();
  const { dir, textAlign } = useAppLocale();

  const isSuccess = status === "success";
  const orderResult = useMemo(
    () => (isSuccess ? parseOrderSuccessSearch(location.search) : null),
    [isSuccess, location.search],
  );

  useEffect(() => {
    if (!isSuccess) return;

    if (!orderResult) {
      navigate("/checkout/payment", { replace: true });
      return;
    }

    void qc.invalidateQueries({ queryKey: cartKeys.root });
  }, [isSuccess, orderResult, navigate, qc]);

  useEffect(() => {
    if (!isSuccess || !location.search.includes("cart=1")) return;

    const params = new URLSearchParams(location.search);
    params.delete("cart");
    const search = params.toString();
    navigate(
      { pathname: location.pathname, search: search ? `?${search}` : "" },
      { replace: true },
    );
  }, [isSuccess, location.pathname, location.search, navigate]);

  const handleRetry = () => {
    navigate("/checkout/payment/card");
  };

  if (isSuccess && !orderResult) {
    return null;
  }

  const failureOrderId = (location.state as { orderId?: string } | null)?.orderId;

  return (
    <div
      dir={dir}
      className={`mx-auto w-full min-w-0 max-w-lg overflow-x-hidden px-4 py-10 sm:py-14 ${textAlign}`}
    >
      <div
        className={`rounded-xl border px-6 py-8 ${
          isSuccess
            ? "border-green-300 bg-green-50 text-green-900"
            : "border-red-300 bg-red-50 text-red-900"
        }`}
        role="status"
      >
        <h1 className="text-xl font-semibold">
          {isSuccess
            ? t("cart.checkout.payment.successTitle")
            : t("cart.checkout.payment.failureTitle")}
        </h1>

        {isSuccess && orderResult ? (
          <div className="mt-4 space-y-2 text-sm">
            {orderResult.message ? (
              <p className="font-medium">{orderResult.message}</p>
            ) : null}
            {orderResult.status ? (
              <p>
                {t("cart.checkout.payment.orderStatusLabel")}:{" "}
                <span className="font-medium">
                  {getOrderStatusLabel(orderResult.status, t)}
                </span>
              </p>
            ) : null}
            <p>
              {t("cart.checkout.payment.orderIdLabel")}:{" "}
              <span className="font-mono font-semibold" dir="ltr">
                {orderResult.orderId}
              </span>
            </p>
          </div>
        ) : null}

        {!isSuccess ? (
          <div className="mt-4 space-y-2 text-sm">
            <p>{t("cart.checkout.payment.failureMessage")}</p>
            <p>
              {t("cart.checkout.payment.orderIdLabel")}:{" "}
              <span className="font-mono font-semibold" dir="ltr">
                {failureOrderId ?? "—"}
              </span>
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {isSuccess && orderResult ? (
          <Link
            to="/account/orders"
            className="inline-flex h-11 items-center justify-center rounded-full border border-gray-900 px-6 text-sm font-medium transition hover:bg-gray-900 hover:text-white"
          >
            {t("cart.checkout.payment.trackOrder")}
          </Link>
        ) : null}
        {!isSuccess ? (
          <>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex h-11 items-center justify-center rounded-full border border-gray-900 px-6 text-sm font-medium transition hover:bg-gray-900 hover:text-white"
            >
              {t("cart.checkout.payment.retryPay")}
            </button>
            <Link
              to="/cart"
              className="inline-flex h-11 items-center justify-center rounded-full border border-gray-300 px-6 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              {t("nav.cart")}
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
}
