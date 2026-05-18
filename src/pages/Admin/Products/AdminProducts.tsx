import { useState } from "react";
import type { AdminProduct } from "../../../features/admin/products/types";
import { useDeleteAdminProductMutation } from "../../../features/admin/products/queries/useDeleteAdminProductMutation";
import { useAdminLocale } from "../../../hooks/useAdminLocale";
import { useAdminProductsList } from "../hooks/useAdminProductsList";
import AdminListPage from "../components/AdminListPage";
import DeleteProductModal from "./components/DeleteProductModal";
import ProductFilters from "./components/ProductFilters";
import ProductPagination from "./components/ProductPagination";
import ProductTable from "./components/ProductTable";

export default function AdminProducts() {
  const { textAlign } = useAdminLocale();
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteMutation = useDeleteAdminProductMutation();

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
    page,
    setPage,
    limit,
    handleLimitChange,
    pagination,
  } = useAdminProductsList();

  const handleDeleteClick = (product: AdminProduct) => {
    setDeleteError(null);
    setProductToDelete(product);
  };

  const handleDeleteCancel = () => {
    if (deleteMutation.isPending) return;
    setProductToDelete(null);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    setDeleteError(null);

    try {
      await deleteMutation.mutateAsync(productToDelete.id);
      setProductToDelete(null);

      const remainingOnPage = (data?.products.length ?? 1) - 1;
      if (remainingOnPage === 0 && page > 1) {
        setPage(page - 1);
      }
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "خطا در حذف محصول");
    }
  };

  return (
    <>
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
            onDelete={handleDeleteClick}
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

      {productToDelete && (
        <DeleteProductModal
          product={productToDelete}
          isDeleting={deleteMutation.isPending}
          errorMessage={deleteError}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </>
  );
}
