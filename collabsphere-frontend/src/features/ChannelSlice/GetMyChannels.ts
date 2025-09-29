import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"

/**
 * id           =>  is a unique channel name between to user
 * channel_type =>  its type of channel like group chat, personal dm message or broadcast message in eniter organization created by admin
 * channel_name =>  its depends on type of channel if its personal dm the user name if group the group name
 * created_by   =>  Who created the channel
 */
interface channels {
    id: number | null,
    type: 'dm' | 'group' | 'channel' | 'none',
    name: string | '',
    created_by: number | null
}
interface InitailStateResponse {
    loading: boolean | false
    message: string,
    status: 'error' | 'success' | 'idel',
    channels: Array<channels>
}


const initialState: InitailStateResponse = {
    loading: false,
    message: '',
    status: 'idel',
    channels: []
}

interface GetChannelApiResponse {
    channel: Array<channels> | [],
    status: number,
    message: ''
}

interface GetChannelApiRequest {
    user_id: number,
    accessToken: string
}

export const GetAllChannelThunks = createAsyncThunk<InitailStateResponse, GetChannelApiRequest, { rejectValue: InitailStateResponse }>(
    'user/channel',
    async (user: GetChannelApiRequest, { rejectWithValue }) => {
        try {
            const apiResponse: Response = await fetch('/api/channel/get-user-channel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.accessToken}`
                },
                credentials: 'include',
                body: JSON.stringify({ user_id: user.user_id })
            });

            const responseData: GetChannelApiResponse = await apiResponse.json();
            if (!apiResponse.ok) {
                return rejectWithValue({
                    status: 'error',
                    message: responseData.message,
                    channels: [],
                    loading: false
                })
            } else {
                return {
                    status: 'success',
                    message: responseData.message,
                    channels: responseData.channel,
                    loading: false
                }
            }

        } catch (error: unknown) {
            return rejectWithValue({
                loading: false,
                message: (error instanceof Error ? error.message : 'An unknown error occurred'),
                status: 'error',
                channels: []
            })
        }
    }
)


interface AddChannelPayload {
    channel_id: number | null;
    channel_name: string | '';
    channel_type: 'dm' | 'group' | 'channel' | 'none';
    created_by: number | null;
}

const GetMyChannelSlice = createSlice({
    name: 'getChannel',
    initialState: initialState,
    reducers: {
        addChannel: (state, channelData: PayloadAction<AddChannelPayload>) => {
            const newItem: channels = {
                name: channelData.payload.channel_name,
                id: channelData.payload.channel_id,
                type: channelData.payload.channel_type,
                created_by: channelData.payload.created_by
            };
            state.channels.push(newItem);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(GetAllChannelThunks.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            if (action.payload.status === 'success') {
                state.status = 'success';
                state.channels = action.payload.channels;
            } else {
                state.status = 'error';
                state.channels = [];
            }
        })
            .addCase(GetAllChannelThunks.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetAllChannelThunks.rejected, (state, action) => {
                state.loading = false;
                state.channels = [];
                state.status = 'error';
                if (action.payload?.message) {
                    state.message = action.error.message || 'Unexpected Error';
                } else {
                    state.message = 'Unexpected Error Occured'
                }
            })
    }
});
export const { addChannel } = GetMyChannelSlice.actions;
export default GetMyChannelSlice.reducer;