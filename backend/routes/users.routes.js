import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import UsersService from "../helpers/UsersService.js";
import ErrorChecker from "../helpers/ErrorChecker.js";

const usersRoutes = Router();

//Get current user profile
usersRoutes.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await UsersService.getProfile(userId);
    if (!profile)
      return res
        .status(404)
        .json({ message: "Profile not found or unauthorized" });

    res.status(200).json(profile);
  } catch (error) {
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json(error);
  }
});
//update user profile
usersRoutes.put("/profile", (req, res) => {

});
//view another user's profile
usersRoutes.get("/:id",authMiddleware,async(req, res) => {

  try {
    const userId = req.params.id;
    const profile = await UsersService.getProfile(userId);
    if (!profile)
      return res
        .status(404)
        .json({ message: "Profile not found or unauthorized" });

    res.status(200).json(profile);
  } catch (error) {
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json(error);
  }
});

//Get a user's followers
usersRoutes.get("/:id/followers", (req, res) => {

});

//Get users a person follows
usersRoutes.get("/:id/following", (req, res) => {

});
export default usersRoutes;
