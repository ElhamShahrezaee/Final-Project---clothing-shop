import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProductGrid, {
  ProductGridSkeleton,
  productGridWrapperClass,
} from "../../../components/product/ProductGrid/ProductGrid";
import { useFeaturedProductsQuery } from "../../../features/products/queries/useFeaturedProductsQuery";
import { useAppLocale } from "../../../hooks/useAppLocale";

export default function HomeFeaturedProducts() {
  const { t } = useTranslation();
  const { isFa, dir, textAlign } = useAppLocale();
  const { data, isLoading, isError, error } = useFeaturedProductsQuery();

  return (
    <section dir={dir} className="mt-10 w-full">
      <h2
        className={`mb-4 px-4 text-2xl font-light tracking-wide lg:px-[50px] ${textAlign}`}
      >
        {t("home.featuredTitle")}
      </h2>

      {isLoading && <ProductGridSkeleton count={4} />}

      {isError && (
        <p
          className={`${productGridWrapperClass} text-sm text-red-600 ${textAlign}`}
          role="alert"
        >
          {error instanceof Error
            ? error.message
            : isFa
              ? "خطا در بارگذاری محصولات"
              : "Failed to load products"}
        </p>
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <div className={productGridWrapperClass}>
          <ProductGrid products={data} />
        </div>
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <p className={`${productGridWrapperClass} text-sm text-gray-500 ${textAlign}`}>
          {isFa ? "محصولی یافت نشد." : "No products found."}
        </p>
      )}

      <div className="mt-10 flex justify-center px-4">
        <Link
          to="/products"
          className="inline-flex min-w-[14rem] items-center justify-center rounded-full border border-gray-900 px-8 py-3 text-sm font-medium tracking-wide transition hover:bg-gray-900 hover:text-white"
        >
          {t("home.viewAllProducts")}
        </Link>
      </div>
    </section>
  );
}
