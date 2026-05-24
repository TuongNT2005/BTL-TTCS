import { useEffect, useContext, useRef } from "react"
import { fetchApiFunc, genID, formatDate} from "../../../util"
import AppContext from "../../../AppContext"
import { useState, useCallback } from "react"
import { getImgPath, parseDate, formatDateInput } from "../../../util"
import { IoCloseSharp } from "react-icons/io5";
import Loading from "../../Global/Loading/Loading"
import Notifier from "../../Global/Notifier/Notifier"
import EventSectionContext from "./EventSectionContext"
import api from "../../../api"
import Badge from "../../Global/Bagde/Bagde"
import DiscountedProductItem from "./DiscountedProductItem"
import NotFoundData from "../../Global/NotFoundData/NotFoundData"

export default function EventEditForm() {

    const { isEditFormOpen, eventId, setEditFormState, refreshKey, setRefreshKey, productList } = useContext(EventSectionContext);


    const ref = useRef(null);
    const { token } = useContext(AppContext);
    const [formData, setFormData] = useState(null);
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });
    const [allProductNameRef, setAllProductNameRef] = useState({});
    const [discountedProducts, setDiscountedProduct] = useState({});

    function handleChangeImage(e) {
        let file = e.target.files[0];
        if (!file) {
            setImage({ curImg: image.prevImg, prevImg: image.prevImg });
        }
        else {
            setImage({ curImg: URL.createObjectURL(file), prevImg: image.prevImg });
        }
    }

    function clearUploadedImg() {
        const fileInput = document.getElementById("img-update-event-form");
        fileInput.value = "";
        setImage({ curImg: image.prevImg, prevImg: image.prevImg });
    }

    function closeForm() {
        setFormData(null);
        setEditFormState({ isEditFormOpen: false, eventId: 1 });
    }

    let getBadgeValue = useCallback(function (start, end) {
        const startAt_ = parseDate(start);
        const endAt_ = parseDate(end);
        const now = new Date();
        return now < startAt_ ? "COMING" : (startAt_ <= now && now < endAt_) ? "AVALIBLE" : "UNAVALIBLE";
    }, [])

    function onRemoveItem(e) {
        console.log(e.target.parentElement.id);
        const productId = e.target.parentElement.id;
        const tmp = { ...discountedProducts };
        delete tmp[productId];
        setDiscountedProduct(tmp);
    }

    function onAddItem(e) {
        e.preventDefault();
        const productId = document.getElementById("productIdInput").value;
        if (!productId) {
            setNotifierData({
                isError: true,
                title: "Lỗi",
                message: "Hãy chọn một sản phẩm!",
                isOpen: true
            });
        }

        console.log(productList);
        console.log(productId);
        const productName = allProductNameRef[productId];

        console.log(productName);
        if (!productName || discountedProducts[productId]) {
            setNotifierData({
                isError: true,
                title: "Lỗi",
                message: !productName ? "Sản phẩm không tồn tại trong hệ thống!" :
                    discountedProducts[productId] ? `Đã thêm sản phẩm: ${productName} rồi!` : "Lỗi",
                isOpen: true
            });
        }
        else {
            const newDiscountedProducts  = {...discountedProducts};
            newDiscountedProducts[productId] = productName;
            setDiscountedProduct(newDiscountedProducts);
        }
    }

    async function sendForm(e) {
        e.preventDefault();
        const form = document.getElementById("update-event-form");

        if (!form.checkValidity()) {
            setNotifierData({
                isError: true,
                title: "Lỗi!",
                message: "Hãy nhập đầy đủ và kiểm tra lại thông tin! Lưu ý mức giảm > 0 và <= 30%",
                isOpen: true
            });
            return;
        }

        const formData = new FormData(form);

        if (formData.get("startAt") >= formData.get("endAt")) {
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
            const data = await fetchApiFunc(formData, api.admin.eventTab.updateEvent, "PUT", token);
            let isError = data.code !== 200;

            if (!isError) {
                setRefreshKey(genID());
            }

            setNotifierData({
                isError: isError,
                title: isError ? "Lỗi!" : "Thành công!",
                message: data.message,
                isOpen: true
            });
        } catch (error) {
            console.error(error);
            setNotifierData({ isError: true, title: "Lỗi", message: "Lỗi từ sever!", isOpen: true });
        } finally {
            setIsLoading(false);
        }
        return;
    }

    useEffect(() => {
        if (ref.current === null) return;

        if (isEditFormOpen) {
            async function fetchData() {
                try {
                    setFormData(null);
                    setImage(null);
                    setIsLoading(true);
                    ref.current.showModal();

                    const res = await fetchApiFunc("", `${api.admin.eventTab.getEventById}/${eventId}`, "GET", token);

                    setFormData(res.data);
                    let curImgUrl = getImgPath(res.data.image);
                    setImage({ curImg: curImgUrl, prevImg: curImgUrl });

                    const newProductNameRef = {};
                    productList.map((product) => {
                        newProductNameRef[product.id] = product.name;
                    })
                    setAllProductNameRef(newProductNameRef);

                    const newDiscountedProducts = {};
                    res.data.productList.map((product) => {
                        newDiscountedProducts[product.id] = product.name;
                    })
                    setDiscountedProduct(newDiscountedProducts);

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
    }, [isEditFormOpen, eventId, token, setNotifierData, setIsLoading, refreshKey, productList]);



    return <dialog ref={ref} className="m-auto h-max p-2 md:p-5 relative bg-white text-black rounded-2xl shadow-sm">

        {
            isLoading ? <Loading></Loading> :
                <>
                    <Notifier notifierData={notifierData} setNotifierData={setNotifierData}></Notifier>
                    <form action="" id="update-event-form">
                        <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Chi tiết sự kiện</p>
                        <section className="h-full flex flex-col md:flex-row justify-center items-center">
                            <div>
                                <img src={image ? image.curImg : getImgPath("")} alt="image" className="w-2xs md:w-xs m-2" />
                                {/* <img src={image.curImg} alt="image" className="w-2xs md:w-xs m-2" /> */}
                                <input name="background" id="img-update-event-form" type="file" accept="image/*" onChange={handleChangeImage} className="hidden" />
                                <div className="flex justify-center items-center gap-1">
                                    <label htmlFor="img-update-event-form">
                                        <div className="w-max bg-green-500 hover:bg-green-600 cursor-pointer rounded-sm text-white px-1 py-0.5 md:px-2 md:py-1">Tải ảnh</div>
                                    </label>
                                    <div className="w-max bg-red-500 hover:bg-red-600 cursor-pointer rounded-sm text-white px-1 py-0.5 md:px-2 md:py-1" onClick={clearUploadedImg}>Khôi phục</div>
                                </div>
                            </div>
                            <div className="flex flex-col h-full justify-center items-start p-2 md:p-5 gap-2">
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="id-update-event-form" className="font-bold">Mã sự kiện: </label>
                                    <input name="id" className="border px-1 py-0.5 rounded-lg border-violet-200" readOnly id="id-update-event-form" type="text" defaultValue={formData ? formData.id : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="name-update-event-form" className="font-bold">Tiêu đề: </label>
                                    <input required name="title" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="name-update-event-form" type="text" defaultValue={formData ? formData.title : ""} />
                                </div>

                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="discount-update-event-form" className="font-bold">Mức giảm: </label>
                                    <input required min={1} max={30} name="discount" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="discount-update-event-form" type="number" defaultValue={formData ? formData.discount : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="startAt-update-event-form" className="font-bold">Ngày bắt đầu: </label>
                                    <input required name="startAt" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="startAt-update-event-form" type="date" defaultValue={formData ? formatDateInput(formData.startAt) : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="endAt-update-event-form" className="font-bold">Ngày kết thúc: </label>
                                    <input required name="endAt" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="endAt-update-event-form" type="date" defaultValue={formData ? formatDateInput(formData.endAt) : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label className="font-bold">Trạng thái: </label>
                                    <Badge value={formData ? getBadgeValue(formData.startAt, formData.endAt) : "UNAVALIBLE"} />
                                </div>
                                <div className="flex flex-col justify-center items-start w-full">
                                    <label htmlFor="description-update-event-form" className="font-bold">Mô tả sản phẩm: </label>
                                    <textarea required name="description" id="description-update-event-form" type="text" placeholder="Nhập mô tả..." defaultValue={formData ? formData.description : ""} className="resize-y  outline-none h-32 w-full border p-1 rounded-lg border-violet-200 hide-scrollbar" />
                                </div>

                                <button onClick={sendForm} className="rounded-sm w-full bg-blue-500 hover:bg-blue-600 text-white px-1 py-0.5 md:px-2 md:py-1 cursor-pointer">Cập nhập</button>
                            </div>
                        </section>
                        <section className="bg-violet-50 p-2 md:p-5 rounded-2xl">
                            <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Sản phẩm được áp dụng</p>
                            <div className="flex flex-col w-full items-start gap-2 mb-2">

                                <label htmlFor="productIdInput">Chọn sản phẩm:  </label>
                                <div className="flex gap-2">
                                    <select name="" id="productIdInput" defaultValue="" className="border px-1 py-0.5 rounded-lg border-violet-200">
                                        {
                                            productList.map(product => <option value={product.id}>{product.name}</option>)
                                        }
                                    </select>
                                    <button onClick={onAddItem} className="bg-green-500 hover:bg-green-600 text-white px-1 py-0.5 md:px-2 md:py-1 rounded-sm cursor-pointer">Thêm</button>
                                </div>
                            </div>


                            <ul className="max-h-52 md:max-h-62.5 rounded-2xl">
                                {formData && Object.keys(discountedProducts).length > 0 ? Object.entries(discountedProducts).map(([productId, productName]) => {
                                    return (
                                        <DiscountedProductItem
                                            onRemoveItem={onRemoveItem}
                                            key={productId}
                                            productName={productName}
                                            productId={productId}
                                        />
                                    )
                                }) : <NotFoundData></NotFoundData>}
                            </ul>
                        </section>

                        <div className="aspect-square rounded-full border w-max p-1 md:p-2 absolute top-0 right-0 m-2 md:m-5 cursor-pointer" onClick={closeForm}> <IoCloseSharp /></div>
                    </form>
                </>
        }
    </dialog>
}