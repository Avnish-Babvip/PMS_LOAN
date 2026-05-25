import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiCopy, FiCheck } from "react-icons/fi";
import { getRiderReferralCode } from "../../features/actions/rider/user";
import { useEffect } from "react";

const RiderReferralCode = () => {
  const dispatch = useDispatch();
  const { referralData, profileLoading } = useSelector(
    (state) => state.rider_user,
  );

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!referralData?.referral_code) return;

    try {
      await navigator.clipboard.writeText(referralData.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  useEffect(() => {
    dispatch(getRiderReferralCode());
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 w-full">
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Referral Summary
      </h2>

      {profileLoading ? (
        <div className="animate-pulse space-y-6">
          {/* Referral Code Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 border rounded-lg px-4 py-3">
            <div className="space-y-2">
              <div className="h-3 w-32 bg-gray-300 rounded"></div>
              <div className="h-6 w-40 bg-gray-300 rounded"></div>
            </div>

            <div className="h-9 w-24 bg-gray-300 rounded-lg"></div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Used */}
            <div className="bg-gray-50 border rounded-lg p-4 text-center space-y-2">
              <div className="h-3 w-20 mx-auto bg-gray-300 rounded"></div>
              <div className="h-6 w-12 mx-auto bg-gray-300 rounded"></div>
            </div>

            {/* Total Earned */}
            <div className="bg-gray-50 border rounded-lg p-4 text-center space-y-2">
              <div className="h-3 w-24 mx-auto bg-gray-300 rounded"></div>
              <div className="h-6 w-16 mx-auto bg-gray-300 rounded"></div>
            </div>

            {/* Wallet Balance */}
            <div className="bg-gray-200 rounded-lg p-4 text-center space-y-2">
              <div className="h-3 w-24 mx-auto bg-gray-300 rounded"></div>
              <div className="h-6 w-20 mx-auto bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Referral Code */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 border rounded-lg px-4 py-3 mb-6">
            <div>
              <p className="text-xs text-gray-500">Your Referral Code</p>
              <p className="font-semibold text-gray-800 tracking-wide text-lg">
                {referralData?.referral_code || "—"}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition ${
                copied
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 border rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">Total Used</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">
                {referralData?.total_used ?? 0}
              </p>
            </div>

            <div className="bg-gray-50 border rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">Total Earned</p>
              <p className="text-2xl font-semibold text-emerald-600 mt-1">
                ₹{referralData?.total_earned ?? 0}
              </p>
            </div>

            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg p-4 text-center">
              <p className="text-xs opacity-90">Wallet Balance</p>
              <p className="text-2xl font-semibold mt-1">
                ₹{referralData?.wallet_balance ?? 0}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RiderReferralCode;
