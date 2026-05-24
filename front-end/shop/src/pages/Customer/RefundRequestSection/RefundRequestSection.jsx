import { useState, useContext, useEffect, useCallback} from "react"
import AppContext from "../../../AppContext"
import api from "../../../api";
import { fetchApiFunc } from "../../../util";
import Loading from "../../Global/Loading/Loading";
import NotFoundData from "../../Global/NotFoundData/NotFoundData";
import Pagination from "../../Admin/Pagination";
import { PiPackage } from "react-icons/pi";
import Notifier from "../../Global/Notifier/Notifier";
import RefundRequestContext from "./RefundRequestContext";
import RefundRequestItem from "./RefunfRequestItem";
import RefundRequestDetailForm from "./RefundRequestDetailForm";


export default function RefundRequestSection() {

    const { token} = useContext(AppContext);
    const [refundRequests, setRefundRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [curPage, setCurPage] = useState(1);
    const [totalPage, setTotalPage] = useState(100);
    const [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });
    const [detailFormState, setDetailFormState] = useState({ isDetailFormOpen: false, refundRequestId: 1 });
    const [status, setStatus] = useState("");

    const onOpenRequestDetailForm = useCallback((e) => {
        const refundRequestId = e.target.id;
        console.log(refundRequestId);
        setDetailFormState({ isDetailFormOpen: true, refundRequestId: refundRequestId });
    }, [])

    const onChangeStatus = useCallback((e) => {
        const curStatus = e.target.value;
        console.log(curStatus);
        setStatus(curStatus);
    }, [])

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

    const fetchUserRefundRequests = useCallback(async function () {
        try {
            setIsLoading(true);
            // http://localhost:8080/refund/search-by-user-id?status=&page=1&keyword
            const res = await fetchApiFunc(null, `${api.customer.refundRequestSection.getRequests}?status=${status}&page=${curPage}&keyword`, "GET", token);
            const isError = res.code !== 200;

            if (isError) {
                setRefundRequests([]);
            }
            else {
                setTotalPage(res.data.totalPages);
                setRefundRequests(isError ? [] : res.data.content);
            }

        } catch (error) {
            console.log(error);
            setRefundRequests([]);
        } finally {
            setIsLoading(false);
        }

    }, [token, status, curPage])

    useEffect(() => {

        async function doFetcRefundRequests() {
            await fetchUserRefundRequests();
        }

        doFetcRefundRequests();
    }, [fetchUserRefundRequests, status, curPage])

    return <RefundRequestContext.Provider value={{ ...detailFormState, setDetailFormState }}>
        <>
            {detailFormState.isDetailFormOpen ? <RefundRequestDetailForm></RefundRequestDetailForm> : <></>}
            {
                isLoading ? <Loading></Loading> :
                    <>
                        <div className="w-full flex flex-row justify-start mb-5">
                            <label htmlFor="status" className="font-bold">Trạng thái: </label>
                            <select name="status" id="status" defaultValue={status ? status : ""} className="mr-auto" onChange={onChangeStatus}>
                                <option value="">ALL</option>
                                <option value="PENDING">PENDING</option>
                                <option value="REJECTED">REJECTED</option>
                                <option value="ACCEPTED">ACCEPTED</option>
                                <option value="DONE">DONE</option>
                            </select>
                        </div>
                        {
                            refundRequests.length <= 0 ? <NotFoundData></NotFoundData> :
                                <>
                                    <Notifier notifierData={notifierData} setNotifierData={setNotifierData}></Notifier>
                                    <div id="cartItem-list" className="hide-scrollbar w-full h-8/10 overflow-scroll bg-violet-100">
                                        {
                                            refundRequests ? refundRequests.map(item => <RefundRequestItem key={item.id} item={item} onOpenDetailForm={onOpenRequestDetailForm} ></RefundRequestItem>) : <></>
                                        }
                                    </div>
                                    <Pagination currentPage={curPage} totalPage={totalPage} numberPerLine={5} onGoClickPage={onGoClickPage} onGoPrevPage={onGoPrevPage} onGoNextPage={onGoNextPage}></Pagination>
                                </>
                        }
                    </>
            }
        </>

    </RefundRequestContext.Provider>
}