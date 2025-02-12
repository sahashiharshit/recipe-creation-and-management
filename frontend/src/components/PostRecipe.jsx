import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../assets/styles/postRecipe.css";
const PostRecipe = () => {
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
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleIngredientChange = (e) => {
    setIngredient({ ...ingredient, [e.target.name]: e.target.value });
  };

  const addIngredient = () => {
    if (ingredient.name.trim() && ingredient.quantity.trim()) {
      setRecipe({
        ...recipe,
        ingredients: [...recipe.ingredients, ingredient],
      });
      setIngredient({ name: "", quantity: "" }); // Clear input after adding
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      //setRecipe({ ...recipe, imageUrl: file });
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); // Show image preview
    }
  };
  //Upload image to Aws s3
  const uploadToS3 = async () => {
    if (!imageFile) return null;

    try {
      setUploading(true);
      // Step 1: Request a pre-signed URL from the backend
      const { data } = await axios.get(
        "http://localhost:3000/api/recipes/s3/upload-url",
        {
          params: { filename: imageFile.name, filetype: imageFile.type },
          withCredentials: true,
        }
      );

      const { uploadUrl, fileUrl } = data; // Pre-signed S3 URL & final file URL
      console.log("Output of data:", data);
      // Step 2: Upload image to S3 using the pre-signed URL
      await axios.put(uploadUrl, imageFile, {
        headers: { "Content-Type": imageFile.type },
      });
      setUploading(false);
      return fileUrl; //return the stord S3 url
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const s3Url = await uploadToS3();

    if (!s3Url) {
      alert("Image upload failed! Please try again.");
      return;
    }

    const recipeData = {
      ...recipe,
      imageUrl: s3Url, // Save S3 URL
    };

    try {
      await axios.post("http://localhost:3000/api/recipes/create", recipeData, {
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Error posting recipe", error);
    }
  };

  return (
    <div className="post-recipe-container">
      {/* Left Side: Image & Ingredients */}
      <div className="left-section">
        <div className="recipe-image">
          {preview ? (
            <img src={preview} alt="Preview" />
          ) : (
            <p>No Image Selected</p>
          )}
        </div>
        <div className="ingredients-list">
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((item, index) => (
              <li key={index}>
                {item.name} - {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Side: Recipe Form */}
      <form className="recipe-form" onSubmit={handleSubmit}>
        <h2>Post a New Recipe</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />
        <textarea
          name="instructions"
          placeholder="Instructions"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="cookingTime"
          placeholder="Cooking Time (minutes)"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
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
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        {uploading && <p>Uploading image...</p>}
        <button type="submit" disabled={uploading}>
          Post Recipe
        </button>
      </form>
    </div>
  );
};

export default PostRecipe;
