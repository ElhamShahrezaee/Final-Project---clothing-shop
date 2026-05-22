import { useQuery } from "@tanstack/react-query";
import { getStoreProducts } from "../api/getProducts";

export function useProductsQuery() {
  return useQuery({
    queryKey: ["products", "legacy-list"],
    queryFn: () => getStoreProducts({ page: 1, limit: 12 }),
  });
}

