import { useQuery } from "@tanstack/react-query";
import { getAdminOrders } from "../api/getAdminOrders";
import type { AdminOrdersFilters } from "../types";

function buildQueryKey(filters: AdminOrdersFilters) {
  return [
    "admin",
    "orders",
    filters.page ?? 1,
    filters.limit ?? 10,
    filters.status ?? "all",
  ] as const;
}

export function useAdminOrdersQuery(filters: AdminOrdersFilters) {
  return useQuery({
    queryKey: buildQueryKey(filters),
    queryFn: () => getAdminOrders(filters),
  });
}
