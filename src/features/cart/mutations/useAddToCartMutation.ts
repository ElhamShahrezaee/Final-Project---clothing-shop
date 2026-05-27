import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "../api/addToCart";
import { cartKeys, getCartScope } from "../queries/cartKeys";
import { useUserAuth } from "../../../context/auth/useUserAuth";
import type { CartProduct } from "../types";
import { upsertGuestCartItem } from "../guest/guestCartStorage";

export function useAddToCartMutation() {
  const qc = useQueryClient();
  const { isAuthenticated } = useUserAuth();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
      product,
    }: {
      productId: string;
      quantity: number;
      product?: CartProduct;
    }) => {
      if (isAuthenticated) return addToCart(productId, quantity);
      if (!product) throw new Error("Missing product for guest cart");
      return upsertGuestCartItem(product, quantity);
    },
    onSuccess: (cart) => {
      qc.setQueryData(cartKeys.scope(getCartScope(isAuthenticated)), cart);
    },
  });
}
