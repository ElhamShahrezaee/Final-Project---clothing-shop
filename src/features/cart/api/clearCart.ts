import { apiClient } from "../../../lib/api/client";
import { mapCart } from "./mapCart";
import type { Cart } from "../types";

type ClearCartResponse = {
  success: boolean;
  data: unknown;
  message?: string;
};

export async function clearCart(): Promise<Cart> {
  const res = await apiClient.post<ClearCartResponse>("/api/cart/clear");

  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to clear cart");
  }

  const raw = (res.data as any).data;
  return mapCart(raw);
}

