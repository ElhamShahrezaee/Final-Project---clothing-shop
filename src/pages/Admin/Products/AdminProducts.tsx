import { useEffect, useMemo, useState } from "react";
import type { AdminProduct } from "../../../features/admin/products/types";
import { useAdminProductsQuery } from "../../../features/admin/products/queries/useAdminProductsQuery";
import { useAdminLocale } from "../../../hooks/useAdminLocale";
import ProductFilters, { type ActiveFilter } from "./components/ProductFilters";
import ProductPagination from "./components/ProductPagination";
import ProductTable from "./components/ProductTable";

const PAGE_SIZE = 10;

export default function AdminProducts() {
  const { textAlign } = useAdminLocale();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [category, setCategory] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [phaseNotice, setPhaseNotice] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCategory(categoryInput);
      setPage(1);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [categoryInput]);

  const filters = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
      category: category || undefined,
      isActive:
        activeFilter === "all" ? undefined : activeFilter === "active",
    }),
    [page, search, category, activeFilter],
  );

  const { data, isLoading, isFetching, isError, error } = useAdminProductsQuery(filters);

  const showPhaseNotice = (message: string) => {
    setPhaseNotice(message);
    window.setTimeout(() => setPhaseNotice(null), 3000);
  };

  const handleEdit = (_product: AdminProduct) => {
    showPhaseNotice("ویرایش محصول در فاز بعدی پیاده‌سازی می‌شود.");
  };

  const handleDelete = (_product: AdminProduct) => {
    showPhaseNotice("حذف محصول در فاز بعدی پیاده‌سازی می‌شود.");
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategoryInput("");
    setCategory("");
    setActiveFilter("all");
    setPage(1);
  };

  const pagination = data?.pagination ?? {
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  };

  return (
    <div className={`space-y-6 ${textAlign}`}>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">محصولات</h1>
        <p className="mt-1 text-sm text-gray-600">مدیریت محصولات فروشگاه</p>
      </div>

      {phaseNotice && (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status">
          {phaseNotice}
        </p>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <ProductFilters
          search={searchInput}
          category={categoryInput}
          activeFilter={activeFilter}
          onSearchChange={setSearchInput}
          onCategoryChange={setCategoryInput}
          onActiveFilterChange={(value) => {
            setActiveFilter(value);
            setPage(1);
          }}
          onReset={handleResetFilters}
        />
      </div>

      <ProductTable
        products={data?.products ?? []}
        isLoading={isLoading || isFetching}
        isError={isError}
        errorMessage={error?.message}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {!isLoading && !isError && (
        <ProductPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
