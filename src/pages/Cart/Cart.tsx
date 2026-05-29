import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/common/Spinner/Spinner";
import { useUserAuth } from "../../context/auth/useUserAuth";
import { useCartQuery } from "../../features/cart/queries/useCartQuery";
import { useUpdateCartItemMutation } from "../../features/cart/mutations/useUpdateCartItemMutation";
import { useRemoveCartItemMutation } from "../../features/cart/mutations/useRemoveCartItemMutation";
import { useAppLocale } from "../../hooks/useAppLocale";
import { buildLoginPath } from "../../lib/auth/returnUrl";
import CartItemRow from "./components/CartItemRow";
import CheckoutSummaryAside from "../Checkout/components/CheckoutSummaryAside";

export default function Cart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isFa, dir, textAlign } = useAppLocale();
  const { isAuthenticated, isLoading: isAuthLoading } = useUserAuth();
  const { data: cart, isPending, isFetching, isError, refetch } = useCartQuery();
  const isCartLoading = isAuthLoading || isPending || isFetching;
  const updateMutation = useUpdateCartItemMutation();
  const removeMutation = useRemoveCartItemMutation();

  const items = cart?.items ?? [];
  const totalPrice = cart?.totalPrice ?? 0;
  const isMutating = updateMutation.isPending || removeMutation.isPending;

  const handleConfirm = () => {
    if (!isAuthenticated) {
      navigate(buildLoginPath("/cart"));
      return;
    }
    navigate("/checkout/address");
  };

  if (isCartLoading) {
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
        <h1 className="text-2xl font-semibold text-gray-900">{t("cart.page.title")}</h1>
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
    <div
      dir={dir}
      className={`mx-auto w-full min-w-0 max-w-6xl overflow-x-hidden px-4 py-8 sm:py-10 ${textAlign}`}
    >
      <h1 className="mb-8 text-center text-2xl font-semibold tracking-wide text-gray-900 sm:text-3xl">
        {t("cart.page.title")}
      </h1>

      <div className="grid min-w-0 gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
        <section className="min-w-0 rounded-xl border border-gray-200 bg-white px-5 sm:px-8">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              isFa={isFa}
              isPending={isMutating}
              onDecrease={() => {
                const next = item.quantity - 1;
                if (next <= 0) {
                  removeMutation.mutate({ cartItemId: item.id });
                } else {
                  updateMutation.mutate({ cartItemId: item.id, quantity: next });
                }
              }}
              onIncrease={() => {
                updateMutation.mutate({
                  cartItemId: item.id,
                  quantity: item.quantity + 1,
                });
              }}
            />
          ))}
        </section>

        <CheckoutSummaryAside
          totalPrice={totalPrice}
          isFa={isFa}
          grandTotalLabel={t("cart.page.grandTotal")}
          buttonLabel={t("cart.checkout.confirmAndContinue")}
          onAction={handleConfirm}
          disabled={isMutating}
        />
      </div>
    </div>
  );
}
