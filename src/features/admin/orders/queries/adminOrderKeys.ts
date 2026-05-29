import type { AdminOrdersFilters } from "../types";

export const adminOrderKeys = {
  root: ["admin", "orders"] as const,
  list: (filters: AdminOrdersFilters) =>
    [
      ...adminOrderKeys.root,
      filters.page ?? 1,
      filters.limit ?? 10,
      filters.status ?? "all",
    ] as const,
};
