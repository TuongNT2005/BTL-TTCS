import { useEffect, useContext, useRef, useCallback } from "react"
import { fetchApiFunc, checkFormInputIsEmpty } from "../../../util"
import AppContext from "../../../AppContext"
import { useState } from "react"
import { getImgPath} from "../../../util"
import { IoCloseSharp } from "react-icons/io5";
import Loading from "../../Global/Loading/Loading"
import Notifier from "../../Global/Notifier/Notifier"
import HistorySectionContext from "./HistorySectionContext"
import api from "../../../api"
import Table from "../../Admin/Table"
import Badge from "../../Global/Bagde/Bagde"



export default function RefundCreateForm() {

    const { isCreateFormOpen, orderItemId, setCreateFormState } = useContext(HistorySectionContext);

    const ref = useRef(null);
    const { token } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });
    let [image, setImage] = useState(getImgPath(""));

    function handleCreateFormChangeImage(e) {
        let file = e.target.files[0];
        if (!file) {
            setImage(getImgPath(""));
        }
        else {
            setImage(URL.createObjectURL(file));
        }
    }

    function clearUploadedImg() {
        const fileInput = document.getElementById("img-refund-create-form");
        fileInput.value = "";
        setImage(getImgPath(""));
    }

    function closeForm() {
        setCreateFormState({ isCreateFormOpen: false, orderItemId: 1 });
    }

    const validateForm = useCallback((form) => {

        if (checkFormInputIsEmpty(form)) {
            setNotifierData({ isError: true, title: "Lỗi", message: "Hãy nhập đủ thông tin", isOpen: true });
            return false;
        }

        return true;
    }, [])

    const onSubmitForm = useCallback(async (e) => {

        e.preventDefault();

        const form = document.getElementById("refund-create-form");
        if (!validateForm(form)) {
            return;
        }

        try {
            setIsLoading(true);

            const formData = new FormData(form);
            const res = await fetchApiFunc(formData, api.customer.historySection.createRefundRequest, "POST", token);
            const isError = res.code !== 200;
            setNotifierData({
                isError: isError,
                title: isError ? "Lỗi" : "Thành công",
                message: res.message,
                isOpen: true
            });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }


    }, [token, validateForm])

    useEffect(function () {
        if (!ref.current) return;

        if (isCreateFormOpen) {
            ref.current.showModal();
        }
        else {
            ref.current.close();
        }
    }, [isCreateFormOpen])

    return <dialog ref={ref} className="m-auto h-max p-2 md:p-5 relative bg-white text-black rounded-2xl shadow-sm">

        {
            isLoading ? <Loading></Loading> :
                <>
                    <Notifier notifierData={notifierData} setNotifierData={setNotifierData}></Notifier>
                    <form action="" id="refund-create-form">
                        <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Đơn hoàn hàng</p>
                        <section className="h-full flex flex-col justify-center items-center ">
                            <div>
                                <img src={image} alt="image" className="w-2xs md:w-xs m-2" />
                                <input name="img" id="img-refund-create-form" type="file" accept="image/*" onChange={handleCreateFormChangeImage} className="hidden" />
                                <div className="flex justify-center items-center gap-1">
                                    <label htmlFor="img-refund-create-form">
                                        <div className="w-max bg-green-500 hover:bg-green-600 cursor-pointer rounded-sm text-white px-1 py-0.5 md:px-2 md:py-1">Tải ảnh</div>
                                    </label>
                                    <div className="w-max bg-red-500 hover:bg-red-600 cursor-pointer rounded-sm text-white px-1 py-0.5 md:px-2 md:py-1" onClick={clearUploadedImg}>Khôi phục</div>
                                </div>
                            </div>

                            <div className="flex flex-col h-full justify-center items-start p-2 md:p-5 gap-2">
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="id-refund-create-form" className="font-bold">Mã: </label>
                                    <input name="orderItemId" className="border px-1 py-0.5 rounded-lg border-violet-200" id="id-refund-create-form" type="text" defaultValue={orderItemId} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="username-refund-create-form" className="font-bold">Số lượng cần hoàn: </label>
                                    <input name="quantity" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập số lượng..." id="username-refund-create-form" type="number" />
                                </div>
                                <div className="flex flex-col justify-center items-start w-full">
                                    <label htmlFor="description" className="font-bold">Lý do hoàn trả: </label>
                                    <textarea name="reason" id="description-product-create-form" type="text" placeholder="Nhập mô tả..." className="resize-y outline-none h-32 w-full p-1 rounded-lg border-violet-200 border" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 max-w-xl">
                                <button className="rounded-sm px-1 md:px-2 py-0.5 md:py-1 bg-green-500 hover:bg-green-600 text-white w-full" onClick={onSubmitForm}>Tạo yêu cầu</button>
                                <p className="text-xs italic">Khi tạo yêu cầu thành công, người bán sẽ duyệt yêu cầu cho bạn. Hãy chú ý kiểm tra tab "Yêu cầu hoàn trả" thường xuyên, nếu yêu cầu của bạn được châp nhận hãy đóng gói sản phẩm và hửi về cho cửa hàng, chúng tôi sẽ hoàn tiền cho bạn dưới dạng coin ngay sau khi nhận được sản phẩm bạn trả về!</p>
                            </div>
                        </section>

                        <div className="aspect-square rounded-full border w-max p-1 md:p-2 absolute top-0 right-0 m-2 md:m-5 cursor-pointer" onClick={closeForm}> <IoCloseSharp /></div>
                    </form>
                </>
        }
    </dialog>
}