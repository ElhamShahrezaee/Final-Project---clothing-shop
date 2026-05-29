import { useQuery } from "@tanstack/react-query";
import { getUserOrderById } from "../api/getUserOrderById";
import { orderKeys } from "./orderKeys";

export function useUserOrderQuery(orderId: string | undefined) {
  return useQuery({
    queryKey: orderKeys.detail(orderId ?? ""),
    queryFn: () => getUserOrderById(orderId!),
    enabled: Boolean(orderId),
    staleTime: 60_000,
  });
}
