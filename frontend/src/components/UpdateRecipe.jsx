/* eslint-disable no-unused-vars */
import levenshtein from "fast-levenshtein";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import { API_BASE_URL } from "../utils/config";
import "../styles/PostRecipe.css";
const UpdateRecipe = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    ingredients: [],
    instructions: "",
    cookingTime: "",
    categoryId: "",
    imageUrl: "",
  });

  const [ingredient, setIngredient] = useState({ name: "", quantity: "" });
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Store new image file
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]); // Load categories
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/recipes/categories`,{withCredentials:true},
        );
        setCategories(response.data);
      } catch (error) {
        showErrorToast("⚠️ Failed to load categories");
      }
    };
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/recipes/${id}`,
          { withCredentials: true }
        );
      
        setRecipe(response.data);
        setSelectedCategory(response.data.categoryId);
        setPreview(response.data.imageUrl);
      } catch (error) {
        
        showErrorToast("❌⚠️ Error fetching recipe");
      }
    };
    fetchCategories();
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
  const removeIngredient = (index) => {
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients.filter((_, i) => i !== index),
    });
  };
  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store selected image
      setPreview(URL.createObjectURL(file)); // Show image preview
    }
  };

  const uploadToS3 = async (file,id) => {
    if (!file) return null;
    try {
      setUploading(true);
      // Step 1: Request a pre-signed URL from the backend
      const { data } = await axios.get(
        `${API_BASE_URL}/api/recipes/s3/upload-url`,
        {
          params: { filename: file.name, filetype: file.type,id },
          withCredentials: true,
        }
      );

      const { uploadUrl, fileUrl } = data; // Pre-signed S3 URL & final file URL
      
      // Step 2: Upload image to S3 using the pre-signed URL
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });
      setUploading(false);
      return fileUrl.split("?")[0]; //return the stord S3 url
    } catch (error) {
     showErrorToast("🚨❌ Error uploading image")
      setUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedImageUrl = recipe.imageUrl;
    
    try {
      const res = await axios.get(`${API_BASE_URL}/api/recipes/${id}`,{withCredentials:true});
      const oldImageUrl = res.data.imageUrl;

      if (imageFile) {
        const uploadedImageUrl = await uploadToS3(imageFile, id);
        if (uploadedImageUrl) {
          updatedImageUrl = uploadedImageUrl;
        }
      }
      let finalCategoryId = selectedCategory;
      const normalizedNewCategory = newCategory.trim().toLowerCase();
  
      if (!selectedCategory && normalizedNewCategory) {
        const existingCategory = categories.find(
          (cat) =>
            cat.category_name.toLowerCase() === normalizedNewCategory ||
            levenshtein.get(cat.category_name.toLowerCase(), normalizedNewCategory) <= 2 ||
            normalizedNewCategory.includes(cat.category_name.toLowerCase()) ||
            cat.category_name.toLowerCase().includes(normalizedNewCategory)
        );
  
        if (existingCategory) {
          finalCategoryId = existingCategory.id;
          showSuccessToast(`✅ Using existing category '${existingCategory.category_name}'`);
        } else {
          try {
            const { data } = await axios.post(
              `${API_BASE_URL}/api/recipes/categories/create`,
              { category_name: normalizedNewCategory },
              { withCredentials: true }
            );
            finalCategoryId = data.id;
            showSuccessToast(`✅ New category '${newCategory}' added!`);
          } catch (error) {
            showErrorToast("⚠️ Failed to add new category. Please try again.");
            return;
          }
        }
      }
      const updatedRecipe = {
        ...recipe,
        categoryId:finalCategoryId,
        imageUrl: updatedImageUrl,
      };

      await axios.put(
        `${API_BASE_URL}/api/recipes/update/${id}`,
        { updatedRecipe, oldImageUrl: imageFile ? oldImageUrl : null },
        { withCredentials: true }
      );

      showSuccessToast("📦✅ Recipe updated successfully!");
      navigate(`/recipe/${id}`);
    } catch (error) {
    
      showErrorToast("🚨❌ Error updating recipe");
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
            {Array.isArray(recipe.ingredients) &&
              recipe.ingredients.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.quantity}
                  <button
                    onClick={() => removeIngredient(index)}
                    className="remove-btn"
                  >
                    ❌
                  </button>
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

        {/* Select existing category */}
        <select
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="categories"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category_name}
            </option>
          ))}
        </select>

        {/* Add new category if not found */}
        <input
          type="text"
          name="newCategory"
          placeholder="Or add a new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
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
