import { useTranslation } from "react-i18next";
import type { CartItem } from "../../../features/cart/types";
import { formatStorePrice } from "../../../features/products/utils/formatStorePrice";
import { formatCount } from "../../../lib/formatCount";

type CheckoutCartReviewProps = {
  items: CartItem[];
  isFa: boolean;
};

export default function CheckoutCartReview({ items, isFa }: CheckoutCartReviewProps) {
  const { t } = useTranslation();

  return (
    <section className="rounded-xl border border-gray-200 bg-white px-5 sm:px-8">
      <h2 className="border-b border-gray-200 py-5 text-lg font-semibold text-gray-900">
        {t("cart.page.title")}
      </h2>
      {items.map((item) => {
        const { product, quantity } = item;
        const image = product.images?.[0];
        const lineTotal = product.price * quantity;

        return (
          <article
            key={item.id}
            className="grid gap-4 border-b border-gray-200 py-6 last:border-b-0 sm:grid-cols-[7rem_1fr_auto] sm:items-center sm:gap-6"
          >
            <div className="mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 sm:mx-0">
              {image ? (
                <img src={image} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                  {t("cart.page.noImage")}
                </div>
              )}
            </div>

            <div className="min-w-0 space-y-1">
              <p className="truncate text-base font-semibold text-gray-900">{product.name}</p>
              <p className="text-sm text-gray-600">
                {t("productDetails.brand")}: {product.brand}
              </p>
              <p className="text-sm text-gray-600">
                {t("cart.checkout.quantity")}: {formatCount(quantity, isFa)}
              </p>
            </div>

            <p className="text-base font-semibold text-gray-900 sm:text-end">
              {formatStorePrice(lineTotal, isFa)}
            </p>
          </article>
        );
      })}
    </section>
  );
}
