import { cn, isImg, genID, getImgPath } from "../../../util";
import TableCell from "../../atom/TableCell/TableCell";
import altImg from "../../../../../../uploads/default.jpg";
import Text from "../../atom/Text/Text";



export default function TableRow({ id, className, variant = "data", data }) {

    
    let cells;
    if (variant === "data") {
        let keys = Object.keys(data);
        cells = keys.map(key => {
            return <TableCell key={genID()} variant={variant}>{
                isImg(key) ? <img src={data[key] === "" ? altImg : getImgPath(data[key])} alt="img" className="max-h-24 m-auto"/> : <Text variant="small">{data[key]}</Text>
            }</TableCell>
        });
    }
    else {
        cells = data.map(d => <TableCell key={genID()} variant={variant}>{d}</TableCell>)
    }



    return <tr id={id} className={cn("even:bg-gray-800", className)}>
        {cells}
    </tr>
}