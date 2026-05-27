import type { Cart } from "../types";

export function getCartTotalQuantity(cart: Cart | undefined): number {
  return (cart?.items ?? []).reduce((sum, item) => sum + (item.quantity ?? 0), 0);
}

export function getCartUniqueItemsCount(cart: Cart | undefined): number {
  return (cart?.items ?? []).length;
}

export function getCartItemByProductId(cart: Cart | undefined, productId: string) {
  return (cart?.items ?? []).find((i) => i.product.id === productId);
}

