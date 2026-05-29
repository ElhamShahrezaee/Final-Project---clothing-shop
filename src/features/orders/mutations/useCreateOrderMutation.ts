import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "../api/createOrder";
import { EMPTY_CART } from "../../cart/constants";
import { cartKeys, getCartScope } from "../../cart/queries/cartKeys";
import { useUserAuth } from "../../../context/auth/useUserAuth";
import type { CreateOrderPayload } from "../types";

export function useCreateOrderMutation() {
  const qc = useQueryClient();
  const { isAuthenticated } = useUserAuth();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: async () => {
      const scope = getCartScope(isAuthenticated);
      qc.setQueryData(cartKeys.scope(scope), EMPTY_CART);
      await qc.invalidateQueries({ queryKey: cartKeys.root });
      await qc.refetchQueries({ queryKey: cartKeys.scope(scope) });
    },
  });
}
