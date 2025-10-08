import { io, Socket } from 'socket.io-client';

interface UserTyping {
    user_id: number;
    channel_id: number;
}

interface UserReceiveMessage {
    content: string;
    sender_id: number;
    channel_id: number;
}
interface ServerToClientEvent {
    receive_message: (data: UserReceiveMessage) => void
    user_typing: (data: UserTyping) => void
}

interface ClientToServerEvent {
    join_channel: (data: { channel_id: number }) => void;
    typing: (data: UserTyping) => void;
    send_message: (data: UserReceiveMessage) => void
}

let socket: Socket<ServerToClientEvent, ClientToServerEvent> | null = null;
// export const socket: Socket<ServerToClientEvent, ClientToServerEvent> = io('http://localhost:4000', {
//     autoConnect: false,
//     transports: ["websocket"],
// });

export const createSocket = (accessToken: string) => {
    socket = io('http://localhost:4000', {
        autoConnect: false,
        transports: ['websocket'],
        auth: {
            accessToken
        }
    });

    return socket;
}


export const getSocket = (): Socket<ServerToClientEvent, ClientToServerEvent> | null => socket;