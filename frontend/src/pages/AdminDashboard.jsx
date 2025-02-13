/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminDashboard = () => {
  const {admin,loading,adminLogout} = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [recipes,setRecipes] = useState([]);
  const navigate = useNavigate();
  useEffect( () => {
  
  if(!loading && !admin){
    navigate("/admin/login");
  }else{
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
   fetchData();
   
  }
  

  }, [admin,loading,navigate]);

  const handleLogout = async () => {
    await adminLogout();
    navigate("/admin/login");
};
  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:3000/api/admin/user/${id}`, { withCredentials: true });
    setUsers(users.filter(user => user.id !== id));
};
const deleteRecipe = async (id) => {
  await axios.delete(`http://localhost:3000/api/admin/recipe/${id}`, { withCredentials: true });
  setRecipes(recipes.filter(recipe => recipe.id !== id));
};
  return (
    <div>
            <h2>Admin Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
            <h3>Users</h3>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.username} - {user.email}
                        <button onClick={() => deleteUser(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h3>Recipes</h3>
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe.id}>
                        {recipe.title}
                        <button onClick={() => deleteRecipe(recipe.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
  );
};

export default AdminDashboard;
