import "tailwindcss";
import { Routes, Route } from 'react-router-dom';
import './App.css'
import LoginPage from "./pages/Login/LoginPage";
import RegistrationPage from "./pages/Registration/RegistrationPage";
import AppContext from "./AppContext";
import { useState, useEffect } from "react";
import AdminPage from "./components/template/AdminPage/AdminPage";
import AdminPageProductTab from "./components/template/AdminProductTab/AdminProductTab";
import AdminProductCVariantTab from "./components/template/AdminProductVariantTab/AdminProductVariantTab";
import Admin from "./pages/Admin/Admin";
import Home from "./pages/Home/Home";
import CustomerPage from "./pages/Customer/CustomerPage";

function App() {

  const [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const authUser = JSON.parse(localStorage.getItem('authUser'));

  useEffect(() => {
    // Hàm xử lý khi nghe thấy tín hiệu từ util.js
    const handleTokenRefresh = (event) => {
      const newToken = event.newToken; 
      setToken(newToken); 
      console.log("Đã cập nhật token mới thành công!");
    };

    window.addEventListener('onTokenRefreshed', handleTokenRefresh);

    return () => {
      window.removeEventListener('onTokenRefreshed', handleTokenRefresh);
    };
  }, []);

  return (
    <AppContext.Provider value={{ ...notifierData, setNotifierData, token, setToken, isLoading, setIsLoading, authUser}}>
      <>
        <Routes>
          <Route index element={<LoginPage />} />
          <Route path="ad" element={<Admin></Admin>}></Route>
          <Route path="warehouse" element={<AdminProductCVariantTab></AdminProductCVariantTab>}></Route>
          <Route path="registration" element={<RegistrationPage />}></Route>
          <Route path="home" element={<Home></Home>}></Route>
          <Route path="customer" element={<CustomerPage></CustomerPage>}></Route>
        </Routes>

      </>
    </AppContext.Provider>

  )
}

export default App
