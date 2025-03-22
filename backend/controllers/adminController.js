import encryptionservice from "../helpers/Encryptionservice.js";
import ErrorChecker from "../helpers/ErrorChecker.js";
;
import { User } from "../models/User.js";
import { Recipe } from "../models/Recipe.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../config/jwthelper.js";
const JWT_SECRET = process.env.JWT_SECRET;



// Login(Admin only)


export const adminlogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ error: "User doesn't exist" });
    }
    else if(!(user.role="admin"|| user.role ==="superadmin")){
      return res.status(401).json({error:"User is not authorized"});
    }
    // Compare passwords
    const isMatch = await encryptionservice.checkPassword(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    console.log(user.role);
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
    const {id,username,role} = req.admin;
    console.log(role)
    
    res.status(200).json({ id, username,role });
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

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json(error);
  }
};

//Delete a recipe (Admin only)
export const deleteRecipe = async (req, res) => {
  try {
    const recipeid = req.params.id;
     await Recipe.destroy({ where: { id: recipeid } });
    res.json(200).status({ message: "Recipe Deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Delete a user (Admin only)
export const deleteUser = async (req, res) => {
const {id,role}=req.admin;
  try {
    const userToDelete = await User.findByPk(req.params?.id);
    if(!userToDelete){
      return res.status(404).json({ message: "User not found" });
    }
    
    if (role === "superadmin" && userToDelete.role === "superadmin") {
      return res.status(403).json({
        message: "Superadmin cannot delete other superadmins.",
      });
    }
    if (
      role === "admin" &&
      (userToDelete.role === "superadmin" ||
        userToDelete.role === "admin" ||
        userToDelete.id === id)
    ) {
      return res.status(403).json({
        message: "Admin cannot delete superadmins, admins, or themselves.",
      });
      
      }
      if (role === "superadmin" && userToDelete.id === id) {
        return res.status(403).json({
          message: "Superadmin cannot delete their own account.",
        });
      }
  
    await userToDelete.destroy();
    res.status(200).json({ message: "User deleted successfully." });
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
  res.clearCookie("admintoken");
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

export const getUserDetails=async(req,res)=>{
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "username", "email", "createdAt", "role"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }

}

export const updateUserRole = async(req,res)=>{

  const { userId, newRole } = req.body; // userId and new role
  const { role } = req.admin;
  try {
    // ✅ Check if the logged-in user is a SuperAdmin
    if (role !== "superadmin") {
      return res.status(403).json({ error: "Access denied. Only SuperAdmins can modify roles." });
    }

    // ✅ Check for valid role
    const validRoles = ["user", "admin", "superadmin"];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ error: "Invalid role provided." });
    }

    // ✅ Find the target user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // ❗️ Prevent self role modification
    if (user.id === req.admin.id) {
      return res.status(403).json({ error: "You cannot change your own role." });
    }

    // ❗️ Prevent downgrading or upgrading other SuperAdmins
    if (user.role === "superadmin" && newRole !== "superadmin") {
      return res
        .status(403)
        .json({ error: "You cannot modify the role of another SuperAdmin." });
    }

    // ✅ Allow only valid role changes
    user.role = newRole;
    await user.save();

    res.status(200).json({
      message: `User role updated successfully to ${newRole}`,
    });
  } catch (error) {
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json({ error: "Error updating user role" });
  }
}