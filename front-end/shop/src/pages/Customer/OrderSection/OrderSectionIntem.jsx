
import { FaShoppingBasket } from "react-icons/fa";
import Badge from "../../Global/Bagde/Bagde";

export default function OrderSectionItem({ item, onOpenOrderDetailForm }) {
    

    return (
        <div
            className="grid grid-cols-[80px_2fr_1fr_1fr] gap-4 w-full items-center px-3 py-2 hover:bg-violet-200"
        >
            <p className="text-5xl"><FaShoppingBasket></FaShoppingBasket></p>

            <div className="flex flex-col items-start text-sm">
                <p><span className="font-semibold">Mã đơn hàng:</span> {item.order.id}</p>
                <p><span className="font-semibold">Ngày tạo:</span> {item.createdAt}</p>
                <p><span className="font-semibold">Trạng thái:</span> <Badge value={item.order.status}></Badge></p>
            </div>

            <div className="flex flex-col  items-start text-sm">
                <p><span className="font-semibold">Phải trả:</span> {item.price}</p>
            </div>

            <button id={item.order.id} onClick={onOpenOrderDetailForm} className="mt-2 w-fit rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700">Xem chi tiết</button>

        </div>
    );
}