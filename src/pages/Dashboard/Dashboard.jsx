import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveAccountCenterTab,
} from "../../features/slices/references";
import { dashboard } from "../../features/actions/dashboard";
import {
  HiOutlineBanknotes,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineBriefcase,
} from "react-icons/hi2";

export const Dashboard = () => {
  const dispatch = useDispatch();

  const { dashboardData, dashboardLoading } = useSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    dispatch(setActiveAccountCenterTab("Dashboard"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(dashboard());
  }, [dispatch]);

  const overview = dashboardData?.overview;

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-4 sm:p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 font-medium">
            Financial Overview
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-1">
            Banking Dashboard
          </h2>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">
            Total Portfolio
          </p>

          <h3 className="text-2xl font-bold text-[#0F766E]">
            ₹{overview?.total_loaned_amount || 0}
          </h3>
        </div>
      </div>

      {/* ================= HERO CARD ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#1E293B] p-8 mb-8 shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <p className="text-teal-300 text-sm font-medium uppercase tracking-widest">
              Loan Management
            </p>

            <h1 className="text-white text-3xl sm:text-4xl font-bold mt-3 leading-tight">
              Welcome Back 👋
            </h1>

            <p className="text-gray-300 mt-4 max-w-xl">
              Track loan performance, monitor collections, and
              manage approvals with a modern banking dashboard.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <MiniCard
              label="Active Loans"
              value={overview?.active_loans_count || 0}
            />

            <MiniCard
              label="Pending"
              value={overview?.pending_approval_loans || 0}
            />
          </div>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {dashboardLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Active Loans"
              value={overview?.active_loans_count || 0}
              icon={<HiOutlineBriefcase />}
              color="from-blue-500 to-indigo-500"
            />

            <StatCard
              title="Pending Approvals"
              value={overview?.pending_approval_loans || 0}
              icon={<HiOutlineClock />}
              color="from-orange-400 to-orange-500"
            />

            <StatCard
              title="Total Loaned"
              value={`₹${overview?.total_loaned_amount || 0}`}
              icon={<HiOutlineBanknotes />}
              color="from-emerald-500 to-teal-500"
            />

            <StatCard
              title="Total Collected"
              value={`₹${overview?.total_collected_amount || 0}`}
              icon={<HiOutlineCheckCircle />}
              color="from-violet-500 to-purple-500"
            />
          </>
        )}
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-full blur-2xl`}
      ></div>

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold text-gray-800">
            {value}
          </h3>

          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>

            <span className="text-xs text-gray-500">
              Updated just now
            </span>
          </div>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white text-2xl shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

/* ================= MINI CARD ================= */

const MiniCard = ({ label, value }) => {
  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-5 min-w-[150px]">
      <p className="text-gray-300 text-sm">{label}</p>

      <h3 className="text-white text-2xl font-bold mt-2">
        {value}
      </h3>
    </div>
  );
};

/* ================= SKELETON ================= */

const StatCardSkeleton = () => {
  return (
    <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-3 w-28 rounded bg-gray-200"></div>

          <div className="h-8 w-32 rounded bg-gray-300"></div>

          <div className="h-3 w-24 rounded bg-gray-200"></div>
        </div>

        <div className="h-14 w-14 rounded-2xl bg-gray-200"></div>
      </div>
    </div>
  );
};