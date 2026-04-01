import Sidebar from "../../organism/Sidebar/Sidebar"
import AdminPageHeader from "../../organism/AdminPageHeader/AdminPageHeader";
import Table from "../../organism/Table/Table";
import Navigation from "../../organism/Navigation/Navigation";
import { useContext, useEffect} from "react";
import AppContext from "../../../AppContext";
import api from "../../../api";
import { fetchApiFunc } from "../../../util";
import { useState } from "react";
import Button from "../../atom/Button/Button";
import Text from "../../atom/Text/Text";

export default function AdminP() {

    let { token } = useContext(AppContext);
    let [tabData, setTabData] = useState({ headers: [], body: [] });
    let [formState, setFormState] = useState({isFormOpen:false, productId: 1});
    let [curPageNumber, setCurPageNumber] = useState(1);

    function handleBtnClick(e) {

        let productId = e.target.parentElement.parentElement.parentElement.parentElement.id;
        setFormState({isFormOpen:true, productId: productId});
    }

    const buttons = {
        "Chi tiết": <Button className="w-max rounded-sm" variant="violetBtn" onClickFunc={handleBtnClick}>
                        <Text variant="small">Chi tiết</Text>
                    </Button>,
    };
    
    

    useEffect(() => {
        async function fetchData() {
            console.log(token);
            const res = await fetchApiFunc("", api.admin.productTab.getData, "GET", token);
            console.log(res);
            setTabData({
                headers: ["Id", "Ảnh", "Tên", "Loại"],
                body: res.data.map(d => {
                    const { description, ...dataWithoutDescription } = d;
                    console.log(description);
                    return dataWithoutDescription;
                }),
            });
            return res;
        }

        fetchData();
    }, [token, formState.isFormOpen]);

    return <AdminProductContext.Provider value={{ ...formState, setFormState, setCurPageNumber}}>
        <ProductEditForm></ProductEditForm>
        <div className="flex flex-row w-full relative">
            <Sidebar className="sticky top-0 left-0"></Sidebar>
            {/* --------------------------------------------------------- */}
            <section className="flex flex-col justify-start items-center w-full h-screen bg-gray-900">
                <AdminPageHeader tabName="Sản phẩm" className="w-full md:px-3 md:py-5 px-2 py-3"></AdminPageHeader>
                <hr className="w-9/10" />
                <Table data={tabData} buttons={buttons} className="flex-1 w-full"></Table>
                <Navigation totalNumber={100} numberPerLine={5} currentNumber={curPageNumber} className=" w-full gap-x-2"></Navigation>

            </section>
        </div>
    </AdminProductContext.Provider>

}