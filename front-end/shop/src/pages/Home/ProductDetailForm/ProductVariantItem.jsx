import { getImgPath, fetchApiFunc } from "../../../util"
import Badge from "../../Global/Bagde/Bagde"
import api from "../../../api"
import Notifier from "../../Global/Notifier/Notifier"
import AppContext from "../../../AppContext"
import { useCallback, useState, useContext } from "react"

export default function ProductVariantItem({item, productName}) {

    const {token} = useContext(AppContext);
    const [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });

    const onAddToCart = useCallback((e) => {
        async function addToCart(productVariantId) {
            const form = new FormData();
            form.set("productVariantId", productVariantId);
            console.log(api.home.general.addToCart);
            const res = await fetchApiFunc(form, api.home.general.addToCart, "POST", token);
            const isError = res.code !== 200;
            console.log(res);
            setNotifierData({   isError: isError, 
                                title: isError ? "Lỗi" : "Thành công", 
                                message: res.message, 
                                isOpen: true })
        }

        e.preventDefault();
        const productVariantId = e.target.id;
        addToCart(productVariantId);
    }, [setNotifierData, token])

    return <>
        <Notifier notifierData={notifierData} setNotifierData={setNotifierData}></Notifier>
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 p-2 hover:bg-violet-200 rounded-sm">
            <img src={getImgPath(item.image)} alt="" className="h-16 w-12 rounded-xl object-cover"/>
            <div className="flex flex-col gap-2 justify-center items-center text-sm">
                <span>{productName + " " + item.color + " " + item.size}</span>
                <Badge value={item.status}></Badge>
            </div>
            <div className="flex flex-col gap-2 p-2 justify-center items-center text-sm">
                <span><span className="font-bold">Còn lại:</span> {item.quantity}</span>
                {
                    item.discount === 0 ? <>
                        <span><span className="font-bold">Gía:</span> {item.purchasePrice}</span>
                    </> : <>
                        <span className="line-through"><span className="font-bold">Gía gốc:</span> {item.purchasePrice}</span>
                        <span><span className="font-bold">Sau giảm:</span> {item.purchasePrice / 100 * (100-item.discount)}</span>
                    </>
                }
                
                
            </div>
            <button className="bg-green-500 hover:bg-green-600 p-1 rounded-sm text-white cursor-pointer" id={item.id} onClick={onAddToCart}>Thêm vào giỏ</button>
            
        </div>
    </>
}