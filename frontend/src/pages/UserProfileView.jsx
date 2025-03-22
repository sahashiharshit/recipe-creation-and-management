/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import defaultAvatar from "../assets/images/default-avatar.png";
import "../styles/Profile.css";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import { API_BASE_URL } from "../utils/config";
import LoadingBar from "../components/LoadingBar";

const UserProfileView = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/profile/${id}`, {
          withCredentials: true,
        });

        const followRes = await axios.get(
          `${API_BASE_URL}/api/socials/is-following/${id}`,
          {
            withCredentials: true,
          }
        );
        setUser(res.data.user);
        setRecipes(res.data.recipes);
        setIsFollowing(followRes.data.isFollowing);
         
      } catch (error) {
        showErrorToast("Error fetching user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);
  const toggleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.post(
          `${API_BASE_URL}/api/socials/unfollow`,
          { followingId: id },
          { withCredentials: true }
        );
        setIsFollowing(false);
        showSuccessToast("User unfollowed successfully!");
      } else {
        await axios.post(
          `${API_BASE_URL}/api/socials/follow`,
          { followingId: id },
          { withCredentials: true }
        );
        setIsFollowing(true);
        showSuccessToast("User followed successfully!");
      }
    } catch (error) {
      showErrorToast("Error updating follow status.");
    }
  };
  if (loading) return <LoadingBar isLoading={true} />;

  if (!user) {
    return <p className="error-message">User not found.</p>;
  }

  return (
    <div className="dashboard-container">
      <div className="sidebar-profile">
        <div className="profile-image-container">
          <img
            src={user?.profilePicture || defaultAvatar}
            alt="Profile"
            className="profile-image"
          />
        </div>
        <h3 className="profile-name">{user?.username}</h3>
        <p className="profile-email">{user?.email}</p>
        {/* ✅ Follow/Unfollow Button */}
        <button
          onClick={toggleFollow}
          className={`follow-btn ${isFollowing ? "unfollow" : "follow"}`}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>
      <div className="content-sections">
        <div className="section active">
          <h2>{user.username}&apos;s Recipes</h2>
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
      </div>
    </div>
  );
};

export default UserProfileView;
