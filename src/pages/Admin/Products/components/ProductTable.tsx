import { useTranslation } from "react-i18next";
import type { AdminProduct } from "../../../../features/admin/products/types";
import { formatPrice } from "../../../../features/admin/products/utils/formatPrice";
import { useAdminLocale } from "../../../../hooks/useAdminLocale";
import Spinner from "../../../../components/common/Spinner/Spinner";
import AdminCardField from "../../components/AdminCardField";

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

const actionBtnClass =
  "w-full rounded-lg border px-3 py-2.5 text-sm font-medium transition sm:w-auto";

function ProductImage({ product, t }: { product: AdminProduct; t: (key: string) => string }) {
  if (product.images[0]) {
    return (
      <img
        src={product.images[0]}
        alt={product.name}
        className="h-14 w-14 shrink-0 rounded-lg border border-gray-200 object-cover sm:h-12 sm:w-12"
      />
    );
  }

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400 sm:h-12 sm:w-12">
      {t("admin.common.noImage")}
    </div>
  );
}

function ProductStatusBadge({
  isActive,
  t,
}: {
  isActive: boolean;
  t: (key: string) => string;
}) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600",
      ].join(" ")}
    >
      {isActive ? t("admin.common.active") : t("admin.common.inactive")}
    </span>
  );
}

function ProductActions({
  product,
  variant,
  t,
  onEdit,
  onDelete,
  onChangeStock,
  onChangePrice,
  layout,
}: {
  product: AdminProduct;
  variant: ProductTableVariant;
  t: (key: string) => string;
  onEdit?: (product: AdminProduct) => void;
  onDelete?: (product: AdminProduct) => void;
  onChangeStock?: (product: AdminProduct) => void;
  onChangePrice?: (product: AdminProduct) => void;
  layout: "card" | "table";
}) {
  const wrapClass =
    layout === "card"
      ? "grid gap-2 border-t border-gray-100 pt-4"
      : "flex flex-wrap gap-2";

  if (variant === "inventory") {
    return (
      <div className={wrapClass}>
        <button
          type="button"
          onClick={() => onChangeStock?.(product)}
          className={`${actionBtnClass} border-gray-300 text-gray-700 hover:bg-gray-100`}
        >
          {t("admin.products.changeStock")}
        </button>
        <button
          type="button"
          onClick={() => onChangePrice?.(product)}
          className={`${actionBtnClass} border-blue-200 text-blue-700 hover:bg-blue-50`}
        >
          {t("admin.products.changePrice")}
        </button>
      </div>
    );
  }

  return (
    <div className={wrapClass}>
      <button
        type="button"
        onClick={() => onEdit?.(product)}
        className={`${actionBtnClass} border-gray-300 text-gray-700 hover:bg-gray-100`}
      >
        {t("admin.common.edit")}
      </button>
      <button
        type="button"
        onClick={() => onDelete?.(product)}
        className={`${actionBtnClass} border-red-200 text-red-700 hover:bg-red-50`}
      >
        {t("admin.common.delete")}
      </button>
    </div>
  );
}

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
  const { t } = useTranslation();
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
        {errorMessage ?? t("admin.products.loadError")}
      </p>
    );
  }

  if (products.length === 0) {
    return (
      <p className="m-4 rounded-lg border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500">
        {t("admin.products.empty")}
      </p>
    );
  }

  return (
    <div className={textAlign}>
      <ul className="space-y-3 p-3 lg:hidden">
        {products.map((product) => (
          <li
            key={product.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex gap-3">
              <ProductImage product={product} t={t} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {product.category}
                  {product.brand?.trim() ? ` · ${product.brand}` : ""}
                </p>
              </div>
              <ProductStatusBadge isActive={product.isActive} t={t} />
            </div>

            <div className="mt-3 space-y-2">
              <AdminCardField label={t("admin.products.table.price")}>
                {formatPrice(product.price, isFa)}
              </AdminCardField>
              <AdminCardField label={t("admin.products.table.stock")}>
                {product.stock}
              </AdminCardField>
              <AdminCardField label={t("admin.products.table.rating")}>
                {product.rating}
              </AdminCardField>
              <AdminCardField label={t("admin.products.table.numReviews")}>
                {product.numReviews}
              </AdminCardField>
            </div>

            <ProductActions
              product={product}
              variant={variant}
              t={t}
              onEdit={onEdit}
              onDelete={onDelete}
              onChangeStock={onChangeStock}
              onChangePrice={onChangePrice}
              layout="card"
            />
          </li>
        ))}
      </ul>

      <table className={`hidden w-full lg:table ${textAlign}`}>
        <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50">
          <tr>
            <th className={thClass}>{t("admin.products.table.image")}</th>
            <th className={thClass}>{t("admin.products.table.name")}</th>
            <th className={thClass}>{t("admin.products.table.category")}</th>
            <th className={thClass}>{t("admin.products.table.brand")}</th>
            <th className={thClass}>{t("admin.products.table.price")}</th>
            <th className={thClass}>{t("admin.products.table.stock")}</th>
            <th className={thClass}>{t("admin.products.table.rating")}</th>
            <th className={thClass}>{t("admin.products.table.numReviews")}</th>
            <th className={thClass}>{t("admin.products.table.status")}</th>
            <th className={thClass}>{t("admin.common.actions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50/80">
              <td className={tdClass}>
                <ProductImage product={product} t={t} />
              </td>
              <td className={tdClass}>
                <p className="font-medium text-gray-900">{product.name}</p>
              </td>
              <td className={tdClass}>{product.category}</td>
              <td className={tdClass}>{product.brand?.trim() || "—"}</td>
              <td className={tdClass}>{formatPrice(product.price, isFa)}</td>
              <td className={tdClass}>{product.stock}</td>
              <td className={tdClass}>{product.rating}</td>
              <td className={tdClass}>{product.numReviews}</td>
              <td className={tdClass}>
                <ProductStatusBadge isActive={product.isActive} t={t} />
              </td>
              <td className={tdClass}>
                <ProductActions
                  product={product}
                  variant={variant}
                  t={t}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onChangeStock={onChangeStock}
                  onChangePrice={onChangePrice}
                  layout="table"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
