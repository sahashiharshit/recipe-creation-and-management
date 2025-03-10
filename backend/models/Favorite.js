import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
export class Favorite extends Model{}
 Favorite.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    recipeId: {
        type: DataTypes.UUID,
        references: {
            model: 'recipes',
            key: 'id',
        },
        onDelete: 'CASCADE',
    }
},{
sequelize,
modelName:'Favorite',
tableName:'favorite',
timestamps:true,

});
