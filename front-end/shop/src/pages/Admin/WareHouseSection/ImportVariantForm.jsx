import { useContext, useRef, useEffect, useState } from "react"
import { fetchApiFunc, genID } from "../../../util"
import AppContext from "../../../AppContext"
import { IoCloseSharp } from "react-icons/io5";
import Loading from "../../Global/Loading/Loading"
import Notifier from "../../Global/Notifier/Notifier"
import api from "../../../api"
import WareHouseSectionContext from "./WareHouseSectionContext"

export default function ImportVariantForm() {


    const { setIsImportFormOpen, setRefreshKey, productList } = useContext(WareHouseSectionContext);
    const [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });

    const ref = useRef(null);
    let {token } = useContext(AppContext);
    let [isLoading, setIsLoading] = useState(false);

    function closeForm() {
        setIsImportFormOpen(false);
    }

    

    async function sendForm(e) {
        e.preventDefault();

        const form = document.getElementById("update-product-form");
        if(!form.checkValidity()) {
            setNotifierData({ isError: true, title: "Lỗi", message: "Hãy kiểm tra thông tin nhập liệu!", isOpen: true })
            return;
        }

        const productId = document.getElementById("name-import-variant-form").value;
        const formData = new FormData(form);
        formData.set("productId", productId);
        try {
            setIsLoading(true);
            const data = await fetchApiFunc(formData, api.admin.warehouseTab.importProductVariant, "POST", token);
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
        if (!ref) return;
        ref.current.showModal();
    }, [])

    return <dialog ref={ref} className="m-auto h-max p-2 md:p-5 relative bg-white text-black rounded-2xl shadow-sm">

        {
            isLoading ? <Loading></Loading> :
                <>
                    <Notifier notifierData={notifierData} setNotifierData={setNotifierData}></Notifier>
                    <form action="" id="update-product-form">
                        <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Form nhập kho</p>
                        <section className="h-full flex flex-col md:flex-row justify-center items-center">
                            <div className="flex flex-col h-full justify-center items-start p-2 md:p-5 gap-2">
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="name-import-variant-form" className="font-bold">Tên sản phẩm: </label>
                                    <select required defaultValue={productList[0]} className="text-sm rounded-lg border-violet-200 border" id="name-import-variant-form">
                                        {
                                            // Object.keys(productList).map(k => <option value={productList[k]}>{k}</option>)
                                            productList.map(product => <option value={product.id}>{product.name}</option>)
                                        }
                                    </select>
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="size-import-variant-form" className="font-bold">Size: </label>
                                    <select required defaultValue="XL" name="size" className="text-sm rounded-lg border-violet-200 border" id="size-import-variant-form">
                                        <option className="border rounded-lg border-violet-200" value="S" >S</option>
                                        <option className="border rounded-lg border-violet-200" value="M">M</option>
                                        <option className="border rounded-lg border-violet-200" value="L">L</option>
                                        <option className="border rounded-lg border-violet-200" value="XL">XL</option>
                                        <option className="border rounded-lg border-violet-200" value="XXL">XXL</option>
                                        <option className="border rounded-lg border-violet-200" value="XXXL">XXXL</option>
                                    </select>
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="color-import-variant-form" className="font-bold">Màu sắc: </label>
                                    <input required name="color" className="text-sm border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập màu sắc..." id="color-import-variant-form" type="text" />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="quantity-import-variant-form" className="font-bold">Số lượng nhập: </label>
                                    <input min={1} required name="quantity" className="text-sm border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập số lượng..." id="quantity-import-variant-form" type="number" />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="cost-import-variant-form" className="font-bold">Gía nhập: </label>
                                    <input min={1000} required name="importCost" className="text-sm border px-1 py-0.5 rounded-lg border-violet-200 italic" placeholder="Nhập giá nhập.." id="cost-import-variant-form" type="number" />
                                </div>
                                <button onClick={sendForm} className="rounded-sm w-full bg-blue-500 hover:bg-blue-600 text-white px-1 py-0.5 md:px-2 md:py-1 cursor-pointer">Cập nhập</button>
                            </div>
                        </section>

                        <div className="aspect-square rounded-full border w-max p-1 md:p-2 absolute top-0 right-0 m-2 md:m-5 cursor-pointer" onClick={closeForm}> <IoCloseSharp /></div>
                    </form>
                </>
        }
    </dialog>
}