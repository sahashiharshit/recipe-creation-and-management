/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaClock, FaUtensils, FaEdit } from "react-icons/fa";
import axios from "axios";
import '../assets/styles/RecipeDetails.css';
import { showErrorToast } from "../utils/ToastUtils";
const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false); // ✅ Track ownership
  useEffect(() => {
  
    const fetchRecipe =async()=>{
    
      try {
       const res = await axios.get(`http://localhost:3000/api/recipes/${id}`, { withCredentials: true });
       if (res.data) {
      
        setRecipe(res.data);
        const userRes = await axios.get("http://localhost:3000/api/users/profile", {
          withCredentials: true, // ✅ Ensure cookies are sent
        });
        if (userRes.data?.id) {
          setIsOwner(res.data.userId === userRes.data.id); // ✅ Compare userId
        }
        
      } else {
       
        showErrorToast("❌⚠️ Recipe not found");
      }
       
      } catch (error) {
        showErrorToast("🔄❌ Could not process request!");
        
      }finally{
        setLoading(false);
      
      }
    
    };
    fetchRecipe();

  }, [id]);
  if (loading) return <p>Loading recipe details...</p>;
  

  return (
    <div className="recipe-container">
      {/* Recipe Header */}
      <div className="recipe-header">
        <h1 className="recipe-title">{recipe.title}</h1>
        
        {/* ✅ Show Edit Button Only if User is Owner */}
        {isOwner && (
        <button className="edit-button" onClick={() => navigate(`/edit-recipe/${id}`)}>
          <FaEdit className="edit-icon" /> Edit Recipe
        </button>
         )}
      </div>

      {/* Recipe Image */}
      <div className="recipe-image-container">
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image" />
        ) : (
          <p className="no-image">No Image Available</p>
        )}
      </div>

      {/* Recipe Info Section */}
      <div className="recipe-info">
        <div className="info-box">
          <FaClock className="icon" />
          <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
        </div>
        <div className="info-box">
          <FaUtensils className="icon" />
          <p><strong>Category:</strong> {recipe.category}</p>
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
    </div>
  );
};

export default RecipeDetails;
