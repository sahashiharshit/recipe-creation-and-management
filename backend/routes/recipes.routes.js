import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

import {
  createRecipe,
  deleteRecipe,
  getRecipes,
  getSingleRecipe,
  updateRecipe,
  uploadS3Url,
  getRecipeReviews,
  postReview,
  getCategories,
  createCategories,
} from "../controllers/recipesController.js";

export const recipeRoutes = Router();

recipeRoutes.post("/create", authMiddleware, createRecipe);

recipeRoutes.get("/s3/upload-url", authMiddleware, uploadS3Url);

recipeRoutes.get("/get-recipes", getRecipes);

recipeRoutes.get("/categories", getCategories);

recipeRoutes.post("/categories/create",authMiddleware,createCategories)

recipeRoutes.get("/:id", authMiddleware, getSingleRecipe);

recipeRoutes.put("/update/:id", authMiddleware, updateRecipe);

recipeRoutes.delete("delete/:id", authMiddleware, deleteRecipe);

recipeRoutes.get("/:recipeId/reviews", authMiddleware, getRecipeReviews);
//Delete a review
recipeRoutes.post("/:recipeId/reviews", authMiddleware, postReview);

export default recipeRoutes;
