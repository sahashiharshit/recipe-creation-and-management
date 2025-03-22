/* eslint-disable no-unused-vars */

import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showErrorToast, showInfoToast } from "../utils/toastUtils";
import { FiLogOut, FiSearch, FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";
import "../styles/Navbar.css";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const Navbar = () => {
  const { user, logout } = useAuth(); // ✅ Use logout function from context
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // ✅ State for search, category & fetched categories
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  // ✅ Show filters only on the Recipes page
  const showFilters = location.pathname === "/";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/recipes/categories`
        );

        setCategories(response.data);
      } catch (error) {
        /* empty */
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory !== "All") params.category = selectedCategory;
    setSearchParams(params);
  }, [searchQuery, selectedCategory, setSearchParams]);

  const handleLogout = async () => {
    try {
      const response = await logout(); // ✅ Use context's logout function

      if (response.success) {
        navigate("/");
        showInfoToast("🚪✅ Logged out successfully!");
      } else {
        showErrorToast("🚨❌ Action failed. Please try again!");
      }
    } catch (error) {
      showErrorToast("🔄❌ Could not process request!");
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        Recipe App
      </Link>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
      </button>
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        {showFilters && (
          <>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                autoFocus
              />
              <button className="search-button">
                <FiSearch size={24} />
              </button>
            </div>
            <div className="filter-container">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setSelectedCategory(selectedId);
                }}
                className="category-filter"
              >
               
                <option key="All" value="All">
                  All Categories
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <ThemeToggle />
        {user ? (
          <>
            <p>Hello, {user.username}</p>
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
            <Link to="/post-recipe" onClick={() => setMenuOpen(false)}>
              Post Recipe
            </Link>
            <button onClick={handleLogout} aria-label="Logout">
              {" "}
              <FiLogOut />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
