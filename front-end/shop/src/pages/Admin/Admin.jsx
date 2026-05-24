import React, {useCallback, useRef, useState } from "react";
import { IoBarChart } from "react-icons/io5";
import { FaBoxArchive } from "react-icons/fa6";
import { FaCalendarDays } from "react-icons/fa6";
import { LiaClipboardListSolid } from "react-icons/lia";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { GoPackage } from "react-icons/go";
import { FiRefreshCcw } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { FaShoppingBag } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { LuClock3 } from "react-icons/lu";
import { IoMail } from "react-icons/io5";
import { RiShoppingBag3Fill } from "react-icons/ri";

import ProductsSection from "./ProductSection/ProductsSection";
import Card from "./Card";
import WareHouseSection from "./WareHouseSection/WareHouseSection";
import UsersSection from "./UserSection/UserSection";
import EventsSection from "./EventSection/EventSection";
import RefundSection from "./RefundSection/RefundSection";
import OrderSection from "./OrderSection/OrderSection";
import AppContext from "../../AppContext";
import { useContext } from "react";
import DashBoard from "./DashBoard/DashBoard";

const menuItems = [
    { key: "dashboard", label: "Báo cáo", icon: TbLayoutDashboardFilled },
    { key: "products", label: "Sản phẩm", icon: FaShoppingBag },
    { key: "inventory", label: "Kho", icon: FaBoxArchive },
    { key: "users", label: "Người dùng", icon: FaUser },
    { key: "events", label: "Sự kiện", icon: FaCalendarDays },
    { key: "refunds", label: "Hoàn tiền", icon: FiRefreshCcw },
    { key: "orders", label: "Đơn hàng", icon: RiShoppingBag3Fill }
];



function Container({ children }) {
    return <div className="min-h-screen bg-[#f8f7ff] text-slate-800">{children}</div>;
}

function Sidebar({ active, setActive }) {
    return (
        <aside className="hidden w-72 shrink-0 border-r border-violet-100 bg-white xl:flex xl:flex-col sticky top-0 left-0">
            <div className="border-b border-violet-100 p-6">
                <div className="text-3xl font-black tracking-wide text-violet-700">TGSHOP</div>
                <p className="mt-2 text-sm text-slate-500">Admin page</p>
            </div>
            <nav className="flex-1 space-y-2 p-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = active === item.key;
                    return (
                        <button
                            key={item.key}
                            onClick={() => setActive(item.key)}
                            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${isActive ? "bg-violet-600 text-white shadow-lg" : "text-slate-600 hover:bg-violet-50 hover:text-violet-700 cursor-pointer"
                                }`}
                        >
                            <Icon size={18} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}

function Topbar({ active, setActive, setKeyword, authUser }) {

    const timer = useRef(null);

    const debound = useCallback((e) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            setKeyword(e.target.value);
        }, 500)
    }, [setKeyword])
    
    return (
        <div className="sticky top-0 left-0 z-30 border-b border-violet-100 bg-white/90 backdrop-blur">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin page - {menuItems.find((m) => m.key === active)?.label}</h1>
                    <p className="text-sm text-slate-500">Thời thượng - Chất lượng - Uy tín</p>
                </div>
                {/* onChange={(e) => setKeyword(e.target.value)} */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center rounded-2xl border border-violet-200 bg-violet-50 px-3">
                        <IoIosSearch size={18} className="text-violet-500" />
                        <input
                            onChange={debound}
                            placeholder="Tìm kiếm..."
                            className="h-11 w-full bg-transparent px-2 text-sm outline-none sm:w-72"
                        />
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-2.5 shadow-sm">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">A</div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">{authUser.username}</p>
                            <div className="flex items-center gap-1 text-xs text-slate-500"><IoMail size={12} /> {authUser.email}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-8 xl:hidden">
                {menuItems.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setActive(item.key)}
                        className={`whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-semibold ${active === item.key ? "bg-violet-600 text-white" : "bg-white text-slate-600 border border-violet-100"}`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
}


export default function Admin() {
    const [active, setActive] = useState("products");
    const [keyword, setKeyword] = useState("");
    const {authUser} = useContext(AppContext);

    console.log(authUser);

    return (
        <Container>
            <div className="flex relative h-screen">
                <Sidebar active={active} setActive={setActive} />
                <div className="min-w-0 flex-1 flex flex-col">
                    <Topbar active={active} setActive={setActive} setKeyword={setKeyword} authUser={authUser}/>
                    <main className="space-y-6 p-4 sm:p-6 lg:p-8 flex-1 overflow-hidden">
                        {active === "products" && <ProductsSection keyword={keyword} />}
                        {active === "inventory" && <WareHouseSection keyword={keyword} />}
                        {active === "users" && <UsersSection keyword={keyword} />}
                        {active === "events" && <EventsSection keyword={keyword} />}
                        {active === "refunds" && <RefundSection keyword={keyword} />}
                        {active === "orders" && <OrderSection keyword={keyword} />}
                        {active === "dashboard" && <DashBoard></DashBoard>}
                    </main>
                </div>
            </div>
        </Container>
    );
}
