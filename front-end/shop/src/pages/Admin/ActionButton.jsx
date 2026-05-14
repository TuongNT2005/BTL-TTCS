import { FaEye } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";
import { GoXCircle } from "react-icons/go";

export default function ActionButtons({id, onOpenDetailForm=function(){} }) {
  return (
    <div id={id} className="flex flex-wrap gap-2">
      <button className="inline-flex items-center gap-2 rounded-xl bg-violet-500 hover:bg-violet-800 px-3 py-2 text-xs font-semibold text-white cursor-pointer" onClick={onOpenDetailForm}><FaEye size={14} /> Chi tiết</button>
    </div>
  );
}