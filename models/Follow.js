
import { DataTypes, Model } from 'sequelize';
import sequelize  from '../config/database.js';
export class Follow extends Model{}
 Follow.init ( {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    followerId: {
        type: DataTypes.UUID,
        references: {
            model: 'User',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    followingId: {
        type: DataTypes.UUID,
        references: {
            model: 'User',
            key: 'id',
        },
        onDelete: 'CASCADE',
    }
},{
sequelize,
modelName:'Follow',
tableName:'Follow',
timestamps:true,
});
