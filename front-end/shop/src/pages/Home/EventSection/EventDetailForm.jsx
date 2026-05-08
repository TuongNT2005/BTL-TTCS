import { useEffect, useContext, useRef } from "react"
import { fetchApiFunc} from "../../../util"
import AppContext from "../../../AppContext"
import { useState} from "react"
import { getImgPath, getEventBadgeValue} from "../../../util"
import { IoCloseSharp } from "react-icons/io5";
import Loading from "../../Global/Loading/Loading"
import Notifier from "../../Global/Notifier/Notifier"
import EventSectionContext from "./EventSectionContext"
import api from "../../../api"
import Badge from "../../Global/Bagde/Bagde"
import NotFoundData from "../../Global/NotFoundData/NotFoundData"
import DiscountedProductItem from "../../Admin/EventSection/DiscountedProductItem"

export default function EventDetailForm() {

    const { isDetailFormOpen, eventId, setDetailFormState, onOpenProductDetailForm} = useContext(EventSectionContext); 

    const ref = useRef(null);
    const [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });
    let { token } = useContext(AppContext);
    let [formData, setFormData] = useState(null);
    let [isLoading, setIsLoading] = useState(false);

    function closeForm() {
        setFormData(null);
        setDetailFormState({ isEditFormOpen: false, eventId: 1 });
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

                    const res = await fetchApiFunc("", `${api.home.eventSection.getEventById}/${eventId}`, "GET", token);

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
    }, [isDetailFormOpen, eventId, token]);



    return <dialog ref={ref} className="m-auto h-max p-2 md:p-5 bg-white text-black rounded-2xl shadow-sm">

        {
            isLoading ? <Loading></Loading> :
                <>
                    <Notifier notifierData={notifierData} setNotifierData={setNotifierData}></Notifier>
                    <form action="" id="update-event-form">
                        <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Chi tiết sự kiện</p>
                        <section className="h-full flex flex-col md:flex-row justify-center items-center">
                            <div>
                                <img src={getImgPath(formData ? formData.event.image : "")} alt="image" className="w-2xs md:w-xs m-2" />
                            </div>
                            <div className="flex flex-col h-full justify-center items-start p-2 md:p-5 gap-2">
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="id-update-event-form" className="font-bold">Mã sự kiện: </label>
                                    <input readOnly className="border px-1 py-0.5 rounded-lg border-violet-200" id="id-update-event-form" type="text" defaultValue={formData ? formData.event.id : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="name-update-event-form" className="font-bold">Tiêu đề: </label>
                                    <input readOnly className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="name-update-event-form" type="text" defaultValue={formData ? formData.event.title : ""} />
                                </div>

                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="discount-update-event-form" className="font-bold">Mức giảm: </label>
                                    <input readOnly className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="discount-update-event-form" type="number" defaultValue={formData ? formData.event.discount : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="startAt-update-event-form" className="font-bold">Ngày bắt đầu: </label>
                                    <input readOnly className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="startAt-update-event-form" type="date" defaultValue={formData ? formData.event.startAt : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="endAt-update-event-form" className="font-bold">Ngày kết thúc: </label>
                                    <input readOnly className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="endAt-update-event-form" type="date" defaultValue={formData ? formData.event.endAt : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label className="font-bold">Trạng thái: </label>
                                    <Badge value={formData ? getEventBadgeValue(formData.event.startAt, formData.event.endAt) : "UNAVALIBLE"} />
                                </div>
                                <div className="flex flex-col justify-center items-start w-full">
                                    <label htmlFor="description-update-event-form" className="font-bold">Mô tả sản phẩm: </label>
                                    <textarea readOnly id="description-update-event-form" type="text" placeholder="Nhập mô tả..." defaultValue={formData ? formData.event.description : ""} className="resize-y  outline-none h-32 w-full border p-1 rounded-lg border-violet-200" />
                                </div>
                            </div>
                        </section>
                        <section className="bg-violet-50 p-2 md:p-5 rounded-2xl">
                            <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Sản phẩm được áp dụng</p>
                            <ul className=" p-3 md:p-5 max-h-52 md:max-h-62.5 rounded-2xl">
                                {formData && Object.keys(formData.productList).length > 0 ? Object.entries(formData.productList).map(([productName, productId]) => (
                                    <DiscountedProductItem
                                        key={productId}
                                        productName={productName}
                                        productId={productId}
                                        isDeleted={false}
                                        onOpenDetailItem={onOpenProductDetailForm}
                                    />
                                )) : <NotFoundData></NotFoundData>}
                            </ul>
                        </section>

                        <div className="aspect-square rounded-full border w-max p-1 md:p-2 absolute top-0 right-0 m-2 md:m-5" onClick={closeForm}> <IoCloseSharp /></div>
                    </form>
                </>
        }
    </dialog>
}