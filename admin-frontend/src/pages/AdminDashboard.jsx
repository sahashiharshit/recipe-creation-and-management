/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import "../styles/AdminDashboard.css";
import ThemeToggle from "../components/ThemeToggle";
import { FiLogOut } from "react-icons/fi";
import RecipeDetailsModal from "../components/RecipeDetailsModal";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import { API_BASE_URL } from "../utils/config";
import UserProfileModal from "../components/UserProfileModal";

const AdminDashboard = () => {
  const { admin, adminLogout } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [activeSection, setActiveSection] = useState("users");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch All Users and Recipes
  const fetchData = useCallback(async () => {
    try {
      const usersdata = await axios.get(`${API_BASE_URL}/admin/users`, {
        withCredentials: true,
      });
      setUsers(usersdata.data);

      const recipesdata = await axios.get(`${API_BASE_URL}/admin/recipes`, {
        withCredentials: true,
      });

      setRecipes(recipesdata.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // ✅ Fetch Pending Users and Recipes
  const fetchPendingData = useCallback(async () => {
    try {
      const recipesResponse = await axios.get(
        `${API_BASE_URL}/admin/pending-recipes`,
        { withCredentials: true }
      );
      setPendingRecipes(recipesResponse.data);
    } catch (error) {
      showErrorToast("Error in fetching data");
    }
  }, []);
  const viewUserProfile = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/user/${id}`, {
        withCredentials: true,
      });

      if (response.data) {
        setSelectedUser(response.data);
      } else {
        showErrorToast("User profile not found");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      showErrorToast("Error fetching user profile");
    }
  };
  const handleAction = async (action, id, type) => {
    const urlMap = {
      approveUser: `${API_BASE_URL}/admin/approve-user/${id}`,
      approveRecipe: `${API_BASE_URL}/admin/approve-recipe/${id}`,
      deleteUser: `${API_BASE_URL}/admin/user/${id}`,
      deleteRecipe: `${API_BASE_URL}/admin/recipe/${id}`,
    };

    try {
      await axios({
        method: action.includes("delete") ? "delete" : "put",
        url: urlMap[action],
        withCredentials: true,
      });

      if (type === "user") {
        setUsers(users.filter((user) => user.id !== id));
      } else if (type === "recipe") {
        action.includes("approve")
          ? setPendingRecipes(
              pendingRecipes.filter((recipe) => recipe.id !== id)
            )
          : setRecipes(recipes.filter((recipe) => recipe.id !== id));
      }
      showSuccessToast(
        `${type.charAt(0).toUpperCase() + type.slice(1)} ${
          action.includes("delete") ? "deleted" : "approved"
        } successfully!`
      );
    } catch (error) {
      showErrorToast(`Error while trying to ${action}`);
    }
  };

  const viewRecipe = (recipe) => setSelectedRecipe(recipe);

  useEffect(() => {
    if (admin) {
      fetchData();
      fetchPendingData();
    } else {
      navigate("/");
    }
  }, [admin, navigate, fetchData, fetchPendingData]);
  

  
  const handleLogout = async () => {
    try {
      await adminLogout();
      navigate("/");
    } catch (error) {
      showErrorToast("Logout failed");
    }
  };
  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ThemeToggle />
        <ul>
          <li
            className={activeSection === "users" ? "active" : ""}
            onClick={() => setActiveSection("users")}
          >
            Users
          </li>
          <li
            className={activeSection === "recipes" ? "active" : ""}
            onClick={() => setActiveSection("recipes")}
          >
            Recipes
          </li>

          <li
            className={activeSection === "pendingRecipes" ? "active" : ""}
            onClick={() => setActiveSection("pendingRecipes")}
          >
            Pending Recipes
          </li>
        </ul>
        <div onClick={handleLogout} className="logout-btn">
          <FiLogOut size={24} color="white" />
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2>
          {activeSection
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/^./, activeSection[0].toUpperCase())}
        </h2>

        {activeSection === "users" && (
          <div className="card-container">
            {users.map((user) => (
              <div key={user.id} className="card">
                <h4>{user.username}</h4>
                <p>Email: {user.email}</p>
                <button onClick={() => viewUserProfile(user.id)}>
                  View Profile
                </button>
                <button
                  onClick={() => handleAction("deleteUser", user.id, "user")}
                  disabled={
                    // 🚫 Superadmin cannot delete superadmin or themselves
                    (admin.role === "superadmin" &&
                      (user.role === "superadmin" || user.id === admin.id)) ||
                    // 🚫 Admin cannot delete superadmin or admin or themselves
                    (admin.role === "admin" &&
                      (user.role === "superadmin" ||
                        user.role === "admin" ||
                        user.id === admin.id))
                  }
                  style={{
                    cursor:
                      (admin.role === "superadmin" &&
                        user.role === "superadmin") ||
                      (admin.role === "admin" &&
                        (user.role === "superadmin" ||
                          user.role === "admin" ||
                          user.id === admin.id))
                        ? "not-allowed"
                        : "pointer",
                    backgroundColor:
                      (admin.role === "superadmin" &&
                        user.role === "superadmin") ||
                      (admin.role === "admin" &&
                        (user.role === "superadmin" ||
                          user.role === "admin" ||
                          user.id === admin.id))
                        ? "#ccc"
                        : "var(--danger-color)",
                  }}
                >
                  {user.role === "superadmin" ||
                  (admin.role === "admin" && user.role !== "user")
                    ? "Cannot Delete"
                    : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeSection === "recipes" && (
          <div className="card-container">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="card">
                <h4>{recipe.title}</h4>
                <button onClick={() => viewRecipe(recipe)}>View</button>
                <button
                  onClick={() =>
                    handleAction("deleteRecipe", recipe.id, "recipe")
                  }
                >
                  {" "}
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {activeSection === "pendingRecipes" && (
          <div className="card-container">
            {pendingRecipes.map((recipe) => (
              <div key={recipe.id} className="card">
                <h4>{recipe.title}</h4>
                <button
                  onClick={() =>
                    handleAction("approveRecipe", recipe.id, "recipe")
                  }
                >
                  Approve
                </button>
                <button onClick={() => viewRecipe(recipe)}>View</button>
                <button
                  onClick={() =>
                    handleAction("deleteRecipe", recipe.id, "recipe")
                  }
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedRecipe && (
        <RecipeDetailsModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          admin={admin}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
