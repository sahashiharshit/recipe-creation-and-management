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
import VerifyOtp from "./pages/verify-otp";
import UserProfileView from "./pages/UserProfileView";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyResetOtp from "./pages/VerifyResetOtp";
import ResetPassword from "./pages/ResetPassword";

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
        <Route path="/verify-otp" element={<VerifyOtp />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* 🔥 New */}
        <Route path="/verify-reset-otp" element={<VerifyResetOtp />} /> {/* 🔥 New */}
        <Route path="/reset-password" element={<ResetPassword />} /> {/* 🔥 New */}
        {/* Protected Routes (Only logged-in users) */}

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/edit-recipe/:id" element={<UpdateRecipe />} />
          <Route path="/post-recipe" element={<PostRecipe />} />
          <Route path="/user/:id" element={<UserProfileView/>}/>
        </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />

      </Routes>
      {/* Toast Container (Must be included once in App.jsx) */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};
export default App;
