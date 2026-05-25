import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRiderWallet } from "../../features/actions/rider/wallet";

const RiderWallet = () => {
  const dispatch = useDispatch();
  const { walletData, walletLoading } = useSelector(
    (state) => state.rider_wallet,
  );
  const wallet = walletData;
  useEffect(() => {
    dispatch(getRiderWallet());
  }, []);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* ===== HEADER ===== */}
        <div className="px-6 py-5 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Rider Wallet</h2>
          <p className="text-sm text-gray-500">
            Overview of your current wallet balance
          </p>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="p-6">
          {walletLoading ? (
            <div className="grid md:grid-cols-3 gap-6 animate-pulse">
              {/* Balance Card Skeleton */}
              <div className="md:col-span-2 bg-gray-200 rounded-xl p-6">
                <div className="h-4 w-32 bg-gray-300 rounded mb-4"></div>
                <div className="h-10 w-40 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 w-48 bg-gray-300 rounded"></div>
              </div>

              {/* Rider Info Card Skeleton */}
              <div className="bg-gray-100 rounded-xl p-6 border">
                <div className="h-4 w-40 bg-gray-300 rounded mb-6"></div>

                <div className="space-y-4">
                  <div>
                    <div className="h-3 w-16 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-28 bg-gray-300 rounded"></div>
                  </div>

                  <div>
                    <div className="h-3 w-16 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-40 bg-gray-300 rounded"></div>
                  </div>

                  <div>
                    <div className="h-3 w-16 bg-gray-300 rounded mb-2"></div>
                    <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : !wallet ? (
            <div className="text-center py-10 text-gray-400">
              No wallet data available
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Balance Card */}
              <div className="md:col-span-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl p-6 shadow-md">
                <p className="text-sm opacity-90">Available Balance</p>
                <h3 className="text-4xl font-bold mt-2">₹{wallet.balance}</h3>
                <p className="text-sm mt-2 opacity-80">
                  Last Updated:{" "}
                  {new Date(wallet.updated_at).toLocaleDateString()}
                </p>
              </div>

              {/* Rider Info Card */}
              <div className="bg-gray-50 rounded-xl p-6 border">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Rider Information
                </h4>

                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <p className="font-medium text-gray-800">
                      {wallet.rider_name}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-400">Email:</span>
                    <p className="font-medium text-gray-800">
                      {wallet.rider_email}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full capitalize ${
                        wallet.rider_status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {wallet.rider_status}
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

export default RiderWallet;
