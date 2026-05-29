import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/common/Spinner/Spinner";
import ShippingAddressSelector from "../../components/checkout/ShippingAddressSelector";
import { useCartQuery } from "../../features/cart/queries/useCartQuery";
import { useCheckoutShippingReady } from "../../features/checkout/hooks/useCheckoutShippingReady";
import { useAppLocale } from "../../hooks/useAppLocale";
import CheckoutSummaryAside from "./components/CheckoutSummaryAside";

export default function CheckoutAddressPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isFa, dir, textAlign } = useAppLocale();
  const { data: cart, isPending: isCartPending } = useCartQuery();
  const { isReady, isPending: isAddressPending } = useCheckoutShippingReady();
  const [addressError, setAddressError] = useState<string | null>(null);

  const totalPrice = cart?.totalPrice ?? 0;
  const isLoading = isCartPending || isAddressPending;

  const handleContinue = () => {
    setAddressError(null);
    if (!isReady) {
      setAddressError(t("cart.checkout.addressRequired"));
      return;
    }
    navigate("/checkout/review");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div dir={dir} className={`mx-auto max-w-6xl px-4 py-8 sm:py-10 ${textAlign}`}>
      <h1 className="mb-8 text-center text-2xl font-semibold tracking-wide text-gray-900 sm:text-3xl">
        {t("cart.checkout.addressTitle")}
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="min-w-0 space-y-4">
          <ShippingAddressSelector onSelectionChange={() => setAddressError(null)} />
          {addressError ? (
            <p className="text-sm text-red-600" role="alert">
              {addressError}
            </p>
          ) : null}
        </div>

        <CheckoutSummaryAside
          totalPrice={totalPrice}
          isFa={isFa}
          grandTotalLabel={t("cart.page.grandTotal")}
          buttonLabel={t("cart.checkout.confirmAndContinue")}
          onAction={handleContinue}
        />
      </div>
    </div>
  );
}
