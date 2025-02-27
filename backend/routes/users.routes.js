import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import UsersService from "../helpers/UsersService.js";



import {
  anotherUserProfile,
  getUserProfile,
  myRecipes,
  uploadProfilePic,
} from "../controllers/usersController.js";
const usersRoutes = Router();

usersRoutes.get("/my-recipes",authMiddleware,myRecipes);
//Get current user profile
usersRoutes.get("/profile", authMiddleware, getUserProfile);

//update user profile
usersRoutes.put("/profile");

//view another user's profile
usersRoutes.get("/:id", authMiddleware, anotherUserProfile);


usersRoutes.post(
  "/upload-profile-pic",
  authMiddleware,
  UsersService.upload.single("profilePicture"),
  uploadProfilePic
);


//Get a user's followers
usersRoutes.get("/:id/followers", (req, res) => {});

//Get users a person follows
usersRoutes.get("/:id/following", (req, res) => {});
export default usersRoutes;
