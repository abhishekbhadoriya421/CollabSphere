import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cleanupEmptyChildNamespaces: true,
    cors: {
        origin: [process.env.SOCKET_CROS_ORIGIN!],
        allowedHeaders: ["authorization"],
        credentials: true,
    },

});
export { app, httpServer };
export default io;