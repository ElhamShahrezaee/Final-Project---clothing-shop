import { useTranslation } from "react-i18next";
import type { ProductDetail } from "../../../features/products/types";
import { formatStorePrice } from "../../../features/products/utils/formatStorePrice";
import { formatRating } from "../../../features/products/utils/formatRating";
import { useAppLocale } from "../../../hooks/useAppLocale";

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
  price,
  stock,
  stockLabel,
  isFa,
  priceClassName,
}: {
  price: number;
  stock: number;
  stockLabel: string;
  isFa: boolean;
  priceClassName: string;
}) {
  const { t } = useTranslation();
  const isOutOfStock = stock <= 0;

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center">
      <p
        className={`w-full text-center font-semibold text-gray-900 ${priceClassName}`}
      >
        {formatStorePrice(price, isFa)}
      </p>

      <button
        type="button"
        disabled={isOutOfStock}
        className={[
          "mt-5 w-full border px-6 py-3 text-sm font-medium tracking-wide transition",
          isOutOfStock
            ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500"
            : "border-gray-900 hover:bg-gray-900 hover:text-white",
        ].join(" ")}
      >
        {isOutOfStock ? t("productDetails.outOfStock") : t("productDetails.addToCart")}
      </button>

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

  return (
    <div dir="ltr" className="border-b px-4 py-8 sm:px-8 lg:px-12">
      <div className="flex flex-col gap-8 sm:hidden">
        <ProductMeta product={product} ratingLabel={ratingLabel} isFa={isFa} />
        <ProductActions
          price={product.price}
          stock={product.stock}
          stockLabel={stockLabel}
          isFa={isFa}
          priceClassName="text-2xl"
        />
      </div>

      <div className="hidden gap-8 sm:grid sm:grid-cols-2">
        <ProductActions
          price={product.price}
          stock={product.stock}
          stockLabel={stockLabel}
          isFa={isFa}
          priceClassName="text-3xl"
        />
        <ProductMeta product={product} ratingLabel={ratingLabel} isFa={isFa} />
      </div>
    </div>
  );
}
