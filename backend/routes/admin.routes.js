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
  getUserDetails,
  logoutAdmin,
  pendingRecipes,
 
  refreshToken,
  updateUserRole,
  viewRecipe,
} from "../controllers/adminController.js";

const adminRoutes = Router();


// Login(Admin only)
adminRoutes.post("/login", adminlogin);

adminRoutes.post("/refresh",refreshToken);
//Profile of admin
adminRoutes.get("/profile", adminAuthMiddleware, adminProfile);

//Get all users (Admin only)
adminRoutes.get("/users", adminAuthMiddleware, getAllUsers);

adminRoutes.get("/user/:id",adminAuthMiddleware,getUserDetails);
//Delete a recipe (Admin only)

adminRoutes.delete("/recipe/:id", adminAuthMiddleware, deleteRecipe);

//Delete a user (Admin only)
adminRoutes.delete("/user/:id", adminAuthMiddleware, deleteUser);

//Get all recipes (Admin only)
adminRoutes.get("/recipes", adminAuthMiddleware, getAllRecipes);

adminRoutes.post("/logout", logoutAdmin);

adminRoutes.put("/approve-user/:id", adminAuthMiddleware, approveUser);

adminRoutes.put("/approve-recipe/:id", adminAuthMiddleware, approveRecipe);



adminRoutes.get("/pending-recipes", adminAuthMiddleware, pendingRecipes);

adminRoutes.get("/view-recipe/:id",adminAuthMiddleware,viewRecipe);

adminRoutes.get("/admin/update-role",adminAuthMiddleware,updateUserRole);

export default adminRoutes;
