import { DataTypes } from 'sequelize';
import { define } from '../config/database.js';


const Admin = define('Admin', {
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
    }
});



export default Admin;
