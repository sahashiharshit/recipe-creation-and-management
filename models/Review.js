import { DataTypes } from 'sequelize';
import { define } from '../config/database.js';


const Review = define('Review', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    rating: {
        type: DataTypes.INTEGER,
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
            model: 'Users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    recipeId: {
        type: DataTypes.UUID,
        references: {
            model: 'Recipes',
            key: 'id',
        },
        onDelete: 'CASCADE',
    }
});
export default Review;