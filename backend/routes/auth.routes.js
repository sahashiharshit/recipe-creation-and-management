import { Router } from "express";
import Encryptionservice from "../helpers/encryptionservice.js";
import Userauthentication from "../helpers/userauthentication.js";
import ErrorChecker from "../helpers/ErrorChecker.js";
import { generateToken } from "../config/jwthelper.js";
import { configDotenv } from "dotenv";
const authRoutes = Router();
configDotenv();
//Register a new user
authRoutes.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const hashedPassword = await Encryptionservice.encryptPassword(
        password,
        10
      );
      const createdUser = await Userauthentication.register(
        username,
        email,
        hashedPassword
      );
      res.status(201).json(createdUser);
    } catch (error) {
      const error_code = await ErrorChecker.error_code(error);
      res.status(error_code).json(error);
    }
  });
  
  //User login (JWT token)
  
  authRoutes.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      //check if user exist
      const user = await Userauthentication.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      //match password
      const isMatch = await Encryptionservice.checkPassword(
        password,
        user.password
      );
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      //check if user is admin
      const isAdmin = await Userauthentication.checkAdmin(user.id);
      const token = generateToken({
        id: user.id,
        email: user.email,
        isAdmin: !!isAdmin,
      });
      res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV ==="development",
        sameSite:'Strict',
      });
      res.status(200).json({ message: "Login succesful",user: { id: user.id, username: user.username, isAdmin: user.isAdmin } } );
    } catch (error) {
      const error_code = await ErrorChecker.error_code(error);
      res.status(error_code).json(error);
    }
  });
  
  
  authRoutes.post('/logout',(req,res)=>{
  
  res.clearCookie("token");
  res.json({message:"Logged out"});
  });
  
export default authRoutes;