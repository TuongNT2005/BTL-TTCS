
import React, {useState, useContext } from "react";
import AppContext from "../../AppContext";

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

import Profile from "./Profile/Proflile";
import CartSection from "./CartSection/CartSection";
import OrderSection from "./OrderSection/OrderSection";
import HistorySection from "./History/HistorySection";
import RefundRequestSection from "./RefundRequestSection/RefundRequestSection";

const menuItems = [
    { key: "personal", label: "Cá nhân", icon: TbLayoutDashboardFilled },
    { key: "carts", label: "Gior hàng", icon: FaShoppingBag },
    { key: "orders", label: "Đơn hàng", icon: FaBoxArchive },
    { key: "history", label: "Lịch sử", icon: FaUser },
    { key: "refund", label: "Yêu cầu hoàn trả", icon: FaUser },
];


export default function CustomerPage() {
    const [activeSection, setActiveSection] = useState("products");
    const [keyword, setKeyword] = useState("");
    const {authUser} = useContext(AppContext);

    console.log(authUser);

    return (
        <Container>
            <div className="flex relative h-screen">
                <Sidebar active={activeSection} setActive={setActiveSection} />
                <div className="min-w-0 flex-1 flex flex-col">
                    <Topbar active={activeSection} setActive={setActiveSection} keyword={keyword} setKeyword={setKeyword} />
                    <main className="space-y-6 p-4 sm:p-6 lg:p-8 flex-1 overflow-hidden">

                        {activeSection === "personal" && <Profile user={authUser}></Profile>}
                        {activeSection === "carts" && <CartSection></CartSection>}
                        {activeSection === "orders" && <p><OrderSection></OrderSection></p>}
                        {activeSection === "history" && <p><HistorySection></HistorySection></p>}
                        {activeSection === "refund" && <p><RefundRequestSection></RefundRequestSection></p>}
                        
                    </main>
                </div>
            </div>
        </Container>
    );
}


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
                            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${isActive ? "bg-violet-600 text-white shadow-lg" : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
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

function Topbar({ active, setActive}) {
    return (
        <div className="sticky top-0 left-0 z-30 border-b border-violet-100 bg-white/90 backdrop-blur">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Customer page - {menuItems.find((m) => m.key === active)?.label}</h1>
                    <p className="text-sm text-slate-500">Thời thượng - Chất lượng - Uy tín</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-2.5 shadow-sm">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">A</div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Admin</p>
                            <div className="flex items-center gap-1 text-xs text-slate-500"><IoMail size={12} /> Admin@gmail.com</div>
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

