import { resolveProductImageUrl } from "../../products/utils/resolveProductImageUrl";
import type { OrderStatus, UserOrder } from "../orderTypes";

type RawOrderItem = {
  _id?: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
};

export type RawUserOrder = {
  _id?: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
  };
  orderItems: RawOrderItem[];
  totalPrice: number;
  paymentMethod: string;
  status: OrderStatus;
  isPaid: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export function mapUserOrder(raw: RawUserOrder): UserOrder {
  return {
    id: raw._id ?? "",
    shippingAddress: raw.shippingAddress,
    orderItems: raw.orderItems.map((item) => ({
      id: item._id ?? "",
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image ? resolveProductImageUrl(item.image) : "",
    })),
    totalPrice: raw.totalPrice,
    paymentMethod: raw.paymentMethod,
    status: raw.status,
    isPaid: raw.isPaid,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}
