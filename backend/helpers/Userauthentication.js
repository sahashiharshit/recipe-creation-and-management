import { User } from "../models/User.js";
import { Admin } from "../models/Admin.js";
class Userauthentication {
  login = async (email, password) => {};
  register = async (username, email, hashedpassword) => {
    try {
      const user = await User.create({
        username,
        email,
        password: hashedpassword,
      });
      return user;
    } catch (error) {
      throw error;
    }
  };

  getUsers = async () => {};
  getUserById = async (id) => {};
  getUserByEmail = async (email) => {
    try {
        return await User.findOne({where:{email:email}});
    } catch (error) {
        throw error;
    }
  };

 
}
export default new Userauthentication();
