import ProductCard from "../ProductCard/ProductCard";
import ProductCardSkeleton from "../ProductCard/ProductCardSkeleton";
import { useProductsQuery } from "../../../features/products/queries/useProductsQuery";
import { useAppLocale } from "../../../hooks/useAppLocale";

const normalize = (s: string) => s.trim().toLowerCase();

const wrapperClass = "px-4 lg:px-[50px]";
const gridClass =
  "grid grid-cols-2 gap-x-1 gap-y-[50px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

const ProductList = ({ search }: { search?: string | null }) => {
  const { isFa, dir, textAlign } = useAppLocale();
  const { data, isLoading, isError, error } = useProductsQuery();

  if (isLoading) {
    return (
      <div dir={dir} className={`${wrapperClass} ${gridClass}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={`${wrapperClass} text-sm text-red-600 ${textAlign}`}
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

  const products = data ?? [];
  const q = search ? normalize(search) : "";
  const filtered = q
    ? products.filter(
        (p) =>
          normalize(p.name).includes(q) ||
          normalize(p.brand).includes(q) ||
          normalize(p.category).includes(q),
      )
    : products;

  if (filtered.length === 0) {
    return (
      <p className={`${wrapperClass} text-sm text-gray-500 ${textAlign}`} dir={dir}>
        {isFa ? "محصولی یافت نشد." : "No products found."}
      </p>
    );
  }

  return (
    <div dir={dir} className={`${wrapperClass} ${gridClass}`}>
      {filtered.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
