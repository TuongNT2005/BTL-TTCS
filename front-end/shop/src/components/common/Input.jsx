import React from "react";

export const Input = ({
  label,
  error,
  icon: Icon,
  className = "",
  containerClassName = "",
  id,
  required,
  ...props
}) => {
  const inputId = id || props.name || Math.random().toString(36).substr(2, 6);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-[#121316] tracking-wide flex items-center justify-between"
        >
          <span>
            {label} {required && <span className="text-[#8C2B2B]">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center w-full">
        {Icon && (
          <div className="absolute left-3.5 text-[#6B706E] pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-white text-[#121316] text-sm rounded-[2px] border transition-colors duration-200 placeholder:text-[#6B706E]/60 focus:outline-none focus:ring-1 focus:ring-[#121316] disabled:bg-[#F9F9F8] disabled:text-[#6B706E] disabled:cursor-not-allowed ${
            Icon ? "pl-10 pr-3.5 py-2.5" : "px-3.5 py-2.5"
          } ${
            error
              ? "border-[#8C2B2B] focus:border-[#8C2B2B] focus:ring-[#8C2B2B]"
              : "border-[#E6E4DF] hover:border-[#6B706E] focus:border-[#121316]"
          } ${className}`}
          {...props}
        />
      </div>

      {error && <span className="text-xs text-[#8C2B2B] mt-0.5">{error}</span>}
    </div>
  );
};

export default Input;

