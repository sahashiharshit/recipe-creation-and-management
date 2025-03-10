import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
export class Categories extends Model{}

Categories.init({

id:{
type:DataTypes.UUID,
defaultValue:DataTypes.UUIDV4,
primaryKey:true,
},
category_name:{
type:DataTypes.STRING,
allowNull:false,
unique:true
},

},{
sequelize,
modelName:"Categories",
tableName:'categories',
timestamps:true,
});