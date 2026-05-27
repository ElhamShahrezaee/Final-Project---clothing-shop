import { apiClient } from "../../../lib/api/client";
import { mapCart } from "./mapCart";
import type { Cart } from "../types";

type RemoveCartResponse = {
  success: boolean;
  data: unknown;
  message?: string;
};

export async function removeCartItem(cartItemId: string): Promise<Cart> {
  const res = await apiClient.delete<RemoveCartResponse>(`/api/cart/remove/${cartItemId}`);

  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to remove cart item");
  }

  const raw = (res.data as any).data;
  return mapCart(raw);
}

