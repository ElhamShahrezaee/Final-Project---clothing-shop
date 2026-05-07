export type AdminPageSize = 10 | 20 | 50 | 100;

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  brand?: string;
  rating: number;
  numReviews: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminProductsFilters {
  page?: number;
  limit?: AdminPageSize;
  search?: string;
  category?: string;
  brand?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export interface AdminProductsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminProductsResult {
  products: AdminProduct[];
  pagination: AdminProductsPagination;
}
