import axios from "axios";
import i18n from "../../../../i18n";
import { apiClient } from "../../../../lib/api/client";
import type { ApiResponse } from "../../../../lib/api/types";
import type { OrderStatus } from "../types";

type UpdateOrderStatusPayload = {
  status: OrderStatus;
};

export async function updateAdminOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<void> {
  const payload: UpdateOrderStatusPayload = { status };

  try {
    const { data } = await apiClient.put<ApiResponse<unknown>>(
      `/api/orders/${orderId}/status`,
      payload,
    );

    if (!data.success) {
      throw new Error(data.message || i18n.t("admin.apiErrors.updateOrderStatus"));
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as ApiResponse<unknown> | undefined)?.message ??
        i18n.t("admin.apiErrors.updateOrderStatus");
      throw new Error(message);
    }
    throw error;
  }
}
