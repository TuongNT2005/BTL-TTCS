import Button from "../../atom/Button/Button";
import Text from "../../atom/Text/Text";
import LogoField from "../../molecule/LogoField/LogoField";
import Input from "../../atom/input/Input";
import AppContext from "../../../AppContext";
import { useContext } from "react";
import { checkFormInputIsEmpty, fetchApiFunc } from "../../../util";
import apis from "../../../api"
import { Link } from "react-router-dom";

export default function RegistrationForm({ className, id }) {

    const { setNotifierData } = useContext(AppContext);

    function checkConfirmPassword() {
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("check-password").value;
        return password === confirmPassword;
    }

    async function onRegistration(e) {
        e.preventDefault();
        const form = document.getElementById(id);
        console.log(checkFormInputIsEmpty(form));

        if (checkFormInputIsEmpty(form)) {
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
            const data = await fetchApiFunc(formData, apis.registration, "POST");
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
        }

    }

    return <form action="" className={className} id={id}>
        <section className="flex justify-center items-center">
            <LogoField></LogoField>
        </section>
        <hr className="w-4/5" />
        <section className="flex flex-col gap-3 w-full">
            <Text variant="heading">Registration Form</Text>
            <Input type="text" name="username" placeholder="Tên đăng nhập" id="username" isRequired={true} className="w-full px-3 py-3 border rounded-md"></Input>
            <Input type="password" name="password" placeholder="Mật khẩu" id="password" isRequired={true} className="w-full px-3 py-3 border rounded-md"></Input>
            <Input type="password" name="check-password" placeholder="Xác nhận mật khẩu" id="check-password" isRequired={true} className="w-full px-3 py-3 border rounded-md"></Input>
        </section>
        <section className="flex flex-col gap-3 w-full">
            <Button variant="blueBtn" onClickFunc={onRegistration} className="w-full h-full px-3 py-1 border rounded-md">
                <Text variant="body">Đăng ký</Text>
            </Button>
            <Link to="/login">
                <Button variant="greenBtn" className="w-full h-full px-3 py-1 border rounded-md" >
                    <Text variant="body">Quay lại đăng nhập</Text>
                </Button>
            </Link>

        </section>

    </form>
}