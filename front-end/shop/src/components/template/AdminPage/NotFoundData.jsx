import { AiOutlineExclamation } from "react-icons/ai";
import Text from "../../atom/Text/Text";
import { cn } from "../../../util";

export default function NotFoundData(className) {
    return <div className={cn("w-full flex-1 flex justify-center items-center", className)}>
        <>
            <div className="border md:border-5 w-fit md:text-5xl text-2xl rounded-full md:p-2 p-0.5 text-yellow-500">
                <AiOutlineExclamation />
            </div>
            <Text variant="body">Không có dữ liệu</Text>
        </>
    </div>
}