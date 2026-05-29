import type { TFunction } from "i18next";
import type { OrderStatus } from "../orderTypes";

export function getOrderStatusLabel(status: OrderStatus | string, t: TFunction): string {
  const key = `account.orders.status.${status}`;
  const translated = t(key);
  if (translated !== key) return translated;
  return t(`admin.orders.status.${status}`, status);
}

export function getPaymentMethodLabel(method: string, t: TFunction): string {
  const key = `account.orders.paymentMethod.${method}`;
  const translated = t(key);
  return translated !== key ? translated : method;
}
