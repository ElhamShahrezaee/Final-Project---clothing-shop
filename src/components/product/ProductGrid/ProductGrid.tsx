import ProductCard from "../ProductCard/ProductCard";
import ProductCardSkeleton from "../ProductCard/ProductCardSkeleton";
import type { Product } from "../../../features/products/types";

const wrapperClass = "px-4 lg:px-[50px]";
const gridClass =
  "grid grid-cols-2 gap-x-1 gap-y-[50px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

type ProductGridProps = {
  products: Product[];
};

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={`${wrapperClass} ${gridClass}`}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export { wrapperClass as productGridWrapperClass };
