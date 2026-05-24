import { useEffect, useContext, useRef } from "react"
import { fetchApiFunc, getImgPath } from "../../../util"
import AppContext from "../../../AppContext"
import { useState } from "react"
import { IoCloseSharp } from "react-icons/io5";
import Loading from "../../Global/Loading/Loading"
import Notifier from "../../Global/Notifier/Notifier"
import UserSectionContext from "./UserSectionContext"
import api from "../../../api"
import Badge from "../../Global/Bagde/Bagde";

export default function UserDetailForm() {

    const { isDetailFormOpen, userId, setDetailFormState } = useContext(UserSectionContext);

    const ref = useRef(null);
    let { setNotifierData, token } = useContext(AppContext);
    let [formData, setFormData] = useState(null);
    let [isLoading, setIsLoading] = useState(false);


    function closeForm() {
        setFormData(null);
        setDetailFormState({ isDetailFormOpen: false, userId: 1 });
    }

    useEffect(() => {
        setNotifierData({ isError: false, title: "", message: "", isOpen: false });

        if (ref.current === null) return;

        if (isDetailFormOpen) {
            async function fetchData() {
                try {
                    setFormData(null);
                    setIsLoading(true);
                    ref.current.showModal();

                    const res = await fetchApiFunc("", `${api.admin.userTab.getUserById}/${userId}`, "GET", token);

                    setFormData(res.data);
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
            setFormData(null);
        }
    }, [isDetailFormOpen, setIsLoading, setNotifierData, token, userId]);

    return <dialog ref={ref} className="m-auto h-max p-2 md:p-5 relative bg-white text-black rounded-2xl shadow-sm">

        {
            isLoading ? <Loading></Loading> :
                <>
                    <Notifier></Notifier>
                    <form action="" id="user-detail-form">
                        <p className="pb-2 md:pb-5 text-2xl md:3xl font-bold">Thông tin khách hàng</p>
                        <section className="h-full flex flex-col md:flex-row justify-center items-center">
                            <img src={getImgPath(formData ? formData.image : "")} alt="image" className="w-2xs md:w-xs m-2" />
                            <div className="flex flex-col h-full justify-center items-start p-2 md:p-5 gap-2">
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="id-user-detail-form" className="font-bold">Mã khách hàng: </label>
                                    <input  readOnly name="id" className="border px-1 py-0.5 rounded-lg border-violet-200" id="id-user-detail-form" type="text" defaultValue={formData ? formData.id : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="name-user-detail-form" className="font-bold">Tên khách hàng: </label>
                                    <input  readOnly name="name" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="name-user-detail-form" type="text" defaultValue={formData ? formData.username : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="email-user-detail-form" className="font-bold">Email: </label>
                                    <input  readOnly name="email" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="email-user-detail-form" type="text" defaultValue={formData ? formData.email : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="phone-user-detail-form" className="font-bold">Điện thoại: </label>
                                    <input  readOnly name="phone" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="phone-user-detail-form" type="text" defaultValue={formData ? formData.phone : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="address-user-detail-form" className="font-bold">Địa chỉ: </label>
                                    <input  readOnly name="address" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="address-user-detail-form" type="text" defaultValue={formData ? formData.address : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label htmlFor="coin-user-detail-form" className="font-bold">Địa chỉ: </label>
                                    <input  readOnly name="coin" className="border px-1 py-0.5 rounded-lg border-violet-200" placeholder="Nhập tên sản phẩm..." id="coin-user-detail-form" type="text" defaultValue={formData ? formData.coin : ""} />
                                </div>
                                <div className="flex flex-row justify-between w-full gap-2">
                                    <label className="font-bold">Trạng thái: </label>
                                    <Badge value={formData ? formData.status : "UNAVALIBLE"}></Badge>
                                </div>
                            </div>
                        </section>

                        <div className="aspect-square rounded-full border w-max p-1 md:p-2 absolute top-0 right-0 m-2 md:m-5 cursor-pointer" onClick={closeForm}> <IoCloseSharp /></div>
                    </form>
                </>
        }
    </dialog>
}