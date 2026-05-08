import React, {useState } from "react";
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

function Topbar({ active, setActive, keyword, setKeyword }) {
    return (
        <div className="sticky top-0 left-0 z-30 border-b border-violet-100 bg-white/90 backdrop-blur">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin page - {menuItems.find((m) => m.key === active)?.label}</h1>
                    <p className="text-sm text-slate-500">Thời thượng - Chất lượng - Uy tín</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center rounded-2xl border border-violet-200 bg-violet-50 px-3">
                        <IoIosSearch size={18} className="text-violet-500" />
                        <input
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Tìm kiếm..."
                            className="h-11 w-full bg-transparent px-2 text-sm outline-none sm:w-72"
                        />
                    </div>
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



export default function Admin() {
    const [active, setActive] = useState("products");
    const [keyword, setKeyword] = useState("");
    


    return (
        <Container>
            <div className="flex relative h-screen">
                <Sidebar active={active} setActive={setActive} />
                <div className="min-w-0 flex-1 flex flex-col">
                    <Topbar active={active} setActive={setActive} keyword={keyword} setKeyword={setKeyword} />
                    <main className="space-y-6 p-4 sm:p-6 lg:p-8 flex-1 overflow-hidden">
                        {active === "products" && <ProductsSection keyword={keyword} />}
                        {active === "inventory" && <WareHouseSection keyword={keyword} />}
                        {active === "users" && <UsersSection keyword={keyword} />}
                        {active === "events" && <EventsSection keyword={keyword} />}
                        {active === "refunds" && <RefundSection keyword={keyword} />}
                        {active === "orders" && <OrderSection keyword={keyword} />}
                        {active === "dashboard" && (
                            <Card title="Tổng quan báo cáo">
                                <div className="grid gap-5 lg:grid-cols-3">
                                    <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-500 p-6 text-white lg:col-span-2">
                                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15"><IoBarChart size={26} /></div>
                                        <h3 className="text-2xl font-bold">Admin Dashboard</h3>
                                        <p className="mt-3 max-w-2xl text-sm leading-7 text-violet-50">Bản UI được tái tạo từ PDF Admin, giữ cấu trúc các tab: Sản phẩm, Kho, Người dùng, Sự kiện, Hoàn tiền; đồng thời dùng palette tím đồng bộ với trang home để nhìn hiện đại và nhất quán hơn.</p>
                                    </div>
                                    <div className="rounded-3xl border border-violet-100 bg-white p-6">
                                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><LuClock3 size={24} /></div>
                                        <p className="text-sm text-slate-500">Trạng thái hệ thống</p>
                                        <p className="mt-2 text-2xl font-bold text-slate-900">Ổn định</p>
                                        <p className="mt-2 text-sm text-slate-500">Sẵn sàng cho CRUD + API integration.</p>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </main>
                </div>
            </div>
        </Container>
    );
}
