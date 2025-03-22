import encryptionservice from "../helpers/Encryptionservice.js";
import ErrorChecker from "../helpers/ErrorChecker.js";
;
import { User } from "../models/User.js";
import { Recipe } from "../models/Recipe.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../config/jwthelper.js";
const JWT_SECRET = process.env.JWT_SECRET;


export const adminSignup= async(req,res)=>{

}

// Login(Admin only)


export const adminlogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: "User doesn't exist" });
    }
    else if(!(user.role="admin"||"superadmin")){
      return res.status(401).json({error:"User is not admin"});
    }
    // Compare passwords
    const isMatch = await encryptionservice.checkPassword(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    
    // Generate JWT token
    const token =  generateToken(user);
    
    res.cookie("admintoken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
  
    
    res.status(200).json({
      message: "Login succesful",
    });
  } catch (error) {
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json(error);
  }
};

export const adminProfile = async (req, res) => {
  try {
    const data = req.admin;
    
    res.status(200).json({ id: data.adminData.id, role: data.role });
  } catch (error) {
    const error_code = await ErrorChecker.error_code(error);
   
    res.status(error_code).json(error);
  }
};

//Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll(
      {  },
      { attributes: { exclude: ["password"] } }
    );
  console.log(users);
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json(error);
  }
};

//Delete a recipe (Admin only)
export const deleteRecipe = async (req, res) => {
  try {
    const recipeid = req.params.id;
    const deletedRecipe = await Recipe.destroy({ where: { id: recipeid } });
    res.json(200).status({ message: "Recipe Deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Delete a user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: "User Deleted" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

//Get all recipes (Admin only)
export const getAllRecipes = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 20;
    const offset = (page - 1) * limit;
    const getAllRecipes = await Recipe.findAll(
      { where: { isApproved: true } },
      {
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      }
    );
    res.status(200).json(getAllRecipes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const logoutAdmin = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

export const approveUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isApproved = true;
    await user.save();

    res.json({ message: "User approved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const approveRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    recipe.isApproved = true;
    await recipe.save();

    res.json({ message: "Recipe approved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// export const pendingUsers = async (req, res) => {
//   try {
//     const users = await User.findAll({ });
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(400).json({ error: "Server error" });
//   }
// };

export const pendingRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({ where: { isApproved: false } });
    res.json(recipes);
  } catch (error) {
    res.status(400).json({ error: "Server error" });
  }
};

export const viewRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
 
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: "admin" },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).json({ message: "Token refreshed" });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};
