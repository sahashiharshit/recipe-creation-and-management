import { Router } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
import encryptionservice from "../helpers/encryptionservice.js";
import ErrorChecker from "../helpers/ErrorChecker.js";
import { adminAuthMiddleware } from "../middleware/authAdminMiddleware.js";
import { User } from "../models/User.js";
import { Recipe } from "../models/Recipe.js";

const adminRoutes = Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Login(Admin only)
adminRoutes.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { username } });

    if (!admin) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    // Compare passwords
    const isMatch = await encryptionservice.checkPassword(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id},
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "Strict",
    });
    res
      .status(200)
      .json({
        message: "Login succesful",
      });
  } catch (error) {
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json({ error });
  }
});

//Profile of admin
adminRoutes.get("/profile",adminAuthMiddleware,(req,res)=>{

const decoded = req.admin;
res.json({ id: decoded.id, role: decoded.role });
});

//admin dashboard
adminRoutes.get("/dashboard", adminAuthMiddleware, async (req, res) => {
  try {
  if(!req.admin) return res.status(403).json({message:"Forbidden"});
  res.json({ message: "Welcome to Admin Dashboard", admin: req.admin });
    // const users = await User.findAll({
    //   attributes: ["id", "username", "email"],
    // });
    // const recipes = await Recipe.findAll({
    //   attributes: ["id", "title", "authorId"],
    // });

    // res.json({ users, recipes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
});

//Get all users (Admin only)
adminRoutes.get("/users", adminAuthMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Delete a recipe (Admin only)

adminRoutes.delete("/recipes/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const recipeid = req.params.id;
    const deletedRecipe = await Recipe.destroy({ where: { id: recipeid } });
    res.json(200).status({ message: "Recipe Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//Delete a user (Admin only)
adminRoutes.delete("/users/:id", adminAuthMiddleware, async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: "User Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//Get all recipes (Admin only)
adminRoutes.get("/recipes", adminAuthMiddleware, async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 20;
    const offset = (page - 1) * limit;
    const getAllRecipes = await Recipe.findAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(getAllRecipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
adminRoutes.post("/logout", (req, res) => {
  res.clearCookie("adminToken");
  res.json({ message: "Logged out" });
});

export default adminRoutes;
