
import { generateToken } from "../config/jwthelper.js";
import encryptionservice from "../helpers/Encryptionservice.js";
import ErrorChecker from "../helpers/ErrorChecker.js";
import Userauthentication from "../helpers/Userauthentication.js";

export const register=async(req,res)=>{

    const { username, email, password } = req.body;
try {
      const hashedPassword = await encryptionservice.encryptPassword(
        password,
        10
      );
      const createdUser = await Userauthentication.register(
        username,
        email,
        hashedPassword
      );
      res.status(201).json(createdUser);
    } catch (error) {
      const error_code = await ErrorChecker.error_code(error);
      res.status(error_code).json(error);
    }
};

 //User login (JWT token)
export const login = async(req,res)=>{
    const { email, password } = req.body;
    try {
      //check if user exist
      const user = await Userauthentication.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      //match password
      const isMatch = await encryptionservice.checkPassword(
        password,
        user.password
      );
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      //check if user is admin
      // const isAdmin = await Userauthentication.checkAdmin(user.id);
      const token = generateToken({
        id: user.id,
        email: user.email,
        
      });
      res.cookie("token",token,{
        httpOnly:true,
        secure:true,
        sameSite:'None',
      });
      res.status(200).json({ message: "Login succesful",user: { id: user.id, username: user.username } } );
    } catch (error) {
      const error_code = await ErrorChecker.error_code(error);
      console.log(error);
      res.status(error_code).json(error);
    }

};
export const logout = async (req,res)=>{
    res.clearCookie("token");
    res.json({message:"Logged out"});

}