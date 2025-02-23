/* eslint-disable no-unused-vars */

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { showErrorToast, showInfoToast } from "../utils/toastUtils";
import { FiLogOut } from "react-icons/fi";


const Navbar = () => {
  const { user, logout } = useAuth();  // ✅ Use logout function from context
  const navigate = useNavigate();
 
  const handleLogout = async () => {
try {
  const response = await logout();  // ✅ Use context's logout function
  
  if(response.success){
    navigate("/");
    showInfoToast("🚪✅ Logged out successfully!")
  }else{
  showErrorToast("🚨❌ Action failed. Please try again!");
  }
} catch (error) {
  showErrorToast("🔄❌ Could not process request!");
}
  
  };
    

  return (
    <nav className="navbar" >
      <Link to="/" className="nav-logo">Recipe App</Link>
      <div className="nav-links" >
        
        {user ? (
          <><p>Hello, {user.username}</p>
            <Link to="/profile">Profile</Link>
            <Link to="/post-recipe">Post Recipe</Link>
            <button onClick={handleLogout} aria-label="Logout"> <FiLogOut /></button>
          </>
        ) : (<>
          <Link to="/login" >Login</Link>
          <Link to="/admin/login">Admin Login</Link>
          <Link to="/signup" >Signup</Link>
        </>
        
        )}
      </div>
    </nav>
  );
};

export default Navbar;
