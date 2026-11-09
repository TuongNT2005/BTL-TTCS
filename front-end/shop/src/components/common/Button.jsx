import React from "react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon = null,
  type = "button",
  className = "",
  onClick,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none rounded-[2px] tracking-wide focus:outline-none focus:ring-1 focus:ring-[#121316]";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5",
  }[size] || "px-5 py-2.5 text-sm gap-2";

  const variantClasses = {
    primary:
      "bg-[#121316] text-white hover:bg-black active:scale-[0.99] border border-[#121316]",
    outline:
      "bg-transparent text-[#121316] border border-[#121316] hover:bg-[#121316] hover:text-white",
    ghost:
      "bg-transparent text-[#121316] hover:bg-[#E6E4DF]/40 border border-transparent",
    danger:
      "bg-[#8C2B2B] text-white hover:bg-[#722323] active:scale-[0.99] border border-[#8C2B2B]",
    secondary:
      "bg-white text-[#121316] border border-[#E6E4DF] hover:border-[#121316]",
  }[variant] || "";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;

