import { Sequelize } from 'sequelize';

// const db = mysql.createPool({
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME || 'collabsphere',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// export default db;

const sequelize = new Sequelize(
    process.env.DB_NAME || 'collabsphere',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql'
    }
)

export default sequelize;