import { useState, useCallback, useEffect, useContext } from "react";
import api from "../../../api";
import { fetchApiFunc } from "../../../util";

import Card from "../Card";
import Table from "../Table";
import Badge from "../../Global/Bagde/Bagde";
import Pagination from "../Pagination";
import ActionButtons from "../ActionButton";
import Loading from "../../Global/Loading/Loading";
import UserSectionContext from "./UserSectionContext";
import AppContext from "../../../AppContext";
import UserDetailForm from "./UserDetailForm";

export default function UsersSection({ keyword }) {

    const [detailFormState, setDetailFormState] = useState({isDetailFormOpen: false, userId: 1});
    const [curPage, setCurPage] = useState(1);
    const [totalPage, setTotalPage] = useState(100);
    const { token} = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([
        { id: 1, username: "Tường Ng", email: "abc@gmail.com", coin: 100000, status: "ACTIVE" },
        { id: 2, username: "Cao Phạm", email: "caong123@gmail.com", coin: 0, status: "PENDING" },
    ])

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

    const onOpenDetailForm = function(e) {
        const userId = e.target.parentElement.id;
        setDetailFormState({isDetailFormOpen: true, userId: userId});
    }

    const searchData = useCallback(async function () {
        try {
            setIsLoading(true);
            const res = await fetchApiFunc("", `${api.admin.userTab.searchUser}?keyword=${keyword}&page=${curPage}`, "GET", token);
            console.log(res);
            setUsers(res.data.content);
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
            setTotalPage(res.data.totalPages);
        }

        fetchData();
    }, [searchData])


    return <UserSectionContext.Provider value={{ ...detailFormState, setDetailFormState }}>
        <>
            {detailFormState.isDetailFormOpen ? <UserDetailForm></UserDetailForm> : <></>}
            {
                !detailFormState.isDetailFormOpen && isLoading ? <Loading></Loading> :
                    <div className="space-y-6 h-full">
                        <Card className="h-full flex flex-col justify-between" title="Người dùng">
                            <Table className={"overflow-scroll flex-1 w-full hide-scrollbar"}
                                columns={["ID", "Username", "Email", "Coin", "Trạng thái", "Hành động"]}
                                rows={users.map((u) => (
                                    <tr key={u.id}>
                                        <td className="px-4 py-4 font-medium">{u.id}</td>
                                        <td className="px-4 py-4 font-medium">{u.username}</td>
                                        <td className="px-4 py-4">{u.email}</td>
                                        <td className="px-4 py-4">{u.coin.toLocaleString("vi-VN")}</td>
                                        <td className="px-4 py-4"><Badge value={u.status} /></td>
                                        <td className="px-4 py-4"><ActionButtons id={u.id} onOpenDetailForm={onOpenDetailForm} /></td>
                                    </tr>
                                ))}
                            />
                            <Pagination currentPage={curPage} totalPage={totalPage} numberPerLine={5} onGoClickPage={onGoClickPage} onGoNextPage={onGoNextPage} onGoPrevPage={onGoPrevPage}/>
                        </Card>
                    </div>
            }
        </>
    </UserSectionContext.Provider>

}