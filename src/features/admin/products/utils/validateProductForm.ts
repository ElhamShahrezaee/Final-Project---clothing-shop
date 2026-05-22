import type { TFunction } from "i18next";
import type { AdminProductFormValues } from "../types/productForm";

export function validateProductForm(
  values: AdminProductFormValues,
  totalImageCount: number,
  t: TFunction,
): string | null {
  if (!values.name.trim()) return t("admin.validation.nameRequired");
  if (!values.description.trim()) return t("admin.validation.descriptionRequired");
  if (!values.category.trim()) return t("admin.validation.categoryRequired");
  if (!values.brand.trim()) return t("admin.validation.brandRequired");

  if (!Number.isFinite(values.price) || values.price < 0) {
    return t("admin.validation.priceInvalid");
  }

  if (!Number.isInteger(values.stock) || values.stock < 0) {
    return t("admin.validation.stockInvalid");
  }

  if (!Number.isFinite(values.rating) || values.rating < 0 || values.rating > 5) {
    return t("admin.validation.ratingInvalid");
  }

  if (!Number.isInteger(values.numReviews) || values.numReviews < 0) {
    return t("admin.validation.numReviewsInvalid");
  }

  if (totalImageCount < 1) {
    return t("admin.validation.imagesRequired");
  }

  return null;
}
