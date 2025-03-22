import { verifyToken } from "../config/jwthelper.js";
import { User } from "../models/User.js";

export const adminAuthMiddleware = async (req, res, next) => {
  const token = req.cookies?.admintoken;
  
  if (!token) {
    return res.status(403).json({ error: "Unauthorized. No token provided." });
  }

  try {
    const decoded = verifyToken(token);

    const admin = await User.findByPk(decoded.id); // Find admin by ID
   
    if (!admin) return res.status(403).json({ message: "Access denied" });

    req.admin = { id: admin.id, username: admin.username, role: decoded.role };
  
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
