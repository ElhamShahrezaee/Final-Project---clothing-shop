export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled";

export type OrderStatusFilter = "all" | OrderStatus;

export type OrderPageSize = 10 | 20 | 50 | 100;

export interface OrderShippingAddress {
  name: string;
  phone: string;
  address: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface AdminOrder {
  id: string;
  shippingAddress: OrderShippingAddress;
  orderItems: OrderItem[];
  totalPrice: number;
  paymentMethod: string;
  status: OrderStatus;
  isPaid: boolean;
  createdAt?: string;
}

export interface AdminOrdersFilters {
  page?: number;
  limit?: OrderPageSize;
  status?: OrderStatus;
}

export interface AdminOrdersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminOrdersResult {
  orders: AdminOrder[];
  pagination: AdminOrdersPagination;
}
