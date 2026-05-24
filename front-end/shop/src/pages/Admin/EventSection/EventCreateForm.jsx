import { useEffect, useContext, useRef } from "react"
import EventSectionContext from "./EventSectionContext"
import { fetchApiFunc, genID, formatDate } from "../../../util"
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
    // const [discountedProductIds, setDiscountedProductIds] = useState([]);
    const [discountedProductNames, setDiscountedProductNames] = useState({});
    const [productNameRef, setProductNameRef] = useState({});
    const [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });

    const ref = useRef(null);
    let { token } = useContext(AppContext);
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
        console.log(discountedProductNames);
        e.preventDefault();
        const productId = document.getElementById("productNameInput").value;

        if(!productId) {
            setNotifierData({
                isError: true,
                title: "Lỗi",
                message: "Hãy chọn sản phẩm!",
                isOpen: true
            });
            return;
        }

        const productName = productNameRef[productId];
        // console.log(productId);
        // console.log(productName);
        if (!productName || discountedProductNames[productId]) {
            setNotifierData({
                isError: true,
                title: "Lỗi",
                message: !productName ? "Sản phẩm không tồn tại trong hệ thống!" :
                    discountedProductNames[productId] ? `Đã thêm sản phẩm: ${productName} rồi!` : "Lỗi",
                isOpen: true
            });
        }
        else {
            // setDiscountedProductIds([...discountedProductIds, productId]);
            const newDiscountedProductNames = { ...discountedProductNames };
            newDiscountedProductNames[productId] = productName;
            setDiscountedProductNames({ ...newDiscountedProductNames });
        }
        document.getElementById("productNameInput").value = "";
    }

    function onRemoveItem(e) {
        const productId = e.target.parentElement.id;
        const tmp = { ...discountedProductNames };
        delete tmp[productId];
        setDiscountedProductNames({ ...tmp });
    }


    async function sendForm(e) {
        e.preventDefault();
        const form = document.getElementById("create-event-form");
        if(!form.checkValidity()) {
            setNotifierData({
                isError: true,
                title: "Lỗi!",
                message: "Hãy nhập đầy đủ và kiểm tra lại thông tin! Lưu ý mức giảm > 0 và <= 30%",
                isOpen: true
            });
            return;
        }

        const formData = new FormData(form);
        if(formData.get("startAt") >= formData.get("endAt")) {
            setNotifierData({
                isError: true,
                title: "Lỗi!",
                message: "Mgày bắt đầu không được trễ hơn hoặc trùng với ngày kết thúc!",
                isOpen: true
            });
            return;
        }
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
            const newProductNameRef = {};
            productList.map((product) => {
                newProductNameRef[product.id] = product.name;
            })
            console.log(newProductNameRef);
            setProductNameRef(newProductNameRef);
            setImage(uploadDefaultImg);
            ref.current.showModal();
        }
        else {
            ref.current.close();
        }
    }, [isCreateFormOpen, productList])

    return <dialog ref={ref} className="m-auto h-max p-2 md:p-5 relative bg-white text-black rounded-2xl shadow-sm">

        {
            isLoading ? <Loading></Loading> :
                <>
                    <Notifier notifierData={notifierData} setNotifierData={setNotifierData}></Notifier>
                    <form action="" id="create-event-form">
                        <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Chi tiết sự kiện</p>
                        <section className="h-full flex flex-col md:flex-row justify-center items-center">
                            <div>
                                <img src={image ? image : uploadDefaultImg} alt="image" className="w-2xs md:w-xs m-2" />
                                <input required name="background" id="img-event-create-form" type="file" accept="image/*" onChange={handleCreateFormChangeImage} className="hidden" />
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
                                    <input required name="title" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tiêu đề..." id="name-create-event-form" type="text" />
                                </div>

                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="discount-create-event-form" className="font-bold">Mức giảm: </label>
                                    <input required min={1} max={30} name="discount" className="border px-1 py-0.5 rounded-lg border-violet-200 w-48" placeholder="Nhập mức giảm giá..." id="discount-create-event-form" type="number" />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="startAt-create-event-form" className="font-bold">Ngày bắt đầu: </label>
                                    <input rel="" name="startAt" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập ngày bắt đầu..." id="startAt-create-event-form" type="date" />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="endAt-create-event-form" className="font-bold">Ngày kết thúc: </label>
                                    <input required name="endAt" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập ngày kết thúc..." id="endAt-create-event-form" type="date" />
                                </div>
                                <div className="flex flex-col justify-center items-start w-full">
                                    <label htmlFor="description-create-event-form" className="font-bold">Mô tả sản phẩm: </label>
                                    <textarea required name="description" id="description-create-event-form" type="text" placeholder="Nhập mô tả..." className="resize-y  outline-none h-32 w-full border p-1 rounded-lg border-violet-200" />
                                </div>

                                <button onClick={sendForm} className="rounded-sm w-full bg-green-500 hover:bg-green-600 text-white px-1 py-0.5 md:px-2 md:py-1 cursor-pointer">Tạo sự kiện</button>
                            </div>
                        </section>
                        <section className="bg-violet-50 p-2 md:p-5 rounded-2xl">
                            <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Sản phẩm được áp dụng</p>
                            <div className="flex flex-col w-full items-start gap-2 mb-2">
                                <label htmlFor="productNameInput">Chọn sản phẩm:  </label>
                                <div className="flex gap-2">
                                    <select name="" id="productNameInput" defaultValue="" className="border px-1 py-0.5 rounded-lg border-violet-200">
                                        {
                                            productList.map(product => <option value={product.id}>{product.name}</option>)
                                        }
                                    </select>
                                    <button onClick={onAddItem} className="bg-green-500 hover:bg-green-600 text-white px-1 py-0.5 md:px-2 md:py-1 rounded-sm cursor-pointer">Thêm</button>
                                </div>
                            </div>

                            <ul className="bg-violet-50 max-h-52 md:max-h-62.5 rounded-2xl">
                                {Object.keys(discountedProductNames).length > 0 ? Object.entries(discountedProductNames).map(([productId, productName]) => (
                                    <DiscountedProductItem
                                        onRemoveItem={onRemoveItem}
                                        key={productId}
                                        productName={productName}
                                        productId={productId}
                                    />
                                )) : <NotFoundData></NotFoundData>}
                            </ul>
                        </section>

                        <div className="aspect-square rounded-full border w-max p-1 md:p-2 absolute top-0 right-0 m-2 md:m-5 cursor-pointer" onClick={closeForm}> <IoCloseSharp /></div>
                    </form>
                </>
        }
    </dialog>
}