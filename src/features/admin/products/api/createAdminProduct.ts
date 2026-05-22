import axios from "axios";
import i18n from "../../../../i18n";
import { apiClient } from "../../../../lib/api/client";
import type { ApiResponse } from "../../../../lib/api/types";
import type { AdminProductFormValues } from "../types/productForm";
import { buildProductFormData, type ProductFormDataOptions } from "../utils/buildProductFormData";

export async function createAdminProduct(
  values: AdminProductFormValues,
  options: ProductFormDataOptions = {},
): Promise<void> {
  const formData = buildProductFormData(values, options);

  try {
    const { data } = await apiClient.post<ApiResponse<unknown>>(
      "/api/products",
      formData,
    );

    if (!data.success) {
      throw new Error(data.message || i18n.t("admin.apiErrors.createProduct"));
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as ApiResponse<unknown> | undefined)?.message ??
        i18n.t("admin.apiErrors.createProduct");
      throw new Error(message);
    }
    throw error;
  }
}
