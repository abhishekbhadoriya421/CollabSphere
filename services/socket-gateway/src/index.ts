import path = require('path');
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname + '../../../../.env') });
import { httpServer } from './config/socket';
import './events/connection';


const PORT = process.env.SOCKET_PORT ? Number(process.env.SOCKET_PORT) : 4000;

httpServer.listen(PORT, () => {
    console.log(`Scoket Gateway is running on http://localhost:${PORT}`);
});