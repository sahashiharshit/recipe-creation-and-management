import { DataTypes, Model } from 'sequelize';
import  sequelize  from '../config/database.js';

export class Admin extends Model{}

Admin.init( {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username:{
    type:DataTypes.STRING,
    allowNull:false,
    unique:true,
    },
    password:{
    type:DataTypes.STRING,
    allowNull:false,
    },
    
},{
sequelize,
modelName:'Admin',
tableName:'admins',
timestamps:true,
});


