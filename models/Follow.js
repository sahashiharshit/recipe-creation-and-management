
import { DataTypes } from 'sequelize';
import { define } from '../config/database.js';

const Follow = define('Follow', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    followerId: {
        type: DataTypes.UUID,
        references: {
            model: 'Users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    followingId: {
        type: DataTypes.UUID,
        references: {
            model: 'Users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    }
});

export default Follow;