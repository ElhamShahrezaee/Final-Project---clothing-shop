import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useAdminLocale } from "../../../hooks/useAdminLocale";

const mockSales = [
  { day: "Mon", revenue: 1200, orders: 12 },
  { day: "Tue", revenue: 1800, orders: 18 },
  { day: "Wed", revenue: 1500, orders: 14 },
  { day: "Thu", revenue: 2400, orders: 22 },
  { day: "Fri", revenue: 2100, orders: 19 },
  { day: "Sat", revenue: 3200, orders: 28 },
  { day: "Sun", revenue: 2800, orders: 24 },
];

export default function AdminDashboard() {
  const { textAlign } = useAdminLocale();

  return (
    <div className={`space-y-6 ${textAlign}`}>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">داشبورد</h1>
        <p className="mt-1 text-sm text-gray-600">نمای کلی فعالیت فروشگاه</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className={`flex items-end justify-between gap-4 ${textAlign}`}>
          <div>
            <div className="text-sm font-medium text-gray-900">درآمد هفتگی</div>
            <div className="text-xs text-gray-500">داده نمونه</div>
          </div>
          <div className="text-xs text-gray-500">۷ روز گذشته</div>
        </div>

        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockSales} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#111827"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

