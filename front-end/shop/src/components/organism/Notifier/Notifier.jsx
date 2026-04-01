import { useEffect, useRef, useContext } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import AppContext from "../../../AppContext";
import Text from "../../atom/Text/Text";
import Button from "../../atom/Button/Button";
import {cn} from "../../../util";

export default function Notifier() {

    let {isError, title, message, isOpen, onClose} = useContext(AppContext);
    let ref = useRef(null);

    useEffect(function() {
        if(!ref) {
            return;
        }
        const thisNotifier = ref.current;
        isOpen ? thisNotifier.showModal() : thisNotifier.close();

    }, [isOpen])

    return <dialog ref={ref} className={cn("m-auto px-12 py-10 rounded-xl flex flex-col justify-between items-center bg-white border-4 gap-8",
                                            !isError ? "text-green-500 border-green-500" : "text-red-500 border-red-500",
                                            isOpen ? "scale-100" : "scale-0"
    )}>
        <div className="text-5xl p-2 rounded-full border-4">
            {!isError ? <FaCheckCircle></FaCheckCircle> : <IoIosCloseCircle></IoIosCloseCircle>}
        </div>
        
        <section>
            <Text variant="lead" className={"font-bold"}>{title}</Text>
            <Text variant="body">{message}</Text>
        </section>
        <Button onClickFunc={onClose} 
                className={cn("w-full px-3 py-1 rounded-sm text-white",
                            !isError ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600",
                            "cursor-pointer"
                )}>Xác nhận</Button>
    </dialog>
}