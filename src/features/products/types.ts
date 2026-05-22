export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  images: string[];
  rating: number;
  category: string;
};

export type ProductDetail = Product & {
  description: string;
  stock: number;
  numReviews: number;
};

export type StoreProductsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type StoreProductsResult = {
  products: Product[];
  pagination: StoreProductsPagination;
};
