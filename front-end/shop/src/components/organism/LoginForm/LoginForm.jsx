import Button from "../../atom/Button/Button"
import Text from "../../atom/Text/Text"
import LogoField from "../../molecule/LogoField/LogoField"
import Input from "../../atom/input/Input"
import { checkFormInputIsEmpty, fetchApiFunc } from "../../../util"
import apis from "../../../api"
import { useContext, useState } from "react"
import AppContext from "../../../AppContext"
import { Link, useNavigate } from "react-router-dom"
import { cn } from "../../../util"
import Notifier from "../../../pages/Global/Notifier/Notifier"

export default function LoginForm({ className, id }) {

    const navigate = useNavigate();
    const { setToken, setAuthUser } = useContext(AppContext);
    const [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });

    async function onLogin(e) {
        e.preventDefault();
        const form = document.getElementById(id);

        if (checkFormInputIsEmpty(form)) {
            setNotifierData({ isError: true, title: "Lỗi", message: "Hãy điền đủ thông tin vào form!", isOpen: true });
            return;
        }

        const formData = new FormData(form);
        try {
            const data = await fetchApiFunc(formData, apis.login, "POST");
            let isError = data.code !== 200;

            if (!isError) {
                console.log(data.data)
                setToken(data.data.accessToken);
                setAuthUser(data.data.user)
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
        }

    }
   
    setToken("");

    return <>
        <Notifier notifierData={notifierData} setNotifierData={setNotifierData}></Notifier>
        <form action="" className={cn("backdrop-blur-md bg-black/20", className)} id={id}>
            <section className="flex justify-center items-center">
                <LogoField></LogoField>
            </section>
            <hr className="w-4/5" />
            <section className="flex flex-col gap-3 w-full">
                <Text variant="heading">Login Form</Text>
                <Input type="text" placeholder="Tên đăng nhập" id="username" isRequired={true} name="username" className="w-full px-3 py-3 border rounded-md"></Input>
                <Input type="password" placeholder="Mật khẩu" id="password" isRequired={true} name="password" className="w-full px-3 py-3 border rounded-md"></Input>
            </section>
            <section className="flex flex-col gap-3 w-full">
                <Button variant="greenBtn" className="w-full px-3 py-1 border rounded-md" id="loginBtn" onClickFunc={onLogin}>
                    <Text variant="body">Đăng nhập</Text>
                </Button>
                <Link to="/registration">
                    <Button variant="blueBtn" className="w-full px-3 py-1 border rounded-md" id="registrationBtn">
                        <Text variant="body">Đăng ký tài khoản</Text>
                    </Button>
                </Link>

            </section>

        </form>
    </>
}