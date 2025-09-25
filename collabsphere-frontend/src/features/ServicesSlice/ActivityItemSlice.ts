import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface Activity {
    id: number,
    icon_class: string,
    content: string,
    is_active: 'ACTIVE' | 'IN-ACTIVE'
}

interface InitailStateResponse {
    loading: boolean | false,
    status: 'idel' | 'success' | 'error',
    activities: Array<Activity> | [],
    message: string
}

const initialState: InitailStateResponse = {
    loading: false,
    status: 'idel',
    activities: [],
    message: ''
}

interface ActivityItemResponse {
    status: 'success' | 'error',
    message: string,
    activities: Array<Activity> | []
}

interface ActivityApiResponse {
    status: number,
    message: string,
    activities: Array<Activity> | []
}

export const ActivityItemThunk = createAsyncThunk<ActivityItemResponse, string, { rejectValue: ActivityItemResponse }>(
    'service-activity',
    async (accessToken: string, { rejectWithValue }) => {
        try {
            const ApiResponce: Response = await fetch('/api/service/get-activity', {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const responseData: ActivityApiResponse = await ApiResponce.json();
            if (!ApiResponce.ok) {
                return {
                    status: 'error',
                    message: responseData.message,
                    activities: []
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
                activities: []
            })
        }
    }
)

const ActivityItemSlice = createSlice({
    name: "activity",
    initialState: initialState,
    reducers: {
        /**
         * change the activity type
         * if id found update the make it current active activity else by default 0th index will be active
         */
        ChangeActivity: (state, action: PayloadAction<number>) => {
            if (state.activities.length > 0) {
                const id = action.payload
                let itemIndex = 0;
                state.activities.forEach((item, indx) => {
                    if (item.id === id) {
                        itemIndex = indx
                    } else {
                        item.is_active = 'IN-ACTIVE';
                    }
                });

                state.activities[itemIndex].is_active = 'ACTIVE';
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(ActivityItemThunk.fulfilled, (state, action) => {
            state.message = action.payload.message;
            state.status = action.payload.status;
            state.loading = false;
            if (action.payload.status === 'success') {
                state.activities = action.payload.activities;
            } else {
                state.activities = []
            }
        })
            .addCase(ActivityItemThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(ActivityItemThunk.rejected, (state, action) => {
                console.log(action.payload)
                state.loading = false;
                state.activities = [];
                if (action.error.message) {
                    state.message = action.error.message
                }
                state.status = 'error'
            })
    }
});

export const { ChangeActivity } = ActivityItemSlice.actions;
export default ActivityItemSlice.reducer;