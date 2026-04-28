import ProductCard from "../ProductCard/ProductCard";
import { mockProducts } from "../../../features/products/data/mockProducts";

const normalize = (s: string) => s.trim().toLowerCase();

const ProductList = ({ search }: { search?: string | null }) => {
  const q = search ? normalize(search) : "";
  const filtered = q ? mockProducts.filter((p) => normalize(p.title).includes(q)) : mockProducts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {filtered.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default ProductList;
