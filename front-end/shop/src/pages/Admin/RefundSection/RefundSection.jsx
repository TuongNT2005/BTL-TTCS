
import { GoXCircle } from "react-icons/go";
import { FiCheckCircle } from "react-icons/fi";
import { IoShieldCheckmark } from "react-icons/io5";

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
import RefundSectionContext from "./RefundSectionContext";
import NotFoundData from "../../Global/NotFoundData/NotFoundData";
import RefundRequestDetailForm from "./RefundRequestDetailForm";

export default function RefundSection({ keyword }) {

    const { token } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [detailFormState, setDetailFormState] = useState({ isDetailFormOpen: false, refundRequestId: 1 });
    const [refreshKey, setRefreshKey] = useState("");
    const [curPage, setCurPage] = useState(1);
    const [totalPage, setTotalPage] = useState(100);
    const [statusFilter, setStatusFilter] = useState("");
    const [refundRequests, setRefundRequests] = useState([
        { id: 1, username: "Tường Ng", product: "Áo dài - XL - Hồng cánh sen", createdAt: "10/10/2025", status: "Accepted" },
        { id: 2, username: "Cao Phạm", product: "Quần short Nam - 2XL - Xám", createdAt: "10/01/2026", status: "Pending" },
        { id: 3, username: "Cao Phạm", product: "Quần short Nam - 3XL - Xám", createdAt: "10/01/2026", status: "Done" },
        { id: 4, username: "Cao Phạm", product: "Quần short Nam - 2XL - Xám", createdAt: "10/01/2026", status: "Rejected" },
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

    let onChangeFilterStatus = useCallback(function (e) {
        let chosenStatus = e.target.value;
        setStatusFilter(chosenStatus);
    }, [])

    let onOpenDetailForm = useCallback(function (e) {
        const refundRequestId = e.target.parentElement.id;
        setDetailFormState({ isDetailFormOpen: true, refundRequestId: refundRequestId });
    }, [])

    const searchData = useCallback(async function () {
        try {
            setIsLoading(true);
            const res = await fetchApiFunc("", `${api.admin.refundTab.searchRefundRequest}?keyword=${keyword}&page=${curPage}&status=${statusFilter}`, "GET", token);
            console.log(res);
            setRefundRequests(res.data.content);
            return res;
        } catch (error) {
            alert(error);
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    }, [keyword, token, setIsLoading, curPage, statusFilter])

    useEffect(() => {
        async function fetchData() {
            const res = await searchData();
            setTotalPage(res.data.totalPages);
        }

        fetchData();
    }, [searchData, refreshKey])

    // Reset page khi keyword thay đổi
    useEffect(() => {
        setCurPage(1);
    }, [keyword]);


    return <RefundSectionContext.Provider value={{ ...detailFormState, setRefreshKey, setDetailFormState }}>
        {detailFormState.isDetailFormOpen ? <RefundRequestDetailForm></RefundRequestDetailForm> : <></>}
        {
            !detailFormState.isDetailFormOpen && isLoading ? <Loading></Loading> :
                <div className="space-y-6 h-full">
                    <div className="flex flex-row gap-2">
                        <label htmlFor="select-status" className="font-bold">Trạng thái: </label>
                        <select name="" id="select-status border" defaultValue={statusFilter ? statusFilter : ""} onChange={onChangeFilterStatus}>
                            <option value="">ALL</option>
                            <option value="ACCEPTED">ACCEPTED</option>
                            <option value="REJECTED">REJECTED</option>
                            <option value="PENDING">PENDING</option>
                            <option value="DONE">DONE</option>
                        </select>
                    </div>
                    {
                        refundRequests.length == 0 ? <NotFoundData></NotFoundData> :
                            <Card className="h-full flex flex-col justify-start" title="Hoàn tiền">
                                <Table
                                    className="overflow-scroll flex-1 w-full hide-scrollbar"
                                    columns={["ID", "Username", "Sản phẩm", "Ngày tạo", "Trạng thái", "Hành động"]}
                                    rows={refundRequests.map((r) => (
                                        <tr key={r.id}>
                                            <td className="px-4 py-4 font-medium">{r.id}</td>
                                            <td className="px-4 py-4 font-medium">{r.username}</td>
                                            <td className="px-4 py-4">{r.productName}</td>
                                            <td className="px-4 py-4">{r.createdAt}</td>
                                            <td className="px-4 py-4"><Badge value={r.status} /></td>
                                            <td className="px-4 py-4"><ActionButtons id={r.id} onOpenDetailForm={onOpenDetailForm} /></td>
                                        </tr>
                                    ))}
                                />
                                <Pagination currentPage={curPage} totalPage={totalPage} numberPerLine={5} onGoClickPage={onGoClickPage} onGoNextPage={onGoNextPage} onGoPrevPage={onGoPrevPage} />
                            </Card>
                    }
                </div>
        }
    </RefundSectionContext.Provider>;

}
