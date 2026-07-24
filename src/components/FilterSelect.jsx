import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const FilterSelect = ({
  label = "Filter",
  value = "",
  options = [],
  onChange,
  containerClass = "",
  placeholder = "All",
  showAllOption = true,
  disabled = false,
  error = "",
}) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({});
  const ref = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      setPosition({
        top: rect.bottom + 6,
        left: rect.right - 160,
      });
    }
  }, [open]);

  const selectedOption = options.find(
    (opt) => String(opt.value ?? opt) === String(value),
  );

  const displayLabel =
    selectedOption?.label ??
    (String(value) === "1"
      ? "Active"
      : String(value) === "0"
        ? "Inactive"
        : placeholder);

  return (
    <div className={`flex flex-col ${containerClass}`} ref={ref}>
      <div
        className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-1 h-12 shadow-sm transition
  ${
    disabled
      ? "cursor-not-allowed bg-gray-100 border-gray-200"
      : error
        ? "border-red-500"
        : "border-gray-300"
  }`}
      >
        <span className="shrink-0 whitespace-nowrap text-sm font-medium text-gray-600">
          {label}
        </span>

        <button
          ref={buttonRef}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((p) => !p)}
          className="flex w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 transition hover:border-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          <span className="min-w-0 flex-1 truncate text-left">
            {displayLabel}
          </span>

          <FiChevronDown
            size={16}
            className={`flex-shrink-0 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {open && !disabled && (
        <div
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            width: 200,
          }}
          className="z-[9999] max-h-72 overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-lg"
        >
          {showAllOption && (
            <button
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                value === "" ? "font-medium text-orange-500" : "text-gray-700"
              }`}
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
                className={`w-full whitespace-normal break-words px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                  String(value) === String(optValue)
                    ? "font-medium text-orange-500"
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
