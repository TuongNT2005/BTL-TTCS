import Card from "../Card"
import SummaryCard from "./SummaryCard"
import { fetchApiFunc, formatDate, genID, getImgPath } from "../../../util"
import { useContext, useState, useEffect, useCallback } from "react";
import AppContext from "../../../AppContext";
import api from "../../../api";
import Loading from "../../Global/Loading/Loading"
import CategoryPieChart from "./CategoryPieChart";
import StarPieChart from "./StarPieChart";
import SaleFigureLineChart from "./SaleFigureLineChart";
import Table from "../Table";
import NotFoundData from "../../Global/NotFoundData/NotFoundData";

const summaryBgColors = {
    "totalProducts": "bg-gradient-to-br from-blue-300 to-blue-500",
    "totalProductVariants": "bg-gradient-to-br from-green-300 to-green-500",
    "totalUsers": "bg-gradient-to-br from-yellow-300 to-yellow-500",
    "totalUndeliveriedOrders": "bg-gradient-to-br from-pink-300 to-pink-600",
    "totalUnhandledRefundRequests": "bg-gradient-to-br from-orange-300 to-orange-600",
    "totalAvalibleEvents": "bg-gradient-to-br from-cyan-300 to-cyan-500",
    "totalExpenditure": "bg-gradient-to-br from-rose-300 to-rose-600",
    "totalIncome": "bg-gradient-to-br from-emerald-300 to-emerald-500",
    "totalProfit": "bg-gradient-to-br from-violet-400 to-violet-700"
}

