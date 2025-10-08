import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createConnectSocket, getSocket } from "../../utils/socket";

interface InitailState {
    isConnected: boolean;
}

const initialState: InitailState = {
    isConnected: false
}

interface PayloadData {
    accessToken: string | null
}
const SocketConnectSlice = createSlice({
    name: 'socket/connect',
    initialState: initialState,
    reducers: {
        connectSocket: (_, action: PayloadAction<PayloadData>) => {
            if (action.payload.accessToken) {
                createConnectSocket(action.payload.accessToken);
            }
        },
        disconnectSocket: (state) => {
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