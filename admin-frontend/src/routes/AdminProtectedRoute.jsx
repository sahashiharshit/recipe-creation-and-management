import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext"; 
import LoadingBar from "../components/LoadingBar";


const AdminProtectedRoute = () => {
  const { admin, loading } = useAdminAuth();

  if (loading){
  
  return <LoadingBar isLoading={true}/>;
  }
  return admin?<Outlet/>:<Navigate to="/" replace/>;

 
};

export default AdminProtectedRoute;
