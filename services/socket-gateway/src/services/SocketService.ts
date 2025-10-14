import { Socket, Server } from "socket.io";
import UserCacheService from "./UserCacheService";
import ChannelCacheService from "./ChannelCacheService";
import ChatEventHandler from "../event-handler/chat/ChatEventHandler";
export default class SocketService {
    private io: Server;
    private cacheObject: UserCacheService;
    public socket: Socket | undefined;
    private chatEvenHandlerObject: ChatEventHandler = ChatEventHandler.getInstance();;
    constructor(io: Server) {
        this.io = io;
        this.initializeSocketHandlers();
        this.cacheObject = new UserCacheService();
    }

    private initializeSocketHandlers = (): void => {
        this.io.on('connection', (socket) => {
            this.socket = socket;
            const { user_id } = socket.data;
            const socket_id = socket.id;
            this.cacheObject.cacheUser(user_id, socket_id, Date.now());

            socket.on('join_channel', (data) => {
                const { channel_id, channel_name, channel_type } = data;
                ChannelCacheService.cacheChannel(
                    {
                        channelId: channel_id,
                        channelName: channel_name,
                        channelType: channel_type,
                        userId: user_id,
                        scoketId: socket_id
                    }
                );
                socket.join(channel_id);
                socket.to(channel_id).emit('user_joined', { user_id });
            });

            socket.on('send_message', (data) => {
                this.chatEvenHandlerObject.sendMessage(socket, data.channel_id, data.content, data.sender_id, data.message_term_id);
                this.chatEvenHandlerObject.saveNewMessageEvent(this.io, data.channel_id, data.content, data.sender_id, data.message_term_id);
            });

            socket.on('disconnect', async () => {
                await this.chatEvenHandlerObject.handleDisconnect(socket);
                console.log('disconnected: ' + socket.id)
            });
        });

    }




}