import { apiClient } from "../../../lib/api/client";
import { mapCart } from "./mapCart";
import type { Cart } from "../types";

type AddToCartResponse = {
  success: boolean;
  data: unknown;
  message?: string;
};

export async function addToCart(productId: string, quantity: number): Promise<Cart> {
  const res = await apiClient.post<AddToCartResponse>("/api/cart/add", {
    productId,
    quantity,
  });

  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to add to cart");
  }

  const raw = (res.data as any).data;
  return mapCart(raw);
}

