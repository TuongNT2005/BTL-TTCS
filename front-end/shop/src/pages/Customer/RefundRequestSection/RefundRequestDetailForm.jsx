import { useEffect, useContext, useRef } from "react"
import { fetchApiFunc} from "../../../util"
import AppContext from "../../../AppContext"
import { useState } from "react"
import { getImgPath } from "../../../util"
import { IoCloseSharp } from "react-icons/io5";
import Loading from "../../Global/Loading/Loading"
import Notifier from "../../Global/Notifier/Notifier"
import RefundRequestContext from "./RefundRequestContext"
import api from "../../../api"
import Badge from "../../Global/Bagde/Bagde"
import { SiOutline } from "react-icons/si"

export default function RefundRequestDetailForm() {

    const { isDetailFormOpen, refundRequestId, setDetailFormState} = useContext(RefundRequestContext);

    const ref = useRef(null);
    let { setNotifierData, token } = useContext(AppContext);
    let [formData, setFormData] = useState(null);
    let [image, setImage] = useState(null);
    let [isLoading, setIsLoading] = useState(false);

    function closeForm() {
        setFormData(null);
        setDetailFormState({ isDetailFormOpen: false, refundRequestId: 1 });
    }

    useEffect(() => {
        setNotifierData({ isError: false, title: "", message: "", isOpen: false });

        if (ref.current === null) return;

        if (isDetailFormOpen) {
            async function fetchData() {
                try {
                    setFormData(null);
                    setImage(null);
                    setIsLoading(true);
                    ref.current.showModal();

                    const res = await fetchApiFunc("", `${api.admin.refundTab.getRefundRequestById}/${refundRequestId}`, "GET", token);

                    setFormData(res.data);
                    let curImgUrl = getImgPath(res.data.image);
                    setImage({ curImg: curImgUrl, prevImg: curImgUrl });
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
            setImage(null);
        }
    }, [isDetailFormOpen, refundRequestId, token, setNotifierData, setIsLoading]);

    return <dialog ref={ref} className="m-auto h-max p-2 md:p-5 relative bg-white text-black rounded-2xl shadow-sm">

        {
            isLoading ? <Loading></Loading> :
                <>
                    <Notifier></Notifier>
                    <form action="" id="update-refundRequest-form">
                        <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Chi tiết sản phẩm</p>
                        <section className="h-full flex flex-col md:flex-row justify-center items-center">
                            <div>
                                <img src={image ? image.curImg : getImgPath("")} alt="image" className="w-2xs md:w-xs m-2" />
                            </div>
                            <div className="flex flex-col h-full justify-center items-start p-2 md:p-5 gap-2">
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="id-update-refundRequest-form" className="font-bold">Mã yêu cầu: </label>
                                    <input name="id" className="border px-1 py-0.5 rounded-lg border-violet-200" readOnly id="id-update-refundRequest-form" type="text" defaultValue={formData ? formData.id : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="username-update-refundRequest-form" className="font-bold">Người yêu cầu: </label>
                                    <input readOnly name="name" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="username-update-refundRequest-form" type="text" defaultValue={formData ? formData.username : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="name-update-refundRequest-form" className="font-bold">Tên sản phẩm: </label>
                                    <input readOnly name="name" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="name-update-refundRequest-form" type="text" defaultValue={formData ? formData.productName : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="time-update-refundRequest-form" className="font-bold">Tạo lúc: </label>
                                    <input readOnly name="name" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="time-update-refundRequest-form" type="text" defaultValue={formData ? formData.createdAt : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="" className="font-bold">Trạng thái: </label>
                                    <Badge value={formData ? formData.status : "PENDING"}></Badge>
                                </div>

                                <div className="flex flex-col justify-center items-start w-full">
                                    <label htmlFor="reason-update-refundRequest-form" className="font-bold">Mô tả sản phẩm: </label>
                                    <textarea readOnly name="reason" id="reason-update-refundRequest-form" type="text" placeholder="Nhập mô tả..." defaultValue={formData ? formData.reason : ""} className="resize-y  outline-none h-32 w-full border p-1 rounded-lg border-violet-200" />
                                </div>

                                
                            </div>
                        </section>

                        <div className="aspect-square rounded-full border w-max p-1 md:p-2 absolute top-0 right-0 m-2 md:m-5 cursor-pointer" onClick={closeForm}> <IoCloseSharp /></div>
                    </form>
                </>
        }
    </dialog>
}