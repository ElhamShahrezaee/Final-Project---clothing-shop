import { apiClient } from "../../../lib/api/client";
import type { ApiResponse } from "../../../lib/api/types";
import { extractApiError } from "../../profile/api/extractApiError";
import { mapUserOrder, type RawUserOrder } from "./mapUserOrder";
import type { UserOrder } from "../orderTypes";

export async function getUserOrderById(orderId: string): Promise<UserOrder> {
  try {
    const { data } = await apiClient.get<ApiResponse<RawUserOrder>>(`/api/orders/${orderId}`);

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to load order");
    }

    return mapUserOrder(data.data);
  } catch (error) {
    throw new Error(extractApiError(error, "Failed to load order"));
  }
}
