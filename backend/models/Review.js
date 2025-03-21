import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
export class Review extends Model{}

Review.init( {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    rating: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
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
modelName:'Review',
tableName:'reviews',
timestamps:true,
});