import { apiClient } from "../../../lib/api/client";
import { mapCart } from "./mapCart";
import type { Cart } from "../types";

type UpdateCartResponse = {
  success: boolean;
  data: unknown;
  message?: string;
};

export async function updateCartItem(cartItemId: string, quantity: number): Promise<Cart> {
  const res = await apiClient.put<UpdateCartResponse>(`/api/cart/update/${cartItemId}`, {
    quantity,
  });

  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to update cart");
  }

  const raw = (res.data as any).data;
  return mapCart(raw);
}

