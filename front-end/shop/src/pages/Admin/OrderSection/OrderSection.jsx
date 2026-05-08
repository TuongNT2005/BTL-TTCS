

import Card from "../Card";
import { useState, useContext, useCallback, useEffect } from "react";
import Table from "../Table";
import Badge from "../../Global/Bagde/Bagde";
import ActionButtons from "../ActionButton";
import Pagination from "../Pagination";
import AppContext from "../../../AppContext";
import { fetchApiFunc } from "../../../util";
import api from "../../../api";
import Loading from "../../Global/Loading/Loading";
import NotFoundData from "../../Global/NotFoundData/NotFoundData";
import OrderSectionContext from "./OrderSectionContext";
import OrderDetailForm from "./OrderDetailForm";

export default function OrderSection() {

    const { token } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [detailFormState, setDetailFormState] = useState({ isDetailFormOpen: false, orderId: 1 });
    const [refreshKey, setRefreshKey] = useState("");
    const [curPage, setCurPage] = useState(1);
    const [totalPage, setTotalPage] = useState(100);
    const [statusFilter, setStatusFilter] = useState("");
    const [orders, setOrders] = useState([])

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

    let onChangeFilterStatus = useCallback(function (e) {
        let chosenStatus = e.target.value;
        setStatusFilter(chosenStatus);
    }, [])

    let onOpenDetailForm = useCallback(function (e) {
        const orderId = e.target.parentElement.id;
        setDetailFormState({ isDetailFormOpen: true, orderId: orderId });
    }, [])

    const searchData = useCallback(async function () {
        try {
            setIsLoading(true);
            const res = await fetchApiFunc("", `${api.admin.orderTab.searchOrder}?page=${curPage}&status=${statusFilter}`, "GET", token);
            console.log(res);
            setOrders(res.data.content);
            return res;
        } catch (error) {
            alert(error);
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    }, [token, setIsLoading, curPage, statusFilter])

    useEffect(() => {
        async function fetchData() {
            const res = await searchData();
            setTotalPage(res.data.totalPages);
        }

        fetchData();
    }, [searchData, refreshKey])


    return <OrderSectionContext.Provider value={{ ...detailFormState, setRefreshKey, setDetailFormState }}>
        {detailFormState.isDetailFormOpen ? <OrderDetailForm></OrderDetailForm> : <></>}
        {
            !detailFormState.isDetailFormOpen && isLoading ? <Loading></Loading> :
                <div className="space-y-6 flex flex-col h-full">
                    <div className="flex flex-row gap-2">
                        <label htmlFor="select-status" className="font-bold">Trạng thái: </label>
                        <select name="" id="select-status border" defaultValue={statusFilter ? statusFilter : ""} onChange={onChangeFilterStatus}>
                            <option value="">ALL</option>
                            <option value="PENDING">PENDING</option>
                            <option value="CANCEL">CANCEL</option>
                            <option value="PAID">PAID</option>
                            <option value="EXPRIED">EXPRIED</option>
                            <option value="DELIVERIED">DELIVERIED</option>
                        </select>
                    </div>
                    {
                        orders.length == 0 ? <NotFoundData></NotFoundData> :
                            <Card className="h-full flex flex-col justify-between" title="Hoàn tiền">
                                <Table className={"overflow-scroll flex-1 w-full hide-scrollbar"}
                                    columns={["ID", "Username", "Ngày tạo", "Địa chỉ", "Số điện thoại", "Tổng tiền", "Trạng thái", "Hành động"]}
                                    rows={orders.map((r) => (
                                        <tr key={r.id}>
                                            <td className="px-4 py-4 font-medium">{r.order.id}</td>
                                            <td className="px-4 py-4 font-medium">{r.user.username}</td>
                                            <td className="px-4 py-4">{r.order.createdAt}</td>
                                            <td className="px-4 py-4">{r.order.address}</td>
                                            <td className="px-4 py-4">{r.order.phone}</td>
                                            <td className="px-4 py-4">{r.price}</td>
                                            <td className="px-4 py-4"><Badge value={r.order.status} /></td>
                                            <td className="px-4 py-4"><ActionButtons id={r.order.id} onOpenDetailForm={onOpenDetailForm} /></td>
                                        </tr>
                                    ))}
                                />
                                <Pagination currentPage={curPage} totalPage={totalPage} numberPerLine={5} onGoClickPage={onGoClickPage} onGoNextPage={onGoNextPage} onGoPrevPage={onGoPrevPage} />
                            </Card>
                    }
                </div>
        }
    </OrderSectionContext.Provider>;

}
