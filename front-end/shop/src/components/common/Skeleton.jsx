import React from "react";

export const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-[#E6E4DF]/60 rounded-[2px] ${className}`}
    />
  );
};

export default Skeleton;

