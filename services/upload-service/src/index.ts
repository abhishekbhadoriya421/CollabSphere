import express, { Request, Response } from 'express';


const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

app.get('/', (req: Request, res: Response) => {
    res.send('Upload Service is running');
});

app.listen(PORT, () => {
    console.log(`Uploads Gateway is running on http://localhost:${PORT}`);
});