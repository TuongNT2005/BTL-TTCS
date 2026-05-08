import { useEffect, useContext, useRef, useCallback } from "react"
import { fetchApiFunc, checkFormInputIsEmpty} from "../../../util"
import AppContext from "../../../AppContext"
import { useState } from "react"
import { getImgPath, genID } from "../../../util"
import { IoCloseSharp } from "react-icons/io5";
import Loading from "../../Global/Loading/Loading"
import Notifier from "../../Global/Notifier/Notifier"
import OrderSectionContext from "./OrderSectionContext"
import api from "../../../api"
import Table from "../../Admin/Table"
import Badge from "../../Global/Bagde/Bagde"



export default function OrderDetailForm() {

    const { isDetailFormOpen, orderId, setDetailFormState, setOrderSectionRefreshKey} = useContext(OrderSectionContext);

    const ref = useRef(null);
    const coinUsed = useRef(null);
    const { token } = useContext(AppContext);
    const [formData, setFormData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });
    const [formRefreshKey, setFormRefreshKey] = useState("");

    function closeForm() {
        setFormData(null);
        setDetailFormState({ isDetailFormOpen: false, orderId: 1 });
    }

    useEffect(() => {
        setNotifierData({ isError: false, title: "", message: "", isOpen: false });

        if (ref.current === null) return;

        if (isDetailFormOpen) {
            async function fetchData() {
                try {
                    setFormData(null);
                    setIsLoading(true);
                    ref.current.showModal();

                    const res = await fetchApiFunc("", `${api.admin.orderTab.getOrderDetailById}/${orderId}`, "GET", token);

                    setFormData(res.data);
                } catch (error) {
                    console.error(error);
                    setNotifierData({
                        isError: true,
                        title: "Lỗi",
                        message: "Không tải được dữ liệu sản phẩm!",
                        isOpen: true
                    });
                } finally {
                    setIsLoading(false);
                }
            }

            fetchData();
        } else {
            ref.current.close();
            setFormData(null);
        }
    }, [isDetailFormOpen, orderId, token, setNotifierData, setIsLoading, formRefreshKey]);

    const onChangeUsedCoin = useCallback((e) => {
        console.log(e.target.value);
        if(e.target.value > formData.user.coin) {
            e.target.value = formData.user.coin;
        }
        else if(e.target.value < 0) {
            e.target.value = 0;
        }
    }, [formData])

    const validateForm = useCallback((form) => {
        
        if(checkFormInputIsEmpty(form)) {
            setNotifierData({ isError: true, title: "Lỗi", message: "Hãy nhập đủ thông tin để cập nhập", isOpen: true });
            return false;
        }
        if(coinUsed.current.value > formData.user.coin) {
            setNotifierData({   isError: true, title: "Lỗi", 
                                message: `Số coin của bạn: ${formData.user.coin} < số coin muốn sử dụng: ${coinUsed.current.value}`, 
                                isOpen: true });
            return false;
        }
        return true;
    }, [formData, setNotifierData])

    const onUpdateOrderInfor = useCallback(async(e) => {
        e.preventDefault();
        const form = document.getElementById("order-detail-form");
        if(!form) return;
        if(!validateForm(form)) return;

        const updateFormData = new FormData(form);
        const res = await fetchApiFunc(updateFormData, api.customer.orderSection.updateOrderInfor, "PUT", token);
        const isError = res.code !== 200;
        setNotifierData({   isError: isError, title: isError ? "Lỗi" : "Thành công", 
                                message: res.message, 
                                isOpen: true });
        
        if(!isError) {
            setFormRefreshKey(genID());
            setOrderSectionRefreshKey(genID());
        }
        
    }, [validateForm, token, setOrderSectionRefreshKey])

    const onCancelOrder = useCallback(async(e) => {
        e.preventDefault();
        if(formData.order.status !== "PENDING") {
            setNotifierData({   isError: true, title: "Lỗi", 
                                message: "Chỉ có thể hủy đơn hàng đang trong trạng thái PENDING!", 
                                isOpen: true });
            return;
        }
        const cancelFormData = new FormData();
        cancelFormData.set("orderId", formData.order.id);
        const res = await fetchApiFunc(cancelFormData, api.customer.orderSection.cancelOrder, "PUT", token);
        const isError = res.code !== 200;
        setNotifierData({   isError: isError, title: isError ? "Lỗi" : "Thành công", 
                                message: res.message, 
                                isOpen: true });
        
        if(!isError) {
            setFormRefreshKey(genID());
            setOrderSectionRefreshKey(genID());
        }

    }, [formData, token, setOrderSectionRefreshKey])

    const onGetPaymentUrl = useCallback(async(e) => {
        e.preventDefault();
        const res = await fetchApiFunc("", `${api.customer.orderSection.getPaymentUrl}/${formData.order.id}`, "GET", token);
        const isError = res.code !== 200;
        setNotifierData({   isError: isError, title: isError ? "Lỗi" : "Thành công", 
                                message: res.message, 
                                isOpen: true });
        
        if(!isError) {
            const paymentUrl = res.data.paymentUrl;
            window.open(paymentUrl, "_blank");
        }
    }, [formData, token])

    return <dialog ref={ref} className="m-auto h-max p-2 md:p-5 relative bg-white text-black rounded-2xl shadow-sm">

        {
            isLoading ? <Loading></Loading> :
                <>
                    <Notifier notifierData={notifierData} setNotifierData={setNotifierData}></Notifier>
                    <form action="" id="order-detail-form">
                        <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Thông tin chung</p>
                        <section className="h-full flex flex-col justify-center items-center ">
                            <div className="flex flex-col h-full justify-center items-start p-2 md:p-5 gap-2">
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="id-order-detail-form" className="font-bold">Mã đơn hàng: </label>
                                    <input name="id" className="border px-1 py-0.5 rounded-lg border-violet-200" readOnly id="id-order-detail-form" type="text" defaultValue={formData ? formData.order.id : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="username-order-detail-form" className="font-bold">Người đặt: </label>
                                    <input disabled readOnly className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="username-order-detail-form" type="text" defaultValue={formData ? formData.user.username : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="address-order-detail-form" className="font-bold">Nơi nhận: </label>
                                    <input name="address" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="address-order-detail-form" type="text" defaultValue={formData ? formData.order.address : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="phone-order-detail-form" className="font-bold">Điện thoại liên hệ: </label>
                                    <input name="phone" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="phone-order-detail-form" type="text" defaultValue={formData ? formData.order.phone : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="createdAt-order-detail-form" className="font-bold">Tạo vào: </label>
                                    <input disabled readOnly className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="createdAt-order-detail-form" type="text" defaultValue={formData ? formData.order.createdAt : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="expried-order-detail-form" className="font-bold">Hết hạn thanh toán vào: </label>
                                    <input disabled readOnly className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="expried-order-detail-form" type="text" defaultValue={formData ? formData.order.expriredat : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="coin-order-detail-form" className="font-bold">Coin dược sử dụng: </label>
                                    <input readOnly disabled className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="coin-order-detail-form" type="number" defaultValue={formData ? formData.order.coinUsed : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="coin-order-detail-form" className="font-bold">Coin muốn sử dụng: </label>
                                    <input name="usedCoin" ref={coinUsed} onChange={onChangeUsedCoin} className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="coin-order-detail-form" type="number" defaultValue={0} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="" className="font-bold">Trạng thái: </label>
                                    <Badge value={formData ? formData.order.status : "PENDING"}></Badge>
                                </div>

                            </div>

                            <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Chi tiết đơn hàng</p>
                            {
                                formData ? <>

                                    <Table
                                        columns={["ID", "Ảnh", "Tên sản phẩm", "Được giảm(%)", "Số lượng", "Gía", "Tổng"]}
                                        rows={formData.orderItems.map((r) => (
                                            <tr key={r.id}>
                                                <td className="px-4 py-4 font-medium">{r.id}</td>
                                                <td className="px-4 py-4 font-medium"><img src={getImgPath(r.image)} className="h-16 w-12 rounded-xl object-cover" alt="" /></td>
                                                <td className="px-4 py-4">{r.productVariantName}</td>
                                                <td className="px-4 py-4">{r.discount}</td>
                                                <td className="px-4 py-4">{r.quantity}</td>
                                                <td className="px-4 py-4">{r.price}</td>
                                                <td className="px-4 py-4">{r.quantity * r.price}</td>
                                            </tr>
                                        ))} />

                                    <p className="font-bold my-3 md:my-5">Tổng cộng: {formData.price}</p>
                                    <div className="w-full flex flex-col gap-2">
                                        {
                                            formData.order.status === "PENDING" ? <>
                                                <button className="rounded-sm px-1 md:px-2 py-0.5 md:py-1 bg-blue-500 hover:bg-blue-600 text-white w-full" onClick={onUpdateOrderInfor}>Cập nhập thông tin</button>
                                                <button className="rounded-sm px-1 md:px-2 py-0.5 md:py-1 bg-red-500 hover:bg-red-600 text-white w-full" onClick={onCancelOrder}>Hủy đơn</button>
                                                <button className="rounded-sm px-1 md:px-2 py-0.5 md:py-1 bg-green-500 hover:bg-green-600 text-white w-full" onClick={onGetPaymentUrl}>Thanh toán</button>    
                                                <p className="text-xs italic">Khi thanh toán thành công vui lòng load lại trang để dữ liệu được cập nhập!</p>
                                            </> : <></>
                                        }
                                    </div>

                                    
                                </> : <></>
                            }
                        </section>

                        <div className="aspect-square rounded-full border w-max p-1 md:p-2 absolute top-0 right-0 m-2 md:m-5" onClick={closeForm}> <IoCloseSharp /></div>
                    </form>
                </>
        }
    </dialog>
}