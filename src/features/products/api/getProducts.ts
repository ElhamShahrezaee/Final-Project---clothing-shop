import axios from "axios";
import { apiClient } from "../../../lib/api/client";
import type { ApiResponse } from "../../../lib/api/types";
import type { Product, StoreProductsPagination, StoreProductsResult } from "../types";
import { mapStoreProduct, type RawStoreProduct } from "./mapStoreProduct";

interface ProductsListResponse {
  success: boolean;
  message?: string;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  data: RawStoreProduct[];
}

export type GetProductsParams = {
  page?: number;
  limit?: number;
  category?: string;
  excludeId?: string;
  search?: string;
  sort?: string;
};

export async function getStoreProducts(
  params: GetProductsParams = {},
): Promise<StoreProductsResult> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 12;

  const queryParams: Record<string, string | number> = {
    page,
    limit,
    isActive: "True",
  };

  if (params.category?.trim()) queryParams.category = params.category.trim();
  if (params.search?.trim()) queryParams.search = params.search.trim();
  if (params.sort?.trim()) queryParams.sort = params.sort.trim();

  try {
    const { data } = await apiClient.get<ProductsListResponse>("/api/products", {
      params: queryParams,
    });

    if (!data.success || !Array.isArray(data.data)) {
      throw new Error(data.message || "خطا در دریافت محصولات");
    }

    let products = data.data.map(mapStoreProduct).filter((p) => p.images.length > 0);

    if (params.excludeId) {
      products = products.filter((p) => p.id !== params.excludeId);
    }

    const total = data.total ?? products.length;
    const totalPages = data.pages ?? Math.max(1, Math.ceil(total / limit));

    const pagination: StoreProductsPagination = {
      page: data.page ?? page,
      limit,
      total,
      totalPages,
    };

    return { products, pagination };
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

/** @deprecated Use getStoreProducts – returns products only for simple callers */
export async function getProducts(params?: GetProductsParams): Promise<Product[]> {
  const result = await getStoreProducts(params);
  return result.products;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { products } = await getStoreProducts({ page: 1, limit: 100 });
  return [...products].sort((a, b) => b.price - a.price).slice(0, 4);
}
