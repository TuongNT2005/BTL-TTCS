import { useRef } from "react";

import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

export default function Slider({ children, itemWidth = 260 }) {
  const ref = useRef();

  const scroll = (dir) => {
    ref.current.scrollBy({
      left: dir === "next" ? itemWidth * 2 : -itemWidth * 2,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll("prev")}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white p-2 shadow rounded-full cursor-pointer hover:bg-violet-500 hover:text-white"
      >
        <GrFormPrevious />
      </button>

      <button
        onClick={() => scroll("next")}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white p-2 shadow rounded-full cursor-pointer hover:bg-violet-500 hover:text-white"
      >
        <MdNavigateNext />
      </button>

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scroll-smooth px-8 hide-scrollbar"
      >
        {children}
      </div>
    </div>
  );
}