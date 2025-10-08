import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
    cleanupEmptyChildNamespaces: true,
    cors: {
        origin: ["http://localhost:5173/"],
        allowedHeaders: ["authorization"],
        credentials: true,
    },

});

io.on('connection', (socket) => {
    console.log('Connect to socket id: ' + socket.id);

    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
    });
})

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

httpServer.listen(PORT, () => {
    console.log(`Scoket Gateway is running on http://localhost:${PORT}`);
});