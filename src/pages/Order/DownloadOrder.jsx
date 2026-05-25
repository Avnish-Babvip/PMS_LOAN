import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { exportOrders } from "../../features/actions/order";
import FilterSelect from "../../components/FilterSelect";
import { Spinner } from "../../components/Loader/Spinner";

const DownloadOrder = () => {
  const dispatch = useDispatch();
  const { adminData } = useSelector((state) => state.authentication);
  const loginToken = adminData?.token;
  const [filter, setFilter] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("delivered");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    let payload = {};

    if (filter === "custom") {
      payload = {
        filter: "custom",
        start_date: startDate,
        end_date: endDate,
        status,
      };
    } else {
      payload = {
        filter,
        type: "xlsx",
      };
    }

    try {
      setLoading(true);
      await dispatch(exportOrders({ payload, loginToken }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-gray-600 rounded-xl shadow-sm p-6 mx-auto max-w-3xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Download Orders
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        {/* FILTER */}
        <div>
          <FilterSelect
            label="Filter Type"
            value={filter}
            options={[
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
              { label: "Custom", value: "custom" },
            ]}
            onChange={(val) => setFilter(val)}
          />
        </div>

        {/* STATUS */}
        {filter === "custom" && (
          <FilterSelect
            label="Status"
            value={status}
            options={[
              { label: "Delivered", value: "delivered" },
              { label: "Pending", value: "pending" },
              { label: "Cancelled", value: "cancelled" },
            ]}
            onChange={(val) => setStatus(val)}
          />
        )}

        {/* START DATE */}
        {filter === "custom" && (
          <div>
            <label className="text-sm font-medium text-gray-600">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            />
          </div>
        )}

        {/* END DATE */}
        {filter === "custom" && (
          <div>
            <label className="text-sm font-medium text-gray-600">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            />
          </div>
        )}
      </div>

      {/* DOWNLOAD BUTTON */}
      <div className="mt-6">
        <button
          disabled={loading}
          onClick={handleDownload}
          className="px-6 py-2 bg-brand-green text-white rounded-lg hover:bg-emerald-600 disabled:opacity-60"
        >
          {loading ? <Spinner /> : "Download Excel"}
        </button>
      </div>
    </div>
  );
};

export default DownloadOrder;
