import React from "react";
import { BiChevronDown } from "react-icons/bi";

const statusClasses = {
  WK: "bg-blue-700 text-blue-200",
  P: "bg-green-700 text-green-200",
  A: "bg-red-700 text-red-200",
  HL: "bg-cyan-700 text-cyan-200",
  CL: "bg-purple-700 text-purple-200",
  PL: "bg-pink-700 text-pink-200",
};

const days = [
  { date: "01", day: "Sat" },
  { date: "02", day: "Sun" },
  { date: "03", day: "Mon" },
  { date: "04", day: "Tue" },
  { date: "05", day: "Wed" },
  { date: "06", day: "Thu" },
  { date: "07", day: "Fri" },
  { date: "08", day: "Sat" },
  { date: "09", day: "Sun" },
  { date: "10", day: "Mon" },
  { date: "11", day: "Tue" },
  { date: "12", day: "Wed" },
  { date: "13", day: "Thu" },
  { date: "14", day: "Fri" },
  { date: "15", day: "Sat" },
  { date: "16", day: "Sun" },
  { date: "17", day: "Mon" },
  { date: "18", day: "Tue" },
  { date: "19", day: "Wed" },
  { date: "20", day: "Thu" },
];

const employees = [
  {
    id: 1,
    name: "Ritik Saxena",
    img: "/img/1.jpg",
    status: [
      "WK",
      "WK",
      "P",
      "A",
      "P",
      "WK",
      "P",
      "WK",
      "P",
      "HL",
      "P",
      "CL",
      "WK",
      "P",
      "P",
      "P",
      "A",
      "HL",
      "WK",
    ],
  },
  {
    id: 2,
    name: "Nisha",
    img: "/img/2.jpg",
    status: [
      "WK",
      "WK",
      "P",
      "P",
      "P",
      "WK",
      "P",
      "WK",
      "P",
      "HL",
      "P",
      "CL",
      "WK",
      "P",
      "P",
      "P",
      "A",
      "HL",
      "WK",
    ],
  },
];

export default function TableComponent() {
  return (
    <div className="w-full px-4 bg-[#0D0E14]  text-white overflow-x-hidden">
      {/* Header Section */}
      <div className="flex gap-5 items-center 2xl:justify-between mb-4">
        <h2 className="text-lg font-semibold">55 Employees</h2>

        <div className="flex gap-3">
          <button className="bg-[#1B1C24] px-3 py-2 rounded-lg border border-[#2A2B38] flex items-center gap-2 text-sm">
            JAN 2021 <BiChevronDown />
          </button>
          <button className="bg-[#1B1C24] px-3 py-2 rounded-lg border border-[#2A2B38] flex items-center gap-2 text-sm">
            Department <BiChevronDown />
          </button>
          <button className="bg-[#1B1C24] px-3 py-2 rounded-lg border border-[#2A2B38] flex items-center gap-2 text-sm">
            Location <BiChevronDown />
          </button>
          <button className="bg-[#1B1C24] px-3 py-2 rounded-lg border border-[#2A2B38] flex items-center gap-2 text-sm">
            All Employees <BiChevronDown />
          </button>
        </div>
      </div>

      {/* Scroll Container (mobile scrolls horizontally) */}
      <div className="overflow-x-auto no-scrollbar border border-[#1E1F29] rounded-xl">
        <table className="min-w-[1200px] w-full">
          {/* Table Header */}
          <thead className="bg-[#12121A] sticky top-0 z-10">
            <tr>
              <th className="p-3 text-left w-52 border-r border-[#1E1F29]">
                Employee Name
              </th>

              {days.map((d, i) => (
                <th
                  key={i}
                  className="px-3 py-2 text-center text-xs border-r border-[#1E1F29]"
                >
                  <div className="flex flex-col items-center">
                    <span>Jan {d.date}</span>
                    <span className="text-gray-400">{d.day}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-[#0D0B21]">
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t border-[#1E1F29]">
                <td className="flex items-center gap-3 p-3 border-r border-[#1E1F29]">
                  <img
                    src={emp.img}
                    className="w-9 h-9 rounded-full object-cover"
                    alt=""
                  />
                  <span className="text-sm font-medium">{emp.name}</span>
                </td>

                {emp.status.map((s, i) => (
                  <td
                    key={i}
                    className="p-2 text-xs text-center border-r border-[#1E1F29]"
                  >
                    <span
                      className={`px-2 py-1 rounded-md block ${statusClasses[s]}`}
                    >
                      {s}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
