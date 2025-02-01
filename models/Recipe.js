import { DataTypes } from 'sequelize';
import { define } from '../config/database.js';


const Recipe = define('Recipe', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    ingredients: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    instructions: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    cookingTime: {
        type: DataTypes.INTEGER, // in minutes
        allowNull: false,
    },
    servings: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userId: {
        type: DataTypes.UUID,
        references: {
            model: 'Users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    }
});
export default Recipe;