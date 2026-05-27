import type { Cart, CartItem, CartProduct } from "../types";

const KEY = "guest_cart_v1";

function calcTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity * (i.product.price ?? 0), 0);
}

export function getGuestCart(): Cart {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return { id: "guest", user: "guest", items: [], totalPrice: 0 };
    }
    const parsed = JSON.parse(raw) as Cart;
    const items = (parsed.items ?? []).filter(Boolean);
    return {
      id: "guest",
      user: "guest",
      items,
      totalPrice: calcTotal(items),
    };
  } catch {
    return { id: "guest", user: "guest", items: [], totalPrice: 0 };
  }
}

export function setGuestCart(cart: Cart) {
  const normalized: Cart = {
    id: "guest",
    user: "guest",
    items: cart.items ?? [],
    totalPrice: calcTotal(cart.items ?? []),
  };
  localStorage.setItem(KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event("guest-cart-changed"));
}

export function upsertGuestCartItem(product: CartProduct, quantity: number) {
  const cart = getGuestCart();
  const safeQty = Math.max(0, quantity);
  const existing = cart.items.find((i) => i.product.id === product.id);

  let nextItems: CartItem[];
  if (safeQty <= 0) {
    nextItems = cart.items.filter((i) => i.product.id !== product.id);
  } else if (!existing) {
    nextItems = [...cart.items, { id: product.id, product, quantity: safeQty }];
  } else {
    nextItems = cart.items.map((i) =>
      i.product.id === product.id ? { ...i, quantity: safeQty } : i,
    );
  }

  setGuestCart({ ...cart, items: nextItems });
  return getGuestCart();
}

export function updateGuestCartItemQuantity(cartItemId: string, quantity: number) {
  const cart = getGuestCart();
  const nextQty = Math.max(0, quantity);
  const nextItems =
    nextQty <= 0
      ? cart.items.filter((i) => i.id !== cartItemId)
      : cart.items.map((i) => (i.id === cartItemId ? { ...i, quantity: nextQty } : i));

  setGuestCart({ ...cart, items: nextItems });
  return getGuestCart();
}

export function removeGuestCartItem(cartItemId: string) {
  const cart = getGuestCart();
  const nextItems = cart.items.filter((i) => i.id !== cartItemId);
  setGuestCart({ ...cart, items: nextItems });
  return getGuestCart();
}

export function clearGuestCart() {
  setGuestCart({ id: "guest", user: "guest", items: [], totalPrice: 0 });
  return getGuestCart();
}

