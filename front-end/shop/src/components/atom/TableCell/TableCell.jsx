import {cn} from "../../../util";

export default function TableCell({id, className, variant="data", children}) {

    const Tag = variant === "header" ? "th" : "td"; 

    return <Tag id={id} className={cn("py-2", className)}>
        {children}
    </Tag>
}