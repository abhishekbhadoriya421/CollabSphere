import path = require('path');
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname + '../../../../.env') });
import cors from "cors";
import './socket-connection/connection';
import { httpServer, app } from "./config/socket";

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:4000"],
    credentials: true,
}));

const PORT = process.env.SOCKET_PORT ? Number(process.env.SOCKET_PORT) : 4000;

httpServer.listen(PORT, () => {
    console.log(`Scoket Gateway is running on http://localhost:${PORT}`);
});