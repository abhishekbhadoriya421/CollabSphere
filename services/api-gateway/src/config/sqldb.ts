import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_PASSWORD,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'collabsphere',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;