import { useState, useContext, useEffect, useCallback } from "react"
import AppContext from "../../../AppContext"
import api from "../../../api";
import { fetchApiFunc, genID } from "../../../util";
import Loading from "../../Global/Loading/Loading";
import NotFoundData from "../../Global/NotFoundData/NotFoundData";
import Pagination from "../../Admin/Pagination";
import { PiPackage } from "react-icons/pi";
import Notifier from "../../Global/Notifier/Notifier";
import CartSectionContext from "./CartSectionContext";
import CartSectionItem from "./CartSectionItem"

export default function CartSection() {

    console.log("cartsection dc render");

    const { token } = useContext(AppContext);
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [curPage, setCurPage] = useState(1);
    const [totalPage, setTotalPage] = useState(100);
    const [refreshKey, setRefreshKey] = useState("");
    const [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });
    const [checkedItemIds, setCheckedItemIds] = useState([]);
    const [quantities, setQuantities] = useState([]);

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

    // const getChoosingCartItemIdsAndQuantities = useCallback(() => {
    //     let inputs = document.getElementById("cartItem-list").querySelectorAll("input");
    //     inputs = [...inputs];
    //     const cartItemInputs = inputs.filter((_, index) => index % 2 === 1);
    //     const quantitieInputs = inputs.filter((_, index) => index % 2 === 0);

    //     let cartItemIds = []
    //     let quantities = []
    //     for (let i = 0; i < cartItemInputs.length; i++) {
    //         if (cartItemInputs[i].checked) {
    //             cartItemIds.push(cartItemInputs[i].value);
    //             quantities.push(quantitieInputs[i].value);
    //         }
    //     }

    //     return { cartItemIds, quantities };
    // }, [])

    const createDeleteCartItemRequest = useCallback(() => {

        console.log(checkedItemIds);
        console.log(quantities);

        if (checkedItemIds.length === 0) {
            setNotifierData({
                isError: true,
                title: "Lỗi",
                message: "Hãy chọn các sản phẩm muốn xóa rồi nhấn `Xóa item`",
                isOpen: true
            })
            return null;
        }

        const form = new FormData();
        form.set("cartItemIds", checkedItemIds);
        return form;

    }, [checkedItemIds, quantities])

    const createNewOrderRequest = useCallback(() => {

        console.log(checkedItemIds);
        console.log(quantities);

        if (checkedItemIds.length === 0) {
            setNotifierData({
                isError: true,
                title: "Lỗi",
                message: "Hãy chọn các sản phẩm muốn mua kèm số lượng rồi nhấn `Tạo đơn hàng`",
                isOpen: true
            })
            return null;
        }

        const form = new FormData();
        form.set("cartItemIds", checkedItemIds);
        form.set("quantities", quantities);
        return form;
    }, [quantities, checkedItemIds])

    const onCreateNewOrder = useCallback(async () => {
        const form = createNewOrderRequest();
        if (!form) return;

        const userConfirm = confirm("Xác nhận 'Tạo đơn hàng' ?");
        if (!userConfirm) return;

        try {
            setIsLoading(true)
            const res = await fetchApiFunc(form, api.customer.cartSection.createOrder, "POST", token);
            const isError = res.code !== 200;
            if (isError) {
                setNotifierData({
                    isError: isError,
                    title: "Lỗi",
                    message: res.message,
                    isOpen: true
                })
            }
            else setRefreshKey(genID())

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }, [createNewOrderRequest, token])

    const onDeleteItem = useCallback(async () => {
        const form = createDeleteCartItemRequest();
        if (!form) return;

        const userConfirm = confirm("Xác nhận 'Xóa Item' ?");
        if (!userConfirm) return;

        try {
            setIsLoading(true)
            const res = await fetchApiFunc(form, api.customer.cartSection.deleteItems, "DELETE", token);
            const isError = res.code !== 200;
            if (isError) {
                setNotifierData({
                    isError: isError,
                    title: "Lỗi",
                    message: res.message,
                    isOpen: true
                })
            }
            else setRefreshKey(genID())


        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }, [createDeleteCartItemRequest, token])

    const fetchCartItems = useCallback(async function () {
        try {
            setIsLoading(true);
            const res = await fetchApiFunc(null, `${api.customer.cartSection.getCartItems}?page=${curPage}`, "GET", token);
            const isError = res.code !== 200;

            if (isError) {
                setCartItems([]);
            }
            else {
                setTotalPage(res.data.totalPages);
                setCartItems(isError ? [] : res.data.content);
            }

        } catch (error) {
            console.log(error);
            setCartItems([]);
        } finally {
            setIsLoading(false);
        }

    }, [curPage, token])

    useEffect(() => {

        async function doFetchCartItems() {
            await fetchCartItems();
        }

        doFetchCartItems();
    }, [fetchCartItems, refreshKey])

    return <>
        <CartSectionContext.Provider value={{checkedItemIds, setCheckedItemIds, quantities, setQuantities}}>
            {
                isLoading ? <Loading></Loading> :
                    <>
                        {
                            cartItems.length <= 0 ? <NotFoundData></NotFoundData> :
                                <>
                                    <Notifier notifierData={notifierData} setNotifierData={setNotifierData}></Notifier>
                                    <div className="w-full flex justify-end gap-2">
                                        <button className=" bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-sm" onClick={onDeleteItem}>Xóa Item</button>
                                        <button className=" bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-sm" onClick={onCreateNewOrder}>Tạo đơn hàng</button>
                                    </div>
                                    <div id="cartItem-list" className="hide-scrollbar w-full h-8/10 overflow-scroll bg-violet-100">
                                        {
                                            cartItems ? cartItems.map(cartItem => <CartSectionItem key={cartItem.cartItem.id} item={cartItem} isChecked={checkedItemIds.includes(cartItem.cartItem.id)}></CartSectionItem>) : <></>
                                        }
                                    </div>
                                    <Pagination currentPage={curPage} totalPage={totalPage} numberPerLine={5} onGoClickPage={onGoClickPage} onGoPrevPage={onGoPrevPage} onGoNextPage={onGoNextPage}></Pagination>
                                </>
                        }
                    </>
            }
        </CartSectionContext.Provider>

    </>
}