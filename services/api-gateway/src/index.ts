import path = require('path');
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname + '../../../../.env') });
import express from 'express';
import cors from 'cors';
import router from './router/index';
import db from './config/mongodb';
import cookieParser from "cookie-parser";
import { or } from 'sequelize';


// join root env file

const app = express();
/**
 * connect db
 */
db();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
// Dynamic CORS config
const allowedOrigins = [
    "http://localhost:5173", // frontend
    "http://localhost:4000", // socket gateway
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (server-to-server requests, curl, Postman, etc.)
        if (!origin) return callback(null, false);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`API Gateway is running on http://localhost:${PORT}`);
});