import { Sequelize } from 'sequelize';
import {configDotenv} from 'dotenv';
configDotenv();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port:process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions:{ssl:false},
    logging: false,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

connectDB();

export default sequelize;
