import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";

interface Message {
    id: string;
    channelId: number;
    senderId: number;
    text: string;
    attachments?: Array<{
        url: string;
        name?: string;
        size?: number;
        mime?: string;
    }>;
    sequence?: number;
    read_by?: number[];
    status?: 'sent' | 'delivered' | 'read';
    createdAt?: Date;
    updatedAt?: Date;
}

interface User {
    id: number;
    username: string;
}
interface InitailState {
    channel_id: number | null;
    channel_name: string | '';
    channel_type: 'dm' | 'group' | 'channel' | 'none';
    messagesBox: Message[];
    status: 'idle' | 'loading' | 'success' | 'error';
    userIds: number[];
    members: Array<User>[] | [];
}

const initailState: InitailState = {
    channel_id: null,
    channel_name: '',
    channel_type: 'none',
    messagesBox: [],
    status: 'idle',
    userIds: [],
    members: [],
    // online:
}

interface GetAllMessagesByChannelIdResponse {
    message: string
    status: boolean;
    messagesBox: Message[];
    channel_name: string;
    channel_type: 'dm' | 'group' | 'channel' | 'none';
    userIds: number[];
    members: Array<User>[];
}

interface GetAllMessagesByChannelIdRequest {
    channel_id: number | null;
    accessToken: string | null;
}

interface GetAllMessagesByChannelIdAPIResponse {
    message: string
    status: number;
    messagesBox: Message[];
    channel_name: string;
    channel_type: 'dm' | 'group' | 'channel' | 'none';
    userIds: number[];
    members: Array<User>[];
}
export const getAllMessagesByChannelId = createAsyncThunk<GetAllMessagesByChannelIdResponse, GetAllMessagesByChannelIdRequest, { rejectValue: string }>
    ('chat-box/getAllMessagesByChannelId', async (req: GetAllMessagesByChannelIdRequest, { rejectWithValue }) => {
        const { channel_id, accessToken } = req;
        if (!channel_id || !accessToken) {
            return rejectWithValue('Invalid channel id or access token');
        }
        try {
            const response: Response = await fetch(`/api/chat/message/${channel_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data: GetAllMessagesByChannelIdAPIResponse = await response.json();
            if (!response.ok && response.status !== 200) {
                return rejectWithValue(data.message || 'Failed to fetch messages');
            }

            return {
                message: data.message,
                status: true,
                messagesBox: data.messagesBox,
                channel_name: data.channel_name,
                channel_type: data.channel_type,
                userIds: data.userIds,
                members: data.members
            };
        } catch (error) {
            return rejectWithValue((error instanceof Error) ? error.message : 'Something went wrong');
        }
    });

const ChatBoxSlice = createSlice({
    name: 'chat-box',
    initialState: initailState,
    reducers: {
        setActiveChannel: (state, action) => {
            if (action.payload.channel_id) {
                state.channel_id = action.payload.channel_id;
                state.status = 'idle';
            }
        },
        setMessage: (state, action) => {
            const newMessage: Message = {
                text: action.payload.content,
                channelId: action.payload.channel_id,
                senderId: action.payload.sender_id,
                id: action.payload.message_temp_id,
            }
            state.messagesBox.push(newMessage);
        },
        updateTempMessageId: (state, action) => {
            const temp_message_id = action.payload.temp_message_id;
            const message_id = action.payload.message_id;
            state.messagesBox.forEach(msg => {
                if (msg.id == temp_message_id) {
                    msg.id = message_id;
                }
            });
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllMessagesByChannelId.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(getAllMessagesByChannelId.fulfilled, (state, action) => {
            state.status = 'success';
            state.messagesBox = action.payload.messagesBox;
            state.channel_name = action.payload.channel_name;
            state.channel_type = action.payload.channel_type;
            state.userIds = action.payload.userIds;
            state.members = action.payload.members;
        }
        );
        builder.addCase(getAllMessagesByChannelId.rejected, (state, action) => {
            state.status = 'error';
            state.messagesBox = [];
            console.error('Error fetching messages:', action.payload);
        });
    }
});

export const { setActiveChannel, setMessage, updateTempMessageId } = ChatBoxSlice.actions;
export default ChatBoxSlice.reducer;