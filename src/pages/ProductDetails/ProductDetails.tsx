import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useProductQuery } from "../../features/products/queries/useProductQuery";
import { useAppLocale } from "../../hooks/useAppLocale";
import CollapsibleSection from "./components/CollapsibleSection";
import ProductImageSwiper from "./components/ProductImageSwiper";
import ProductInfoBar from "./components/ProductInfoBar";
import SimilarProductsRow from "./components/SimilarProductsRow";
import { FULL_BLEED_MEDIA_HEIGHT } from "../../styles/mediaHeights";

function ProductDetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className={`border-b bg-gray-200 ${FULL_BLEED_MEDIA_HEIGHT}`} />
      <div className="grid grid-cols-2 gap-8 px-8 py-8">
        <div className="space-y-4">
          <div className="h-4 w-24 bg-gray-200" />
          <div className="h-10 w-48 bg-gray-200" />
          <div className="h-4 w-32 bg-gray-200" />
        </div>
        <div className="space-y-3 text-right">
          <div className="ms-auto h-6 w-3/4 bg-gray-200" />
          <div className="ms-auto h-4 w-1/2 bg-gray-200" />
          <div className="ms-auto h-4 w-1/3 bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { isFa, dir, textAlign } = useAppLocale();
  const { data: product, isLoading, isError, error, isFetched } = useProductQuery(id);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [id]);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (isError) {
    return (
      <p className={`px-4 py-12 text-sm text-red-600 ${textAlign}`} dir={dir} role="alert">
        {error instanceof Error ? error.message : t("productDetails.loadError")}
      </p>
    );
  }

  if (isFetched && !product) {
    return (
      <p className={`px-4 py-12 text-sm text-gray-600 ${textAlign}`} dir={dir}>
        {t("productDetails.notFound")}
      </p>
    );
  }

  if (!product) {
    return null;
  }

  const reviewCount = Math.min(product.numReviews, 5);
  const reviewsTitle = `${t("productDetails.reviewsTitle")} (${isFa ? new Intl.NumberFormat("fa-IR").format(product.numReviews) : product.numReviews})`;

  return (
    <article dir={dir}>
      <ProductImageSwiper images={product.images} alt={product.name} />
      <ProductInfoBar product={product} />

      <CollapsibleSection title={t("productDetails.descriptionTitle")}>
        <p className={textAlign}>
          {product.description ||
            (isFa ? "توضیحاتی برای این محصول ثبت نشده است." : "No description available.")}
        </p>
      </CollapsibleSection>

      <CollapsibleSection title={reviewsTitle}>
        {reviewCount === 0 ? (
          <p className={textAlign}>{t("productDetails.noReviews")}</p>
        ) : (
          <ul className="space-y-4">
            {Array.from({ length: reviewCount }).map((_, index) => (
              <li
                key={index}
                className="border border-gray-200 bg-gray-50 px-4 py-4"
              >
                <p className="text-sm font-medium text-gray-900">
                  {t("productDetails.reviewUser")} – {t("productDetails.reviewDate")}
                </p>
                <p className={`mt-2 text-sm text-gray-700 ${textAlign}`}>
                  {t("productDetails.reviewBody")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CollapsibleSection>

      <SimilarProductsRow category={product.category} excludeId={product.id} />
    </article>
  );
}
