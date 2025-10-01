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
    user: MembershipObject | null
}

const initialState: InitialState = {
    status: 'idle',
    user: null,
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
                    user: responseData.membership,
                    message: responseData.message
                }
            } else {
                return rejectWithValue({
                    status: 'error',
                    user: null,
                    message: responseData.message
                })
            }
        } catch (err: unknown) {
            return rejectWithValue({
                status: 'error',
                message: (err instanceof Error ? err.message : 'An unknown error occurred'),
                user: null
            })
        }
    }
);

interface UserDeleteRequest {
    user_id: number,
    accessToken: string | null
}

interface UserDeleteResponse {
    status: 'success' | 'error',
    message: string | ''
}

interface UserDeleteAPIResponse {
    status: number,
    message: string
}


export const DeleteUserThunk = createAsyncThunk<UserDeleteResponse, UserDeleteRequest, { rejectValue: UserDeleteResponse }>(
    'user-delete',
    async (req: UserDeleteRequest, { rejectWithValue }) => {
        try {
            const apiResponse: Response = await fetch('/api/organization/delete-user', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${req.accessToken}`,
                },
                body: JSON.stringify(req.user_id)
            });

            const responseData: UserDeleteAPIResponse = await apiResponse.json();

            if (apiResponse.ok) {
                return {
                    status: 'success',
                    message: responseData.message
                }
            } else {
                return rejectWithValue({
                    status: 'error',
                    message: responseData.message
                });
            }
        } catch (err: unknown) {
            console.log(err)
            return rejectWithValue({
                status: 'error',
                message: 'Unexpected Error Occured'
            })
        }
    }
)
const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(AddUserThunk.fulfilled, (state, action) => {
            if (action.payload.status === 'success') {
                state.status = 'success';
                state.message = action.payload.message;
                state.user = action.payload.user;
            } else {
                state.status = 'error';
                state.message = action.payload.message;
                state.user = null;
            }
        })
            .addCase(AddUserThunk.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(AddUserThunk.rejected, (state, action) => {
                state.status = 'error';
                state.message = action.payload?.message || 'Unexpected error while adding user';
                state.user = null;
            })
    }
});



export default userSlice.reducer;