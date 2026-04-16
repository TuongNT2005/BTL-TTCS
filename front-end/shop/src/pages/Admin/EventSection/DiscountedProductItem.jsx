import { IoCloseSharp } from "react-icons/io5";

export default function DiscountedProductItem({ productName, productId, onRemoveItem, onOpenDetailItem=function(){}, isDeleted = true }) {
    return <li id={productName} className="flex flex-row justify-between bg-violet-100 hover:bg-violet-300 px-1 py-0.5 md:px-2 md:py-1 rounded-sm">
        <input className="hidden" name="discountedProductIds" type="text" value={productId} />
        <p>{productName}</p>
        {
            !isDeleted ?
                <div id={productId} onClick={onOpenDetailItem} className="p-0.5 md:p-1 bg-green-500 hover:bg-green-600 text-center rounded-sm text-white">
                    Xem chi tiết
                </div> :
                <div onClick={onRemoveItem} className="p-0.5 md:p-1 bg-red-300 hover:bg-red-500 text-center rounded-sm">
                    Xóa
                </div>
        }
    </li>
}