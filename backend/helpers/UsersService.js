import { User } from "../models/User";

class UserService{

getProfile = async (id) => {
    
    try {
     
    const getProfile = await User.findByPk(id);
    return getProfile;
       
    } catch (error) {
    throw error;    
    }
}


}

export default new UserService();