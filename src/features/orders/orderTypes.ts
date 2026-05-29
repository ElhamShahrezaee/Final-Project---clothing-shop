export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled";

export type OrderShippingAddress = {
  name: string;
  phone: string;
  address: string;
};

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
};

export type UserOrder = {
  id: string;
  shippingAddress: OrderShippingAddress;
  orderItems: OrderItem[];
  totalPrice: number;
  paymentMethod: string;
  status: OrderStatus;
  isPaid: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UserOrdersFilters = {
  page?: number;
  limit?: number;
};

export type UserOrdersPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type UserOrdersResult = {
  orders: UserOrder[];
  pagination: UserOrdersPagination;
};
