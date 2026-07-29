
import { CiCircleCheck } from "react-icons/ci";
import { GoXCircle } from "react-icons/go";
import { FaHome } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentResult() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const success =
        searchParams.get("vnp_ResponseCode") === "00" &&
        searchParams.get("vnp_TransactionStatus") === "00";

    const orderId = searchParams.get("vnp_TxnRef");

    console.log(orderId)

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden">

                {/* Header */}
                

                <div className="p-10">

                    {/* Icon */}
                    <div className="flex justify-center">
                        {success ? (
                            <CiCircleCheck
                                size={100}
                                className="text-green-500"
                            />
                        ) : (
                            <GoXCircle
                                size={100}
                                className="text-red-500"
                            />
                        )}
                    </div>

                    {/* Title */}
                    <h1
                        className={`text-3xl font-bold text-center mt-5 ${
                            success
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >
                        {success
                            ? "Thanh toán thành công"
                            : "Thanh toán thất bại"}
                    </h1>

                    <p className="text-center text-gray-500 mt-2">
                        {success
                            ? "Đơn hàng của bạn đã được thanh toán thành công."
                            : "Thanh toán chưa hoàn tất hoặc đã xảy ra lỗi."}
                    </p>

                    {/* Information */}
                    <div className="mt-8 border rounded-2xl overflow-hidden">

                        <div className="flex justify-between p-4 border-b bg-gray-50">
                            <span className="font-medium text-gray-600">
                                Mã đơn hàng
                            </span>
                            <span className="font-semibold text-black">
                                {orderId}
                            </span>
                        </div>

                        <div className="flex justify-between p-4 border-b">
                            <span className="font-medium text-gray-600">
                                Phương thức
                            </span>
                            <span className="font-semibold text-black">
                                VNPAY
                            </span>
                        </div>

                        <div className="flex justify-between p-4">
                            <span className="font-medium text-gray-600">
                                Trạng thái
                            </span>

                            <span
                                className={`font-semibold ${
                                    success
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {success
                                    ? "Đã thanh toán"
                                    : "Thanh toán thất bại"}
                            </span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">

                        <button
                            onClick={() => navigate("/customer")}
                            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <FaHome size={20} />
                            Trang chủ
                        </button>

                        {/* <button
                            onClick={() => navigate("/customer/orders")}
                            className="flex-1 border border-violet-600 text-violet-600 hover:bg-violet-50 font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={20} />
                            Xem đơn hàng
                        </button> */}

                    </div>
                </div>
            </div>
        </div>
    );
}