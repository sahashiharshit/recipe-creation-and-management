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
recipeRoutes.get('/:id',async(req,res)=>{
    try {
        const id = req.params.id;
        const recipe = await RecipeService.getSingleRecipe(id);
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        res.status(200).json(recipe);
    } catch (error) {
        const error_code = await ErrorChecker.error_code(error);
        res.status(error_code).json(error);
    }
});
//Edit a recipe
recipeRoutes.put('/:id',authMiddleware,async(req,res)=>{
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const { title, ingredients, instructions, imageUrl } = req.body;
        const updatedRecipe = await RecipeService.updateRecipe(id,userId,{title,ingredients,instructions,imageUrl});
        if (!updatedRecipe) return res.status(404).json({ error: 'Recipe not found or unauthorized' });
        res.status(200).json(updatedRecipe);
    } catch (error) {
        const error_code = await ErrorChecker.error_code(error);
        res.status(error_code).json(error);
    }
});
//Delete a recipe
recipeRoutes.delete('/:id',authMiddleware,async(req,res)=>{
    try {
        const id = req.params.id;
        const deleteRecipe = await RecipeService.deleteRecipe(id);
        if(!deleteRecipe) return res.status(404).json({error:'Recipe not found or unauthorized'});
        res.status(200).json(deleteRecipe);
    } catch (error) {
        const error_code = await ErrorChecker.error_code(error);
        res.status(error_code).json(error);
    }
});

//Get all recipes
recipeRoutes.get('/get-recipes',authMiddleware,async(req,res)=>{
try {
    const { page = 1 } = req.query;
    const limit = 20;
    const offset = (page - 1) * limit;
    const allRecipes = await RecipeService.getAllRecipes(limit,offset);
    res.status(200).json(allRecipes);
} catch (error) {
    const error_code = await ErrorChecker.error_code(error);
        res.status(error_code).json(error);
}

});
//Search recipes(query parameters for filters)
recipeRoutes.get('/search',(req,res)=>{});
//Filter recipes by dietary preferences, difficulty, or prep time
recipeRoutes.get('/filter',(req,res)=>{});
//Add a review to a recipe
recipeRoutes.post('/:id/reviews',(req,res)=>{});
//Get reviews for a recipe
recipeRoutes.get('/:id/reviews',(req,res)=>{});


export default recipeRoutes;