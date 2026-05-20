import type { AdminProductFormValues } from "../types/productForm";

export function validateProductForm(
  values: AdminProductFormValues,
  totalImageCount: number,
): string | null {
  if (!values.name.trim()) return "نام محصول الزامی است.";
  if (!values.description.trim()) return "توضیحات محصول الزامی است.";
  if (!values.category.trim()) return "دسته‌بندی الزامی است.";
  if (!values.brand.trim()) return "برند الزامی است.";

  if (!Number.isFinite(values.price) || values.price < 0) {
    return "قیمت باید عددی بزرگ‌تر یا مساوی صفر باشد.";
  }

  if (!Number.isInteger(values.stock) || values.stock < 0) {
    return "موجودی باید عدد صحیح بزرگ‌تر یا مساوی صفر باشد.";
  }

  if (!Number.isFinite(values.rating) || values.rating < 0 || values.rating > 5) {
    return "امتیاز باید بین ۰ تا ۵ باشد.";
  }

  if (!Number.isInteger(values.numReviews) || values.numReviews < 0) {
    return "تعداد نظرات باید عدد صحیح بزرگ‌تر یا مساوی صفر باشد.";
  }

  if (totalImageCount < 1) {
    return "حداقل یک عکس الزامی است.";
  }

  return null;
}
