import sequelize from "./config/database.js";
import {User,Recipe,Review,Admin,Follow,Favorite} from './config/associations.js';

(async()=>{

    try{
        await sequelize.sync({alter:true});
        await User.sync();
        await Admin.sync();
        await Recipe.sync();
        await Favorite.sync();
        await Review.sync();
        await Follow.sync();
        console.log('Database Synchronized');
    }catch(error){
        console.error('Unable to synchronize database:',error);
    }
}
    )();