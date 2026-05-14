import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

export default function Pagination({ totalPage, currentPage = 1, numberPerLine, onGoClickPage, onGoNextPage, onGoPrevPage }) {

    let startPage = Math.floor(currentPage / numberPerLine);
    let endNumber = (startPage + 1) * numberPerLine > totalPage ? totalPage : (startPage + 1) * numberPerLine;
    let pageNumbers = [];
    for (let i = startPage === 0 ? 1 : startPage * numberPerLine; i <= endNumber; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="mt-5 flex items-center justify-center gap-2">
            <button className="rounded-xl border border-violet-200 p-2 text-violet-700 cursor-pointer hover:bg-violet-600 hover:text-white"><FaChevronLeft size={16} onClick={onGoPrevPage}/></button>
            {pageNumbers.map((n) => <button onClick={onGoClickPage} key={n} className={`h-9 w-9 rounded-xl text-sm font-semibold cursor-pointer hover:bg-violet-600 hover:text-white ${n == currentPage ? "bg-violet-600 text-white" : "border border-violet-200 text-violet-700"}`}>{n}</button>)}
            <button className="rounded-xl border border-violet-200 p-2 text-violet-700 cursor-pointer hover:bg-violet-600 hover:text-white"><FaChevronRight size={16} onClick={onGoNextPage}/></button>
        </div>
    );
}
