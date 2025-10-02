import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface UserList {
    user_id: number | null;
    username: string | '';
    email: string | '';
    gender: 'MALE' | 'FEMALE' | 'OTHERS';
    profile_photo: string | "";
}
interface InitialState {
    userList: (UserList | null)[];
    status: 'idle' | 'loading' | 'success' | 'error';
    ou_id: number | null;
    message: string | ''
}

const initialState: InitialState = {
    userList: [],
    status: 'idle',
    ou_id: null,
    message: ''
}
interface GetUserRequest {
    accessToken: string | null
}

interface GetUserResponse {
    userList: (UserList | null)[];
    status: 'success' | 'error';
    ou_id: number | null;
    message: string | ''
}

interface GetUserAPIResponse {
    userList: (UserList | null)[];
    status: number | null;
    ou_id: number | null;
    message: string | ''
}
const GetUserListThunk = createAsyncThunk<GetUserResponse, GetUserRequest, { rejectValue: GetUserResponse }>
    (
        'get-user-list',
        async (req: GetUserRequest, { rejectWithValue }) => {
            try {
                const apiResponse: Response = await fetch('/api/user/get-user-list', {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${req.accessToken}`,
                    },
                    credentials: 'include'
                });

                const responseData: GetUserAPIResponse = await apiResponse.json();

                if (apiResponse.ok) {
                    return {
                        status: 'success',
                        userList: responseData.userList,
                        ou_id: responseData.ou_id,
                        message: responseData.message
                    }
                } else {
                    return rejectWithValue({
                        status: 'error',
                        userList: [],
                        ou_id: null,
                        message: responseData.message
                    })
                }
            } catch (err: unknown) {
                console.log(err);
                return rejectWithValue({
                    status: 'error',
                    userList: [],
                    ou_id: null,
                    message: 'Unexpected Error Occured'
                })
            }
        }
    )




const UserListSlice = createSlice({
    name: 'get-user-list',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(GetUserListThunk.fulfilled, (state, action) => {
            if (action.payload.status === 'success') {
                state.userList = action.payload.userList;
                state.message = action.payload.message;
                state.ou_id = action.payload.ou_id;
                state.status = 'success';
            } else {
                state.userList = [];
                state.message = action.payload.message;
                state.ou_id = null;
                state.status = 'error';
            }
        })
            .addCase(GetUserListThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(GetUserListThunk.rejected, (state, action) => {
                state.status = 'error';
                state.message = action.payload?.message || 'Unexpected Error';
                state.ou_id = null;
                state.userList = []
            })
    }
})


export default UserListSlice.reducer;