import React from "react";
import { FiChevronDown } from "react-icons/fi";

export const Select = ({
  label,
  error,
  options = [],
  className = "",
  containerClassName = "",
  id,
  required,
  placeholder,
  ...props
}) => {
  const selectId = id || props.name || Math.random().toString(36).substr(2, 6);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-medium text-[#121316] tracking-wide"
        >
          {label} {required && <span className="text-[#8C2B2B]">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        <select
          id={selectId}
          className={`w-full appearance-none bg-white text-[#121316] text-sm rounded-[2px] border px-3.5 py-2.5 pr-9 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-[#121316] disabled:bg-[#F9F9F8] disabled:cursor-not-allowed ${
            error
              ? "border-[#8C2B2B] focus:border-[#8C2B2B]"
              : "border-[#E6E4DF] hover:border-[#6B706E] focus:border-[#121316]"
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === "object" ? opt.value : opt;
            const labelText = typeof opt === "object" ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {labelText}
              </option>
            );
          })}
        </select>
        <div className="absolute right-3 text-[#6B706E] pointer-events-none">
          <FiChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && <span className="text-xs text-[#8C2B2B] mt-0.5">{error}</span>}
    </div>
  );
};

export default Select;

