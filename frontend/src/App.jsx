import { Route, Routes } from "react-router-dom";
import Recipes from "./pages/Recipes";
import ProtectedRoute from "./routes/ProtectedRoutes";
import RecipeDetails from "./pages/RecipesDetails";
import LoadingBar from "./components/LoadingBar";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import PostRecipe from "./pages/PostRecipe";
import "./styles/App.css";
import UpdateRecipe from "./components/UpdateRecipe";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";

const App = () => {
  const { loading } = useAuth(); // Track authentication loading state
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setPageLoading(false), 500); // Simulate page load delay
  }, []);

  return (
    <>
     <LoadingBar isLoading={loading || pageLoading} />
      <Navbar />
      <Routes>
        {/*Public Route*/}
        <Route path="/" element={<Recipes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes (Only logged-in users) */}

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/edit-recipe/:id" element={<UpdateRecipe />} />
          <Route path="/post-recipe" element={<PostRecipe />} />
        </Route>

        

      </Routes>
      {/* Toast Container (Must be included once in App.jsx) */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};
export default App;
