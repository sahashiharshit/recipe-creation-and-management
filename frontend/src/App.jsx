import { Route, Routes, useLocation } from "react-router-dom";
import Recipes from "./pages/Recipes";
import ProtectedRoute from "./routes/ProtectedRoutes";
import RecipeDetails from "./pages/RecipesDetails";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import PostRecipe from "./components/PostRecipe";
import "./assets/styles/App.css";
import UpdateRecipe from "./components/UpdateRecipe";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLogin from "./pages/AdminLogin";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AdminLayout from "./components/AdminLayout";
const App=()=> {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin") && location.pathname !== "/admin/login";


  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/*Public Route*/}
        <Route path="/" element={<Recipes />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes (Only logged-in users) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe/:id"
          element={
            <ProtectedRoute>
              <RecipeDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-recipe/:id"
          element={
            <ProtectedRoute>
              <UpdateRecipe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-recipe"
          element={
            <ProtectedRoute>
              <PostRecipe />
            </ProtectedRoute>
          }
        />

        {/* Admin Route (Only accessible by admin) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={
        <AdminProtectedRoute>
        <AdminLayout>
        <Routes>
        
        <Route path="/dashboard" element={<AdminDashboard />}/>
        </Routes>
        </AdminLayout>
        </AdminProtectedRoute>
        }/>
        
        
        
      </Routes>
        {/* Toast Container (Must be included once in App.jsx) */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
export default App;
