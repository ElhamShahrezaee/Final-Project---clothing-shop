import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/common/Spinner/Spinner";
import { useCartQuery } from "../../features/cart/queries/useCartQuery";
import { useCheckoutShippingReady } from "../../features/checkout/hooks/useCheckoutShippingReady";
import { useCreateOrderMutation } from "../../features/orders/mutations/useCreateOrderMutation";
import { setLastPaymentMethod } from "../../lib/checkout/checkoutSessionStorage";
import { buildOrderSuccessSearch } from "../../lib/checkout/orderSuccessParams";
import { formatStorePrice } from "../../features/products/utils/formatStorePrice";
import { useAppLocale } from "../../hooks/useAppLocale";

const inputClass =
  "w-full max-w-[16rem] rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

const actionBtnClass =
  "inline-flex h-11 w-full items-center justify-center rounded-full border border-gray-900 px-4 text-sm font-medium transition hover:bg-gray-900 hover:text-white sm:flex-1";

const secondaryBtnClass =
  "inline-flex h-11 w-full items-center justify-center rounded-full border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:flex-1";

const expiryBoxClass =
  "w-14 rounded-lg border border-gray-300 px-2 py-2.5 text-center text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

function digitsOnly(value: string, maxLen: number) {
  return value.replace(/\D/g, "").slice(0, maxLen);
}

function isValidMonth(month: string): boolean {
  if (!month) return false;
  const n = Number(month);
  return Number.isInteger(n) && n >= 1 && n <= 12;
}

export default function CheckoutCardPaymentPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isFa, dir, textAlign } = useAppLocale();
  const { data: cart, isPending: isCartPending } = useCartQuery();
  const { shippingAddress, isReady, isPending: isAddressPending } =
    useCheckoutShippingReady();
  const createOrderMutation = useCreateOrderMutation();

  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardPassword, setCardPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const totalPrice = cart?.totalPrice ?? 0;
  const isLoading = isCartPending || isAddressPending;

  useEffect(() => {
    if (!isAddressPending && !isReady) {
      navigate("/checkout/address", { replace: true });
    }
  }, [isAddressPending, isReady, navigate]);

  const handleMonthChange = (value: string) => {
    const next = digitsOnly(value, 2);
    setExpiryMonth(next);
    if (next.length > 0 && !isValidMonth(next)) {
      setError(t("cart.checkout.payment.monthRangeInvalid"));
    } else if (error === t("cart.checkout.payment.monthRangeInvalid")) {
      setError(null);
    }
  };

  const validate = (): string | null => {
    if (cardNumber.length !== 16) return t("cart.checkout.payment.cardNumberInvalid");
    if (!isValidMonth(expiryMonth)) return t("cart.checkout.payment.monthRangeInvalid");
    if (expiryYear.length !== 2) return t("cart.checkout.payment.expiryInvalid");
    if (cvv.length < 3 || cvv.length > 5) return t("cart.checkout.payment.cvvInvalid");
    if (!cardPassword.trim()) return t("cart.checkout.payment.passwordRequired");
    return null;
  };

  const handlePay = async () => {
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!isReady || !shippingAddress) {
      navigate("/checkout/address");
      return;
    }

    setLastPaymentMethod("card");

    try {
      const order = await createOrderMutation.mutateAsync({
        shippingAddress,
        paymentMethod: "card",
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

  const handleCancel = () => {
    const pendingOrderId = `PND-${Date.now()}`;
    navigate("/checkout/result/failure", {
      replace: true,
      state: { orderId: pendingOrderId },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isReady) {
    return null;
  }

  return (
    <div
      dir={dir}
      className={`mx-auto w-full min-w-0 max-w-lg overflow-x-hidden px-4 py-8 sm:py-10 ${textAlign}`}
    >
      <h1 className="mb-6 text-center text-2xl font-semibold tracking-wide text-gray-900 sm:text-3xl">
        {t("cart.checkout.payment.cardTitle")}
      </h1>

      <p className="mb-6 text-center text-lg font-semibold text-gray-900">
        {t("cart.page.grandTotal")}: {formatStorePrice(totalPrice, isFa)}
      </p>

      <section className="w-full min-w-0 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="mx-auto flex w-full min-w-0 max-w-xs flex-col items-center space-y-4">
          <div className="w-full text-center">
            <label htmlFor="card-number" className="mb-1.5 block text-sm font-medium text-gray-700">
              {t("cart.checkout.payment.cardNumber")}
            </label>
            <input
              id="card-number"
              type="text"
              inputMode="numeric"
              dir="ltr"
              maxLength={16}
              value={cardNumber}
              onChange={(e) => setCardNumber(digitsOnly(e.target.value, 16))}
              className={`${inputClass} mx-auto text-center`}
              placeholder="0000 0000 0000 0000"
            />
          </div>

          <div className="w-full text-center">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">
              {t("cart.checkout.payment.expiryLabel")}
            </span>
            <div className="flex items-center justify-center gap-2" dir="ltr">
              <input
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={expiryMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
                className={expiryBoxClass}
                placeholder={t("cart.checkout.payment.monthPlaceholder")}
                aria-label={t("cart.checkout.payment.monthPlaceholder")}
              />
              <span className="text-lg text-gray-500" aria-hidden>
                /
              </span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={expiryYear}
                onChange={(e) => setExpiryYear(digitsOnly(e.target.value, 2))}
                className={expiryBoxClass}
                placeholder={t("cart.checkout.payment.yearPlaceholder")}
                aria-label={t("cart.checkout.payment.yearPlaceholder")}
              />
            </div>
          </div>

          <div className="w-full text-center">
            <label htmlFor="card-cvv" className="mb-1.5 block text-sm font-medium text-gray-700">
              {t("cart.checkout.payment.cvv")}
            </label>
            <input
              id="card-cvv"
              type="password"
              inputMode="numeric"
              dir="ltr"
              maxLength={5}
              value={cvv}
              onChange={(e) => setCvv(digitsOnly(e.target.value, 5))}
              className={`${inputClass} mx-auto text-center`}
            />
          </div>

          <div className="w-full text-center">
            <label
              htmlFor="card-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              {t("cart.checkout.payment.cardPassword")}
            </label>
            <input
              id="card-password"
              type="password"
              dir="ltr"
              value={cardPassword}
              onChange={(e) => setCardPassword(e.target.value)}
              className={`${inputClass} mx-auto text-center`}
              autoComplete="off"
            />
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-center text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mx-auto mt-6 flex w-full min-w-0 max-w-xs flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => void handlePay()}
            disabled={createOrderMutation.isPending}
            className={actionBtnClass}
          >
            {createOrderMutation.isPending
              ? t("cart.checkout.payment.processing")
              : t("cart.checkout.payment.pay")}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={createOrderMutation.isPending}
            className={secondaryBtnClass}
          >
            {t("cart.checkout.cancel")}
          </button>
        </div>
      </section>
    </div>
  );
}
