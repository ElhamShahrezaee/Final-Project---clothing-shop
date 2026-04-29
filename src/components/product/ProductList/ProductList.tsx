import ProductCard from "../ProductCard/ProductCard";
import ProductCardSkeleton from "../ProductCard/ProductCardSkeleton";
import { useProductsQuery } from "../../../features/products/queries/useProductsQuery";

const normalize = (s: string) => s.trim().toLowerCase();

const ProductList = ({ search }: { search?: string | null }) => {
  const { data, isLoading, isError } = useProductsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-red-600">
        Something went wrong while loading products.
      </div>
    );
  }

  const products = data ?? [];
  const q = search ? normalize(search) : "";
  const filtered = q
    ? products.filter((p) => normalize(p.title).includes(q))
    : products;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {filtered.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default ProductList;
