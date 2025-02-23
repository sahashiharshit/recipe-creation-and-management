/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../assets/styles/Recipes.css";
import { showErrorToast } from "../utils/toastUtils";
const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null); // To handle outside clicks

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/recipes/get-recipes",
          { withCredentials: true }
        );
        setRecipes(res.data);
      } catch (error) {
        showErrorToast("No Recipes Found");
      }
    };
    fetchRecipes();
  }, []);
  // Handle clicks outside the search bar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Get unique categories for filtering
  const categories = [
    "All",
    ...new Set(recipes.map((recipe) => recipe.category).filter(Boolean)),
  ];
  // Compute filtered recipes dynamically
  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All" || recipe.category === selectedCategory)
  );

  return (
    <div className="recipes-container">
      <h1>Explore Delicious Recipes</h1>

      {/* 🔍 Search & Filter Controls */}
      <div className="filter-container">
        {/* Search Section */}
        <div
          className={`search-box ${isSearchOpen ? "expanded" : ""}`}
          ref={searchRef}
        >
          {/* Lens Icon Button */}
          <button
            className="search-button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            🔍
          </button>

          {/* Expanding Search Input */}
          {isSearchOpen && (
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              autoFocus
            />
          )}
        </div>

        {/* Category Filter Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-filter"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Recipe Grid */}
      <div className="recipe-grid">
        {filteredRecipes.length === 0 ? (
          <p className="no-results">No matching recipes found</p>
        ) : (
          filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img src={recipe.imageUrl || "/fallback-image.jpg"} alt={`Image of ${recipe.title}`} />

              <div className="recipe-card-content">
                <h2>{recipe.title}</h2>
                <p>
                  {recipe.description
                    ? `${recipe.description.substring(0, 80)}...`
                    : "No description available"}
                </p>
                <Link to={`/recipe/${recipe.id}`} className="view-button">
                  View Recipe
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Recipes;
