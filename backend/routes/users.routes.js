import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import UsersService from "../helpers/UsersService.js";
import ErrorChecker from "../helpers/ErrorChecker.js";
import s3 from "../config/awshelper.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
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
usersRoutes.put("/profile", (req, res) => {});
//view another user's profile
usersRoutes.get("/:id", authMiddleware, async (req, res) => {
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
usersRoutes.get("/:id/followers", (req, res) => {});

//Get users a person follows
usersRoutes.get("/:id/following", (req, res) => {});
usersRoutes.post(
  "/upload-profile-pic",
  authMiddleware,
  UsersService.upload.single("profilePicture"),
  async (req, res) => {
    //console.log("coming in this route");
    try {
      const user = await UsersService.getProfile(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      if (user.profilePicture) {
        const oldKey = user.profilePicture.split(".com/")[1];
        console.log(oldKey);
        const deleteParams = {Bucket:process.env.AWS_S3_BUCKETNAME,Key:oldKey};
        try {
          await s3.send(new DeleteObjectCommand(deleteParams));
          console.log("Old profile picture deleted from S3");
        } catch (deleteError) {
          console.error("Error deleting old profile picture:", deleteError);
        }
      }
      // Save new image URL in database
      user.profilePicture = req.file.location;
      await user.save();
      res.json({ profilePicture: req.file.location });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Image upload failed" });
    }
  }
);
export default usersRoutes;
