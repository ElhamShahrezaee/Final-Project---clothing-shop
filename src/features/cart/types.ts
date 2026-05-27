import type { Product } from "../products/types";

export type CartProduct = Product & {
  stock?: number;
};

export type CartItem = {
  id: string;
  product: CartProduct;
  quantity: number;
};

export type Cart = {
  id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
};