export default function DashBoard() {

    const { token } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [startDate, setStartDate] = useState('2026-01-01');
    const [endDate, setEndDate] = useState('2026-07-01');
    const [summaries, setSummaries] = useState([]);
    const [saleWithCategories, setSaleWithCategories] = useState([]);
    const [starCount, setStarCount] = useState([]);
    const [saleFigures, setSaleFigures] = useState([]);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [topSpendingCustomers, setTopSpendingCustomers] = useState([]);

    const onChangeStartDate = useCallback((e) => {
        console.log(e.target.value);
        setStartDate(e.target.value)
    }, [])

    const onChangeEndDate = useCallback((e) => {
        setEndDate(e.target.value)
    }, [])

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);

                const summaryData = await fetchApiFunc(null, `${api.admin.dashBoard.getSummary}?startAt=${formatDate(startDate)}&endAt=${formatDate(endDate)}`, 'GET', token);
                if (summaryData.code === 200) {
                    console.log(summaryData.data);
                    setSummaries(summaryData.data);
                }

                const saleWithCategoriesData = await fetchApiFunc(null, `${api.admin.dashBoard.getSaleWithCategories}?startAt=${formatDate(startDate)}&endAt=${formatDate(endDate)}`, 'GET', token);
                if (saleWithCategoriesData.code === 200) {
                    console.log(saleWithCategoriesData.data);
                    setSaleWithCategories(saleWithCategoriesData.data);
                }

                const starCount = await fetchApiFunc(null, api.admin.dashBoard.getStarCount, 'GET', token);
                if (starCount.code === 200) {
                    console.log(starCount.data);
                    setStarCount(starCount.data);
                }

                const saleFigures = await fetchApiFunc(null, `${api.admin.dashBoard.getSaleFigure}?startAt=${formatDate(startDate)}&endAt=${formatDate(endDate)}`, 'GET', token);
                if (saleFigures.code === 200) {
                    console.log(saleFigures.data);
                    setSaleFigures(saleFigures.data);
                }

                const trendingProducts = await fetchApiFunc(null, `${api.admin.dashBoard.getTrendingProducts}?startAt=${formatDate(startDate)}&endAt=${formatDate(endDate)}`, 'GET', token);
                if (trendingProducts.code === 200) {
                    console.log(trendingProducts.data);
                    setTrendingProducts(trendingProducts.data);
                }

                const topSpendingCustomers = await fetchApiFunc(null, `${api.admin.dashBoard.getTopSpendingCustomers}?startAt=${formatDate(startDate)}&endAt=${formatDate(endDate)}`, 'GET', token);
                if (topSpendingCustomers.code === 200) {
                    console.log(topSpendingCustomers.data);
                    setTopSpendingCustomers(topSpendingCustomers.data);
                }

            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [endDate, startDate, token])

    return <>
        <Card title="Dashboard" className="bg-white h-full py-5">
            <div className="w-full flex flex-col md:flex-row md:gap-x-2">
                <div className="flex flex-row gap-2">
                    <label htmlFor="startAtInput" className="font-bold">Ngày bắt đầu: </label>
                    <input onChange={onChangeStartDate} defaultValue={startDate} type="date" className="border px-1 py-0.5 rounded-lg border-violet-200" id="startAtInput" />
                </div>
                <div className="flex flex-row gap-2">
                    <label htmlFor="endAtInput" className="font-bold">Ngày kết thúc: </label>
                    <input onChange={onChangeEndDate} defaultValue={endDate} type="date" className="border px-1 py-0.5 rounded-lg border-violet-200" id="endAtInput" />
                </div>
            </div>
            {
                isLoading ? <Loading></Loading> : <>
                    <div className="w-full h-4/5 overflow-scroll hide-scrollbar py-5">
                        <section className="w-full flex flex-row flex-wrap gap-1 justify-center py-5">
                            {
                                Object.entries(summaries).map(([title, figure]) => <SummaryCard key={genID()} title={title} figure={figure} className={summaryBgColors[title]}></SummaryCard>)
                            }
                        </section>
                        <section className="w-full flex flex-col md:flex-row h-max py-5">
                            <div className="w-full md:w-1/2 flex justify-center items-center">
                                {
                                    !saleWithCategories || saleWithCategories.length === 0 ? <NotFoundData></NotFoundData> : <CategoryPieChart fullData={saleWithCategories}></CategoryPieChart>
                                }
                            </div>
                            <div className="w-full md:w-1/2 flex justify-center items-center">
                                {
                                    !starCount || starCount.length === 0 ? <NotFoundData></NotFoundData> : <StarPieChart fullData={starCount}></StarPieChart>
                                }
                            </div>
                        </section>
                        <section className="overflow-visible py-5">
                            <SaleFigureLineChart data={saleFigures}></SaleFigureLineChart>
                        </section>
                        <section className="w-full flex justify-between py-5">
                            <div className="w-49/100">
                                <p className="text-lg font-semibold text-gray-800 mb-4">Người dùng mua nhiều</p>
                                {
                                    !topSpendingCustomers || topSpendingCustomers.length === 0 ? <NotFoundData></NotFoundData> :
                                        <>
                                            <Table className={"w-full overflow-scroll hide-scrollbar"}
                                                columns={["ID", "Ảnh", "Email", "Đã mua", "Tổng chi tiêu"]}
                                                rows={topSpendingCustomers.map((e) => (
                                                    <tr key={e.id}>
                                                        <td className="px-4 py-4 font-medium">{e.id}</td>
                                                        <td className="px-4 py-4"><img src={getImgPath(e.image)} alt={e.name} className="h-16 w-12 rounded-full object-cover" /></td>
                                                        <td className="px-4 py-4">{e.email}</td>
                                                        <td className="px-4 py-4">{e.boughtProducts}</td>
                                                        <td className="px-4 py-4">{e.totalSpending}</td>
                                                    </tr>
                                                ))}
                                            />
                                        </>
                                }
                            </div>

                            <div className="w-49/100">
                                <p className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm bán chạy</p>
                                {
                                    !trendingProducts || trendingProducts.length === 0 ? <NotFoundData></NotFoundData> :
                                        <>
                                            <Table className={"w-full overflow-scroll hide-scrollbar"}
                                                columns={["ID", "Ảnh", "Tên", "Đã thêm vào giỏ"]}
                                                rows={trendingProducts.map((e) => (
                                                    <tr key={e.id}>
                                                        <td className="px-4 py-4 font-medium">{e.id}</td>
                                                        <td className="px-4 py-4"><img src={getImgPath(e.image)} alt={e.name} className="h-16 w-12 rounded-xl object-cover" /></td>
                                                        <td className="px-4 py-4">{e.name}</td>
                                                        <td className="px-4 py-4">{e.quantity}</td>
                                                    </tr>
                                                ))}
                                            />
                                        </>
                                }

                            </div>
                        </section>
                    </div>
                </>
            }

        </Card>
    </>
}