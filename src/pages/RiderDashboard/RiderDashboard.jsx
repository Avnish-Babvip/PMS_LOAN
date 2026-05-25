import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveAccountCenterTab } from "../../features/slices/references";

import { getRiderDashboard } from "../../features/actions/rider/user";

export const RiderDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData, profileLoading } = useSelector(
    (state) => state.rider_user,
  );

  useEffect(() => {
    dispatch(getRiderDashboard());
    dispatch(setActiveAccountCenterTab("Dashboard"));
  }, [dispatch]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {profileLoading ? (
          Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Assigned Orders"
              value={dashboardData?.assigned_orders ?? 0}
              icon="📦"
            />
            <StatCard
              title="Picked Orders"
              value={dashboardData?.picked_orders ?? 0}
              icon="🎯"
            />
            <StatCard
              title="Delivered Today"
              value={dashboardData?.delivered_today ?? 0}
              icon="💼"
            />
            <StatCard
              title="Total Delivered"
              value={dashboardData?.total_delivered ?? 0}
              icon="🚚"
            />
            <StatCard
              title="Today Earnings"
              value={`₹${dashboardData?.today_earnings ?? 0}`}
              icon="💰"
            />
          </>
        )}
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */

const StatCard = ({ title, value, icon }) => {
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
    </div>
  );
};

const StatCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200"></div>

        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
          <div className="h-6 w-16 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};
