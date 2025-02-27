/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import "../styles/AdminDashboard.css";
import ThemeToggle from '../components/ThemeToggle'
import {FiLogOut} from "react-icons/fi"
import RecipeDetailsModal from "../components/RecipeDetailsModal";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
const AdminDashboard = () => {
  const {admin,adminLogout} = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [recipes,setRecipes] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [activeSection, setActiveSection] = useState("users"); 
  const [selectedRecipe,setSelectedRecipe]= useState(null);
  const navigate = useNavigate();
  useEffect( () => {
  
  if(admin===null){
    navigate("/admin/login");
  }
  
},[admin,navigate]);
  useEffect(()=>{
  if(admin){
    const fetchData =async()=>{
      try {
        const usersdata = await axios.get("http://localhost:3000/api/admin/users", { withCredentials: true });
          setUsers(usersdata.data);
          
        const recipesdata = await axios.get("http://localhost:3000/api/admin/recipes",{withCredentials:true});   
         setRecipes(recipesdata.data)
        } catch (error) {
          navigate("/admin/login");
        } 
        
     }
     const fetchPendingData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:3000/api/admin/pending-users",{ withCredentials: true});
        setPendingUsers(usersResponse.data);
  
        const recipesResponse = await axios.get("http://localhost:3000/api/admin/pending-recipes",{ withCredentials: true});
        setPendingRecipes(recipesResponse.data);
      } catch (error) {
        showErrorToast("Error in fetching data");
      }
    };
   fetchData();
   fetchPendingData();
  }}, [admin, navigate]);
  
  
  
  const approveUser = async (id) => {
  try {
    await axios.put(`http://localhost:3000/api/admin/approve-user/${id}`,{},{ withCredentials: true});
    setPendingUsers(pendingUsers.filter(user => user.id !== id));
    showSuccessToast("User approved successfully");
  } catch (error) {
    showErrorToast("Error approving user");
  }
    
  };

  const approveRecipe = async (id) => {
  try {
    await axios.put(`http://localhost:3000/api/admin/approve-recipe/${id}`,{},{ withCredentials: true});
    setPendingRecipes(pendingRecipes.filter(recipe => recipe.id !== id));
    showSuccessToast("Recipe approved successfully");
    
  } catch (error) {
    showErrorToast("Error approving recipe");
  }
   
  };

  const deleteUser = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/api/admin/user/${id}`, { withCredentials: true });
    setUsers(users.filter(user => user.id !== id));
    showSuccessToast("User deleted successfully");
  } catch (error) {
    showErrorToast("Error deleting user");
  }
   
};
const deleteRecipe = async (id) => {
try {
  await axios.delete(`http://localhost:3000/api/admin/recipe/${id}`, { withCredentials: true });
  setRecipes(recipes.filter(recipe => recipe.id !== id));
  showSuccessToast("Recipe deleted successfully");
} catch (error) {
  showErrorToast("Error deleting recipe");
}
  
};

const viewRecipe=(recipe)=>{
 setSelectedRecipe(recipe);
 
};
const handleLogout = async () => {
  try {
    await adminLogout();
    navigate("/admin/login");
  } catch (error) {
    showErrorToast("Logout failed");
  }
};
  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ThemeToggle/>
        <ul>
          <li className={activeSection === "users" ? "active" : ""} onClick={() => setActiveSection("users")}>
            Users
          </li>
          <li className={activeSection === "recipes" ? "active" : ""} onClick={() => setActiveSection("recipes")}>
            Recipes
          </li>
          <li className={activeSection === "pendingUsers" ? "active" : ""} onClick={() => setActiveSection("pendingUsers")}>
            Pending Users
          </li>
          <li className={activeSection === "pendingRecipes" ? "active" : ""} onClick={() => setActiveSection("pendingRecipes")}>
           Pending Recipes
          </li>
          
         
        </ul>
        <div onClick={handleLogout} className="logout-btn"><FiLogOut size={24} color="white" /></div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2>{activeSection.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, activeSection[0].toUpperCase()) }</h2>

        {activeSection === "users" && (
          <div className="card-container">
            {users.map((user) => (
              <div key={user.id} className="card">
                <h4>{user.username}</h4>
                <p>Email: {user.email}</p>
                
              </div>
            ))}
          </div>
        )}

        {activeSection === "recipes" && (
          <div className="card-container">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="card">
                <h4>{recipe.title}</h4>
                <button onClick={()=>viewRecipe(recipe)}>View</button>
                <button onClick={() => deleteRecipe(recipe.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
        {activeSection === "pendingUsers" && (
          <div className="card-container">
            {pendingUsers.map((user) => (
              <div key={user.id} className="card">
                <h4>{user.username}</h4>
                <p>Email: {user.email}</p>
                <button onClick={() => approveUser(user.id)}>Approve</button>
                <button onClick={()=>deleteUser(user.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
         {activeSection === "pendingRecipes" && (
          <div className="card-container">
            {pendingRecipes.map((recipe) => (
              <div key={recipe.id} className="card">
                <h4>{recipe.title}</h4>
                <button onClick={() => approveRecipe(recipe.id)}>Approve</button>
                <button onClick={()=>viewRecipe(recipe)}>View</button>
                <button onClick={() => deleteRecipe(recipe.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
        
      </div>
      
      {selectedRecipe &&(
      <RecipeDetailsModal
        recipe={selectedRecipe}
        onClose={()=>setSelectedRecipe(null)}
      />
      
      )}
    </div>
  );
};

export default AdminDashboard;
