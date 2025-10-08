import { createServer } from "http";
import { Server } from "socket.io";
const httpServer = createServer();
const io = new Server(httpServer, {
    cleanupEmptyChildNamespaces: true,
    cors: {
        origin: ["http://localhost:5173"],
        // allowedHeaders: ["authorization"],
        // credentials: true,
    },

});


// io.use((socket, next) => {
//   const token = socket.handshake.auth?.token;
//   if (!token) {
//     console.log("❌ No token provided");
//     return next(new Error("Authentication error"));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     socket.data.user = decoded;
//     console.log("✅ Authenticated user:", decoded.user_id);
//     next();
//   } catch (err) {
//     console.log("❌ Invalid token");
//     next(new Error("Authentication error"));
//   }
// });


io.on('connection', (socket) => {
    console.log('Connect to socket id: ' + socket.handshake.auth.accessToken);

    socket.on('join_channel', (data) => {
        console.log('This is Joind')
        console.log(data);
    })

    socket.conn.on("close", (reason) => {
        console.log("❌ Connection closed:", socket.id, "Reason:", reason);
    });
    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
    });
})

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

httpServer.listen(PORT, () => {
    console.log(`Scoket Gateway is running on http://localhost:${PORT}`);
});