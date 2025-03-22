import { Router } from "express";
import { configDotenv } from "dotenv";
import { checkavailability, forgotPassword, login, logout, register, resendOtp, resetPassword, verifyOTP, verifyOtpForReset } from "../controllers/authController.js";
const authRoutes = Router();
configDotenv();
//Register a new user
authRoutes.post("/register", register);
authRoutes.post("/verify-otp",verifyOTP);
authRoutes.post("/resend-otp", resendOtp);
authRoutes.post("/check-availbility",checkavailability);

authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/verify-reset-otp", verifyOtpForReset);
authRoutes.post("/reset-password", resetPassword);

authRoutes.post("/login", login);

authRoutes.post("/logout", logout);

export default authRoutes;

