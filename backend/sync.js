import sequelize from "./config/database.js";
import {User,Recipe,Review,Follow,Favorite,Categories} from './config/associations.js';

(async()=>{

    try{
        await sequelize.sync({force:true});
        await User.sync();
        await Recipe.sync();
        await Categories.sync();
        await Favorite.sync();
        await Review.sync();
        await Follow.sync();
        console.log('Database Synchronized');
    }catch(error){
        console.error('Unable to synchronize database:',error);
    }
}
    )();