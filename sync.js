import sequelize from "./config/database.js";
import {User,Recipe,Review,Admin,Follow,Favorite} from './config/associations.js';

(async()=>{

    try{
        await sequelize.sync({force:true});
        console.log('Database Synchronized');
    }catch(error){
        console.error('Unable to synchronize database:',error);
    }
}
    );