import axios from "axios";
import { apiClient } from "../../../../lib/api/client";
import type { ApiResponse } from "../../../../lib/api/types";
import type {
  AdminProduct,
  AdminProductsFilters,
  AdminProductsResult,
} from "../types";
import { resolveProductImageUrl } from "../utils/resolveProductImageUrl";

interface RawProduct {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  brand?: string;
  rating?: number;
  numReviews?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductsListResponse {
  success: boolean;
  message?: string;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: RawProduct[];
}

function mapProduct(raw: RawProduct): AdminProduct {
  return {
    id: raw._id ?? raw.id ?? "",
    name: raw.name,
    description: raw.description,
    price: raw.price,
    images: (raw.images ?? []).map(resolveProductImageUrl),
    category: raw.category,
    stock: raw.stock,
    brand: raw.brand,
    rating: raw.rating ?? 0,
    numReviews: raw.numReviews ?? 0,
    isActive: raw.isActive ?? true,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export async function getAdminProducts(
  filters: AdminProductsFilters = {},
): Promise<AdminProductsResult> {
  const limit = filters.limit ?? 10;
  const params: Record<string, string | number> = {
    page: filters.page ?? 1,
    limit,
  };

  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.category?.trim()) params.category = filters.category.trim();
  if (filters.brand?.trim()) params.brand = filters.brand.trim();
  if (filters.isActive !== undefined) {
    params.isActive = filters.isActive ? "True" : "False";
  }
  if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
  if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
  if (filters.sort?.trim()) params.sort = filters.sort.trim();

  try {
    const { data } = await apiClient.get<ProductsListResponse>("/api/products", {
      params,
    });

    if (!data.success || !Array.isArray(data.data)) {
      throw new Error(data.message || "خطا در دریافت محصولات");
    }

    return {
      products: data.data.map(mapProduct),
      pagination: {
        page: data.page,
        limit,
        total: data.total,
        totalPages: data.pages,
      },
    };
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
