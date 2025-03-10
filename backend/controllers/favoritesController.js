import { Favorite } from "../models/Favorite.js";
import { Recipe } from "../models/Recipe.js";

export const getFavorites=async(req,res)=>{
try {
    
    const userId = req.user.id;
    
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const favorites = await Favorite.findAll({
        where: { userId },
        include:[{model:Recipe}],
      });
  
      res.json({ success: true, favorites });
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }


};

export const postFavorites = async (req,res)=>{
    try {
        const {recipeId} = req.body;
        const userId = req.user.id;
        if(!userId){
            return res.status(401).json({ message: "Unauthorized" });
        }
        const [favorite, created] = await Favorite.findOrCreate({
            where: { userId, recipeId },
          });
          return res.json({ success: true, favorite, created });
    } catch (error) {
        console.error("Error adding favorite:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

};

export const deleteFavorites = async (req,res)=>{
    try {
        const { recipeId } = req.params;
        const userId = req.user.id; // Get user from authentication middleware
    
        if (!userId) {
          return res.status(401).json({ message: "Unauthorized" });
        }
    
        await Favorite.destroy({
          where: { userId, recipeId },
        });
    
        res.json({ success: true, message: "Favorite removed" });
      } catch (error) {
        console.error("Error removing favorite:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }

};