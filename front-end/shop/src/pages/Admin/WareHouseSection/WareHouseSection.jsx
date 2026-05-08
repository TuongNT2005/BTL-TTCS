import { FaPlus } from "react-icons/fa";

import Card from "../Card";
import { useState, useContext, useCallback, useEffect } from "react";
import Table from "../Table";
import Badge from "../../Global/Bagde/Bagde";
import ActionButtons from "../ActionButton";
import Pagination from "../Pagination";
import AppContext from "../../../AppContext";
import { getImgPath, removeFieldFromArray, fetchApiFunc } from "../../../util";
import api from "../../../api";
import Loading from "../../Global/Loading/Loading";
import WareHouseSectionContext from "./WareHouseSectionContext";
import ProductVariantEditForm from "./ProductVariantEditForm";
import ImportVariantForm from "./ImportVariantForm";

export default function WareHouseSection({ keyword }) {

    const {token } = useContext(AppContext);
    const [productList, setProductList] = useState("");
    const [isImportFormOpen, setIsImportFormOpen] = useState(false);
    const [editFormState, setEditFormState] = useState({isEditFormOpen: false, productVariantId: 1});
    const [refreshKey, setRefreshKey] = useState("");
    const [curPage, setCurPage] = useState(1);
    const [totalPage, setTotalPage] = useState(100);
    const [isLoading, setIsLoading] = useState(false);
    const [productVariants, setProductVariants] = useState([
        { id: 1, image: "", name: "Áo dài", size: "L", color: "Hồng cánh sen", quantity: 10, status: "Available", category: "Áo" },
        { id: 2, image: "", name: "Quần Short Nam", size: "XL", color: "Xám", quantity: 100, status: "Unavailable", category: "Quần" },
        { id: 3, image: "", name: "Quần Short Nam", size: "2XL", color: "Xám", quantity: 100, status: "Coming", category: "Quần" },
    ]);

    const onGoNextPage = useCallback(function () {
        let nextPage = curPage + 1;
        nextPage = nextPage > totalPage ? totalPage : nextPage;
        setCurPage(nextPage);
    }, [curPage, totalPage])

    const onGoPrevPage = useCallback(function () {
        let prevPage = curPage - 1;
        prevPage = prevPage <= 0 ? 1 : prevPage;
        setCurPage(prevPage);
    }, [curPage])

    let onGoClickPage = useCallback(function (e) {
        let clickedPageNumber = e.target.innerText;
        setCurPage(clickedPageNumber);
    }, [])

    let onOpenDetailForm = useCallback(function(e) {
        const prodictVariantId = e.target.parentElement.id; 
        setEditFormState({isEditFormOpen: true, productVariantId: prodictVariantId});
    }, [])

    let onOpenImportForm = useCallback(function() {
        setIsImportFormOpen(true);
    }, [setIsImportFormOpen]);

    const searchData = useCallback(async function () {
        try {
            setIsLoading(true);
            const res = await fetchApiFunc("", `${api.admin.warehouseTab.searchProductVariant}?keyword=${keyword}&page=${curPage}`, "GET", token);
            console.log(res);
            setProductVariants(removeFieldFromArray(res.data.productVariants.content, ["importCost", "purchasePrice"]));
            setProductList(res.data.productList);
            return res;
        } catch (error) {
            alert(error);
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    }, [keyword, token, setIsLoading, curPage])

    useEffect(() => {
        async function fetchData() {
            const res = await searchData();
            setTotalPage(res.data.productVariants.totalPages);
        }

        fetchData();
    }, [searchData, refreshKey])

    return <WareHouseSectionContext.Provider value={{...editFormState, setEditFormState, refreshKey, setRefreshKey, setIsImportFormOpen, productList}}>
        <>
            {editFormState.isEditFormOpen ? <ProductVariantEditForm></ProductVariantEditForm> : isImportFormOpen ? <ImportVariantForm></ImportVariantForm> : <></>}
            {
                
                !editFormState.isEditFormOpen && !isImportFormOpen && isLoading ? <Loading></Loading> :

                    <div className="space-y-6 flex flex-col h-full">
                        <Card className="h-full flex flex-col justify-between" title="Kho" action={<button onClick={onOpenImportForm} className="inline-flex items-center gap-2 rounded-2xl bg-green-500 hover:bg-green-600 px-4 py-2.5 text-sm font-semibold text-white"><FaPlus size={16} /> Nhập kho</button>}>
                            <Table className="overflow-scroll flex-1 w-full hide-scrollbar"
                                columns={["ID", "Ảnh", "Tên", "Size", "Màu", "Số lượng", "Trạng thái", "Hành động"]}
                                rows={productVariants.map((i) => (
                                    <tr key={i.id}>
                                        <td className="px-4 py-4 font-medium">{i.id}</td>
                                        <td className="px-4 py-4"><img src={getImgPath(i.image)} alt={i.name} className="h-16 w-12 rounded-xl object-cover" /></td>
                                        <td className="px-4 py-4 font-medium">{i.name}</td>
                                        <td className="px-4 py-4">{i.size}</td>
                                        <td className="px-4 py-4">{i.color}</td>
                                        <td className="px-4 py-4">{i.quantity}</td>
                                        <td className="px-4 py-4"><Badge value={i.status} /></td>
                                        <td className="px-4 py-4"><ActionButtons id={i.id} onOpenDetailForm={onOpenDetailForm}/></td>
                                    </tr>
                                ))}
                            />
                            <Pagination totalPage={totalPage} currentPage={curPage} numberPerLine={5} onGoClickPage={onGoClickPage} onGoNextPage={onGoNextPage} onGoPrevPage={onGoPrevPage} />
                        </Card>

                    </div>
            }
        </>
    </WareHouseSectionContext.Provider>
}