import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface MembershipObject {
    id: number | null;
    user_id: number | null;
    organization_id: number | null;
    role: 'Admin' | 'Member' | 'Guest';
    created_at: Date | null;
    updated_at: Date | null;
    create_by: number | null;
    updated_by: number | null
}

interface InitialState {
    status: 'idle' | 'loading' | 'success' | 'error',
    message: string | ''
    membership: MembershipObject | null
}

const initialState: InitialState = {
    status: 'idle',
    membership: null,
    message: ''
}

interface User {
    role: string;
    email: string;
}

interface AddUserRequest {
    user: User,
    accessToken: string
}

interface AddUserApiResponse {
    status: number,
    message: string | ''
    membership: MembershipObject | null
}

export const AddUserThunk = createAsyncThunk<InitialState, AddUserRequest, { rejectValue: InitialState }>(
    'user-add-user',
    async (request: AddUserRequest, { rejectWithValue }) => {
        try {
            const apiResponse: Response = await fetch('/api/organization/add-user', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${request.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request.user)
            });

            const responseData: AddUserApiResponse = await apiResponse.json();
            if (apiResponse.ok) {
                return {
                    status: 'success',
                    membership: responseData.membership,
                    message: responseData.message
                }
            } else {
                return rejectWithValue({
                    status: 'error',
                    membership: null,
                    message: responseData.message
                })
            }
        } catch (err: unknown) {
            return rejectWithValue({
                status: 'error',
                message: (err instanceof Error ? err.message : 'An unknown error occurred'),
                membership: null
            })
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(AddUserThunk.fulfilled, (state, action) => {
            if (action.payload.status === 'success') {
                state.status = 'success';
                state.message = action.payload.message;
                state.membership = action.payload.membership;
            } else {
                state.status = 'error';
                state.message = action.payload.message;
                state.membership = null;
            }
        })
            .addCase(AddUserThunk.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(AddUserThunk.rejected, (state, action) => {
                state.status = 'error';
                state.message = action.payload?.message || 'Unexpected error while adding user';
                state.membership = null;
            })
    }
});



export default userSlice.reducer;