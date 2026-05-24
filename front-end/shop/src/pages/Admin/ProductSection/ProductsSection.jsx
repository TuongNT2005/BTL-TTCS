
import { FaPlus } from "react-icons/fa";
import { useCallback, useContext, useEffect, useState } from "react";
import Card from "../Card";
import Table from "../Table";
import ActionButtons from "../ActionButton";
import Pagination from "../Pagination";
import { fetchApiFunc } from "../../../util";
import api from "../../../api";
import Loading from "../../Global/Loading/Loading";
import AppContext from "../../../AppContext";
import ProductSectionContext from "./ProductSectionContext";
import { getImgPath } from "../../../util";
import ProductEditForm from "./ProductEditForm";
import NotFoundData from "../../Global/NotFoundData/NotFoundData";
import ProductCreateForm from "./ProductCreateFrom";

export default function ProductsSection({ keyword }) {

    const { token } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [editFormState, setEditFormState] = useState({ isEditFormOpen: false, productId: 1 });
    const [refreshKey, setRefreshKey] = useState("");
    const [curPage, setCurPage] = useState(1);
    const [totalPage, setTotalPage] = useState(100);
    const [curCategory, setCurCategory] = useState("");
    const [products, setProducts] = useState(
        [
            { id: 1, name: "Áo dài", category: "Áo", image: "https://placehold.co/400x520/f8d7da/7c3aed?text=Ao+dai" },
            { id: 2, name: "Quần Short Nam", category: "Quần", image: "https://placehold.co/400x520/e5e7eb/7c3aed?text=Quan+Short" },
        ]
    )

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

    let onOpenDetailForm = useCallback(function (e) {
        setEditFormState({ isEditFormOpen: true, productId: e.target.parentElement.id })
    }, [])

    let onOpenCreateForm = useCallback(function () {
        setIsCreateFormOpen(true);
    }, [])

    let onChangeCategory = useCallback((e) => {
        const selectedCategory = e.target.value;
        console.log(selectedCategory);
        setCurCategory(selectedCategory);
    }, [])

    const searchData = useCallback(async function () {
        try {
            setIsLoading(true);
            const res = await fetchApiFunc("", `${api.admin.productTab.searchProduct}?keyword=${keyword}&page=${curPage}&category=${curCategory}`, "GET", token);
            console.log(res);
            setProducts(res.data.content);
            return res;
        } catch (error) {
            alert(error);
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    }, [keyword, token, setIsLoading, curPage, curCategory])

    // Reset page khi keyword thay đổi
    useEffect(() => {
        setCurPage(1);
    }, [keyword]);

    useEffect(() => {
        async function fetchData() {
            const res = await searchData();
            setTotalPage(res.data.totalPages);
        }

        fetchData();
    }, [searchData, refreshKey, curCategory])

    return <ProductSectionContext.Provider value={{ ...editFormState, setEditFormState, refreshKey, setRefreshKey, isCreateFormOpen, setIsCreateFormOpen }}>
        <>

            {
                editFormState.isEditFormOpen ? <ProductEditForm></ProductEditForm> :
                    isCreateFormOpen ? <ProductCreateForm></ProductCreateForm> : <></>
            }
            {

                (!isCreateFormOpen && !editFormState.isEditFormOpen && isLoading) ? <Loading></Loading> :
                    <>

                        <div className="space-y-6 flex flex-col h-full">

                            <Card className="h-full flex flex-col justify-between" title="Sản phẩm" action={<button onClick={onOpenCreateForm} className="inline-flex items-center gap-2 rounded-2xl bg-green-500 hover:bg-green-600 px-4 py-2.5 text-sm font-semibold text-white cursor-pointer"><FaPlus size={16} /> Thêm</button>}>
                                <div className="flex flex-row gap-2 mb-4">
                                    <label htmlFor="select-category" className="font-bold">Thể loại: </label>
                                    <select name="" id="select-category" defaultValue={curCategory ? curCategory : ""} onChange={onChangeCategory}>
                                        <option value="">ALL</option>
                                        <option value="SHIRT">SHIRT</option>
                                        <option value="PANTS">PANTS</option>
                                        <option value="SET">SET</option>
                                        <option value="DRESS">DRESS</option>
                                        <option value="SPORTWARE">SPORTWARE</option>
                                    </select>
                                </div>
                                {
                                    !products || products.length === 0 ? <NotFoundData></NotFoundData> :
                                        <>
                                            <Table className="overflow-scroll flex-1 w-full hide-scrollbar"
                                                columns={["ID", "Ảnh", "Tên", "Loại", "Hành động"]}
                                                rows={products.map((p) => (
                                                    <tr key={p.id}>
                                                        <td className="px-4 py-4 font-medium">{p.id}</td>
                                                        <td className="px-4 py-4"><img src={getImgPath(p.image)} alt={p.name} className="h-16 w-12 rounded-xl object-cover" /></td>
                                                        <td className="px-4 py-4 font-medium">{p.name}</td>
                                                        <td className="px-4 py-4 text-slate-600">{p.category}</td>
                                                        <td className="px-4 py-4"><ActionButtons id={p.id} onOpenDetailForm={onOpenDetailForm} /></td>
                                                    </tr>
                                                ))}
                                            />
                                            <Pagination currentPage={curPage} totalPage={totalPage} numberPerLine={5} onGoClickPage={onGoClickPage} onGoNextPage={onGoNextPage} onGoPrevPage={onGoPrevPage} />
                                        </>
                                }
                            </Card>
                        </div>
                    </>
            }
        </>
    </ProductSectionContext.Provider>
}