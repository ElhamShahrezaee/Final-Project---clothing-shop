import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { CartItem } from "../../../features/cart/types";
import { formatStorePrice } from "../../../features/products/utils/formatStorePrice";
import { formatCount } from "../../../lib/formatCount";
import CartQuantityControl from "./CartQuantityControl";

type CartItemRowProps = {
  item: CartItem;
  isFa: boolean;
  isPending?: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
};

export default function CartItemRow({
  item,
  isFa,
  isPending,
  onDecrease,
  onIncrease,
}: CartItemRowProps) {
  const { t } = useTranslation();
  const { product, quantity } = item;
  const image = product.images?.[0];
  const stock = product.stock;
  const stockLabel = stock == null ? "—" : formatCount(stock, isFa);
  const lineTotal = product.price * quantity;

  return (
    <article className="grid gap-6 border-b border-gray-200 py-8 last:border-b-0 sm:grid-cols-[9rem_1fr_auto] sm:items-center sm:gap-8">
      <Link
        to={`/products/${product.id}`}
        className="mx-auto block h-36 w-36 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 sm:mx-0"
      >
        {image ? (
          <img src={image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            {t("cart.page.noImage")}
          </div>
        )}
      </Link>

      <div className="min-w-0 space-y-3">
        <Link
          to={`/products/${product.id}`}
          className="block truncate text-lg font-semibold text-gray-900 transition hover:opacity-80"
        >
          {product.name}
        </Link>
        <p className="text-base leading-relaxed text-gray-600">
          {t("productDetails.brand")}: {product.brand}
        </p>
        <p className="text-base leading-relaxed text-gray-600">
          {t("productDetails.category")}: {product.category}
        </p>
        <p className="text-base leading-relaxed text-gray-600">
          {t("productDetails.stock")}: {stockLabel}
        </p>
        <p className="text-base font-medium leading-relaxed text-gray-800">
          {t("cart.page.unitPrice")}: {formatStorePrice(product.price, isFa)}
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 sm:items-end">
        <CartQuantityControl
          quantity={quantity}
          stock={stock ?? Number.MAX_SAFE_INTEGER}
          isFa={isFa}
          disabled={isPending}
          reverseButtons
          onDecrease={onDecrease}
          onIncrease={onIncrease}
        />
        <p className="text-base font-semibold text-gray-900">
          {t("cart.page.lineTotal")}: {formatStorePrice(lineTotal, isFa)}
        </p>
      </div>
    </article>
  );
}
