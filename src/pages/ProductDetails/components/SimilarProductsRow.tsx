import { useTranslation } from "react-i18next";
import ProductCard from "../../../components/product/ProductCard/ProductCard";
import ProductCardsSwiper from "../../../components/product/ProductCardsSwiper/ProductCardsSwiper";
import { useSimilarProductsQuery } from "../../../features/products/queries/useSimilarProductsQuery";
import { useAppLocale } from "../../../hooks/useAppLocale";

type SimilarProductsRowProps = {
  category: string;
  excludeId: string;
};

export default function SimilarProductsRow({ category, excludeId }: SimilarProductsRowProps) {
  const { t } = useTranslation();
  const { dir } = useAppLocale();
  const { data, isLoading, isError } = useSimilarProductsQuery(category, excludeId);

  const products = data ?? [];

  if (isLoading || isError || products.length === 0) {
    return null;
  }

  return (
    <section className="mt-[50px] flex w-full flex-col items-center px-4 pb-12" dir={dir}>
      <h2 className="mb-10 text-center text-4xl font-light tracking-[0.2em] text-gray-900 md:text-5xl">
        {t("productDetails.similarTitle")}
      </h2>

      <div className="flex w-full justify-center">
        <ProductCardsSwiper>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductCardsSwiper>
      </div>
    </section>
  );
}
