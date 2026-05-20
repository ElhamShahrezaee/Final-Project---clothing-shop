import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { AdminProduct } from "../../../../features/admin/products/types";
import {
  defaultProductFormValues,
  type AdminProductFormValues,
} from "../../../../features/admin/products/types/productForm";
import { validateProductForm } from "../../../../features/admin/products/utils/validateProductForm";
import { useAdminLocale } from "../../../../hooks/useAdminLocale";
import Spinner from "../../../../components/common/Spinner/Spinner";

export type ProductFormModalMode = "create" | "edit";

type ProductFormModalProps = {
  mode: ProductFormModalMode;
  product?: AdminProduct;
  isSaving: boolean;
  errorMessage?: string | null;
  onSubmit: (
    values: AdminProductFormValues,
    imageFiles: File[],
    existingImageUrls: string[],
  ) => void;
  onCancel: () => void;
};

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:cursor-not-allowed disabled:bg-gray-50";

function productToFormValues(product: AdminProduct): AdminProductFormValues {
  return {
    name: product.name,
    description: product.description,
    category: product.category,
    brand: product.brand ?? "",
    price: product.price,
    stock: product.stock,
    rating: product.rating,
    numReviews: product.numReviews,
    isActive: product.isActive,
  };
}

export default function ProductFormModal({
  mode,
  product,
  isSaving,
  errorMessage,
  onSubmit,
  onCancel,
}: ProductFormModalProps) {
  const { dir, textAlign } = useAdminLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<AdminProductFormValues>(defaultProductFormValues);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && product) {
      setValues(productToFormValues(product));
      setExistingImageUrls(product.images);
    } else {
      setValues(defaultProductFormValues);
      setExistingImageUrls([]);
    }
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setValidationError(null);
  }, [mode, product]);

  useEffect(() => {
    const urls = newImageFiles.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [newImageFiles]);

  const updateField = <K extends keyof AdminProductFormValues>(
    key: K,
    value: AdminProductFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setNewImageFiles((prev) => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const totalImages = existingImageUrls.length + newImageFiles.length;
    const error = validateProductForm(values, totalImages);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    onSubmit(values, newImageFiles, existingImageUrls);
  };

  const displayError = validationError ?? errorMessage;
  const title = mode === "create" ? "اضافه کردن محصول جدید" : "ویرایش محصول";
  const submitLabel = mode === "create" ? "اضافه کردن محصول" : "ویرایش محصول";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        dir={dir}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
        className={`flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-gray-200 bg-white shadow-xl ${textAlign}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 border-b border-gray-200 px-6 py-4">
          <h2 id="product-form-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="product-name" className="mb-1 block text-sm font-medium text-gray-700">
                نام <span className="text-red-600">*</span>
              </label>
              <input
                id="product-name"
                type="text"
                required
                value={values.name}
                onChange={(e) => updateField("name", e.target.value)}
                disabled={isSaving}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="product-description"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                توضیحات <span className="text-red-600">*</span>
              </label>
              <textarea
                id="product-description"
                required
                rows={3}
                value={values.description}
                onChange={(e) => updateField("description", e.target.value)}
                disabled={isSaving}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="product-category"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                دسته‌بندی <span className="text-red-600">*</span>
              </label>
              <input
                id="product-category"
                type="text"
                required
                value={values.category}
                onChange={(e) => updateField("category", e.target.value)}
                disabled={isSaving}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="product-brand" className="mb-1 block text-sm font-medium text-gray-700">
                برند <span className="text-red-600">*</span>
              </label>
              <input
                id="product-brand"
                type="text"
                required
                value={values.brand}
                onChange={(e) => updateField("brand", e.target.value)}
                disabled={isSaving}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="product-price" className="mb-1 block text-sm font-medium text-gray-700">
                قیمت <span className="text-red-600">*</span>
              </label>
              <input
                id="product-price"
                type="number"
                min={0}
                step={1}
                required
                value={values.price}
                onChange={(e) => updateField("price", Number(e.target.value))}
                disabled={isSaving}
                dir="ltr"
                className={`${inputClass} text-left`}
              />
            </div>

            <div>
              <label htmlFor="product-stock" className="mb-1 block text-sm font-medium text-gray-700">
                موجودی <span className="text-red-600">*</span>
              </label>
              <input
                id="product-stock"
                type="number"
                min={0}
                step={1}
                required
                value={values.stock}
                onChange={(e) => updateField("stock", Number(e.target.value))}
                disabled={isSaving}
                dir="ltr"
                className={`${inputClass} text-left`}
              />
            </div>

            <div>
              <label htmlFor="product-rating" className="mb-1 block text-sm font-medium text-gray-700">
                امتیاز <span className="text-red-600">*</span>
              </label>
              <input
                id="product-rating"
                type="number"
                min={0}
                max={5}
                step={0.1}
                required
                value={values.rating}
                onChange={(e) => updateField("rating", Number(e.target.value))}
                disabled={isSaving}
                dir="ltr"
                className={`${inputClass} text-left`}
              />
            </div>

            <div>
              <label
                htmlFor="product-num-reviews"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                تعداد نظرات <span className="text-red-600">*</span>
              </label>
              <input
                id="product-num-reviews"
                type="number"
                min={0}
                step={1}
                required
                value={values.numReviews}
                onChange={(e) => updateField("numReviews", Number(e.target.value))}
                disabled={isSaving}
                dir="ltr"
                className={`${inputClass} text-left`}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="product-active" className="mb-1 block text-sm font-medium text-gray-700">
                وضعیت <span className="text-red-600">*</span>
              </label>
              <select
                id="product-active"
                value={values.isActive ? "active" : "inactive"}
                onChange={(e) => updateField("isActive", e.target.value === "active")}
                disabled={isSaving}
                className={inputClass}
              >
                <option value="active">فعال</option>
                <option value="inactive">غیرفعال</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                تصاویر <span className="text-red-600">*</span>
              </label>
              <p className="mb-2 text-xs text-gray-500">
                می‌توانید یک یا چند تصویر انتخاب کنید (حداقل یک تصویر برای ذخیره لازم است).
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                multiple
                onChange={handleImageSelect}
                disabled={isSaving}
                className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
              />

              {(existingImageUrls.length > 0 || newImagePreviews.length > 0) && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {existingImageUrls.map((url, index) => (
                    <div key={`existing-${url}`} className="relative">
                      <img
                        src={url}
                        alt=""
                        className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        disabled={isSaving}
                        className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white hover:bg-red-700"
                        aria-label="حذف تصویر"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {newImagePreviews.map((url, index) => (
                    <div key={`new-${url}`} className="relative">
                      <img
                        src={url}
                        alt=""
                        className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        disabled={isSaving}
                        className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white hover:bg-red-700"
                        aria-label="حذف تصویر"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {displayError && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {displayError}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex min-w-[8rem] items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Spinner size="sm" className="border-white/40 border-t-white" />
                <span>در حال ذخیره...</span>
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
