import type { AdminProduct } from "../../../../features/admin/products/types";
import { useAdminLocale } from "../../../../hooks/useAdminLocale";
import Spinner from "../../../../components/common/Spinner/Spinner";

type DeleteProductModalProps = {
  product: AdminProduct;
  isDeleting: boolean;
  errorMessage?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteProductModal({
  product,
  isDeleting,
  errorMessage,
  onConfirm,
  onCancel,
}: DeleteProductModalProps) {
  const { dir, textAlign } = useAdminLocale();
  const imageUrl = product.images[0];

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
        aria-labelledby="delete-product-title"
        className={`w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl ${textAlign}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="delete-product-title"
          className="text-lg font-semibold text-gray-900"
        >
          حذف محصول
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          آیا می‌خواهید این محصول را حذف کنید؟
        </p>

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
            {product.brand && (
              <p className="mt-0.5 truncate text-xs text-gray-500">{product.brand}</p>
            )}
            <p className="mt-0.5 text-xs text-gray-500">{product.category}</p>
          </div>
        </div>

        {errorMessage && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex min-w-[5.5rem] items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <Spinner size="sm" className="border-white/40 border-t-white" />
                <span>در حال حذف...</span>
              </>
            ) : (
              "حذف"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
