import { Router } from "express";
import Encryptionservice from "../helpers/encryptionservice.js";
import Userauthentication from "../helpers/userauthentication.js";
import ErrorChecker from "../helpers/ErrorChecker.js";
import { generateToken } from "../config/jwthelper.js";
const userAuthRoutes = Router();

//Register a new User
userAuthRoutes.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await Encryptionservice.encryptPassword(
      password,
      10
    );
    const createdUser = await Userauthentication.register(
      username,
      email,
      hashedPassword
    );
    res.status(200).json(createdUser);
  } catch (error) {
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json(error);
  }
});

//Login User

userAuthRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    //check if user exist
    const user = await Userauthentication.getUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    //match password
    const isMatch = await Encryptionservice.checkPassword(
      password,
      user.password
    );
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    //check if user is admin
    const isAdmin = await Userauthentication.checkAdmin(user.id);
    const token = generateToken({
      id: user.id,
      email: user.email,
      isAdmin: !!isAdmin,
    });
    res.status(200).json({ message: "Login succesful", token });
  } catch (error) {
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json(error);
  }
});

userAuthRoutes.get("/getUsers", (req, res) => {});
userAuthRoutes.get("/getOneUser/:id", (req, res) => {});

export default userAuthRoutes;
