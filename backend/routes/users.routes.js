import { Router } from "express";

const usersRoutes = Router();


//Get current user profile
usersRoutes.get("/profile", (req, res) => {});
//update user profile
usersRoutes.put("/profile",(req,res)=>{

});
//view another user's profile
usersRoutes.get('/:id',(req,res)=>{});

//Get a user's followers
usersRoutes.get('/:id/followers',(req,res)=>{});

//Get users a person follows
usersRoutes.get('/:id/following',(req,res)=>{});
export default usersRoutes;
