import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeCartItem } from "../api/removeCartItem";
import { cartKeys, getCartScope } from "../queries/cartKeys";
import { useUserAuth } from "../../../context/auth/useUserAuth";
import { removeGuestCartItem } from "../guest/guestCartStorage";

export function useRemoveCartItemMutation() {
  const qc = useQueryClient();
  const { isAuthenticated } = useUserAuth();

  return useMutation({
    mutationFn: ({ cartItemId }: { cartItemId: string }) => {
      if (isAuthenticated) return removeCartItem(cartItemId);
      return Promise.resolve(removeGuestCartItem(cartItemId));
    },
    onSuccess: (cart) => {
      qc.setQueryData(cartKeys.scope(getCartScope(isAuthenticated)), cart);
    },
  });
}
