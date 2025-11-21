"use client";

import { EnrollmentTrends } from"@/types";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from"recharts";
import { format, parseISO } from"date-fns";

interface EnrollmentTrendsChartProps {
  data: EnrollmentTrends;
  period:"24H" |"7D" |"30D";
}

export function EnrollmentTrendsChart({ data, period }: EnrollmentTrendsChartProps) {
  // Format data for charts
  const chartData = data.data.map((item) => ({
    date: item.date,
    enrollments: item.enrollments,
    revenue: item.revenue,
    formattedDate: formatDate(item.date, period),
  }));

  function formatDate(dateString: string, period: string): string {
    const date = parseISO(dateString);
    
    if (period ==="24H") {
      return format(date,"HH:mm");
    } else if (period ==="7D") {
      return format(date,"EEE, MMM d");
    } else {
      return format(date,"MMM d");
    }
  }

  return (
    <div className="space-y-8">
      {/* Enrollments Line Chart */}
      <div>
        <h3 className="text-sm font-medium mb-4">Enrollment Count Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="formattedDate"
              className="text-xs"
              tick={{ fill:"hsl(var(--muted-foreground))" }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              className="text-xs"
              tick={{ fill:"hsl(var(--muted-foreground))" }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor:"hsl(var(--background))",
                border:"1px solid hsl(var(--border))",
                borderRadius:"8px",
              }}
              formatter={(value: number) => [value,"Enrollments"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="enrollments"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorEnrollments)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Bar Chart */}
      <div>
        <h3 className="text-sm font-medium mb-4">Revenue Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="formattedDate"
              className="text-xs"
              tick={{ fill:"hsl(var(--muted-foreground))" }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              className="text-xs"
              tick={{ fill:"hsl(var(--muted-foreground))" }}
              label={{
                value: `Revenue (${data.currency})`,
                angle: -90,
                position:"insideLeft",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor:"hsl(var(--background))",
                border:"1px solid hsl(var(--border))",
                borderRadius:"8px",
              }}
              formatter={(value: number) => [
                `${data.currency} ${value.toLocaleString()}`,"Revenue",
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Combined Chart */}
      <div>
        <h3 className="text-sm font-medium mb-4">Combined View</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="formattedDate"
              className="text-xs"
              tick={{ fill:"hsl(var(--muted-foreground))" }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              yAxisId="left"
              className="text-xs"
              tick={{ fill:"hsl(var(--muted-foreground))" }}
              allowDecimals={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              className="text-xs"
              tick={{ fill:"hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor:"hsl(var(--background))",
                border:"1px solid hsl(var(--border))",
                borderRadius:"8px",
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="enrollments"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill:"#10b981", r: 4 }}
              name="Enrollments"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill:"#3b82f6", r: 4 }}
              name={`Revenue (${data.currency})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
        <div>
          <p className="text-xs text-muted-foreground">Total Enrollments</p>
          <p className="text-2xl font-bold mt-1">{data.total_enrollments.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold mt-1">
            {data.currency} {data.total_revenue.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Average per Day</p>
          <p className="text-2xl font-bold mt-1">
            {data.data.length > 0
              ? (data.total_enrollments / data.data.length).toFixed(1)
              :"0"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Avg Revenue per Enrollment</p>
          <p className="text-2xl font-bold mt-1">
            {data.total_enrollments > 0
              ? `${data.currency} ${(data.total_revenue / data.total_enrollments).toFixed(0)}`
              : `${data.currency} 0`}
          </p>
        </div>
      </div>
    </div>
  );
}
