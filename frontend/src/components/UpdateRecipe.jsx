import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateRecipe = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    ingredients: [],
    instructions: "",
    cookingTime: "",
    category: "",
    imageUrl: "",
  });

  const [ingredient, setIngredient] = useState({ name: "", quantity: "" });
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Store new image file
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/recipes/${id}`,
          { withCredentials: true }
        );
        console.log(response.data);
        setRecipe(response.data);
        setPreview(response.data.imageUrl);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };
    fetchRecipe();
  }, [id]);

  // Handle form field updates
  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };
  // Handle ingredient input updates
  const handleIngredientChange = (e) => {
    setIngredient({ ...ingredient, [e.target.name]: e.target.value });
  };
  // Add ingredient to list
  const addIngredient = () => {
    if (ingredient.name.trim() && ingredient.quantity.trim()) {
      
      setRecipe({
        ...recipe,
        ingredients: [...recipe.ingredients, ingredient],
      });
      setIngredient({ name: "", quantity: "" });
    }
  };
  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store selected image
      setPreview(URL.createObjectURL(file)); // Show image preview
    }
  };

  const uploadToS3 = async (file) => {
    if (!file) return null;
    try {
      setUploading(true);
      // Step 1: Request a pre-signed URL from the backend
      const { data } = await axios.get(
        "http://localhost:3000/api/recipes/s3/upload-url",
        {
          params: { filename: file.name, filetype: file.type },
          withCredentials: true,
        }
      );

      const { uploadUrl, fileUrl } = data; // Pre-signed S3 URL & final file URL
      console.log("Output of data:", data);
      // Step 2: Upload image to S3 using the pre-signed URL
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });
      setUploading(false);
      return fileUrl.split("?")[0]; //return the stord S3 url
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedImageUrl = recipe.imageUrl;

    if (imageFile) {
      const uploadedImageUrl = await uploadToS3(imageFile);
      if (uploadedImageUrl) {
        updatedImageUrl = uploadedImageUrl;
      }
    }
    const updatedRecipe = {
      ...recipe,
      imageUrl: updatedImageUrl,
    };

    try {
      await axios.put(
        `http://localhost:3000/api/recipes/update/${id}`,
        updatedRecipe,
        {
          withCredentials: true,
        }
      );
      navigate(`/recipe/${id}`);
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };
  return (
    <div className="post-recipe-container">
      {/* Left Section: Image & Ingredients */}
      <div className="left-section">
        <div className="recipe-image">
          {preview ? (
            <img src={preview} alt="Recipe Preview" />
          ) : (
            <p>No Image Selected</p>
          )}
        </div>
        <div className="ingredients-list">
          <h3>Ingredients</h3>
          <ul>
            {Array.isArray(recipe.ingredients) && recipe.ingredients.map((item, index) => (
              <li key={index}>
                {item.name} - {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Section: Update Recipe Form */}
      <form className="recipe-form" onSubmit={handleSubmit}>
        <h2>Update Recipe</h2>
        <input
          type="text"
          name="title"
          value={recipe.title}
          placeholder="Title"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          value={recipe.description}
          placeholder="Description"
          onChange={handleChange}
          required
        />
        <textarea
          name="instructions"
          value={recipe.instructions}
          placeholder="Instructions"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="cookingTime"
          value={recipe.cookingTime}
          placeholder="Cooking Time (minutes)"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          value={recipe.category}
          placeholder="Category"
          onChange={handleChange}
          required
        />

        {/* Ingredient Inputs */}
        <div className="ingredient-input">
          <input
            type="text"
            name="name"
            placeholder="Ingredient Name"
            value={ingredient.name}
            onChange={handleIngredientChange}
          />
          <input
            type="text"
            name="quantity"
            placeholder="Quantity"
            value={ingredient.quantity}
            onChange={handleIngredientChange}
          />
          <button
            type="button"
            className="add-ingredient"
            onClick={addIngredient}
          >
            Add
          </button>
        </div>

        {/* Image Upload */}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {uploading && <p>Uploading image...</p>}
        <button type="submit" disabled={uploading}>
          Update Recipe
        </button>
      </form>
    </div>
  );
};
export default UpdateRecipe;
