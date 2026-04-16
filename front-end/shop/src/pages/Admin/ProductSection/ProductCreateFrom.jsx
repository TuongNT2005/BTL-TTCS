import { useEffect, useContext, useRef } from "react"
import ProductSectionContext from "./ProductSectionContext"
import { fetchApiFunc, genID } from "../../../util"
import api from "../../../api"
import AppContext from "../../../AppContext"
import { useState } from "react"
import { IoCloseSharp } from "react-icons/io5";
import uploadDefaultImg from "../../../../../../uploads/uploadDefault.png"
import Loading from "../../Global/Loading/Loading"
import Notifier from "../../Global/Notifier/Notifier"

export default function ProductCreateForm() {

    const { isCreateFormOpen, setIsCreateFormOpen, setRefreshKey} = useContext(ProductSectionContext);
    const { isLoading, setIsLoading } = useContext(AppContext);

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
        const fileInput = document.getElementById("img-product-create-form");
        fileInput.value = "";
        setImage(uploadDefaultImg);
    }

    function closeForm() {
        setIsCreateFormOpen(false);
    }

    function getInputElement() {
        let inputFields = [
            document.getElementById("img-product-create-form"),
            document.getElementById("name-product-create-form"),
            document.getElementById("description-product-create-form")
        ]
        return inputFields;
    }

    function validateCreateForm() {
        let inputFields = getInputElement();
        for (let inputField of inputFields) {
            if (!inputField.value) return false;
        }
        return true;
    }

    async function sendForm(e) {
        e.preventDefault();
        if (!validateCreateForm()) {
            setNotifierData({
                isError: true,
                title: "Lỗi!",
                message: "Hãy nhập đầy đủ thông tin!",
                isOpen: true
            });
            return;
        }

        const form = document.getElementById("create-product-form");
        const formData = new FormData(form);
        try {
            setIsLoading(true);
            const data = await fetchApiFunc(formData, api.admin.productTab.createProduct, "POST", token);
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

        function clearCreateForm() {
            let inputFields = getInputElement();

            for (let inputField of inputFields) {
                inputField.value = "";
            }

            setImage(uploadDefaultImg);
        }

        if (!ref.current) return;

        if (isCreateFormOpen) {
            clearCreateForm();
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
                    <form action="" id="create-product-form">
                        <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Đơn tạo sản phẩm</p>
                        <section className="h-full flex flex-col md:flex-row justify-center items-center">
                            <div>
                                <img src={image} alt="image" className="w-2xs md:w-xs m-2" />
                                <input name="img" id="img-product-create-form" type="file" accept="image/*" onChange={handleCreateFormChangeImage} className="hidden" />
                                <div className="flex justify-center items-center gap-1">
                                    <label htmlFor="img-product-create-form">
                                        <div className="w-max bg-green-500 hover:bg-green-600 cursor-pointer rounded-sm text-white px-1 py-0.5 md:px-2 md:py-1">Tải ảnh</div>
                                    </label>
                                    <div className="w-max bg-red-500 hover:bg-red-600 cursor-pointer rounded-sm text-white px-1 py-0.5 md:px-2 md:py-1" onClick={clearUploadedImg}>Khôi phục</div>
                                </div>
                            </div>
                            <div className="flex flex-col h-full justify-center items-start p-2 md:p-5 gap-2">
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="name" className="font-bold">Tên sản phẩm: </label>
                                    <input name="name" className="rounded-lg border-violet-200 border px-1 py-0.5" placeholder="Nhập tên sản phẩm..." id="name-product-create-form" type="text" />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="category" className="font-bold">Phân loại: </label>
                                    {/* <input className="border px-1 py-0.5" id="category" type="text" defaultValue={formData ? formData.product.category : ""} /> */}
                                    <select defaultValue="PAINTS" name="category" className="rounded-lg border-violet-200 border">
                                        <option className="border rounded-lg border-violet-200" value="PANTS" >PANTS</option>
                                        <option className="border rounded-lg border-violet-200" value="DRESS">DRESS</option>
                                        <option className="border rounded-lg border-violet-200" value="SET">SET</option>
                                        <option className="border rounded-lg border-violet-200" value="SKIRT">SKIRT</option>
                                        <option className="border rounded-lg border-violet-200" value="SPORTSWEAR">SPORTSWEAR</option>
                                    </select>
                                </div>

                                <div className="flex flex-col justify-center items-start w-full">
                                    <label htmlFor="description" className="font-bold">Mô tả sản phẩm: </label>
                                    <textarea name="description" id="description-product-create-form" type="text" placeholder="Nhập mô tả..." className="resize-y outline-none h-32 w-full p-1 rounded-lg border-violet-200 border" />
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