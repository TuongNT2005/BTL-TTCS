import { cn, genID } from "../../../util";
import TableRow from "../../molecule/TableRow/TableRow";
import Button from "../../atom/Button/Button";
import Text from "../../atom/Text/Text";
import { memo } from "react";


function Table({ id, className, data, buttons}) {

    return <table id={id} className={cn("w-full overflow-y-scroll", className)}>
        <thead className="sticky top-0 bg-[#1e2939]">
            <TableRow key={genID()}
                className=""
                variant="header" data={[...data.headers, ...[...Object.keys(buttons)]]}></TableRow>

        </thead>


        <tbody>
            {data.body.map(d => <TableRow
                className={""} id={d.id}
                key={genID()} data={{ ...d, ...buttons }}></TableRow>)}
        </tbody>

    </table>
}

export default memo(Table)