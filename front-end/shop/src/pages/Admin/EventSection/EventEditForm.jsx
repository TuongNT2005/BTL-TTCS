import { useEffect, useContext, useRef } from "react"
import { fetchApiFunc, genID, formatDate, isFieldsFilled } from "../../../util"
import AppContext from "../../../AppContext"
import { useState, useCallback } from "react"
import { getImgPath, parseDate } from "../../../util"
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
    let { setNotifierData, token } = useContext(AppContext);
    let [formData, setFormData] = useState(null);
    let [image, setImage] = useState(null);
    let [isLoading, setIsLoading] = useState(false);

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
        const productName = e.target.parentElement.id;
        const tmp = { ...formData.productList };
        delete tmp[productName];
        setFormData({
            event: formData.event,
            productList: {
                ...tmp
            }
        })

    }

    function onAddItem(e) {
        e.preventDefault();
        const productName = document.getElementById("productNameInput")?.value || "";
        const prodcutId = productList[productName];
        if (!prodcutId || formData.productList[productName]) {
            setNotifierData({
                isError: true,
                title: "Lỗi",
                message: !prodcutId ? "Sản phẩm không tồn tại trong hệ thống!" :
                    formData.productList[productName] ? `Đã thêm sản phẩm: ${productName} rồi!` : "Lỗi",
                isOpen: true
            });
        }
        else {
            setFormData({
                event: formData.event,
                productList: {
                    ...formData.productList,
                    [productName]: prodcutId
                }
            })
        }
        document.getElementById("productNameInput").value = "";
    }

    function validateForm(form) {

        if(!isFieldsFilled(form, {"productNameInput":1, "img-update-event-form":1})) {
            setNotifierData({
                isError: true,
                title: "Lỗi!",
                message: "Hãy điền đủ thông tin!",
                isOpen: true
            });
            return false;
        }

        const startAt = document.getElementById("startAt-update-event-form").value;
        const endAt = document.getElementById("endAt-update-event-form").value;
        if(startAt >= endAt) {
            setNotifierData({
                isError: true,
                title: "Lỗi!",
                message: "Mgày bắt đầu không được trễ hơn hoặc trùng với ngày kết thúc!",
                isOpen: true
            });
            return false;
        }
        const discount = parseInt(document.getElementById("discount-update-event-form").value);
        if(discount <= 0 || discount > 30) {
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
        const form = document.getElementById("update-event-form");
        
        if(!validateForm(form)) return;
        const formData = new FormData(form);
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
        // setNotifierData({ isError: false, title: "", message: "", isOpen: false });

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
                    let curImgUrl = getImgPath(res.data.event.image);
                    setImage({ curImg: curImgUrl, prevImg: curImgUrl });
                    console.log(res.data)
                    console.log(curImgUrl);
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
    }, [isEditFormOpen, eventId, token, setNotifierData, setIsLoading, refreshKey]);



    return <dialog ref={ref} className="m-auto h-max p-2 md:p-5 relative bg-white text-black rounded-2xl shadow-sm">

        {
            isLoading ? <Loading></Loading> :
                <>
                    <Notifier></Notifier>
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
                                    <input name="id" className="border px-1 py-0.5 rounded-lg border-violet-200" readOnly id="id-update-event-form" type="text" defaultValue={formData ? formData.event.id : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="name-update-event-form" className="font-bold">Tiêu đề: </label>
                                    <input name="title" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="name-update-event-form" type="text" defaultValue={formData ? formData.event.title : ""} />
                                </div>

                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="discount-update-event-form" className="font-bold">Mức giảm: </label>
                                    <input name="discount" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="discount-update-event-form" type="number" defaultValue={formData ? formData.event.discount : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="startAt-update-event-form" className="font-bold">Ngày bắt đầu: </label>
                                    <input name="startAt" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="startAt-update-event-form" type="date" defaultValue={formData ? formData.event.startAt : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="endAt-update-event-form" className="font-bold">Ngày kết thúc: </label>
                                    <input name="endAt" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="endAt-update-event-form" type="date" defaultValue={formData ? formData.event.endAt : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label className="font-bold">Trạng thái: </label>
                                    <Badge value={formData ? getBadgeValue(formData.event.startAt, formData.event.endAt) : "UNAVALIBLE"} />
                                </div>
                                <div className="flex flex-col justify-center items-start w-full">
                                    <label htmlFor="description-update-event-form" className="font-bold">Mô tả sản phẩm: </label>
                                    <textarea name="description" id="description-update-event-form" type="text" placeholder="Nhập mô tả..." defaultValue={formData ? formData.event.description : ""} className="resize-y  outline-none h-32 w-full border p-1 rounded-lg border-violet-200" />
                                </div>

                                <button onClick={sendForm} className="rounded-sm w-full bg-blue-500 hover:bg-blue-600 text-white px-1 py-0.5 md:px-2 md:py-1">Cập nhập</button>
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


                            <ul className=" p-3 md:p-5 max-h-52 md:max-h-62.5 rounded-2xl">
                                {formData && Object.keys(formData.productList).length > 0 ? Object.entries(formData.productList).map(([productName, productId]) => (
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