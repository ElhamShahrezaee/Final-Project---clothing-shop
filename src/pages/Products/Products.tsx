import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProductGrid, {
  ProductGridSkeleton,
  productGridWrapperClass,
} from "../../components/product/ProductGrid/ProductGrid";
import StoreProductPagination from "../../components/product/StoreProductPagination/StoreProductPagination";
import { useStoreProductsQuery } from "../../features/products/queries/useStoreProductsQuery";
import { useAppLocale } from "../../hooks/useAppLocale";

const PAGE_SIZE = 12;

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isFa, dir, textAlign } = useAppLocale();

  const query = new URLSearchParams(location.search);
  const search = query.get("search");
  const category = query.get("category");
  const page = Math.max(1, Number(query.get("page")) || 1);

  const { data, isLoading, isError, error } = useStoreProductsQuery({
    page,
    limit: PAGE_SIZE,
    search,
    category,
  });

  const products = data?.products ?? [];
  const pagination = data?.pagination;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [page, search, category]);

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams();
    if (search?.trim()) params.set("search", search.trim());
    if (category?.trim()) params.set("category", category.trim());
    if (nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    navigate(qs ? `/products?${qs}` : "/products");
  };

  return (
    <div dir={dir} className={`py-6 ${textAlign}`}>
      {!search && !category && (
        <div className="mb-4 px-4 lg:px-[50px]">
          <h1 className="text-2xl font-light tracking-wide">{t("products.title")}</h1>
        </div>
      )}

      {isLoading && <ProductGridSkeleton count={PAGE_SIZE} />}

      {isError && (
        <p
          className={`${productGridWrapperClass} text-sm text-red-600`}
          role="alert"
        >
          {error instanceof Error
            ? error.message
            : isFa
              ? "خطا در بارگذاری محصولات"
              : "Failed to load products"}
        </p>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <p className={`${productGridWrapperClass} text-sm text-gray-500`}>
          {isFa ? "محصولی یافت نشد." : "No products found."}
        </p>
      )}

      {!isLoading && !isError && products.length > 0 && (
        <div className={productGridWrapperClass}>
          <ProductGrid products={products} />
        </div>
      )}

      {pagination && pagination.total > 0 && (
        <div className="mt-10 px-4 lg:px-[50px]">
          <StoreProductPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={goToPage}
          />
        </div>
      )}
    </div>
  );
};

export default Products;
