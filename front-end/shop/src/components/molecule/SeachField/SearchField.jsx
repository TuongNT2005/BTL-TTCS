import Input from "../../atom/input/Input";
import { IoIosSearch } from "react-icons/io";
import {cn} from "../../../util";

export default function SearchField({id, className, onChange}) {
    // console.log("SearchField render, onChange =", onChange);
    return <div id={id} className={cn("flex flex-row justify-center items-center", className)}>
        <label htmlFor="admin-search-field" className="h-full aspect-square flex justify-center items-center">
            <IoIosSearch />
        </label>        
        <Input onChange={onChange} type="text" placeholder="Nhập từ khóa" name="keyword" id="admin-search-field"
                className="h-full w-full focus:outline-none"></Input>
    </div>
}