import ErrorChecker from "../helpers/ErrorChecker.js";
import RecipeService from "../helpers/RecipeService.js";
import s3 from "../config/awshelper.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {DeleteObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
dotenv.config();
//Create a new recipe
export const createRecipe=async(req,res)=>{
 try {
        
        const recipeData= req.body;
        console.log(recipeData)
        const userId = req.user.id;
        const recipes = {...recipeData,userId};
        const createdRecipe = await RecipeService.createRecipe(recipes);
        res.status(200).json(createdRecipe);
            
    } catch (error) {
        console.log(error);
        const error_code= await ErrorChecker.error_code(error);
        res.status(error_code).json(error);
    }

};

export const uploadS3Url = async(req,res)=>{

 const {filename,filetype,id}= req.query;
    
    
    const key =`recipes/${id}-${Date.now()}-${filename}`;
    const command = new PutObjectCommand({
    Bucket:process.env.AWS_S3_BUCKETNAME,
    Key:key,
    ContentType:filetype,
    ACL:"public-read",
    
    });
    
        
        try {
            const uploadUrl = await getSignedUrl(s3,command,{expiresIn:60});
            
            const fileUrl =`https://${process.env.AWS_S3_BUCKETNAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
            res.json({ uploadUrl, fileUrl });
          } catch (error) {
            console.error("S3 upload error:", error);
            res.status(500).json({ error: "Failed to generate upload URL" });
          }

};
//Get all recipes
export const getRecipes = async(req,res)=>{
try {
    const {page =1 } = req.query;
    const limit = 20;
    const offset = (page-1)*limit;
    const allRecipes = await RecipeService.getAllRecipes(limit,offset);
    res.status(200).json(allRecipes);
} catch (error) {
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json(error);
}

};
//Get a single recipe
export const getSingleRecipe = async(req,res)=>{

try {
    const id = req.params.id;

    const recipe = await RecipeService.getSingleRecipe(id);

    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (error) {
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json(error);
  }
};

//Edit a recipe
export const updateRecipe = async (req,res)=>{
try {
    const { id } = req.params;
    const userId = req.user.id;
    const { updatedRecipe, oldImageUrl } = req.body;

    const newUpdatedRecipe = { ...updatedRecipe, userId };

    const updateData = await RecipeService.updateRecipe(id, newUpdatedRecipe);
    if (!updateData)
      return res
        .status(404)
        .json({ error: "Recipe not found or unauthorized" });
    if (oldImageUrl) {
      const oldKey = oldImageUrl.split(".com/")[1];
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKETNAME,
        Key: oldKey,
      };
      await s3.send(new DeleteObjectCommand(deleteParams));
    }

    res.status(200).json(updateData);
  } catch (error) {
    console.log(error);
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json(error);
  }
};
//Delete a recipe
export const deleteRecipe = async (req,res)=>{
try {
    const id = req.params.id;
    const deleteRecipe = await RecipeService.deleteRecipe(id);
    if (!deleteRecipe)
      return res
        .status(404)
        .json({ error: "Recipe not found or unauthorized" });
    res.status(200).json(deleteRecipe);
  } catch (error) {
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json(error);
  }

}