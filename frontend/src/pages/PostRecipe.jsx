/* eslint-disable no-unused-vars */
import levenshtein from "fast-levenshtein";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/PostRecipe.css";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import { API_BASE_URL } from "../utils/config";

const PostRecipe = () => {
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
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");

  // 🎯 Fetch existing categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/recipes/categories`
        );
        setCategories(response.data);
      } catch (error) {
        showErrorToast("⚠️ Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

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

  const removeIngredient = (index) => {
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients.filter((_, i) => i !== index),
    });
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
        `${API_BASE_URL}/api/recipes/s3/upload-url`,
        {
          params: { filename: imageFile.name, filetype: imageFile.type },
          withCredentials: true,
        }
      );

      const { uploadUrl, fileUrl } = data; // Pre-signed S3 URL & final file URL

      // Step 2: Upload image to S3 using the pre-signed URL
      await axios.put(uploadUrl, imageFile, {
        headers: { "Content-Type": imageFile.type },
      });
      setUploading(false);
      return fileUrl; //return the stord S3 url
    } catch (error) {
      setUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const s3Url = await uploadToS3();

    if (!s3Url) {
      showErrorToast("🚨❌ Error uploading image");
      return;
    }
    let finalCategoryId = selectedCategory;
    const normalizedNewCategory = newCategory.trim().toLowerCase();
    if (!selectedCategory && normalizedNewCategory) {
    const existingCategory = categories.find(
    (cat)=>
    cat.category_name.toLowerCase()===normalizedNewCategory|| levenshtein.get(cat.category_name.toLowerCase(),normalizedNewCategory)<=2 ||
    normalizedNewCategory.includes(cat.category_name.toLowerCase()) || cat.category_name.toLowerCase().includes(normalizedNewCategory)
    );
    
    if(existingCategory){
    finalCategoryId=existingCategory.id;
    showSuccessToast(`✅ Using existing category '${existingCategory.category_name}'`);
    
    }else{
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
    const recipeData = {
      ...recipe,
      categoryId: finalCategoryId,
      imageUrl: s3Url, // Save S3 URL
    };

    try {
      await axios.post(`${API_BASE_URL}/api/recipes/create`, recipeData, {
        withCredentials: true,
      });
      showSuccessToast("📦✅ Recipe added successfully!");
      navigate("/");
    } catch (error) {
      showErrorToast("🚨❌ Error adding Recipe. Please try again!");
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
