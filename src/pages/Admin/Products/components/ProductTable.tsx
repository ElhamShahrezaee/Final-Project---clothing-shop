import type { AdminProduct } from "../../../../features/admin/products/types";
import { formatPrice } from "../../../../features/admin/products/utils/formatPrice";
import { useAdminLocale } from "../../../../hooks/useAdminLocale";
import Spinner from "../../../../components/common/Spinner/Spinner";

export type ProductTableVariant = "manage" | "inventory";

type ProductTableProps = {
  products: AdminProduct[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  variant?: ProductTableVariant;
  onEdit?: (product: AdminProduct) => void;
  onDelete?: (product: AdminProduct) => void;
  onChangeStock?: (product: AdminProduct) => void;
  onChangePrice?: (product: AdminProduct) => void;
};

const thClass = "px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600";
const tdClass = "px-3 py-3 text-sm text-gray-800";

export default function ProductTable({
  products,
  isLoading,
  isError,
  errorMessage,
  variant = "manage",
  onEdit,
  onDelete,
  onChangeStock,
  onChangePrice,
}: ProductTableProps) {
  const { isFa, textAlign } = useAdminLocale();

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[12rem] items-center justify-center p-6">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="m-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
        {errorMessage ?? "خطا در بارگذاری محصولات"}
      </p>
    );
  }

  if (products.length === 0) {
    return (
      <p className="m-4 rounded-lg border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500">
        محصولی یافت نشد.
      </p>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-auto">
      <table className={`w-full min-w-[720px] ${textAlign}`}>
        <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50">
          <tr>
            <th className={thClass}>تصویر</th>
            <th className={thClass}>نام</th>
            <th className={thClass}>دسته</th>
            <th className={thClass}>قیمت</th>
            <th className={thClass}>موجودی</th>
            <th className={thClass}>وضعیت</th>
            <th className={thClass}>عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50/80">
              <td className={tdClass}>
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                    —
                  </div>
                )}
              </td>
              <td className={tdClass}>
                <p className="font-medium text-gray-900">{product.name}</p>
                {product.brand && (
                  <p className="mt-0.5 text-xs text-gray-500">{product.brand}</p>
                )}
              </td>
              <td className={tdClass}>{product.category}</td>
              <td className={tdClass}>{formatPrice(product.price, isFa)}</td>
              <td className={tdClass}>{product.stock}</td>
              <td className={tdClass}>
                <span
                  className={[
                    "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                    product.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600",
                  ].join(" ")}
                >
                  {product.isActive ? "فعال" : "غیرفعال"}
                </span>
              </td>
              <td className={tdClass}>
                <div className="flex flex-wrap gap-2">
                  {variant === "inventory" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onChangeStock?.(product)}
                        className="rounded-md border border-gray-300 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-100"
                      >
                        تغییر موجودی
                      </button>
                      <button
                        type="button"
                        onClick={() => onChangePrice?.(product)}
                        className="rounded-md border border-blue-200 px-2.5 py-1 text-xs text-blue-700 hover:bg-blue-50"
                      >
                        تغییر قیمت
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => onEdit?.(product)}
                        className="rounded-md border border-gray-300 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-100"
                      >
                        ویرایش
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete?.(product)}
                        className="rounded-md border border-red-200 px-2.5 py-1 text-xs text-red-700 hover:bg-red-50"
                      >
                        حذف
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
