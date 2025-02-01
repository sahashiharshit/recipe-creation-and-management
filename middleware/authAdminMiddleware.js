import { verifyToken } from "../config/jwthelper.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const adminAuthMiddleware = (req,res,next)=>{

const token = req.header('Authorization')?.split(' ')[1];

if(!token){
return res.status(401).json({error:'Unauthorized. No token provided.'});

}
try {
    const decoded = verifyToken(token,JWT_SECRET);
    if(!decoded.isAdmin){
    return res.status(403).json({ error: 'Access denied. Admins only.' });
    
    }
    req.admin = decoded;
    next();
} catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
}

};