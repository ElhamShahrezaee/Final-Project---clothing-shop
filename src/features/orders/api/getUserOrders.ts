import { apiClient } from "../../../lib/api/client";
import { extractApiError } from "../../profile/api/extractApiError";
import { mapUserOrder, type RawUserOrder } from "./mapUserOrder";
import type { UserOrdersFilters, UserOrdersResult } from "../orderTypes";

type UserOrdersListResponse = {
  success: boolean;
  message?: string;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  data?: RawUserOrder[];
};

export async function getUserOrders(
  filters: UserOrdersFilters = {},
): Promise<UserOrdersResult> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;

  try {
    const { data } = await apiClient.get<UserOrdersListResponse>("/api/orders", {
      params: { page, limit },
    });

    if (!data.success || !Array.isArray(data.data)) {
      throw new Error(data.message || "Failed to load orders");
    }

    const total = data.total ?? data.count ?? data.data.length;
    const totalPages = data.pages ?? Math.max(1, Math.ceil(total / limit));
    const currentPage = data.page ?? page;

    return {
      orders: data.data.map(mapUserOrder),
      pagination: {
        page: currentPage,
        limit,
        total,
        totalPages,
      },
    };
  } catch (error) {
    throw new Error(extractApiError(error, "Failed to load orders"));
  }
}
