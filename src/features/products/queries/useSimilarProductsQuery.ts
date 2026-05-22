import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/getProducts";

export function useSimilarProductsQuery(
  category: string | undefined,
  excludeId: string | undefined,
) {
  return useQuery({
    queryKey: ["products", "similar", category, excludeId],
    queryFn: () =>
      getProducts({
        category,
        limit: 20,
        excludeId,
      }),
    enabled: Boolean(category),
  });
}
