import { useState, useEffect, useContext, useCallback } from "react"
import SectionHeader from "../SectionHeader";
import Pagination from "../../Admin/Pagination";
import Container from "../Container";
import ProductCard from "../ProductCard";
import Slider from "../Slider";
import api from "../../../api";
import { fetchApiFunc } from "../../../util";
import AppContext from "../../../AppContext";
import Loading from "../../Global/Loading/Loading";
import NotFoundData from "../../Global/NotFoundData/NotFoundData";
import ProductDetailForm from "../ProductDetailForm/ProductDetailForm";

export default function SearchResultSection({ keyword, category, setIsSearching }) {

    console.log("result được gọi");
    console.log(keyword);
    console.log(category);
    const [products, setProducts] = useState(Array.from({ length: 10 }).map((_, i) => ({
        id: i + 1,
        name: "Áo dài",
        category: "Áo",
        price: 150000,
        salePrice: 150000,
        discount: 0,
        stock: 100,
        size: "L",
        color: "Hồng cánh sen",
        image: `https://placehold.co/600x800/f8d7da/8b5cf6?text=Ao+dai+${i + 1}`,
    })));

    const { token } = useContext(AppContext);
    const [curPage, setCurPage] = useState(1);
    const [totalPage, setTotalPage] = useState(100);
    const [isLoading, setIsLoading] = useState(false);
    const [detailFormState, setDetailFormState] = useState({ isDetailFormOpen: false, productId: 1 });

    function onOpenDetailForm(e) {
        const productId = e.target.parentElement.id;
        setDetailFormState({ isDetailFormOpen: true, productId: productId });
    }

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

    const onGoClickPage = useCallback(function (e) {
        let clickedPageNumber = e.target.innerText;
        setCurPage(clickedPageNumber);
    }, [])

    const onClose = useCallback(function () {
        setIsSearching(false);
    }, [setIsSearching])

    const searchData = useCallback(async function () {
        console.log("api được gọi");
        try {
            setIsLoading(true);
            const res = await fetchApiFunc(null, `${api.home.general.searchProduct}?keyword=${keyword}&page=${curPage}&category=${category}`, "GET", token);
            const isError = res.code !== 200;
            console.log(res);
            setProducts(!isError ? res.data.content : []);
            setTotalPage(res.data.totalPages);
            return res.data;
        } catch (error) {
            console.log(error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [category, curPage, keyword, token]);

    useEffect(() => {
        async function fetchData() {
            await searchData();
        }

        fetchData();
    }, [searchData])

    return <>
        {detailFormState.isDetailFormOpen ? <ProductDetailForm detailFormState={detailFormState} setDetailFormState={setDetailFormState}></ProductDetailForm> : <></>}
        {
            isLoading ? <Loading></Loading> : <>
                {
                    <Container className="mt-12">
                        <div className="rounded-[2rem] border border-violet-100 bg-white p-5 shadow-sm sm:p-8">
                            <SectionHeader title="Kết quả tìm kiếm" action="Đóng" actionFunc={onClose} />

                            {
                                products.length <= 0 ? <NotFoundData></NotFoundData> :
                                    <>
                                        <Slider>
                                            {
                                                products.map(item => <ProductCard onClickFunc={onOpenDetailForm} productId={item.id} key={item.id} item={item} />)
                                            }
                                        </Slider>
                                        <Pagination numberPerLine={5} currentPage={curPage} totalPage={totalPage} onGoClickPage={onGoClickPage} onGoNextPage={onGoNextPage} onGoPrevPage={onGoPrevPage} />
                                    </>
                            }
                        </div>
                    </Container>

                }
            </>
        }

    </>
}