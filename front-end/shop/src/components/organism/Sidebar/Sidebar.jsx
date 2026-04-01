import { cn } from "../../../util";
import LogoField from "../../molecule/LogoField/LogoField";
import NavItem from "../../molecule/NavItem/NavItem";
import { GrAnalytics } from "react-icons/gr";
import { FaCartPlus } from "react-icons/fa";
import { FaWarehouse } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { HiSpeakerphone } from "react-icons/hi";
import { RiCopperCoinFill } from "react-icons/ri";
import { MdNavigateNext } from "react-icons/md";
import "./sidebar.css";



export default function Sidebar({ id, className }) {
    return <>
        <input type="checkbox" name="sidebar-trigger" id="sidebar-trigger" className="hidden" />
        <div id={id} className={cn("w-max h-screen p-5 bg-black flex flex-col justify-start gap-y-10 relative border-r", className)}>
            <label id="nav-trigger-lable" htmlFor="sidebar-trigger" className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 aspect-square p-2 rounded-full border bg-black z-10 cursor-pointer">
                <MdNavigateNext />
            </label>
            <section>
                <LogoField className={"px-3"}></LogoField>
            </section>
            <section className="flex flex-col justify-center items-start w-full">
                <hr className="mb-1 w-full" />
                <NavItem id="sidebar-item" className={"h-12.5 w-full"} title="Báo báo" iconComponent={<GrAnalytics />} navLink="#"></NavItem>
                <NavItem id="sidebar-item" className={"h-12.5 w-full"} title="Sản phẩm" iconComponent={<FaCartPlus />} navLink="#"></NavItem>
                <NavItem id="sidebar-item" className={"h-12.5 w-full"} title="Kho" iconComponent={<FaWarehouse />} navLink="/warehouse"></NavItem>
                <NavItem id="sidebar-item" className={"h-12.5 w-full"} title="Người dùng" iconComponent={<FaUser />} navLink="#"></NavItem>
                <NavItem id="sidebar-item" className={"h-12.5 w-full"} title="Sự kiện" iconComponent={<HiSpeakerphone />} navLink="#"></NavItem>
                <NavItem id="sidebar-item" className={"h-12.5 w-full"} title="Hoàn tiền" iconComponent={<RiCopperCoinFill />} navLink="#"></NavItem>
            </section>
            <section>

            </section>
        </div>
    </>
}