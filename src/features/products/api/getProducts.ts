import axios from "axios";
import { apiClient } from "../../../lib/api/client";
import type { ApiResponse } from "../../../lib/api/types";
import type { Product } from "../types";
import { mapStoreProduct, type RawStoreProduct } from "./mapStoreProduct";

interface ProductsListResponse {
  success: boolean;
  message?: string;
  data: RawStoreProduct[];
}

export type GetProductsParams = {
  category?: string;
  limit?: number;
  excludeId?: string;
};

export async function getProducts(params?: GetProductsParams): Promise<Product[]> {
  const limit = params?.limit ?? 12;

  try {
    const queryParams: Record<string, string | number> = {
      page: 1,
      limit,
      isActive: "True",
    };

    if (params?.category?.trim()) {
      queryParams.category = params.category.trim();
    }

    const { data } = await apiClient.get<ProductsListResponse>("/api/products", {
      params: queryParams,
    });

    if (!data.success || !Array.isArray(data.data)) {
      throw new Error(data.message || "خطا در دریافت محصولات");
    }

    let products = data.data.map(mapStoreProduct).filter((p) => p.images.length > 0);

    if (params?.excludeId) {
      products = products.filter((p) => p.id !== params.excludeId);
    }

    return products;
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
