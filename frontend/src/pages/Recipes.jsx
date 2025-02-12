import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../assets/styles/recipes.css";
const Recipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
  
  const fetchRecipes = async()=>{
    try {
    const res = await axios.get("http://localhost:3000/api/recipes/get-recipes", { withCredentials: true });
      setRecipes(res.data);
    } catch (error) {
      console.error("Error fetching recipes", error);
    }
  
  };
  fetchRecipes();
  }, []);

  return (
    <div className="recipes-container">
     <h1>Explore Delicious Recipes</h1>
     <div className="recipe-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img src={recipe.imageUrl} alt={recipe.title} />
            <div className="recipe-card-content">
              <h2>{recipe.title}</h2>
              <p>{recipe.description.substring(0, 80)}...</p>
              <Link to={`/recipe/${recipe.id}`} className="view-button">
                View Recipe
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;
