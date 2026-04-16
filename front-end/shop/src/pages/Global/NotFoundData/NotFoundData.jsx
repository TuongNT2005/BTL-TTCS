import { AiOutlineExclamation } from "react-icons/ai";
import { cn } from "../../../util";

export default function NotFoundData(className) {
    return <div className={cn("w-full flex-1 flex flex-col justify-center items-center gap-2 md:gap-5", className)}>
        <>
            <div className="border md:border-5 w-fit md:text-5xl text-2xl rounded-full md:p-2 p-0.5 text-yellow-500">
                <AiOutlineExclamation />
            </div>
            <p className="text-lg md:text-xl font-bold">Không có dữ liệu</p>
        </>
    </div>
}