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
}) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div>
      <label className="text-gray-700 text-sm font-medium">{label}</label>

      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          {...register(name, {
            ...(required && { required: `${label} is required` }),
            ...rules,
          })}
          disabled={disabled}
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
    <label className="text-gray-700 text-sm font-medium">{label}</label>

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
    <label className="text-gray-700 text-sm font-medium">{label}</label>

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
    <label className="text-gray-700 text-sm font-medium">{label}</label>

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

export const Checkbox = React.forwardRef(({ label, ...props }, ref) => (
  <label className="flex items-center gap-2 text-sm text-gray-300">
    <input
      type="checkbox"
      ref={ref}
      {...props}
      value={1}
      className="accent-blue-600"
    />
    {label}
  </label>
));

export const AttributeSelectWithId = ({
  label,
  name,
  options = [],
  register,
  watch, // 👈 add this
  errors,
  required,
}) => {
  const value = watch ? watch(name) : undefined;

  return (
    <div>
      <label className="text-gray-700 text-sm font-medium">{label}</label>

      <select
        value={value ?? ""} // ✅ make it controlled
        {...register(name, { required })}
        className="
          w-full mt-1 rounded-lg p-2.5 text-sm
          bg-white border border-gray-300
          text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none
        "
      >
        <option value="">Select {label}</option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {errors?.[name] && (
        <p className="text-red-500 text-xs mt-1">{label} is required</p>
      )}
    </div>
  );
};
