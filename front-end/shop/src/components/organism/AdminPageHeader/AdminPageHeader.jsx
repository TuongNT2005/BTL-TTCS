import Button from "../../atom/Button/Button";
import SearchField from "../../molecule/SeachField/SearchField";
import Text from "../../atom/Text/Text";
import {cn} from "../../../util";

export default function AdminPageHeader({id, className, tabName, onChange, onClickAddBtn}) {

    // console.log("AdminPageHeader, onChange =", onChange);

    return <div id={id} className={cn("flex flex-row justify-around items-center gap-x-3", className)}>
        <Text variant="body" className="whitespace-nowrap font-bold">{tabName}</Text>
        <SearchField onChange={onChange} className="border h-full w-3/10"></SearchField>
        <Button onClickFunc={onClickAddBtn} variant="greenBtn" className="px-1 py-0.5 md:px-1.5 md:py-1 rounded-sm whitespace-nowrap"><Text variant="small">Thêm</Text></Button>
    </div>
}