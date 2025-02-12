import { User } from "../models/User.js";

class UserService{

getProfile = async (id) => {
    
    try {
     
    const getProfile = await User.findByPk(id,{attributes:{exclude:['password']}});
    return getProfile;
       
    } catch (error) {
    throw error;    
    }
}



}

export default new UserService();