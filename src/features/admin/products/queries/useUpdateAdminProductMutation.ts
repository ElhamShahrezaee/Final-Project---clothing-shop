import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateAdminProduct,
  type UpdateAdminProductPayload,
} from "../api/updateAdminProduct";

type UpdateAdminProductVariables = {
  productId: string;
  payload: UpdateAdminProductPayload;
};

export function useUpdateAdminProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, payload }: UpdateAdminProductVariables) =>
      updateAdminProduct(productId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}
