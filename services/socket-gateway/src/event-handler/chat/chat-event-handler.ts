export const joinChannel = (socket: any, channel_id: string) => {
    socket.join(channel_id);
    console.log(`User with ID: ${socket.id} joined channel: ${channel_id}`);
    socket.to(channel_id).emit('user_joined', { userId: socket.id, channel_id });
}