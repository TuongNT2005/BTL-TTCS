import { FaPlus } from "react-icons/fa";

import Card from "../Card";
import { useState, useContext, useCallback, useEffect } from "react";
import Table from "../Table";
import Badge from "../../Global/Bagde/Bagde";
import ActionButtons from "../ActionButton";
import Pagination from "../Pagination";
import AppContext from "../../../AppContext"
import api from "../../../api";
import Loading from "../../Global/Loading/Loading";
import EventSectionContext from "./EventSectionContext";
import EventEditForm from "./EventEditForm";
import EventCreateForm from "./EventCreateForm";
import { fetchApiFunc, formatDate, getEventBadgeValue } from "../../../util";

export default function EventsSection({ keyword }) {

    const { token } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [productList, setProductList] = useState("");
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [editFormState, setEditFormState] = useState({ isEditFormOpen: false, eventId: 1 });
    const [refreshKey, setRefreshKey] = useState("");
    const [curPage, setCurPage] = useState(1);
    const [startAt, setStartAt] = useState("");
    const [endAt, setEndAt] = useState("");
    const [totalPage, setTotalPage] = useState(100);
    const [events, setEvents] = useState([
        { id: 1, title: "Ưu đãi xuân 2026", discount: "10%", startAt: "21/01/2026", endAt: "21/04/2026", status: "ACTIVE" },
        { id: 2, title: "Ưu đãi đông 2025", discount: "5%", startAt: "11/10/2025", endAt: "01/01/2026", status: "Unavailable" },
        { id: 3, title: "Chào tân sinh viên", discount: "15%", startAt: "11/06/2026", endAt: "11/08/2026", status: "Coming" },
    ])

    const onGoNextPage = useCallback(function () {
        let nextPage = curPage + 1;
        nextPage = nextPage > totalPage ? totalPage : nextPage;
        setCurPage(nextPage);
    }, [curPage, totalPage])

    const onGoPrevPage = useCallback(function () {
        let prevPage = curPage - 1;
        prevPage = prevPage <= 0 ? 1 : prevPage;
        setCurPage(prevPage);
    }, [curPage])

    let onGoClickPage = useCallback(function (e) {
        let clickedPageNumber = e.target.innerText;
        setCurPage(clickedPageNumber);
    }, [])

    let onOpenDetailForm = useCallback(function (e) {
        const eventId = e.target.parentElement.id;
        setEditFormState({ isEditFormOpen: true, eventId: eventId });
    }, [])

    let onOpenCreateForm = useCallback(function () {
        console.log("clicked");
        setIsCreateFormOpen(true);
    }, [setIsCreateFormOpen]);

    let onChangeStartAt = useCallback(function () {
        const start = document.getElementById("startAtInput").value;
        console.log(start);
        setStartAt(start);
    }, [])

    let onChangeEndAt = useCallback(function () {
        const end = document.getElementById("endAtInput").value;
        setEndAt(end);
    }, [])

    const searchData = useCallback(async function () {
        try {
            setIsLoading(true);
            const res1 = await fetchApiFunc("", `${api.admin.eventTab.searchEvent}?keyword=${keyword}&page=${curPage}&startAt=${formatDate(startAt)}&endAt=${formatDate(endAt)}`, "GET", token);
            const res2 = await fetchApiFunc("", api.admin.warehouseTab.getAllProducts, "GET", token);
            console.log(res2);
            setEvents(res1.data.events.content);
            setProductList(res2.data);
            return res1;
        } catch (error) {
            alert(error);
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    }, [keyword, token, setIsLoading, curPage, endAt, startAt])

    useEffect(() => {
        async function fetchData() {
            const res = await searchData();
            setTotalPage(res.data.events.totalPages);
        }

        fetchData();
    }, [searchData, refreshKey])

    // Reset page khi keyword thay đổi
    useEffect(() => {
        setCurPage(1);
    }, [keyword]);


    return <EventSectionContext.Provider value={{ ...editFormState, setEditFormState, refreshKey, setRefreshKey, productList, isCreateFormOpen, setIsCreateFormOpen }}>
        <> {editFormState.isEditFormOpen ? <EventEditForm></EventEditForm> : isCreateFormOpen ? <EventCreateForm></EventCreateForm> : <></>}
            {
                !editFormState.isEditFormOpen && !isCreateFormOpen && isLoading ? <Loading></Loading> :
                    <div className="space-y-6 h-full">
                        <div className="w-full flex flex-col md:flex-row md:gap-x-2 ">
                            <div className="flex flex-row gap-2">
                                <label htmlFor="startAtInput" className="font-bold">Ngày bắt đầu: </label>
                                <input onChange={onChangeStartAt} defaultValue={startAt} type="date" className="border px-1 py-0.5 rounded-lg border-violet-200" id="startAtInput" />
                            </div>
                            <div className="flex flex-row gap-2">
                                <label htmlFor="endAtInput" className="font-bold">Ngày kết thúc: </label>
                                <input onChange={onChangeEndAt} defaultValue={endAt} type="date" className="border px-1 py-0.5 rounded-lg border-violet-200" id="endAtInput" />
                            </div>
                        </div>
                        <Card title="Sự kiện" action={<button onClick={onOpenCreateForm} className="h-full inline-flex items-center gap-2 rounded-2xl bg-green-500 hover:bg-green-600 px-4 py-2.5 text-sm font-semibold text-white cursor-pointer"><FaPlus size={16} /> Thêm</button>}>
                            <Table className={"overflow-scroll flex-1 w-full hide-scrollbar"}
                                columns={["ID", "Tiêu đề", "Giảm", "Bắt đầu", "Kết thúc", "Trạng thái", "Hành động"]}
                                rows={events.map((e) => (
                                    <tr key={e.id}>
                                        <td className="px-4 py-4 font-medium">{e.id}</td>
                                        <td className="px-4 py-4 font-medium">{e.title}</td>
                                        <td className="px-4 py-4">{e.discount}%</td>
                                        <td className="px-4 py-4">{e.startAt}</td>
                                        <td className="px-4 py-4">{e.endAt}</td>
                                        <td className="px-4 py-4"><Badge value={getEventBadgeValue(e.startAt, e.endAt)} /></td>
                                        <td className="px-4 py-4"><ActionButtons id={e.id} onOpenDetailForm={onOpenDetailForm} /></td>
                                    </tr>
                                ))}
                            />
                            <Pagination currentPage={curPage} totalPage={totalPage} numberPerLine={5} onGoClickPage={onGoClickPage} onGoNextPage={onGoNextPage} onGoPrevPage={onGoPrevPage} />
                        </Card>
                    </div>
            }
        </>
    </EventSectionContext.Provider>

}