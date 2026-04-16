import { getImgPath } from "../../../util"
import Badge from "../../Global/Bagde/Bagde"

export default function ProductVariantItem({item, productName}) {
    return <>
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
            <div>
                <label htmlFor={"buy-quantity" + item.id}>Số lượng: </label>
                <input className="w-8 md:w-12" defaultValue={0} type="number" id={"buy-quantity" + item.id} />
            </div>
            <button className="bg-green-500 hover:bg-green-600 p-1 rounded-sm text-xs text-white">Thêm vào giỏ</button>
            
        </div>
    </>
}