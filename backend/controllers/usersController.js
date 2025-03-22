import ErrorChecker from "../helpers/ErrorChecker.js";
import UsersService from "../helpers/UsersService.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/awshelper.js";
import { Recipe } from "../models/Recipe.js";
import { User } from "../models/User.js";
export const getUserProfile = async (req, res) => {
  try {
    if(!req.user){
      return res.status(401).json({message:"Unauthorized"});
    }
    const userId = req.user.id;

    const profile = await UsersService.getProfile(userId);

    if (!profile)
      return res
        .status(404)
        .json({ message: "Profile not found " });

    res.status(200).json(profile);
  } catch (error) {
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json(error);
  }
};

export const anotherUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
   
    const user = await UsersService.getProfile(userId);
    
    if (!user)
      return res
        .status(404)
        .json({ message: "Profile not found or unauthorized" });
    const recipes = await Recipe.findAll({
          where: { userId: userId, isApproved: true },
          attributes: ["id", "title", "description", "imageUrl"],
        });
    res.status(200).json({user,recipes});
  } catch (error) {
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json(error);
  }
};

export const uploadProfilePic = async (req, res) => {
  try {
   
    const user = await UsersService.getProfile(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.profilePicture) {
      const oldKey = user.profilePicture.split(".com/")[1];

      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKETNAME,
        Key: oldKey,
      };
      try {
        await s3.send(new DeleteObjectCommand(deleteParams));
        console.log("Old profile picture deleted from S3");
      } catch (deleteError) {
        console.error("Error deleting old profile picture:", deleteError);
      }
    }
    // Save new image URL in database
    user.profilePicture = req.file.location;
    await user.save();
    res.status(200).json({ profilePicture: req.file.location });
  } catch (error) {
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json({ message: "Image upload failed" });
  }
};

export const myRecipes = async (req, res) => {
  try {
     const userId = req.user.id;
    const recipes = await UsersService.getMyRecipes(userId);
    if (!recipes) return res.status(404).json({ message: "Recipes not found" });
    const pendingRecipes = [];
    const myRecipes = [];
    recipes.map((recipe) => {
      if (!recipe.isApproved) {
        pendingRecipes.push(recipe);
      } else {
        myRecipes.push(recipe);
      }
    });
    res.json({ myRecipes, pendingRecipes });
  } catch (error) {
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json({ message: "Failed to fetch Recipes" });
  }
};


export const followers = async(req,res)=>{
  const userId = req.user.id;
  try {
    const followers = await UsersService.getFollowers(userId);
  
    res.json({followers:followers.map((f)=>f.Follower)});
  } catch (error) {
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json({ message: "Error fetching followers" });
  }

};

export const following = async(req,res)=>{
const userId = req.user.id;
try {
  const followedUsers = await UsersService.getFollowed(userId);
 
    res.json({followedUsers:followedUsers.map((f)=>f.Following)});
} catch (error) {
  const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json({ message: "Error fetching followed users" });
}
};

export const getUserById=async(req,res)=>{
  try {
    const { id } = req.params;
   
    // ✅ Fetch user by ID
    const user = await User.findByPk(id, {
      attributes: ["id", "username", "email", "profilePicture"],
    });
   
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "Error fetching user profile" });
  }

};