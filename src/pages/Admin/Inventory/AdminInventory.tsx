import { useAdminLocale } from "../../../hooks/useAdminLocale";
import { useAdminProductsList } from "../hooks/useAdminProductsList";
import AdminListPage from "../components/AdminListPage";
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
    limit,
    handleLimitChange,
    pagination,
  } = useAdminProductsList();

  return (
    <AdminListPage
      title="موجودی / قیمت"
      description="مدیریت موجودی و قیمت محصولات"
      textAlign={textAlign}
      filters={
        <ProductFilters
          search={searchInput}
          category={categoryInput}
          activeFilter={activeFilter}
          onSearchChange={setSearchInput}
          onCategoryChange={setCategoryInput}
          onActiveFilterChange={handleActiveFilterChange}
          onReset={handleResetFilters}
        />
      }
      table={
        <ProductTable
          products={data?.products ?? []}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message}
          variant="inventory"
        />
      }
      pagination={
        !isLoading && !isError ? (
          <ProductPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
          />
        ) : undefined
      }
    />
  );
}
