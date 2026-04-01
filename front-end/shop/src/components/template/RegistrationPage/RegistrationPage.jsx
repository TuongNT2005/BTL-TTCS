import RegistrationForm from "../../organism/RegistrationForm/RegistrationForm"
import { cn } from "../../../util"
import Notifier from "../../organism/Notifier/Notifier";

export default function RegistrationPage() {

    return <>
        <Notifier></Notifier>
        <div style={{ backgroundImage: "url(https://cdn.create.vista.com/api/media/small/760044708/stock-photo-purple-mountain-landscape-wallpaper-minimalist-flat-design-style)" }}
            className={cn("w-full h-screen",
                "bg-no-repeat bg-cover",
                "flex justify-center items-center")}>
            <RegistrationForm id="registration_form" className={cn("flex flex-col justify-between items-center gap-5",
                "px-5 py-8",
                "border rounded-xl",
                "w-max h-max min-w-[350px] min-h-[300px]",
                "backdrop-blur-md bg-black/20"
            )}>
            </RegistrationForm>
        </div>
    </>

}