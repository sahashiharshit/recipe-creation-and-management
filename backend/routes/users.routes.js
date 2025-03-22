import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import UsersService from "../helpers/UsersService.js";



import {
  anotherUserProfile,
  followers,
  following,
  getUserById,
  getUserProfile,
  myRecipes,
  uploadProfilePic,
} from "../controllers/usersController.js";
const usersRoutes = Router();

usersRoutes.get("/my-recipes",authMiddleware,myRecipes);
//Get current user profile
usersRoutes.get("/profile", authMiddleware, getUserProfile);

//update user profile


//view another user's profile
usersRoutes.get("/profile/:id", authMiddleware, anotherUserProfile);



usersRoutes.post(
  "/upload-profile-pic",
  authMiddleware,
  UsersService.upload.single("profilePicture"),
  uploadProfilePic
);


//Get a user's followers
usersRoutes.get("/followers", authMiddleware,followers);
usersRoutes.get("/followed",authMiddleware,following);
usersRoutes.get("/:id",authMiddleware,getUserById);

export default usersRoutes;
