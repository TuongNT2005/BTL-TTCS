import { useState } from "react";
import { fetchApiFunc } from "../../util";
import api from "../../api";
import Notifier from "../Global/Notifier/Notifier";
import { Link } from "react-router-dom";
import logo from "../../assets/react.svg";
import Loading from "../Global/Loading/Loading";


export default function RegistrationForm({ className, id }) {

    const [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });
    const [isLoading, setIsLoading] = useState(false);

    function checkConfirmPassword() {
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("check-password").value;
        return password === confirmPassword;
    }

    async function onRegistration(e) {
        e.preventDefault();
        const form = document.getElementById(id);

        if (!form.checkValidity()) {
            setNotifierData({ isError: true, title: "Lỗi", message: "Hãy điền đủ thông tin vào form!", isOpen: true });
            return;
        }
        if (!checkConfirmPassword()) {
            setNotifierData({ isError: true, title: "Lỗi", message: "Mật khẩu không khớp. Hãy kiểm tra lại!", isOpen: true });
            return;
        }
        const formData = new FormData(form);
        console.log(formData);
        try {
            setIsLoading(true);

            const data = await fetchApiFunc(formData, api.registration, "POST");
            let isError = data.code !== 200;
            setNotifierData({
                isError: isError,
                title: isError ? "Lỗi!" : "Thành công!",
                message: data.message,
                isOpen: true
            });
        } catch (error) {
            console.error(error);
            setNotifierData({ isError: true, title: "Lỗi", message: "Lỗi từ sever!", isOpen: true });
        } finally {
            setIsLoading(false);
        }

    }

    return <>
        <Notifier notifierData={notifierData} setNotifierData={setNotifierData}></Notifier>
        <form action="" className={className} id={id}>
            <section className="flex justify-center items-center">
                <section className="flex justify-center items-center">
                    <div className="flex flex-row justify-center items-center relative">
                        <img src={logo} alt="" className="w-10 md:w-16" />
                        <div className="">
                            <p className="md:text-3xl text-2xl font-bold bg-linear-65 from-purple-500 from-30% to-pink-500 to-90% bg-clip-text text-transparent">TG SHOP</p>
                        </div>
                    </div>
                </section>
            </section>
            <hr className="w-4/5" />
            {
                isLoading ? <Loading></Loading> :
            <>
                <section className="flex flex-col gap-3 w-full">
                    <p className="text-xl md:text-3xl font-bold">Registration Form</p>
                    <input type="text" placeholder="Tên đăng nhập" id="username" required name="username" className="w-full px-3 py-3 border rounded-md" />
                    <input type="password" placeholder="password" id="password" required name="password" className="w-full px-3 py-3 border rounded-md" />
                    <input type="password" placeholder="Xác nhận mật khẩu" id="check-password" required name="check-password" className="w-full px-3 py-3 border rounded-md" />
                </section>
                <section className="flex flex-col gap-3 w-full">
                    <button className="md:text-xl text-lg w-full px-3 py-1 border rounded-md bg-green-500 hover:bg-green-700 cursor-pointer" onClick={onRegistration}>
                        <p>Đăng ký</p>
                    </button>
                    <Link to="/">
                        <button className="md:text-xl text-lg w-full px-3 py-1 border rounded-md bg-blue-500 hover:bg-blue-700 cursor-pointer">
                            <p>Đăng nhập</p>
                        </button>
                    </Link>

                </section>

            </>
            }
        </form>
    </>
}