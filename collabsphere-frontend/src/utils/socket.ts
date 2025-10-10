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
    receive_message: (data: UserReceiveMessage) => void;
    user_typing: (data: UserTyping) => void;
    user_joined: (data: { userId: string, channel_id: number }) => void;
}

interface ClientToServerEvent {
    join_channel: (data: { channel_id: number }) => void;
    typing: (data: UserTyping) => void;
    send_message: (data: UserReceiveMessage) => void
}

let socket: Socket<ServerToClientEvent, ClientToServerEvent> | null = null;
const createSocket = (accessToken: string) => {
    socket = io('http://localhost:4000', {
        autoConnect: false,
        transports: ['websocket'],
        auth: {
            accessToken
        }
    });


    socket.on('connect_error', (error) => {
        console.error('Connection error:', error.message);

        if (error.message.includes('Authentication error')) {
            // Token is invalid
            console.error('Authentication failed - redirecting to login');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    });

    socket.on('connect', () => {
        console.log('✅ Successfully authenticated with socket server');
    });


    return socket;
}

export const createConnectSocket = (accessToken: string) => {
    if (!socket) {
        socket = createSocket(accessToken);
    }
    socket.connect();
    return socket;
}


export const getSocket = (): Socket<ServerToClientEvent, ClientToServerEvent> | null => socket;