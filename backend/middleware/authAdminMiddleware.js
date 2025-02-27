import { verifyToken } from "../config/jwthelper.js";
import { Admin } from "../models/Admin.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const adminAuthMiddleware =async (req,res,next)=>{

const token = req.cookies?.token;

if(!token){
return res.status(403).json({error:'Unauthorized. No token provided.'});

}
try {
    const decoded = verifyToken(token);
    const admin = await Admin.findByPk(decoded.id); // Find admin by ID

    if (!admin) return res.status(403).json({ message: "Access denied" });
    const adminData = admin.dataValues;
   
    req.admin = {adminData,role:"admin"};
    next();
} catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
}

};