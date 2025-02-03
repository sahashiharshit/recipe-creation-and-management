import { Router } from "express";

const reviewRoutes = Router();
//Edit a review
reviewRoutes.put('/:reviewId',(req,res)=>{});
//Delete a review
reviewRoutes.delete('/:reviewId',(req,res)=>{});
export default reviewRoutes;