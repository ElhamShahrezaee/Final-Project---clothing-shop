import type { TFunction } from "i18next";
import type { OrderStatus } from "../types";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipping",
  "delivered",
  "cancelled",
];

export function getOrderStatusLabel(status: OrderStatus, t: TFunction): string {
  return t(`admin.orders.status.${status}`);
}

export function getOrderStatusOptions(t: TFunction): { value: OrderStatus; label: string }[] {
  return ORDER_STATUSES.map((value) => ({
    value,
    label: getOrderStatusLabel(value, t),
  }));
}

export function getOrderTotal(
  totalPrice: number,
  items: { price: number; quantity: number }[],
): number {
  if (totalPrice > 0) return totalPrice;
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
