/* eslint-disable no-unused-vars */
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {} from "react-router-dom";
import axios from "axios";
import defaultAvatar from "../assets/images/default-avatar.png";
import "../styles/Profile.css";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import { API_BASE_URL } from "../utils/config";
import { FaCamera } from "react-icons/fa";
import LoadingBar from "../components/LoadingBar";

const UserProfile = () => {
  const { user, setUser,loading } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeSection, setActiveSection] = useState("myRecipes");

  useEffect(() => {
    const fetchUserRecipes = async () => {
      if (!user) return;
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/users/my-recipes`,
          { withCredentials: true }
        );

        setRecipes(response.data.myRecipes);
        setPendingRecipes(response.data.pendingRecipes);
      } catch (error) {
        showErrorToast("Error fetching user recipes");
      }
    };

    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/favorites`, {
          withCredentials: true, // Important for cookies-based auth
        });
        setFavorites(response.data.favorites);
      } catch (error) {
        showErrorToast("Error fetching favorites");
      }
    };
    fetchUserRecipes();
    fetchFavorites();
  }, [user]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);
    const formData = new FormData();
    formData.append("profilePicture", file);
    try {
      setUploading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/users/upload-profile-pic`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUser((prevUser) => ({
        ...prevUser,
        profilePicture: response.data.profilePicture, // Update profile image dynamically
      }));

      showSuccessToast("🎉 Profile picture submitted successfully!");
    } catch (error) {
      console.log(error);
      showErrorToast("❌ Profile picture not updated. Try again!");
      setPreview(null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(previewURL); // ✅ Free memory
      setPreview(null);
    }
  };
  if(loading) return <LoadingBar isLoading={true}/>;
  return (
    <div className="dashboard-container">
      <div className="sidebar-profile">
        <div className="profile-image-container">
          <img
            src={preview || user?.profilePicture || defaultAvatar}
            alt="Profile"
            className="profile-image"
          />
          <label className="upload-icon">
            <FaCamera />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
            />
          </label>
        </div>
        <h3 className="profile-name">{user?.username}</h3>
        <p className="profile-email">{user?.email}</p>
        <div className="menu">
          <button
            className={activeSection === "myRecipes" ? "active" : ""}
            onClick={() => setActiveSection("myRecipes")}
          >
            My Recipes
          </button>
          <button
            className={activeSection === "pendingRecipes" ? "active" : ""}
            onClick={() => setActiveSection("pendingRecipes")}
          >
            Pending Recipes
          </button>
          <button
            className={activeSection === "favorites" ? "active" : ""}
            onClick={() => setActiveSection("favorites")}
          >
            Favorites
          </button>
        </div>
      </div>
      <div className="content-sections">
        <div
          className={`section ${activeSection === "myRecipes" ? "active" : ""}`}
        >
          
            <h2>My Recipes</h2>
            <div className="recipe-grids">
            
              {recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <div key={recipe.id} className="recipe-cards">
                  
                    <h4>{recipe.title}</h4>
                    <p>{recipe.description}</p>
                  </div>
                ))
              ) : (
                <p>No recipes added yet.</p>
              )}
            
          </div>
        </div>
        <div
          className={`section ${
            activeSection === "pendingRecipes" ? "active" : ""
          }`}
        >
         
            <h2>Pending Recipes</h2>
            <div className="recipe-grids">
              {pendingRecipes.length > 0 ? (
                pendingRecipes.map((recipe) => (
                  <div  key={recipe.id} className="recipe-cards">
                  
                  <h4>{recipe.title}</h4>
                    <p>{recipe.description}</p>
                    
                    </div>
                    
                  
                ))
              ) : (
                <p>No recipes added yet.</p>
              )}
           
          </div>
        </div>

        <div
          className={`section ${activeSection === "favorites" ? "active" : ""}`}
        >
         
            <h2>Favorite Recipes</h2>
            <div className="recipe-grids">
            {favorites.length > 0 ? (
              favorites.map((fav) => (
                <div key={fav.Recipe.id} className="recipe-cards">
                  <h4>{fav.Recipe.title}</h4>
                  <p>{fav.Recipe.description}</p>
                </div>
              ))
            ) : (
              <p>No favorite recipes yet.</p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
