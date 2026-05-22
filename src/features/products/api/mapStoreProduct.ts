import type { Product, ProductDetail } from "../types";
import { resolveProductImageUrl } from "../utils/resolveProductImageUrl";

export interface RawStoreProduct {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  category: string;
  brand?: string;
  rating?: number;
  stock?: number;
  numReviews?: number;
  isActive?: boolean;
}

export function mapStoreProduct(raw: RawStoreProduct): Product {
  return {
    id: raw._id ?? raw.id ?? "",
    name: raw.name,
    brand: raw.brand?.trim() || "—",
    price: raw.price,
    images: (raw.images ?? []).map(resolveProductImageUrl).filter(Boolean),
    rating: raw.rating ?? 0,
    category: raw.category,
  };
}

export function mapStoreProductDetail(raw: RawStoreProduct): ProductDetail {
  return {
    ...mapStoreProduct(raw),
    description: raw.description?.trim() || "",
    stock: raw.stock ?? 0,
    numReviews: raw.numReviews ?? 0,
  };
}
