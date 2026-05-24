import { getImgPath } from "../../../util";
import { useCallback, useState, useContext } from "react";
import api from "../../../api";
import { fetchApiFunc } from "../../../util";
import AppContext from "../../../AppContext";
import Notifier from "../../Global/Notifier/Notifier";
import Loading from "../../Global/Loading/Loading";

export default function Profile({ user, setUser }) {

    const { token } = useContext(AppContext);
    const defaultAvatar = getImgPath("");
    const [image, setImage] = useState({curImg: getImgPath(user.avatar), prevImg: defaultAvatar});
    const [isLoading, setIsLoading] = useState(false);
    const [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });

    function handleCreateFormChangeImage(e) {
        let file = e.target.files[0];
        if (!file) {
            return;
        }
        else {
            const newImg = URL.createObjectURL(file);
            const curImg = image.curImg;
            setImage({curImg: newImg, prevImg: curImg});
        }
    }

    function clearUploadedImg() {
        const fileInput = document.getElementById("img-input");
        fileInput.value = "";
        const prevImg = image.prevImg;
        setImage({curImg: prevImg, prevImg: prevImg});
    }

    const onUpdateUserInfor = useCallback(async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);

            const form = document.getElementById("user-infor-frm");
            if (!form.checkValidity()) {
                setNotifierData({ isError: true, title: "", message: "Hãy nhập đủ thông tin!", isOpen: true })
                return;
            }
            const formData = new FormData(form);
            const res = await fetchApiFunc(formData, `${api.customer.profileSection.updateUserInfor}/${user.id}`, 'PUT', token);

            const isError = res.code !== 200
            setNotifierData({ isError: isError, title: "", message: res.message, isOpen: true })

            if (!isError) {
                setUser(res.data);
            }

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }, [setUser, token, user.id])

    const onChangePassword = useCallback(async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);

            const form = document.getElementById("change-pass-frm");
            if (!form.checkValidity()) {
                setNotifierData({ isError: true, title: "", message: "Hãy nhập đủ thông tin!", isOpen: true })
                return;
            }
            const formData = new FormData(form);
            const res = await fetchApiFunc(formData, `${api.customer.profileSection.changePassword}/${user.id}`, 'PUT', token);

            const isError = res.code !== 200
            setNotifierData({ isError: isError, title: "", message: res.message, isOpen: true })

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }, [token, user])

    return (
        <div className="flex flex-col md:flex-row gap-5 justify-center">
            {
                <Notifier notifierData={notifierData} setNotifierData={setNotifierData}></Notifier>
            }
            {
                isLoading ? <Loading></Loading> :
                    <>
                        <form className="bg-white rounded-2xl p-6 shadow" id="user-infor-frm">
                            <h2 className="mb-4 text-xl font-bold">Thông tin chung</h2>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex flex-col justify-center items-center gap-2">
                                    <img src={image.curImg} alt="" className="w-24 h-24 rounded-full border" />
                                    <input name="avatar" id="img-input" type="file" accept="image/*" onChange={handleCreateFormChangeImage} className="hidden" />
                                    <div className="flex justify-center items-center gap-1">
                                        <label htmlFor="img-input">
                                            <div className="w-max bg-green-500 hover:bg-green-600 cursor-pointer rounded-sm text-white px-1 py-0.5 md:px-2 md:py-1">Tải ảnh</div>
                                        </label>
                                        <div className="w-max bg-red-500 hover:bg-red-600 cursor-pointer rounded-sm text-white px-1 py-0.5 md:px-2 md:py-1" onClick={clearUploadedImg}>Khôi phục</div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start justify-center min-w-max">
                                    <div className="">
                                        <label className="font-bold" htmlFor="customer-profile-username">Tên: </label>
                                        <input readOnly id="customer-profile-username" type="text" className="" value={user.username} />
                                    </div>
                                    <div>
                                        <label className="font-bold" htmlFor="customer-profile-email">Email: </label>
                                        <input name="email" type="email" id="customer-profile-email" defaultValue={user.email} />
                                    </div>
                                    <div>
                                        <label className="font-bold" htmlFor="customer-profile-phone">Số điện thoại: </label>
                                        <input name="phone" id="customer-profile-phone" type="text" className="" defaultValue={user.phone} />
                                    </div>
                                    <div>
                                        <label className="font-bold" htmlFor="customer-profile-address">Địa chỉ: </label>
                                        <input name="address" id="customer-profile-address" type="text" className="" defaultValue={user.address} />
                                    </div>
                                    <div>
                                        <label className="font-bold" htmlFor="customer-profile-coin">Lượng coin: </label>
                                        <input readOnly id="customer-profile-coin" type="text" className="" value={user.coin} />
                                    </div>
                                </div>
                            </div>

                            <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full cursor-pointer" onClick={onUpdateUserInfor}>
                                Cập nhật
                            </button>
                        </form>

                        <form className="bg-white rounded-2xl p-6 shadow" id="change-pass-frm">
                            <h2 className="mb-4 text-xl font-bold">Đổi mật khẩu</h2>
                            <input required type="password" className="w-full mb-2 p-2 rounded border" placeholder="Mật khẩu cũ" name="oldPass" />
                            <input required type="password" className="w-full mb-2 p-2 rounded border" placeholder="Mật khẩu mới" name="newPass" />
                            <input required type="password" className="w-full mb-2 p-2 rounded border" placeholder="Xác nhận" name="comfirmPass" />
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full cursor-pointer" onClick={onChangePassword}>Đổi</button>
                        </form>
                    </>
            }


        </div>
    );
}