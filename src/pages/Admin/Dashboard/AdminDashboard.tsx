import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useTranslation } from "react-i18next";
import Spinner from "../../../components/common/Spinner/Spinner";
import { formatPrice } from "../../../features/admin/products/utils/formatPrice";
import { buildDailyRevenueSeries } from "../../../features/admin/dashboard/utils/buildDailyRevenueSeries";
import { useAdminDashboardQuery } from "../../../features/admin/dashboard/queries/useAdminDashboardQuery";
import { useAdminLocale } from "../../../hooks/useAdminLocale";

type ChartTooltipProps = {
  active?: boolean;
  payload?: { payload: { dayLabel: string; revenue: number; orders: number } }[];
  label?: string;
  isFa: boolean;
  revenueLabel: string;
  ordersLabel: string;
};

function ChartTooltip({
  active,
  payload,
  isFa,
  revenueLabel,
  ordersLabel,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-gray-900">{point.dayLabel}</p>
      <p className="mt-1 text-gray-700">
        {revenueLabel}: {formatPrice(point.revenue, isFa)}
      </p>
      <p className="text-gray-600">
        {ordersLabel}: {point.orders}
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { isFa, textAlign } = useAdminLocale();
  const { data: orders, isPending, isError, error, refetch } = useAdminDashboardQuery();

  const locale = isFa ? "fa-IR" : "en-US";

  const chartData = useMemo(
    () => (orders ? buildDailyRevenueSeries(orders, 7, locale) : []),
    [orders, locale],
  );

  const weekTotal = useMemo(
    () => chartData.reduce((sum, point) => sum + point.revenue, 0),
    [chartData],
  );

  const [isCompactChart, setIsCompactChart] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setIsCompactChart(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const yAxisWidth = isCompactChart ? (isFa ? 52 : 44) : isFa ? 88 : 72;
  const chartMargin = {
    top: 10,
    right: isCompactChart ? 4 : 12,
    left: yAxisWidth + 4,
    bottom: isCompactChart ? 16 : 8,
  };

  return (
    <div className={`w-full min-w-0 max-w-full ${textAlign}`}>
      <div className="w-full space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{t("admin.dashboard.title")}</h1>
          <p className="mt-1 text-sm text-gray-600">{t("admin.dashboard.subtitle")}</p>
        </div>

        <div className="w-full min-w-0 rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
          <div className={`flex flex-wrap items-end justify-between gap-4 ${textAlign}`}>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {t("admin.dashboard.weeklyRevenue")}
              </div>
              <p className="mt-0.5 text-xs text-gray-500">{t("admin.dashboard.statusHint")}</p>
              {!isPending && !isError ? (
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {formatPrice(weekTotal, isFa)}{" "}
                  <span className="text-sm font-normal text-gray-500">
                    {t("admin.dashboard.weekTotalLabel")}
                  </span>
                </p>
              ) : null}
            </div>
            <div className="text-xs text-gray-500">{t("admin.dashboard.last7Days")}</div>
          </div>

          <div className="relative mt-4 h-56 w-full min-w-0 sm:h-64">
            {isPending ? (
              <div className="flex h-full items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : null}

            {isError ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm text-red-700" role="alert">
                  {error?.message ?? t("admin.dashboard.loadError")}
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {t("admin.dashboard.retry")}
                </button>
              </div>
            ) : null}

            {!isPending && !isError ? (
              <div className="absolute inset-0 w-full min-w-0" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={chartMargin}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="dayLabel"
                      tick={{ fontSize: isCompactChart ? 9 : 11 }}
                      interval={isCompactChart ? 1 : 0}
                      angle={isCompactChart ? -35 : 0}
                      textAnchor={isCompactChart ? "end" : "middle"}
                      height={isCompactChart ? 48 : 30}
                    />
                    <YAxis
                      orientation="left"
                      tick={{ fontSize: 11 }}
                      tickMargin={8}
                      tickFormatter={(value: number) => formatPrice(value, isFa)}
                      width={yAxisWidth}
                    />
                  <Tooltip
                    content={
                      <ChartTooltip
                        isFa={isFa}
                        revenueLabel={t("admin.dashboard.tooltipRevenue")}
                        ordersLabel={t("admin.dashboard.tooltipOrders")}
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#111827"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
