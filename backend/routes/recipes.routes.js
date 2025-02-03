import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import RecipeService from "../helpers/RecipeService.js";
import ErrorChecker from "../helpers/ErrorChecker";

const recipeRoutes = Router();
//Create a new recipe
recipeRoutes.post('/create',authMiddleware,async(req,res)=>{
    
    try {

        const {title,description,ingredients,instructions,cookingTime,category,imageUrl}= req.body;
        const userId = req.user.id;
        const recipeData = {title,description,ingredients,instructions,cookingTime,category,imageUrl,userId};
        const createdRecipe = await RecipeService.createRecipe(recipeData);
        res.status(203).json(createdRecipe);
            
    } catch (error) {
        const error_code= await ErrorChecker.error_code(error);
        res.status(error_code).json(error);
    }

});
//Get a single recipe
recipeRoutes.get('/:id',(req,res)=>{
    
});
//Edit a recipe
recipeRoutes.put('/:id',(req,res)=>{});
//Delete a recipe
recipeRoutes.delete('/:id',(req,res)=>{});

//Get all recipes
recipeRoutes.get('/get-recipes',(req,res)=>{});
//Search recipes(query parameters for filters)
recipeRoutes.get('/search',(req,res)=>{});
//Filter recipes by dietary preferences, difficulty, or prep time
recipeRoutes.get('/filter',(req,res)=>{});
//Add a review to a recipe
recipeRoutes.post('/:id/reviews',(req,res)=>{});
//Get reviews for a recipe
recipeRoutes.get('/:id/reviews',(req,res)=>{});


export default recipeRoutes;