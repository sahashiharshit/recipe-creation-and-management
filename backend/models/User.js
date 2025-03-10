import { DataTypes, Model } from 'sequelize';
import  sequelize  from '../config/database.js';

export class User extends Model{}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isApproved:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
    },
    
},{
    sequelize,
    modelName:"User",
    tableName:'users',
    timestamps:true,
});

