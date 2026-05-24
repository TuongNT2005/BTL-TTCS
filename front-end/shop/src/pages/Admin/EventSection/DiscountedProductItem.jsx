import { IoCloseSharp } from "react-icons/io5";

export default function DiscountedProductItem({ productName, productId, onRemoveItem, onOpenDetailItem=function(){}, isDeleted = true }) {
    // console.log(productName);
    // console.log(productId);
    
    return <li id={productId} className="flex flex-row justify-between bg-violet-100 hover:bg-violet-300 px-1 py-0.5 md:px-2 md:py-1 rounded-sm">
        <input className="hidden" name="discountedProductIds" type="text" value={productId} />
        <p>{productName}</p>
        {
            !isDeleted ?
                <div id={productId} onClick={onOpenDetailItem} className="p-0.5 md:p-1 bg-green-500 hover:bg-green-600 text-center rounded-sm text-white cursor-pointer">
                    Xem chi tiết
                </div> :
                <div onClick={onRemoveItem} className="p-0.5 md:p-1 bg-red-500 hover:bg-red-700 text-center text-white rounded-sm cursor-pointer">
                    Xóa
                </div>
        }
    </li>
}