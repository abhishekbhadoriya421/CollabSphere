import { createServer } from "http";
import { Server } from "socket.io";
export const httpServer = createServer();

const io = new Server(httpServer, {
    cleanupEmptyChildNamespaces: true,
    cors: {
        origin: [process.env.SOCKET_CROS_ORIGIN!],
        allowedHeaders: ["authorization"],
        credentials: true,
    },

});

export default io;