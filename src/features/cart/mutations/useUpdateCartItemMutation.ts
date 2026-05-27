import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartItem } from "../api/updateCartItem";
import { cartKeys, getCartScope } from "../queries/cartKeys";
import { useUserAuth } from "../../../context/auth/useUserAuth";
import { updateGuestCartItemQuantity } from "../guest/guestCartStorage";

export function useUpdateCartItemMutation() {
  const qc = useQueryClient();
  const { isAuthenticated } = useUserAuth();

  return useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => {
      if (isAuthenticated) return updateCartItem(cartItemId, quantity);
      return Promise.resolve(updateGuestCartItemQuantity(cartItemId, quantity));
    },
    onSuccess: (cart) => {
      qc.setQueryData(cartKeys.scope(getCartScope(isAuthenticated)), cart);
    },
  });
}
