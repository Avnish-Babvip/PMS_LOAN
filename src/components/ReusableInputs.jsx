// ✅ Reusable input/select components
import React from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export const Input = ({
  label,
  type = "text",
  placeholder,
  register,
  name,
  required,
  rules = {},
  errors,
  disabled = false,
  maxLength = 50,
  minLength = 2,
}) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div>
      <label className="text-gray-700 text-sm font-medium">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>

      <div className="relative">
        <input
          minLength={minLength}
          maxLength={maxLength}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          {...register(name, {
            ...(required && { required: `${label} is required` }),
            ...rules,
          })}
          disabled={disabled}
          onKeyDown={(e) => {
            if (isPassword && e.key === " ") {
              e.preventDefault();
            }
          }}
          onPaste={(e) => {
            if (isPassword) {
              const pastedText = e.clipboardData.getData("text");
              if (/\s/.test(pastedText)) {
                e.preventDefault();
              }
            }
          }}
          className={`
            w-full mt-1 rounded-lg text-sm
            px-3 py-2.5 pr-10 border transition-all
            ${
              disabled
                ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white border-gray-300 text-gray-800 focus:border-gray-400 outline-none"
            }
          `}
        />

        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>

      {errors?.[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export const Textarea = ({
  label,
  placeholder,
  register,
  name,
  required,
  errors,
  disabled,
}) => (
  <div>
    <label className="text-gray-700 text-sm font-medium">
      {label} {required && <span className="text-red-600"> *</span>}
    </label>

    <textarea
      placeholder={placeholder}
      disabled={disabled}
      {...register(name, { required })}
      className="
        w-full mt-1 rounded-lg p-3 text-sm
        bg-white border border-gray-300
        text-gray-800  focus:border-gray-400 outline-none
      "
    />

    {errors?.[name] && (
      <p className="text-red-500 text-xs mt-1">{`${label} is required`}</p>
    )}
  </div>
);

export const Select = ({
  label,
  name,
  register,
  options,
  required,
  errors,
}) => (
  <div>
    <label className="text-gray-700 text-sm font-medium">
      {label} {required && <span className="text-red-600"> *</span>}
    </label>

    <select
      {...register(name, { required })}
      className="
        w-full mt-1 rounded-lg p-2.5 text-sm
        bg-white border border-gray-300
        text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none
      "
    >
      <option value="">Select {label}</option>
      {options.map((opt, i) => (
        <option key={i}>{opt}</option>
      ))}
    </select>

    {errors?.[name] && (
      <p className="text-red-500 text-xs mt-1">{`${label} is required`}</p>
    )}
  </div>
);

export const SelectWithId = ({
  label,
  name,
  options = [],
  register,
  errors,
  required,
}) => (
  <div>
    <label className="text-gray-700 text-sm font-medium">
      {label} {required && <span className="text-red-600"> *</span>}
    </label>

    <select
      {...register(name, { required })}
      className="
        w-full mt-1 rounded-lg p-2.5 text-sm
        bg-white border border-gray-300
        text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none
      "
    >
      <option value="">Select {label}</option>

      {options.map((opt, i) => (
        <option key={i} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>

    {errors?.[name] && (
      <p className="text-red-500 text-xs mt-1">{`${label} is required`}</p>
    )}
  </div>
);
