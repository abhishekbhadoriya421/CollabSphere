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
import cookieParser from 'cookie-parser';
import cookie from 'cookie';
const app = express();
app.use(cookieParser());
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
    const cookiesHeader = socket.handshake.headers.cookie;
    if (!cookiesHeader) {
        return next(new Error("Authentication error: No cookies provided"));
    }

    const cookies = cookie.parse(cookiesHeader);
    const refreshToken = cookies.refreshToken;
    if (!refreshToken) {
        return next(new Error("Authentication error: Refresh token missing"));
    }

    try {
        const decoded = Jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;
        socket.data.user_id = decoded.user_id;
        socket.data.refresh_token = refreshToken;
        return next();
    } catch (jwtError) {
        try {
            const validate = await axios.post('http://localhost:8080/api/auth/validate-token',
                { refreshToken }
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