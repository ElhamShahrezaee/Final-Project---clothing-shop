import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/common/Spinner/Spinner";
import type { PaymentMethod } from "../../features/checkout/types";
import { useCheckoutShippingReady } from "../../features/checkout/hooks/useCheckoutShippingReady";
import { useCreateOrderMutation } from "../../features/orders/mutations/useCreateOrderMutation";
import { setLastPaymentMethod } from "../../lib/checkout/checkoutSessionStorage";
import { buildOrderSuccessSearch } from "../../lib/checkout/orderSuccessParams";
import { useAppLocale } from "../../hooks/useAppLocale";

const sectionClass = "rounded-xl border border-gray-200 bg-white p-5 sm:p-6";
const actionBtnClass =
  "w-full rounded-full border border-gray-900 px-4 py-3 text-sm font-medium transition hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50";

const PAYMENT_OPTIONS: { id: PaymentMethod; labelKey: string }[] = [
  { id: "cash", labelKey: "cart.checkout.payment.cash" },
  { id: "credit", labelKey: "cart.checkout.payment.credit" },
  { id: "card", labelKey: "cart.checkout.payment.card" },
];

export default function CheckoutPaymentMethodPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { dir, textAlign } = useAppLocale();
  const { shippingAddress, isReady, isPending } = useCheckoutShippingReady();
  const createOrderMutation = useCreateOrderMutation();

  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !isReady) {
      navigate("/checkout/address", { replace: true });
    }
  }, [isPending, isReady, navigate]);

  const handlePay = async () => {
    setError(null);
    if (!method || !isReady || !shippingAddress) {
      if (!isReady) navigate("/checkout/address");
      return;
    }

    setLastPaymentMethod(method);

    if (method === "card") {
      navigate("/checkout/payment/card");
      return;
    }

    try {
      const order = await createOrderMutation.mutateAsync({
        shippingAddress,
        paymentMethod: method,
      });
      const search = buildOrderSuccessSearch({
        orderId: order.id,
        status: order.status,
        message: order.message,
      });
      navigate(`/checkout/result/success?${search}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("cart.checkout.payment.orderError"));
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isReady) {
    return null;
  }

  const isSubmitting = createOrderMutation.isPending;

  return (
    <div
      dir={dir}
      className={`mx-auto w-full min-w-0 max-w-lg overflow-x-hidden px-4 py-8 sm:py-10 ${textAlign}`}
    >
      <h1 className="mb-8 text-center text-2xl font-semibold tracking-wide text-gray-900 sm:text-3xl">
        {t("cart.checkout.payment.selectMethodTitle")}
      </h1>

      <section className={sectionClass}>
        <fieldset className="space-y-3" disabled={isSubmitting}>
          <legend className="sr-only">{t("cart.checkout.payment.selectMethodTitle")}</legend>
          {PAYMENT_OPTIONS.map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                method === option.id
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                className="shrink-0"
                checked={method === option.id}
                onChange={() => setMethod(option.id)}
              />
              <span className="text-sm font-medium text-gray-900">{t(option.labelKey)}</span>
            </label>
          ))}
        </fieldset>

        {error ? (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => void handlePay()}
          disabled={!method || isSubmitting}
          className={`mt-6 ${actionBtnClass}`}
        >
          {isSubmitting
            ? t("cart.checkout.payment.processing")
            : t("cart.checkout.payment.pay")}
        </button>
      </section>
    </div>
  );
}
