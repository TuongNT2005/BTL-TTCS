import { getImgPath } from "../../../util"
import { useRef, useCallback, useContext } from "react"
import CartSectionContext from "./CartSectionContext";
import { formattedVND } from "../../../util";

export default function CartSectionItem({ item, isChecked}) {

    console.log("item được render")
    console.log(isChecked)

    const {checkedItemIds, setCheckedItemIds, quantities, setQuantities} = useContext(CartSectionContext);
    const totalPriceRef = useRef(null);
    const quantity = useRef(null);

    const discountedPrice =
        item.productVariantDTO.purchasePrice / 100 *
        (100 - item.productVariantDTO.discount);

    const onChangeQuantity = useCallback(() => {
        let curQuantity = Number(quantity.current.value);

        if (curQuantity > item.productVariantDTO.quantity) {
            quantity.current.value = item.productVariantDTO.quantity;
        } else if (curQuantity < 1) {
            quantity.current.value = 1;
        }

        totalPriceRef.current.innerText =
            `Tổng: ${formattedVND.format(quantity.current.value * discountedPrice)}`;
    }, [discountedPrice, item]);

    const onClickCartItem = useCallback((e) => {

        console.log(e.target);
        console.log(checkedItemIds);
        console.log(quantities);

        const checkedCartItemId = Number(e.target.value);
        const checkedItemQuantity = Number(quantity.current.value);

        const indexInCheckedCartItemIds = checkedItemIds.indexOf(checkedCartItemId);
        const newCheckedCartItemIds = [...checkedItemIds];
        const newQuantites = [...quantities];

        if(indexInCheckedCartItemIds !== -1) {
            newCheckedCartItemIds.splice(indexInCheckedCartItemIds, 1);
            newQuantites.splice(indexInCheckedCartItemIds, 1);
            // e.target.checked = false;
        }
        else {
            newCheckedCartItemIds.push(checkedCartItemId);  
            newQuantites.push(checkedItemQuantity);    
            // e.target.checked = true;
        }
        setCheckedItemIds(newCheckedCartItemIds)
        setQuantities(newQuantites);
    }, [quantities, setCheckedItemIds, setQuantities, checkedItemIds])

    return (
        <label
            htmlFor={`choose-item-${item.cartItem.id}`}
            className="grid grid-cols-[80px_2fr_1fr_1fr_1fr_1fr] gap-4 w-full items-center px-3 py-2 hover:bg-violet-200 cursor-pointer"
        >
            <img
                src={getImgPath(item.productVariantDTO.image)}
                alt=""
                className="h-16 w-12 object-cover"
            />

            <div className="flex flex-col items-start text-sm">
                <p><span className="font-semibold">Tên:</span> {item.productVariantDTO.name}</p>
                <p><span className="font-semibold">Size:</span> {item.productVariantDTO.size}</p>
                <p><span className="font-semibold">Màu:</span> {item.productVariantDTO.color}</p>
                <p><span className="font-semibold">Còn lại:</span> {item.productVariantDTO.quantity}</p>
            </div>

            <div className="flex flex-col  items-start text-sm">
                <p><span className="font-semibold">Giá gốc:</span> {formattedVND.format(item.productVariantDTO.purchasePrice)}</p>
                <p><span className="font-semibold">Sau giảm:</span> {formattedVND.format(discountedPrice)}</p>
                <p><span className="font-semibold">Giảm:</span> {item.productVariantDTO.discount}%</p>
            </div>

            <div className="flex items-center gap-2">
                <span>Số lượng:</span>
                <input
                    ref={quantity}
                    type="number"
                    defaultValue={1}
                    onChange={onChangeQuantity}
                    className="w-16 border rounded px-1"
                />
            </div>

            <p ref={totalPriceRef} className="font-semibold">
                Tổng: {formattedVND.format(discountedPrice)}
            </p>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    value={item.cartItem.id}
                    id={`choose-item-${item.cartItem.id}`}
                    onChange={onClickCartItem}
                    checked = {isChecked}
                />
            </div>
        </label>
    );
}