import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';

const caPath = path.resolve(__dirname, '../certs/ca.pem');
const sequelize = new Sequelize(
    process.env.DB_PROD_NAME!,
    process.env.DB_PROD_USER!,
    process.env.DB_PROD_PASS,
    {
        host: process.env.DB_PROD_HOST,
        port: 3306,
        dialect: 'mysql',
        logging: false,
    }
);

export default sequelize;