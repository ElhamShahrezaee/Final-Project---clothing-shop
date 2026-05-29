import type { ShippingAddress } from "../checkout/types";
import type { PaymentMethod } from "../checkout/types";

export type CreateOrderPayload = {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod | string;
};

export type CreatedOrder = {
  id: string;
  status: string;
  message: string;
};
