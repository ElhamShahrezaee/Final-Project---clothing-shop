import axios from "axios";
import i18n from "../../../../i18n";
import { apiClient } from "../../../../lib/api/client";
import type { ApiResponse } from "../../../../lib/api/types";
import { resolveProductImageUrl } from "../../products/utils/resolveProductImageUrl";
import type {
  AdminOrder,
  AdminOrdersFilters,
  AdminOrdersResult,
  OrderStatus,
} from "../types";

interface RawOrderItem {
  _id?: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface RawOrder {
  _id?: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
  };
  orderItems: RawOrderItem[];
  totalPrice: number;
  paymentMethod: string;
  status: OrderStatus;
  isPaid: boolean;
}

interface OrdersListResponse {
  success: boolean;
  message?: string;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: RawOrder[];
}

function mapOrder(raw: RawOrder): AdminOrder {
  return {
    id: raw._id ?? "",
    shippingAddress: raw.shippingAddress,
    orderItems: raw.orderItems.map((item) => ({
      id: item._id ?? "",
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image ? resolveProductImageUrl(item.image) : "",
    })),
    totalPrice: raw.totalPrice,
    paymentMethod: raw.paymentMethod,
    status: raw.status,
    isPaid: raw.isPaid,
  };
}

export async function getAdminOrders(
  filters: AdminOrdersFilters = {},
): Promise<AdminOrdersResult> {
  const limit = filters.limit ?? 10;
  const params: Record<string, string | number> = {
    page: filters.page ?? 1,
    limit,
  };

  if (filters.status) params.status = filters.status;

  try {
    const { data } = await apiClient.get<OrdersListResponse>(
      "/api/orders/admin/all",
      { params },
    );

    if (!data.success || !Array.isArray(data.data)) {
      throw new Error(data.message || i18n.t("admin.apiErrors.fetchOrders"));
    }

    return {
      orders: data.data.map(mapOrder),
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
        i18n.t("admin.apiErrors.fetchOrders");
      throw new Error(message);
    }
    throw error;
  }
}
