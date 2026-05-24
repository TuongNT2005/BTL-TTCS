import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLOR_MAP = {
    "PANTS": "#3B82F6",
    "SHIRTS": "#10B981",
    "SKIRTS": "#F59E0B",
    "DRESSES": "#EF4444",
    "test": "#8B5CF6"
};

export default function CategoryPieChart({fullData}) {

    // const fullData = [
    //     { name: "PANTS", value: 261000, color: "#3B82F6" },
    //     { name: "SHIRTS", value: 0, color: "#10B981" },
    //     { name: "SKIRTS", value: 0, color: "#F59E0B" },
    //     { name: "DRESSES", value: 0, color: "#EF4444" }
    // ].filter(item => item.value > 0);

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
                        dataKey="totalIncome"
                        nameKey="category"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={true}
                    >
                        {fullData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLOR_MAP[entry.category]}/>
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toLocaleString()} VND`} />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Doanh thu theo danh mục
            </h3>
        </div>
    );

}