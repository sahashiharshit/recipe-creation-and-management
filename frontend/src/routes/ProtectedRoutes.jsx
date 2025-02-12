import PropTypes from "prop-types";
import { useAuth } from "../context/useAuth"
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children,adminOnly =false})=>{


const {user}= useAuth();

if (user === null) {
   
    return <Navigate to="/login" />;  // 🔹 Prevent redirect until user is checked
  }
 // Redirect to login if not authenticated

if(!user) return 
// Redirect to home if user is not an admin but the route requires admin access
if(adminOnly && user?.role !=="admin") return <Navigate to="/" />;
return children;

};
// ✅ Add PropTypes
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    adminOnly: PropTypes.bool,
  };
export default ProtectedRoute;