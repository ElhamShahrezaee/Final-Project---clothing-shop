import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdminProduct } from "../api/createAdminProduct";
import type { AdminProductFormValues } from "../types/productForm";
import type { ProductFormDataOptions } from "../utils/buildProductFormData";

type CreateAdminProductVariables = {
  values: AdminProductFormValues;
  options?: ProductFormDataOptions;
};

export function useCreateAdminProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ values, options }: CreateAdminProductVariables) =>
      createAdminProduct(values, options),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}
