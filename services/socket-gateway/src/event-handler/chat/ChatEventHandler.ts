import { Socket, Server } from "socket.io";
import UserCacheService from "../../services/UserCacheService";
import ChannelCacheService from "../../services/ChannelCacheService";
export default class ChatEventHandler {
    static instance: ChatEventHandler;
    private cacheObject: UserCacheService;
    private constructor() {
        // Private constructor to prevent direct instantiation
        this.cacheObject = new UserCacheService();
    }

    public static getInstance(): ChatEventHandler {
        if (!this.instance) {

            this.instance = new ChatEventHandler();
        }
        return this.instance;
    }

    public joinChannel(socket: Socket, channel_id: string) {
        socket.join(channel_id);
        console.log(`User with socket ID ${socket.id} joined channel ${channel_id}`);
    }

    public sendMessage(socket: Socket, channel_id: string, content: string, sender_id: number, message_temp_id: number) {
        socket.to(channel_id).emit('receive_message', { channel_id: channel_id, content: content, sender_id: sender_id, message_temp_id: message_temp_id });
    }

    public async handleDisconnect(socket: Socket): Promise<void> {
        try {
            const user = await this.cacheObject.getUserBySocketId(socket.id);
            if (user) {
                await this.cacheObject.removeUser(user.userId);
                console.log(`✅ User ${user.userId} disconnected and removed from cache`);
            }
        } catch (error) {
            console.error('Error handling disconnect:', error);
        }
    }
}

