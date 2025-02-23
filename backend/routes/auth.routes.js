import { Router } from "express";
import { configDotenv } from "dotenv";
import { login, logout, register } from "../controllers/authController.js";
const authRoutes = Router();
configDotenv();
//Register a new user
authRoutes.post("/register", register);

authRoutes.post("/login", login);

authRoutes.post("/logout", logout);

export default authRoutes;
