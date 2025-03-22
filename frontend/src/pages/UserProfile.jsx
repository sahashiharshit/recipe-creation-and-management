/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import defaultAvatar from "../assets/images/default-avatar.png";
import "../styles/Profile.css";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import { API_BASE_URL } from "../utils/config";
import { FaCamera } from "react-icons/fa";
import LoadingBar from "../components/LoadingBar";

const UserProfile = () => {
  const { user, setUser, loading } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [followed, setFollowed] = useState([]); // ✅ Followed Users
  const [followers, setFollowers] = useState([]); // ✅ Followers
  const [activeSection, setActiveSection] = useState("myRecipes");
  const navigate = useNavigate();

  const fetchUserRecipes = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/my-recipes`, {
        withCredentials: true,
      });

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
  const checkFollowStatus = async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/socials/is-following/${userId}`,
        {
          withCredentials: true,
        }
      );
      return response.data.isFollowing;
    } catch (error) {
      console.error("Error checking follow status", error);
      return false;
    }
  };
  const fetchFollowData = async () => {
    if (!user) return;
    try {
      const resFollowed = await axios.get(
        `${API_BASE_URL}/api/users/followed`,
        {
          withCredentials: true,
        }
      );
      const resFollowers = await axios.get(
        `${API_BASE_URL}/api/users/followers`,
        {
          withCredentials: true,
        }
      );
      const followersWithStatus = await Promise.all(
        resFollowers.data.followers.map(async (follower) => {
          const isFollowing = await checkFollowStatus(follower.id);
          return { ...follower, isFollowing };
        })
      );
      setFollowed(resFollowed.data.followedUsers);
      setFollowers(followersWithStatus);
    } catch (error) {
      showErrorToast("Error fetching follow data");
    }
  };
  useEffect(() => {
    fetchUserRecipes();
    fetchFavorites();
    fetchFollowData();
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
  const handleFollowUnfollow = async (userId, isFollowing) => {
    try {
      const endpoint = isFollowing
        ? `${API_BASE_URL}/api/socials/unfollow`
        : `${API_BASE_URL}/api/socials/follow`;
      await axios.post(
        endpoint,
        { followingId: userId },
        { withCredentials: true }
      );
      showSuccessToast(
        isFollowing ? "✅ Unfollowed successfully" : "✅ Followed successfully"
      );
      // Refresh follow data
      setTimeout(() => {
        fetchFollowData();
      }, 1000);
    } catch (error) {
      showErrorToast("❌ Error updating follow status");
    }
  };
  // ✅ View Recipe Details
  const viewRecipe = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  // ❗️ Delete Recipe
  const handleDeleteRecipe = async (recipeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/recipes/${recipeId}`, {
        withCredentials: true,
      });
      showSuccessToast("✅ Recipe deleted successfully.");
      fetchUserRecipes(); // Refresh recipes after delete
    } catch (error) {
      showErrorToast("❌ Error deleting recipe.");
    }
  };

  if (loading) return <LoadingBar isLoading={true} />;
  return (
    <div className="dashboard-container">
      {/* ✅ Sidebar */}
      <div className="sidebar-profile">
        <div className="profile-image-container">
          <img
            src={preview || user.profilePicture || defaultAvatar}
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
          {[
            "myRecipes",
            "pendingRecipes",
            "favorites",
            "followed",
            "followers",
          ].map((section) => (
            <button
              key={section}
              className={activeSection === section ? "active" : ""}
              onClick={() => setActiveSection(section)}
            >
              {section === "myRecipes"
                ? "My Recipes"
                : section === "pendingRecipes"
                ? "Pending Recipes"
                : section === "favorites"
                ? "Favorites"
                : section === "followed"
                ? "Followed Users"
                : "Followers"}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Content Sections */}
      <div className="content-sections">
        {/* 🔹 My Recipes Section */}
        <div
          className={`section ${activeSection === "myRecipes" ? "active" : ""}`}
        >
          <h2>My Recipes</h2>
          <div className="recipe-grids">
            {recipes?.length > 0 ? (
              recipes.map((recipe) => (
                <div key={recipe.id} className="recipe-cards">
                  <h4>{recipe.title}</h4>
                  <p className="truncate">
                    {recipe.description.length > 100
                      ? `${recipe.description.slice(0, 100)}...`
                      : recipe.description}
                    <span className="tooltip">{recipe.description}</span>
                  </p>
                  <div className="button-container">
                    <button
                      onClick={() => viewRecipe(recipe.id)}
                      className="view-btn"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No recipes added yet.</p>
            )}
          </div>
        </div>

        {/* 🔹 Pending Recipes Section */}
        <div
          className={`section ${
            activeSection === "pendingRecipes" ? "active" : ""
          }`}
        >
          <h2>Pending Recipes</h2>
          <div className="recipe-grids">
            {pendingRecipes?.length > 0 ? (
              pendingRecipes.map((recipe) => (
                <div key={recipe.id} className="recipe-cards">
                  <h4>{recipe.title}</h4>
                  <p className="truncate">
                    {recipe.description.length > 100
                      ? `${recipe.description.slice(0, 100)}...`
                      : recipe.description}
                    <span className="tooltip">{recipe.description}</span>
                  </p> <div className="button-container">
                    <button
                      onClick={() => viewRecipe(recipe.id)}
                      className="view-btn"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No pending recipes yet.</p>
            )}
          </div>
        </div>

        {/* 🔹 Favorite Recipes Section */}
        <div
          className={`section ${activeSection === "favorites" ? "active" : ""}`}
        >
          <h2>Favorite Recipes</h2>
          <div className="recipe-grids">
            {favorites?.length > 0 ? (
              favorites.map((fav) => (
                <div key={fav?.Recipe?.id} className="recipe-cards">
                  <h4>{fav?.Recipe?.title}</h4>
                  <p className="truncate">
                    {fav?.Recipe?.description.length > 100
                      ? `${fav?.Recipe?.description.slice(0, 100)}...`
                      : fav?.Recipe?.description}
                    <span className="tooltip">{fav?.Recipe?.description}</span>
                  </p><div className="button-container">
                    <button
                      onClick={() => viewRecipe(fav.Recipe.id)}
                      className="view-btn"
                    >
                      View
                    </button>
                   
                  </div>
                </div>
              ))
            ) : (
              <p>No favorite recipes yet.</p>
            )}
          </div>
        </div>

        {/* 🔹 Followed Users Section */}
        <div
          className={`section ${activeSection === "followed" ? "active" : ""}`}
        >
          <h2>Followed Users</h2>
          <div className="recipe-grids">
            {followed?.length > 0 ? (
              followed.map((follow) => (
                <div key={follow?.id} className="recipe-cards">
                  <h4>{follow?.username}</h4>
                  <p>{follow?.email}</p>
                  <div className="button-container
                  ">
                  <button
                    onClick={() => navigate(`/user/${follow.id}`)}
                    className="view-profile-btn"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleFollowUnfollow(follow.id, true)}
                    className="follow-btn"
                  >
                    Unfollow
                  </button></div>
                </div>
              ))
            ) : (
              <p>No followed users yet.</p>
            )}
          </div>
        </div>

        {/* 🔹 Followers Section */}
        <div
          className={`section ${activeSection === "followers" ? "active" : ""}`}
        >
          <h2>Followers</h2>
          <div className="recipe-grids">
            {followers?.length > 0 ? (
              followers.map((follower) => (
                <div key={follower?.id} className="recipe-cards">
                  <h4>{follower?.username}</h4>
                  <p>{follower?.email}</p>
                  <div className="button-container">
                  <button
                    onClick={() => navigate(`/user/${follower.id}`)}
                    className="view-profile-btn"
                  >
                    View Profile
                  </button>
                  {/* <button
                    onClick={() =>
                      handleFollowUnfollow(follower.id, follower.isFollowing)
                    }
                    className="follow-btn"
                  >
                    {follower.isFollowing ? "Unfollow" : "Follow"}
                  </button> */}
                  </div>
                </div>
              ))
            ) : (
              <p>No followers yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
