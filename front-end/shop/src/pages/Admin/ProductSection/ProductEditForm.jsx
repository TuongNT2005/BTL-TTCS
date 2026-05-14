import { useEffect, useContext, useRef } from "react"
import { fetchApiFunc, genID } from "../../../util"
import AppContext from "../../../AppContext"
import { useState } from "react"
import { getImgPath } from "../../../util"
import { IoCloseSharp } from "react-icons/io5";
import Loading from "../../Global/Loading/Loading"
import Notifier from "../../Global/Notifier/Notifier"
import ProductSectionContext from "./ProductSectionContext"
import api from "../../../api"

export default function ProductEditForm() {

    const { isEditFormOpen, productId, refreshKey, setEditFormState, setRefreshKey } = useContext(ProductSectionContext);
    
    const ref = useRef(null);
    const [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });
    let { token } = useContext(AppContext);
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
        const fileInput = document.getElementById("img-update-product-form");
        fileInput.value = "";
        setImage({ curImg: image.prevImg, prevImg: image.prevImg });
    }

    function closeForm() {
        setFormData(null);
        setEditFormState({ isEditFormOpen: false, productId: 1 });
    }

    async function sendForm(e) {
        console.log("tôi mệt v");
        e.preventDefault();
        const form = document.getElementById("update-product-form");
        const formData = new FormData(form);
        try {
            setIsLoading(true);
            const data = await fetchApiFunc(formData, api.admin.productTab.updateProduct, "PUT", token);
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

                    const res = await fetchApiFunc("", `${api.admin.productTab.getProductById}/${productId}`, "GET", token);

                    setFormData(res.data);
                    let curImgUrl = getImgPath(res.data.product.image);
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
    }, [isEditFormOpen, productId, token, refreshKey]);

    return <dialog ref={ref} className="m-auto h-max p-2 md:p-5 relative bg-white text-black rounded-2xl shadow-sm">
        
        {
            isLoading ? <Loading></Loading> :
                <>
                    <Notifier notifierData={notifierData} setNotifierData={setNotifierData}></Notifier>
                    <form action="" id="update-product-form">
                        <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Chi tiết sản phẩm</p>
                        <section className="h-full flex flex-col md:flex-row justify-center items-center">
                            <div>
                                <img src={image ? image.curImg : getImgPath("")} alt="image" className="w-2xs md:w-xs m-2" />
                                <input name="img" id="img-update-product-form" type="file" accept="image/*" onChange={handleChangeImage} className="hidden" />
                                <div className="flex justify-center items-center gap-1">
                                    <label htmlFor="img-update-product-form">
                                        <div className="w-max bg-green-500 hover:bg-green-600 cursor-pointer rounded-sm text-white px-1 py-0.5 md:px-2 md:py-1">Tải ảnh</div>
                                    </label>
                                    <div className="w-max bg-red-500 hover:bg-red-600 cursor-pointer rounded-sm text-white px-1 py-0.5 md:px-2 md:py-1" onClick={clearUploadedImg}>Khôi phục</div>
                                </div>
                            </div>
                            <div className="flex flex-col h-full justify-center items-start p-2 md:p-5 gap-2">
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="id-update-product-form" className="font-bold">Mã sản phẩm: </label>
                                    <input name="id" className="border px-1 py-0.5 rounded-lg border-violet-200" readOnly id="id-update-product-form" type="text" defaultValue={formData ? formData.product.id : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="name-update-product-form" className="font-bold">Tên sản phẩm: </label>
                                    <input name="name" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="name-update-product-form" type="text" defaultValue={formData ? formData.product.name : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="category" className="font-bold">Phân loại: </label>
                                    {/* <input className="border px-1 py-0.5" id="category" type="text" defaultValue={formData ? formData.product.category : ""} /> */}
                                    <select id="category-update-product-form" name="category" defaultValue={formData ? formData.product.category : ""} className="border rounded-lg border-violet-200">
                                        {formData && formData.categories.map(category => <option className="rounded-lg border-violet-200" key={genID()} value={category}>{category}</option>)}
                                    </select>
                                </div>

                                <div className="flex flex-col justify-center items-start w-full">
                                    <label htmlFor="description-update-product-form" className="font-bold">Mô tả sản phẩm: </label>
                                    <textarea name="description" id="description-update-product-form" type="text" placeholder="Nhập mô tả..." defaultValue={formData ? formData.product.description : ""} className="resize-y  outline-none h-32 w-full border p-1 rounded-lg border-violet-200" />
                                </div>

                                <button onClick={sendForm} className="rounded-sm w-full bg-blue-500 hover:bg-blue-600 text-white px-1 py-0.5 md:px-2 md:py-1 cursor-pointer">Cập nhập</button>
                            </div>
                        </section>

                        <div className="aspect-square rounded-full border w-max p-1 md:p-2 absolute top-0 right-0 m-2 md:m-5" onClick={closeForm}> <IoCloseSharp /></div>
                    </form>
                </>
        }
    </dialog>
}