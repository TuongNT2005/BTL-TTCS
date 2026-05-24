import { useEffect, useContext, useRef } from "react"
import { fetchApiFunc, genID } from "../../../util"
import AppContext from "../../../AppContext"
import { useState } from "react"
import { getImgPath, formattedVND } from "../../../util"
import { IoCloseSharp } from "react-icons/io5";
import Loading from "../../Global/Loading/Loading"
import Notifier from "../../Global/Notifier/Notifier"
import OrderSectionContext from "./OrderSectionContext"
import api from "../../../api"
import Badge from "../../Global/Bagde/Bagde"
import Table from "../Table"


export default function OrderDetailForm() {

    const { isDetailFormOpen, orderId, setDetailFormState, setRefreshKey } = useContext(OrderSectionContext);

    const ref = useRef(null);
    let { setNotifierData, token } = useContext(AppContext);
    let [formData, setFormData] = useState(null);
    let [isLoading, setIsLoading] = useState(false);

    function closeForm() {
        setFormData(null);
        setDetailFormState({ isDetailFormOpen: false, refundRequestId: 1 });
    }

    function onHandleSendingOrder() {
        async function updateRefundStatus() {
            try {
                setIsLoading(true);
                let formData = new FormData();;
                const res = await fetchApiFunc(formData, `${api.admin.orderTab.comfirmSendingOrder}/${orderId}`, "PUT", token);
                let isError = res.code !== 200;
                setNotifierData({
                    isError: isError,
                    title: !isError ? "Thành công!" : "Thất bại",
                    message: res.message,
                    isOpen: true
                });

                if (!isError) {
                    setRefreshKey(genID());
                }

            } catch (error) {
                console.log(error);
                alert(error);
            } finally {
                setIsLoading(false);
            }
        }

        updateRefundStatus();
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
                    // con
                }
            }

            fetchData();
        } else {
            ref.current.close();
            setFormData(null);
        }
    }, [isDetailFormOpen, orderId, token, setNotifierData, setIsLoading]);

    return <dialog ref={ref} className="m-auto h-max p-2 md:p-5 relative bg-white text-black rounded-2xl shadow-sm">

        {
            isLoading ? <Loading></Loading> :
                <>
                    <Notifier></Notifier>
                    <form action="" id="update-refundRequest-form">
                        <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Thông tin chung</p>
                        <section className="h-full flex flex-col justify-center items-center ">
                            <div className="flex flex-col h-full justify-center items-start p-2 md:p-5 gap-2">
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="id-update-refundRequest-form" className="font-bold">Mã đơn hàng: </label>
                                    <input className="border px-1 py-0.5 rounded-lg border-violet-200" readOnly id="id-update-refundRequest-form" type="text" defaultValue={formData ? formData.order.id : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="username-update-refundRequest-form" className="font-bold">Người nhận: </label>
                                    <input readOnly className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="username-update-refundRequest-form" type="text" defaultValue={formData ? formData.user.username : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="name-update-refundRequest-form" className="font-bold">Nơi nhận: </label>
                                    <input readOnly className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="name-update-refundRequest-form" type="text" defaultValue={formData ? formData.order.address : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="name-update-refundRequest-form" className="font-bold">Điện thoại liên hệ: </label>
                                    <input readOnly className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="name-update-refundRequest-form" type="text" defaultValue={formData ? formData.order.phone : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="time-update-refundRequest-form" className="font-bold">Tạo vào: </label>
                                    <input readOnly className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="time-update-refundRequest-form" type="text" defaultValue={formData ? formData.order.createdAt : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="time-update-refundRequest-form" className="font-bold">Hết hạn thanh toán vào: </label>
                                    <input readOnly className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="time-update-refundRequest-form" type="text" defaultValue={formData ? formData.order.expriredat : ""} />
                                </div>
                                {
                                    formData && formData.order.paidAt &&
                                    <>
                                        <div className="flex flex-row justify-between w-full gap-2">
                                            <label htmlFor="time-update-refundRequest-form" className="font-bold">Đã thanh toán vào: </label>
                                            <input readOnly className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="time-update-refundRequest-form" type="text" defaultValue={formData ? formData.order.paidAt : ""} />
                                        </div>
                                    </>
                                }
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="time-update-refundRequest-form" className="font-bold">Coin dược sử dụng: </label>
                                    <input readOnly className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="time-update-refundRequest-form" type="text" defaultValue={formData ? formData.order.coinUsed : ""} />
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
                                                <td className="px-4 py-4">{formattedVND.format(r.price)}</td>
                                                <td className="px-4 py-4">{formattedVND.format(r.quantity * r.price)}</td>
                                            </tr>
                                        ))} />

                                    <p className="font-bold my-3 md:my-5">Tổng cộng: {formattedVND.format(formData.orderItems.reduce((totalPrice, curItem) => totalPrice + curItem.price * curItem.quantity, 0))}</p>
                                    {
                                        formData.order.status === "PAID" ?
                                            <button onClick={onHandleSendingOrder}
                                                className="rounded-sm w-full bg-green-500 hover:bg-green-600 text-white px-1 py-0.5 md:px-2 md:py-1 cursor-pointer">Xác nhận đã gửi hàng</button> :
                                            <></>
                                    }

                                </> : <></>
                            }
                        </section>

                        <div className="aspect-square rounded-full border w-max p-1 md:p-2 absolute top-0 right-0 m-2 md:m-5 cursor-pointer" onClick={closeForm}> <IoCloseSharp /></div>
                    </form>
                </>
        }
    </dialog>
}