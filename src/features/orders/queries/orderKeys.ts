import type { UserOrdersFilters } from "../orderTypes";

export const orderKeys = {
  root: ["orders"] as const,
  list: (filters: UserOrdersFilters) => [...orderKeys.root, "list", filters] as const,
  detail: (orderId: string) => [...orderKeys.root, "detail", orderId] as const,
};
