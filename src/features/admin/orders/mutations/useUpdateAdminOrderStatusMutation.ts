import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminOrderStatus } from "../api/updateAdminOrderStatus";
import { adminOrderKeys } from "../queries/adminOrderKeys";
import type { OrderStatus } from "../types";

type UpdateVariables = {
  orderId: string;
  status: OrderStatus;
};

export function useUpdateAdminOrderStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: UpdateVariables) =>
      updateAdminOrderStatus(orderId, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminOrderKeys.root });
    },
  });
}
