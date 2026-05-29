import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/common/Spinner/Spinner";
import { useCartQuery } from "../../features/cart/queries/useCartQuery";
import { useAppLocale } from "../../hooks/useAppLocale";
import AddressSection, { useCheckoutAddressReady } from "../../components/address/AddressSection";
import CheckoutCartReview from "./components/CheckoutCartReview";
import CheckoutSummaryAside from "./components/CheckoutSummaryAside";

export default function CheckoutReviewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isFa, dir, textAlign } = useAppLocale();
  const { data: cart, isPending, isError, refetch } = useCartQuery();
  const { isReady, isPending: isAddressPending } = useCheckoutAddressReady();
  const [addressError, setAddressError] = useState<string | null>(null);

  const items = cart?.items ?? [];
  const totalPrice = cart?.totalPrice ?? 0;
  const isLoading = isPending || isAddressPending;

  const handleConfirmPay = () => {
    setAddressError(null);
    if (!isReady) {
      setAddressError(t("cart.checkout.addressRequired"));
      navigate("/checkout/address");
      return;
    }
    navigate("/checkout/payment");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div dir={dir} className={`mx-auto max-w-3xl px-4 py-12 ${textAlign}`}>
        <p className="text-sm text-red-600" role="alert">
          {t("cart.page.loadError")}
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 rounded-full border border-gray-900 px-5 py-2 text-sm font-medium transition hover:bg-gray-900 hover:text-white"
        >
          {t("cart.page.retry")}
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div dir={dir} className={`mx-auto max-w-3xl px-4 py-12 ${textAlign}`}>
        <h1 className="text-2xl font-semibold text-gray-900">{t("cart.checkout.reviewTitle")}</h1>
        <p className="mt-4 text-sm text-gray-600">{t("cart.page.empty")}</p>
        <Link
          to="/products"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-gray-900 px-6 text-sm font-medium transition hover:bg-gray-900 hover:text-white"
        >
          {t("cart.page.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div dir={dir} className={`mx-auto max-w-6xl px-4 py-8 sm:py-10 ${textAlign}`}>
      <h1 className="mb-8 text-center text-2xl font-semibold tracking-wide text-gray-900 sm:text-3xl">
        {t("cart.checkout.reviewTitle")}
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="min-w-0 space-y-6">
          <AddressSection readOnly />
          {addressError ? (
            <p className="text-sm text-red-600" role="alert">
              {addressError}
            </p>
          ) : null}
          <CheckoutCartReview items={items} isFa={isFa} />
        </div>

        <CheckoutSummaryAside
          totalPrice={totalPrice}
          isFa={isFa}
          grandTotalLabel={t("cart.page.grandTotal")}
          buttonLabel={t("cart.checkout.confirmAndPay")}
          onAction={handleConfirmPay}
        />
      </div>
    </div>
  );
}
