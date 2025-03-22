import { Router } from "express";   
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkIfFollowing, followUser, unfollowUser } from "../controllers/socialController.js";
const socialsRoutes = Router();
//Follow a user
socialsRoutes.post('/follow/',authMiddleware,followUser);
//Unfollow a user
socialsRoutes.post('/unfollow/',authMiddleware,unfollowUser);
//Get activity feed of followed users
socialsRoutes.get("/is-following/:userId",authMiddleware,checkIfFollowing)
export default socialsRoutes;
