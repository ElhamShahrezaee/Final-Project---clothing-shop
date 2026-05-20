export type AdminProductFormValues = {
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  rating: number;
  numReviews: number;
  isActive: boolean;
};

export const defaultProductFormValues: AdminProductFormValues = {
  name: "",
  description: "",
  category: "",
  brand: "",
  price: 0,
  stock: 0,
  rating: 0,
  numReviews: 0,
  isActive: true,
};
