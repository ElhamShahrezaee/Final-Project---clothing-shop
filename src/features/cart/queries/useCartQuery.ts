import { useQuery } from "@tanstack/react-query";
import { getCart } from "../api/getCart";
import { cartKeys, type CartScope } from "./cartKeys";
import { useUserAuth } from "../../../context/auth/useUserAuth";
import { getGuestCart } from "../guest/guestCartStorage";

async function fetchCart(scope: CartScope) {
  if (scope === "user") return getCart();
  return getGuestCart();
}

export function useCartQuery() {
  const { isAuthenticated, isLoading: isAuthLoading } = useUserAuth();
  const scope: CartScope = isAuthenticated ? "user" : "guest";

  return useQuery({
    queryKey: cartKeys.scope(scope),
    queryFn: () => fetchCart(scope),
    enabled: !isAuthLoading,
    staleTime: 10_000,
    retry: 2,
  });
}
