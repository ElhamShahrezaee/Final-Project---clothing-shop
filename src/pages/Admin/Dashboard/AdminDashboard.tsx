import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of store activity (mock data for phase 1).
        </p>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-medium">Weekly Revenue</div>
            <div className="text-xs text-gray-500">Mock data</div>
          </div>
          <div className="text-xs text-gray-500">Last 7 days</div>
        </div>

        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockSales} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#111827" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

