import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartKeys, getCartScope } from "../queries/cartKeys";
import { clearCart } from "../api/clearCart";
import { useUserAuth } from "../../../context/auth/useUserAuth";
import { clearGuestCart } from "../guest/guestCartStorage";

export function useClearCartMutation() {
  const qc = useQueryClient();
  const { isAuthenticated } = useUserAuth();

  return useMutation({
    mutationFn: () => {
      if (isAuthenticated) return clearCart();
      return Promise.resolve(clearGuestCart());
    },
    onSuccess: (cart) => {
      qc.setQueryData(cartKeys.scope(getCartScope(isAuthenticated)), cart);
    },
  });
}
