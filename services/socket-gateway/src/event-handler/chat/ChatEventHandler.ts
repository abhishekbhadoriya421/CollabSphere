import io from "../../config/socket";
export default class ChatEventHandler {
    static instance: ChatEventHandler;

    private constructor() {
        // Private constructor to prevent direct instantiation
    }

    public static getInstance(): ChatEventHandler {
        if (!this.instance) {
            this.instance = new ChatEventHandler();
        }
        return this.instance;
    }

    public joinChannel(socket: any, channel_id: string) {
        socket.join(channel_id);
        console.log(`User with socket ID ${socket.id} joined channel ${channel_id}`);
    }
}

