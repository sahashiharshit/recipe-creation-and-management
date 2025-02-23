import { User } from "../models/User.js";
import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from '../config/awshelper.js';
import { Recipe } from "../models/Recipe.js";

class UserService{

getProfile = async (id) => {
    
    try {
     
    const getProfile = await User.findByPk(id,{attributes:{exclude:['password']}});
    return getProfile;
       
    } catch (error) {
    throw error;    
    }
}

upload = multer({
storage:multerS3({
s3:s3,
bucket:process.env.AWS_S3_BUCKETNAME,
acl:"public-read",
contentType:multerS3.AUTO_CONTENT_TYPE,
key:function(req,file,cb){
cb(null,`profile-images/${req.user.id}-${Date.now()}-${file.originalname}`);
},
}),
});


getMyRecipes = async(id)=>{

try {
    const recipes = await Recipe.findAll({where:{userId:id}});
    return recipes;
} catch (error) {
    throw error;
}
}


}

export default new UserService();