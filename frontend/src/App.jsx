import { Route, Routes } from "react-router-dom";
import { useAuth} from "./context/useAuth";
import Recipes from "./pages/Recipes";
import ProtectedRoute from "./routes/ProtectedRoutes";
import RecipeDetails from "./pages/RecipesDetails";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import PostRecipe from "./components/PostRecipe";
import "./assets/styles/App.css"
import UpdateRecipe from "./components/UpdateRecipe";
import Signup from "./pages/Signup";
function App(){


const { user }= useAuth();

// if(user==null){
// return <div>Loading...</div>;  // 🔹 Prevent redirect until user is checked
// }

return (
<>
  <Navbar />
  <Routes>
  {/*Public Route*/}
    <Route path="/" element={<Recipes />} /> 
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />}/>
    {/* Protected Routes (Only logged-in users) */}
    
    <Route path="/recipe/:id" element={<ProtectedRoute><RecipeDetails /></ProtectedRoute>} />
    <Route path="/edit-recipe/:id" element={<ProtectedRoute><UpdateRecipe /></ProtectedRoute>}/>
    <Route path="/post-recipe" element={<ProtectedRoute><PostRecipe /></ProtectedRoute>} />
    
     {/* Admin Route (Only accessible by admin) */}
    <Route 
    path="/admin"
    element={<ProtectedRoute adminOnly={true}>
    <AdminDashboard />
    </ProtectedRoute>}
    />
    
    
    
    
  </Routes>
  
</>

);

}
export default App;