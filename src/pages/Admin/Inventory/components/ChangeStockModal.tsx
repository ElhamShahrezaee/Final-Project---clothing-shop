import { useEffect, useState } from "react";
import type { AdminProduct } from "../../../../features/admin/products/types";
import { useAdminLocale } from "../../../../hooks/useAdminLocale";
import Spinner from "../../../../components/common/Spinner/Spinner";

type ChangeStockModalProps = {
  product: AdminProduct;
  isSaving: boolean;
  errorMessage?: string | null;
  onSave: (stock: number) => void;
  onCancel: () => void;
};

export default function ChangeStockModal({
  product,
  isSaving,
  errorMessage,
  onSave,
  onCancel,
}: ChangeStockModalProps) {
  const { dir, textAlign } = useAdminLocale();
  const imageUrl = product.images[0];
  const [stockInput, setStockInput] = useState(String(product.stock));
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setStockInput(String(product.stock));
    setValidationError(null);
  }, [product]);

  const handleSave = () => {
    const trimmed = stockInput.trim();
    if (trimmed === "") {
      setValidationError("موجودی را وارد کنید.");
      return;
    }

    const stock = Number(trimmed);
    if (!Number.isInteger(stock) || stock < 0) {
      setValidationError("موجودی باید عدد صحیح بزرگ‌تر یا مساوی صفر باشد.");
      return;
    }

    setValidationError(null);
    onSave(stock);
  };

  const displayError = validationError ?? errorMessage;

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
        aria-labelledby="change-stock-title"
        className={`w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl ${textAlign}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="change-stock-title" className="text-lg font-semibold text-gray-900">
          تغییر موجودی
        </h2>
        <p className="mt-2 text-sm text-gray-600">موجودی جدید محصول را وارد کنید.</p>

        <div className="mt-5 flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-16 w-16 shrink-0 rounded-lg border border-gray-200 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-500">
              بدون تصویر
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-gray-900">{product.name}</p>
            <p className="mt-1 text-sm text-gray-600">
              موجودی فعلی:{" "}
              <span className="font-medium text-gray-900">{product.stock}</span>
            </p>
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="product-stock"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            موجودی جدید
          </label>
          <input
            id="product-stock"
            name="stock"
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={stockInput}
            onChange={(e) => setStockInput(e.target.value)}
            disabled={isSaving}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>

        {displayError && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {displayError}
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
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
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex min-w-[5.5rem] items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Spinner size="sm" className="border-white/40 border-t-white" />
                <span>در حال ذخیره...</span>
              </>
            ) : (
              "ذخیره"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
