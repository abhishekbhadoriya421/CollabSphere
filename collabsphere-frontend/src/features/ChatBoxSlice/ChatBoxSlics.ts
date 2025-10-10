import { createSlice } from "@reduxjs/toolkit";

interface InitailState {
    channel_id: number | null;
    channel_name: string | '';
    channel_type?: 'dm' | 'group' | 'channel' | 'none';
}

const initailState: InitailState = {
    channel_id: null,
    channel_name: '',
    channel_type: 'none'
}

const ChatBoxSlice = createSlice({
    name: 'chat-box',
    initialState: initailState,
    reducers: {
        setActiveChannel: (state, action) => {
            if (action.payload.channel_id) {
                state.channel_id = action.payload.channel_id;
            }
        }
    }
});

export const { setActiveChannel } = ChatBoxSlice.actions;
export default ChatBoxSlice.reducer;