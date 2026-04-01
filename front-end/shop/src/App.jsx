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

function App() {

  let [notifierData, setNotifierData] = useState({ isError: false, title: "", message: "", isOpen: false });
  let [isLoading, setIsLoading] = useState(false);
  let [token, setToken] = useState("");

  function onClose() {
        setNotifierData(prev => ({ ...prev, isOpen: false }));
    }
  return (
    <AppContext.Provider value={{...notifierData, setNotifierData, onClose, token, setToken, isLoading, setIsLoading}}>
      <>
        <Routes>
          <Route index element={<LoginPage />} />
          <Route path="ad" element={<AdminPageProductTab></AdminPageProductTab>}></Route>
          <Route path="warehouse" element={<AdminProductCVariantTab></AdminProductCVariantTab>}></Route>
          <Route path="registration" element={<RegistrationPage />}></Route>
        </Routes>

      </>
    </AppContext.Provider>

  )
}

export default App
