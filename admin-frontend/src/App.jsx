import { Route, Routes } from "react-router-dom";
import './styles/App.css'
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import { useAdminAuth } from "./context/AdminAuthContext";
import { useEffect, useState } from "react";
import LoadingBar from "./components/LoadingBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App =()=>{
const {loading} =useAdminAuth();
const  [pageLoading,setPageLoading]= useState(true);
useEffect(()=>{

setTimeout(()=>setPageLoading(false),500);
},[]);

return (

<>
<LoadingBar isLoading={loading || pageLoading}/>
<Routes>
<Route element={<AdminProtectedRoute/>}>

<Route path="/dashboard" element={<AdminDashboard/>}/>

</Route>

<Route path="/" element={<AdminLogin/>}/>


</Routes>
<ToastContainer position="top-right" autoClose={3000} hideProgressBar />
</>

);
}

export default App
