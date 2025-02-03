import { Router } from "express";

const collectionRoutes = Router();

//Create a collection
collectionRoutes.post('/',(req,res)=>{});

//Get all collections
collectionRoutes.get('/',(req,res)=>{});

//Add a recipe to a collection
collectionRoutes.post('/:id/add/:recipeId',(req,res)=>{});

//Remove a recipe from a collection
collectionRoutes.delete('/:id/remove/:recipeId',(req,res)=>{});

export default collectionRoutes;