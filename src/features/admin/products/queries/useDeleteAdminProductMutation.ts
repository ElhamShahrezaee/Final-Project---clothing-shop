import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminProduct } from "../api/deleteAdminProduct";

export function useDeleteAdminProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => deleteAdminProduct(productId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}
