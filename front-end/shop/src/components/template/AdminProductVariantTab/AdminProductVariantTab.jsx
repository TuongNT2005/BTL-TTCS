import Sidebar from "../../organism/Sidebar/Sidebar"
import AdminPageHeader from "../../organism/AdminPageHeader/AdminPageHeader";
import Navigation from "../../organism/Navigation/Navigation";
import { useState, useEffect, useContext, useRef, useCallback, useMemo } from "react";
import AdminProductVariantContext from "./AdminProductVariantContext";
import AppContext from "../../../AppContext";
import ProductEditForm from "../AdminProductTab/ProductEditForm";
import api from "../../../api";
import { fetchApiFunc } from "../../../util";
import Button from "../../atom/Button/Button";
import Table from "../../organism/Table/Table";
import Text from "../../atom/Text/Text";
import NotFoundData from "../AdminPage/NotFoundData";
import Loading from "../../organism/Loading/Loading";
import ProductVariantImportForm from "./ProductVariantImportForm";

export default function AdminProductCVariantTab() {

    let [editFormState, setEditFormState] = useState({ isEditFormOpen: false, productId: 1 });
    let [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    let [curPageNumber, setCurPageNumber] = useState(1);
    let [refreshKey, setRefreshKey] = useState(0);
    let { token} = useContext(AppContext);
    let [tabData, setTabData] = useState({ headers: [], body: [], totalPages: 1 });
    let searchTimerRef = useRef(null);
    let [isLoading, setIsLoading] = useState(false);

    console.log(tabData.body)


    const searchData = useCallback(async function (keyword, page) {
        try {
            setIsLoading(true);
            const res = await fetchApiFunc("", `${api.admin.warehouseTab.searchProductVariant}?keyword=${keyword}&page=${page}`, "GET", token);
            console.log(res);
            setTabData({
                headers: ["Id", "Ảnh", "Loại", "Size", "Màu", "Số lượng", "Trạng thái"],
                body: res.data.content.map(d => {
                    const { description, ...dataWithoutDescription } = d;
                    console.log(description);
                    return dataWithoutDescription;
                }),
                totalPages: res.data.totalPages
            });
            return res;
        } catch (error) {
            alert(error);
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    }, [token, setIsLoading])


    function onKeywordChange(e) {
        setCurPageNumber(1);
        let page = 1;
        let keyword = e.target.value;
        clearTimeout(searchTimerRef.current);

        searchTimerRef.current = setTimeout(() => {
            searchData(keyword, page);
        }, 750);
    }

    function onChangeNumberOfPage(e) {
        setCurPageNumber(Number(e.target.innerText));
        let keyword = document.getElementById("admin-search-field").value;
        searchData(keyword ? keyword : "", Number(e.target.innerText));
    }

    function onClickNextPage() {
        let nextPageNumber = curPageNumber + 1;
        nextPageNumber = nextPageNumber <= tabData.totalPages ? nextPageNumber : tabData.totalPages;
        let keyword = document.getElementById("admin-search-field").value;
        searchData(keyword ? keyword : "", nextPageNumber);
        setCurPageNumber(nextPageNumber);
    }

    function onClickPrevPage() {
        let prevPageNumber = curPageNumber - 1;
        prevPageNumber = prevPageNumber > 0 ? prevPageNumber : 1
        let keyword = document.getElementById("admin-search-field").value;
        searchData(keyword ? keyword : "", prevPageNumber);
        setCurPageNumber(prevPageNumber);
    }

    const openCreateForm = useCallback(() => {
        setIsCreateFormOpen(true);
    }, [])
    // function openCreateForm() {
    //     setIsCreateFormOpen(true);
    // }

    const openEditForm = useCallback((e) => {
        let productId = e.target.parentElement.parentElement.parentElement.parentElement.id;
        setEditFormState({ isEditFormOpen: true, productId: productId });
    }, [])

    const buttons = useMemo(() => ({
        "Chi tiết": (
            <Button
                className="w-max rounded-sm"
                variant="violetBtn"
                onClickFunc={openEditForm}
            >
                <Text variant="small">Chi tiết</Text>
            </Button>
        ),
    }), [openEditForm]);

    useEffect(() => {
        console.log("efect được gọi");
        let keyword = document.getElementById("admin-search-field").value;
        keyword = keyword ? keyword : "";
        searchData(keyword, curPageNumber);

    }, [curPageNumber, searchData, refreshKey]);

    return <AdminProductVariantContext.Provider value={{ ...editFormState, setEditFormState, setCurPageNumber, refreshKey, setRefreshKey, isCreateFormOpen, setIsCreateFormOpen }}>
        {/* {editFormState.isEditFormOpen ? <ProductEditForm></ProductEditForm> : <></>} */}
        {isCreateFormOpen ? <ProductVariantImportForm></ProductVariantImportForm> : <></>}

        <div className="flex flex-row w-full relative">
            <Sidebar className="sticky top-0 left-0"></Sidebar>
            {/* --------------------------------------------------------- */}
            <section className="flex flex-col justify-start items-center w-full h-screen bg-gray-900">
                <AdminPageHeader onClickAddBtn={openCreateForm} onChange={onKeywordChange} tabName="Sản phẩm" className="w-full md:px-3 md:py-5 px-2 py-3"></AdminPageHeader>
                {
                    isLoading && !isCreateFormOpen && !editFormState.isEditFormOpen ? <Loading></Loading> : tabData && tabData.body.length > 0 ?
                        <div className="w-full h-full overflow-y-scroll">
                            <Table data={tabData} buttons={buttons}className="w-full"></Table>
                        </div>
                        :
                        <NotFoundData></NotFoundData>
                }

                <Navigation funcs={{
                    onChangeNumberOfPage: onChangeNumberOfPage,
                    onClickNextPage: onClickNextPage,
                    onClickPrevPage: onClickPrevPage
                }} totalNumber={tabData.totalPages} numberPerLine={5} currentNumber={curPageNumber} className=" w-full gap-x-2"></Navigation>
            </section>
        </div>
    </AdminProductVariantContext.Provider>

}