export type OrderSuccessParams = {
  orderId: string;
  status: string;
  message: string;
};

export function buildOrderSuccessSearch(params: OrderSuccessParams): string {
  const search = new URLSearchParams();
  search.set("orderId", params.orderId);
  search.set("status", params.status);
  search.set("message", params.message);
  return search.toString();
}

export function parseOrderSuccessSearch(search: string): OrderSuccessParams | null {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const orderId = params.get("orderId");
  if (!orderId) return null;

  return {
    orderId,
    status: params.get("status") ?? "",
    message: params.get("message") ?? "",
  };
}
