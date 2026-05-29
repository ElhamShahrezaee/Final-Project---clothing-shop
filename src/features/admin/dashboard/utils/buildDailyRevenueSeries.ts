import type { AdminOrder } from "../../orders/types";
import { getOrderTotal } from "../../orders/utils/orderLabels";
import { isCountableOrderStatus } from "./countableOrderStatuses";

export type DailyRevenuePoint = {
  dateKey: string;
  dayLabel: string;
  revenue: number;
  orders: number;
};

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getLastNDayKeys(dayCount: number): string[] {
  const keys: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let offset = dayCount - 1; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setDate(day.getDate() - offset);
    keys.push(toDateKey(day));
  }

  return keys;
}

function formatDayLabel(dateKey: string, locale: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function buildDailyRevenueSeries(
  orders: AdminOrder[],
  dayCount = 7,
  locale = "fa-IR",
): DailyRevenuePoint[] {
  const dateKeys = getLastNDayKeys(dayCount);
  const firstKey = dateKeys[0];
  const buckets = new Map<string, { revenue: number; orders: number }>();

  for (const key of dateKeys) {
    buckets.set(key, { revenue: 0, orders: 0 });
  }

  for (const order of orders) {
    if (!isCountableOrderStatus(order.status) || !order.createdAt) continue;

    const created = new Date(order.createdAt);
    if (Number.isNaN(created.getTime())) continue;

    const dateKey = toDateKey(created);
    if (dateKey < firstKey) continue;

    const bucket = buckets.get(dateKey);
    if (!bucket) continue;

    bucket.revenue += getOrderTotal(order.totalPrice, order.orderItems);
    bucket.orders += 1;
  }

  return dateKeys.map((dateKey) => {
    const bucket = buckets.get(dateKey)!;
    return {
      dateKey,
      dayLabel: formatDayLabel(dateKey, locale),
      revenue: bucket.revenue,
      orders: bucket.orders,
    };
  });
}
