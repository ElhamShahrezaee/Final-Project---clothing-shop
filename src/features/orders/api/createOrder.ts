import { apiClient } from "../../../lib/api/client";
import type { ApiResponse } from "../../../lib/api/types";
import { extractApiError } from "../../profile/api/extractApiError";
import type { CreateOrderPayload, CreatedOrder } from "../types";

type RawCreatedOrder = {
  _id?: string;
  id?: string;
  status?: string;
};

export async function createOrder(payload: CreateOrderPayload): Promise<CreatedOrder> {
  try {
    const { data } = await apiClient.post<ApiResponse<RawCreatedOrder>>("/api/orders", payload);

    if (!data.success) {
      throw new Error(data.message || "Failed to create order");
    }

    const order = data.data;
    const orderId = order?._id ?? order?.id;
    if (!orderId) {
      throw new Error(data.message || "Failed to create order");
    }

    return {
      id: orderId,
      status: order?.status ?? "",
      message: data.message || "",
    };
  } catch (error) {
    throw new Error(extractApiError(error, "Failed to create order"));
  }
}
