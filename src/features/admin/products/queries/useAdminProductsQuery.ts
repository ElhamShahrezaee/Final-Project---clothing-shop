import { useQuery } from "@tanstack/react-query";
import { getAdminProducts } from "../api/getAdminProducts";
import type { AdminProductsFilters } from "../types";

function buildQueryKey(filters: AdminProductsFilters) {
  return [
    "admin",
    "products",
    filters.page ?? 1,
    filters.limit ?? 10,
    filters.search?.trim() ?? "",
    filters.category?.trim() ?? "",
    filters.isActive === undefined ? "all" : String(filters.isActive),
    filters.brand?.trim() ?? "",
    filters.sort?.trim() ?? "",
  ] as const;
}

export function useAdminProductsQuery(filters: AdminProductsFilters) {
  return useQuery({
    queryKey: buildQueryKey(filters),
    queryFn: () => getAdminProducts(filters),
  });
}
