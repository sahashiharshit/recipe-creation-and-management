import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";


import {
  createRecipe,
  deleteRecipe,
  getRecipes,
  getSingleRecipe,
  updateRecipe,
  uploadS3Url,
} from "../controllers/recipesController.js";

export const recipeRoutes = Router();

recipeRoutes.post("/create", authMiddleware, createRecipe);

recipeRoutes.get("/s3/upload-url", authMiddleware, uploadS3Url);


recipeRoutes.get("/get-recipes",  getRecipes);


recipeRoutes.get("/:id", authMiddleware,getSingleRecipe);

recipeRoutes.put("/update/:id", authMiddleware, updateRecipe);

recipeRoutes.delete("delete/:id", authMiddleware, deleteRecipe);

//Add a review to a recipe
recipeRoutes.post("/:id/reviews",);
//Get reviews for a recipe
recipeRoutes.get("/:id/reviews", );

export default recipeRoutes;
