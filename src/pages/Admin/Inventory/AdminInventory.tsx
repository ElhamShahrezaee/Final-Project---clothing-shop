import { useState } from "react";
import type { AdminProduct } from "../../../features/admin/products/types";
import { useUpdateAdminProductMutation } from "../../../features/admin/products/queries/useUpdateAdminProductMutation";
import { useAdminLocale } from "../../../hooks/useAdminLocale";
import { useAdminProductsList } from "../hooks/useAdminProductsList";
import AdminListPage from "../components/AdminListPage";
import ProductFilters from "../Products/components/ProductFilters";
import ProductPagination from "../Products/components/ProductPagination";
import ProductTable from "../Products/components/ProductTable";
import ChangeStockModal from "./components/ChangeStockModal";

export default function AdminInventory() {
  const { textAlign } = useAdminLocale();
  const [productToEdit, setProductToEdit] = useState<AdminProduct | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const updateMutation = useUpdateAdminProductMutation();

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

  const handleChangeStockClick = (product: AdminProduct) => {
    setSaveError(null);
    setProductToEdit(product);
  };

  const handleCancel = () => {
    if (updateMutation.isPending) return;
    setProductToEdit(null);
    setSaveError(null);
  };

  const handleSave = async (stock: number) => {
    if (!productToEdit) return;

    setSaveError(null);

    try {
      await updateMutation.mutateAsync({
        productId: productToEdit.id,
        payload: {
          name: productToEdit.name,
          price: productToEdit.price,
          stock,
        },
      });
      setProductToEdit(null);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "خطا در بروزرسانی موجودی");
    }
  };

  return (
    <>
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
            onChangeStock={handleChangeStockClick}
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

      {productToEdit && (
        <ChangeStockModal
          product={productToEdit}
          isSaving={updateMutation.isPending}
          errorMessage={saveError}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
