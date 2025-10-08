import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import router from './router/index';
import db from './config/mongodb';
import cookieParser from "cookie-parser";
import path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
/**
 * connect db
 */
db();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`API Gateway is running on http://localhost:${PORT}`);
});