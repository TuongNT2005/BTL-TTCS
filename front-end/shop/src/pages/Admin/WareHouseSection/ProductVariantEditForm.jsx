import { useEffect, useContext, useRef } from "react"
import { fetchApiFunc, genID } from "../../../util"
import AppContext from "../../../AppContext"
import { useState } from "react"
import { getImgPath } from "../../../util"
import { IoCloseSharp } from "react-icons/io5";
import Loading from "../../Global/Loading/Loading"
import Notifier from "../../Global/Notifier/Notifier"
import api from "../../../api"
import WareHouseSectionContext from "./WareHouseSectionContext"

export default function ProductVariantEditForm() {


    const { isEditFormOpen, productVariantId, setEditFormState, refreshKey, setRefreshKey } = useContext(WareHouseSectionContext);

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
        const fileInput = document.getElementById("img-update-product-variant-form");
        fileInput.value = "";
        setImage({ curImg: image.prevImg, prevImg: image.prevImg });
    }

    function closeForm() {
        setFormData(null);
        setEditFormState({ isEditFormOpen: false, productVariantId: 1 });
    }

    function validateForm() {
        let purchasePrice = document.getElementById("price-update-product-variant-form").value;
        if (purchasePrice <= 0) {
            return {
                isValid: false, message: "Gía bán không được nhỏ hơn/ bằng 0!"
            }
        }
        return {
            isValid: true
        }
    }

    async function sendForm(e) {
        e.preventDefault();
        let validateRes = validateForm();
        if (!validateRes.isValid) {
            setNotifierData({ isError: true, title: "Lỗi", message: validateRes.message, isOpen: true })
            return;
        }

        const form = document.getElementById("update-product-form");
        const formData = new FormData(form);
        try {
            setIsLoading(true);
            const data = await fetchApiFunc(formData, api.admin.warehouseTab.updateProductVariant, "PUT", token);
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

                    const res = await fetchApiFunc("", `${api.admin.warehouseTab.getProductVariantById}/${productVariantId}`, "GET", token);

                    console.log(res.data);

                    setFormData(res.data);
                    let curImgUrl = getImgPath(res.data.image);
                    setImage({ curImg: curImgUrl, prevImg: curImgUrl });
                } catch (error) {
                    console.error(error);
                    setNotifierData({
                        isError: true,
                        title: "Lỗi",
                        message: "Không tải được dữ liệu của biến thể!",
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
    }, [isEditFormOpen, productVariantId, token, setNotifierData, setIsLoading, refreshKey]);

    return <dialog ref={ref} className="m-auto h-max p-2 md:p-5 relative bg-white text-black rounded-2xl shadow-sm">

        {
            isLoading ? <Loading></Loading> :
                <>
                    <Notifier></Notifier>
                    <form action="" id="update-product-form">
                        <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Chi tiết biến thể</p>
                        <section className="h-full flex flex-col md:flex-row justify-center items-center">
                            <div>
                                <img src={image ? image.curImg : getImgPath("")} alt="image" className="w-2xs md:w-xs m-2" />
                                <input name="img" id="img-update-product-variant-form" type="file" accept="image/*" onChange={handleChangeImage} className="hidden" />
                                <div className="flex justify-center items-center gap-1">
                                    <label htmlFor="img-update-product-variant-form">
                                        <div className="w-max bg-green-500 hover:bg-green-600 cursor-pointer rounded-sm text-white px-1 py-0.5 md:px-2 md:py-1">Tải ảnh</div>
                                    </label>
                                    <div className="w-max bg-red-500 hover:bg-red-600 cursor-pointer rounded-sm text-white px-1 py-0.5 md:px-2 md:py-1" onClick={clearUploadedImg}>Khôi phục</div>
                                </div>
                            </div>
                            <div className="flex flex-col h-full justify-center items-start p-2 md:p-5 gap-2">
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="id-update-product-variant-form" className="font-bold">Mã biến thể: </label>
                                    <input name="id" className="border px-1 py-0.5 rounded-lg border-violet-200" readOnly id="id-update-product-variant-form" type="text" value={formData ? formData.id : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="name-update-product-variant-form" className="font-bold">Tên sản phẩm: </label>
                                    <input name="productName" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="name-update-product-variant-form" type="text" disabled value={formData ? formData.name : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="size-update-product-variant-form" className="font-bold">Kích cỡ: </label>
                                    <input name="size" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="size-update-product-variant-form" type="text" disabled value={formData ? formData.size : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="color-update-product-variant-form" className="font-bold">Màu sắc: </label>
                                    <input name="color" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="color-update-product-variant-form" type="text" disabled value={formData ? formData.color : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="status-update-product-variant-form" className="font-bold">Trạng thái: </label>
                                    <select id="status-update-product-variant-form" name="status" defaultValue={formData ? formData.status : ""} className="border rounded-lg border-violet-200 px-2">
                                        <option value="AVALIBLE">AVALIBLE</option>
                                        <option value="UNAVALIBLE">UNAVALIBLE</option>
                                        <option value="COMING">COMING</option>
                                    </select>
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="quantity-update-product-variant-form" className="font-bold">Số lượng còn lại: </label>
                                    <input name="quantity" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="quantity-update-product-variant-form" type="text" disabled value={formData ? formData.quantity : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="cost-update-product-variant-form" className="font-bold">Gía nhập: </label>
                                    <input name="importCost" className="border px-1 py-0.5 rounded-lg border-violet-200 italic" placeholder="Nhập tên sản phẩm..." id="cost-update-product-variant-form" type="text" disabled value={formData ? formData.importCost : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="price-update-product-variant-form" className="font-bold">Gía bán: </label>
                                    <input name="purchasePrice" className="border px-1 py-0.5 rounded-lg border-violet-200 italic" placeholder="Nhập giá bán..." id="price-update-product-variant-form" type="number" defaultValue={formData ? formData.purchasePrice : ""} />
                                </div>
                                <button onClick={sendForm} className="rounded-sm w-full bg-blue-500 hover:bg-blue-600 text-white px-1 py-0.5 md:px-2 md:py-1">Cập nhập</button>
                            </div>
                        </section>

                        <div className="aspect-square rounded-full border w-max p-1 md:p-2 absolute top-0 right-0 m-2 md:m-5" onClick={closeForm}> <IoCloseSharp /></div>
                    </form>
                </>
        }
    </dialog>
}