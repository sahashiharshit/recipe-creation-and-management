/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaClock, FaUtensils, FaEdit,FaHeart,FaRegHeart } from "react-icons/fa";
import axios from "axios";
import "../styles/RecipeDetails.css";
import { showErrorToast } from "../utils/toastUtils";
import RecipeReviews from "../components/RecipeReviews";
import StarRatings from "react-star-ratings";

import { API_BASE_URL } from "../utils/config";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false); // ✅ Track ownership
  const [recipeOwner, setRecipeOwner] = useState(null);
  const [averageRating,setAverageRating]= useState(0);
  const [isFavorite,setIsFavorite]= useState(false);
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/recipes/${id}`, {
          withCredentials: true,
        });
        if (res.data) {
          setRecipe(res.data);
          const userRes = await axios.get(
            `${API_BASE_URL}/api/users/profile`,
            {
              withCredentials: true, // ✅ Ensure cookies are sent
            }
          );
          if (userRes.data?.id === res.data.userId) {
            setIsOwner(userRes.data.id); // ✅ Compare userId
          } else {
            const user = await axios.get(
              `${API_BASE_URL}/api/users/${res.data.userId}`,
              { withCredentials: true }
            );
           
            setRecipeOwner(user.data);
          }
        } else {
          showErrorToast("❌⚠️ Recipe not found");
        }
      } catch (error) {
        showErrorToast("🔄❌ Could not process request!");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
    
  }, [id]);
  useEffect(()=>{
  const fetchFavorites = async()=>{
  try {
    const response = await axios.get(`${API_BASE_URL}/api/favorites`, {
      withCredentials: true, // Important for cookies-based auth
    });
    const favoriteIds = response.data.favorites.map((fav) => fav.recipeId);
    setIsFavorite(favoriteIds.includes(id));
  } catch (error) {
    showErrorToast("Error fetching favorites");
  }
  
  };
  fetchFavorites();
  
  },[id]);
  
  
  const toggleFavorite = async ()=>{
  try {
    if(isFavorite){
    await axios.delete(`${API_BASE_URL}/api/favorites/${id}`,{
    withCredentials:true,
    
    });
    }else{
      await axios.post(`${API_BASE_URL}/api/favorites`, { recipeId: id }, {
        withCredentials: true,
      });
    
    }
    setIsFavorite(!isFavorite);
  } catch (error) {
    console.error("Error updating favorite:", error);
  }
  
  };
  
  if (loading) return <p>Loading recipe details...</p>;

  return (
    <div className="recipe-details-container">
      {/* Recipe Header */}
      <div className="recipe-header">
        <h1 className="recipe-title">{recipe.title}</h1>

        {/* ✅ Show Edit Button Only if User is Owner */}
        {isOwner && (
          <button
            className="edit-button"
            onClick={() => navigate(`/edit-recipe/${id}`)}
          >
            <FaEdit className="edit-icon" /> Edit Recipe
          </button>
        )}
        {recipeOwner && (
          <p className="owner-name">
            Posted By:{" "}
            {recipeOwner.username.charAt(0).toUpperCase() +
              recipeOwner.username.slice(1)}
          </p>
        )}
      </div>

      {/* Recipe Image */}
      <div className="recipe-image-container">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="recipe-image"
          />
        ) : (
          <p className="no-image">No Image Available</p>
        )}
        <div className="average-rating">
          <StarRatings rating={Number(averageRating)} starRatedColor="#ffd700" numberOfStars={5} starDimension="24px" starSpacing="2px" />
          <p>({averageRating} out of 5)</p>
        </div>
        
        <button
        className={`favorite-btn ${isFavorite ? "favorited" : ""}`}
        onClick={toggleFavorite}
      >
        <FaHeart color={isFavorite ? "red" : "gray"} size={24} />
      </button>
      </div>

      {/* Recipe Info Section */}
      <div className="recipe-info">
        <div className="info-box">
          <FaClock className="icon" />
          <p>
            <strong>Cooking Time:</strong> {recipe.cookingTime} minutes
          </p>
        </div>
        <div className="info-box">
          <FaUtensils className="icon" />
          <p>
            <strong>Category:</strong> {recipe.category}
          </p>
        </div>
      </div>
      

      {/* Ingredients Section */}
      <div className="ingredients-section">
        <h3 className="section-title">Ingredients</h3>
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          <table className="ingredients-table">
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {recipe.ingredients.map((ing, index) => (
                <tr key={index}>
                  <td>{ing.name}</td>
                  <td>{ing.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No ingredients listed</p>
        )}
      </div>

      {/* Instructions Section */}
      <div className="instructions-section">
        <h3 className="section-title">Instructions</h3>
        <p className="instructions">{recipe.instructions}</p>
      </div>
      {!isOwner && (<RecipeReviews recipeId={id} onAverageRatingChange={setAverageRating}/>)
       
      }
     
    </div>
    
  );
};

export default RecipeDetails;
