import {cn} from "../../../util"

const variants = {
    default: "cursor-pointer bg-white",
    redBtn: "cursor-pointer bg-red-500 hover:bg-red-600",
    blueBtn: "cursor-pointer bg-blue-500 hover:bg-blue-600",
    greenBtn: "cursor-pointer bg-green-500 hover:bg-green-600",
    violetBtn: "cursor-pointer bg-[#6193FF] hover:bg-[#3E7BFF]",
    transparentBtn: "cursor-pointer hover:bg-[#3E7BFF]"
};

export default function Button({variant="default", children, className, id, onClickFunc, typeBtn="button"}) {
    return <button type={typeBtn} className={cn("cu", variants[variant], className)}
                id={id}
                onClick={onClickFunc}
        >
            {children}
        </button>
    
}