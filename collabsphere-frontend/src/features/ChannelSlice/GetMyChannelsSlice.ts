import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"

/**
 * id           =>  is a unique channel name between to user
 * channel_type =>  its type of channel like group chat, personal dm message or broadcast message in eniter organization created by admin
 * channel_name =>  its depends on type of channel if its personal dm the user name if group the group name
 * created_by   =>  Who created the channel
 */
interface Channels {
    id: number | null,
    type: 'dm' | 'group' | 'channel' | 'none',
    name: string | '',
    created_by: number | null
}
interface InitailStateResponse {
    message: string,
    status: 'error' | 'success' | 'idel' | 'loading',
    channels: Array<Channels>
}


const initialState: InitailStateResponse = {
    message: '',
    status: 'idel',
    channels: []
}

interface GetChannelApiResponse {
    channel: Array<Channels> | [],
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
                message: (error instanceof Error ? error.message : 'An unknown error occurred'),
                status: 'error',
                channels: []
            })
        }
    }
)

/**
 * Make Get Target User Dm Channel  
 */
interface GetChannelByUserIdRequest {
    accessToken: string | null;
    target_user_id: number | null
}

interface GetChannelByUserResponse extends Channels {
    message: string;
}
export const GetChannelByUserThunk = createAsyncThunk<GetChannelByUserResponse, GetChannelByUserIdRequest, { rejectValue: { message: string } }>(
    'get-channel-by-userid',
    async (req: GetChannelByUserIdRequest, { rejectWithValue }) => {
        try {
            const apiResponse: Response = await fetch(`/api/channel/get-dm-channel/${req.target_user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${req.accessToken}`
                }
            });

            const responseData: GetChannelByUserResponse = await apiResponse.json();

            if (apiResponse.ok) {
                return {
                    message: 'successfully fetch',
                    created_by: responseData.created_by,
                    id: responseData.id,
                    name: responseData.name,
                    type: responseData.type
                }
            } else {
                return rejectWithValue({
                    message: responseData.message
                })
            }

        } catch (err: unknown) {
            return rejectWithValue({
                message: (err instanceof Error ? err.message : 'Unexpected Error')
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
            const newItem: Channels = {
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
                state.status = 'loading';
            })
            .addCase(GetAllChannelThunks.rejected, (state, action) => {
                state.channels = [];
                state.status = 'error';
                if (action.payload?.message) {
                    state.message = action.error.message || 'Unexpected Error';
                } else {
                    state.message = 'Unexpected Error Occured'
                }
            })
            .addCase(GetChannelByUserThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.message = action.payload.message;
                if (action.payload) {
                    state.channels.push({
                        id: action.payload.id,
                        name: action.payload.name,
                        created_by: action.payload.created_by,
                        type: action.payload.type
                    })
                }
            })
            .addCase(GetChannelByUserThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(GetChannelByUserThunk.rejected, (state, action) => {
                state.status = 'error';
                state.message = action.payload?.message || 'Unexpected Error Occured';
            })
    }
});
export const { addChannel } = GetMyChannelSlice.actions;
export default GetMyChannelSlice.reducer;