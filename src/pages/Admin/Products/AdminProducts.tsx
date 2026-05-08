import { useAdminLocale } from "../../../hooks/useAdminLocale";
import { useAdminProductsList } from "../hooks/useAdminProductsList";
import AdminListPage from "../components/AdminListPage";
import ProductFilters from "./components/ProductFilters";
import ProductPagination from "./components/ProductPagination";
import ProductTable from "./components/ProductTable";

export default function AdminProducts() {
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
      title="محصولات"
      description="مدیریت محصولات فروشگاه"
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
          variant="manage"
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
