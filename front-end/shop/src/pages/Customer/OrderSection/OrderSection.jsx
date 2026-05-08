import { useState, useContext, useEffect, useCallback } from "react"
import AppContext from "../../../AppContext"
import api from "../../../api";
import { fetchApiFunc } from "../../../util";
import Loading from "../../Global/Loading/Loading";
import NotFoundData from "../../Global/NotFoundData/NotFoundData";
import Pagination from "../../Admin/Pagination";
import { PiPackage } from "react-icons/pi";
import Notifier from "../../Global/Notifier/Notifier";
import OrderSectionItem from "./OrderSectionIntem";
import OrderSectionContext from "./OrderSectionContext";
import OrderDetailForm from "./OrderDetailForm";

export default function CartSection() {

    console.log("cartsection dc render");

    const { token, authUser } = useContext(AppContext);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [curPage, setCurPage] = useState(1);
    const [totalPage, setTotalPage] = useState(100);
    const [orderSectionRefreshKey, setOrderSectionRefreshKey] = useState("");
    const [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });
    const [detailFormState, setDetailFormState] = useState({isDetailFormOpen: false, orderId: 1});

    const onOpenOrderDetailForm = useCallback((e) => {
        const orderId = e.target.id;
        setDetailFormState({isDetailFormOpen: true, orderId: orderId});
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

    const fetchUserOrders = useCallback(async function () {
        try {
            setIsLoading(true);
            const res = await fetchApiFunc(null, `${api.customer.orderSection.getOrders}/${authUser.id}?page=${curPage}`, "GET", token);
            const isError = res.code !== 200;

            if (isError) {
                setOrders([]);
            }
            else {
                setTotalPage(res.data.totalPages);
                setOrders(isError ? [] : res.data.content);
            }

        } catch (error) {
            console.log(error);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }

    }, [curPage, token, authUser])

    useEffect(() => {

        async function doFetchCartItems() {
            await fetchUserOrders();
        }

        doFetchCartItems();
    }, [fetchUserOrders, orderSectionRefreshKey])

    return <OrderSectionContext.Provider value={{...detailFormState, setDetailFormState, setOrderSectionRefreshKey}}>
        <>
            {detailFormState.isDetailFormOpen ? <OrderDetailForm></OrderDetailForm> : <></>}
            {
                isLoading ? <Loading></Loading> :
                    <>
                        {
                            orders.length <= 0 ? <NotFoundData></NotFoundData> :
                                <>
                                    <Notifier notifierData={notifierData} setNotifierData={setNotifierData}></Notifier>
                                    
                                    <div id="cartItem-list" className="hide-scrollbar w-full h-8/10 overflow-scroll bg-violet-100">
                                        {
                                            orders ? orders.map(item => <OrderSectionItem key={item.order.id} item={item} onOpenOrderDetailForm={onOpenOrderDetailForm} ></OrderSectionItem>) : <></>
                                            // orders ? orders.map(o => <div>{o.order.status}</div>) : <></>
                                        }
                                    </div>
                                    <Pagination currentPage={curPage} totalPage={totalPage} numberPerLine={5} onGoClickPage={onGoClickPage} onGoPrevPage={onGoPrevPage} onGoNextPage={onGoNextPage}></Pagination>
                                </>
                        }
                    </>
            }
        </>

    </OrderSectionContext.Provider>
}