import { useState, useContext, useEffect, useCallback } from "react"
import AppContext from "../../../AppContext"
import api from "../../../api";
import { fetchApiFunc } from "../../../util";
import Loading from "../../Global/Loading/Loading";
import NotFoundData from "../../Global/NotFoundData/NotFoundData";
import Pagination from "../../Admin/Pagination";
import { PiPackage } from "react-icons/pi";
import Notifier from "../../Global/Notifier/Notifier";
import BoughtItem from "./BoughtItem";
import HistorySectionContext from "./HistorySectionContext";
import RefundCreateForm from "./RefundCreateForm";

export default function HistorySection() {

    const {token} = useContext(AppContext);
    const [orderItems, setOrderItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [curPage, setCurPage] = useState(1);
    const [totalPage, setTotalPage] = useState(100);
    const [historySectionRefreshKey, setOrderSectionRefreshKey] = useState("");
    const [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });
    const [createFormState, setCreateFormState] = useState({isCreateFormOpen: false, orderItemId: 1});

    const onOpenCreateForm = useCallback((e) => {
        const orderItemId = e.target.id;
        console.log(orderItemId);
        setCreateFormState({isCreateFormOpen: true, orderItemId: orderItemId});
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

    const fetchUserOrderItems = useCallback(async function () {
        try {
            setIsLoading(true);
            const res = await fetchApiFunc(null, `${api.customer.historySection.getBoughtItems}?page=${curPage}`, "GET", token);
            const isError = res.code !== 200;
            console.log(res);
            if (isError) {
                setOrderItems([]);
            }
            else {
                setTotalPage(res.data.totalPages);
                setOrderItems(isError ? [] : res.data.content);
            }

        } catch (error) {
            console.log(error);
            setOrderItems([]);
        } finally {
            setIsLoading(false);
        }

    }, [curPage, token])

    useEffect(() => {

        async function doFetchBoughtItems() {
            await fetchUserOrderItems();
        }

        doFetchBoughtItems();
    }, [fetchUserOrderItems, historySectionRefreshKey])

    return <HistorySectionContext.Provider value={{...createFormState, setCreateFormState, setOrderSectionRefreshKey}}>
        <>
            {createFormState.isCreateFormOpen ? <RefundCreateForm></RefundCreateForm> : <></>}
            {
                isLoading ? <Loading></Loading> :
                    <>
                        {
                            orderItems.length <= 0 ? <NotFoundData></NotFoundData> :
                                <>
                                    <Notifier notifierData={notifierData} setNotifierData={setNotifierData}></Notifier>
                                    
                                    <div id="cartItem-list" className="hide-scrollbar w-full h-8/10 overflow-scroll bg-violet-100">
                                        {
                                            orderItems ? orderItems.map(item => <BoughtItem key={item.id} item={item} onOpenCreateForm={onOpenCreateForm} ></BoughtItem>) : <></>
                                            // orders ? orders.map(o => <div>{o.order.status}</div>) : <></>
                                        }
                                    </div>
                                    <Pagination currentPage={curPage} totalPage={totalPage} numberPerLine={5} onGoClickPage={onGoClickPage} onGoPrevPage={onGoPrevPage} onGoNextPage={onGoNextPage}></Pagination>
                                </>
                        }
                    </>
            }
        </>
    </HistorySectionContext.Provider>
        

}