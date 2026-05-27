import type { Cart } from "../types";
import { mapStoreProduct, type RawStoreProduct } from "../../products/api/mapStoreProduct";

type RawCartItem = {
  _id?: string;
  id?: string;
  product: RawStoreProduct | string;
  quantity: number;
};

export type RawCart = {
  _id?: string;
  id?: string;
  user: string;
  items: RawCartItem[];
  totalPrice: number;
};

export function mapCart(raw: RawCart): Cart {
  return {
    id: raw._id ?? raw.id ?? "",
    user: raw.user,
    items: (raw.items ?? [])
      .map((item) => {
        const rawProduct = typeof item.product === "string" ? null : item.product;
        if (!rawProduct) return null;

        return {
          id: item._id ?? item.id ?? "",
          product: {
            ...mapStoreProduct(rawProduct),
            stock: rawProduct.stock,
          },
          quantity: item.quantity ?? 0,
        };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x)),
    totalPrice: raw.totalPrice ?? 0,
  };
}

