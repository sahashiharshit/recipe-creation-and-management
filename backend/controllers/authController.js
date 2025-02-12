import { generateToken } from "../config/jwthelper.js";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const ACCESS_EXPIRES = process.env.ACCESS_EXPIRES; // Short-lived access token
const REFRESH_EXPIRES = process.env.REFRESH_EXPIRES; // Long-lived refresh token
const generateTokens = (userId,role)=>{

    const accessToken = generateToken({userId,role})
};