import { DataTypes } from 'sequelize';
import { define } from '../config/database.js';

const Favorite = define('Favorite', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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

export default Favorite;