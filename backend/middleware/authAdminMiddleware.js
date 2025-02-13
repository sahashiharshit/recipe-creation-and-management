import { verifyToken } from "../config/jwthelper.js";
import { Admin } from "../models/Admin.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const adminAuthMiddleware =async (req,res,next)=>{

const token = req.cookies.adminToken;

if(!token){
return res.status(403).json({error:'Unauthorized. No token provided.'});

}
try {
    const decoded = verifyToken(token,JWT_SECRET);
    const admin = await Admin.findByPk(decoded.id); // Find admin by ID

    if (!admin) return res.status(403).json({ message: "Access denied" });
    req.admin = admin;
    next();
} catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
}

};