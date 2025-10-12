import path = require('path');
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname + '../../../../.env') });
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import SocketService from './services/SocketService';
import Jwt, { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';
const app = express();

const httpServer = createServer(app);

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:4000"],
    credentials: true,
}));


const io = new Server(httpServer, {
    cleanupEmptyChildNamespaces: true,
    cors: {
        origin: [process.env.SOCKET_CROS_ORIGIN!],
        allowedHeaders: ["authorization"],
        credentials: true,
    },

});

/**
 * Authenticate User On Every Request
 */
io.use(async (socket, next) => {
    const accessToken = socket.handshake.auth.accessToken;
    if (!accessToken) {
        return next(new Error("Authentication error: Access token is required"));
    }
    try {
        const decoded = Jwt.verify(accessToken, process.env.JWT_SECRET as string) as JwtPayload;
        socket.data.user_id = decoded.user_id;
        return next();
    } catch (jwtError) {
        try {
            const validate = await axios.post('http://localhost:8080/api/auth/validate-token',
                { accessToken }
            );
            if (validate.data.status === 200) {
                socket.data.user_id = validate.data.user_id;
                return next();
            } else {
                return next(new Error(socket.data.message));
            }
        } catch (error) {
            return next(new Error("Authentication error: Token validation failed"));
        }
    }
});

const socketService = new SocketService(io);

const PORT = process.env.SOCKET_PORT ? Number(process.env.SOCKET_PORT) : 4000;

httpServer.listen(PORT, () => {
    console.log(`Scoket Gateway is running on http://localhost:${PORT}`);
});