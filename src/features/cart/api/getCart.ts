import { apiClient } from "../../../lib/api/client";
import { mapCart, type RawCart } from "./mapCart";
import type { Cart } from "../types";

type GetCartResponse = {
  success: boolean;
  data?: unknown;
  message?: string;
};

const emptyCart: Cart = {
  id: "",
  user: "",
  items: [],
  totalPrice: 0,
};

export async function getCart(): Promise<Cart> {
  const res = await apiClient.get<GetCartResponse>("/api/cart");

  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to fetch cart");
  }

  const raw = res.data.data;
  if (!raw || typeof raw !== "object") {
    return emptyCart;
  }

  return mapCart(raw as RawCart);
}
