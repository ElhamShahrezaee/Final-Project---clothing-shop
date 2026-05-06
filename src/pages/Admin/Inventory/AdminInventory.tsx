import { useAdminLocale } from "../../../hooks/useAdminLocale";
import { useAdminProductsList } from "../hooks/useAdminProductsList";
import ProductFilters from "../Products/components/ProductFilters";
import ProductPagination from "../Products/components/ProductPagination";
import ProductTable from "../Products/components/ProductTable";

export default function AdminInventory() {
  const { textAlign } = useAdminLocale();

  const {
    searchInput,
    setSearchInput,
    categoryInput,
    setCategoryInput,
    activeFilter,
    handleActiveFilterChange,
    handleResetFilters,
    data,
    isLoading,
    isError,
    error,
    setPage,
    pagination,
  } = useAdminProductsList();

  return (
    <div className={`space-y-6 ${textAlign}`}>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">موجودی / قیمت</h1>
        <p className="mt-1 text-sm text-gray-600">مدیریت موجودی و قیمت محصولات</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <ProductFilters
          search={searchInput}
          category={categoryInput}
          activeFilter={activeFilter}
          onSearchChange={setSearchInput}
          onCategoryChange={setCategoryInput}
          onActiveFilterChange={handleActiveFilterChange}
          onReset={handleResetFilters}
        />
      </div>

      <ProductTable
        products={data?.products ?? []}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        variant="inventory"
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
