import { getAdminOrders } from "./getAdminOrders";
import type { AdminOrder } from "../types";

export async function fetchAllAdminOrders(): Promise<AdminOrder[]> {
  const limit = 100;
  const orders: AdminOrder[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const result = await getAdminOrders({ page, limit });
    orders.push(...result.orders);
    totalPages = result.pagination.totalPages;
    page += 1;
  } while (page <= totalPages);

  return orders;
}
