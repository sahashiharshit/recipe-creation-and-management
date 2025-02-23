import ErrorChecker from "../helpers/ErrorChecker.js";
import UsersService from "../helpers/UsersService.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/awshelper.js";
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await UsersService.getProfile(userId);

    if (!profile)
      return res
        .status(404)
        .json({ message: "Profile not found or unauthorized" });

    res.status(200).json(profile);
  } catch (error) {
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json(error);
  }
};

export const anotherUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const profile = await UsersService.getProfile(userId);
    if (!profile)
      return res
        .status(404)
        .json({ message: "Profile not found or unauthorized" });

    res.status(200).json(profile);
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
    res.json({ profilePicture: req.file.location });
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
