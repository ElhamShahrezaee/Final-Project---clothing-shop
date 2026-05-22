import ProductGrid, {
  ProductGridSkeleton,
  productGridWrapperClass,
} from "../ProductGrid/ProductGrid";
import { useStoreProductsQuery } from "../../../features/products/queries/useStoreProductsQuery";
import { useAppLocale } from "../../../hooks/useAppLocale";

type ProductListProps = {
  search?: string | null;
  category?: string | null;
  page?: number;
  limit?: number;
};

const ProductList = ({
  search,
  category,
  page = 1,
  limit = 12,
}: ProductListProps) => {
  const { isFa, dir, textAlign } = useAppLocale();
  const { data, isLoading, isError, error } = useStoreProductsQuery({
    page,
    limit,
    search,
    category,
  });

  if (isLoading) {
    return <ProductGridSkeleton count={limit} />;
  }

  if (isError) {
    return (
      <div
        className={`${productGridWrapperClass} text-sm text-red-600 ${textAlign}`}
        dir={dir}
        role="alert"
      >
        {error instanceof Error
          ? error.message
          : isFa
            ? "خطا در بارگذاری محصولات"
            : "Failed to load products"}
      </div>
    );
  }

  const products = data?.products ?? [];

  if (products.length === 0) {
    return (
      <p className={`${productGridWrapperClass} text-sm text-gray-500 ${textAlign}`} dir={dir}>
        {isFa ? "محصولی یافت نشد." : "No products found."}
      </p>
    );
  }

  return (
    <div dir={dir} className={productGridWrapperClass}>
      <ProductGrid products={products} />
    </div>
  );
};

export default ProductList;
