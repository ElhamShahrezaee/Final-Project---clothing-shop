import axios from "axios";
import { apiClient } from "../../../../lib/api/client";
import type { ApiResponse } from "../../../../lib/api/types";
import type { AdminProductFormValues } from "../types/productForm";
import { buildProductFormData, type ProductFormDataOptions } from "../utils/buildProductFormData";

export type QuickUpdateAdminProductPayload = {
  name: string;
  price: number;
  stock: number;
};

export async function updateAdminProduct(
  productId: string,
  values: AdminProductFormValues,
  options: ProductFormDataOptions = {},
): Promise<void> {
  const formData = buildProductFormData(values, { ...options, isUpdate: true });

  try {
    const { data } = await apiClient.put<ApiResponse<unknown>>(
      `/api/products/${productId}`,
      formData,
    );

    if (!data.success) {
      throw new Error(data.message || "خطا در بروزرسانی محصول");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as ApiResponse<unknown> | undefined)?.message ??
        "خطا در بروزرسانی محصول";
      throw new Error(message);
    }
    throw error;
  }
}

export async function quickUpdateAdminProduct(
  productId: string,
  payload: QuickUpdateAdminProductPayload,
): Promise<void> {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("price", String(payload.price));
  formData.append("stock", String(payload.stock));

  try {
    const { data } = await apiClient.put<ApiResponse<unknown>>(
      `/api/products/${productId}`,
      formData,
    );

    if (!data.success) {
      throw new Error(data.message || "خطا در بروزرسانی محصول");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as ApiResponse<unknown> | undefined)?.message ??
        "خطا در بروزرسانی محصول";
      throw new Error(message);
    }
    throw error;
  }
}
