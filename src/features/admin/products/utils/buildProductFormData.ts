import type { AdminProductFormValues } from "../types/productForm";
import { toStoredProductImagePath } from "./toStoredProductImagePath";

export type ProductFormDataOptions = {
  imageFiles?: File[];
  existingImageUrls?: string[];
  /** When true, sends kept image paths so the server can replace the images array. */
  isUpdate?: boolean;
};

export function buildProductFormData(
  values: AdminProductFormValues,
  options: ProductFormDataOptions = {},
): FormData {
  const formData = new FormData();

  formData.append("name", values.name.trim());
  formData.append("description", values.description.trim());
  formData.append("price", String(values.price));
  formData.append("category", values.category.trim());
  formData.append("stock", String(values.stock));
  formData.append("brand", values.brand.trim());
  formData.append("rating", String(values.rating));
  formData.append("numReviews", String(values.numReviews));
  formData.append("isActive", values.isActive ? "true" : "false");

  if (options.isUpdate) {
    const keptPaths = (options.existingImageUrls ?? []).map(toStoredProductImagePath);

    formData.append("currentImages", JSON.stringify(keptPaths));
    formData.append("keepImages", JSON.stringify(keptPaths));

    keptPaths.forEach((path) => {
      formData.append("existingImages", path);
    });
  }

  options.imageFiles?.forEach((file) => {
    formData.append("images", file);
  });

  return formData;
}
