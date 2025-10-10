import path = require('path');
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname + '../../../../.env') });
import { createServer } from "http";
import { Server } from "socket.io";
const httpServer = createServer();
const io = new Server(httpServer, {
    cleanupEmptyChildNamespaces: true,
    cors: {
        origin: [process.env.SOCKET_CROS_ORIGIN!],
        allowedHeaders: ["authorization"],
        credentials: true,
    },

});


io.on('connection', (socket) => {
    console.log('Connect to socket id: ' + socket.handshake.auth.accessToken);

    socket.on('join_channel', (data) => {
        console.log('This is Joined')
        console.log(data);
    })

    socket.conn.on("close", (reason) => {
        console.log("❌ Connection closed:", socket.id, "Reason:", reason);
    });
    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
    });
})

const PORT = process.env.SOCKET_PORT ? Number(process.env.SOCKET_PORT) : 4000;

httpServer.listen(PORT, () => {
    console.log(`Scoket Gateway is running on http://localhost:${PORT}`);
});