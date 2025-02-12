

import { verifyToken } from '../config/jwthelper.js';
import Userauthentication from '../helpers/userauthentication.js';



export const authMiddleware = async(req,res,next)=>{
    const token = req.cookies?.token;
    if(!token){
        return res.status(401).json({error:'Unauthorized. No token provided.'});
    }
    try{
        const decoded = verifyToken(token);
        req.user = decoded;
        // Check if user is an admin in the Admin table
        
         //req.isAdmin = await Userauthentication.checkAdmin(req.user.id);
        
        next();
    }catch(error){
        return res.status(403).json({ error: 'Invalid or expired token' });
    }

}