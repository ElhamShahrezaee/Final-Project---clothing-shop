import { useTranslation } from "react-i18next";
import type { ProductDetail } from "../../../features/products/types";
import { formatStorePrice } from "../../../features/products/utils/formatStorePrice";
import { formatRating } from "../../../features/products/utils/formatRating";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useAddToCartMutation } from "../../../features/cart/mutations/useAddToCartMutation";
import { useRemoveCartItemMutation } from "../../../features/cart/mutations/useRemoveCartItemMutation";
import { useUpdateCartItemMutation } from "../../../features/cart/mutations/useUpdateCartItemMutation";
import { useCartQuery } from "../../../features/cart/queries/useCartQuery";
import { getCartItemByProductId } from "../../../features/cart/utils/cartSelectors";
import { useAppLocale } from "../../../hooks/useAppLocale";
import type { CartProduct } from "../../../features/cart/types";
import { formatCount } from "../../../lib/formatCount";

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
    </svg>
  );
}

function RatingRow({
  ratingLabel,
  isFa,
}: {
  ratingLabel: string;
  isFa: boolean;
}) {
  const { t } = useTranslation();

  return (
    <p
      dir={isFa ? "rtl" : "ltr"}
      className="mt-3 text-right text-sm leading-relaxed text-gray-700"
    >
      {t("productDetails.rating")}: {ratingLabel}{" "}
      <StarIcon className="ms-0.5 inline h-4 w-4 align-[-2px] text-amber-500" />
    </p>
  );
}

type ProductInfoBarProps = {
  product: ProductDetail;
};

function ProductMeta({
  product,
  ratingLabel,
  isFa,
}: {
  product: ProductDetail;
  ratingLabel: string;
  isFa: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="text-right">
      <h1
        dir="rtl"
        className="text-xl font-bold tracking-wide text-gray-900 sm:text-2xl"
      >
        {product.name}
      </h1>
      <p className="mt-3 text-sm text-gray-600">
        {t("productDetails.category")}: {product.category}
      </p>
      <p dir="rtl" className="mt-1 text-right text-sm text-gray-600">
        {t("productDetails.brand")}: {product.brand}
      </p>
      <RatingRow ratingLabel={ratingLabel} isFa={isFa} />
    </div>
  );
}

function ProductActions({
  productId,
  stock,
  productForCart,
  price,
  stockLabel,
  isFa,
  priceClassName,
}: {
  productId: string;
  stock: number;
  productForCart: CartProduct;
  price: number;
  stockLabel: string;
  isFa: boolean;
  priceClassName: string;
}) {
  const { t } = useTranslation();
  const { data: cart } = useCartQuery();
  const addMutation = useAddToCartMutation();
  const updateMutation = useUpdateCartItemMutation();
  const removeMutation = useRemoveCartItemMutation();

  const cartItem = getCartItemByProductId(cart, productId);
  const qty = cartItem?.quantity ?? 0;

  const canIncrease = qty < stock;
  const canDecrease = qty > 0;

  const setQuantity = async (nextQty: number) => {
    const safeQty = Math.max(0, Math.min(stock, nextQty));

    if (safeQty === 0) {
      if (cartItem?.id) {
        await removeMutation.mutateAsync({ cartItemId: cartItem.id });
      }
      return;
    }

    if (!cartItem?.id) {
      await addMutation.mutateAsync({ productId, quantity: safeQty, product: productForCart });
      return;
    }

    await updateMutation.mutateAsync({ cartItemId: cartItem.id, quantity: safeQty });
  };

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center">
      <p
        className={`w-full text-center font-semibold text-gray-900 ${priceClassName}`}
      >
        {formatStorePrice(price, isFa)}
      </p>

      {qty <= 0 ? (
        <button
          type="button"
          disabled={stock <= 0 || addMutation.isPending}
          onClick={() => setQuantity(1)}
          className="mt-5 w-full border border-gray-900 px-6 py-3 text-sm font-medium tracking-wide transition hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
        >
          {t("productDetails.addToCart")}
        </button>
      ) : (
        <div className="mt-5 flex w-full items-center justify-center gap-2 px-3 py-2">
          <button
            type="button"
            onClick={() => setQuantity(qty - 1)}
            disabled={!canDecrease || updateMutation.isPending || removeMutation.isPending}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 text-2xl font-semibold leading-none transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={t("productDetails.decreaseQuantity")}
          >
            {qty === 1 ? <DeleteOutlineOutlinedIcon fontSize="inherit" /> : "-"}
          </button>

          <span className="min-w-[3rem] text-center text-base font-semibold text-gray-900">
            {formatCount(qty, isFa)}
          </span>

          <button
            type="button"
            onClick={() => setQuantity(qty + 1)}
            disabled={!canIncrease || updateMutation.isPending}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 text-2xl font-semibold leading-none transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={t("productDetails.increaseQuantity")}
          >
            +
          </button>
        </div>
      )}

      <p className="mt-4 w-full text-center text-sm text-gray-700">
        {t("productDetails.stock")}: {stockLabel}
      </p>
    </div>
  );
}

export default function ProductInfoBar({ product }: ProductInfoBarProps) {
  const { isFa } = useAppLocale();
  const ratingLabel = formatRating(product.rating, isFa);
  const stockLabel = isFa
    ? new Intl.NumberFormat("fa-IR").format(product.stock)
    : String(product.stock);

  const productForCart: CartProduct = {
    id: product.id,
    name: product.name,
    brand: product.brand,
    price: product.price,
    images: product.images,
    rating: product.rating,
    category: product.category,
    stock: product.stock,
  };

  return (
    <div dir="ltr" className="border-b px-4 py-8 sm:px-8 lg:px-12">
      <div className="flex flex-col gap-8 sm:hidden">
        <ProductMeta product={product} ratingLabel={ratingLabel} isFa={isFa} />
        <ProductActions
          productId={product.id}
          stock={product.stock}
          productForCart={productForCart}
          price={product.price}
          stockLabel={stockLabel}
          isFa={isFa}
          priceClassName="text-2xl"
        />
      </div>

      <div className="hidden gap-8 sm:grid sm:grid-cols-2">
        <ProductActions
          productId={product.id}
          stock={product.stock}
          productForCart={productForCart}
          price={product.price}
          stockLabel={stockLabel}
          isFa={isFa}
          priceClassName="text-3xl"
        />
        <ProductMeta product={product} ratingLabel={ratingLabel} isFa={isFa} />
      </div>
    </div>
  );
}
