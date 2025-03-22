import { Router } from "express";
import { configDotenv } from "dotenv";
import { checkavailability, login, logout, register, resendOtp, verifyOTP } from "../controllers/authController.js";
const authRoutes = Router();
configDotenv();
//Register a new user
authRoutes.post("/register", register);
authRoutes.post("/verify-otp",verifyOTP);
authRoutes.post("/resend-otp", resendOtp);
authRoutes.post("/check-availbility",checkavailability);


authRoutes.post("/login", login);

authRoutes.post("/logout", logout);

export default authRoutes;

