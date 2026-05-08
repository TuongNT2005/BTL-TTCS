import Container from "../Container";
import SectionHeader from "../SectionHeader";
import Slider from "../Slider";
import EventCard from "./EventCard";
import { useContext, useState, useEffect } from "react";
import { fetchApiFunc } from "../../../util";
import AppContext from "../../../AppContext";
import Loading from "../../Global/Loading/Loading";
import api from "../../../api";
import NotFoundData from "../../Global/NotFoundData/NotFoundData";
import EventSecitonContext from "./EventSectionContext";
import EventDetailForm from "./EventDetailForm";
import ProductDetailForm from "../ProductDetailForm/ProductDetailForm";

export default function EventSection() {


    const [detailFormState, setDetailFormState] = useState({ isDetailFormOpen: false, eventId: 1 });
    const [productDetailFormState, setProductDetailFormState] = useState({ isDetailFormOpen: false, eventId: 1 });
    const [events, setEvents] = useState([]);
    const { token} = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);

    function onOpenDetailForm(e) {
        const eventId = e.target.parentElement.id;
        setDetailFormState({ isDetailFormOpen: true, eventId: eventId });
    }

    function onOpenProductDetailForm(e) {
        const productId = e.target.id;
        console.log(productId);
        setDetailFormState({ isDetailFormOpen: false, eventId: 1 });
        setProductDetailFormState({ isDetailFormOpen: true, productId: productId });
    }

    useEffect(() => {
        async function fetchEvents() {
            try {
                setIsLoading(true);
                const res = await fetchApiFunc("", api.home.eventSection.getEvents, "GET", token);
                const isError = res.code === 200 ? false : true;
                console.log(isError);
                if (!isError) {
                    setEvents(res.data);
                }

            } catch (error) {
                console.log(error);
                alert(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchEvents();
    }, [token, setIsLoading])

    return <EventSecitonContext.Provider value={{ ...detailFormState, setDetailFormState, onOpenProductDetailForm }}>
        {productDetailFormState.isDetailFormOpen ? <ProductDetailForm detailFormState={productDetailFormState} setDetailFormState={setProductDetailFormState}></ProductDetailForm> : <></>}
        {detailFormState.isDetailFormOpen ? <EventDetailForm></EventDetailForm> : <></>}
        {
            !productDetailFormState.isDetailFormOpen && !detailFormState.isDetailFormOpen && isLoading ? <Loading></Loading> :
                <Container className="mt-12">

                    <SectionHeader title="Sự kiện" action="" />
                    {
                        events.length === 0 ? <NotFoundData></NotFoundData> :
                            <Slider>
                                {events.map((item) => (
                                    <EventCard key={item.id} item={item} eventId={item.id} onClickFunc={onOpenDetailForm} />
                                ))}
                            </Slider>

                    }


                </Container>
        }

    </EventSecitonContext.Provider>
}