/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../styles/Recipes.css";
import { showErrorToast } from "../utils/toastUtils";
import { API_BASE_URL } from "../utils/config";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";
import LoadingBar from "../components/LoadingBar";
const Recipes = () => {
  const {loading}=useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || ""; 
  const category = searchParams.get("category") || "All";
  const initialPage = Number(searchParams.get("page")) || 1;
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [recipes, setRecipes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
 

  useEffect(() => {
  
    const fetchRecipes = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/recipes/get-recipes`, {
          params: { search: searchQuery , category , page: currentPage },
          withCredentials: true,
        });
        setRecipes(res.data.recipes);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        showErrorToast("No Recipes Found");
      }
    };
    fetchRecipes();
  }, [searchQuery, category, currentPage]);
  
  if(loading) return <LoadingBar isLoading={true}/>;

  return (
    <div className="recipes-container">
      <h1>Explore Delicious Recipes</h1>

     

      {/* 🔹 Recipe Grid */}
      <div className="recipe-grid">
        {recipes.length === 0 ? (
          <p className="no-results">No matching recipes found</p>
        ) : (
          recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img
                src={recipe.imageUrl || "/fallback-image.jpg"}
                alt={`Image of ${recipe.title}`}
              />

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

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};


export default Recipes;
