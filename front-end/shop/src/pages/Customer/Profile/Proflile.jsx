import { getImgPath } from "../../../util";

export default function Profile({ user }) {
    return (
        <div className="flex flex-col md:flex-row gap-5">
            <div className="bg-white rounded-2xl p-6 shadow">
                <div className="flex items-center gap-4 mb-4">
                    <img src={getImgPath(user.image)} alt="" className="w-24 h-24 rounded-full "/>
                    <div className="flex flex-col items-start justify-center">
                        <div className="">
                            <label htmlFor="customer-profile-username">Tên: </label>
                            <input id="customer-profile-username" type="text" className="font-semibold" defaultValue={user.username} />
                        </div>
                        <div>
                            <label htmlFor="customer-profile-email">Email: </label>
                            <input type="email" name="" id="customer-profile-email" value={user.email}/>
                        </div>
                        <div>
                            <label htmlFor="customer-profile-phone">Số điện thoại: </label>
                            <input id="customer-profile-phone" type="text" className="font-semibold" defaultValue={user.phone} />
                        </div>
                        <div>
                            <label htmlFor="customer-profile-address">Địa chỉ: </label>
                            <input id="customer-profile-address" type="text" className="font-semibold" defaultValue={user.address} />
                        </div>
                    </div>
                </div>



                <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full">
                    Cập nhật
                </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="mb-4 font-semibold">Đổi mật khẩu</h2>
                <input className="w-full mb-2 p-2 rounded border" placeholder="Mật khẩu cũ" />
                <input className="w-full mb-2 p-2 rounded border" placeholder="Mật khẩu mới" />
                <input className="w-full mb-2 p-2 rounded border" placeholder="Xác nhận" />
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full">Đổi</button>
            </div>

        </div>
    );
}