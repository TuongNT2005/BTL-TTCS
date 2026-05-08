import { useEffect, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import AppContext from "../../../AppContext";
import { cn } from "../../../util";

export default function Notifier({notifierData, setNotifierData}) {

    let { isError, title, message, isOpen} = {...notifierData};
    let ref = useRef(null);

    useEffect(function () {
        if (!ref) {
            return;
        }
        const thisNotifier = ref.current;
        isOpen ? thisNotifier.showModal() : thisNotifier.close();

    }, [isOpen])

    function onClose() {
        setNotifierData(prev => ({ ...prev, isOpen: false }));
        ref.current.close();
    }

    return <dialog ref={ref} className={cn("fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-12 py-10 rounded-xl flex flex-col justify-between items-center bg-white border-4 gap-8 transition-opacity duration-300",
        !isError ? "text-green-500 border-green-500" : "text-red-500 border-red-500"
    )} style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}>
        <div className="text-5xl p-2 rounded-full border-4">
            {!isError ? <FaCheckCircle></FaCheckCircle> : <IoIosCloseCircle></IoIosCloseCircle>}
        </div>

        <section>
            <p className="text-xl md:text-lg font-bold">{title}</p>
            <p className="text-lg md:text-sm">{message}</p>
        </section>
        <div onClick={onClose}
            className={cn("w-full px-3 py-1 rounded-sm text-white",
                !isError ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600",
                "cursor-pointer"
            )}>Xác nhận</div>
    </dialog>
}