import { Router } from "express";
import {Favorite} from "../config/associations.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { deleteFavorites, getFavorites, postFavorites } from "../controllers/favoritesController.js";


const favoriteRoutes = Router();
//Get favorite recipes
favoriteRoutes.get('/',authMiddleware,getFavorites);
//Save a recipe to favorites
favoriteRoutes.post('/',authMiddleware,postFavorites);
//Remove a recipe from favorites
favoriteRoutes.delete('/:recipeId',authMiddleware,deleteFavorites);


export default favoriteRoutes;