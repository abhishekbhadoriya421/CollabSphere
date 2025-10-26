import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
// const sequelize = new Sequelize(
//     process.env.DB_NAME!,
//     process.env.DB_USER!,
//     process.env.DB_PASSWORD,
//     {
//         host: process.env.DB_HOST,
//         dialect: 'mysql'
//     }
// )
const caPath = path.resolve(__dirname, '../certs/ca.pem');
const sequelize = new Sequelize(
    process.env.DB_PROD_NAME!,
    process.env.DB_PROD_USER!,
    process.env.DB_PROD_PASS,
    {
        host: process.env.DB_PROD_HOST,
        port: 4000,
        dialect: 'mysql',
        dialectOptions: {
            ssl: {

                ca: fs.readFileSync(caPath),
                rejectUnauthorized: true,
            },
        },
        logging: false,
    }
);

export default sequelize;