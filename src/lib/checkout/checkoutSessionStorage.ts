import type { PaymentMethod } from "../../features/checkout/types";

const PAYMENT_METHOD_KEY = "checkout_last_payment_method";

export function setLastPaymentMethod(method: PaymentMethod) {
  sessionStorage.setItem(PAYMENT_METHOD_KEY, method);
}

export function getLastPaymentMethod(): PaymentMethod | null {
  const value = sessionStorage.getItem(PAYMENT_METHOD_KEY);
  if (value === "cash" || value === "credit" || value === "card") return value;
  return null;
}
