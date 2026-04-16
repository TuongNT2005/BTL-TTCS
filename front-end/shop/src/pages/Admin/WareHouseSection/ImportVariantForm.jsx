import { useContext, useRef, useEffect } from "react"
import { fetchApiFunc, genID } from "../../../util"
import AppContext from "../../../AppContext"
import { IoCloseSharp } from "react-icons/io5";
import Loading from "../../Global/Loading/Loading"
import Notifier from "../../Global/Notifier/Notifier"
import api from "../../../api"
import WareHouseSectionContext from "./WareHouseSectionContext"

export default function ImportVariantForm() {


    const { setIsImportFormOpen, setRefreshKey, productList } = useContext(WareHouseSectionContext);
    const { isLoading, setIsLoading } = useContext(AppContext);

    const ref = useRef(null);
    let { setNotifierData, token } = useContext(AppContext);


    function closeForm() {
        setIsImportFormOpen(false);
    }

    function validateForm() {
        let productName = document.getElementById("productId-import-variant-form").value;
        let size = document.getElementById("size-import-variant-form").value;
        let color = document.getElementById("color-import-variant-form").value;
        let quantity = document.getElementById("quantity-import-variant-form").value;
        let importCost = document.getElementById("cost-import-variant-form").value;

        if(!productName || !size || !color || !quantity || !importCost) {
            return {
                isValid: false, message: "Hãy điền đầy đủ thông tin!"
            }
        }

        if(quantity <= 0 || importCost <= 0) {
             return {
                isValid: false, message: "Số lượng, giá nhập không được nhỏ hơn/ bằng 0!"
            }
        }

        if(!productList[productName]) {
            return {
                isValid: false, message: "Sản phẩm không tồn tại trong hệ thống! Hãy thử lại hoặc `Tạo sản phẩm mới`!"
            }
        }
        return {
            isValid: true, productId: productList[productName]
        }
    }

    async function sendForm(e) {
        e.preventDefault();

        let validateRes = validateForm();
        if(!validateRes.isValid) {
            setNotifierData({ isError: true, title: "Lỗi", message: validateRes.message, isOpen: true })
            return;
        }

        const form = document.getElementById("update-product-form");
        const formData = new FormData(form);
        formData.set("productId", validateRes.productId);
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
                    <Notifier></Notifier>
                    <form action="" id="update-product-form">
                        <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Form nhập kho</p>
                        <section className="h-full flex flex-col md:flex-row justify-center items-center">
                            <div className="flex flex-col h-full justify-center items-start p-2 md:p-5 gap-2">
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="productId-import-variant-form" className="font-bold">Tên sản phẩm: </label>
                                    <input name="productId" list="list-product" className="border px-1 py-0.5 rounded-lg border-violet-200" id="productId-import-variant-form" type="text" />
                                    <datalist id="list-product">
                                        {
                                            Object.keys(productList).map(k => <option value={k}></option>)
                                        }
                                    </datalist>
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="size-import-variant-form" className="font-bold">Size: </label>
                                    <select defaultValue="XL" name="size" className="rounded-lg border-violet-200 border" id="size-import-variant-form">
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
                                    <input name="color" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập màu sắc..." id="color-import-variant-form" type="text" />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="quantity-import-variant-form" className="font-bold">Số lượng nhập: </label>
                                    <input name="quantity" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập số lượng..." id="quantity-import-variant-form" type="number" />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="cost-import-variant-form" className="font-bold">Gía nhập: </label>
                                    <input name="importCost" className="border px-1 py-0.5 rounded-lg border-violet-200 italic" placeholder="Nhập giá nhập.." id="cost-import-variant-form" type="number" />
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