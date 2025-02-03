import { Router } from "express";   
const socialsRoutes = Router();
//Follow a user
socialsRoutes.post('/follow/:userId',(req,res)=>{});
//Unfollow a user
socialsRoutes.delete('/unfollow/:userId',(req,res)=>{});
//Get activity feed of followed users
socialsRoutes.get('/feed',(req,res)=>{});
export default socialsRoutes;
