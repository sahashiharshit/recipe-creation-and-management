import { generateToken } from "../config/jwthelper.js";
import { sendOTPEmail } from "../config/nodemailer.js";
import encryptionservice from "../helpers/Encryptionservice.js";
import ErrorChecker from "../helpers/ErrorChecker.js";
import Userauthentication from "../helpers/Userauthentication.js";
import { User } from "../models/User.js";



// ✅ Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
 
 // ✅ Send OTP via Email
 const sendOTP = async(email)=>{
 
 const otp = generateOTP();
 const otpExpiresAt = new Date(Date.now() + 10*60*1000);
 try {
  await sendOTPEmail(email,otp);
  return {otp,otpExpiresAt};
 } catch (error) {
  console.error("Error sending OTP:", error.message);
  throw new Error("Error sending OTP.");
 }
 
 }
 
export const resendOtp = async(req,res)=>{
const {email}= req.body;
if(!email){
  return res.status(400).json({ error: "Email is required" });
}
try {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const { otp, otpExpiresAt } = await sendOTP(email);

  
  // ✅ Update OTP and expiration in the database
  await user.update({ otp, otpExpiresAt });

  res.status(200).json({ message: "OTP sent successfully" });
} catch (error) {
  res.status(500).json({ error: "Error sending OTP" });
}

};


export const register = async (req, res) => {
   const { username,email,password } = req.body;
  
  try {
    const {otp,otpExpiresAt}=await sendOTP(email);
  
    const newUser =  await Userauthentication.register(
      username,
      email,
      password,
      otp,
      otpExpiresAt
    );
   
    res.status(200).json({newUser, message: "User registered. Verify OTP." });
  } catch (error) {
 
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json(error);
  }
};

export const verifyOTP = async(req,res)=>{

const{email,otp}= req.body;
try {
  const user = await User.findOne({where:{email}});
  if(!user){
  return res.status(404).json({error:"User not found"});
  }
  if(user.isVerified){
    return res.status(400).json({ error: "User already verified" });
  
  }
  if (user.otp !== otp || user.otpExpiresAt < new Date()) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }
  user.isVerified=true;
  user.otp=null;
  user.otpExpiresAt=null;
  await user.save();
  res.status(200).json({ message: "Email verified successfully" });
} catch (error) {
  const error_code = await ErrorChecker.error_code(error);
  res.status(error_code).json({ error: "Error verifying OTP" });
}

}
//User login (JWT token)
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  try {
    //check if user exist
    const user = await Userauthentication.getUserByEmail(email);
 
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if(!user.isVerified){
      
      return res.status(401).json({error:"User not verified"});
    }
    if (user.role === "admin" || user.role === "superadmin")
      return res.status(400).json({ error: "User doesn't exist" });
    //match password

    const isMatch = await encryptionservice.checkPassword(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: "User not verified. Please verify OTP." });
    }

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge:7 * 24 * 60 * 60 * 1000,
    }).status(200)
      .json({
        message: "Login succesful",
        user: { id: user.id, username: user.username },
      });
  } catch (error) {
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json(error);
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

export const checkavailability = async (req, res) => {
  const { username, email } = req.body;

  try {
    let usernameExists = false;
    let emailExists = false;
    if (username) {
      const userWithUserName = await User.findOne({ where: { username } });
      usernameExists = !!userWithUserName;
    }
    if (email) {
      const userWithEmail = await User.findOne({ where: { email } });
      emailExists = !!userWithEmail;
    }

    return res.json({
      usernameAvailable: username ? !usernameExists : null,
      emailAvailable: email ? !emailExists : null,
    });
  } catch (error) {
    const error_code = await ErrorChecker.error_code(error);
    res.status(error_code).json(error);
  }
};
