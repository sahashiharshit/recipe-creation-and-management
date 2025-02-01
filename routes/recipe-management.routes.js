import { Router } from "express";

const recipeRoutes = Router();

recipeRoutes.post('/create-recipe',(req,res)=>{});
recipeRoutes.get('/recipe-details',(req,res)=>{});
recipeRoutes.get('/recipe',(req,res)=>{});
recipeRoutes.post('/rate-recipe',(req,res)=>{});
recipeRoutes.get('/get-rating',(req,res)=>{});
recipeRoutes.get('/search-recipe',(req,res)=>{});

export default recipeRoutes;