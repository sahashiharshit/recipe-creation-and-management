import { Recipe } from "../models/Recipe.js";

class RecipeService {
  createRecipe = async (recipe) => {
    try {
      const newRecipe = await Recipe.create({
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        cookingTime: recipe.cookingTime,
        category: recipe.category,
        imageUrl: recipe.imageUrl,
        userId: recipe.userId,
      });
      return newRecipe;
    } catch (error) {
      throw error;
    }
  };
  getSingleRecipe = async (id) => {
    try {
      const getRecipe = await Recipe.findByPk(id);
      
      return getRecipe;
    } catch (error) {
      throw error;
    }
  };
  
  updateRecipe= async (id,updatedRecipe) => {
    try {
    
      const recipe = await Recipe.findByPk(id);
      if (!recipe) return null; // Recipe not found
      if (recipe.userId.toString() !== updatedRecipe.userId) return null; // Unauthorized
        
        const [rowsUpdated] = await Recipe.update(
          updatedRecipe,
          {where:{id:id},
          }
            
        );
        if(rowsUpdated===0) return null;
        return await Recipe.findByPk(id); 
    } catch (error) {
        throw error;
    }
  }
  deleteRecipe = async (id)=>{
    try {
        const deltedRecipe = await Recipe.destroy({where:{id}});
        return deltedRecipe;
    } catch (error) {
        throw error;
    }
  
  }
  getAllRecipes= async(limit,offset)=>{
    try {
        const allRecipes = await Recipe.findAll({where:{isApproved:true}},{limit,offset,order:[['createdAt','DESC']]});
        return allRecipes;
    } catch (error) {
        throw error;
    }
  }
}
export default new RecipeService();
