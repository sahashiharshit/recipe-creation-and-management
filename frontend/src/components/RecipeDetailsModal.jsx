import PropTypes from "prop-types";

const RecipeDetailsModal = ({ recipe, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="recipe-modal-container">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <div className="recipe-header">
          <h2 className="recipe-title">{recipe.title}</h2>
        </div>
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
        </div>
        <div className="recipe-info">
          <p>
            <strong>Cooking Time:</strong> {recipe.cookingTime} min
          </p>
          <p>
            <strong>Category:</strong> {recipe.category}
          </p>
        </div>
        <div className="ingredients-section">
          <h4 className="section-title">Ingredients</h4>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.name} - {ingredient.quantity}
              </li>
            ))}
          </ul>
        </div>

        <div className="instructions-section">
          <h4 className="section-title">Instructions:</h4>
          <p className="instructions">{recipe.instructions}</p>
        </div>
        
      </div>
    </div>
  );
};
RecipeDetailsModal.propTypes = {
  recipe: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RecipeDetailsModal;
