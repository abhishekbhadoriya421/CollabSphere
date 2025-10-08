import { createSlice } from "@reduxjs/toolkit";
import { socket } from "../../utils/socket";

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
            if (!state.isConnected) {
                socket.connect();
                state.isConnected = true;
            }
        },
        disconnectSocket: (state) => {
            if (state.isConnected) {
                socket.disconnect();
                state.isConnected = false;
            }
        }
    }
});


export const { connectSocket, disconnectSocket } = SocketConnectSlice.actions;

export default SocketConnectSlice.reducer;