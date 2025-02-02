import { Router } from "express";



const favoriteRoutes = Router();
//Save a recipe to favorites
favoriteRoutes.post('/:recipeId',(req,res)=>{});
//Remove a recipe from favorites
favoriteRoutes.delete('/:recipeId',(req,res)=>{});

//Get favorite recipes
favoriteRoutes.get('/get-fav-recipes',(req,res)=>{});
export default favoriteRoutes;