import { Link } from "react-router-dom";
import {cn} from "../../../util";
import Text from "../../atom/Text/Text";
import { useNavigate } from "react-router-dom";

export default function NavItem({id, className, iconComponent, title, navLink}) {


    return <Link to={navLink} className="w-full">
        <div id={id} className={cn("bg-black hover:bg-[#5F43FF] flex justify-start items-center p-2 gap-x-4", className)}>
            <div className="text-xl md:text-2xl flex justify-center items-center z-10 h-full ">
                {iconComponent}
            </div>
            <div className="">
                <Text variant="bodyLg" id="nav-text" className="font-bold w-max">{title}</Text>
            </div>
        </div>
    </Link>
}