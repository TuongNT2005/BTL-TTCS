import { useEffect, useContext, useRef } from "react"
import Button from "../../atom/Button/Button"
import Text from "../../atom/Text/Text"
import AdminProductContext from "./AdminProductContext"
import { fetchApiFunc, genID } from "../../../util"
import api from "../../../api"
import AppContext from "../../../AppContext"
import { useState } from "react"
import Input from "../../atom/input/Input"
import { IoCloseSharp } from "react-icons/io5";
import Notifier from "../../organism/Notifier/Notifier"
import Loading from "../../organism/Loading/Loading"
import uploadDefaultImg from "../../../../../../uploads/uploadDefault.png"

export default function ProductCreateForm() {

    const { isCreateFormOpen, setIsCreateFormOpen, setRefreshKey} = useContext(AdminProductContext);
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

    return <dialog ref={ref} className="m-auto h-max p-2 md:p-5 relative border">

        {
            isLoading ? <Loading></Loading> :
                <>
                    <Notifier></Notifier>
                    <form action="" id="create-product-form">
                        <Text variant="heading" className="pb-2 md:pb-5">Chi tiết sản phẩm</Text>
                        <section className="h-full flex flex-col md:flex-row justify-center items-center">
                            <div>
                                <img src={image} alt="image" className="w-2xs md:w-xs m-2" />
                                <input name="img" id="img-product-create-form" type="file" accept="image/*" onChange={handleCreateFormChangeImage} className="hidden" />
                                <div className="flex justify-center items-center gap-1">
                                    <label htmlFor="img-product-create-form">
                                        <Text variant="small" className="w-max bg-green-500 hover:bg-green-600 cursor-pointer rounded-sm">Tải ảnh</Text>
                                    </label>
                                    <Button variant="redBtn" onClickFunc={clearUploadedImg} className="rounded-sm"><Text variant="small">Khôi phục</Text></Button>
                                </div>
                            </div>
                            <div className="flex flex-col h-full justify-center items-start p-2 md:p-5 gap-2">
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="name" className="font-bold">Tên sản phẩm: </label>
                                    <input name="name" className="border px-1 py-0.5" placeholder="Nhập tên sản phẩm..." id="name-product-create-form" type="text" />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="category" className="font-bold">Phân loại: </label>
                                    {/* <input className="border px-1 py-0.5" id="category" type="text" defaultValue={formData ? formData.product.category : ""} /> */}
                                    <select defaultValue="PAINTS" name="category" className="border text-white bg-black">
                                        <option value="PANTS" >PANTS</option>
                                        <option value="DRESS">DRESS</option>
                                        <option value="SET">SET</option>
                                        <option value="SKIRT">SKIRT</option>
                                        <option value="SPORTSWEAR">SPORTSWEAR</option>
                                    </select>
                                </div>

                                <div className="flex flex-col justify-center items-start w-full">
                                    <label htmlFor="description" className="font-bold">Mô tả sản phẩm: </label>
                                    <textarea name="description" id="description-product-create-form" type="text" placeholder="Nhập mô tả..." className="resize-y  outline-none h-32 w-full border p-1" />
                                </div>

                                <Button onClickFunc={sendForm} className="rounded-sm w-full" variant="blueBtn" typeBtn="submit"><Text variant="small">Tạo mới</Text></Button>
                            </div>
                        </section>

                        <Button variant="transparentBtn" className="aspect-square rounded-full border w-max p-1 md:p-2 absolute top-0 right-0 m-2 md:m-5" onClickFunc={closeForm}>
                            <IoCloseSharp />
                        </Button>
                    </form>
                </>
        }


    </dialog>
}