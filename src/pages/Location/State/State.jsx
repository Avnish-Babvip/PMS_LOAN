import { useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp, FiEdit2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import TableSkeleton from "../../../components/TableSkeleton";
import { getCities, getStates } from "../../../features/actions/location";
import AddCityModal from "../../../components/Modal/Location/AddCity";
import { EditCityModal } from "../../../components/Modal/Location/EditCity";

const State = () => {
  const dispatch = useDispatch();

  const { stateData, cityData, locationLoading, cityLoading } = useSelector(
    (state) => state.location,
  );

  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [openState, setOpenState] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const states = stateData || [];
  const hasData = Array.isArray(states) && states.length > 0;

  useEffect(() => {
    dispatch(getStates(40));
  }, [dispatch]);

  useEffect(() => {
    if (openState) {
      dispatch(getCities(openState));
    }
  }, [openState, dispatch]);

  const toggleRow = (id) => {
    if (openState === id) {
      setOpenState(null);
    } else {
      setOpenState(id);
      setExpanded(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">All Indian States</h2>
        </div>

        <div className="relative overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left ps-5 px-3 py-3">State</th>
                <th className="text-center px-3 py-3 w-[160px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {locationLoading ? (
                <TableSkeleton
                  rows={12}
                  columns={[{ width: "w-40 h-4" }]}
                  actionColumn
                  actionCount={1}
                  actionWidth="w-20 h-8"
                />
              ) : !hasData ? (
                <tr>
                  <td colSpan={2} className="py-28 text-center text-gray-400">
                    No state found
                  </td>
                </tr>
              ) : (
                states.map((item) => (
                  <>
                    {/* STATE ROW */}
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="ps-5 px-3 py-5 font-medium text-brand-green">
                        {item.name}
                      </td>

                      <td className="px-3 py-5 text-center">
                        <button
                          onClick={() => toggleRow(item.id)}
                          className="flex items-center gap-2 mx-auto px-3 py-2 bg-orange-100 text-orange-500 rounded-lg hover:bg-orange-200"
                        >
                          {openState === item.id ? (
                            <>
                              <FiChevronUp /> Hide Cities
                            </>
                          ) : (
                            <>
                              <FiChevronDown /> View Cities
                            </>
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* EXPANDABLE ROW */}
                    {openState === item.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={2} className="px-6 py-5">
                          {/* HEADER */}
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-semibold text-gray-700">
                              Cities
                            </h4>

                            <div className="flex gap-2">
                              {/* ADD CITY BUTTON */}
                              <button
                                onClick={() => {
                                  setOpenModal(true);
                                }}
                                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                              >
                                + Add City
                              </button>
                            </div>
                          </div>

                          {/* CITY TAGS */}
                          {/* CITY TAGS */}
                          {cityLoading ? (
                            <div className="flex flex-wrap gap-2">
                              {[...Array(14)].map((_, i) => (
                                <div
                                  key={i}
                                  className="h-7 w-20 bg-gray-200 animate-pulse rounded-md"
                                />
                              ))}
                            </div>
                          ) : cityData?.length ? (
                            <>
                              <div
                                className={`flex flex-wrap gap-2 overflow-hidden ${
                                  expanded ? "" : "max-h-[64px]"
                                }`}
                              >
                                {cityData.map((city) => (
                                  <div
                                    key={city.id}
                                    className="flex items-center gap-1 px-3 py-1 text-xs rounded-md bg-white border text-gray-700"
                                  >
                                    {city.name}

                                    <button
                                      onClick={() => {
                                        setOpenEditModal(true);
                                        setSelected(city);
                                      }}
                                      className="text-gray-400 hover:text-blue-600"
                                    >
                                      <FiEdit2 size={12} />
                                    </button>
                                  </div>
                                ))}
                              </div>

                              {cityData.length > 6 && (
                                <button
                                  onClick={() => setExpanded(!expanded)}
                                  className="text-xs text-blue-600 mt-2 hover:underline"
                                >
                                  {expanded ? "Show Less" : "Show More"}
                                </button>
                              )}
                            </>
                          ) : (
                            <p className="text-gray-400 text-sm">
                              No cities available
                            </p>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AddCityModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        id={openState}
      />
      <EditCityModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        city={selected}
        stateId={openState}
      />
    </>
  );
};

export default State;
