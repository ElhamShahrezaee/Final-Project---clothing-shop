import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../api/getProductById";

export function useProductQuery(id: string | undefined) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    enabled: Boolean(id),
  });
}
