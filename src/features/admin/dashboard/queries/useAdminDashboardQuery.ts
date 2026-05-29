import { useQuery } from "@tanstack/react-query";
import { fetchAllAdminOrders } from "../../orders/api/fetchAllAdminOrders";

export const adminDashboardKeys = {
  root: ["admin", "dashboard"] as const,
  orders: ["admin", "dashboard", "orders"] as const,
};

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: adminDashboardKeys.orders,
    queryFn: fetchAllAdminOrders,
    staleTime: 60_000,
  });
}
