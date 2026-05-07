import type { OrderStatus } from "../types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "در انتظار تایید",
  confirmed: "تایید شده",
  shipping: "در حال ارسال",
  delivered: "تحویل داده شده",
  cancelled: "لغو شده",
};

export const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: ORDER_STATUS_LABELS.pending },
  { value: "confirmed", label: ORDER_STATUS_LABELS.confirmed },
  { value: "shipping", label: ORDER_STATUS_LABELS.shipping },
  { value: "delivered", label: ORDER_STATUS_LABELS.delivered },
  { value: "cancelled", label: ORDER_STATUS_LABELS.cancelled },
];

export function getOrderTotal(
  totalPrice: number,
  items: { price: number; quantity: number }[],
): number {
  if (totalPrice > 0) return totalPrice;
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
