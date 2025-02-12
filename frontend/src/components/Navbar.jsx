
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";


const Navbar = () => {
  const { user, logout } = useAuth();  // ✅ Use logout function from context
  const navigate = useNavigate();

  const handleLogout = async () => {
  
  const response = await logout();  // ✅ Use context's logout function
  
  if(response.success){
    navigate("/");
  }else{
  console.error(response.error);
  }
  };
    

  return (
    <nav >
      <Link to="/" >Recipe App</Link>
      <div >
        
        {user ? (
          <>
            <Link to="/post-recipe">Post Recipe</Link>
            <button onClick={handleLogout} >Logout</button>
          </>
        ) : (<>
          <Link to="/login" >Login</Link>
          <Link to="/signup" >Signup</Link>
        </>
        
        )}
      </div>
    </nav>
  );
};

export default Navbar;
