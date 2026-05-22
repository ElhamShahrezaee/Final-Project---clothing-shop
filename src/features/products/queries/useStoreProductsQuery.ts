import { useQuery } from "@tanstack/react-query";
import { getStoreProducts } from "../api/getProducts";

export type StoreProductsQueryParams = {
  page?: number;
  limit?: number;
  search?: string | null;
  category?: string | null;
};

export function useStoreProductsQuery({
  page = 1,
  limit = 8,
  search,
  category,
}: StoreProductsQueryParams = {}) {
  const trimmedSearch = search?.trim() || undefined;
  const trimmedCategory = category?.trim() || undefined;

  return useQuery({
    queryKey: [
      "products",
      "store",
      page,
      limit,
      trimmedSearch ?? "",
      trimmedCategory ?? "",
    ],
    queryFn: () =>
      getStoreProducts({
        page,
        limit,
        search: trimmedSearch,
        category: trimmedCategory,
      }),
  });
}
