

import { verifyToken } from '../config/jwthelper.js';
import Userauthentication from '../helpers/userauthentication.js';



export const authMiddleware = async(req,res,next)=>{
    const token = req.header('Authorization')?.split(' ')[1];
    if(!token){
        return res.status(401).json({error:'Unauthorized. No token provided.'});
    }
    try{
        const decoded = verifyToken(token);
        req.user = decoded;
        // Check if user is an admin in the Admin table
        
        const isAdmin = await Userauthentication.checkAdmin(req.user.id);
        req.user.isAdmin=!!isAdmin;
        next();
    }catch(error){
        return res.status(403).json({ error: 'Invalid or expired token' });
    }

}