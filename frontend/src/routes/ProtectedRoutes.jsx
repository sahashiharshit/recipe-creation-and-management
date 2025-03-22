
import LoadingBar from "../components/LoadingBar";
import { useAuth } from "../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ()=>{


const {user,loading}= useAuth();


if (loading) {
  return <LoadingBar isLoading={true}/>;
      // 🔹 Prevent redirect until user is checked
  }
 

 return user ? <Outlet /> : <Navigate to="/login" replace/>;
};


export default ProtectedRoute;