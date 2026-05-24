import { cn } from "../../../util"

export default function SummaryCard({title, figure, className}) {
    return <>
        <div className={cn("w-4/10 md:w-3/10 px-1 py-2 md:px-2 md:py-4 rounded-2xl ", className)}>
            <p className="text-xs md md:text-sm">{title}</p>
            <p className="text-xl md:text-3xl font-bold">{figure}</p>
        </div>
    </>
}