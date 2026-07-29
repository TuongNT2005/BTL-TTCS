import "tailwindcss";
import { Routes, Route } from 'react-router-dom';
import './App.css'
import LoginPage from "./pages/Login/LoginPage";
import RegistrationPage from "./pages/Registration/RegistrationPage";
import AppContext from "./AppContext";
import { useState, useEffect } from "react";
import Admin from "./pages/Admin/Admin";
import Home from "./pages/Home/Home";
import CustomerPage from "./pages/Customer/CustomerPage";
import PaymentResult from "./pages/Payment/Payment";

function App() {

  const [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const authUser = JSON.parse(localStorage.getItem('authUser'));

  useEffect(() => {
    // Hàm xử lý khi nghe thấy tín hiệu từ util.js
    const handleTokenRefresh = (event) => {
      console.log(event);
      const newToken = event.detail.newToken; 
      setToken(newToken); 
      console.log("Đã cập nhật token mới thành công!" + newToken);
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
          <Route path="registration" element={<RegistrationPage />}></Route>
          <Route path="home" element={<Home></Home>}></Route>
          <Route path="customer" element={<CustomerPage></CustomerPage>}></Route>
          <Route path="payment" element={<PaymentResult />}></Route>
        </Routes>

      </>
    </AppContext.Provider>

  )
}

export default App
