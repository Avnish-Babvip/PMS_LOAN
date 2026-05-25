import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRiderCommission } from "../../features/actions/rider/user";

const RiderCommission = () => {
  const dispatch = useDispatch();
  const { commissionData, profileLoading } = useSelector(
    (state) => state.rider_user,
  );
  const commission = commissionData;
  useEffect(() => {
    dispatch(getRiderCommission());
  }, []);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* ===== HEADER ===== */}
        <div className="px-6 py-5 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">
            Rider Commission
          </h2>
          <p className="text-sm text-gray-500">
            Overview of your current wallet balance
          </p>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="p-6">
          {profileLoading ? (
            <div className="grid md:grid-cols-3 gap-6 animate-pulse">
              <div className="md:col-span-2 bg-gray-200 rounded-xl p-6">
                <div className="h-4 w-32 bg-gray-300 rounded mb-4"></div>
                <div className="h-10 w-24 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 w-64 bg-gray-300 rounded"></div>
              </div>

              <div className="bg-gray-100 rounded-xl p-6 border">
                <div className="h-4 w-40 bg-gray-300 rounded mb-6"></div>

                <div className="space-y-4">
                  <div>
                    <div className="h-3 w-16 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                  </div>

                  <div>
                    <div className="h-3 w-16 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-20 bg-gray-300 rounded"></div>
                  </div>

                  <div>
                    <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : !commission ? (
            <div className="text-center py-10 text-gray-400">
              No commission data available
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Commission Highlight Card */}
              <div className="md:col-span-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl p-6 shadow-md">
                <p className="text-sm opacity-90">Commission Rate</p>

                <h3 className="text-4xl font-bold mt-2">
                  {commission.type === "percentage"
                    ? `${commission.value}%`
                    : commission.type === "fixed"
                      ? `₹${commission.value}`
                      : `NA`}
                </h3>

                <p className="text-sm mt-3 opacity-90">
                  {commission.description}
                </p>
              </div>

              {/* Commission Details Card */}
              <div className="bg-gray-50 rounded-xl p-6 border">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Commission Details
                </h4>

                <div className="space-y-4 text-sm text-gray-600">
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <p className="font-medium text-gray-800 capitalize">
                      {commission.type || "NA"}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-400">Value:</span>
                    <p className="font-medium text-gray-800">
                      {commission.type === "percentage"
                        ? `${commission.value}%`
                        : commission.type === "fixed"
                          ? `₹${commission.value}`
                          : `NA`}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RiderCommission;
