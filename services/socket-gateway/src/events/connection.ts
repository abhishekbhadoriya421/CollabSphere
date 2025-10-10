import io from '../config/socket';

io.on('connection', (socket) => {
    console.log('Connect to socket id: ' + socket.handshake.auth.accessToken);

    socket.on('join_channel', (data) => {
        console.log(data);
    })

    socket.conn.on("close", (reason) => {
        console.log("❌ Connection closed:", socket.id, "Reason:", reason);
    });
    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
    });
})