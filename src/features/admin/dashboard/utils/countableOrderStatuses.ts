import type { OrderStatus } from "../../orders/types";

export const COUNTABLE_ORDER_STATUSES: OrderStatus[] = [
  "confirmed",
  "shipping",
  "delivered",
];

export function isCountableOrderStatus(status: OrderStatus): boolean {
  return COUNTABLE_ORDER_STATUSES.includes(status);
}
