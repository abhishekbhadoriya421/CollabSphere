import { Socket, Server } from "socket.io";
import UserCacheService from "../../services/UserCacheService";
import axios from 'axios';

interface SaveNewMessageApiResponse {
    status: number;
    message: string;
    message_id: string;
}
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
        console.log(`User with socket ID ${socket.id} joined channel ${channel_id}`);
    }

    public sendMessage(socket: Socket, channel_id: string, content: string, sender_id: number, message_temp_id: string) {
        socket.to(channel_id).emit('receive_message', { channel_id: channel_id, content: content, sender_id: sender_id, message_temp_id: message_temp_id });
    }

    public async saveNewMessageEvent(io: Server, socket: Socket, channel_id: string, content: string, sender_id: number, message_temp_id: string) {
        const refreshToken = socket.data.refresh_token;
        try {
            const response = await axios.post('http://localhost:8080/api/chat/save-new-message',
                {
                    sender_id: sender_id,
                    content: content,
                    channel_id: channel_id
                }, {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                io.to(channel_id).emit('message_saved', {
                    message_temp_id: message_temp_id,
                    channel_id: channel_id,
                    message_id: response.data.message_id
                });
            } else {
                throw new Error(response.data.message)
            }

        } catch (err) {
            console.log(err);
        }
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

    public async sendUserReaction(socket: Socket, reactor_id: number, channel_id: string, message_id: string, react: string) {
        console.log(reactor_id, ' ' + channel_id + " " + message_id + " " + react)
        socket.to(channel_id).emit('receive_user_reaction', {
            reactor_id: reactor_id,
            message_id: message_id,
            react: react,
            channel_id: channel_id
        });
    }
}

