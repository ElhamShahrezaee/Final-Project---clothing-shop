import { useQuery } from "@tanstack/react-query";
import { getFeaturedProducts } from "../api/getProducts";

export function useFeaturedProductsQuery() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: getFeaturedProducts,
  });
}
