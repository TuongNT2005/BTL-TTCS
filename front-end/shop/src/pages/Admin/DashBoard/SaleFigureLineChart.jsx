import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

export default function SaleFigureLineChart({ data }) {
    const formatCurrency = (value) => {
        if (!value) return "0đ";
        return new Intl.NumberFormat("vi-VN").format(value) + "đ";
    };

    return (
        <div className="w-full bg-white p-4 flex flex-col justify-center items-center">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis tickFormatter={formatCurrency} tickMargin={8} tick={{ fill: "#4b5563", fontSize: 11 }} width={80} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#10b981"
                        name="Thu nhập"
                        strokeWidth={2}
                    />
                    <Line
                        type="monotone"
                        dataKey="expenditure"
                        stroke="#ef4444"
                        name="Chi tiêu"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Biểu đồ thu nhập và chi tiêu
            </h3>
        </div>
    );
}