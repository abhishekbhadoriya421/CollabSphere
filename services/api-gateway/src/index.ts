import express from 'express';
import router from './router/index';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db';

const app = express();
dotenv.config();
/**
 * connect db
 */
db();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`API Gateway is running on http://localhost:${PORT}`);
});