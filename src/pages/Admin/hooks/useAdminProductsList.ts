import { useEffect, useMemo, useState } from "react";
import { useAdminProductsQuery } from "../../../features/admin/products/queries/useAdminProductsQuery";
import type { ActiveFilter } from "../Products/components/ProductFilters";

const PAGE_SIZE = 10;

export function useAdminProductsList() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [category, setCategory] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");

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

  const handleResetFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategoryInput("");
    setCategory("");
    setActiveFilter("all");
    setPage(1);
  };

  const handleActiveFilterChange = (value: ActiveFilter) => {
    setActiveFilter(value);
    setPage(1);
  };

  const pagination = data?.pagination ?? {
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  };

  return {
    searchInput,
    setSearchInput,
    categoryInput,
    setCategoryInput,
    activeFilter,
    handleActiveFilterChange,
    handleResetFilters,
    data,
    isLoading: isLoading || isFetching,
    isError,
    error,
    page,
    setPage,
    pagination,
  };
}
