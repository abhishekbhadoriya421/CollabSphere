import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


interface InitailStateResponse {
    loading: boolean | false,
    status: 'idel' | 'success' | 'error',
    activities: object | null,
    message: string
}

const initialState: InitailStateResponse = {
    loading: false,
    status: 'idel',
    activities: null,
    message: ''
}

interface ActivityItemResponse {
    status: 'success' | 'error',
    message: string,
    activities: object | null
}

interface ActivityApiResponse {
    status: number,
    message: string,
    activities: object | null
}

export const ActivityItemThunk = createAsyncThunk<ActivityItemResponse, void, { rejectValue: ActivityItemResponse }>(
    'service-activity',
    async (_, { rejectWithValue }) => {
        try {
            const ApiResponce: Response = await fetch('/api/service/get-activity', {
                method: 'GET',
                credentials: "include"
            });

            const responseData: ActivityApiResponse = await ApiResponce.json();
            console.log(responseData);
            if (!ApiResponce.ok) {
                return {
                    status: 'error',
                    message: responseData.message,
                    activities: null
                }
            }
            return {
                status: 'success',
                message: responseData.message,
                activities: responseData.activities
            }
        } catch (error: unknown) {
            return rejectWithValue({
                status: 'error',
                message: (error instanceof Error ? error.message : 'An unknown error occurred'),
                activities: null
            })
        }
    }
)

const ActivityItemSlice = createSlice({
    name: "activity",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(ActivityItemThunk.fulfilled, (state, action) => {
            state.message = action.payload.message;
            state.status = action.payload.status;
            state.loading = false;
            if (action.payload.status === 'success') {
                state.activities = action.payload.activities;
            } else {
                state.activities = {}
            }
        })
            .addCase(ActivityItemThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(ActivityItemThunk.rejected, (state, action) => {
                state.loading = false;
                state.activities = {};
                if (action.error.message) {
                    state.message = action.error.message
                }
                state.status = 'error'
            })
    }
});


export default ActivityItemSlice.reducer;