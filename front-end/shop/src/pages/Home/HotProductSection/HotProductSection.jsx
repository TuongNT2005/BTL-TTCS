import Container from "../Container";
import SectionHeader from "../SectionHeader";
import Slider from "../Slider";
import { useContext, useState, useEffect } from "react";
import { fetchApiFunc } from "../../../util";
import AppContext from "../../../AppContext";
import Loading from "../../Global/Loading/Loading";
import api from "../../../api";
import NotFoundData from "../../Global/NotFoundData/NotFoundData";
import HotProductSectionConext from "./HotProductSectionContext";
import ProductCard from "../ProductCard";
import ProductDetailForm from "../ProductDetailForm/ProductDetailForm";

export default function HotProductSection() {

    console.log("Các sản phẩm hot được render!");

    const [detailFormState, setDetailFormState] = useState({ isDetailFormOpen: false, eventId: 1 });
    const [hotProducts, setHotProducts] = useState([]);
    const { token, isLoading, setIsLoading } = useContext(AppContext);

    function onOpenDetailForm(e) {
        console.log("Tôi mở form này nè!");
        const productId = e.target.parentElement.id;
        setDetailFormState({ isDetailFormOpen: true, productId: productId });
    }

    useEffect(() => {
        async function fetchHotProducts() {
            console.log("hello");
            try {
                setIsLoading(true);
                const res = await fetchApiFunc("", api.home.hotProductSection.getProducts, "GET", token);
                const isError = res.code === 200 ? false : true;
                console.log(isError);
                if (!isError) {
                    setHotProducts(res.data.content);
                }

            } catch (error) {
                console.log(error);
                alert(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchHotProducts();
    }, [token, setIsLoading])

    return <HotProductSectionConext.Provider>
        {detailFormState.isDetailFormOpen ? <ProductDetailForm detailFormState={detailFormState} setDetailFormState={setDetailFormState}></ProductDetailForm> : <></>}
        {
            !detailFormState.isDetailFormOpen && isLoading ? <Loading></Loading> :
                <Container className="mt-12">

                    <SectionHeader title="Sản phẩm hot" action="" />
                    {
                        hotProducts.length === 0 ? <NotFoundData></NotFoundData> :
                            <Slider>
                                {hotProducts.map((item) => (
                                    <ProductCard productId={item.id} onClickFunc={onOpenDetailForm} key={item.id} item={item} />
                                ))}
                            </Slider>

                    }


                </Container>
        }

    </HotProductSectionConext.Provider>
}