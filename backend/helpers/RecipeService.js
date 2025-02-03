import {Recipe} from '../models/Recipe.js'

class RecipeService{

createRecipe=async(recipe)=>{
    try {
        const newRecipe = await Recipe.create({
            title:recipe.title,
            description:recipe.description,
            ingredients:recipe.ingredients,
            instructions:recipe.instructions,
            cookingTime:recipe.cookingTime,
            category:recipe.category,
            imageUrl:recipe.imageUrl,
            userId:recipe.userId
        
        });
        return newRecipe;
    } catch (error) {
        throw error;
    }


}
getSingleRecipe = async()=>{

}


}
export default new RecipeService();
