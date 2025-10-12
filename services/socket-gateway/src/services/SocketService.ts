import { Socket, Server } from "socket.io";
import UserCacheService from "./UserCacheService";
export default class SocketService {
    private io: Server;
    private cacheObject: UserCacheService;
    public socket: Socket | undefined;
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

            socket.on('disconnect', async () => {
                await this.handleDisconnect(socket);
            });
        });

    }


    private async handleDisconnect(socket: Socket): Promise<void> {
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