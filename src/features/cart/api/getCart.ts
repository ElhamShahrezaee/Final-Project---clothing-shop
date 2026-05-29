import { apiClient } from "../../../lib/api/client";
import { mapCart, type RawCart } from "./mapCart";
import { EMPTY_CART } from "../constants";
import type { Cart } from "../types";

type GetCartResponse = {
  success: boolean;
  data?: unknown;
  message?: string;
};

export async function getCart(): Promise<Cart> {
  const res = await apiClient.get<GetCartResponse>("/api/cart");

  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to fetch cart");
  }

  const raw = res.data.data;
  if (!raw || typeof raw !== "object") {
    return EMPTY_CART;
  }

  return mapCart(raw as RawCart);
}
