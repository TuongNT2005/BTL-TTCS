import "tailwindcss";
import { Routes, Route } from 'react-router-dom';
import './App.css'
import LoginForm from "./components/organism/LoginForm/LoginForm";
import LoginPage from "./components/template/LoginPage/LoginPage";
import RegistrationPage from "./components/template/RegistrationPage/RegistrationPage";
import AppContext from "./AppContext";
import { useState } from "react";
import AdminPage from "./components/template/AdminPage/AdminPage";
import AdminPageProductTab from "./components/template/AdminProductTab/AdminProductTab";
import AdminProductCVariantTab from "./components/template/AdminProductVariantTab/AdminProductVariantTab";
import Admin from "./pages/Admin/Admin";
import Home from "./pages/Home/Home";
import CustomerPage from "./pages/Customer/CustomerPage";

function App() {

  let [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });
  let [isLoading, setIsLoading] = useState(false);
  let [token, setToken] = useState("");
  let [authUser, setAuthUser] = useState(null);

  return (
    <AppContext.Provider value={{...notifierData, setNotifierData, token, setToken, isLoading, setIsLoading, authUser, setAuthUser}}>
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
