import { Router } from "express";
import jwt from 'jsonwebtoken';
import { Admin } from "../models/Admin.js";
import encryptionservice from "../helpers/encryptionservice.js";
import ErrorChecker from "../helpers/ErrorChecker.js";
import { adminAuthMiddleware } from "../middleware/authAdminMiddleware.js";

const adminRoutes = Router();

const JWT_SECRET = process.env.JWT_SECRET;
adminRoutes.post('/admin-login',async(req,res)=>{
const {username,password}= req.body;
try{
const admin = await Admin.findOne({where:{username}});
if (!admin) {
    return res.status(401).json({ error: 'Invalid username or password' });
}
// Compare passwords
const isMatch = await encryptionservice.checkPassword(password, admin.password);
if (!isMatch) {
    return res.status(401).json({ error: 'Invalid username or password' });
}
// Generate JWT token
const token = jwt.sign(
    { id: admin.id, username: admin.username, isAdmin: true }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
);
res.status(200).json({ message: 'Admin login successful', token });
}catch(error){
const error_code = await ErrorChecker.error_code(error);
res.status(error_code).json({error});
}
});

adminRoutes.get('/admin-dashboard',adminAuthMiddleware,async(req,res)=>{
if(!req.user.isAdmin){
    return res.status(403).json({error:'Access denied. Admin only'});
}
res.json({message:'Welcome to the admin dashboard'});
});
adminRoutes.get('/getAllUsers',(req,res)=>{});
adminRoutes.delete('/delete-recipe',(req,res)=>{});
adminRoutes.delete('/delete-user',(req,res)=>{});
adminRoutes.post('/approve-user',(req,res)=>{});



export default adminRoutes;