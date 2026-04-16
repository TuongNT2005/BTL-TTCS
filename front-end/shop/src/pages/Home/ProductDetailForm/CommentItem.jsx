import { getImgPath } from "../../../util"
import { IoMdStar } from "react-icons/io";

getImgPath

export default function CommentItem({ item }) {
    return <div className="flex flex-col w-full p-2 hover:bg-gray-300">
        <div className="flex flex-row justify-between">
            <div className="flex gap-2">
                <img src={getImgPath(item.avatar)} alt="" className="w-10 h-10 rounded-full object-fill" />
                <div>
                    <p className="font-bold">{item.user.username}</p>
                    <p className="text-xs italic">{item.comment.createdAt}</p>
                </div>
            </div>
            <div className="flex flex-row">
                {
                    Array.from({ length: item.comment.star }).map(() => <IoMdStar className="text-yellow-500 text-sm md:text-xl"></IoMdStar>)
                }
            </div>
        </div>
        <p className="text-left">{item.comment.content ? item.comment.content : "Người dùng này chỉ để lại đánh giá bằng số sao!"}</p>
    </div>
}