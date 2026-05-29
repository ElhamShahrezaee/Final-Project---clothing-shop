import { useQuery } from "@tanstack/react-query";
import { getAdminOrders } from "../api/getAdminOrders";
import { adminOrderKeys } from "./adminOrderKeys";
import type { AdminOrdersFilters } from "../types";

export function useAdminOrdersQuery(filters: AdminOrdersFilters) {
  return useQuery({
    queryKey: adminOrderKeys.list(filters),
    queryFn: () => getAdminOrders(filters),
  });
}
