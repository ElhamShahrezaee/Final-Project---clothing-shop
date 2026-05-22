import axios from "axios";
import { apiClient } from "../../../lib/api/client";
import type { ApiResponse } from "../../../lib/api/types";
import type { ProductDetail } from "../types";
import { mapStoreProductDetail, type RawStoreProduct } from "./mapStoreProduct";

interface ProductByIdResponse {
  success: boolean;
  message?: string;
  data: RawStoreProduct;
}

export async function getProductById(id: string): Promise<ProductDetail | null> {
  try {
    const { data } = await apiClient.get<ProductByIdResponse>(`/api/products/${id}`);

    if (!data.success || !data.data) {
      return null;
    }

    return mapStoreProductDetail(data.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as ApiResponse<unknown> | undefined)?.message ??
        "خطا در دریافت محصول";
      throw new Error(message);
    }
    throw error;
  }
}
