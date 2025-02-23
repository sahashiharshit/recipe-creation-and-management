/* eslint-disable no-unused-vars */
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";
import {} from "react-router-dom";
import axios from "axios";
import defaultAvatar from "../assets/images/default-avatar.png";
import "../assets/styles/Profile.css";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";

const UserProfile = () => {
  const { user, setUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [pendingRecipes, setPendingRecipes] = useState([]);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      if (!user) return;
      try {
        const response = await axios.get(
          `http://localhost:3000/api/users/my-recipes`,
          { withCredentials: true }
        );
        
        setRecipes(response.data.myRecipes);
        setPendingRecipes(response.data.pendingRecipes);
      } catch (error) {
        showErrorToast("Error fetching user recipes");
      }
    };
      fetchUserRecipes(); 
    
  },[user]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);
    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      setUploading(true);
      const response = await axios.post(
        "http://localhost:3000/api/users/upload-profile-pic",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUser((prevUser) => ({
        ...prevUser,
        profileImage: response.data.profileImage, // Update profile image dynamically
      }));
      setPreview(null);
      showSuccessToast("🎉 Profile picture submitted successfully!");
    } catch (error) {
      showErrorToast("❌ Profile picture not updated. Try again!");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="profile-page">
      <div className="sidebar-profile">
        <img
          src={preview || user?.profilePicture || defaultAvatar}
          alt="Profile"
          className="profile-image"
        />
        <h3 className="profile-name">{user?.username}</h3>
        <p className="profile-email">{user?.email}</p>
        <label className="upload-btn">
          {uploading ? "Uploading..." : "Change Profile Picture"}
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleImageChange}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="profile-content">
        <h2 className="profile-title">My Recipes</h2>
        <ul className="recipe-list">
          {recipes.map((recipe) => (
            <li key={recipe.id}>{recipe.title}</li>
          ))}
        </ul>

        <h2 className="profile-title">Pending Recipes</h2>
        <ul className="recipe-list">
          {pendingRecipes.map((recipe) => (
            <li key={recipe.id}>{recipe.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserProfile;
