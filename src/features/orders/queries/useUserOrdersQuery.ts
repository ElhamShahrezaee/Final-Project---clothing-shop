import { useQuery } from "@tanstack/react-query";
import { getUserOrders } from "../api/getUserOrders";
import { orderKeys } from "./orderKeys";
import type { UserOrdersFilters } from "../orderTypes";

export function useUserOrdersQuery(filters: UserOrdersFilters) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => getUserOrders(filters),
    staleTime: 30_000,
  });
}
