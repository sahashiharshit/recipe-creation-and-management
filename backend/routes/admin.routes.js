import { Router } from "express";

import { adminAuthMiddleware } from "../middleware/authAdminMiddleware.js";
import {
  adminlogin,
  adminProfile,
  approveRecipe,
  approveUser,
  deleteRecipe,
  deleteUser,
  getAllRecipes,
  getAllUsers,
  logoutAdmin,
  pendingRecipes,
  pendingUsers,
  viewRecipe,
} from "../controllers/adminController.js";

const adminRoutes = Router();

// Login(Admin only)
adminRoutes.post("/login", adminlogin);

//Profile of admin
adminRoutes.get("/profile", adminAuthMiddleware, adminProfile);

//Get all users (Admin only)
adminRoutes.get("/users", adminAuthMiddleware, getAllUsers);

//Delete a recipe (Admin only)

adminRoutes.delete("/recipes/:id", adminAuthMiddleware, deleteRecipe);

//Delete a user (Admin only)
adminRoutes.delete("/users/:id", adminAuthMiddleware, deleteUser);

//Get all recipes (Admin only)
adminRoutes.get("/recipes", adminAuthMiddleware, getAllRecipes);

adminRoutes.post("/logout", logoutAdmin);

adminRoutes.put("/approve-user/:id", adminAuthMiddleware, approveUser);

adminRoutes.put("/approve-recipe/:id", adminAuthMiddleware, approveRecipe);

adminRoutes.get("/pending-users", adminAuthMiddleware, pendingUsers);

adminRoutes.get("/pending-recipes", adminAuthMiddleware, pendingRecipes);

adminRoutes.get("/view-recipe/:id",adminAuthMiddleware,viewRecipe);

export default adminRoutes;
