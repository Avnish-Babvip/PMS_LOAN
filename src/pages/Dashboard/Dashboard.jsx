import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveAccountCenterTab } from "../../features/slices/references";
import { getAllNotifications } from "../../features/actions/dashboard";
import { HiSparkles } from "react-icons/hi2";
import {
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineCheckCircle,
  HiOutlineBanknotes,
} from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import TableSkeleton from "../../components/TableSkeleton";

export const Dashboard = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const { dashboardData, dashboardLoading } = useSelector(
    (state) => state.dashboard,
  );

  const data = dashboardData?.data || [];
  const hasData = Array.isArray(data) && data.length > 0;

  const updateParams = ({ page }) => {
    const params = {};
    if (page) params.page = page;
    setSearchParams(params);
  };

  const getNotificationType = (type) => {
    switch (type) {
      case "visit_started":
        return {
          label: "Visit Started",
          icon: HiOutlineMapPin,
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
          badge: "bg-yellow-100 text-yellow-700",
        };

      case "visit_ended":
        return {
          label: "Visit Ended",
          icon: HiOutlineCheckCircle,
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          badge: "bg-green-100 text-green-700",
        };

      default:
        return {
          label: "General",
          icon: HiOutlineClock,
          iconBg: "bg-gray-100",
          iconColor: "text-gray-600",
          badge: "bg-gray-100 text-gray-700",
        };
    }
  };

  useEffect(() => {
    dispatch(setActiveAccountCenterTab("Dashboard"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllNotifications({ page }));
  }, [page]);

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-4 sm:p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 font-medium">Overview</p>

          <h2 className="text-3xl font-bold text-gray-800 mt-1">Dashboard</h2>
        </div>
      </div>

      {/* ================= HERO CARD ================= */}
      <DashboardHero />

      {/* ================= NOTIFICATIONS ================= */}
      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              Latest updates and activities
            </p>
          </div>

          <span className="rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-orange-600">
            {dashboardData?.meta?.pagination?.total || data.length} Total
          </span>
        </div>

        {dashboardLoading ? (
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">Notification</th>
                  <th className="px-6 py-4 text-left">Case UUID</th>
                  <th className="px-6 py-4 text-left">Type</th>
                  <th className="px-6 py-4 text-left">Date</th>
                </tr>
              </thead>

              <tbody>
                {[...Array(6)].map((_, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-4">
                        <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-200" />

                        <div className="flex-1">
                          <div className="mb-2 h-4 w-48 animate-pulse rounded bg-gray-200" />
                          <div className="h-3 w-72 animate-pulse rounded bg-gray-100" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                    </td>

                    <td className="px-6 py-5">
                      <div className="h-7 w-28 animate-pulse rounded-full bg-gray-200" />
                    </td>

                    <td className="px-6 py-5">
                      <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : hasData ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Notification
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Case UUID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {data.map((item, index) => {
                  const notification = getNotificationType(item.type);
                  const Icon = notification.icon;

                  return (
                    <tr
                      key={item.id || index}
                      className="transition hover:bg-orange-50/50"
                    >
                      {/* Notification */}
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${notification.iconBg}`}
                          >
                            <Icon
                              className={`text-xl ${notification.iconColor}`}
                            />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {item.title || "Notification"}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              {item.message}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {item.case_uuid}
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.type === "visit_started"
                              ? "bg-yellow-100 text-yellow-700"
                              : item.type === "visit_ended"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.type === "visit_started"
                            ? "Visit Started"
                            : item.type === "visit_ended"
                              ? "Visit Ended"
                              : item.type || "General"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <HiOutlineClock className="text-gray-400" />

                          {new Date(item.created_at).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <HiOutlineBanknotes className="mb-4 text-6xl text-gray-300" />

            <h3 className="text-lg font-semibold text-gray-700">
              No Notifications
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              You're all caught up. New notifications will appear here.
            </p>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {!dashboardLoading && hasData && dashboardData?.meta?.pagination && (
        <Pagination
          data={dashboardData.meta.pagination}
          page={page}
          label="notifications"
          onPageChange={updateParams}
        />
      )}
    </div>
  );
};

const DashboardHero = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mb-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-[#EF4444] via-[#B91C2C] to-[#89101C] p-8 shadow-[0_25px_60px_rgba(137,16,28,0.35)] sm:p-10">
      {/* Background Blur */}
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-red-300/20 blur-3xl"></div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,.15) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Content */}
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
            PMS Dashboard
          </span>

          <h1 className="mt-6 text-4xl font-extrabold flex gap-2 leading-tight text-white md:text-5xl">
            Welcome Back <HiSparkles className="text-yellow-300" />
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-red-100">
            Track cases, monitor field verification, manage approvals, and stay
            informed with the latest updates.
          </p>
        </div>

        {/* Right Clock Card */}
        <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-xl">
          {/* Clock */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <HiOutlineClock className="text-3xl text-white" />
            </div>

            <div>
              <h2 className="text-4xl font-bold tracking-wide text-white">
                {currentTime.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </h2>

              <p className="mt-1 text-sm text-red-100">
                {currentTime.toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-white/10 pt-4">
            <p className="text-sm text-red-100">
              Everything you need is ready. Let's make today count.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
