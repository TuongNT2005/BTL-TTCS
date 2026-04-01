import {cn} from "../../../util";


export default function PageNumber({id, className, children, onClick}) {
    return <div onClick={onClick} id={id} className={cn("rounded-full hover:bg-[#5F43FF] flex justify-center items-center border cursor-pointer", className)}>
        {children}
    </div>
}