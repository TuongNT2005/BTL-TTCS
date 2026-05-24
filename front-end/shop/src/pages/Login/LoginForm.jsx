import { useState, useContext } from "react";
import { fetchApiFunc, cn } from "../../util";
import AppContext from "../../AppContext";
import api from "../../api";
import logo from "../../assets/react.svg";
import Notifier from "../Global/Notifier/Notifier";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Global/Loading/Loading";

export default function LoginForm({ className, id }) {

    const navigate = useNavigate();
    const { setToken} = useContext(AppContext);
    const [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });
    const [isLoading, setIsLoading] = useState(false);

    async function onLogin(e) {
        e.preventDefault();

        console.log("abcde");
        const form = document.getElementById(id);

        if (!form.checkValidity()) {
            setNotifierData({ isError: true, title: "Lỗi", message: "Hãy nhập đủ thông tin!", isOpen: true })
            return;
        }

        const formData = new FormData(form);
        try {
            setIsLoading(true)

            const data = await fetchApiFunc(formData, api.login, "POST");
            let isError = data.code !== 200;

            if (!isError) {
                console.log(data.data)
                setToken(data.data.accessToken);
                localStorage.setItem('authUser', JSON.stringify(data.data.user));
                data.data.user.role === "USER" ? navigate("/home") : navigate("/ad")
            }
            else {
                setNotifierData({
                    isError: isError,
                    title: isError ? "Lỗi!" : "Thành công!",
                    message: data.message,
                    isOpen: true
                });
            }

        } catch (error) {
            console.error(error);
            setNotifierData({ isError: true, title: "Lỗi", message: "Lỗi từ sever!", isOpen: true });
        } finally {
            setIsLoading(false);
        }

    }

    setToken("");

    return <>
        <Notifier notifierData={notifierData} setNotifierData={setNotifierData}></Notifier>
        <form action="" className={cn("backdrop-blur-md bg-black/20", className)} id={id}>
            <section className="flex justify-center items-center">
                <div className="flex flex-row justify-center items-center relative">
                    <img src={logo} alt="" className="w-10 md:w-16" />
                    <div className="">
                        <p className="md:text-3xl text-2xl font-bold bg-linear-65 from-purple-500 from-30% to-pink-500 to-90% bg-clip-text text-transparent">TG SHOP</p>
                    </div>
                </div>
            </section>
            <hr className="w-4/5" />
            {
                isLoading ? <Loading></Loading> :
                    <>
                        <section className="flex flex-col gap-3 w-full">
                            <p className="text-xl md:text-3xl font-bold">Login Form</p>
                            <input type="text" placeholder="Tên đăng nhập" id="username" required name="username" className="w-full px-3 py-3 border rounded-md" />
                            <input type="password" placeholder="Mật khẩu" id="password" required name="password" className="w-full px-3 py-3 border rounded-md" />
                        </section>
                        <section className="flex flex-col gap-3 w-full">
                            <button className="md:text-xl text-lg w-full px-3 py-1 border rounded-md bg-green-500 hover:bg-green-700 cursor-pointer" id="loginBtn" onClick={onLogin}>
                                <p>Đăng nhập</p>
                            </button>
                            <Link to="/registration">
                                <button className="md:text-xl text-lg w-full px-3 py-1 border rounded-md bg-blue-500 hover:bg-blue-700 cursor-pointer" id="registrationBtn">
                                    <p>Đăng ký</p>
                                </button>
                            </Link>

                        </section>
                    </>
            }

        </form>
    </>
}