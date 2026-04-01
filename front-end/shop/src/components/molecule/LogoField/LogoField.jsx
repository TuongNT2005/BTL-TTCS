import Logo from "../../atom/logo/Logo"
import Text from "../../atom/Text/Text"
import { cn } from "../../../util"

export default function LogoField({ className, id }) {
    return <div className={cn(className, "flex flex-row justify-center items-center relative")}
        id={id}>
        <Logo className={"w-10 md:w-16"}></Logo>
        <div className="">
            <Text variant="subtitle" id="nav-text" className="font-bold bg-linear-65 from-purple-500 from-30% to-pink-500 to-90% bg-clip-text text-transparent">TG SHOP</Text>
        </div>


    </div>
}