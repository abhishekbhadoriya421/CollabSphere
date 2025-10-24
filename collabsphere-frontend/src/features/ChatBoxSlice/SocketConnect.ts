import { createSlice } from "@reduxjs/toolkit";
import { createConnectSocket, getSocket } from "../../utils/socket";

interface InitailState {
    isConnected: boolean;
}

const initialState: InitailState = {
    isConnected: false
}

const SocketConnectSlice = createSlice({
    name: 'socket/connect',
    initialState: initialState,
    reducers: {
        connectSocket: (state) => {
            if (state.isConnected) {
                console.log('Socket is already connected');
                return;
            }
            console.log('Connecting to socket...');
            createConnectSocket();
            state.isConnected = true;
        },
        disconnectSocket: (state) => {
            console.log('Disconnecting socket...');
            if (state.isConnected) {
                const socket = getSocket();
                if (socket) {
                    socket.disconnect();
                }
                state.isConnected = false;
            }
        }
    }
});


export const { connectSocket, disconnectSocket } = SocketConnectSlice.actions;

export default SocketConnectSlice.reducer;