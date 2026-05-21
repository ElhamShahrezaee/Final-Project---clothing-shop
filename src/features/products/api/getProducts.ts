import axios from "axios";
import { apiClient } from "../../../lib/api/client";
import type { ApiResponse } from "../../../lib/api/types";
import type { Product } from "../types";
import { resolveProductImageUrl } from "../utils/resolveProductImageUrl";

interface RawProduct {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  brand?: string;
  rating?: number;
  isActive?: boolean;
}

interface ProductsListResponse {
  success: boolean;
  message?: string;
  data: RawProduct[];
}

function mapProduct(raw: RawProduct): Product {
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

export async function getProducts(): Promise<Product[]> {
  try {
    const { data } = await apiClient.get<ProductsListResponse>("/api/products", {
      params: {
        page: 1,
        limit: 12,
        isActive: "True",
      },
    });

    if (!data.success || !Array.isArray(data.data)) {
      throw new Error(data.message || "خطا در دریافت محصولات");
    }

    return data.data.map(mapProduct).filter((p) => p.images.length > 0);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as ApiResponse<unknown> | undefined)?.message ??
        "خطا در دریافت محصولات";
      throw new Error(message);
    }
    throw error;
  }
}
