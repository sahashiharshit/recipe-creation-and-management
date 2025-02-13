import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext"; 
import PropTypes from "prop-types";

const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();

  if (loading) return <p>Loading...</p>;
  if (!admin) return <Navigate to="/admin/login" replace />; // ✅ Redirect non-admins

  return children;
};
AdminProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    adminOnly: PropTypes.bool,
  };
export default AdminProtectedRoute;
