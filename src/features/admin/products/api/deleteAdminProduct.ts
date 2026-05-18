import axios from "axios";
import { apiClient } from "../../../../lib/api/client";
import type { ApiResponse } from "../../../../lib/api/types";

export async function deleteAdminProduct(productId: string): Promise<void> {
  try {
    const { data } = await apiClient.delete<ApiResponse<unknown>>(
      `/api/products/${productId}`,
    );

    if (!data.success) {
      throw new Error(data.message || "خطا در حذف محصول");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as ApiResponse<unknown> | undefined)?.message ??
        "خطا در حذف محصول";
      throw new Error(message);
    }
    throw error;
  }
}
