import { Op } from "sequelize";
import { Recipe } from "../models/Recipe.js";
import {Review,Categories} from "../config/associations.js";

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
  getAllRecipes= async(limit,offset,search="",category)=>{
    try {
        const whereClause = {isApproved:true};
      if(search){
        whereClause.title={[Op.iLike]:`%${search}%`};
        
      }
      if(category && category!=="All"){
        whereClause.categoryId=category;
      }
       const {count,rows} = await Recipe.findAndCountAll({
       where:whereClause,
       limit,
       offset,
       order:[["createdAt","DESC"]],
       
       });
       return {
       total:count,
       recipes:rows,
       totalPages:Math.ceil(count/limit),
       currentPage:offset/limit+1,
       
       };
    } catch (error) {
        throw error;
    }
  }
  
  getAllReviews = async(recipe_id)=>{
  try {
    const reviews = await Review.findAll({where:{recipeId:recipe_id}});
    
    return reviews
  } catch (error) {
    throw error;
  }  
  }
  
  postReview = async (comment,rating,userId,recipeId)=>{
  try {
    const review = await Review.create({
    rating:rating,
    comment:comment,
    userId:userId,
    recipeId:recipeId,
    });
    return review;
  } catch (error) {
    throw error
  }
  }
  
  getAllCategories = async()=>{
  try {
    return await Categories.findAll();
  } catch (error) {
    throw error;
  }
  
  }
}
export default new RecipeService();
