import { useEffect, useContext, useRef } from "react"
import { fetchApiFunc, genID } from "../../../util"
import AppContext from "../../../AppContext"
import { useState } from "react"
import { getImgPath } from "../../../util"
import { IoCloseSharp } from "react-icons/io5";
import Loading from "../../Global/Loading/Loading"
import Notifier from "../../Global/Notifier/Notifier"
import api from "../../../api"
import NotFoundData from "../../Global/NotFoundData/NotFoundData"
import ProductVariantItem from "./ProductVariantItem"
import CommentItem from "./CommentItem"
import { IoMdStar } from "react-icons/io";

export default function ProductDetailForm({ detailFormState, setDetailFormState }) {

    const { isDetailFormOpen, productId } = { ...detailFormState };
    const { isLoading, setIsLoading } = useContext(AppContext);

    const ref = useRef(null);
    let { setNotifierData, token } = useContext(AppContext);
    let [product, setProduct] = useState(null);
    let [productVariants, setProductVariants] = useState([]);
    let [comments, setComments] = useState([]);
    let [choosingStar, setChoosingStar] = useState(0);

    function closeForm() {
        setProduct(null);
        setProductVariants([]);
        setComments([]);
        setDetailFormState({ isDetailFormOpen: false, productId: 1 });
    }

    function onChoosingStar(e) {
        setChoosingStar(e.target.value);
    }

    useEffect(() => {
        setNotifierData({ isError: false, title: "", message: "", isOpen: false });
        if (ref.current === null) return;

        if (isDetailFormOpen) {
            async function fetchData() {
                try {
                    setProduct(null);
                    setProductVariants([]);
                    setComments([]);
                    setIsLoading(true);
                    ref.current.showModal();

                    const res = await fetchApiFunc("", `${api.home.general.getProductById}/${productId}`, "GET", token);
                    const res_ = await (fetchApiFunc("", `${api.home.general.getCommentByProductId}/${productId}`, "GET", token));

                    setProduct(res.data.product);
                    setProductVariants(res.data.productVariant)
                    setComments(res_.data);
                } catch (error) {
                    console.error(error);
                    setNotifierData({
                        isError: true,
                        title: "Lỗi",
                        message: "Không tải được dữ liệu sản phẩm!",
                        isOpen: true
                    });
                } finally {
                    setIsLoading(false);
                }
            }

            fetchData();
        } else {
            ref.current.close();
            setProduct(null);
            setProductVariants([]);
            setComments([]);
        }
    }, [isDetailFormOpen, productId, setIsLoading, setNotifierData, token]);



    return <dialog ref={ref} className="m-auto h-max p-2 md:p-5  bg-white text-black rounded-2xl shadow-sm">

        {
            isLoading ? <Loading></Loading> :
                <>
                    <Notifier></Notifier>
                    <form action="" id="update-event-form">
                        <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Chi tiết sản phẩm</p>
                        <section className="h-full flex flex-col md:flex-row justify-center items-center">
                            <div>
                                <img src={getImgPath(product ? product.image : "")} alt="image" className="w-2xs md:w-xs object-fill m-2" />
                            </div>
                            <div className="flex flex-col h-full justify-center items-start p-2 md:p-5 gap-2">
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="name-update-event-form" className="font-bold">Tên sản phẩm: </label>
                                    <input readOnly className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="name-update-event-form" type="text" defaultValue={product ? product.name : ""} />
                                </div>


                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label className="font-bold">Phân loại: </label>
                                    <p>{product ? product.category : ""}</p>
                                </div>
                                <div className="flex flex-col justify-center items-start w-full">
                                    <label htmlFor="description-update-event-form" className="font-bold">Mô tả sản phẩm: </label>
                                    <textarea readOnly id="description-update-event-form" type="text" placeholder="Nhập mô tả..." defaultValue={product ? product.description : ""} className="resize-y  outline-none h-32 w-full border p-1 rounded-lg border-violet-200" />
                                </div>
                            </div>
                        </section>
                        <section className="bg-violet-50 p-2 md:p-5 rounded-2xl h-max">
                            <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Danh sách biến thể</p>
                            <ul className=" p-3 md:p-5 md:max-h-62.5 rounded-2xl">
                                {
                                    productVariants && productVariants.length > 0 ? <>
                                        {
                                            productVariants.map(pv => <ProductVariantItem item={pv} productName={product.name}></ProductVariantItem>)
                                        }
                                    </> : <NotFoundData></NotFoundData>
                                }
                            </ul>
                        </section>

                        <section className="p-2 md:p-5 rounded-2xl h-max">
                            <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Đánh giá từ khách hàng</p>
                            <ul>
                                {
                                    isLoading ? <Loading></Loading> : <>
                                        {
                                            comments && comments.length > 0 ? <>
                                                {
                                                    comments.map((item, index) => <CommentItem key={item.id || index} item={item}></CommentItem>)
                                                }
                                            </> :
                                                <NotFoundData></NotFoundData>
                                        }
                                    </>
                                }
                            </ul>
                        </section>

                        <section className="flex flex-col gap-2 p-5 bg-violet-50 rounded-2xl">
                            <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Đánh giá sản phẩm này</p>
                            <div className="flex">
                                {
                                    [1, 2, 3, 4, 5].map(num =>
                                        <div key={genID()}>
                                            <label htmlFor={`star-${num}`}>
                                                <IoMdStar className={`text-xl md:text-3xl ${num <= choosingStar? "text-yellow-400" : "text-gray-400"}`}></IoMdStar>
                                            </label>
                                            <input className="hidden" onClick={onChoosingStar} type="radio" name="star" id={`star-${num}`} value={num} />
                                        </div>
                                    )
                                }
                            </div>
                            <div>
                                <textarea name="content" id="" className="w-full h-20 md:h-30 border indent-3" placeholder="Hãy nhập bình luận"></textarea>
                                <div className="bg-green-500 hover:bg-green-600 py-1 px-3 md:py-2 md:px-5 w-fit rounded-sm text-white">Gửi</div>
                            </div>
                        </section>


                        <div className="aspect-square rounded-full border w-max p-1 md:p-2 absolute top-0 right-0 m-2 md:m-5" onClick={closeForm}> <IoCloseSharp /></div>
                    </form>
                </>
        }
    </dialog>
}