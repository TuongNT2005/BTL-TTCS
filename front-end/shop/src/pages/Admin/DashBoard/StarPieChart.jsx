import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLOR_MAP = {
    "1": "#3B82F6",
    "2": "#10B981",
    "3": "#F59E0B",
    "4": "#EF4444",
    "5": "#8B5CF6"
};

export default function StarPieChart({fullData}) {

    return (
        <div className="w-full h-96 bg-white p-4 rounded-xl">
            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie
                        data={fullData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60} 
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="star"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={true}
                    >
                        {fullData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLOR_MAP[entry.star]}/>
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toLocaleString()} lượt đánh giá`} />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Lượt đánh giá về sản phẩm
            </h3>
        </div>
    );

}