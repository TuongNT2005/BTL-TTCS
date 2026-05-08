import { useEffect, useContext, useRef } from "react"
import EventSectionContext from "./EventSectionContext"
import { fetchApiFunc, genID, isFieldsFilled, formatDate } from "../../../util"
import api from "../../../api"
import AppContext from "../../../AppContext"
import { useState } from "react"
import { IoCloseSharp } from "react-icons/io5";
import uploadDefaultImg from "../../../../../../uploads/uploadDefault.png"
import Loading from "../../Global/Loading/Loading"
import Notifier from "../../Global/Notifier/Notifier"
import DiscountedProductItem from "./DiscountedProductItem"
import NotFoundData from "../../Global/NotFoundData/NotFoundData"

export default function EventCreateForm() {

    const { isCreateFormOpen, setIsCreateFormOpen, setRefreshKey, productList } = useContext(EventSectionContext);
    const [isLoading, setIsLoading] = useState(false);
    const [discountedProductIds, setDiscountedProductIds] = useState([]);
    const [importedProductIds, setImportedProductIds] = useState({});

    const ref = useRef(null);
    let { setNotifierData, token } = useContext(AppContext);
    let [image, setImage] = useState(null);

    function handleCreateFormChangeImage(e) {
        let file = e.target.files[0];
        if (!file) {
            setImage(uploadDefaultImg);
        }
        else {
            setImage(URL.createObjectURL(file));
        }
    }

    function clearUploadedImg() {
        const fileInput = document.getElementById("img-event-create-form");
        fileInput.value = "";
        setImage(uploadDefaultImg);
    }

    function closeForm() {
        setIsCreateFormOpen(false);
    }

    function onAddItem(e) {
        console.log(importedProductIds);
        e.preventDefault();
        const productName = document.getElementById("productNameInput")?.value || "";
        const prodcutId = productList[productName];
        if (!prodcutId || importedProductIds[productName]) {
            setNotifierData({
                isError: true,
                title: "Lỗi",
                message: !prodcutId ? "Sản phẩm không tồn tại trong hệ thống!" :
                    importedProductIds[productName] ? `Đã thêm sản phẩm: ${productName} rồi!` : "Lỗi",
                isOpen: true
            });
        }
        else {
            setDiscountedProductIds([...discountedProductIds, prodcutId]);
            const newImportedProductIds = { ...importedProductIds };
            newImportedProductIds[productName] = prodcutId;
            setImportedProductIds({ ...newImportedProductIds });
        }
        document.getElementById("productNameInput").value = "";
    }

    function onRemoveItem(e) {
        const productName = e.target.parentElement.id;
        const tmp = { ...importedProductIds};
        delete tmp[productName];
        setImportedProductIds({...tmp});
    }

    function validateCreateForm(form) {
        if (!isFieldsFilled(form, {"productNameInput":1})) {
            setNotifierData({
                isError: true,
                title: "Lỗi!",
                message: "Hãy nhập đầy đủ thông tin!",
                isOpen: true
            });
            return false;
        }

        const startAt = document.getElementById("startAt-create-event-form").value;
        const endAt = document.getElementById("endAt-create-event-form").value;
        if (startAt >= endAt) {
            setNotifierData({
                isError: true,
                title: "Lỗi!",
                message: "Mgày bắt đầu không được trễ hơn hoặc trùng với ngày kết thúc!",
                isOpen: true
            });
            return false;
        }
        const discount = parseInt(document.getElementById("discount-create-event-form").value);
        if (discount <= 0 || discount > 30) {
            setNotifierData({
                isError: true,
                title: "Lỗi!",
                message: discount <= 0 ? "Mức giảm giá không được nhỏ hơn/ bằng 0!" :
                    discount > 30 ? "Mức giảm giá không được vượt quá 30%" : "Lỗi",
                isOpen: true
            });
            return false;
        }
        return true;

    }

    async function sendForm(e) {
        e.preventDefault();
        const form = document.getElementById("create-event-form");
        if (!validateCreateForm(form)) return;

        const formData = new FormData(form);
        formData.set("startAt", formatDate(formData.get("startAt")));
        formData.set("endAt", formatDate(formData.get("endAt")));
        try {
            setIsLoading(true);
            const data = await fetchApiFunc(formData, api.admin.eventTab.createEvent, "POST", token);
            let isError = data.code !== 200;

            setNotifierData({
                isError: isError,
                title: isError ? "Lỗi!" : "Thành công!",
                message: data.message,
                isOpen: true
            });

            if (!isError) {
                setRefreshKey(genID());
            }

        } catch (error) {
            console.error(error);
            setNotifierData({ isError: true, title: "Lỗi", message: "Lỗi từ sever!", isOpen: true });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(function () {
        if (!ref.current) return;

        if (isCreateFormOpen) {
            setImage(uploadDefaultImg);
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
                    <Notifier></Notifier>
                    <form action="" id="create-event-form">
                        <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Chi tiết sự kiện</p>
                        <section className="h-full flex flex-col md:flex-row justify-center items-center">
                            <div>
                                <img src={image ? image : uploadDefaultImg} alt="image" className="w-2xs md:w-xs m-2" />
                                <input name="background" id="img-event-create-form" type="file" accept="image/*" onChange={handleCreateFormChangeImage} className="hidden" />
                                <div className="flex justify-center items-center gap-1">
                                    <label htmlFor="img-event-create-form">
                                        <div className="w-max bg-green-500 hover:bg-green-600 cursor-pointer rounded-sm text-white px-1 py-0.5 md:px-2 md:py-1">Tải ảnh</div>
                                    </label>
                                    <div className="w-max bg-red-500 hover:bg-red-600 cursor-pointer rounded-sm text-white px-1 py-0.5 md:px-2 md:py-1" onClick={clearUploadedImg}>Khôi phục</div>
                                </div>
                            </div>
                            <div className="flex flex-col h-full justify-center items-start p-2 md:p-5 gap-2">
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="name-create-event-form" className="font-bold">Tiêu đề: </label>
                                    <input name="title" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tiêu đề..." id="name-create-event-form" type="text" />
                                </div>

                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="discount-create-event-form" className="font-bold">Mức giảm: </label>
                                    <input name="discount" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập mức giảm giá..." id="discount-create-event-form" type="number" />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="startAt-create-event-form" className="font-bold">Ngày bắt đầu: </label>
                                    <input name="startAt" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập ngày bắt đầu..." id="startAt-create-event-form" type="date" />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="endAt-create-event-form" className="font-bold">Ngày kết thúc: </label>
                                    <input name="endAt" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập ngày kết thúc..." id="endAt-create-event-form" type="date" />
                                </div>
                                <div className="flex flex-col justify-center items-start w-full">
                                    <label htmlFor="description-create-event-form" className="font-bold">Mô tả sản phẩm: </label>
                                    <textarea name="description" id="description-create-event-form" type="text" placeholder="Nhập mô tả..." className="resize-y  outline-none h-32 w-full border p-1 rounded-lg border-violet-200" />
                                </div>

                                <button onClick={sendForm} className="rounded-sm w-full bg-blue-500 hover:bg-blue-600 text-white px-1 py-0.5 md:px-2 md:py-1">Tạo sự kiện</button>
                            </div>
                        </section>
                        <section className="bg-violet-50 p-2 md:p-5 rounded-2xl">
                            <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Sản phẩm được áp dụng</p>
                            <div className="flex flex-row w-full gap-2 mb-2">
                                <input id="productNameInput" defaultValue="" type="text" list="productNames" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Chọn sản phẩm" />
                                <datalist id="productNames">
                                    {
                                        Object.keys(productList).map(productName => <option value={productName}></option>)
                                    }
                                </datalist>
                                <button onClick={onAddItem} className="bg-green-500 hover:bg-green-600 text-white px-1 py-0.5 md:px-2 md:py-1 rounded-sm">Thêm</button>
                            </div>

                            <ul className="bg-violet-50 max-h-52 md:max-h-62.5 rounded-2xl">
                                {Object.keys(importedProductIds).length > 0 ? Object.entries(importedProductIds).map(([productName, productId]) => (
                                    <DiscountedProductItem
                                        onRemoveItem={onRemoveItem}
                                        key={productId}
                                        productName={productName}
                                        productId={productId}
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