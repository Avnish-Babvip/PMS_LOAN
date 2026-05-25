import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveAccountCenterTab } from "../../features/slices/references";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

import { salesChart, trackSales } from "../../features/actions/dashboard";
import { useSearchParams } from "react-router-dom";
import FilterSelect from "../../components/FilterSelect";

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { trackSalesData, salesChartData, salesLoading } = useSelector(
    (state) => state.dashboard,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const year = searchParams.get("year") || "";
  const filter = searchParams.get("filter") || "";
  const from_date = searchParams.get("from_date") || "";
  const to_date = searchParams.get("to_date") || "";

  const updateParams = ({ year, filter, from_date, to_date }) => {
    const params = {};
    if (year !== undefined && year !== "") params.year = year;
    if (filter !== undefined && filter !== "") params.filter = filter;
    if (to_date !== undefined && to_date !== "") params.to_date = to_date;
    if (from_date !== undefined && from_date !== "")
      params.from_date = from_date;
    setSearchParams(params);
  };

  const subtitle =
    filter === "custom"
      ? from_date && to_date
        ? `${from_date} - ${to_date}`
        : "Custom Range"
      : filter;

  const currentYear = new Date().getFullYear();

  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    label: currentYear - i,
    value: currentYear - i,
  }));

  useEffect(() => {
    dispatch(setActiveAccountCenterTab("Dashboard"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(trackSales({ filter, from_date, to_date }));
  }, [filter, from_date, to_date]);

  useEffect(() => {
    dispatch(salesChart(year || currentYear));
  }, [year]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className=" font-semibold text-gray-700">Sales Overview</h3>

        {/* FILTERS */}
        <div className="flex flex-wrap items-end gap-3">
          <FilterSelect
            label="Filter Type"
            value={filter}
            options={[
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
              { label: "Custom", value: "custom" },
            ]}
            onChange={(val) =>
              updateParams({
                filter: val,
                from_date,
                to_date,
              })
            }
          />

          {/* From Date */}
          {filter === "custom" && (
            <div className="flex flex-col min-w-[140px] ">
              <label className="text-xs font-medium text-gray-500 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={from_date}
                onChange={(e) =>
                  updateParams({
                    filter,
                    from_date: e.target.value,
                    to_date,
                  })
                }
                className="border bg-white border-gray-300  rounded-xl
        shadow-sm  px-3 py-2 text-sm text-gray-800 focus:outline-none"
              />
            </div>
          )}

          {/* To Date */}
          {filter === "custom" && (
            <div className="flex flex-col min-w-[140px]">
              <label className="text-xs font-medium text-gray-500 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={to_date}
                min={from_date}
                onChange={(e) =>
                  updateParams({
                    filter,
                    from_date,
                    to_date: e.target.value,
                  })
                }
                className="border bg-white border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>
      {/* ================= STATS ROW ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {salesLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Orders"
              value={trackSalesData?.total_orders}
              icon="📦"
              subtitle={subtitle}
            />
            <StatCard
              title="Booked Revenue"
              value={`₹${trackSalesData?.total_sales}`}
              icon="💰"
              subtitle={subtitle}
            />
            <StatCard
              title="Average Value"
              value={`₹${trackSalesData?.average_order_value}`}
              icon="🎯"
              subtitle={subtitle}
            />
          </>
        )}
      </div>

      {/* ================= CHART ROW ================= */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
          <h3 className=" font-semibold text-gray-700">Sales Chart</h3>

          <FilterSelect
            label="Year"
            value={year || currentYear}
            options={yearOptions}
            onChange={(val) =>
              updateParams({
                filter,
                from_date,
                to_date,
                year: val,
              })
            }
          />
        </div>

        <RevenueChart data={salesChartData} />
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */

const StatCard = ({ title, value, icon, subtitle }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-orange-100 text-xl">
          {icon}
        </div>

        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className="text-gray-400 capitalize">{subtitle}</span>
      </div>
    </div>
  );
};

/* ================= CHART ================= */

const RevenueChart = ({ data = [] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        barCategoryGap={28}
        margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
      >
        {/* Gradient */}
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6B2C" stopOpacity={1} />
            <stop offset="100%" stopColor="#FDBA74" stopOpacity={1} />
          </linearGradient>
        </defs>

        <CartesianGrid
          vertical={false}
          strokeDasharray="4 4"
          stroke="#f1f5f9"
        />

        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tick={{
            fontSize: 13,
            fill: "#64748b",
            fontWeight: 500,
          }}
        />

        {/* SALES AXIS */}
        <YAxis
          yAxisId="sales"
          tickLine={false}
          axisLine={false}
          tick={{
            fontSize: 13,
            fill: "#64748b",
          }}
          tickFormatter={(value) =>
            value >= 1000 ? `₹${(value / 1000).toFixed(1)}k` : `₹${value}`
          }
        />

        {/* ORDERS AXIS */}
        <YAxis
          yAxisId="orders"
          orientation="right"
          tickLine={false}
          axisLine={false}
          tick={{
            fontSize: 13,
            fill: "#64748b",
          }}
        />

        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            fontSize: "13px",
            fontWeight: 500,
          }}
          formatter={(value, name) =>
            name === "Total Sales" ? `₹${value}` : value
          }
        />

        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: "13px", paddingTop: "10px" }}
          formatter={(value) => (
            <span style={{ color: "#374151", fontWeight: 500 }}>{value}</span>
          )}
        />

        {/* SALES BAR */}
        <Bar
          yAxisId="sales"
          dataKey="total_sales"
          fill="#FF6B2C"
          radius={[10, 10, 0, 0]}
          name="Total Sales"
        />

        {/* ORDERS LINE */}
        <Line
          yAxisId="orders"
          type="monotone"
          dataKey="total_orders"
          stroke="#22C55E"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 7 }}
          name="Total Orders"
          animationDuration={1000}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const StatCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200"></div>

        <div className="space-y-2 flex-1">
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
          <div className="h-6 w-20 bg-gray-300 rounded"></div>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-3 w-28 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};
