import { User } from "../models/User.js";

class Userauthentication {
 
  register = async (username, email, password,otp,otpExpiresAt) => {
    try {
      const user = await User.create({
        username,
        email,
        password,
        otp,
        otpExpiresAt,
        isVerified:false,
      });
      return user;
    } catch (error) {
      throw error;
    }
  };

 
  getUserByEmail = async (email) => {
    try {
        return await User.findOne({where:{email}});
    } catch (error) {
        throw error;
    }
  };

 
}
export default new Userauthentication();
