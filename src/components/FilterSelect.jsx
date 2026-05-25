import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const FilterSelect = ({
  label = "Filter",
  value = "",
  options = [],
  onChange,
  containerClass = "",
}) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({});
  const ref = useRef(null);
  const buttonRef = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // calculate dropdown position
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      setPosition({
        top: rect.bottom + 6,
        left: rect.right - 160,
        width: rect.width,
      });
    }
  }, [open]);

  const selectedOption = options.find((opt) => (opt.value ?? opt) == value);
  const displayLabel = selectedOption?.label ?? "All";

  return (
    <div
      ref={ref}
      className={`flex items-center justify-between gap-3
        border border-gray-300 bg-white
        rounded-xl px-4 py-1
        shadow-sm relative
        ${containerClass}`}
    >
      <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
        {label}
      </span>

      {/* Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-1 text-sm text-gray-800 hover:border-gray-400 transition"
      >
        {displayLabel}
        <FiChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            width: 160,
          }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 z-[9999] overflow-hidden"
        >
          {label !== "Year" && (
            <button
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100
              ${value === "" ? "text-orange-500 font-medium" : "text-gray-700"}`}
            >
              All
            </button>
          )}

          {options.map((opt) => {
            const optLabel = opt.label ?? opt;
            const optValue = opt.value ?? opt;

            return (
              <button
                key={optValue}
                onClick={() => {
                  onChange(optValue);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                ${
                  value === optValue
                    ? "text-orange-500 font-medium"
                    : "text-gray-700"
                }`}
              >
                {optLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterSelect;
