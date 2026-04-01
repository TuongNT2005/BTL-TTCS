import { cn, genID } from "../../../util";
import PageNumber from "../../atom/PageNumber/PageNumber";
import Text from "../../atom/Text/Text";
import { GrFormNext } from "react-icons/gr";
import { GrFormPrevious } from "react-icons/gr";

export default function Navigation({ id, className, totalNumber, currentNumber=1, numberPerLine, funcs }) {

    let startNumber = Math.floor(currentNumber / numberPerLine);
    let endNumber = (startNumber + 1) * numberPerLine > totalNumber ? totalNumber : (startNumber + 1) * numberPerLine;
    let numberSet = [];
    for (let i = startNumber === 0 ? 1 : startNumber * numberPerLine; i <= endNumber; i++) {
        numberSet.push(i);
    }

    return <div id={id} className={cn("flex flex-row items-center justify-center", className)}>
        <div onClick={funcs.onClickPrevPage} className="aspect-square h-full p-2 border rounded-full cursor-pointer hover:bg-[#5F43FF] flex items-center justify-center">
            <GrFormPrevious />
        </div>
        
        {
            numberSet.map(number => <PageNumber 
                id = {number}
                onClick = {funcs.onChangeNumberOfPage}
                className={ cn(number === currentNumber ? "bg-[#5F43FF]" : "",
                            "aspect-square h-full p-0.5 md:p-1")} key={genID()}>
                <Text variant="label">{number}</Text>
                </PageNumber>)
        }
        <div onClick={funcs.onClickNextPage} className="aspect-square h-full p-2 border rounded-full cursor-pointer hover:bg-[#5F43FF] flex items-center justify-center">
            <GrFormNext />
        </div>
        
        
    </div>
}