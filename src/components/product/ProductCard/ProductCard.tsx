import type { Product } from "../../../features/products/types";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.title}
          className="h-[380px] w-full object-cover group-hover:scale-105 transition duration-500"
        />
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium tracking-wide uppercase">
          {product.title}
        </h3>

        <p className="text-sm text-gray-600">
          {product.price.toLocaleString()} $
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
