import PropTypes from "prop-types";
import { useAuth } from "../context/useAuth"
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children})=>{


const {user,loading}= useAuth();

if (loading) {
  return <p>Loading...</p>; 
      // 🔹 Prevent redirect until user is checked
  }
 // Redirect to login if not authenticated

if(!user) return <Navigate to="/login" />;
// Redirect to home if user is not an admin but the route requires admin access

return children;

};
// ✅ Add PropTypes
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,

  };
export default ProtectedRoute;