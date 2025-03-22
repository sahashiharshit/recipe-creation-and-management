import { Router } from "express";

import { adminAuthMiddleware } from "../middleware/authAdminMiddleware.js";
import {
  adminlogin,
  adminProfile,
  adminSignup,
  approveRecipe,
  approveUser,
  deleteRecipe,
  deleteUser,
  getAllRecipes,
  getAllUsers,
  logoutAdmin,
  pendingRecipes,
 
  refreshToken,
  viewRecipe,
} from "../controllers/adminController.js";

const adminRoutes = Router();

adminRoutes.post("/signup",adminSignup);
// Login(Admin only)
adminRoutes.post("/login", adminlogin);

adminRoutes.post("/refresh",refreshToken);
//Profile of admin
adminRoutes.get("/profile", adminAuthMiddleware, adminProfile);

//Get all users (Admin only)
adminRoutes.get("/users", adminAuthMiddleware, getAllUsers);

//Delete a recipe (Admin only)

adminRoutes.delete("/recipe/:id", adminAuthMiddleware, deleteRecipe);

//Delete a user (Admin only)
adminRoutes.delete("/user/:id", adminAuthMiddleware, deleteUser);

//Get all recipes (Admin only)
adminRoutes.get("/recipes", adminAuthMiddleware, getAllRecipes);

adminRoutes.post("/logout", logoutAdmin);

adminRoutes.put("/approve-user/:id", adminAuthMiddleware, approveUser);

adminRoutes.put("/approve-recipe/:id", adminAuthMiddleware, approveRecipe);

//adminRoutes.get("/pending-users", adminAuthMiddleware, pendingUsers);

adminRoutes.get("/pending-recipes", adminAuthMiddleware, pendingRecipes);

adminRoutes.get("/view-recipe/:id",adminAuthMiddleware,viewRecipe);

export default adminRoutes;
