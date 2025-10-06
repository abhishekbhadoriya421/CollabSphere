import { createSlice } from "@reduxjs/toolkit";

interface InitailState {
    channel_id: number | null;
    channel_name: string | '';
}

const initailState: InitailState = {
    channel_id: null,
    channel_name: ''
}

const ChatBoxSlice = createSlice({
    name: 'chat-box',
    initialState: initailState,
    reducers: {
        getActiveChannel: (state, action) => {
            if (action.payload.channel_id) {
                state.channel_id = action.payload.channel_id
                state.channel_name = action.payload.channel_name
            }
        }
    }
});

export const { getActiveChannel } = ChatBoxSlice.actions;
export default ChatBoxSlice.reducer;