
import { FaShoppingBasket } from "react-icons/fa";
import Badge from "../../Global/Bagde/Bagde";
import { getImgPath } from "../../../util";
import { formattedVND } from "../../../util";

export default function BoughtItem({ item, onOpenCreateForm}) {
    

    return (
        <div
            className="grid grid-cols-[80px_2fr_1fr_1fr] gap-4 w-full items-center px-3 py-2 hover:bg-violet-200"
        >
            <img src={getImgPath(item.image)} alt="ảnh" className="h-16 w-12 rounded-xl object-cover" />

            <div className="flex flex-col items-start text-sm">
                <p><span className="font-semibold">Tên sản phẩm:</span> {item.productVariantName}</p>
            </div>

            <div className="flex flex-col  items-start text-sm">
                <p><span className="font-semibold">Số lượng đã mua:</span> {item.quantity}</p>
                <p><span className="font-semibold">Được giảm:</span> {item.discount}%</p>
                <p><span className="font-semibold">Gía mỗi đơn vị:</span> {formattedVND.format(item.price)}</p>
            </div>

            <button id={item.id} className="mt-2 w-fit rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 cursor-pointer" onClick={onOpenCreateForm}>Tạo yêu cầu hoàn sản phẩm này</button>

        </div>
    );
}