import { io, Socket } from 'socket.io-client';
import { type ServerToClientEvent } from './ServerToClientEvents';
import { type ClientToServerEvent } from './ClientToServerEvents';

let socket: Socket<ServerToClientEvent, ClientToServerEvent> | null = null;
const createSocket = (accessToken: string) => {
    socket = io('http://localhost:4000', {
        autoConnect: false,
        transports: ['websocket'],
        withCredentials: true,
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
            window.location.href = '/auth/site/login';
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