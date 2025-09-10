import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    return res.status(200).send('API Gateway is running');
});

app.listen(PORT, () => {
    console.log(`Scoket Gateway is running on http://localhost:${PORT}`);
});