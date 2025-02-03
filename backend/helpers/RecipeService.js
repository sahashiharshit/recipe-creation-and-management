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
  
  updateRecipe= async (id,userId,updatedData) => {
    try {
        const [updated] = await Recipe.update(
            updatedData,
            { where: { id: id, userId: userId } }
        );
        return updated;
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
        const allRecipes = await Recipe.findAll({limit,offset,order:[['createdAt','DESC']]});
        return allRecipes;
    } catch (error) {
        throw error;
    }
  }
}
export default new RecipeService();
