import { useState } from "react";
import type { AdminProduct } from "../../../features/admin/products/types";
import type { AdminProductFormValues } from "../../../features/admin/products/types/productForm";
import { useCreateAdminProductMutation } from "../../../features/admin/products/queries/useCreateAdminProductMutation";
import { useDeleteAdminProductMutation } from "../../../features/admin/products/queries/useDeleteAdminProductMutation";
import { useUpdateAdminProductMutation } from "../../../features/admin/products/queries/useUpdateAdminProductMutation";
import { useAdminLocale } from "../../../hooks/useAdminLocale";
import { useAdminProductsList } from "../hooks/useAdminProductsList";
import AdminListPage from "../components/AdminListPage";
import DeleteProductModal from "./components/DeleteProductModal";
import ProductFilters from "./components/ProductFilters";
import ProductFormModal, { type ProductFormModalMode } from "./components/ProductFormModal";
import ProductPagination from "./components/ProductPagination";
import ProductTable from "./components/ProductTable";

export default function AdminProducts() {
  const { textAlign } = useAdminLocale();
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<ProductFormModalMode | null>(null);
  const [productToEdit, setProductToEdit] = useState<AdminProduct | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const deleteMutation = useDeleteAdminProductMutation();
  const createMutation = useCreateAdminProductMutation();
  const updateMutation = useUpdateAdminProductMutation();

  const isFormSaving = createMutation.isPending || updateMutation.isPending;

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

  const handleAddClick = () => {
    setFormError(null);
    setProductToEdit(null);
    setFormMode("create");
  };

  const handleEditClick = (product: AdminProduct) => {
    setFormError(null);
    setProductToEdit(product);
    setFormMode("edit");
  };

  const handleFormCancel = () => {
    if (isFormSaving) return;
    setFormMode(null);
    setProductToEdit(null);
    setFormError(null);
  };

  const handleFormSubmit = async (
    values: AdminProductFormValues,
    imageFiles: File[],
    existingImageUrls: string[],
  ) => {
    setFormError(null);

    try {
      if (formMode === "create") {
        await createMutation.mutateAsync({
          values,
          options: {
            imageFiles: imageFiles.length > 0 ? imageFiles : undefined,
          },
        });
      } else if (formMode === "edit" && productToEdit) {
        await updateMutation.mutateAsync({
          productId: productToEdit.id,
          values,
          options: {
            imageFiles: imageFiles.length > 0 ? imageFiles : undefined,
            existingImageUrls,
            isUpdate: true,
          },
        });
      }
      setFormMode(null);
      setProductToEdit(null);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "خطا در ذخیره محصول");
    }
  };

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
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleAddClick}
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              اضافه کردن محصول جدید
            </button>
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
        }
        table={
          <ProductTable
            products={data?.products ?? []}
            isLoading={isLoading}
            isError={isError}
            errorMessage={error?.message}
            variant="manage"
            onEdit={handleEditClick}
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

      {formMode && (
        <ProductFormModal
          mode={formMode}
          product={productToEdit ?? undefined}
          isSaving={isFormSaving}
          errorMessage={formError}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

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
