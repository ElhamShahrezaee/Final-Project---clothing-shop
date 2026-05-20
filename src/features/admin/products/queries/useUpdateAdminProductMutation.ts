import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  quickUpdateAdminProduct,
  updateAdminProduct,
  type QuickUpdateAdminProductPayload,
} from "../api/updateAdminProduct";
import type { AdminProductFormValues } from "../types/productForm";
import type { ProductFormDataOptions } from "../utils/buildProductFormData";

type FullUpdateVariables = {
  productId: string;
  values: AdminProductFormValues;
  options?: ProductFormDataOptions;
};

type QuickUpdateVariables = {
  productId: string;
  payload: QuickUpdateAdminProductPayload;
};

export function useUpdateAdminProductMutation() {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
  };

  const fullUpdate = useMutation({
    mutationFn: ({ productId, values, options }: FullUpdateVariables) =>
      updateAdminProduct(productId, values, options),
    onSuccess: invalidate,
  });

  const quickUpdate = useMutation({
    mutationFn: ({ productId, payload }: QuickUpdateVariables) =>
      quickUpdateAdminProduct(productId, payload),
    onSuccess: invalidate,
  });

  return {
    mutateAsync: fullUpdate.mutateAsync,
    quickMutateAsync: quickUpdate.mutateAsync,
    isPending: fullUpdate.isPending || quickUpdate.isPending,
  };
}
