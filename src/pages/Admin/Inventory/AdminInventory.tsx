import { useState } from "react";
import type { AdminProduct } from "../../../features/admin/products/types";
import { useUpdateAdminProductMutation } from "../../../features/admin/products/queries/useUpdateAdminProductMutation";
import { useAdminLocale } from "../../../hooks/useAdminLocale";
import { useAdminProductsList } from "../hooks/useAdminProductsList";
import AdminListPage from "../components/AdminListPage";
import ProductFilters from "../Products/components/ProductFilters";
import ProductPagination from "../Products/components/ProductPagination";
import ProductTable from "../Products/components/ProductTable";
import ChangePriceModal from "./components/ChangePriceModal";
import ChangeStockModal from "./components/ChangeStockModal";

export default function AdminInventory() {
  const { textAlign } = useAdminLocale();
  const [productForStock, setProductForStock] = useState<AdminProduct | null>(null);
  const [productForPrice, setProductForPrice] = useState<AdminProduct | null>(null);
  const [stockSaveError, setStockSaveError] = useState<string | null>(null);
  const [priceSaveError, setPriceSaveError] = useState<string | null>(null);

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
    setStockSaveError(null);
    setProductForStock(product);
  };

  const handleChangePriceClick = (product: AdminProduct) => {
    setPriceSaveError(null);
    setProductForPrice(product);
  };

  const handleStockCancel = () => {
    if (updateMutation.isPending) return;
    setProductForStock(null);
    setStockSaveError(null);
  };

  const handlePriceCancel = () => {
    if (updateMutation.isPending) return;
    setProductForPrice(null);
    setPriceSaveError(null);
  };

  const handleStockSave = async (stock: number) => {
    if (!productForStock) return;

    setStockSaveError(null);

    try {
      await updateMutation.mutateAsync({
        productId: productForStock.id,
        payload: {
          name: productForStock.name,
          price: productForStock.price,
          stock,
        },
      });
      setProductForStock(null);
    } catch (err) {
      setStockSaveError(err instanceof Error ? err.message : "خطا در بروزرسانی موجودی");
    }
  };

  const handlePriceSave = async (price: number) => {
    if (!productForPrice) return;

    setPriceSaveError(null);

    try {
      await updateMutation.mutateAsync({
        productId: productForPrice.id,
        payload: {
          name: productForPrice.name,
          price,
          stock: productForPrice.stock,
        },
      });
      setProductForPrice(null);
    } catch (err) {
      setPriceSaveError(err instanceof Error ? err.message : "خطا در بروزرسانی قیمت");
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
            onChangePrice={handleChangePriceClick}
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

      {productForStock && (
        <ChangeStockModal
          product={productForStock}
          isSaving={updateMutation.isPending}
          errorMessage={stockSaveError}
          onSave={handleStockSave}
          onCancel={handleStockCancel}
        />
      )}

      {productForPrice && (
        <ChangePriceModal
          product={productForPrice}
          isSaving={updateMutation.isPending}
          errorMessage={priceSaveError}
          onSave={handlePriceSave}
          onCancel={handlePriceCancel}
        />
      )}
    </>
  );
}
